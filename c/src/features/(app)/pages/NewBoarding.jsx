// src/features/(app)/pages/NewBoarding.jsx
import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    HelpCircle,
    Upload,
    X,
    MapPin,
    Bed,
    Bath,
    PhilippinePeso,
    Users,
    Trash2,
    Plus,
    Image as ImageIcon,
    Navigation,
    Loader2,
    Info
} from "lucide-react";
import BreadCrumbs from "../components/BreadCrumbs";
import Instructions from "../components/Instructions";
import HelpPageModal from "@/shared/components/HelpPageModal";
import Button from "@/shared/components/Button";
import Toast from "@/shared/components/Toast";
import SetAddressManuallyModal from "@/features/(landing)/components/SetAddressManuallyModal";

import FemaleIcon from "@/assets/icons/female.svg";
import MaleIcon from "@/assets/icons/male.svg";
import MixedIcon from "@/assets/icons/mixed.svg";

const NewBoarding = () => {
    const navigate = useNavigate();
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    const [isInstructionsDrawerOpen, setIsInstructionsDrawerOpen] =
        useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [isGettingCurrentLocation, setIsGettingCurrentLocation] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        numberOfCR: "",
        selectedImage: "",
        images: [],
        boardingHouseSex: "",
        bedrooms: [
            {
                id: 1,
                name: "Bedroom #1",
                capacity: "",
                gender: ""
            }
        ],
        rules: [
            {
                id: 1,
                text: ""
            }
        ],
        pricePerMonth: "",
        // Address fields
        street: "",
        province: null,
        city: null,
        barangay: null,
        fullAddress: "",
        isIndependentCity: false,
        addressParts: {
            street: "",
            barangay: "",
            city: "",
            province: ""
        }
    });

    // Gender options
    const getBoardingHouseSexOptions = () => [
        {
            value: "male",
            label: "Male",
            icon: <img src={MaleIcon} alt="male" className="w-5 h-5" />
        },
        {
            value: "female",
            label: "Female",
            icon: <img src={FemaleIcon} alt="female" className="w-5 h-5" />
        },
        {
            value: "mixed",
            label: "Mixed",
            icon: <img src={MixedIcon} alt="mixed" className="w-5 h-5" />
        }
    ];

    // Instructions items
    const instructionItems = [
        {
            title: "Property Name",
            description:
                "Give your boarding house a descriptive name that will attract tenants."
        },
        {
            title: "Address Details",
            description:
                "Click 'Set Address' to manually enter your address or use your current location."
        },
        {
            title: "Boarding House Type",
            description:
                "Select Male, Female, or Mixed. This determines bedroom configuration."
        },
        {
            title: "Bedrooms Configuration",
            description:
                "Add each bedroom separately and specify the capacity per room."
        },
        {
            title: "House Rules",
            description: "Add important rules tenants must follow."
        },
        {
            title: "Upload Photos",
            description:
                "Add clear photos of the boarding house. Maximum 4 photos."
        },
        {
            title: "Set Price",
            description:
                "Set a competitive monthly rent price based on location and amenities."
        }
    ];

    // Handle input changes
    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle address confirmation from the modal
    const handleAddressConfirm = useCallback(addressData => {
        setFormData(prev => ({
            ...prev,
            street: addressData.street || "",
            province: addressData.province,
            city: addressData.city,
            barangay: addressData.barangay,
            fullAddress: addressData.fullAddress,
            isIndependentCity: addressData.isIndependentCity,
            addressParts: {
                street: addressData.street || "",
                barangay: addressData.barangay?.label || "",
                city: addressData.city?.label || "",
                province: addressData.province?.label || ""
            }
        }));

        Toast.success("Address set successfully!");
    }, []);

    // Get current location using browser geolocation
    const getCurrentLocation = useCallback(() => {
        if (!navigator.geolocation) {
            Toast.error(
                "Geolocation not supported",
                "Your browser doesn't support geolocation."
            );
            return;
        }

        setIsGettingCurrentLocation(true);

        navigator.geolocation.getCurrentPosition(
            async position => {
                const { latitude, longitude } = position.coords;

                try {
                    // Reverse geocode using OpenStreetMap's Nominatim API (free, no key)
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&countrycodes=PH`
                    );
                    const data = await response.json();

                    if (data && data.address) {
                        const address = data.address;

                        // Extract Philippine address components
                        const street = [
                            address.house_number,
                            address.road || address.footway || address.street
                        ]
                            .filter(Boolean)
                            .join(" ");

                        const barangay =
                            address.suburb ||
                            address.village ||
                            address.neighbourhood;
                        const city =
                            address.city ||
                            address.town ||
                            address.municipality;
                        const province = address.state || address.province;

                        // For independent cities like Manila, Cebu, etc., we need to handle specially
                        const independentCities = [
                            "Manila",
                            "Quezon City",
                            "Caloocan",
                            "Las Piñas",
                            "Makati",
                            "Malabon",
                            "Mandaluyong",
                            "Marikina",
                            "Muntinlupa",
                            "Navotas",
                            "Parañaque",
                            "Pasay",
                            "Pasig",
                            "Pateros",
                            "San Juan",
                            "Taguig",
                            "Valenzuela",
                            "Baguio",
                            "Cebu City",
                            "Lapu-Lapu City",
                            "Mandaue",
                            "Davao City",
                            "Zamboanga City",
                            "Iloilo City",
                            "Angeles City"
                        ];

                        const isIndependentCity = independentCities.some(
                            cityName =>
                                city
                                    ?.toLowerCase()
                                    .includes(cityName.toLowerCase())
                        );

                        // Create formatted address parts for the modal's expected format
                        const addressData = {
                            street: street || null,
                            province: province
                                ? { value: province, label: province }
                                : null,
                            city: city ? { value: city, label: city } : null,
                            barangay: barangay
                                ? { value: barangay, label: barangay }
                                : null,
                            isIndependentCity,
                            fullAddress: data.display_name,
                            geocodeParts: [
                                street,
                                barangay,
                                city,
                                province,
                                "Philippines"
                            ].filter(Boolean)
                        };

                        handleAddressConfirm(addressData);
                    } else {
                        Toast.error(
                            "Location not found",
                            "Could not find address for your current location."
                        );
                    }
                } catch (error) {
                    console.error("Reverse geocoding error:", error);
                    Toast.error(
                        "Geocoding failed",
                        "Could not convert location to address. Please try again or set address manually."
                    );
                } finally {
                    setIsGettingCurrentLocation(false);
                }
            },
            error => {
                setIsGettingCurrentLocation(false);
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        Toast.error(
                            "Location permission denied",
                            "Please allow location access to use this feature."
                        );
                        break;
                    case error.POSITION_UNAVAILABLE:
                        Toast.error(
                            "Location unavailable",
                            "Could not get your current location. Please try again."
                        );
                        break;
                    case error.TIMEOUT:
                        Toast.error(
                            "Location timeout",
                            "Location request timed out. Please try again."
                        );
                        break;
                    default:
                        Toast.error(
                            "Location error",
                            "Failed to get your current location."
                        );
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    }, [handleAddressConfirm]);

    // Build full address for display
    const getFullAddressDisplay = () => {
        if (formData.fullAddress) {
            return formData.fullAddress;
        }

        const parts = [];
        if (formData.addressParts.street)
            parts.push(formData.addressParts.street);
        if (formData.addressParts.barangay)
            parts.push(formData.addressParts.barangay);
        if (formData.addressParts.city) parts.push(formData.addressParts.city);
        if (formData.addressParts.province)
            parts.push(formData.addressParts.province);
        if (parts.length > 0) parts.push("Philippines");

        return parts.length > 1 ? parts.join(", ") : "No address set";
    };

    // Handle boarding house sex change
    const handleBoardingHouseSexChange = value => {
        setFormData(prev => ({
            ...prev,
            boardingHouseSex: value,
            bedrooms: prev.bedrooms.map(bedroom => ({
                ...bedroom,
                gender: value !== "mixed" ? value : ""
            }))
        }));
    };

    // Bedroom handlers
    const addBedroom = () => {
        const newId = formData.bedrooms.length + 1;
        setFormData(prev => ({
            ...prev,
            bedrooms: [
                ...prev.bedrooms,
                {
                    id: newId,
                    name: `Bedroom #${newId}`,
                    capacity: "",
                    gender:
                        formData.boardingHouseSex !== "mixed"
                            ? formData.boardingHouseSex
                            : ""
                }
            ]
        }));
    };

    const removeBedroom = id => {
        if (formData.bedrooms.length === 1) return;
        setFormData(prev => ({
            ...prev,
            bedrooms: prev.bedrooms.filter(bedroom => bedroom.id !== id)
        }));
    };

    const updateBedroom = (id, field, value) => {
        setFormData(prev => ({
            ...prev,
            bedrooms: prev.bedrooms.map(bedroom =>
                bedroom.id === id ? { ...bedroom, [field]: value } : bedroom
            )
        }));
    };

    // Rules handlers
    const addRule = () => {
        const newId = formData.rules.length + 1;
        setFormData(prev => ({
            ...prev,
            rules: [...prev.rules, { id: newId, text: "" }]
        }));
    };

    const removeRule = id => {
        setFormData(prev => ({
            ...prev,
            rules: prev.rules.filter(rule => rule.id !== id)
        }));
    };

    const updateRule = (id, text) => {
        setFormData(prev => ({
            ...prev,
            rules: prev.rules.map(rule =>
                rule.id === id ? { ...rule, text } : rule
            )
        }));
    };

    // Handle image upload
    const handleImageUpload = e => {
        const files = Array.from(e.target.files);

        if (formData.images.length + files.length > 4) {
            Toast.warning(
                "Maximum Photos Reached",
                "You can only upload up to 4 photos."
            );
            return;
        }

        const newImages = files.map(file => ({
            file,
            preview: URL.createObjectURL(file),
            id: Date.now() + Math.random()
        }));

        setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...newImages]
        }));

        if (!formData.selectedImage && newImages.length > 0) {
            setFormData(prev => ({
                ...prev,
                selectedImage: newImages[0].preview
            }));
        }

        Toast.success(
            "Photos Added",
            `${newImages.length} photo(s) uploaded successfully.`
        );
    };

    // Remove image
    const removeImage = imageId => {
        const imageToRemove = formData.images.find(img => img.id === imageId);
        if (imageToRemove) {
            URL.revokeObjectURL(imageToRemove.preview);
        }

        const newImages = formData.images.filter(img => img.id !== imageId);
        setFormData(prev => ({
            ...prev,
            images: newImages
        }));

        if (formData.selectedImage === imageToRemove?.preview) {
            setFormData(prev => ({
                ...prev,
                selectedImage: newImages.length > 0 ? newImages[0].preview : ""
            }));
        }
    };

    // Set selected image
    const setSelectedImage = imagePreview => {
        setFormData(prev => ({ ...prev, selectedImage: imagePreview }));
        Toast.info(
            "Cover Photo Changed",
            "This will be displayed as the cover image."
        );
    };

    // Thumbnail images
    const thumbnailImages = formData.images.filter(
        img => img.preview !== formData.selectedImage
    );

    const hasAddressSet =
        formData.fullAddress || formData.addressParts.province;

    // Handle form submission
    const handleSubmit = async e => {
        e.preventDefault();

        // Basic validation
        if (!formData.name) {
            Toast.error("Missing Information", "Please enter a property name.");
            return;
        }

        if (!hasAddressSet) {
            Toast.error(
                "Missing Information",
                "Please set an address for your property."
            );
            return;
        }

        setIsSubmitting(true);

        const totalCapacity = formData.bedrooms.reduce(
            (sum, bedroom) => sum + (parseInt(bedroom.capacity) || 0),
            0
        );

        const submitData = {
            ...formData,
            totalCapacity,
            numberOfBedrooms: formData.bedrooms.length,
            street: formData.street || formData.addressParts.street,
            province: formData.province || (formData.addressParts.province
                ? { value: formData.addressParts.province, label: formData.addressParts.province }
                : null),
            city: formData.city || (formData.addressParts.city
                ? { value: formData.addressParts.city, label: formData.addressParts.city }
                : null),
            barangay: formData.barangay || (formData.addressParts.barangay
                ? { value: formData.addressParts.barangay, label: formData.addressParts.barangay }
                : null),
        };

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log("Form submitted:", submitData);

            Toast.success(
                "Boarding House Created!",
                `${formData.name || "New Boarding House"} has been successfully listed.`
            );

            setTimeout(() => {
                navigate("/my-properties");
            }, 1500);
        } catch (error) {
            console.error("Error submitting form:", error);
            Toast.error(
                "Submission Failed",
                "There was an error creating your boarding house. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    // Help modal features
    const helpFeatures = [
        {
            title: "Adding a New Boarding House",
            description: "Follow the form to add your boarding house listing.",
            icon: "Building2"
        },
        {
            title: "Boarding House Type",
            description: "Select Male, Female, or Mixed.",
            icon: "Users"
        },
        {
            title: "Uploading Photos",
            description:
                "You can upload up to 4 photos. Click any photo to change the cover.",
            icon: "ImageIcon"
        },
        {
            title: "Bedroom Configuration",
            description: "Add multiple bedrooms with individual capacities.",
            icon: "Bed"
        },
        {
            title: "House Rules",
            description: "Add important rules tenants must follow.",
            icon: "FileText"
        },
        {
            title: "Pricing Your Boarding House",
            description: "Set a competitive monthly rent.",
            icon: "PhilippinePeso"
        }
    ];

    // Get card style based on type and selection
    const getCardStyle = (optionValue, isSelected) => {
        if (!isSelected) {
            return "border-gray-200 bg-white hover:border-gray-300";
        }

        if (optionValue === "male") {
            return "border-blue-500 bg-blue-50 ring-2 ring-blue-500/20";
        }

        if (optionValue === "female") {
            return "border-pink-500 bg-pink-50 ring-2 ring-pink-500/20";
        }

        return "border-gray-500 bg-gray-100 ring-2 ring-gray-500/20";
    };

    return (
        <div className="p-4 md:p-6 bg-neutral-50 min-h-screen">
            {/* Address Modal */}
            <SetAddressManuallyModal
                isOpen={isAddressModalOpen}
                onClose={() => setIsAddressModalOpen(false)}
                onConfirm={handleAddressConfirm}
            />

            {/* Breadcrumbs */}
            <div className="mb-4">
                <BreadCrumbs
                    items={[
                        { label: "My Properties", path: "/my-properties" },
                        { label: "New Boarding", path: "/new-boarding" }
                    ]}
                />
            </div>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsHelpModalOpen(true)}
                        className="sm:hidden text-gray-500 bg-transparent hover:bg-gray-100 rounded-lg transition-colors p-2"
                    >
                        <HelpCircle size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                            New Boarding House
                        </h1>
                        <p className="text-gray-600 mt-1">
                            List a new boarding house property for rent.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsHelpModalOpen(true)}
                        className="hidden sm:flex px-3 py-2 text-gray-500 bg-transparent hover:bg-gray-100 rounded-lg transition-colors items-center gap-2"
                    >
                        <HelpCircle size={20} />
                        <span className="font-medium">Help</span>
                    </button>
                </div>
            </div>

            {/* Form and Instructions Layout */}
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Form Section */}
                <div className="flex-1">
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white rounded-xl border border-gray-200 p-4 md:p-6"
                    >
                        <h2 className="text-lg font-semibold text-gray-800 mb-6">
                            Boarding House Information
                        </h2>

                        {/* Image Upload Section */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Property Photos
                            </label>

                            {formData.images.length > 0 ? (
                                <div className="flex gap-4">
                                    {/* Cover Image */}
                                    <div className="w-3/4">
                                        <div className="relative rounded-lg overflow-hidden bg-gray-100 aspect-square">
                                            {formData.selectedImage ? (
                                                <img
                                                    src={formData.selectedImage}
                                                    alt="Cover photo"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                                    <ImageIcon className="w-12 h-12 text-gray-400" />
                                                </div>
                                            )}
                                            <div className="absolute bottom-0 left-0 right-0 bg-gray-800/70 backdrop-blur-sm py-2 text-center">
                                                <span className="text-white text-xs font-bold">
                                                    Cover Image
                                                </span>
                                                <span className="text-white text-xs font-medium block">
                                                    Click any thumbnail to
                                                    change
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Thumbnails */}
                                    <div className="w-1/4">
                                        <div className="flex flex-col gap-1 h-full">
                                            {thumbnailImages.map(image => (
                                                <div
                                                    key={image.id}
                                                    className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                                                        formData.selectedImage ===
                                                        image.preview
                                                            ? "border-primary ring-2 ring-primary/20"
                                                            : "border-gray-200 hover:border-gray-300"
                                                    }`}
                                                    onClick={() =>
                                                        setSelectedImage(
                                                            image.preview
                                                        )
                                                    }
                                                >
                                                    <img
                                                        src={image.preview}
                                                        alt="Property thumbnail"
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={e => {
                                                            e.stopPropagation();
                                                            removeImage(
                                                                image.id
                                                            );
                                                        }}
                                                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                            {thumbnailImages.length === 0 && (
                                                <div className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                                                    <span className="text-xs text-gray-400 text-center px-2">
                                                        Click to add
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-500">
                                        No images uploaded yet
                                    </p>
                                </div>
                            )}

                            {/* Upload Button */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-4">
                                <label className="cursor-pointer">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        disabled={formData.images.length >= 4}
                                    />
                                    <div
                                        className={`px-4 py-2 border-2 border-dashed rounded-lg transition-colors flex items-center gap-2 ${
                                            formData.images.length >= 4
                                                ? "border-gray-200 text-gray-400 cursor-not-allowed"
                                                : "border-gray-300 hover:border-primary text-gray-600 hover:text-primary cursor-pointer"
                                        }`}
                                    >
                                        <Upload className="w-4 h-4" />
                                        <span className="text-sm">
                                            {formData.images.length >= 4
                                                ? "Maximum 4 images reached"
                                                : "Upload Photos"}
                                        </span>
                                        {formData.images.length < 4 && (
                                            <Plus className="w-3 h-3" />
                                        )}
                                    </div>
                                </label>
                                <span className="text-xs text-gray-500">
                                    {formData.images.length}/4 image(s) uploaded
                                </span>
                            </div>
                        </div>

                        {/* Property Name */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Property Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g., Sunrise Boarding House"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>

                        {/* Address Section */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Property Address
                            </label>

                            {/* Address Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                                <button
                                    type="button"
                                    onClick={() => setIsAddressModalOpen(true)}
                                    className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors flex items-center justify-center gap-2 text-gray-700 hover:text-primary"
                                >
                                    <MapPin className="w-4 h-4" />
                                    <span className="font-medium">
                                        Set Address Manually
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    onClick={getCurrentLocation}
                                    disabled={isGettingCurrentLocation}
                                    className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors flex items-center justify-center gap-2 text-gray-700 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isGettingCurrentLocation ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span className="font-medium">
                                                Getting Location...
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <Navigation className="w-4 h-4" />
                                            <span className="font-medium">
                                                Use Current Location
                                            </span>
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Address Display */}
                            {hasAddressSet ? (
                                <div className="mt-3 p-4 bg-green-50 rounded-lg border border-green-200">
                                    <div className="flex items-start gap-2">
                                        <MapPin className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                        <div className="flex-1">
                                            <p className="text-xs font-medium text-green-700 mb-1">
                                                Selected Address:
                                            </p>
                                            <p className="text-sm text-green-800">
                                                {getFullAddressDisplay()}
                                            </p>
                                            {formData.street && (
                                                <p className="text-xs text-green-600 mt-2">
                                                    <span className="font-medium">
                                                        Street:
                                                    </span>{" "}
                                                    {formData.street}
                                                </p>
                                            )}
                                            {formData.addressParts.barangay && (
                                                <p className="text-xs text-green-600 mt-1">
                                                    <span className="font-medium">
                                                        Barangay:
                                                    </span>{" "}
                                                    {
                                                        formData.addressParts
                                                            .barangay
                                                    }
                                                </p>
                                            )}
                                            {formData.addressParts.city && (
                                                <p className="text-xs text-green-600 mt-1">
                                                    <span className="font-medium">
                                                        City:
                                                    </span>{" "}
                                                    {formData.addressParts.city}
                                                </p>
                                            )}
                                            {formData.addressParts.province && (
                                                <p className="text-xs text-green-600 mt-1">
                                                    <span className="font-medium">
                                                        Province:
                                                    </span>{" "}
                                                    {
                                                        formData.addressParts
                                                            .province
                                                    }
                                                </p>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setIsAddressModalOpen(true)
                                            }
                                            className="text-xs text-green-600 hover:text-green-700 underline"
                                        >
                                            Change
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-3">
                                    <p className="text-sm text-gray-800 flex items-center gap-2">
                                        <Info className="w-4 h-4 text-gray-800" />
                                        No address set yet. Click one of the
                                        buttons above to add your property's
                                        address.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Number of CR */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <Bath className="w-3.5 h-3.5 inline mr-1" />
                                CR / Bathroom
                            </label>
                            <input
                                type="number"
                                name="numberOfCR"
                                value={formData.numberOfCR}
                                onChange={handleChange}
                                min="1"
                                placeholder="Number of CR/bathrooms"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>

                        {/* Boarding House Type - Updated */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Boarding House Type
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {getBoardingHouseSexOptions().map(option => {
                                    const isSelected =
                                        formData.boardingHouseSex ===
                                        option.value;

                                    return (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() =>
                                                handleBoardingHouseSexChange(
                                                    option.value
                                                )
                                            }
                                            className={`
                                        relative flex items-center justify-center gap-2 p-4 
                                        rounded-lg transition-all duration-200 border-2
                                        whitespace-nowrap
                                        ${getCardStyle(option.value, isSelected)}
                                    `}
                                            style={{
                                                background:
                                                    option.value === "mixed" &&
                                                    isSelected
                                                        ? "linear-gradient(to bottom right, #eff6ff, #fce7f7)"
                                                        : undefined
                                            }}
                                        >
                                            {/* Mixed gradient border overlay - top and left blue, right and bottom pink */}
                                            {option.value === "mixed" &&
                                                isSelected && (
                                                    <>
                                                        <div className="absolute inset-0 rounded-lg -z-10" 
                                                             style={{
                                                                 background: "linear-gradient(135deg, #3b82f6 0%, #3b82f6 50%, #ec4899 50%, #ec4899 100%)",
                                                                 padding: "2px",
                                                                 mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                                                                 WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                                                                 WebkitMaskComposite: "xor",
                                                                 maskComposite: "exclude"
                                                             }}
                                                        />
                                                        {/* Individual border approach for better browser support */}
                                                        <div className="absolute inset-0 rounded-lg pointer-events-none"
                                                             style={{
                                                                 borderTop: "2px solid #3b82f6",
                                                                 borderLeft: "2px solid #3b82f6",
                                                                 borderRight: "2px solid #ec4899",
                                                                 borderBottom: "2px solid #ec4899",
                                                                 borderRadius: "0.5rem"
                                                             }}
                                                        />
                                                    </>
                                                )}

                                            <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                                                {option.icon}
                                            </div>
                                            <span
                                                className={`text-sm font-medium flex-shrink-0 ${
                                                    isSelected
                                                        ? option.value ===
                                                          "male"
                                                            ? "text-blue-700"
                                                            : option.value ===
                                                                "female"
                                                              ? "text-pink-700"
                                                              : "text-gray-800"
                                                        : "text-gray-700"
                                                }`}
                                            >
                                                {option.label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                            <p className="text-xs text-gray-400 mt-2">
                                Select your boarding house type
                            </p>
                        </div>

                        {/* Bedrooms Section */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-3">
                                <label className="block text-sm font-medium text-gray-700">
                                    Bedrooms Configuration
                                </label>
                                <button
                                    type="button"
                                    onClick={addBedroom}
                                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Bedroom
                                </button>
                            </div>

                            <div className="space-y-4">
                                {formData.bedrooms.map(bedroom => (
                                    <div
                                        key={bedroom.id}
                                        className="border border-gray-200 rounded-lg p-4 bg-gray-50/50"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="font-medium text-gray-800">
                                                {bedroom.name}
                                            </h3>
                                            {formData.bedrooms.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeBedroom(
                                                            bedroom.id
                                                        )
                                                    }
                                                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>

                                        <div
                                            className={`grid ${formData.boardingHouseSex === "mixed" ? "grid-cols-2" : "grid-cols-1"} gap-4`}
                                        >
                                            {/* Room Capacity */}
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                                    Room Capacity (people)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={bedroom.capacity}
                                                    onChange={e =>
                                                        updateBedroom(
                                                            bedroom.id,
                                                            "capacity",
                                                            e.target.value
                                                        )
                                                    }
                                                    min="1"
                                                    placeholder="e.g., 4"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                />
                                            </div>

                                            {/* Gender Select - only for mixed */}
                                            {formData.boardingHouseSex ===
                                                "mixed" && (
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                                        Exclusive For
                                                    </label>
                                                    <div className="flex gap-3">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                updateBedroom(
                                                                    bedroom.id,
                                                                    "gender",
                                                                    "male"
                                                                )
                                                            }
                                                            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 border rounded-lg transition-colors ${
                                                                bedroom.gender ===
                                                                "male"
                                                                    ? "border-blue-500 bg-blue-50 text-blue-700"
                                                                    : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                                                            }`}
                                                        >
                                                            <img
                                                                src={MaleIcon}
                                                                alt="male"
                                                                className="w-4 h-4"
                                                            />
                                                            <span className="text-sm font-medium">
                                                                Male
                                                            </span>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                updateBedroom(
                                                                    bedroom.id,
                                                                    "gender",
                                                                    "female"
                                                                )
                                                            }
                                                            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 border rounded-lg transition-colors ${
                                                                bedroom.gender ===
                                                                "female"
                                                                    ? "border-pink-500 bg-pink-50 text-pink-700"
                                                                    : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                                                            }`}
                                                        >
                                                            <img
                                                                src={FemaleIcon}
                                                                alt="female"
                                                                className="w-4 h-4"
                                                            />
                                                            <span className="text-sm font-medium">
                                                                Female
                                                            </span>
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Gender badge for non-mixed */}
                                        {formData.boardingHouseSex !==
                                            "mixed" &&
                                            formData.boardingHouseSex && (
                                                <div className="mt-3 pt-2 border-t border-gray-200">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-gray-500">
                                                            This room is for:
                                                        </span>
                                                        <span
                                                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                                                                formData.boardingHouseSex ===
                                                                "male"
                                                                    ? "bg-blue-100 text-blue-700"
                                                                    : "bg-pink-100 text-pink-700"
                                                            }`}
                                                        >
                                                            {formData.boardingHouseSex ===
                                                            "male" ? (
                                                                <img
                                                                    src={
                                                                        MaleIcon
                                                                    }
                                                                    alt="male"
                                                                    className="w-3 h-3"
                                                                />
                                                            ) : (
                                                                <img
                                                                    src={
                                                                        FemaleIcon
                                                                    }
                                                                    alt="female"
                                                                    className="w-3 h-3"
                                                                />
                                                            )}
                                                            {formData.boardingHouseSex ===
                                                            "male"
                                                                ? "Male"
                                                                : "Female"}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* House Rules */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-3">
                                <label className="block text-sm font-medium text-gray-700">
                                    House Rules
                                </label>
                                <button
                                    type="button"
                                    onClick={addRule}
                                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Rule
                                </button>
                            </div>

                            <div className="space-y-3">
                                {formData.rules.map(rule => (
                                    <div
                                        key={rule.id}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="flex-1 relative">
                                            <input
                                                type="text"
                                                value={rule.text}
                                                onChange={e =>
                                                    updateRule(
                                                        rule.id,
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="e.g., No curfew, Quiet hours 10PM-6AM, No visitors after 8PM"
                                                className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                            />
                                            {rule.text && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeRule(rule.id)
                                                    }
                                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-gray-400 mt-2">
                                Add important rules tenants must follow
                            </p>
                        </div>

                        {/* Price */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <PhilippinePeso className="w-3.5 h-3.5 inline mr-1" />
                                Rent Price (per month)
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                                    ₱
                                </span>
                                <input
                                    type="number"
                                    name="pricePerMonth"
                                    value={formData.pricePerMonth}
                                    onChange={handleChange}
                                    min="1000"
                                    step="500"
                                    placeholder="0"
                                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                                Set a competitive monthly rental price
                            </p>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-gray-100">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => navigate("/my-properties")}
                                className="w-full sm:flex-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={isSubmitting || !hasAddressSet}
                                icon={Plus}
                                className="w-full sm:flex-1"
                            >
                                {isSubmitting
                                    ? "Creating..."
                                    : "Create Boarding"}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Instructions - Desktop */}
                <div className="hidden lg:block lg:w-80 flex-shrink-0">
                    <Instructions
                        title="How to List a Boarding House"
                        items={instructionItems}
                    />
                </div>
            </div>

            {/* Floating Help Button - Mobile */}
            <div className="lg:hidden fixed bottom-6 right-6 z-40">
                <button
                    onClick={() => setIsInstructionsDrawerOpen(true)}
                    className="bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary/90 transition-all hover:scale-105"
                >
                    <HelpCircle className="w-6 h-6" />
                </button>
            </div>

            {/* Instructions Drawer - Mobile */}
            {isInstructionsDrawerOpen && (
                <>
                    <div
                        className="lg:hidden fixed inset-0 bg-black/50 z-50"
                        onClick={() => setIsInstructionsDrawerOpen(false)}
                    />
                    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-xl z-50 animate-in slide-in-from-bottom duration-300 max-h-[80vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                            <button
                                onClick={() =>
                                    setIsInstructionsDrawerOpen(false)
                                }
                                className="p-1 hover:bg-gray-100 rounded-lg"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <div className="p-4">
                            <Instructions
                                title="How to List a Boarding House"
                                items={instructionItems}
                            />
                        </div>
                    </div>
                </>
            )}

            {/* Help Modal */}
            <HelpPageModal
                isOpen={isHelpModalOpen}
                onClose={() => setIsHelpModalOpen(false)}
                icon={HelpCircle}
                title="New Boarding House Help"
                description="Learn how to add a new boarding house listing."
                features={helpFeatures}
            />
        </div>
    );
};

export default NewBoarding;