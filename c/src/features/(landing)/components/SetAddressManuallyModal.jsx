// src/features/(landing)/components/SetAddressManuallyModal.jsx
import React, { useState, useEffect, useRef } from "react";
import ModalPortal from "@/shared/components/ModalPortal";
import { MapPin, ChevronDown, X, Search, Loader2, CheckCircle } from "lucide-react";

// --- Reusable Searchable Dropdown ---
const AddressDropdown = ({ label, value, onChange, options, loading, disabled, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const ref = useRef(null);

    const filtered = options.filter(o =>
        o.label.toLowerCase().includes(query.toLowerCase())
    );

    useEffect(() => {
        const handleClick = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const handleSelect = (opt) => {
        onChange(opt);
        setIsOpen(false);
        setQuery("");
    };

    return (
        <div className="relative" ref={ref}>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                {label}
            </label>
            <button
                type="button"
                disabled={disabled}
                onClick={() => !disabled && setIsOpen(v => !v)}
                className={`
                    w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-200
                    ${disabled
                        ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
                        : "bg-white border-gray-200 text-gray-800 hover:border-yellow-400 cursor-pointer"
                    }
                    ${isOpen ? "border-yellow-400 ring-2 ring-yellow-100" : ""}
                `}
            >
                <span className={`truncate ${!value ? "text-gray-400" : ""}`}>
                    {value?.label || placeholder}
                </span>
                {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-yellow-500 shrink-0" />
                ) : (
                    <ChevronDown className={`w-4 h-4 shrink-0 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                )}
            </button>

            {isOpen && (
                <div className="absolute z-50 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden">
                    <div className="p-2 border-b border-gray-50">
                        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                            <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <input
                                autoFocus
                                type="text"
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                placeholder={`Search ${label.toLowerCase()}...`}
                                className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400"
                            />
                            {query && (
                                <button onClick={() => setQuery("")} type="button">
                                    <X className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="max-h-52 overflow-y-auto">
                        {filtered.length === 0 ? (
                            <div className="py-6 text-center text-sm text-gray-400">No results found</div>
                        ) : (
                            filtered.map(opt => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => handleSelect(opt)}
                                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-yellow-50 hover:text-yellow-700
                                        ${value?.value === opt.value ? "bg-yellow-50 text-yellow-700 font-semibold" : "text-gray-700"}
                                    `}
                                >
                                    {opt.label}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Main Modal ---
const SetAddressManuallyModal = ({ isOpen, onClose, onConfirm }) => {
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [barangays, setBarangays] = useState([]);

    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedBarangay, setSelectedBarangay] = useState(null);

    const [loadingProvinces, setLoadingProvinces] = useState(false);
    const [loadingCities, setLoadingCities] = useState(false);
    const [loadingBarangays, setLoadingBarangays] = useState(false);

    // Fetch provinces on open
    useEffect(() => {
        if (!isOpen) return;
        setLoadingProvinces(true);
        fetch("https://psgc.gitlab.io/api/provinces/")
            .then(r => r.json())
            .then(data => {
                const sorted = [...data].sort((a, b) => a.name.localeCompare(b.name));
                setProvinces(sorted.map(p => ({ value: p.code, label: p.name })));
            })
            .catch(() => setProvinces([]))
            .finally(() => setLoadingProvinces(false));
    }, [isOpen]);

    // Fetch cities when province changes
    useEffect(() => {
        if (!selectedProvince) return;
        setSelectedCity(null);
        setSelectedBarangay(null);
        setCities([]);
        setBarangays([]);
        setLoadingCities(true);
        fetch(`https://psgc.gitlab.io/api/provinces/${selectedProvince.value}/cities-municipalities/`)
            .then(r => r.json())
            .then(data => {
                const sorted = [...data].sort((a, b) => a.name.localeCompare(b.name));
                setCities(sorted.map(c => ({ value: c.code, label: c.name })));
            })
            .catch(() => setCities([]))
            .finally(() => setLoadingCities(false));
    }, [selectedProvince]);

    // Fetch barangays when city changes
    useEffect(() => {
        if (!selectedCity) return;
        setSelectedBarangay(null);
        setBarangays([]);
        setLoadingBarangays(true);
        fetch(`https://psgc.gitlab.io/api/cities-municipalities/${selectedCity.value}/barangays/`)
            .then(r => r.json())
            .then(data => {
                const sorted = [...data].sort((a, b) => a.name.localeCompare(b.name));
                setBarangays(sorted.map(b => ({ value: b.code, label: b.name })));
            })
            .catch(() => setBarangays([]))
            .finally(() => setLoadingBarangays(false));
    }, [selectedCity]);

    const isComplete = selectedProvince && selectedCity && selectedBarangay;

    const handleConfirm = () => {
        const fullAddress = [
            selectedBarangay?.label,
            selectedCity?.label,
            selectedProvince?.label,
            "Philippines"
        ].filter(Boolean).join(", ");

        onConfirm?.({
            province: selectedProvince,
            city: selectedCity,
            barangay: selectedBarangay,
            fullAddress
        });
        handleClose();
    };

    const handleClose = () => {
        setSelectedProvince(null);
        setSelectedCity(null);
        setSelectedBarangay(null);
        onClose();
    };

    return (
        <ModalPortal isOpen={isOpen} onClose={handleClose}>
            <div className="relative">
                {/* Header */}
                <div className="flex items-center gap-3 px-6 pt-6 pb-4 border-b border-gray-100">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-bold text-gray-800">Set Address Manually</h2>
                        <p className="text-xs text-gray-400 mt-0.5">Find properties near a specific address</p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-gray-300 hover:text-gray-500 transition-colors p-1 hover:bg-gray-100 rounded-lg shrink-0"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Fields */}
                <div className="px-6 py-5 flex flex-col gap-4">
                    <AddressDropdown
                        label="Province"
                        value={selectedProvince}
                        onChange={setSelectedProvince}
                        options={provinces}
                        loading={loadingProvinces}
                        disabled={false}
                        placeholder="Select province"
                    />
                    <AddressDropdown
                        label="Municipality / City"
                        value={selectedCity}
                        onChange={setSelectedCity}
                        options={cities}
                        loading={loadingCities}
                        disabled={!selectedProvince}
                        placeholder={selectedProvince ? "Select city or municipality" : "Select a province first"}
                    />
                    <AddressDropdown
                        label="Barangay"
                        value={selectedBarangay}
                        onChange={setSelectedBarangay}
                        options={barangays}
                        loading={loadingBarangays}
                        disabled={!selectedCity}
                        placeholder={selectedCity ? "Select barangay" : "Select a city first"}
                    />

                    {/* Address preview */}
                    {isComplete && (
                        <div className="flex items-start gap-2.5 px-4 py-3 bg-green-50 rounded-xl border border-green-100">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                            <p className="text-xs text-green-700 leading-relaxed">
                                {[selectedBarangay?.label, selectedCity?.label, selectedProvince?.label, "Philippines"]
                                    .filter(Boolean).join(", ")}
                            </p>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 px-6 pb-6">
                    <button
                        onClick={handleClose}
                        className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={!isComplete}
                        className={`flex-1 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2
                            ${isComplete
                                ? "bg-yellow-400 text-gray-900 hover:bg-yellow-500 shadow-md shadow-yellow-100"
                                : "bg-gray-100 text-gray-300 cursor-not-allowed"
                            }`}
                    >
                        <MapPin className="w-4 h-4" />
                        Set This Location
                    </button>
                </div>
            </div>
        </ModalPortal>
    );
};

export default SetAddressManuallyModal;