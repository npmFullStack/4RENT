// src/layouts/MainLayout.jsx
import React, { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import { LayoutGrid, Search, Menu, X } from "lucide-react";
import Button from "@/shared/components/Button";
import logo from "@/assets/images/logo.svg";

const MainLayout = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    isScrolled ? "bg-white shadow-md" : "bg-transparent"
                }`}
            >
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-1">
                        <img src={logo} alt="4RENT" className="h-10 w-8" />
                        <span
                            className="text-primary text-3xl font-logo"
                            style={{ WebkitTextStroke: "1px black" }}
                        >
                            4
                        </span>
                        <span className="text-gray-800 text-2xl font-logo">
                            RENT
                        </span>
                    </Link>

                    {/* Desktop CTA Buttons */}
                    <div className="hidden md:flex gap-3">
                        <Link to="/home">
                            <Button variant="ghost" icon={LayoutGrid}>
                                List Property
                            </Button>
                        </Link>
                        <Link to="/properties">
                            <Button variant="primary" icon={Search}>
                                Find Property
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden text-gray-900 focus:outline-none"
                    >
                        {isMobileMenuOpen ? (
                            <X size={24} />
                        ) : (
                            <Menu size={24} />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-white border-t border-gray-100">
                        <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
                            <Link to="/home" className="w-full">
                                <Button
                                    variant="ghost"
                                    icon={LayoutGrid}
                                    className="w-full justify-center"
                                >
                                    List Property
                                </Button>
                            </Link>
                            <Link to="/properties" className="w-full">
                                <Button
                                    variant="primary"
                                    icon={Search}
                                    className="w-full justify-center"
                                >
                                    Find Property
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
            </header>

            <main className="pt-16">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8">
                <div className="container mx-auto px-4 text-center">
                    <p>
                        &copy; {new Date().getFullYear()} 4RENT. All rights
                        reserved.
                    </p>
                    <p className="mt-2 text-gray-400">Developed by NorDev.</p>
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;
