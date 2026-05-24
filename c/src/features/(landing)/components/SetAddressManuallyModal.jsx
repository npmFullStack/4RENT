// src/features/(landing)/components/SetAddressManuallyModal.jsx
import React, { useState, useEffect, useCallback } from "react";
import ModalPortal from "@/shared/components/ModalPortal";
import Select from "@/shared/components/Select";
import Button from "@/shared/components/Button";
import { MapPin, X, CheckCircle } from "lucide-react";
import { toast } from "sonner"; // or your toast lib: react-hot-toast / react-toastify

// ─────────────────────────────────────────────────────────────────────────────
// The PSGC API returns cities/municipalities with an optional `provinceCode`.
// Cities that have NO provinceCode are "independent cities" (e.g. Manila,
// Davao City, Cebu City) and are NOT nested under any province.
//
// Strategy (no region selector):
//   1. On open → fetch ALL provinces + ALL cities in parallel.
//   2. Build province dropdown  = provinces (sorted).
//   3. Build "independent cities" = cities where provinceCode is absent/null.
//   4. Province Select uses grouped options:
//        group "Provinces"           → regular provinces
//        group "Independent Cities"  → province-less cities
//   5. When user picks a regular province → fetch its cities.
//   6. When user picks an independent city → skip city step, go straight to barangay.
// ─────────────────────────────────────────────────────────────────────────────

const BASE = "https://psgc.gitlab.io/api";

const sort = arr => [...arr].sort((a, b) => a.name.localeCompare(b.name));

