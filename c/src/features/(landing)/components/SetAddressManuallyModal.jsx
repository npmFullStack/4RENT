// src/features/(landing)/components/SetAddressManuallyModal.jsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import ModalPortal from "@/shared/components/ModalPortal";
import Select from "@/shared/components/Select";
import Button from "@/shared/components/Button";
import Toast from "@/shared/components/Toast";
import { MapPin, X, CheckCircle } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// PSGC API  →  Province / City / Barangay  (no key needed)
// Photon API →  Street autocomplete         (no key needed, CORS-friendly, free)
//
// Photon is built by Komoot on top of OpenStreetMap data.
// Public endpoint: https://photon.komoot.io
// No signup, no API key, works directly from the browser.
// ─────────────────────────────────────────────────────────────────────────────

const BASE   = "https://psgc.gitlab.io/api";
const PHOTON = "https://photon.komoot.io/api";

const sort = arr => [...arr].sort((a, b) => a.name.localeCompare(b.name));

// ── StreetAutocomplete — powered by Photon (Komoot / OpenStreetMap) ───────────
const StreetAutocomplete = ({ value, onChange, cityHint, barangayHint, disabled }) => {
    const [query,       setQuery]       = useState(value ?? "");
    const [suggestions, setSuggestions] = useState([]);
    const [open,        setOpen]        = useState(false);
    const [loading,     setLoading]     = useState(false);
    const debounceRef  = useRef(null);
    const abortRef     = useRef(null);
    const containerRef = useRef(null);

    // Sync when parent clears value
    useEffect(() => { if (!value) setQuery(""); }, [value]);

    // Close dropdown on outside click
    useEffect(() => {
        const handler = e => {
            if (containerRef.current && !containerRef.current.contains(e.target))
                setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const fetchSuggestions = useCallback(async (input) => {
        if (!input.trim() || input.length < 1) {
            setSuggestions([]);
            setOpen(false);
            return;
        }

        // Cancel any previous in-flight request
        abortRef.current?.abort();
        abortRef.current = new AbortController();

        setLoading(true);

        try {
            // Append barangay > city hint so Photon returns barangay-scoped results
            const locationHint = barangayHint
                ? `${barangayHint}, ${cityHint ?? ""}, Philippines`
                : cityHint
                ? `${cityHint}, Philippines`
                : "Philippines";
            const q = `${input}, ${locationHint}`;

            const params = new URLSearchParams({
                q,
                limit: "6",
                lang:  "en",
                // Bias results to Philippines bounding box
                // so "Rizal" doesn't return results from Spain
                bbox: "116.87,4.59,126.60,21.12",
            });

            const res = await fetch(`${PHOTON}?${params}`, {
                signal: abortRef.current.signal,
            });

            const data = await res.json();
            const features = data?.features ?? [];

            // Build clean label from Photon's structured address properties
            const items = features.map(f => {
                const p = f.properties ?? {};
                // Main: house number + street name
                const street = [p.housenumber, p.street || p.name]
                    .filter(Boolean).join(" ");
                // Secondary: district / city / state
                const secondary = [p.district || p.suburb, p.city || p.town || p.village]
                    .filter(Boolean).join(", ");
                return {
                    id:        `${f.properties?.osm_id}-${f.properties?.osm_type}`,
                    main:      street || p.name || "",
                    secondary: secondary || p.state || "",
                };
            }).filter(i => i.main); // drop results with no street name

            // De-duplicate by main label
            const seen  = new Set();
            const unique = items.filter(i => {
                if (seen.has(i.main)) return false;
                seen.add(i.main);
                return true;
            });

            setSuggestions(unique);
            setOpen(unique.length > 0);
        } catch (err) {
            if (err.name !== "AbortError") {
                setSuggestions([]);
                setOpen(false);
            }
        } finally {
            setLoading(false);
        }
    }, [cityHint, barangayHint]);

    const handleInputChange = e => {
        const val = e.target.value;
        setQuery(val);
        onChange(val);

        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => fetchSuggestions(val), 400);
    };

    const handleSelect = item => {
        setQuery(item.main);
        onChange(item.main);
        setSuggestions([]);
        setOpen(false);
    };

    const handleKeyDown = e => {
        if (e.key === "Escape") setOpen(false);
    };

    return (
        <div ref={containerRef} className="relative">
            <input
                type="text"
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => suggestions.length > 0 && setOpen(true)}
                disabled={disabled}
                placeholder={loading ? "Searching…" : "e.g. Rizal Street, 123 Mabini St"}
                className={[
                    "w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5",
                    "text-sm text-gray-800 placeholder-gray-400",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                    "transition-shadow",
                    disabled ? "opacity-50 cursor-not-allowed bg-gray-50" : "",
                ].join(" ")}
            />

            {/* Suggestions dropdown */}
            {open && suggestions.length > 0 && (
                <ul className="absolute z-50 mt-1 w-full rounded-xl border border-gray-100 bg-white shadow-lg overflow-hidden">
                    {suggestions.map(s => (
                        <li
                            key={s.id}
                            onMouseDown={() => handleSelect(s)}
                            className="flex flex-col px-4 py-2.5 cursor-pointer hover:bg-green-50 transition-colors"
                        >
                            <span className="text-sm font-medium text-gray-800">{s.main}</span>
                            {s.secondary && (
                                <span className="text-xs text-gray-400 mt-0.5">{s.secondary}</span>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────

const SetAddressManuallyModal = ({ isOpen, onClose, onConfirm }) => {
    // ── Raw data ───────────────────────────────────────────────────────────
    const [provinces,         setProvinces]         = useState([]);
    const [independentCities, setIndependentCities]  = useState([]);
    const [cities,            setCities]             = useState([]);
    const [barangays,         setBarangays]          = useState([]);

    // ── Selections ─────────────────────────────────────────────────────────
    const [provinceOrCity,   setProvinceOrCity]   = useState(null);
    const [selectedCity,     setSelectedCity]     = useState(null);
    const [selectedBarangay, setSelectedBarangay] = useState(null);
    const [streetText,       setStreetText]       = useState("");

    // ── Loading flags ──────────────────────────────────────────────────────
    const [loadingInit,      setLoadingInit]      = useState(false);
    const [loadingCities,    setLoadingCities]    = useState(false);
    const [loadingBarangays, setLoadingBarangays] = useState(false);

    // ── Derived ────────────────────────────────────────────────────────────
    const isIndependentCity = !!provinceOrCity &&
        independentCities.some(c => c.code === provinceOrCity);

    // ── Reset ──────────────────────────────────────────────────────────────
    const resetAll = useCallback(() => {
        setProvinceOrCity(null);
        setSelectedCity(null);
        setSelectedBarangay(null);
        setStreetText("");
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
                const indep = cityData.filter(c => !c.provinceCode && c.provinceCode !== 0);
                setIndependentCities(sort(indep));
            })
            .catch(() => Toast.error("Failed to load location data. Please try again."))
            .finally(() => setLoadingInit(false));
    }, [isOpen, resetAll]);

    // ── Grouped province/city options ──────────────────────────────────────
    const provinceOptions = [
        {
            label: "Provinces",
            options: provinces.map(p => ({ value: p.code, label: p.name, _type: "province" })),
        },
        {
            label: "Independent Cities",
            options: independentCities.map(c => ({ value: c.code, label: c.name, _type: "independent_city" })),
        },
    ];

    // ── Handle province/city change ────────────────────────────────────────
    const handleProvinceOrCityChange = (val) => {
        setSelectedCity(null);
        setSelectedBarangay(null);
        setStreetText("");
        setCities([]);
        setBarangays([]);

        if (!val) { setProvinceOrCity(null); return; }
        setProvinceOrCity(val);

        const isIndep = independentCities.some(c => c.code === val);
        if (!isIndep) {
            setLoadingCities(true);
            fetch(`${BASE}/provinces/${val}/cities-municipalities/`)
                .then(r => r.json())
                .then(data => setCities(sort(data).map(c => ({ value: c.code, label: c.name }))))
                .catch(() => { Toast.error("Failed to load cities. Please try again."); setCities([]); })
                .finally(() => setLoadingCities(false));
        }
    };

    // ── Fetch barangays ────────────────────────────────────────────────────
    const cityCodeForBarangay = isIndependentCity ? provinceOrCity : selectedCity;

    useEffect(() => {
        setSelectedBarangay(null);
        setStreetText("");
        setBarangays([]);

        if (!cityCodeForBarangay) return;

        setLoadingBarangays(true);
        fetch(`${BASE}/cities-municipalities/${cityCodeForBarangay}/barangays/`)
            .then(r => r.json())
            .then(data => setBarangays(sort(data).map(b => ({ value: b.code, label: b.name }))))
            .catch(() => { Toast.error("Failed to load barangays. Please try again."); setBarangays([]); })
            .finally(() => setLoadingBarangays(false));
    }, [cityCodeForBarangay]);

    // ── Build address ──────────────────────────────────────────────────────
    const isComplete = !!provinceOrCity;

    const buildAddressParts = () => {
        const parts = [];

        if (streetText.trim()) parts.push(streetText.trim());

        if (selectedBarangay) {
            const b = barangays.find(x => x.value === selectedBarangay);
            if (b) parts.push(b.label);
        }

        if (isIndependentCity) {
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
        const parts       = buildAddressParts();
        const fullAddress = parts.join(", ");

        const provinceObj = !isIndependentCity
            ? (provinces.find(x => x.code === provinceOrCity) ?? null) : null;

        const cityObj = isIndependentCity
            ? (independentCities.find(x => x.code === provinceOrCity) ?? null)
            : (cities.find(x => x.value === selectedCity) ?? null);

        const barangayObj = selectedBarangay
            ? (barangays.find(x => x.value === selectedBarangay) ?? null) : null;

        onConfirm?.({
            street:           streetText.trim() || null,
            province:         provinceObj  ? { value: provinceObj.code,  label: provinceObj.name  } : null,
            city:             cityObj      ? { value: cityObj.code,       label: cityObj.name      } : null,
            barangay:         barangayObj  ? { value: barangayObj.value,  label: barangayObj.label } : null,
            isIndependentCity,
            fullAddress,
            geocodeParts: parts,
        });

        Toast.success("Location set successfully!");
        handleClose();
    };

    // ── Close ──────────────────────────────────────────────────────────────
    const handleClose = () => { resetAll(); onClose(); };

    const provinceOrCityValue = provinceOrCity ?? null;

    // City name hint passed to Photon to bias street results locally
    const cityHint = isIndependentCity
        ? independentCities.find(x => x.code === provinceOrCity)?.name
        : cities.find(x => x.value === selectedCity)?.label;

    // Barangay name hint to scope street results within the barangay
    const barangayHint = selectedBarangay
        ? barangays.find(x => x.value === selectedBarangay)?.label
        : null;

    return (
        <ModalPortal isOpen={isOpen} onClose={handleClose}>
            <div className="relative">
                {/* Header */}
                <div className="flex items-center gap-3 px-6 pt-6 pb-4 border-b border-gray-100">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-bold text-gray-800">Set Address Manually</h2>
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
                            onChange={val => handleProvinceOrCityChange(val)}
                            placeholder={loadingInit ? "Loading…" : "Select province or city"}
                            isSearchable
                            isLoading={loadingInit}
                            isDisabled={loadingInit}
                        />
                    </div>

                    {/* Municipality / City */}
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

                    {/* Barangay */}
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

                    {/* Street — Photon autocomplete, no API key needed */}
                    {cityCodeForBarangay && (
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                                Street
                                <span className="ml-1 text-gray-400 normal-case font-normal">(optional)</span>
                            </label>
                            <StreetAutocomplete
                                value={streetText}
                                onChange={setStreetText}
                                cityHint={cityHint}
                                barangayHint={barangayHint}
                                disabled={false}
                            />
                        </div>
                    )}

                    {/* Address preview */}
                    {previewAddress && (
                        <div className="flex items-start gap-2.5 px-4 py-3 bg-green-50 rounded-xl border border-green-100">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                            <p className="text-xs text-green-700 leading-relaxed">{previewAddress}</p>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex flex-col-reverse sm:flex-row gap-3 px-6 pb-6">
                    <Button variant="ghost" onClick={handleClose} className="flex-1 w-full sm:w-auto">
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