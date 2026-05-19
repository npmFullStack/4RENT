// shared/components/Toast.jsx
import { toast } from "sonner";
import { AlertCircle, CheckCircle, Info, XCircle, X } from "lucide-react";
import { useEffect, useState } from "react";

// Custom Toast Content Component with Progress Bar
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
      const remaining = Math.max(0, ((duration - elapsed) / duration) * 100);
      setProgress(remaining);
      
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [duration]);

  const getColorStyles = () => {
    const colors = {
      success: "text-green-600",
      error: "text-red-600",
      info: "text-blue-600",
      warning: "text-orange-600"
    };
    const borderColors = {
      success: "border-green-200",
      error: "border-red-200",
      info: "border-blue-200",
      warning: "border-orange-200"
    };
    const progressColors = {
      success: "bg-green-500",
      error: "bg-red-500",
      info: "bg-blue-500",
      warning: "bg-orange-500"
    };
    
    return {
      iconColor: colors[type],
      borderColor: borderColors[type],
      progressColor: progressColors[type]
    };
  };

  const { iconColor, borderColor, progressColor } = getColorStyles();

  return (
    <div className={`relative bg-white border ${borderColor} rounded-lg shadow-lg overflow-hidden w-full max-w-sm`}>
      {/* Progress Bar */}
      <div 
        className={`absolute bottom-0 left-0 h-1 ${progressColor} transition-all duration-75 ease-linear`}
        style={{ width: `${progress}%` }}
      />
      
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors duration-200 z-10"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Content */}
      <div className="p-4 pr-8">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={`flex-shrink-0 ${iconColor}`}>
            <Icon className="w-4 h-4" />
          </div>
          
          {/* Text Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 tracking-tight">
              {message}
            </p>
            {description && (
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Toast = {
  success: (message, description = "") => {
    toast.custom((t) => (
      <ToastContent
        message={message}
        description={description}
        icon={CheckCircle}
        type="success"
        onClose={() => toast.dismiss(t)}
        duration={4000}
      />
    ), {
      duration: 4000,
      position: "top-right",
    });
  },

  error: (message, description = "") => {
    toast.custom((t) => (
      <ToastContent
        message={message}
        description={description}
        icon={AlertCircle}
        type="error"
        onClose={() => toast.dismiss(t)}
        duration={4000}
      />
    ), {
      duration: 4000,
      position: "top-right",
    });
  },

  info: (message, description = "") => {
    toast.custom((t) => (
      <ToastContent
        message={message}
        description={description}
        icon={Info}
        type="info"
        onClose={() => toast.dismiss(t)}
        duration={3000}
      />
    ), {
      duration: 3000,
      position: "top-right",
    });
  },

  warning: (message, description = "") => {
    toast.custom((t) => (
      <ToastContent
        message={message}
        description={description}
        icon={XCircle}
        type="warning"
        onClose={() => toast.dismiss(t)}
        duration={4000}
      />
    ), {
      duration: 4000,
      position: "top-right",
    });
  },
};

export default Toast;