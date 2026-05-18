// src/features/(app)/components/Instructions.jsx
import React from "react";
import { CheckCircle, HelpCircle } from "lucide-react";
import instructionsImg from "@/assets/images/instructions.png";

const Instructions = ({
    title = "Instructions",
    items = [],
    className = "",
    showImage = true
}) => {
    return (
        <div
            className={`bg-white rounded-xl border border-gray-200 overflow-hidden ${className}`}
        >
            {/* Content */}
            <div className="p-4">
                <div className="flex items-center gap-2 mb-4">
                    <HelpCircle className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-gray-800">{title}</h3>
                </div>

                {/* Instructions Image - Below title */}
                {showImage && (
                    <div className="mb-4 flex justify-center">
                        <img
                            src={instructionsImg}
                            alt="Instructions"
                            className="w-32 h-32 object-cover rounded-lg"
                        />
                    </div>
                )}

                <div className="space-y-4">
                    {items.map((item, index) => (
                        <div key={index} className="flex gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span className="text-xs font-medium text-primary">
                                        {index + 1}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-800 text-sm">
                                    {item.title}
                                </h4>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Instructions;
