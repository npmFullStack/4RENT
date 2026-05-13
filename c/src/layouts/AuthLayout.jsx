// src/layouts/AuthLayout.jsx
import React from "react";
import { Outlet, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const AuthLayout = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Simple Header with Back Button */}
            <header className="border-b border-gray-100">
                <div className="container mx-auto px-4 py-4">
                    <Link 
                        to="/" 
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span>Back to Home</span>
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