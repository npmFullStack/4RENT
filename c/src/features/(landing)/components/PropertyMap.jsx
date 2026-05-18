// src/features/(landing)/components/PropertyMap.jsx
import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, X, Loader2, Layers } from "lucide-react";
import PropertyCard from "@/features/(landing)/components/PropertyCard";

// Fix for default marker icons in Leaflet with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png"
});

// Create property marker - color based on category only
const createPulsingCircleMarker = color => {
    const rgbMap = {
        "#3b82f6": "59, 130, 246",
        "#ef4444": "239, 68, 68"
    };
    const rgb = rgbMap[color] || "59, 130, 246";
    return L.divIcon({
        className: "custom-pulsing-marker",
        html: `
            <div style="
                width: 22px;
                height: 22px;
                background-color: ${color};
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 2px 8px rgba(0,0,0,0.25), 0 0 0 0 rgba(${rgb}, 0.7);
                animation: pulse-marker-${color.replace("#", "")} 1.8s infinite;
                cursor: pointer;
                transition: transform 0.2s ease;
            "></div>
            <style>
                @keyframes pulse-marker-${color.replace("#", "")} {
                    0% { box-shadow: 0 2px 8px rgba(0,0,0,0.25), 0 0 0 0 rgba(${rgb}, 0.6); }
                    70% { box-shadow: 0 2px 8px rgba(0,0,0,0.25), 0 0 0 12px rgba(${rgb}, 0); }
                    100% { box-shadow: 0 2px 8px rgba(0,0,0,0.25), 0 0 0 0 rgba(${rgb}, 0); }
                }
            </style>
        `,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
        popupAnchor: [0, -11]
    });
};

