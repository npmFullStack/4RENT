// src/features/(app)/components/RecordPaymentModal.jsx
import React, { useState } from "react";
import ModalPortal from "@/shared/components/ModalPortal";
import Button from "@/shared/components/Button";
import {
    X,
    PhilippinePeso,
    Users,
    Home,
    CreditCard,
    Landmark,
    Smartphone,
    Wallet,
    Loader2,
    Plus
} from "lucide-react";

// Payment type options
const PAYMENT_TYPES = {
    FULL: "full",
    DOWNPAYMENT: "downpayment"
};

// Mode of payment options
const MODE_OF_PAYMENT = {
    IN_PERSON: "in_person",
    GCASH: "gcash"
};

const RecordPaymentModal = ({
    isOpen,
    onClose,
    onConfirm,
    tenant,
    isLoading = false
}) => {
    const [paymentType, setPaymentType] = useState(PAYMENT_TYPES.FULL);
    const [downpaymentAmount, setDownpaymentAmount] = useState("");
    const [modeOfPayment, setModeOfPayment] = useState(
        MODE_OF_PAYMENT.IN_PERSON
    );

    if (!isOpen || !tenant) return null;

    const monthlyRent = tenant.monthlyRent;
    const remainingBalance =
        paymentType === PAYMENT_TYPES.DOWNPAYMENT
            ? Math.max(0, monthlyRent - (parseFloat(downpaymentAmount) || 0))
            : 0;

    const hasBalance =
        paymentType === PAYMENT_TYPES.DOWNPAYMENT && remainingBalance > 0;

    const handleConfirm = () => {
        const paymentData = {
            tenantId: tenant.id,
            tenantName: `${tenant.firstName} ${tenant.lastName}`,
            paymentType,
            modeOfPayment,
            amountPaid:
                paymentType === PAYMENT_TYPES.FULL
                    ? monthlyRent
                    : parseFloat(downpaymentAmount) || 0,
            remainingBalance: hasBalance ? remainingBalance : 0,
            status: hasBalance ? "partial" : "paid",
            paymentDate: new Date().toISOString()
        };
        onConfirm(paymentData);
    };

    const getModeOfPaymentIcon = mode => {
        switch (mode) {
            case MODE_OF_PAYMENT.IN_PERSON:
                return <Wallet className="w-4 h-4" />;
            case MODE_OF_PAYMENT.GCASH:
                return <Smartphone className="w-4 h-4" />;
            default:
                return <CreditCard className="w-4 h-4" />;
        }
    };

    const getModeOfPaymentLabel = mode => {
        switch (mode) {
            case MODE_OF_PAYMENT.IN_PERSON:
                return "In Person (Cash)";
            case MODE_OF_PAYMENT.GCASH:
                return "GCash";
            default:
                return mode;
        }
    };

    return (
        <ModalPortal isOpen={isOpen} onClose={onClose}>
            <div className="relative p-6 max-w-md w-full">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
                    aria-label="Close"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="mb-6 pr-6">
                    <div className="flex items-center mb-2">
                        <h3 className="font-semibold text-gray-900 text-xl">
                            Record Payment
                        </h3>
                    </div>
                    <p className="text-sm text-gray-500">
                        Record rent payment for this tenant
                    </p>
                </div>

                {/* Tenant Info */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">
                            {tenant.firstName} {tenant.lastName}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Home className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                            {tenant.propertyName}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200">
                        <PhilippinePeso className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-semibold text-gray-800">
                            Monthly Rent: ₱{monthlyRent.toLocaleString()}
                        </span>
                    </div>
                </div>

                {/* Payment Type Selection */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setPaymentType(PAYMENT_TYPES.FULL)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                paymentType === PAYMENT_TYPES.FULL
                                    ? "bg-green-600 text-white shadow-md"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            Full Payment
                        </button>
                        <button
                            type="button"
                            onClick={() =>
                                setPaymentType(PAYMENT_TYPES.DOWNPAYMENT)
                            }
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                paymentType === PAYMENT_TYPES.DOWNPAYMENT
                                    ? "bg-yellow-500 text-white shadow-md"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            Downpayment
                        </button>
                    </div>
                </div>

                {/* Downpayment Amount Field (conditional) */}
                {paymentType === PAYMENT_TYPES.DOWNPAYMENT && (
                    <div className="mb-6 animate-in fade-in duration-200">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Downpayment Amount
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                ₱
                            </span>
                            <input
                                type="number"
                                value={downpaymentAmount}
                                onChange={e =>
                                    setDownpaymentAmount(e.target.value)
                                }
                                placeholder="Enter amount"
                                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                min="0"
                                max={monthlyRent}
                                step="100"
                            />
                        </div>
                        {downpaymentAmount &&
                            parseFloat(downpaymentAmount) > 0 && (
                                <div className="mt-2 text-sm">
                                    {parseFloat(downpaymentAmount) >=
                                    monthlyRent ? (
                                        <p className="text-green-600">
                                            This covers the full rent amount!
                                        </p>
                                    ) : (
                                        <p className="text-amber-600">
                                            Remaining balance: ₱
                                            {remainingBalance.toLocaleString()}
                                        </p>
                                    )}
                                </div>
                            )}
                    </div>
                )}

                {/* Mode of Payment Selection */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mode of Payment
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        {Object.values(MODE_OF_PAYMENT).map(mode => (
                            <button
                                key={mode}
                                type="button"
                                onClick={() => setModeOfPayment(mode)}
                                className={`px-3 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                                    modeOfPayment === mode
                                        ? "bg-blue-600 text-white shadow-md"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                {getModeOfPaymentIcon(mode)}
                                <span className="text-xs">
                                    {getModeOfPaymentLabel(mode)}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Summary */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">
                            Payment Type:
                        </span>
                        <span className="text-sm font-semibold text-gray-800">
                            {paymentType === PAYMENT_TYPES.FULL
                                ? "Full Payment"
                                : "Downpayment"}
                        </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Mode:</span>
                        <span className="text-sm font-semibold text-gray-800">
                            {getModeOfPaymentLabel(modeOfPayment)}
                        </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                        <span className="text-sm font-medium text-gray-700">
                            Amount to Pay:
                        </span>
                        <span className="text-lg font-bold text-green-600">
                            ₱
                            {paymentType === PAYMENT_TYPES.FULL
                                ? monthlyRent.toLocaleString()
                                : (
                                      parseFloat(downpaymentAmount) || 0
                                  ).toLocaleString()}
                        </span>
                    </div>
                    {hasBalance && (
                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
                            <span className="text-sm font-medium text-amber-600">
                                Remaining Balance:
                            </span>
                            <span className="text-sm font-bold text-amber-600">
                                ₱{remainingBalance.toLocaleString()}
                            </span>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleConfirm}
                        icon={Plus}
                        disabled={
                            isLoading ||
                            (paymentType === PAYMENT_TYPES.DOWNPAYMENT &&
                                (!downpaymentAmount ||
                                    parseFloat(downpaymentAmount) <= 0))
                        }
                        icon={isLoading ? Loader2 : undefined}
                        iconPosition="left"
                        className="flex-1"
                    >
                        {isLoading ? "Processing..." : "Record Payment"}
                    </Button>
                </div>
            </div>
        </ModalPortal>
    );
};

export default RecordPaymentModal;
