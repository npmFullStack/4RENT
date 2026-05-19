// src/features/(landing)/components/PropertyMap.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
    useMapEvents
} from "react-leaflet";
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

// ─── Marker creators ────────────────────────────────────────────────────────

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
                    0%   { box-shadow: 0 2px 8px rgba(0,0,0,0.25), 0 0 0 0 rgba(${rgb}, 0.6); }
                    70%  { box-shadow: 0 2px 8px rgba(0,0,0,0.25), 0 0 0 12px rgba(${rgb}, 0); }
                    100% { box-shadow: 0 2px 8px rgba(0,0,0,0.25), 0 0 0 0 rgba(${rgb}, 0); }
                }
            </style>
        `,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
        popupAnchor: [0, -11]
    });
};

const createUserMarker = () =>
    L.divIcon({
        className: "custom-user-marker",
        html: `
            <div style="position:relative;width:26px;height:26px;">
                <div style="
                    width:26px;height:26px;
                    background-color:#22c55e;
                    border-radius:50%;
                    border:3px solid white;
                    box-shadow:0 2px 10px rgba(34,197,94,0.5),0 0 0 0 rgba(34,197,94,0.6);
                    animation:pulse-user 1.8s infinite;
                "></div>
                <div style="
                    position:absolute;top:50%;left:50%;
                    transform:translate(-50%,-50%);
                    width:9px;height:9px;
                    background:white;border-radius:50%;
                "></div>
            </div>
            <style>
                @keyframes pulse-user {
                    0%   { box-shadow:0 2px 10px rgba(34,197,94,0.5),0 0 0 0 rgba(34,197,94,0.6); }
                    70%  { box-shadow:0 2px 10px rgba(34,197,94,0.5),0 0 0 14px rgba(34,197,94,0); }
                    100% { box-shadow:0 2px 10px rgba(34,197,94,0.5),0 0 0 0 rgba(34,197,94,0); }
                }
            </style>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
        popupAnchor: [0, -13]
    });

// ─── Recenter helper (only runs when center actually changes) ───────────────
const SetViewOnLocation = ({ center, zoom }) => {
    const map = useMap();
    const prevCenter = useRef(null);
    useEffect(() => {
        if (!center) return;
        const key = `${center[0].toFixed(6)},${center[1].toFixed(6)}`;
        if (prevCenter.current === key) return;
        prevCenter.current = key;
        map.setView(center, zoom);
    }, [center, map, zoom]);
    return null;
};

// ─── Haversine distance ─────────────────────────────────────────────────────
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

const formatDistance = km => {
    if (km == null) return null;
    return km < 1 ? `${Math.round(km * 1000)}m` : `${km.toFixed(1)}km`;
};

