// src/layoutsAppLayout.jsx
import React, { useState, useEffect, useRef } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
    Menu,
    X,
    Bell,
    LayoutDashboard,
    Home,
    Users,
    Settings,
    LogOut,
    Sidebar,
    Calendar,
    HandCoins,
    FileText,
    Wrench
} from "lucide-react";
import logo from "@/assets/images/logo.svg";
import avatar from "@/assets/images/avatar.svg";
import WarningModal from "@/shared/components/WarningModal";
import NotificationMenu from "@/features/(app)/components/NotificationMenu";
import ProfileMenu from "@/shared/components/ProfileMenu";
import Toast from "@/shared/components/Toast";

const AppLayout = () => {
    const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
    const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const userMenuRef = useRef(null);
    const notificationRef = useRef(null);

    // Check if mobile on resize
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) {
                setIsMobileDrawerOpen(false);
            }
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Close menus when clicking outside
    useEffect(() => {
        const handleClickOutside = event => {
            if (
                isUserMenuOpen &&
                userMenuRef.current &&
                !userMenuRef.current.contains(event.target)
            ) {
                setIsUserMenuOpen(false);
            }
            if (
                isNotificationOpen &&
                notificationRef.current &&
                !notificationRef.current.contains(event.target)
            ) {
                setIsNotificationOpen(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [isUserMenuOpen, isNotificationOpen]);

    const sidebarLinks = [
        { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
        { icon: Home, label: "Properties", path: "/my-properties" },
        { icon: Users, label: "Tenants", path: "/tenants" },
        { icon: Calendar, label: "Calendar", path: "/calendar" },
        { icon: HandCoins, label: "Payments", path: "/payments" },
        { icon: Wrench, label: "Repairs", path: "/repairs" },
        { icon: FileText, label: "Reports", path: "/reports" },
        { icon: Settings, label: "Settings", path: "/settings" }
    ];

    const toggleSidebar = () => {
        if (!isMobile) {
            setIsSidebarMinimized(!isSidebarMinimized);
        }
    };

    const openMobileDrawer = () => {
        setIsMobileDrawerOpen(true);
    };

    const closeMobileDrawer = () => {
        setIsMobileDrawerOpen(false);
    };

    const handleLogout = () => {
        setIsLogoutModalOpen(true);
    };

    const confirmLogout = async () => {
        setIsLoggingOut(true);

        // Simulate logout API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        console.log("Logging out...");
        setIsLogoutModalOpen(false);
        setIsLoggingOut(false);

        // Show success toast
        Toast.success(
            "Logged out successfully",
            "You have been signed out of your account"
        );

        // Navigate to signin page after a short delay
        setTimeout(() => {
            navigate("/signin");
        }, 500);
    };

    // Check if a link is active
    const isLinkActive = path => {
        if (path === "/dashboard") {
            return location.pathname === "/dashboard";
        }
        return location.pathname.startsWith(path);
    };

    // Sidebar content (reused for desktop sidebar and mobile drawer)
    const SidebarContent = ({ minimized, onClose }) => (
        <div
            className={`flex flex-col h-full ${minimized ? "items-center" : ""}`}
        >
            {/* Logo Area with Sidebar Toggle Button */}
            <div
                className={`flex items-center border-b border-gray-200 px-3 ${minimized ? "justify-center p-3" : "justify-between p-2"}`}
            >
                {!minimized && (
                    <Link
                        to="/dashboard"
                        className="flex items-center gap-1 "
                        onClick={onClose}
                    >
                        <img src={logo} alt="4RENT" className="h-10 w-8" />
                        <span
                            className="text-primary text-3xl font-logo"
                            style={{ WebkitTextStroke: "1px black" }}
                        >
                            4
                        </span>
                        <span className="text-gray-700 text-2xl font-logo">
                            RENT
                        </span>
                    </Link>
                )}

                {/* Sidebar Toggle Button - only on desktop */}
                {!isMobile && (
                    <button
                        onClick={toggleSidebar}
                        className={`text-gray-700 hover:text-primary transition-colors p-1 rounded-lg ${
                            minimized ? "mx-auto" : ""
                        }`}
                        title={
                            minimized ? "Expand sidebar" : "Minimize sidebar"
                        }
                    >
                        <Sidebar className="w-5 h-5" />
                    </button>
                )}

                {/* Close button for mobile drawer */}
                {isMobile && onClose && !minimized && (
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={24} />
                    </button>
                )}
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 py-6 space-y-2 px-3">
                {sidebarLinks.map(link => {
                    const active = isLinkActive(link.path);
                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            onClick={onClose}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative ${
                                active
                                    ? "bg-primary text-white shadow-xs"
                                    : "text-gray-700 hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 hover:text-primary"
                            } ${
                                minimized && !isMobile ? "justify-center" : ""
                            }`}
                        >
                            <link.icon
                                className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${!active && "group-hover:scale-110"}`}
                            />
                            {(!minimized || isMobile) && (
                                <span className="font-medium">
                                    {link.label}
                                </span>
                            )}

                        </Link>
                    );
                })}
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-gray-200">
                <button
                    onClick={() => {
                        if (onClose) onClose();
                        handleLogout();
                    }}
                    className={`flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:text-red-700 transition-all duration-200 group ${
                        minimized && !isMobile ? "justify-center" : ""
                    }`}
                >
                    <LogOut className="w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
                    {(!minimized || isMobile) && (
                        <span className="font-medium">Sign Out</span>
                    )}
                </button>
            </div>
        </div>
    );

    // Mobile Drawer (white background)
    const MobileDrawer = () => (
        <div
            className={`fixed inset-0 z-50 transition-opacity duration-300 ${
                isMobileDrawerOpen
                    ? "opacity-100 visible"
                    : "opacity-0 invisible"
            }`}
        >
            <div
                className="absolute inset-0 bg-black/50"
                onClick={closeMobileDrawer}
            />
            <div
                className={`absolute left-0 top-0 h-full w-72 bg-white shadow-xl transform transition-transform duration-300 ${
                    isMobileDrawerOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <SidebarContent minimized={false} onClose={closeMobileDrawer} />
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F0F0F0] flex">
            {/* Desktop Sidebar - Slightly darker than main bg */}
            {!isMobile && (
                <aside
                    className={`fixed left-0 top-0 h-full bg-neutral-100 transition-all duration-300 z-30 ${
                        isSidebarMinimized ? "w-20 pt-5" : "w-64"
                    }`}
                >
                    <SidebarContent minimized={isSidebarMinimized} />
                </aside>
            )}

            {/* Main Content */}
            <div
                className={`flex-1 transition-all duration-300 ${
                    !isMobile
                        ? isSidebarMinimized
                            ? "ml-20"
                            : "ml-64"
                        : "ml-0"
                }`}
            >
                {/* Header - Slightly darker than main bg */}
                <header className="sticky top-0 z-20 bg-neutral-100 shadow-sm">
                    <div className="flex items-center justify-between px-4 md:px-5 py-3">
                        {/* Left side: Menu button (mobile) + Logo (mobile) */}
                        <div className="flex items-center gap-3">
                            {isMobile ? (
                                <>
                                    <button
                                        onClick={openMobileDrawer}
                                        className="text-gray-700 hover:text-primary p-1"
                                    >
                                        <Menu size={24} />
                                    </button>
                                    {/* Mobile logo */}
                                    <Link
                                        to="/dashboard"
                                        className="flex items-center gap-1"
                                    >
                                        <img
                                            src={logo}
                                            alt="4RENT"
                                            className="h-8 w-6"
                                        />
                                        <span
                                            className="text-primary text-2xl font-logo"
                                            style={{
                                                WebkitTextStroke: "0.5px black"
                                            }}
                                        >
                                            4
                                        </span>
                                        <span className="text-gray-700 text-xl font-logo">
                                            RENT
                                        </span>
                                    </Link>
                                </>
                            ) : (
                                <div className="w-8"></div> // Spacer for desktop to maintain header alignment
                            )}
                        </div>

                        {/* Right side: Icons and Avatar */}
                        <div className="flex items-center gap-4">
                            {/* Notification Icon */}
                            <div ref={notificationRef} className="relative">
                                <button
                                    onClick={() =>
                                        setIsNotificationOpen(
                                            !isNotificationOpen
                                        )
                                    }
                                    className="relative text-gray-700 hover:text-primary p-1 transition-colors"
                                >
                                    <Bell size={22} />
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                        3
                                    </span>
                                </button>

                                {/* Notification Menu */}
                                {isNotificationOpen && (
                                    <div className="absolute right-0 mt-2 w-80 z-50">
                                        <NotificationMenu
                                            onClose={() =>
                                                setIsNotificationOpen(false)
                                            }
                                        />
                                    </div>
                                )}
                            </div>

                            {/* User Avatar with dropdown */}
                            <div ref={userMenuRef} className="relative">
                                <button
                                    onClick={() =>
                                        setIsUserMenuOpen(!isUserMenuOpen)
                                    }
                                    className="flex items-center gap-2 focus:outline-none"
                                >
                                    <img
                                        src={avatar}
                                        alt="User Avatar"
                                        className="w-9 h-9 rounded-full object-cover border-2 border-primary/30 hover:border-primary transition-colors"
                                    />
                                </button>

                                {/* Profile Menu */}
                                {isUserMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-72 z-50">
                                        <ProfileMenu
                                            onClose={() =>
                                                setIsUserMenuOpen(false)
                                            }
                                            onLogout={handleLogout}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content with White Background and Rounded Corners */}
                <main className="p-4 md:p-6">
                    <div className="bg-white rounded-xl shadow-sm">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Mobile Drawer */}
            <MobileDrawer />

            {/* Logout Warning Modal */}
            <WarningModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={confirmLogout}
                title="Sign Out Confirmation"
                icon={LogOut}
                description="Are you sure you want to sign out? You will need to sign in again to access your account."
                confirmText="Sign Out"
                cancelText="Cancel"
                isLoading={isLoggingOut}
            />
        </div>
    );
};

export default AppLayout;
