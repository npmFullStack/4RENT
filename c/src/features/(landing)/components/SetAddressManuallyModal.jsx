// src/features/(landing)/components/SetAddressManuallyModal.jsx
import React, { useState, useEffect } from "react";
import ModalPortal from "@/shared/components/ModalPortal";
import Select from "@/shared/components/Select";
import Button from "@/shared/components/Button";
import { MapPin, X, CheckCircle } from "lucide-react";

const SetAddressManuallyModal = ({ isOpen, onClose, onConfirm }) => {
    const [regions, setRegions] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [barangays, setBarangays] = useState([]);

    const [selectedRegion, setSelectedRegion] = useState(null);
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedBarangay, setSelectedBarangay] = useState(null);

    const [loadingRegions, setLoadingRegions] = useState(false);
    const [loadingProvinces, setLoadingProvinces] = useState(false);
    const [loadingCities, setLoadingCities] = useState(false);
    const [loadingBarangays, setLoadingBarangays] = useState(false);

    const isNCR = selectedRegion === "130000000";

    // ── Fetch regions on open ──────────────────────────────────────────────
    useEffect(() => {
        if (!isOpen) return;
        setLoadingRegions(true);
        fetch("https://psgc.gitlab.io/api/regions/")
            .then(r => r.json())
            .then(data => {
                const sorted = [...data].sort((a, b) => a.name.localeCompare(b.name));
                setRegions(sorted.map(r => ({ value: r.code, label: r.name })));
            })
            .catch(() => setRegions([]))
            .finally(() => setLoadingRegions(false));
    }, [isOpen]);

    // ── Reset cascades when region changes ────────────────────────────────
    useEffect(() => {
        setSelectedProvince(null);
        setSelectedCity(null);
        setSelectedBarangay(null);
        setProvinces([]);
        setCities([]);
        setBarangays([]);

        if (!selectedRegion) return;

        if (isNCR) {
            // NCR has no provinces — load cities directly
            setLoadingCities(true);
            fetch(`https://psgc.gitlab.io/api/regions/${selectedRegion}/cities-municipalities/`)
                .then(r => r.json())
                .then(data => {
                    const sorted = [...data].sort((a, b) => a.name.localeCompare(b.name));
                    setCities(sorted.map(c => ({ value: c.code, label: c.name })));
                })
                .catch(() => setCities([]))
                .finally(() => setLoadingCities(false));
        } else {
            setLoadingProvinces(true);
            fetch(`https://psgc.gitlab.io/api/regions/${selectedRegion}/provinces/`)
                .then(r => r.json())
                .then(data => {
                    const sorted = [...data].sort((a, b) => a.name.localeCompare(b.name));
                    setProvinces(sorted.map(p => ({ value: p.code, label: p.name })));
                })
                .catch(() => setProvinces([]))
                .finally(() => setLoadingProvinces(false));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedRegion]);

    // ── Fetch cities when province changes (non-NCR) ──────────────────────
    useEffect(() => {
        if (isNCR) return; // cities already loaded for NCR above
        setSelectedCity(null);
        setSelectedBarangay(null);
        setCities([]);
        setBarangays([]);

        if (!selectedProvince) return;

        setLoadingCities(true);
        fetch(`https://psgc.gitlab.io/api/provinces/${selectedProvince}/cities-municipalities/`)
            .then(r => r.json())
            .then(data => {
                const sorted = [...data].sort((a, b) => a.name.localeCompare(b.name));
                setCities(sorted.map(c => ({ value: c.code, label: c.name })));
            })
            .catch(() => setCities([]))
            .finally(() => setLoadingCities(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedProvince]);

    // ── Fetch barangays when city changes ─────────────────────────────────
    useEffect(() => {
        setSelectedBarangay(null);
        setBarangays([]);

        if (!selectedCity) return;

        setLoadingBarangays(true);
        fetch(`https://psgc.gitlab.io/api/cities-municipalities/${selectedCity}/barangays/`)
            .then(r => r.json())
            .then(data => {
                const sorted = [...data].sort((a, b) => a.name.localeCompare(b.name));
                setBarangays(sorted.map(b => ({ value: b.code, label: b.name })));
            })
            .catch(() => setBarangays([]))
            .finally(() => setLoadingBarangays(false));
    }, [selectedCity]);

    // ── Address is "complete enough" to pin if at least a region is chosen.
    //    NCR needs a city (no province). Other regions need at least a province.
    const isComplete = selectedRegion &&
        (isNCR ? true : selectedProvince !== null);

    // ── Build geocodable address parts from most-specific to least ────────
    const buildAddressParts = () => {
        const parts = [];
        if (selectedBarangay) {
            const b = barangays.find(x => x.value === selectedBarangay);
            if (b) parts.push(b.label);
        }
        if (selectedCity) {
            const c = cities.find(x => x.value === selectedCity);
            if (c) parts.push(c.label);
        }
        if (selectedProvince) {
            const p = provinces.find(x => x.value === selectedProvince);
            if (p) parts.push(p.label);
        } else if (isNCR) {
            parts.push("Metro Manila");
        }
        if (selectedRegion) {
            const r = regions.find(x => x.value === selectedRegion);
            if (r) parts.push(r.label);
        }
        parts.push("Philippines");
        return parts;
    };

    const previewAddress = isComplete ? buildAddressParts().join(", ") : null;

    const handleConfirm = () => {
        const parts = buildAddressParts();
        const fullAddress = parts.join(", ");

        onConfirm?.({
            region:    selectedRegion   ? regions.find(x => x.value === selectedRegion)   : null,
            province:  selectedProvince ? provinces.find(x => x.value === selectedProvince) : null,
            city:      selectedCity     ? cities.find(x => x.value === selectedCity)       : null,
            barangay:  selectedBarangay ? barangays.find(x => x.value === selectedBarangay): null,
            fullAddress,
            // Structured parts for accurate geocoding (most → least specific)
            geocodeParts: parts
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
                    {/* Region */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                            Region
                        </label>
                        <Select
                            options={regions}
                            value={selectedRegion}
                            onChange={val => setSelectedRegion(val)}
                            placeholder="Select region"
                            isSearchable
                            isLoading={loadingRegions}
                        />
                    </div>

                    {/* Province — hidden for NCR */}
                    {selectedRegion && !isNCR && (
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                                Province
                            </label>
                            <Select
                                options={provinces}
                                value={selectedProvince}
                                onChange={val => setSelectedProvince(val)}
                                placeholder={loadingProvinces ? "Loading…" : "Select province"}
                                isSearchable
                                isLoading={loadingProvinces}
                                isDisabled={!selectedRegion || loadingProvinces}
                            />
                        </div>
                    )}

                    {/* Municipality / City — always shown once region (+ province for non-NCR) chosen */}
                    {(isNCR || selectedProvince) && (
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                                Municipality / City
                                <span className="ml-1 text-gray-400 normal-case font-normal">(optional)</span>
                            </label>
                            <Select
                                options={cities}
                                value={selectedCity}
                                onChange={val => setSelectedCity(val)}
                                placeholder={loadingCities ? "Loading…" : "Select city or municipality"}
                                isSearchable
                                isLoading={loadingCities}
                                isDisabled={loadingCities}
                            />
                        </div>
                    )}

                    {/* Barangay — shown once city chosen */}
                    {selectedCity && (
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                                Barangay
                                <span className="ml-1 text-gray-400 normal-case font-normal">(optional)</span>
                            </label>
                            <Select
                                options={barangays}
                                value={selectedBarangay}
                                onChange={val => setSelectedBarangay(val)}
                                placeholder={loadingBarangays ? "Loading…" : "Select barangay"}
                                isSearchable
                                isLoading={loadingBarangays}
                                isDisabled={loadingBarangays}
                            />
                        </div>
                    )}

                    {/* Address preview */}
                    {previewAddress && (
                        <div className="flex items-start gap-2.5 px-4 py-3 bg-green-50 rounded-xl border border-green-100">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                            <p className="text-xs text-green-700 leading-relaxed">
                                {previewAddress}
                            </p>
                        </div>
                    )}
                </div>

                {/* Actions */}
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
                        className={`flex-1 w-full truncate sm:w-auto ${!isComplete ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        Set Location
                    </Button>
                </div>
            </div>
        </ModalPortal>
    );
};

export default SetAddressManuallyModal;