const SetAddressManuallyModal = ({ isOpen, onClose, onConfirm }) => {
    // ── Raw data ───────────────────────────────────────────────────────────
    const [provinces,        setProvinces]        = useState([]);
    const [independentCities, setIndependentCities] = useState([]);
    const [cities,           setCities]           = useState([]);
    const [barangays,        setBarangays]         = useState([]);

    // ── Selections ─────────────────────────────────────────────────────────
    // provinceOrCity holds either a province code OR an independent-city code.
    // isIndependentCity is DERIVED by checking if the code exists in independentCities
    // — never rely on option._type from the Select callback.
    const [provinceOrCity,  setProvinceOrCity]  = useState(null);
    const [selectedCity,    setSelectedCity]    = useState(null);
    const [selectedBarangay,setSelectedBarangay]= useState(null);

    // ── Loading flags ──────────────────────────────────────────────────────
    const [loadingInit,     setLoadingInit]     = useState(false);
    const [loadingCities,   setLoadingCities]   = useState(false);
    const [loadingBarangays,setLoadingBarangays]= useState(false);

    // ── Derived — look up the selected code in independentCities array ────
    // Reliable regardless of whether Select passes back option._type.
    const isIndependentCity = !!provinceOrCity &&
        independentCities.some(c => c.code === provinceOrCity);

    // ── Reset all state ────────────────────────────────────────────────────
    const resetAll = useCallback(() => {
        setProvinceOrCity(null);
        setSelectedCity(null);
        setSelectedBarangay(null);
        setCities([]);
        setBarangays([]);
    }, []);

    // ── Fetch provinces + all cities on open ───────────────────────────────
    useEffect(() => {
        if (!isOpen) return;
        resetAll();
        setLoadingInit(true);

        Promise.all([
            fetch(`${BASE}/provinces/`).then(r => r.json()),
            fetch(`${BASE}/cities-municipalities/`).then(r => r.json()),
        ])
            .then(([provData, cityData]) => {
                setProvinces(sort(provData));

                // Independent cities = those without a provinceCode
                const indep = cityData.filter(
                    c => !c.provinceCode && c.provinceCode !== 0
                );
                setIndependentCities(sort(indep));
            })
            .catch(() => {
                toast.error("Failed to load location data. Please try again.");
            })
            .finally(() => setLoadingInit(false));
    }, [isOpen, resetAll]);

    // ── Build grouped options for the Province / City select ──────────────
    const provinceOptions = [
        {
            label: "Provinces",
            options: provinces.map(p => ({
                value:  p.code,
                label:  p.name,
                _type:  "province",
            })),
        },
        {
            label: "Independent Cities",
            options: independentCities.map(c => ({
                value:  c.code,
                label:  c.name,
                _type:  "independent_city",
            })),
        },
    ];

    // ── Handle province-or-city selection ─────────────────────────────────
    const handleProvinceOrCityChange = (val, option) => {
        // Reset downstream
        setSelectedCity(null);
        setSelectedBarangay(null);
        setCities([]);
        setBarangays([]);

        if (!val) {
            setProvinceOrCity(null);
            return;
        }

        setProvinceOrCity(val);

        // Determine type by checking if val exists in independentCities
        const isIndep = independentCities.some(c => c.code === val);

        if (!isIndep) {
            // Fetch cities under this province
            setLoadingCities(true);
            fetch(`${BASE}/provinces/${val}/cities-municipalities/`)
                .then(r => r.json())
                .then(data => {
                    setCities(sort(data).map(c => ({ value: c.code, label: c.name })));
                })
                .catch(() => {
                    toast.error("Failed to load cities. Please try again.");
                    setCities([]);
                })
                .finally(() => setLoadingCities(false));
        }
        // For independent city: no city fetch needed; go straight to barangay
    };

    // ── Fetch barangays when city (or independent city) is chosen ─────────
    const cityCodeForBarangay = isIndependentCity ? provinceOrCity : selectedCity;

    useEffect(() => {
        setSelectedBarangay(null);
        setBarangays([]);

        if (!cityCodeForBarangay) return;

        setLoadingBarangays(true);
        fetch(`${BASE}/cities-municipalities/${cityCodeForBarangay}/barangays/`)
            .then(r => r.json())
            .then(data => {
                setBarangays(sort(data).map(b => ({ value: b.code, label: b.name })));
            })
            .catch(() => {
                toast.error("Failed to load barangays. Please try again.");
                setBarangays([]);
            })
            .finally(() => setLoadingBarangays(false));
    }, [cityCodeForBarangay]);

    // ── Completeness: need at least a province or independent city ─────────
    const isComplete = !!provinceOrCity;

    // ── Build address parts (most → least specific) ────────────────────────
    const buildAddressParts = () => {
        const parts = [];

        if (selectedBarangay) {
            const b = barangays.find(x => x.value === selectedBarangay);
            if (b) parts.push(b.label);
        }

        if (isIndependentCity) {
            // provinceOrCity IS the city
            const ic = independentCities.find(x => x.code === provinceOrCity);
            if (ic) parts.push(ic.name);
        } else {
            if (selectedCity) {
                const c = cities.find(x => x.value === selectedCity);
                if (c) parts.push(c.label);
            }
            const p = provinces.find(x => x.code === provinceOrCity);
            if (p) parts.push(p.name);
        }

        parts.push("Philippines");
        return parts;
    };

    const previewAddress = isComplete ? buildAddressParts().join(", ") : null;

    // ── Confirm ────────────────────────────────────────────────────────────
    const handleConfirm = () => {
        const parts     = buildAddressParts();
        const fullAddress = parts.join(", ");

        const provinceObj = !isIndependentCity
            ? (provinces.find(x => x.code === provinceOrCity) ?? null)
            : null;

        const cityObj = isIndependentCity
            ? (independentCities.find(x => x.code === provinceOrCity) ?? null)
            : (cities.find(x => x.value === selectedCity) ?? null);

        const barangayObj = selectedBarangay
            ? (barangays.find(x => x.value === selectedBarangay) ?? null)
            : null;

        onConfirm?.({
            province:     provinceObj  ? { value: provinceObj.code,   label: provinceObj.name   } : null,
            city:         cityObj      ? { value: cityObj.code,        label: cityObj.name       } : null,
            barangay:     barangayObj  ? { value: barangayObj.value,   label: barangayObj.label  } : null,
            isIndependentCity,
            fullAddress,
            geocodeParts: parts,
        });

        toast.success("Location set successfully!");
        handleClose();
    };

    // ── Close ──────────────────────────────────────────────────────────────
    const handleClose = () => {
        resetAll();
        onClose();
    };

    // ── Current value for the province/city select ─────────────────────────
    // We need to pass the flat value; the Select component resolves via grouped options
    const provinceOrCityValue = provinceOrCity ?? null;

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

                    {/* Province / Independent City */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                            Province / City
                        </label>
                        <Select
                            options={provinceOptions}
                            value={provinceOrCityValue}
                            onChange={(val, option) => handleProvinceOrCityChange(val, option)}
                            placeholder={loadingInit ? "Loading…" : "Select province or city"}
                            isSearchable
                            isLoading={loadingInit}
                            isDisabled={loadingInit}
                        />
                    </div>

                    {/* Municipality / City — only for regular provinces */}
                    {provinceOrCity && !isIndependentCity && (
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

                    {/* Barangay — shown once a city/municipality is resolved */}
                    {cityCodeForBarangay && (
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

                {/* Actions
                    Mobile  : primary first (top), cancel below
                    Desktop : cancel left, primary right
                */}
                <div className="flex flex-col-reverse sm:flex-row gap-3 px-6 pb-6">
                    <Button
                        variant="ghost"
                        onClick={handleClose}
                        className="flex-1 w-full sm:w-auto"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        icon={MapPin}
                        onClick={handleConfirm}
                        disabled={!isComplete}
                        className={`flex-1 w-full sm:w-auto ${!isComplete ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        Set Location
                    </Button>
                </div>
            </div>
        </ModalPortal>
    );
};

export default SetAddressManuallyModal;