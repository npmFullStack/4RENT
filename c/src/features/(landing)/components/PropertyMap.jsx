// src/features/(landing)/components/PropertyMap.jsx
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Navigation, MapPin, X, Loader2 } from "lucide-react";
import Button from "@/shared/components/Button";

// Fix for default marker icons in Leaflet with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom marker icons for different property types
const boardingIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const apartmentIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const userLocationIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Component to center map on user location
const SetViewOnLocation = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, zoom);
        }
    }, [center, map, zoom]);
    return null;
};

// Mock geocoding function - in production, use a proper geocoding service
const getCoordinatesForAddress = async (address) => {
    const baseLat = 14.5995;
    const baseLng = 120.9842;
    const hash = address.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return {
        lat: baseLat + (hash % 100) / 1000,
        lng: baseLng + (hash % 200) / 1000
    };
};

const PropertyMap = ({ 
    properties, 
    getCapacityText, 
    getSexText, 
    onPropertyClick 
}) => {
    const [userLocation, setUserLocation] = useState(null);
    const [locationError, setLocationError] = useState(null);
    const [isLocating, setIsLocating] = useState(false);
    const [propertyLocations, setPropertyLocations] = useState([]);
    const [isLoadingLocations, setIsLoadingLocations] = useState(true);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    // Get user's current location
    const getUserLocation = () => {
        setIsLocating(true);
        setLocationError(null);
        
        if (!navigator.geolocation) {
            setLocationError("Geolocation is not supported by your browser");
            setIsLocating(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
                setIsLocating(false);
                // Show success message temporarily
                setShowSuccessMessage(true);
                setTimeout(() => setShowSuccessMessage(false), 3000);
            },
            (error) => {
                let errorMessage = "Unable to get your location";
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = "Please allow location access to find properties near you";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = "Location information is unavailable";
                        break;
                    case error.TIMEOUT:
                        errorMessage = "Location request timed out";
                        break;
                }
                setLocationError(errorMessage);
                setIsLocating(false);
                // Auto-clear error after 5 seconds
                setTimeout(() => setLocationError(null), 5000);
            }
        );
    };

    // Get coordinates for each property
    useEffect(() => {
        const loadPropertyLocations = async () => {
            setIsLoadingLocations(true);
            const locations = await Promise.all(
                properties.map(async (property) => {
                    const coords = await getCoordinatesForAddress(property.address);
                    return {
                        ...property,
                        coordinates: coords
                    };
                })
            );
            setPropertyLocations(locations);
            setIsLoadingLocations(false);
        };
        
        if (properties.length > 0) {
            loadPropertyLocations();
        } else {
            setIsLoadingLocations(false);
        }
    }, [properties]);

    // Calculate center of map
    const mapCenter = userLocation || (propertyLocations[0]?.coordinates || { lat: 14.5995, lng: 120.9842 });
    const mapZoom = userLocation ? 14 : 12;

    return (
        <div className="w-full h-full flex flex-col bg-white">
            {/* Location Controls Bar */}
            <div className="bg-white border-b shadow-sm px-4 py-3">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex gap-3 flex-wrap">
                        <Button
                            variant="primary"
                            icon={Navigation}
                            onClick={getUserLocation}
                            disabled={isLocating}
                            className="text-sm"
                        >
                            {isLocating ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Getting location...
                                </span>
                            ) : (
                                "Use My Current Location"
                            )}
                        </Button>
                        
                        <Button
                            variant="outline"
                            icon={MapPin}
                            onClick={() => {
                                // TODO: Implement address search
                                alert("Address search feature coming soon! Enter an address to find nearby properties.");
                            }}
                            className="text-sm"
                        >
                            Set Address Manually
                        </Button>
                    </div>

                    {/* Success Message */}
                    {showSuccessMessage && (
                        <div className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full animate-fade-in">
                            ✓ Location found! Map centered on your position.
                        </div>
                    )}
                </div>

                {/* Error Message */}
                {locationError && (
                    <div className="mt-3 p-2 bg-red-50 text-red-600 text-sm rounded-lg flex items-center justify-between">
                        <span>⚠️ {locationError}</span>
                        <button 
                            onClick={() => setLocationError(null)}
                            className="ml-3 hover:bg-red-100 p-1 rounded"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            {/* Map Container */}
            <div className="flex-1 relative">
                {isLoadingLocations ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <div className="text-center">
                            <Loader2 className="animate-spin h-12 w-12 text-primary mx-auto mb-4" />
                            <p className="text-gray-600 font-medium">Loading property locations...</p>
                            <p className="text-sm text-gray-400 mt-1">Please wait while we find properties near you</p>
                        </div>
                    </div>
                ) : (
                    <MapContainer
                        center={[mapCenter.lat, mapCenter.lng]}
                        zoom={mapZoom}
                        style={{ height: "100%", width: "100%" }}
                        className="z-0"
                        zoomControl={true}
                        attributionControl={true}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                        />
                        
                        {/* User Location Marker */}
                        {userLocation && (
                            <>
                                <Marker
                                    position={[userLocation.lat, userLocation.lng]}
                                    icon={userLocationIcon}
                                >
                                    <Popup>
                                        <div className="text-center">
                                            <p className="font-semibold text-gray-800">Your Location</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {userLocation.lat.toFixed(4)}°, {userLocation.lng.toFixed(4)}°
                                            </p>
                                        </div>
                                    </Popup>
                                </Marker>
                                <SetViewOnLocation center={[userLocation.lat, userLocation.lng]} zoom={14} />
                            </>
                        )}

                        {/* Property Markers */}
                        {propertyLocations.map((property) => (
                            <Marker
                                key={property.id}
                                position={[property.coordinates.lat, property.coordinates.lng]}
                                icon={property.category === "boarding" ? boardingIcon : apartmentIcon}
                                eventHandlers={{
                                    click: () => {
                                        // You can add analytics or tracking here
                                        console.log(`Marker clicked: ${property.name}`);
                                    }
                                }}
                            >
                                <Popup className="custom-popup min-w-[280px]">
                                    <div className="property-popup">
                                        <img
                                            src={property.image}
                                            alt={property.name}
                                            className="w-full h-36 object-cover rounded-lg mb-3"
                                            onError={(e) => {
                                                e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
                                            }}
                                        />
                                        <h3 className="font-bold text-gray-800 text-lg mb-1">
                                            {property.name}
                                        </h3>
                                        <p className="text-sm text-gray-600 flex items-start gap-1 mb-3">
                                            <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                            <span className="line-clamp-2">{property.address}</span>
                                        </p>
                                        
                                        {property.category === "boarding" && (
                                            <div className="flex gap-3 mb-3 text-xs">
                                                {property.capacity && (
                                                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                                        👥 {getCapacityText(property.capacity)}
                                                    </span>
                                                )}
                                                {property.sex && getSexText && (
                                                    <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded">
                                                        🛏️ {getSexText(property.sex)}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                        
                                        <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                                            <div>
                                                <span className="text-xs text-gray-500">Price per month</span>
                                                <p className="text-xl font-bold text-primary">
                                                    ₱{property.price.toLocaleString()}
                                                </p>
                                            </div>
                                            <Button
                                                variant="primary"
                                                onClick={() => onPropertyClick(property)}
                                                className="text-sm px-4 py-2"
                                            >
                                                View Details
                                            </Button>
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                )}
            </div>

            {/* Legend */}
            <div className="bg-white border-t shadow-sm px-4 py-3">
                <div className="flex justify-center items-center gap-6 text-sm flex-wrap">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-blue-600 shadow-sm"></div>
                        <span className="text-gray-700">Boarding House</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-red-600 shadow-sm"></div>
                        <span className="text-gray-700">Apartment</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-green-600 shadow-sm"></div>
                        <span className="text-gray-700">Your Location</span>
                    </div>
                    <div className="text-xs text-gray-400">
                        {propertyLocations.length} properties shown
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyMap;