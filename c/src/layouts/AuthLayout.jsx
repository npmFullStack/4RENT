// src/layouts/AuthLayout.jsx
import React from "react";
import { Outlet, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Button from "@/shared/components/Button";

const AuthLayout = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Sticky Header with Back Button */}
            <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-4">
                    <Link to="/">
                        <Button variant="ghost" icon={ArrowLeft} iconPosition="left">
                            Back to Home
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