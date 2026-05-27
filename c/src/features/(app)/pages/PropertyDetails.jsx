// src/features/(app)/pages/PropertyDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ChevronLeft,
    ChevronRight,
    Bed,
    Home,
    MapPin,
    PhilippinePeso,
    Users,
    Bath,
    ShieldCheck,
    Edit,
    Trash2,
    ChevronDown,
    CheckCircle,
    XCircle,
    AlertCircle,
    UserCheck
} from "lucide-react";
import BreadCrumbs from "../components/BreadCrumbs";
import Badge from "@/shared/components/Badge";
import Select from "@/shared/components/Select";
import { propertiesWithId } from "./MyProperties";

// ── Image Carousel ────────────────────────────────────────────────
const ImageCarousel = ({ images = [], name }) => {
    const [current, setCurrent] = useState(0);

    const prev = () =>
        setCurrent(i => (i === 0 ? images.length - 1 : i - 1));
    const next = () =>
        setCurrent(i => (i === images.length - 1 ? 0 : i + 1));

    if (!images.length) return null;

    return (
        <div className="relative w-full rounded-2xl overflow-hidden bg-gray-100 select-none">
            {/* Main image */}
            <div className="relative h-72 md:h-96">
                {images.map((src, idx) => (
                    <img
                        key={idx}
                        src={src}
                        alt={`${name} - photo ${idx + 1}`}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                            idx === current ? "opacity-100" : "opacity-0"
                        }`}
                    />
                ))}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Arrows */}
                <button
                    onClick={prev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow transition-all"
                >
                    <ChevronLeft size={18} />
                </button>
                <button
                    onClick={next}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow transition-all"
                >
                    <ChevronRight size={18} />
                </button>

                {/* Counter pill */}
                <span className="absolute bottom-3 right-4 bg-black/50 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                    {current + 1} / {images.length}
                </span>
            </div>

            {/* Thumbnail strip */}
            <div className="flex gap-2 p-3 bg-white border-t border-gray-100">
                {images.map((src, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrent(idx)}
                        className={`flex-1 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                            idx === current
                                ? "border-yellow-400 shadow-md"
                                : "border-transparent opacity-60 hover:opacity-90"
                        }`}
                    >
                        <img
                            src={src}
                            alt={`thumb ${idx + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
};

// ── Info Row ──────────────────────────────────────────────────────
const InfoRow = ({ icon: Icon, label, value, valueClassName = "" }) => (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
        <div className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Icon size={15} className="text-yellow-600" />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                {label}
            </p>
            <p className={`text-sm font-semibold text-gray-800 mt-0.5 ${valueClassName}`}>
                {value}
            </p>
        </div>
    </div>
);

// ── Section Card ──────────────────────────────────────────────────
const SectionCard = ({ title, children }) => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>
        </div>
        <div className="px-5 py-2">{children}</div>
    </div>
);

// ── Main Page ─────────────────────────────────────────────────────
const PropertyDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [optionsValue, setOptionsValue] = useState(null);

    const property = propertiesWithId.find(p => String(p.id) === String(id));

    useEffect(() => {
        if (!property) navigate("/my-properties");
    }, [property, navigate]);

    if (!property) return null;

    const isBoarding = property.category === "boarding";

    // Status badge
    const getStatusBadge = () => {
        if (!isBoarding) {
            if (property.status === "rented")
                return <Badge variant="soft" color="red" icon={XCircle}>Rented</Badge>;
            return <Badge variant="soft" color="green" icon={CheckCircle}>Available</Badge>;
        }
        const isFull = property.currentTenants === property.capacity;
        if (isFull)
            return <Badge variant="soft" color="red" icon={XCircle}>Full</Badge>;
        if (property.currentTenants > 0)
            return <Badge variant="soft" color="orange" icon={Users}>{property.currentTenants}/{property.capacity} tenants</Badge>;
        return <Badge variant="soft" color="green" icon={CheckCircle}>Vacant</Badge>;
    };

    const sexLabel = sex => {
        if (!sex) return "—";
        return sex.charAt(0).toUpperCase() + sex.slice(1);
    };

    const optionsItems = [
        {
            value: "edit",
            label: "Edit Property",
            icon: <Edit className="w-3 h-3" />,
            className: "text-gray-800"
        },
        {
            value: "remove",
            label: "Remove Property",
            icon: <Trash2 className="w-3 h-3" />,
            className: "text-red-600",
            separator: true
        }
    ];

    const handleOptions = value => {
        if (value === "edit") {
            console.log("Edit property:", property);
        } else if (value === "remove") {
            console.log("Remove property:", property);
        }
        setOptionsValue(null);
    };

    return (
        <div className="p-4 md:p-6 bg-neutral-50 min-h-screen">
            {/* Breadcrumbs */}
            <BreadCrumbs
                crumbs={[
                    { label: "My Properties", path: "/my-properties" },
                    { label: property.name }
                ]}
            />

            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 mb-6">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-2.5">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight">
                            {property.name}
                        </h1>
                        <Badge variant="outline" color="gray" size="sm">
                            {property.propertyId}
                        </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge
                            variant="outline"
                            color={isBoarding ? "blue" : "red"}
                            icon={isBoarding ? Bed : Home}
                            size="sm"
                        >
                            {isBoarding ? "Boarding House" : "Apartment"}
                        </Badge>
                        {getStatusBadge()}
                    </div>
                </div>

                {/* Options dropdown */}
                <div className="w-44 flex-shrink-0">
                    <Select
                        options={optionsItems}
                        value={optionsValue}
                        onChange={value => {
                            setOptionsValue(value);
                            handleOptions(value);
                        }}
                        placeholder="Options"
                        variant="primary"
                        isSearchable={false}
                        isClearable={false}
                        icon={<ChevronDown className="w-4 h-4" />}
                        size="lg"
                    />
                </div>
            </div>

            {/* Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                {/* Left — carousel + rules */}
                <div className="lg:col-span-3 flex flex-col gap-5">
                    {/* Carousel */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-100">
                            <h3 className="font-semibold text-gray-800 text-sm">
                                Photos
                            </h3>
                        </div>
                        <div className="p-4">
                            <ImageCarousel
                                images={property.images}
                                name={property.name}
                            />
                        </div>
                    </div>

                    {/* Rules */}
                    <SectionCard title="House Rules">
                        {property.rules && property.rules.length > 0 ? (
                            <ul className="divide-y divide-gray-50 py-1">
                                {property.rules.map((rule, idx) => (
                                    <li
                                        key={rule.id}
                                        className="flex items-start gap-3 py-2.5"
                                    >
                                        <span className="w-5 h-5 rounded-full bg-yellow-100 text-yellow-700 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                                            {idx + 1}
                                        </span>
                                        <p className="text-sm text-gray-700 leading-relaxed">
                                            {rule.text}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-400 py-3">
                                No rules specified.
                            </p>
                        )}
                    </SectionCard>
                </div>

                {/* Right — property info */}
                <div className="lg:col-span-2 flex flex-col gap-5">
                    {/* General info */}
                    <SectionCard title="Property Information">
                        <InfoRow
                            icon={MapPin}
                            label="Address"
                            value={property.address}
                        />
                        <InfoRow
                            icon={PhilippinePeso}
                            label="Rent / Month"
                            value={`₱${property.price.toLocaleString()}`}
                        />
                        <InfoRow
                            icon={Bath}
                            label="Comfort Rooms"
                            value={property.numberOfCR ?? "—"}
                        />
                        <InfoRow
                            icon={isBoarding ? Bed : Home}
                            label="Property Type"
                            value={isBoarding ? "Boarding House" : "Apartment"}
                        />
                        {isBoarding && (
                            <>
                                <InfoRow
                                    icon={UserCheck}
                                    label="Accepted Gender"
                                    value={sexLabel(property.sex)}
                                />
                                <InfoRow
                                    icon={Users}
                                    label="Occupancy"
                                    value={`${property.currentTenants} / ${property.capacity} tenants`}
                                />
                            </>
                        )}
                    </SectionCard>

                    {/* Bedrooms — boarding only */}
                    {isBoarding && property.bedrooms?.length > 0 && (
                        <SectionCard title="Bedrooms">
                            <div className="py-1 space-y-2">
                                {property.bedrooms.map(bedroom => (
                                    <div
                                        key={bedroom.id}
                                        className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Bed
                                                size={14}
                                                className="text-gray-400"
                                            />
                                            <span className="text-sm font-medium text-gray-700">
                                                {bedroom.name}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                variant="soft"
                                                color={
                                                    bedroom.gender === "male"
                                                        ? "blue"
                                                        : bedroom.gender ===
                                                          "female"
                                                        ? "pink"
                                                        : "gray"
                                                }
                                                size="xs"
                                            >
                                                {bedroom.gender
                                                    ? sexLabel(bedroom.gender)
                                                    : "Any"}
                                            </Badge>
                                            <Badge
                                                variant="soft"
                                                color="gray"
                                                size="xs"
                                                icon={Users}
                                            >
                                                {bedroom.capacity}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </SectionCard>
                    )}

                    {/* Created date */}
                    <div className="bg-gray-100 rounded-2xl px-5 py-4">
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                            Date Listed
                        </p>
                        <p className="text-sm font-semibold text-gray-700 mt-1">
                            {new Date(property.createdAt).toLocaleDateString(
                                "en-PH",
                                {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric"
                                }
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyDetails;