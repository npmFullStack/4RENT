// src/features/(app)/components/RecordPaymentModal.jsx
import React, { useState } from "react";
import ModalPortal from "@/shared/components/ModalPortal";
import Button from "@/shared/components/Button";
import {
    X,
    Users,
    Home,
    PhilippinePeso,
    Wallet,
    Smartphone,
    Loader2,
    CheckCircle,
    CreditCard,
    AlertCircle
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
                return Wallet;
            case MODE_OF_PAYMENT.GCASH:
                return Smartphone;
            default:
                return CreditCard;
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
            {/* Backdrop - Dark overlay with backdrop blur (matching FilterMenu) */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content - matching FilterMenu panel styling */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white shadow-2xl z-[70] transform transition-all duration-300 ease-in-out rounded-xl overflow-hidden">
                {/* Header - matching FilterMenu header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-5 py-3 flex justify-between items-center">
                    <div className="flex items-center">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Record Payment
                        </h2>
                    </div>
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        disabled={isLoading}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors !p-0 !w-auto !h-auto"
                        icon={X}
                        aria-label="Close"
                    >
                        {/* Empty children since icon handles it */}
                    </Button>
                </div>

                {/* Content Area - matching FilterMenu p-5 spacing */}
                <div className="p-5 space-y-5 max-h-[calc(100vh-180px)] overflow-y-auto">
                    {/* Tenant Info - matching FilterMenu info card style */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <div className="flex items-center gap-2">
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
                        <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                            <PhilippinePeso className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-semibold text-gray-800">
                                Monthly Rent: ₱{monthlyRent.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    {/* Payment Type Selection - matching FilterMenu button grid styling */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                            Payment Type
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            <Button
                                variant={paymentType === PAYMENT_TYPES.FULL ? "primary" : "ghost"}
                                onClick={() => setPaymentType(PAYMENT_TYPES.FULL)}
                                disabled={isLoading}
                                className={`flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium transition-all !rounded-lg ${
                                    paymentType === PAYMENT_TYPES.FULL
                                        ? "!bg-gray-800 !text-white !hover:bg-gray-700"
                                        : "!bg-gray-100 !text-gray-400 !hover:bg-gray-200"
                                }`}
                                icon={CheckCircle}
                            >
                                Full Payment
                            </Button>
                            <Button
                                variant={paymentType === PAYMENT_TYPES.DOWNPAYMENT ? "primary" : "ghost"}
                                onClick={() => setPaymentType(PAYMENT_TYPES.DOWNPAYMENT)}
                                disabled={isLoading}
                                className={`flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium transition-all !rounded-lg ${
                                    paymentType === PAYMENT_TYPES.DOWNPAYMENT
                                        ? "!bg-gray-800 !text-white !hover:bg-gray-700"
                                        : "!bg-gray-100 !text-gray-400 !hover:bg-gray-200"
                                }`}
                                icon={AlertCircle}
                            >
                                Downpayment
                            </Button>
                        </div>
                    </div>

                    {/* Downpayment Amount Field (conditional) */}
                    {paymentType === PAYMENT_TYPES.DOWNPAYMENT && (
                        <div className="animate-fadeIn">
                            <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
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
                                    className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent"
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
                                            <p className="text-blue-600">
                                                This covers the full rent
                                                amount!
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

                    {/* Mode of Payment Selection - matching FilterMenu button grid styling */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                            Mode of Payment
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {Object.values(MODE_OF_PAYMENT).map(mode => {
                                const IconComponent =
                                    getModeOfPaymentIcon(mode);
                                return (
                                    <Button
                                        key={mode}
                                        variant={modeOfPayment === mode ? "primary" : "ghost"}
                                        onClick={() => setModeOfPayment(mode)}
                                        disabled={isLoading}
                                        className={`flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium transition-all !rounded-lg ${
                                            modeOfPayment === mode
                                                ? "!bg-gray-800 !text-white !hover:bg-gray-700"
                                                : "!bg-gray-100 !text-gray-400 !hover:bg-gray-200"
                                        }`}
                                        icon={IconComponent}
                                    >
                                        <span className="text-xs sm:text-sm">
                                            {getModeOfPaymentLabel(mode)}
                                        </span>
                                    </Button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Summary - matching FilterMenu card styling */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                                Payment Type:
                            </span>
                            <span className="text-sm font-semibold text-gray-800">
                                {paymentType === PAYMENT_TYPES.FULL
                                    ? "Full Payment"
                                    : "Downpayment"}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Mode:</span>
                            <span className="text-sm font-semibold text-gray-800">
                                {getModeOfPaymentLabel(modeOfPayment)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                            <span className="text-sm font-medium text-gray-700">
                                Amount to Pay:
                            </span>
                            <span className="text-lg font-bold text-gray-900">
                                ₱
                                {paymentType === PAYMENT_TYPES.FULL
                                    ? monthlyRent.toLocaleString()
                                    : (
                                          parseFloat(downpaymentAmount) || 0
                                      ).toLocaleString()}
                            </span>
                        </div>
                        {hasBalance && (
                            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                                <span className="text-sm font-medium text-amber-600">
                                    Remaining Balance:
                                </span>
                                <span className="text-sm font-bold text-amber-600">
                                    ₱{remainingBalance.toLocaleString()}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Buttons - matching FilterMenu footer */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 px-5 py-4 flex gap-3">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 !bg-gray-100 !text-gray-700 !hover:bg-gray-200"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleConfirm}
                        disabled={
                            isLoading ||
                            (paymentType === PAYMENT_TYPES.DOWNPAYMENT &&
                                (!downpaymentAmount ||
                                    parseFloat(downpaymentAmount) <= 0))
                        }
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        icon={isLoading ? Loader2 : CheckCircle}
                    >
                        {isLoading ? "Processing..." : "Record Payment"}
                    </Button>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </ModalPortal>
    );
};

export default RecordPaymentModal;