// src/features/(auth)/pages/SignIn.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import Button from "@/shared/components/Button";
import Toast from "@/shared/components/Toast";
import logo from "@/assets/images/logo.svg";

const SignIn = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleSubmit = async e => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            Toast.success("Welcome back!", "You have successfully signed in.");
            
            setTimeout(() => {
                navigate("/dashboard");
            }, 1000);
        }, 2000);
    };

    const handleChange = e => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="max-w-md mx-auto">
            {/* Logo */}
            <div className="flex justify-center items-baseline gap-1 mb-8">
                <img src={logo} alt="4RENT" className="h-10 w-8" />
                <span
                    className="text-primary text-4xl font-logo"
                    style={{ WebkitTextStroke: "1px black" }}
                >
                    4
                </span>
                <span className="text-gray-800 text-3xl font-logo">RENT</span>
            </div>

            {/* Welcome Message */}
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Welcome Back!
                </h1>
                <p className="text-gray-600">
                    Sign in to continue to your account
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary transition-colors"
                            placeholder="you@example.com"
                        />
                    </div>
                </div>

                {/* Password Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary transition-colors"
                            placeholder="Enter your password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>

                {/* Forgot Password Link */}
                <div className="text-right">
                    <Link
                        to="/forgot-password"
                        className="text-sm text-primary hover:text-primary/80 transition-colors"
                    >
                        Forgot Password?
                    </Link>
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    disabled={isLoading}
                    icon={isLoading ? Loader2 : LogIn}
                    className="w-full justify-center"
                >
                    {isLoading ? "Signing In..." : "Sign In"}
                </Button>
            </form>

            {/* Sign Up Link */}
            <p className="text-center mt-6 text-gray-600">
                Don't have an account?{" "}
                <Link
                    to="/signup"
                    className="text-primary font-semibold hover:underline"
                >
                    Sign Up
                </Link>
            </p>
        </div>
    );
};

export default SignIn;