// ─── Nominatim geocoding ────────────────────────────────────────────────────
//
// Tries the query string with Nominatim. Returns {lat, lng} or null.
const nominatimSearch = async query => {
    try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=ph&q=${encodeURIComponent(query)}`;
        const res = await fetch(url, {
            headers: { "Accept-Language": "en", "User-Agent": "PropertyMapApp/1.0" }
        });
        const data = await res.json();
        if (data && data.length > 0) {
            return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
        }
    } catch {
        // ignore network errors
    }
    return null;
};

// Deterministic unique spread for fake/unresolvable addresses.
// Seeds two independent hashes from the address string so every property
// lands at a different spot rather than all collapsing to one point.
const deterministicOffset = address => {
    let h1 = 0, h2 = 0;
    for (let i = 0; i < address.length; i++) {
        const c = address.charCodeAt(i);
        h1 = (h1 * 31 + c) >>> 0;
        h2 = (h2 * 37 + c * 17) >>> 0;
    }
    // Spread within a ~12 km band around Manila centre
    const lat = 14.5400 + (h1 % 1200) / 10000; // 14.54 – 14.66
    const lng = 120.9500 + (h2 % 1500) / 10000; // 120.95 – 121.10
    return { lat, lng };
};

// Geocode a plain address string (used for property markers).
const getCoordinatesForAddress = async address => {
    const coords = await nominatimSearch(address);
    // If Nominatim can't resolve (fake/test address), give it a unique spot
    return coords ?? deterministicOffset(address);
};

// Geocode a manual address using geocodeParts (from most → least specific).
// Tries progressively shorter queries until one succeeds so partial selections
// (province only, city only, etc.) still pin correctly.
const geocodeManualAddress = async manualAddress => {
    const parts = manualAddress.geocodeParts ?? [manualAddress.fullAddress];
    // Try each progressive slice: full → drop first part → drop two → …
    for (let i = 0; i < parts.length; i++) {
        const query = parts.slice(i).join(", ");
        const coords = await nominatimSearch(query);
        if (coords) return coords;
    }
    return null;
};

// ─── SVG overlay: curved network lines from user → each property ───────────
//
//  We render an absolutely-positioned <svg> over the map container.
//  On every map move/zoom, we reproject lat/lng → pixel coords and redraw.
//
const NetworkLines = ({ mapRef, referencePoint, propertyLocations }) => {
    const svgRef = useRef(null);
    const animFrameRef = useRef(null);

    const draw = useCallback(() => {
        const map = mapRef.current;
        const svg = svgRef.current;
        if (!map || !svg || !referencePoint) {
            if (svg) {
                // clear
                while (svg.firstChild) svg.removeChild(svg.firstChild);
            }
            return;
        }

        const container = map.getContainer();
        const { width, height } = container.getBoundingClientRect();
        svg.setAttribute("width", width);
        svg.setAttribute("height", height);

        // Clear previous drawings
        while (svg.firstChild) svg.removeChild(svg.firstChild);

        // User location pixel
        const userPx = map.latLngToContainerPoint([
            referencePoint.lat,
            referencePoint.lng
        ]);

        propertyLocations.forEach(property => {
            const propPx = map.latLngToContainerPoint([
                property.coordinates.lat,
                property.coordinates.lng
            ]);

            const isApartment = property.category === "apartment";
            const lineColor = isApartment ? "#ef4444" : "#3b82f6";

            // Control point: offset perpendicular to mid-point for a network-cable curve
            const mx = (userPx.x + propPx.x) / 2;
            const my = (userPx.y + propPx.y) / 2;

            // Perpendicular offset — alternate direction by property id
            const dx = propPx.x - userPx.x;
            const dy = propPx.y - userPx.y;
            const len = Math.sqrt(dx * dx + dy * dy) || 1;
            const perpX = -dy / len;
            const perpY = dx / len;
            const direction = property.id % 2 === 0 ? 1 : -1;
            const curvature = Math.min(len * 0.28, 80);
            const cpx = mx + perpX * curvature * direction;
            const cpy = my + perpY * curvature * direction;

            // Dashed path (one clean line — no glow layer)
            const pathData = `M ${userPx.x} ${userPx.y} Q ${cpx} ${cpy} ${propPx.x} ${propPx.y}`;

            // Single line
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", pathData);
            path.setAttribute("fill", "none");
            path.setAttribute("stroke", lineColor);
            path.setAttribute("stroke-width", "2");
            path.setAttribute("stroke-dasharray", "6 4");
            path.setAttribute("stroke-linecap", "round");
            path.setAttribute("opacity", "0.75");
            svg.appendChild(path);

            // Distance label — placed at 60% along the curve (approx)
            const distKm = getDistanceKm(referencePoint, property.coordinates);
            if (distKm != null) {
                const t = 0.6;
                const lx =
                    (1 - t) * (1 - t) * userPx.x +
                    2 * (1 - t) * t * cpx +
                    t * t * propPx.x;
                const ly =
                    (1 - t) * (1 - t) * userPx.y +
                    2 * (1 - t) * t * cpy +
                    t * t * propPx.y;

                const label = formatDistance(distKm);
                const pill = document.createElementNS("http://www.w3.org/2000/svg", "g");

                const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                rect.setAttribute("x", lx - 22);
                rect.setAttribute("y", ly - 10);
                rect.setAttribute("width", "44");
                rect.setAttribute("height", "18");
                rect.setAttribute("rx", "9");
                rect.setAttribute("fill", lineColor);
                rect.setAttribute("opacity", "0.92");
                pill.appendChild(rect);

                const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
                text.setAttribute("x", lx);
                text.setAttribute("y", ly + 4);
                text.setAttribute("text-anchor", "middle");
                text.setAttribute("fill", "white");
                text.setAttribute("font-size", "9");
                text.setAttribute("font-family", "system-ui, sans-serif");
                text.setAttribute("font-weight", "600");
                text.setAttribute("letter-spacing", "0.3");
                text.textContent = label;
                pill.appendChild(text);

                svg.appendChild(pill);
            }
        });
    }, [mapRef, referencePoint, propertyLocations]);

    // Redraw on map move / zoom
    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;

        const scheduleRedraw = () => {
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
            animFrameRef.current = requestAnimationFrame(draw);
        };

        draw(); // initial
        map.on("move zoom resize viewreset", scheduleRedraw);
        return () => {
            map.off("move zoom resize viewreset", scheduleRedraw);
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        };
    }, [mapRef, draw]);

    if (!referencePoint) return null;

    return (
        <svg
            ref={svgRef}
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                pointerEvents: "none",
                zIndex: 300
            }}
        />
    );
};

// ─── Main component ─────────────────────────────────────────────────────────
const PropertyMap = ({
    properties,
    getCapacityText,
    getSexText,
    getStatusBadgeProps,
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
    const mapRef = useRef(null);

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
                    const coords = await getCoordinatesForAddress(property.address);
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

    const [manualCoords, setManualCoords] = useState(null);
    useEffect(() => {
        if (!manualAddress) {
            setManualCoords(null);
            return;
        }
        geocodeManualAddress(manualAddress).then(coords => {
            // coords may be null if Nominatim failed entirely — leave marker hidden
            setManualCoords(coords);
        });
    }, [manualAddress]);

    // Zoom depends on how specific the manual address is
    const getManualZoom = () => {
        if (!manualAddress) return 14;
        if (manualAddress.barangay) return 15;
        if (manualAddress.city) return 13;
        if (manualAddress.province) return 11;
        return 9; // region only
    };

    const referencePoint = userLocation || manualCoords || null;

    const mapCenter = referencePoint ||
        propertyLocations[0]?.coordinates || { lat: 14.5995, lng: 120.9842 };
    const mapZoom = referencePoint ? 14 : 12;

    // Only set view when the reference point first becomes available
    const [initialCenter, setInitialCenter] = useState(null);
    const [initialZoom, setInitialZoom] = useState(null);
    useEffect(() => {
        if (referencePoint) {
            setInitialCenter([referencePoint.lat, referencePoint.lng]);
            setInitialZoom(userLocation ? 14 : getManualZoom());
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [referencePoint]);

    // ── Marker click: DO NOT zoom, just select ──────────────────────────────
    const handleMarkerClick = property => {
        setSelectedProperty(property);
        setPopupOpen(true);
        // intentionally no map.setView() here → no zoom-in side-effect
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
                        <p className="text-gray-700 font-semibold">Loading map...</p>
                        <p className="text-sm text-gray-400 mt-1">Finding properties near you</p>
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
                        // KEY: prevent Leaflet from firing its own zoom on marker click
                        ref={mapRef}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                        />

                        {/* Only pan to user/manual location when it first appears */}
                        {initialCenter && (
                            <SetViewOnLocation center={initialCenter} zoom={initialZoom} />
                        )}

                        {/* User / manual location marker */}
                        {(userLocation || manualCoords) && (() => {
                            const loc = userLocation || manualCoords;
                            return (
                                <Marker
                                    position={[loc.lat, loc.lng]}
                                    icon={createUserMarker()}
                                >
                                    <Popup className="modern-popup">
                                        <div className="text-center py-1">
                                            <p className="font-semibold text-gray-800 text-sm">
                                                {userLocation ? "Your Location" : "Set Location"}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {userLocation
                                                    ? `${loc.lat.toFixed(4)}°, ${loc.lng.toFixed(4)}°`
                                                    : manualAddress?.fullAddress}
                                            </p>
                                        </div>
                                    </Popup>
                                </Marker>
                            );
                        })()}

                        {/* Property markers — click does NOT zoom */}
                        {propertyLocations.map(property => (
                            <Marker
                                key={property.id}
                                position={[
                                    property.coordinates.lat,
                                    property.coordinates.lng
                                ]}
                                icon={createPulsingCircleMarker(
                                    property.category === "boarding" ? "#3b82f6" : "#ef4444"
                                )}
                                eventHandlers={{
                                    click: e => {
                                        // Stop Leaflet's default zoom-to-marker behaviour
                                        L.DomEvent.stopPropagation(e);
                                        handleMarkerClick(property);
                                    }
                                }}
                            >
                                {/* Empty popup so Leaflet doesn't open its own */}
                                <Popup className="hidden-popup" />
                            </Marker>
                        ))}
                    </MapContainer>

                    {/* ── Curved network lines overlay ──────────────────── */}
                    {referencePoint && !hideMapUI && (
                        <NetworkLines
                            mapRef={mapRef}
                            referencePoint={referencePoint}
                            propertyLocations={propertyLocations}
                        />
                    )}

                    {/* ── Legend ───────────────────────────────────────── */}
                    {!hideMapUI &&
                        (isLegendVisible ? (
                            <div className="absolute top-3 right-3 z-[400] bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden min-w-[178px]">
                                <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-50">
                                    <div className="flex items-center gap-1.5">
                                        <Layers className="w-3.5 h-3.5 text-gray-400" />
                                        <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                                            Legend
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => setIsLegendVisible(false)}
                                        className="text-gray-300 hover:text-gray-500 p-0.5 hover:bg-gray-100 rounded transition-colors"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                                <div className="px-4 py-3 flex flex-col gap-2.5">
                                    <div className="flex items-center gap-2.5">
                                        <span className="w-3 h-3 rounded-full bg-blue-500 shrink-0 ring-2 ring-blue-100"></span>
                                        <span className="text-xs text-gray-600 font-medium">Boarding House</span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <span className="w-3 h-3 rounded-full bg-red-500 shrink-0 ring-2 ring-red-100"></span>
                                        <span className="text-xs text-gray-600 font-medium">Apartment</span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <span className="w-3 h-3 rounded-full bg-green-500 shrink-0 ring-2 ring-green-100"></span>
                                        <span className="text-xs text-gray-600 font-medium">Your Location</span>
                                    </div>
                                    {referencePoint && (
                                        <>
                                            <div className="pt-1.5 mt-0.5 border-t border-gray-50 flex flex-col gap-1.5">
                                                <div className="flex items-center gap-2">
                                                    <svg width="28" height="8" viewBox="0 0 28 8">
                                                        <line x1="0" y1="4" x2="28" y2="4" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5 3" strokeLinecap="round"/>
                                                    </svg>
                                                    <span className="text-xs text-gray-500">Boarding line</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <svg width="28" height="8" viewBox="0 0 28 8">
                                                        <line x1="0" y1="4" x2="28" y2="4" stroke="#ef4444" strokeWidth="2" strokeDasharray="5 3" strokeLinecap="round"/>
                                                    </svg>
                                                    <span className="text-xs text-gray-500">Apartment line</span>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    <div className="pt-1.5 mt-0.5 border-t border-gray-50">
                                        <p className="text-[10px] text-gray-400">
                                            {propertyLocations.length} properties shown
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

                    {/* ── Property card popup ───────────────────────────── */}
                    {!hideMapUI && popupOpen && selectedProperty && (
                        <>
                            {/* Mobile: compact bottom sheet */}
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
                                                bedroomDetails={selectedProperty.bedroomDetails}
                                                boardingHouseType={selectedProperty.boardingHouseType}
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

                            {/* Desktop: floating card */}
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
                                    bedroomDetails={selectedProperty.bedroomDetails}
                                    boardingHouseType={selectedProperty.boardingHouseType}
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