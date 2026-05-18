// src/layouts/AuthLayout.jsx
import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Button from "@/shared/components/Button";

const AuthLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);

    // Routes that should be full-width (no container padding)
    const fullWidthRoutes = ["/home"];

    // Routes where back button should go to /home
    const homeBackRoutes = ["/signin", "/signup"];

    const isFullWidthRoute = fullWidthRoutes.includes(location.pathname);
    const shouldGoToHome = homeBackRoutes.includes(location.pathname);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Handle back navigation - go to /home for signin/signup, otherwise go back
    const handleBack = () => {
        if (shouldGoToHome) {
            navigate("/home");
        } else {
            navigate(-1);
        }
    };

    // Determine button text
    const buttonText = shouldGoToHome ? "Back to Home" : "Back";

    return (
        <div className="min-h-screen bg-white">
            {/* Sticky Header with backdrop blur and scroll-based background */}
            <header
                className={`sticky top-0 z-30 transition-all duration-300 ${
                    isScrolled
                        ? "shadow-md bg-white/80 backdrop-blur-md"
                        : "bg-transparent"
                }`}
            >
                <div className="container mx-auto px-4 py-4">
                    <Button
                        variant="ghost"
                        icon={ArrowLeft}
                        iconPosition="left"
                        onClick={handleBack}
                    >
                        {buttonText}
                    </Button>
                </div>
            </header>

            {/* Main Content - Conditionally apply container/padding */}
            <main
                className={
                    isFullWidthRoute ? "" : "container mx-auto px-4 py-8"
                }
            >
                <Outlet />
            </main>
        </div>
    );
};

export default AuthLayout;