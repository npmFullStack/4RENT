// src/shared/components/WelcomeHeroBox.jsx
import React from "react";

const WelcomeHeroBox = ({
    image,
    title,
    message,
    imagePosition = "right" // "left" or "right"
}) => {
    return (
        <div className="relative overflow-hidden rounded-xl">
            {/* Transparent Main Box Container */}
            <div className="relative">
                {/* Primary BG Div - smaller height like original */}
                <div
                    className={`absolute inset-x-0 top-1/2 -translate-y-1/2 h-3/4 bg-gradient-to-r ${
                        imagePosition === "right"
                            ? "from-amber-100 to-amber-50"
                            : "from-amber-50 to-amber-100"
                    } rounded-xl`}
                ></div>

                {/* Content Container */}
                <div
                    className={`relative flex flex-col ${
                        imagePosition === "right"
                            ? "md:flex-row"
                            : "md:flex-row-reverse"
                    } items-stretch`}
                >
                    {/* Text Content */}
                    <div className="flex-1 p-4 md:p-6 z-10">
                        <h2 className="text-md md:text-lg lg:text-xl font-bold text-gray-800 pt-5">
                            {title}
                        </h2>
                        {message && (
                            <p className="text-gray-700 text-sm md:text-base mt-2 font-medium leading-relaxed pb-5">
                                {message}
                            </p>
                        )}
                    </div>

                    {/* Image - hidden on mobile, shown on md and up */}
                    <div className="hidden md:flex md:w-44 lg:w-52 relative z-10 -my-6 md:-my-8">
                        <img
                            src={image}
                            alt="Welcome"
                            className="w-full h-auto object-contain"
                            style={{
                                transform: "scale(1.1)",
                                transformOrigin: "center",
                                height: "calc(100% + 2rem)",
                                minHeight: "120%"
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WelcomeHeroBox;
