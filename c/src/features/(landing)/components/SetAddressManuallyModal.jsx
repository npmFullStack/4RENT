// src/features/(landing)/components/SetAddressManuallyModal.jsx
import React, { useState, useEffect } from "react";
import ModalPortal from "@/shared/components/ModalPortal";
import Select from "@/shared/components/Select";
import Button from "@/shared/components/Button";
import { MapPin, X, CheckCircle, Loader2 } from "lucide-react";

// --- Main Modal ---
const SetAddressManuallyModal = ({ isOpen, onClose, onConfirm }) => {
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [barangays, setBarangays] = useState([]);
    const [regions, setRegions] = useState([]);

    const [selectedRegion, setSelectedRegion] = useState(null);
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedBarangay, setSelectedBarangay] = useState(null);

    const [loadingRegions, setLoadingRegions] = useState(false);
    const [loadingProvinces, setLoadingProvinces] = useState(false);
    const [loadingCities, setLoadingCities] = useState(false);
    const [loadingBarangays, setLoadingBarangays] = useState(false);

    // Fetch regions on open (for NCR, CAR, etc.)
    useEffect(() => {
        if (!isOpen) return;
        setLoadingRegions(true);
        fetch("https://psgc.gitlab.io/api/regions/")
            .then(r => r.json())
            .then(data => {
                const sorted = [...data].sort((a, b) =>
                    a.name.localeCompare(b.name)
                );
                setRegions(sorted.map(r => ({ value: r.code, label: r.name })));
            })
            .catch(() => setRegions([]))
            .finally(() => setLoadingRegions(false));
    }, [isOpen]);

    // Fetch provinces (only if region is selected and region is NOT NCR)
    useEffect(() => {
        if (!selectedRegion) {
            setProvinces([]);
            setSelectedProvince(null);
            return;
        }

        // Check if selected region is NCR (code starts with "13" or name contains "NCR")
        const isNCR =
            selectedRegion === "130000000" ||
            regions
                .find(r => r.value === selectedRegion)
                ?.label.includes("NCR");

        if (isNCR) {
            // For NCR, we don't need provinces - handle cities directly
            setProvinces([]);
            setSelectedProvince(null);
            fetchNC(selectedRegion);
            return;
        }

        setSelectedProvince(null);
        setSelectedCity(null);
        setSelectedBarangay(null);
        setCities([]);
        setBarangays([]);
        setLoadingProvinces(true);

        fetch(`https://psgc.gitlab.io/api/regions/${selectedRegion}/provinces/`)
            .then(r => r.json())
            .then(data => {
                const sorted = [...data].sort((a, b) =>
                    a.name.localeCompare(b.name)
                );
                setProvinces(
                    sorted.map(p => ({ value: p.code, label: p.name }))
                );
            })
            .catch(() => setProvinces([]))
            .finally(() => setLoadingProvinces(false));
    }, [selectedRegion, regions]);

    // Fetch cities for NCR or from province
    const fetchNC = regionCode => {
        setLoadingCities(true);
        fetch(
            `https://psgc.gitlab.io/api/regions/${regionCode}/cities-municipalities/`
        )
            .then(r => r.json())
            .then(data => {
                const sorted = [...data].sort((a, b) =>
                    a.name.localeCompare(b.name)
                );
                setCities(sorted.map(c => ({ value: c.code, label: c.name })));
            })
            .catch(() => setCities([]))
            .finally(() => setLoadingCities(false));
    };

    // Fetch cities when province changes
    useEffect(() => {
        if (!selectedProvince) {
            setCities([]);
            setSelectedCity(null);
            setSelectedBarangay(null);
            return;
        }

        setSelectedCity(null);
        setSelectedBarangay(null);
        setCities([]);
        setBarangays([]);
        setLoadingCities(true);

        fetch(
            `https://psgc.gitlab.io/api/provinces/${selectedProvince}/cities-municipalities/`
        )
            .then(r => r.json())
            .then(data => {
                const sorted = [...data].sort((a, b) =>
                    a.name.localeCompare(b.name)
                );
                setCities(sorted.map(c => ({ value: c.code, label: c.name })));
            })
            .catch(() => setCities([]))
            .finally(() => setLoadingCities(false));
    }, [selectedProvince]);

    // Fetch barangays when city changes
    useEffect(() => {
        if (!selectedCity) {
            setBarangays([]);
            setSelectedBarangay(null);
            return;
        }

        setSelectedBarangay(null);
        setBarangays([]);
        setLoadingBarangays(true);

        fetch(
            `https://psgc.gitlab.io/api/cities-municipalities/${selectedCity}/barangays/`
        )
            .then(r => r.json())
            .then(data => {
                const sorted = [...data].sort((a, b) =>
                    a.name.localeCompare(b.name)
                );
                setBarangays(
                    sorted.map(b => ({ value: b.code, label: b.name }))
                );
            })
            .catch(() => setBarangays([]))
            .finally(() => setLoadingBarangays(false));
    }, [selectedCity]);

    // Check if address is complete
    const isComplete =
        selectedRegion !== null &&
        (selectedProvince !== null ||
            (selectedRegion === "130000000" && selectedCity !== null));

    const handleConfirm = () => {
        const addressParts = [];

        if (selectedBarangay) {
            const barangayObj = barangays.find(
                b => b.value === selectedBarangay
            );
            if (barangayObj) addressParts.push(barangayObj.label);
        }

        if (selectedCity) {
            const cityObj = cities.find(c => c.value === selectedCity);
            if (cityObj) addressParts.push(cityObj.label);
        }

        if (selectedProvince) {
            const provinceObj = provinces.find(
                p => p.value === selectedProvince
            );
            if (provinceObj) addressParts.push(provinceObj.label);
        } else if (selectedRegion && selectedRegion === "130000000") {
            addressParts.push("Metro Manila");
        }

        if (selectedRegion) {
            const regionObj = regions.find(r => r.value === selectedRegion);
            if (regionObj) addressParts.push(regionObj.label);
        }

        addressParts.push("Philippines");

        const fullAddress = addressParts.join(", ");

        onConfirm?.({
            region: selectedRegion
                ? regions.find(r => r.value === selectedRegion)
                : null,
            province: selectedProvince
                ? provinces.find(p => p.value === selectedProvince)
                : null,
            city: selectedCity
                ? cities.find(c => c.value === selectedCity)
                : null,
            barangay: selectedBarangay
                ? barangays.find(b => b.value === selectedBarangay)
                : null,
            fullAddress
        });
        handleClose();
    };

    const handleClose = () => {
        setSelectedRegion(null);
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
                        <h2 className="text-lg font-bold text-gray-800">
                            Set Address Manually
                        </h2>
                        <p className="text-xs text-gray-400 mt-0.5">
                            Find properties near a specific address
                        </p>
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
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                            Region
                        </label>
                        <Select
                            options={regions}
                            value={selectedRegion}
                            onChange={setSelectedRegion}
                            placeholder="Select region"
                            isSearchable={true}
                            isLoading={loadingRegions}
                        />
                    </div>

                    {/* Only show province if region is NOT NCR */}
                    {selectedRegion && selectedRegion !== "130000000" && (
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                                Province
                            </label>
                            <Select
                                options={provinces}
                                value={selectedProvince}
                                onChange={setSelectedProvince}
                                placeholder="Select province"
                                isSearchable={true}
                                isLoading={loadingProvinces}
                                isDisabled={!selectedRegion}
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                            Municipality / City
                        </label>
                        <Select
                            options={cities}
                            value={selectedCity}
                            onChange={setSelectedCity}
                            placeholder={
                                selectedRegion
                                    ? "Select city or municipality"
                                    : "Select a region first"
                            }
                            isSearchable={true}
                            isLoading={loadingCities}
                            isDisabled={!selectedRegion}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                            Barangay
                        </label>
                        <Select
                            options={barangays}
                            value={selectedBarangay}
                            onChange={setSelectedBarangay}
                            placeholder={
                                selectedCity
                                    ? "Select barangay"
                                    : "Select a city first"
                            }
                            isSearchable={true}
                            isLoading={loadingBarangays}
                            isDisabled={!selectedCity}
                        />
                    </div>

                    {/* Address preview */}
                    {isComplete && (
                        <div className="flex items-start gap-2.5 px-4 py-3 bg-green-50 rounded-xl border border-green-100">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                            <p className="text-xs text-green-700 leading-relaxed">
                                {(() => {
                                    const parts = [];
                                    if (selectedBarangay) {
                                        const b = barangays.find(
                                            b => b.value === selectedBarangay
                                        );
                                        if (b) parts.push(b.label);
                                    }
                                    if (selectedCity) {
                                        const c = cities.find(
                                            c => c.value === selectedCity
                                        );
                                        if (c) parts.push(c.label);
                                    }
                                    if (selectedProvince) {
                                        const p = provinces.find(
                                            p => p.value === selectedProvince
                                        );
                                        if (p) parts.push(p.label);
                                    } else if (selectedRegion === "130000000") {
                                        parts.push("Metro Manila");
                                    }
                                    if (selectedRegion) {
                                        const r = regions.find(
                                            r => r.value === selectedRegion
                                        );
                                        if (r) parts.push(r.label);
                                    }
                                    parts.push("Philippines");
                                    return parts.join(", ");
                                })()}
                            </p>
                        </div>
                    )}
                </div>

                {/* Actions - Using Button component with responsive flex-col on mobile */}
                <div className="flex flex-col sm:flex-row gap-3 px-6 pb-6">
                    <Button
                        variant="ghost"
                        onClick={handleClose}
                        className="flex-1 w-full sm:w-auto !bg-gray-300 !text-gray-100"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        icon={MapPin}
                        onClick={handleConfirm}
                        disabled={!isComplete}
                        className={`flex-1 w-full truncate sm:w-auto ${!isComplete && "opacity-50 cursor-not-allowed"}`}
                    >
                        Set Location
                    </Button>
                </div>
            </div>
        </ModalPortal>
    );
};

export default SetAddressManuallyModal;
