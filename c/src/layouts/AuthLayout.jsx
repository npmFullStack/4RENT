// src/layouts/AuthLayout.jsx
import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Button from "@/shared/components/Button";

const AuthLayout = () => {
    const location = useLocation();

    // Check if current page is SignIn or SignUp
    const isSignInOrSignUp =
        location.pathname === "/signin" || location.pathname === "/signup";

    // Get button text based on current page
    const getButtonText = () => {
        if (isSignInOrSignUp) {
            return "Back to Home";
        }
        return "Back";
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Sticky Header with Back Button and Backdrop Blur */}
            <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/80 backdrop-blur-md">

                <div className="container mx-auto px-4 py-4">
                    <Link to={isSignInOrSignUp ? "/" : -1}>
                        <Button
                            variant="ghost"
                            icon={ArrowLeft}
                            iconPosition="left"
                        >
                            {getButtonText()}
                        </Button>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                <Outlet />
            </main>
        </div>
    );
};

export default AuthLayout;
