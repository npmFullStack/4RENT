// src/features/(landing)/components/PropertyMap.jsx
import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Navigation, MapPin, X, Loader2 } from "lucide-react";
import Button from "@/shared/components/Button";
import PropertyCard from "@/features/(landing)/components/PropertyCard";

// Fix for default marker icons in Leaflet with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom circle marker with pulsing effect
const createPulsingCircleMarker = (color) => {
    return L.divIcon({
        className: 'custom-pulsing-marker',
        html: `
            <div class="marker-pulse" style="
                width: 20px;
                height: 20px;
                background-color: ${color};
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 0 0 rgba(${color === '#3b82f6' ? '59, 130, 246' : color === '#ef4444' ? '239, 68, 68' : '34, 197, 94'}, 0.7);
                animation: ${color === '#3b82f6' ? 'pulse-blue' : color === '#ef4444' ? 'pulse-red' : 'pulse-green'} 1.5s infinite;
                cursor: pointer;
            "></div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -10]
    });
};

// Custom pulsing marker for user location
const createUserPulsingMarker = () => {
    return L.divIcon({
        className: 'custom-user-marker',
        html: `
            <div style="position: relative; width: 24px; height: 24px;">
                <div style="
                    width: 24px;
                    height: 24px;
                    background-color: #22c55e;
                    border-radius: 50%;
                    border: 3px solid white;
                    box-shadow: 0 0 0 rgba(34, 197, 94, 0.7);
                    animation: pulse-green 1.5s infinite;
                "></div>
                <div style="
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 8px;
                    height: 8px;
                    background-color: white;
                    border-radius: 50%;
                "></div>
            </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12]
    });
};

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
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [popupOpen, setPopupOpen] = useState(false);
    const [isLegendVisible, setIsLegendVisible] = useState(true);

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

    // Handle marker click to show PropertyCard
    const handleMarkerClick = (property) => {
        setSelectedProperty(property);
        setPopupOpen(true);
    };

    // Close popup
    const handleClosePopup = () => {
        setPopupOpen(false);
        setSelectedProperty(null);
    };

    return (
        <div className="w-full h-full flex flex-col bg-white relative">
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
                    <>
                        <MapContainer
                            center={[mapCenter.lat, mapCenter.lng]}
                            zoom={mapZoom}
                            style={{ height: "100%", width: "100%" }}
                            className="z-0"
                            zoomControl={true}
                            attributionControl={true}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                            />
                            
                            {/* User Location Marker */}
                            {userLocation && (
                                <>
                                    <Marker
                                        position={[userLocation.lat, userLocation.lng]}
                                        icon={createUserPulsingMarker()}
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
                                    icon={createPulsingCircleMarker(
                                        property.category === "boarding" ? "#3b82f6" : "#ef4444"
                                    )}
                                    eventHandlers={{
                                        click: () => handleMarkerClick(property)
                                    }}
                                >
                                    {/* Empty popup - we'll use our custom PropertyCard instead */}
                                    <Popup className="hidden-popup"></Popup>
                                </Marker>
                            ))}
                        </MapContainer>

                        {/* Legend - Top Right with Close Button */}
                        {isLegendVisible && (
                            <div className="absolute top-4 right-4 z-[1000] bg-white rounded-lg shadow-lg border border-gray-200 min-w-[160px] animate-slide-in">
                                <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
                                    <h4 className="text-sm font-semibold text-gray-700">Map Legend</h4>
                                    <button
                                        onClick={() => setIsLegendVisible(false)}
                                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded"
                                        aria-label="Close legend"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="px-4 py-3">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
                                            <span className="text-gray-700 text-xs">Boarding House</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                                            <span className="text-gray-700 text-xs">Apartment</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                                            <span className="text-gray-700 text-xs">Your Location</span>
                                        </div>
                                    </div>
                                    <div className="mt-3 pt-2 border-t border-gray-100">
                                        <p className="text-xs text-gray-400">{propertyLocations.length} properties shown</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Show Legend Button (when legend is hidden) */}
                        {!isLegendVisible && (
                            <button
                                onClick={() => setIsLegendVisible(true)}
                                className="absolute top-4 right-4 z-[1000] bg-white rounded-lg shadow-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 animate-slide-in"
                            >
                                <MapPin className="w-4 h-4" />
                                Show Legend
                            </button>
                        )}

                        {/* Custom PropertyCard Popup */}
                        {popupOpen && selectedProperty && (
                            <div className="absolute top-4 right-4 z-[1000] w-80 animate-slide-in">
                                <div className="relative">
                                    <button
                                        onClick={handleClosePopup}
                                        className="absolute -top-2 -right-2 z-10 bg-white rounded-full p-1 shadow-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <X className="w-5 h-5 text-gray-600" />
                                    </button>
                                    <PropertyCard
                                        id={selectedProperty.id}
                                        image={selectedProperty.image}
                                        name={selectedProperty.name}
                                        category={selectedProperty.category}
                                        address={selectedProperty.address}
                                        price={selectedProperty.price}
                                        capacity={selectedProperty.capacity}
                                        sex={selectedProperty.sex}
                                        getCapacityText={getCapacityText}
                                        getSexText={getSexText}
                                    />
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default PropertyMap;