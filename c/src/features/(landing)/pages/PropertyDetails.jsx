// src/features/(landing)/pages/PropertyDetails.jsx
import React from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { MapPin, Users, PhilippinePeso, Bed, ArrowLeft, Home, Calendar, Phone, Mail } from "lucide-react";
import Button from "@/shared/components/Button";

const PropertyDetails = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    
    // Get property data from navigation state
    const property = location.state;

    const getCapacityText = (capacity) => {
        if (capacity === 1) return "1 person per room";
        if (capacity === 2) return "2 persons per room";
        if (capacity === 3) return "3 persons per room";
        if (capacity >= 4) return `${capacity}+ persons per room`;
        return "";
    };

    const getSexText = (sex) => {
        if (sex === "male") return "Male Only";
        if (sex === "female") return "Female Only";
        return "Mixed";
    };

    // If no property data was passed, show error or redirect
    if (!property) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Property Not Found</h1>
                    <p className="text-gray-600 mb-8">The property details could not be loaded.</p>
                    <Button onClick={() => navigate("/properties")}>
                        Back to Properties
                    </Button>
                </div>
            </div>
        );
    }

    const isBoarding = property.category === "boarding";

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section with Image */}
            <div className="relative h-96 md:h-[500px] w-full overflow-hidden">
                <img
                    src={property.image}
                    alt={property.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-4 left-4 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all z-10"
                >
                    <ArrowLeft className="w-6 h-6 text-gray-800" />
                </button>

                {/* Property Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                    <div className="container mx-auto">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-3 ${
                            isBoarding ? "bg-blue-600" : "bg-red-600"
                        }`}>
                            {isBoarding ? "Boarding House" : "Apartment"}
                        </span>
                        <h1 className="text-3xl md:text-5xl font-bold mb-2">
                            {property.name}
                        </h1>
                        <div className="flex items-center gap-2 text-white/90">
                            <MapPin className="w-5 h-5" />
                            <span>{property.address}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content - Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Price Card */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex items-baseline gap-1 mb-4">
                                <PhilippinePeso className="w-6 h-6 text-gray-800" />
                                <span className="text-3xl md:text-4xl font-bold text-gray-800">
                                    {property.price.toLocaleString()}
                                </span>
                                <span className="text-gray-500">/month</span>
                            </div>
                            <div className="flex gap-3">
                                <Button className="flex-1">
                                    Contact Landlord
                                </Button>
                                <Button variant="outline" className="flex-1">
                                    Schedule Viewing
                                </Button>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">
                                About This Property
                            </h2>
                            <p className="text-gray-600 leading-relaxed">
                                This beautiful {isBoarding ? "boarding house" : "apartment"} is located in a prime location 
                                with easy access to transportation, schools, and commercial establishments. 
                                The property is well-maintained and offers comfortable living spaces perfect 
                                for students, young professionals, or small families.
                            </p>
                        </div>

                        {/* Amenities */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">
                                Amenities & Features
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {["Wi-Fi Ready", "24/7 Security", "CCTV Camera", "Clean Water Supply", "Common Area", "Parking Space"].map((amenity, index) => (
                                    <div key={index} className="flex items-center gap-2 text-gray-600">
                                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                                        <span>{amenity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Right Column */}
                    <div className="space-y-6">
                        {/* Property Details Card */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Home className="w-5 h-5 text-primary" />
                                Property Details
                            </h2>
                            <div className="space-y-3">
                                {isBoarding && property.capacity && (
                                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                        <span className="text-gray-600 flex items-center gap-2">
                                            <Users className="w-4 h-4" />
                                            Room Capacity
                                        </span>
                                        <span className="font-semibold text-gray-800">
                                            {getCapacityText(property.capacity)}
                                        </span>
                                    </div>
                                )}
                                {isBoarding && property.sex && (
                                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                        <span className="text-gray-600 flex items-center gap-2">
                                            <Bed className="w-4 h-4" />
                                            Preferred Gender
                                        </span>
                                        <span className="font-semibold text-gray-800">
                                            {getSexText(property.sex)}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="text-gray-600 flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Available From
                                    </span>
                                    <span className="font-semibold text-gray-800">
                                        Immediate
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">
                                Contact Information
                            </h2>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Phone className="w-4 h-4" />
                                    <span>+63 912 345 6789</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Mail className="w-4 h-4" />
                                    <span>landlord@4rent.com</span>
                                </div>
                            </div>
                        </div>

                        {/* Location Map Preview */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">
                                Location
                            </h2>
                            <div className="bg-gray-200 rounded-lg h-48 flex items-center justify-center">
                                <p className="text-gray-500 text-sm">Map View Coming Soon</p>
                            </div>
                            <p className="text-sm text-gray-500 mt-3">
                                {property.address}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyDetails;