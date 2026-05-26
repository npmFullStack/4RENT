// src/features/(app)/components/RepairDamageModal.jsx
import React, { useState, useEffect } from "react";
import ModalPortal from "@/shared/components/ModalPortal";
import Button from "@/shared/components/Button";
import DatePicker from "@/shared/components/DatePicker";
import {
    X,
    PhilippinePeso,
    Calendar,
    Loader2,
    Save,
    AlertCircle,
    CheckCircle
} from "lucide-react";

const RepairDamageModal = ({
    isOpen,
    onClose,
    onConfirm,
    repair,
    isLoading = false
}) => {
    const [damageName, setDamageName] = useState("");
    const [totalCost, setTotalCost] = useState("");
    const [dateFixed, setDateFixed] = useState(null);
    const [errors, setErrors] = useState({});

    // Reset form when modal opens with new repair data
    useEffect(() => {
        if (isOpen && repair) {
            setDamageName(repair.damageName || "");
            setTotalCost(repair.totalCost?.toString() || "");
            setDateFixed(repair.dateFixed ? new Date(repair.dateFixed) : null);
            setErrors({});
        }
    }, [isOpen, repair]);

    if (!isOpen || !repair) return null;

    const validateForm = () => {
        const newErrors = {};

        if (!damageName.trim()) {
            newErrors.damageName = "Damage name is required";
        }

        const cost = parseFloat(totalCost);
        if (!totalCost) {
            newErrors.totalCost = "Total cost is required";
        } else if (isNaN(cost) || cost < 0) {
            newErrors.totalCost = "Please enter a valid amount";
        } else if (cost > 10000000) {
            newErrors.totalCost = "Amount exceeds maximum limit (₱10,000,000)";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;

        const formattedDateFixed = dateFixed
            ? dateFixed.toISOString().split("T")[0]
            : null;

        onConfirm({
            damageName: damageName.trim(),
            totalCost: parseFloat(totalCost),
            dateFixed: formattedDateFixed
        });
    };

    const formatCurrency = value => {
        if (!value) return "";
        const num = parseFloat(value);
        if (isNaN(num)) return value;
        return num.toLocaleString();
    };

    const handleTotalCostChange = e => {
        let value = e.target.value;

        // Allow empty string
        if (value === "") {
            setTotalCost("");
            return;
        }

        // Remove existing commas
        value = value.replace(/,/g, "");

        // Check if it's a valid number
        if (!/^\d*\.?\d*$/.test(value)) return;

        const numValue = parseFloat(value);
        if (!isNaN(numValue) && numValue > 10000000) {
            setTotalCost("10000000");
        } else {
            setTotalCost(value);
        }
    };

    return (
        <ModalPortal isOpen={isOpen} onClose={onClose}>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content - Neutral/Soft design */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white shadow-2xl z-[70] transform transition-all duration-300 ease-in-out rounded-xl overflow-hidden">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-5 py-3 flex justify-between items-center">
                    <div className="flex items-center">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Edit Repair
                        </h2>
                    </div>
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        disabled={isLoading}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors !p-0 !w-auto !h-auto"
                        icon={X}
                        aria-label="Close"
                    />
                </div>

                {/* Content Area */}
                <div className="p-5 space-y-5 max-h-[calc(100vh-180px)] overflow-y-auto">
                    {/* Damage Info Card */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                                Damage ID
                            </span>
                            <span className="font-mono text-xs font-semibold text-gray-700">
                                {repair.damageId}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                                Property ID
                            </span>
                            <span className="font-mono text-xs font-semibold text-gray-700">
                                {repair.propertyFormattedId}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                                Date Issued
                            </span>
                            <span className="text-xs text-gray-600">
                                {new Date(repair.dateIssued).toLocaleDateString(
                                    "en-US",
                                    {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric"
                                    }
                                )}
                            </span>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                            <span className="text-xs text-gray-500">
                                Current Status
                            </span>
                            <span
                                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                    repair.status === "fixed"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-orange-100 text-orange-700"
                                }`}
                            >
                                {repair.status === "fixed"
                                    ? "Fixed"
                                    : "Pending"}
                            </span>
                        </div>
                    </div>

                    {/* Damage Name Field */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                            Damage Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={damageName}
                            onChange={e => setDamageName(e.target.value)}
                            placeholder="e.g., Broken Window, Leaking Pipe"
                            className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent ${
                                errors.damageName
                                    ? "border-red-500 bg-red-50"
                                    : "border-gray-300"
                            }`}
                        />
                        {errors.damageName && (
                            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {errors.damageName}
                            </p>
                        )}
                    </div>

                    {/* Total Cost Field with Philippine Peso */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                            Total Cost <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                <PhilippinePeso className="w-4 h-4" />
                            </span>
                            <input
                                type="text"
                                value={
                                    totalCost
                                        ? formatCurrency(totalCost)
                                        : totalCost
                                }
                                onChange={handleTotalCostChange}
                                placeholder="0.00"
                                className={`w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent ${
                                    errors.totalCost
                                        ? "border-red-500 bg-red-50"
                                        : "border-gray-300"
                                }`}
                            />
                        </div>
                        {errors.totalCost ? (
                            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {errors.totalCost}
                            </p>
                        ) : (
                            <p className="mt-1 text-xs text-gray-500">
                                Enter the total repair cost in Philippine Peso
                                (₱)
                            </p>
                        )}
                    </div>

                    {/* Date Fixed Field with DatePicker */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                            Date Fixed
                        </label>
                        <DatePicker
                            value={dateFixed}
                            onChange={setDateFixed}
                            placeholder="Select completion date"
                            className="w-full"
                            formatDate={date => {
                                return date.toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric"
                                });
                            }}
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            {repair.status === "fixed"
                                ? "This repair is already marked as fixed. You can update the date if needed."
                                : "Set the date when this repair was completed. Status will auto-update to Fixed."}
                        </p>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 px-5 py-4 flex gap-3">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        icon={isLoading ? Loader2 : Save}
                    >
                        {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </div>
        </ModalPortal>
    );
};

export default RepairDamageModal;
