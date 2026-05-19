// shared/components/Toast.jsx
import { toast } from "sonner";
import { AlertCircle, CheckCircle, Info, XCircle, X } from "lucide-react";
import { useEffect, useState } from "react";

const ToastContent = ({
    message,
    description,
    icon: Icon,
    type,
    onClose,
    duration = 4000
}) => {
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        const startTime = Date.now();
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(
                0,
                ((duration - elapsed) / duration) * 100
            );
            setProgress(remaining);

            if (remaining <= 0) {
                clearInterval(interval);
            }
        }, 16);

        return () => clearInterval(interval);
    }, [duration]);

    const getStyles = () => {
        switch (type) {
            case "success":
                return {
                    accent: "bg-green-500",
                    text: "text-green-600",
                    lightBg: "bg-green-50"
                };
            case "error":
                return {
                    accent: "bg-red-500",
                    text: "text-red-600",
                    lightBg: "bg-red-50"
                };
            case "info":
                return {
                    accent: "bg-blue-500",
                    text: "text-blue-600",
                    lightBg: "bg-blue-50"
                };
            case "warning":
                return {
                    accent: "bg-orange-500",
                    text: "text-orange-600",
                    lightBg: "bg-orange-50"
                };
            default:
                return {};
        }
    };

    const { accent, text, lightBg } = getStyles();

    return (
        <div className="relative bg-white rounded-lg shadow-lg w-80 max-w-[320px] overflow-hidden">
            {/* Left accent bar */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${accent}`} />

            {/* Progress bar at bottom */}
            <div
                className={`absolute bottom-0 left-0 h-0.5 ${accent} transition-all duration-75 ease-linear`}
                style={{ width: `${progress}%` }}
            />

            <div className="pl-4 pr-8 py-2.5">
                <div className="flex items-start gap-2.5">
                    <div
                        className={`${lightBg} p-1 rounded-full shrink-0 mt-0.5`}
                    >
                        <Icon
                            className={`w-3.5 h-3.5 ${text}`}
                            strokeWidth={2}
                        />
                    </div>

<div className="flex-1 min-w-0">
  <p className="text-[13px] font-medium text-gray-900 leading-tight truncate" title={message}>
    {message}
  </p>
  {description && (
    <p className="text-[11px] text-gray-500 mt-1 leading-relaxed truncate" title={description}>
      {description}
    </p>
  )}
</div>     <button
                        onClick={onClose}
                        className="shrink-0 -mt-0.5 p-0.5 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-3 h-3" strokeWidth={1.5} />
                    </button>
                </div>
            </div>
        </div>
    );
};

const Toast = {
    success: (message, description = "") => {
        toast.custom(t => (
            <ToastContent
                message={message}
                description={description}
                icon={CheckCircle}
                type="success"
                onClose={() => toast.dismiss(t)}
                duration={4000}
            />
        ));
    },

    error: (message, description = "") => {
        toast.custom(t => (
            <ToastContent
                message={message}
                description={description}
                icon={AlertCircle}
                type="error"
                onClose={() => toast.dismiss(t)}
                duration={4000}
            />
        ));
    },

    info: (message, description = "") => {
        toast.custom(t => (
            <ToastContent
                message={message}
                description={description}
                icon={Info}
                type="info"
                onClose={() => toast.dismiss(t)}
                duration={3000}
            />
        ));
    },

    warning: (message, description = "") => {
        toast.custom(t => (
            <ToastContent
                message={message}
                description={description}
                icon={XCircle}
                type="warning"
                onClose={() => toast.dismiss(t)}
                duration={4000}
            />
        ));
    }
};

export default Toast;