// User / manual location marker - always green
const createUserMarker = () => {
    return L.divIcon({
        className: "custom-user-marker",
        html: `
            <div style="position: relative; width: 26px; height: 26px;">
                <div style="
                    width: 26px;
                    height: 26px;
                    background-color: #22c55e;
                    border-radius: 50%;
                    border: 3px solid white;
                    box-shadow: 0 2px 10px rgba(34,197,94,0.5), 0 0 0 0 rgba(34,197,94,0.6);
                    animation: pulse-user 1.8s infinite;
                "></div>
                <div style="
                    position: absolute;
                    top: 50%; left: 50%;
                    transform: translate(-50%, -50%);
                    width: 9px; height: 9px;
                    background: white;
                    border-radius: 50%;
                "></div>
            </div>
            <style>
                @keyframes pulse-user {
                    0% { box-shadow: 0 2px 10px rgba(34,197,94,0.5), 0 0 0 0 rgba(34,197,94,0.6); }
                    70% { box-shadow: 0 2px 10px rgba(34,197,94,0.5), 0 0 0 14px rgba(34,197,94,0); }
                    100% { box-shadow: 0 2px 10px rgba(34,197,94,0.5), 0 0 0 0 rgba(34,197,94,0); }
                }
            </style>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
        popupAnchor: [0, -13]
    });
};

// Recenter map helper
const SetViewOnLocation = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        if (center) map.setView(center, zoom);
    }, [center, map, zoom]);
    return null;
};

// Mock geocoding
const getCoordinatesForAddress = async address => {
    const hash = address
        .split("")
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return {
        lat: 14.5995 + (hash % 100) / 1000,
        lng: 120.9842 + (hash % 200) / 1000
    };
};

// Haversine distance in km between two {lat, lng} points
const getDistanceKm = (a, b) => {
    if (!a || !b) return null;
    const R = 6371;
    const dLat = ((b.lat - a.lat) * Math.PI) / 180;
    const dLng = ((b.lng - a.lng) * Math.PI) / 180;
    const sinLat = Math.sin(dLat / 2);
    const sinLng = Math.sin(dLng / 2);
    const c =
        sinLat * sinLat +
        Math.cos((a.lat * Math.PI) / 180) *
            Math.cos((b.lat * Math.PI) / 180) *
            sinLng *
            sinLng;
    return R * 2 * Math.atan2(Math.sqrt(c), Math.sqrt(1 - c));
};

const PropertyMap = ({
    properties,
    getCapacityText,
    getSexText,
    getStatusBadgeProps, // Add this prop
    onPropertyClick,
    userLocation,
    manualAddress,
    isModalOpen
}) => {
    const [propertyLocations, setPropertyLocations] = useState([]);
    const [isLoadingLocations, setIsLoadingLocations] = useState(true);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [popupOpen, setPopupOpen] = useState(false);
    const [isLegendVisible, setIsLegendVisible] = useState(true);

    // Close property card when the modal opens
    useEffect(() => {
        if (isModalOpen) {
            setPopupOpen(false);
            setSelectedProperty(null);
        }
    }, [isModalOpen]);

    // Load property coordinates
    useEffect(() => {
        const loadPropertyLocations = async () => {
            setIsLoadingLocations(true);
            const locations = await Promise.all(
                properties.map(async property => {
                    const coords = await getCoordinatesForAddress(
                        property.address
                    );
                    return { ...property, coordinates: coords };
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

    const activeLocation = userLocation || null;

    const [manualCoords, setManualCoords] = useState(null);
    useEffect(() => {
        if (!manualAddress) {
            setManualCoords(null);
            return;
        }
        getCoordinatesForAddress(manualAddress.fullAddress).then(
            setManualCoords
        );
    }, [manualAddress]);

    const referencePoint = userLocation || manualCoords || null;

    const mapCenter = referencePoint ||
        propertyLocations[0]?.coordinates || { lat: 14.5995, lng: 120.9842 };
    const mapZoom = referencePoint ? 14 : 12;

    const handleMarkerClick = property => {
        setSelectedProperty(property);
        setPopupOpen(true);
    };

    const handleClosePopup = () => {
        setPopupOpen(false);
        setSelectedProperty(null);
    };

    const hideMapUI = isModalOpen;

    return (
        <div className="w-full h-full flex flex-col bg-white relative">
            {isLoadingLocations ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
                    <div className="text-center">
                        <div className="relative w-16 h-16 mx-auto mb-4">
                            <div className="absolute inset-0 rounded-full border-4 border-yellow-100"></div>
                            <div className="absolute inset-0 rounded-full border-4 border-t-yellow-400 animate-spin"></div>
                            <MapPin className="absolute inset-0 m-auto w-6 h-6 text-yellow-500" />
                        </div>
                        <p className="text-gray-700 font-semibold">
                            Loading map...
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                            Finding properties near you
                        </p>
                    </div>
                </div>
            ) : (
                <>
                    <MapContainer
                        center={[mapCenter.lat, mapCenter.lng]}
                        zoom={mapZoom}
                        style={{ height: "100%", width: "100%" }}
                        className="z-0"
                        zoomControl={false}
                        attributionControl={true}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                        />

                        {userLocation && (
                            <>
                                <Marker
                                    position={[
                                        userLocation.lat,
                                        userLocation.lng
                                    ]}
                                    icon={createUserMarker()}
                                >
                                    <Popup className="modern-popup">
                                        <div className="text-center py-1">
                                            <p className="font-semibold text-gray-800 text-sm">
                                                Your Location
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {userLocation.lat.toFixed(4)}°,{" "}
                                                {userLocation.lng.toFixed(4)}°
                                            </p>
                                        </div>
                                    </Popup>
                                </Marker>
                                <SetViewOnLocation
                                    center={[
                                        userLocation.lat,
                                        userLocation.lng
                                    ]}
                                    zoom={14}
                                />
                            </>
                        )}

                        {!userLocation && manualCoords && (
                            <>
                                <Marker
                                    position={[
                                        manualCoords.lat,
                                        manualCoords.lng
                                    ]}
                                    icon={createUserMarker()}
                                >
                                    <Popup className="modern-popup">
                                        <div className="text-center py-1">
                                            <p className="font-semibold text-gray-800 text-sm">
                                                Set Location
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1 max-w-[160px] leading-relaxed">
                                                {manualAddress?.fullAddress}
                                            </p>
                                        </div>
                                    </Popup>
                                </Marker>
                                <SetViewOnLocation
                                    center={[
                                        manualCoords.lat,
                                        manualCoords.lng
                                    ]}
                                    zoom={14}
                                />
                            </>
                        )}

                        {propertyLocations.map(property => (
                            <Marker
                                key={property.id}
                                position={[
                                    property.coordinates.lat,
                                    property.coordinates.lng
                                ]}
                                icon={createPulsingCircleMarker(
                                    property.category === "boarding"
                                        ? "#3b82f6"
                                        : "#ef4444"
                                )}
                                eventHandlers={{
                                    click: () => handleMarkerClick(property)
                                }}
                            >
                                <Popup className="hidden-popup" />
                            </Marker>
                        ))}
                    </MapContainer>

                    {!hideMapUI &&
                        (isLegendVisible ? (
                            <div className="absolute top-3 right-3 z-[400] bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden min-w-[168px]">
                                <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-50">
                                    <div className="flex items-center gap-1.5">
                                        <Layers className="w-3.5 h-3.5 text-gray-400" />
                                        <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                                            Legend
                                        </span>
                                    </div>
                                    <button
                                        onClick={() =>
                                            setIsLegendVisible(false)
                                        }
                                        className="text-gray-300 hover:text-gray-500 p-0.5 hover:bg-gray-100 rounded transition-colors"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                                <div className="px-4 py-3 flex flex-col gap-2.5">
                                    <div className="flex items-center gap-2.5">
                                        <span className="w-3 h-3 rounded-full bg-blue-500 shrink-0 ring-2 ring-blue-100"></span>
                                        <span className="text-xs text-gray-600 font-medium">
                                            Boarding House
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <span className="w-3 h-3 rounded-full bg-red-500 shrink-0 ring-2 ring-red-100"></span>
                                        <span className="text-xs text-gray-600 font-medium">
                                            Apartment
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <span className="w-3 h-3 rounded-full bg-green-500 shrink-0 ring-2 ring-green-100"></span>
                                        <span className="text-xs text-gray-600 font-medium">
                                            Your Location
                                        </span>
                                    </div>
                                    <div className="pt-1.5 mt-0.5 border-t border-gray-50">
                                        <p className="text-[10px] text-gray-400">
                                            {propertyLocations.length}{" "}
                                            properties shown
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsLegendVisible(true)}
                                className="absolute top-3 right-3 z-[400] bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-yellow-50 hover:border-yellow-200 hover:text-yellow-700 transition-all duration-200 flex items-center gap-1.5"
                            >
                                <Layers className="w-3.5 h-3.5" />
                                Legend
                            </button>
                        ))}

                    {/* Mobile Popup - Smaller size */}
                    {!hideMapUI && popupOpen && selectedProperty && (
                        <>
                            {/* Mobile: Compact bottom sheet */}
                            <div className="absolute bottom-0 left-0 right-0 z-[400] sm:hidden">
                                <div className="bg-white rounded-t-2xl shadow-2xl border-t border-gray-100 overflow-hidden">
                                    <div className="flex justify-center pt-2 pb-1">
                                        <div className="w-10 h-1 rounded-full bg-gray-200"></div>
                                    </div>
                                    <div className="max-h-[50vh] overflow-y-auto">
                                        <div className="p-3">
                                            <PropertyCard
                                                id={selectedProperty.id}
                                                image={selectedProperty.image}
                                                name={selectedProperty.name}
                                                category={selectedProperty.category}
                                                address={selectedProperty.address}
                                                price={selectedProperty.price}
                                                capacity={selectedProperty.capacity}
                                                bedrooms={selectedProperty.bedrooms}
                                                bathrooms={selectedProperty.bathrooms}
                                                sex={selectedProperty.sex}
                                                status={selectedProperty.status}
                                                currentTenants={selectedProperty.currentTenants}
                                                getCapacityText={getCapacityText}
                                                getSexText={getSexText}
                                                getStatusBadgeProps={getStatusBadgeProps}
                                                onClose={handleClosePopup}
                                                isMobilePopup={true}
                                                distanceKm={
                                                    referencePoint
                                                        ? getDistanceKm(
                                                              referencePoint,
                                                              selectedProperty.coordinates
                                                          )
                                                        : null
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Desktop: Floating card */}
                            <div className="absolute top-3 left-3 z-[400] w-80 hidden sm:block animate-slide-in">
                                <PropertyCard
                                    id={selectedProperty.id}
                                    image={selectedProperty.image}
                                    name={selectedProperty.name}
                                    category={selectedProperty.category}
                                    address={selectedProperty.address}
                                    price={selectedProperty.price}
                                    capacity={selectedProperty.capacity}
                                    bedrooms={selectedProperty.bedrooms}
                                    bathrooms={selectedProperty.bathrooms}
                                    sex={selectedProperty.sex}
                                    status={selectedProperty.status}
                                    currentTenants={selectedProperty.currentTenants}
                                    getCapacityText={getCapacityText}
                                    getSexText={getSexText}
                                    getStatusBadgeProps={getStatusBadgeProps}
                                    onClose={handleClosePopup}
                                    isInPopup={true}
                                    distanceKm={
                                        referencePoint
                                            ? getDistanceKm(
                                                  referencePoint,
                                                  selectedProperty.coordinates
                                              )
                                            : null
                                    }
                                />
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default PropertyMap;