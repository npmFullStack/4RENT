// src/features/(app)/pages/NewApartment.jsx
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
    Building2,
    Trash2,
    Plus,
    Image as ImageIcon,
    ChevronUp
} from "lucide-react";
import BreadCrumbs from "../components/BreadCrumbs";
import Instructions from "../components/Instructions";
import HelpPageModal from "@/shared/components/HelpPageModal";
import Button from "@/shared/components/Button";
import Badge from "@/shared/components/Badge";

const NewApartment = () => {
    const navigate = useNavigate();
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    const [isInstructionsDrawerOpen, setIsInstructionsDrawerOpen] =
        useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        numberOfBedrooms: "",
        numberOfCR: "",
        pricePerMonth: "",
        selectedImage: "",
        images: []
    });

    const [errors, setErrors] = useState({});

    // Instructions items for the tutorial
    const instructionItems = [
        {
            title: "Property Name",
            description:
                "Give your apartment a descriptive name that will attract tenants. Example: 'Sunset Tower Luxury Apartment'"
        },
        {
            title: "Address Details",
            description:
                "Provide the complete address including street, barangay, city, and province for accurate location."
        },
        {
            title: "Apartment Features",
            description:
                "Specify the number of bedrooms and bathrooms/CR to help tenants find what they need."
        },
        {
            title: "Upload Photos",
            description:
                "Add clear photos of the apartment including living area, kitchen, bedrooms, and bathroom. Maximum 4 photos."
        },
        {
            title: "Set Price",
            description:
                "Set a competitive monthly rent price based on location and amenities offered."
        }
    ];

    // Handle input changes
    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    // Handle image upload
    const handleImageUpload = e => {
        const files = Array.from(e.target.files);

        // Check if adding these files would exceed maximum of 4
        if (formData.images.length + files.length > 4) {
            setErrors(prev => ({
                ...prev,
                images: "Maximum 4 images allowed"
            }));
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

        // If no selected image and this is the first image, set it as selected
        if (!formData.selectedImage && newImages.length > 0) {
            setFormData(prev => ({
                ...prev,
                selectedImage: newImages[0].preview
            }));
        }

        // Clear image error if any
        if (errors.images) {
            setErrors(prev => ({ ...prev, images: "" }));
        }
    };

    // Remove an image
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

        // If the removed image was selected, select the first remaining image or clear
        if (formData.selectedImage === imageToRemove?.preview) {
            setFormData(prev => ({
                ...prev,
                selectedImage: newImages.length > 0 ? newImages[0].preview : ""
            }));
        }
    };

    // Set selected image for display
    const setSelectedImage = imagePreview => {
        setFormData(prev => ({ ...prev, selectedImage: imagePreview }));
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Property name is required";
        }

        if (!formData.address.trim()) {
            newErrors.address = "Address is required";
        }

        if (!formData.numberOfBedrooms) {
            newErrors.numberOfBedrooms = "Number of bedrooms is required";
        } else if (formData.numberOfBedrooms < 1) {
            newErrors.numberOfBedrooms = "Must have at least 1 bedroom";
        }

        if (!formData.numberOfCR) {
            newErrors.numberOfCR = "Number of CR/bathrooms is required";
        } else if (formData.numberOfCR < 1) {
            newErrors.numberOfCR = "Must have at least 1 CR/bathroom";
        }

        if (!formData.pricePerMonth) {
            newErrors.pricePerMonth = "Monthly rent price is required";
        } else if (formData.pricePerMonth < 1000) {
            newErrors.pricePerMonth = "Price must be at least ₱1,000";
        }

        if (formData.images.length === 0) {
            newErrors.images = "At least one image is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async e => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log("Form submitted:", formData);
            navigate("/my-properties");
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Help modal features
    const helpFeatures = [
        {
            title: "Adding a New Apartment",
            description:
                "Follow the form to add your apartment listing. All fields marked with an asterisk (*) are required.",
            icon: "Building2"
        },
        {
            title: "Uploading Photos",
            description:
                "You can upload up to 4 photos of your apartment. The first photo will be the cover image. Click on any photo to change the cover.",
            icon: "ImageIcon"
        },
        {
            title: "Property Details",
            description:
                "Provide accurate details about bedrooms, bathrooms, and location to help tenants find your property.",
            icon: "Home"
        },
        {
            title: "Pricing Your Apartment",
            description:
                "Set a competitive monthly rent based on your apartment's features and location.",
            icon: "PhilippinePeso"
        }
    ];

    // Get thumbnail images (exclude the selected cover image)
    const thumbnailImages = formData.images.filter(
        img => img.preview !== formData.selectedImage
    );

    return (
        <div className="p-4 md:p-6 bg-neutral-50 min-h-screen">
            {/* Breadcrumbs */}
            <div className="mb-4">
                <BreadCrumbs />
            </div>

            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsHelpModalOpen(true)}
                        className="sm:hidden text-gray-500 bg-transparent hover:bg-gray-100 rounded-lg transition-colors p-2"
                        aria-label="Help"
                    >
                        <HelpCircle size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                            New Apartment
                        </h1>
                        <p className="text-gray-600 mt-1">
                            List a new apartment property for rent.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Help Button (Desktop) */}
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
                {/* Form Section - Left */}
                <div className="flex-1">
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white rounded-xl border border-gray-200 p-4 md:p-6"
                    >
                        <h2 className="text-lg font-semibold text-gray-800 mb-6">
                            Apartment Information
                        </h2>

                        {/* Image Upload Section - Cover 75% / Thumbnails 25% layout */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Property Photos{" "}
                                <span className="text-red-500">*</span>
                            </label>

                            {formData.images.length > 0 ? (
                                <div className="flex gap-4">
                                    {/* Cover Image - 75% width */}
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
                                                    change the cover photo
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Thumbnail Gallery - 25% width, vertical stack */}
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
                                            {/* Show placeholder for empty slots if less than 4 thumbnails */}
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
                                        disabled={formData.images.length >= 5}
                                    />
                                    <div
                                        className={`px-4 py-2 border-2 border-dashed rounded-lg transition-colors flex items-center gap-2 ${
                                            formData.images.length >= 5
                                                ? "border-gray-200 text-gray-400 cursor-not-allowed"
                                                : "border-gray-300 hover:border-primary text-gray-600 hover:text-primary cursor-pointer"
                                        }`}
                                    >
                                        <Upload className="w-4 h-4" />
                                        <span className="text-sm">
                                            {formData.images.length >= 5
                                                ? "Maximum 5 images reached"
                                                : "Upload Photos"}
                                        </span>
                                        {formData.images.length < 5 && (
                                            <Plus className="w-3 h-3" />
                                        )}
                                    </div>
                                </label>
                                <span className="text-xs text-gray-500">
                                    {formData.images.length}/5 image(s) uploaded
                                </span>
                            </div>
                            {errors.images && (
                                <p className="text-xs text-red-500 mt-1">
                                    {errors.images}
                                </p>
                            )}
                        </div>

                        {/* Property Name */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Property Name{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g., Metro Central Tower"
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                                    errors.name
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                            />
                            {errors.name && (
                                <p className="text-xs text-red-500 mt-1">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Address */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Address <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Street, Barangay, City, Province"
                                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                                        errors.address
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                />
                            </div>
                            {errors.address && (
                                <p className="text-xs text-red-500 mt-1">
                                    {errors.address}
                                </p>
                            )}
                        </div>

                        {/* Bedrooms and CR Row - Stacks vertically on mobile */}
                        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <Bed className="w-3.5 h-3.5 inline mr-1" />
                                    Bedrooms{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="numberOfBedrooms"
                                    value={formData.numberOfBedrooms}
                                    onChange={handleChange}
                                    min="1"
                                    placeholder="Number of bedrooms"
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                                        errors.numberOfBedrooms
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                />
                                {errors.numberOfBedrooms && (
                                    <p className="text-xs text-red-500 mt-1">
                                        {errors.numberOfBedrooms}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <Bath className="w-3.5 h-3.5 inline mr-1" />
                                    CR / Bathroom{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="numberOfCR"
                                    value={formData.numberOfCR}
                                    onChange={handleChange}
                                    min="1"
                                    placeholder="Number of CR"
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                                        errors.numberOfCR
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                />
                                {errors.numberOfCR && (
                                    <p className="text-xs text-red-500 mt-1">
                                        {errors.numberOfCR}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Price */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <PhilippinePeso className="w-3.5 h-3.5 inline mr-1" />
                                Rent Price (per month){" "}
                                <span className="text-red-500">*</span>
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
                                    className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                                        errors.pricePerMonth
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                />
                            </div>
                            {errors.pricePerMonth && (
                                <p className="text-xs text-red-500 mt-1">
                                    {errors.pricePerMonth}
                                </p>
                            )}
                            <p className="text-xs text-gray-400 mt-1">
                                Set a competitive monthly rental price
                            </p>
                        </div>

                        {/* Submit Buttons - Stacks vertically on mobile */}
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
                                disabled={isSubmitting}
                                icon={Plus}
                                className="w-full sm:flex-1"
                            >
                                {isSubmitting
                                    ? "Creating..."
                                    : "Create Apartment"}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Instructions Section - Desktop only */}
                <div className="hidden lg:block lg:w-80 flex-shrink-0">
                    <Instructions
                        title="How to List an Apartment"
                        items={instructionItems}
                    />
                </div>
            </div>

            {/* Floating Instruction Button - Mobile only */}
            <div className="lg:hidden fixed bottom-6 right-6 z-40">
                <button
                    onClick={() => setIsInstructionsDrawerOpen(true)}
                    className="bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary/90 transition-all hover:scale-105"
                >
                    <HelpCircle className="w-6 h-6" />
                </button>
            </div>

            {/* Instructions Drawer - Mobile only */}
            {isInstructionsDrawerOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="lg:hidden fixed inset-0 bg-black/50 z-50"
                        onClick={() => setIsInstructionsDrawerOpen(false)}
                    />

                    {/* Drawer */}
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
                            {/* Instructions Image */}

                            <Instructions
                                title="How to List an Apartment"
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
                title="New Apartment Help"
                description="Learn how to add a new apartment listing."
                features={helpFeatures}
            />
        </div>
    );
};

export default NewApartment;
