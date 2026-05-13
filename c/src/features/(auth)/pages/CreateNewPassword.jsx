// src/features/(auth)/pages/CreateNewPassword.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, Loader2, KeyRound } from "lucide-react";
import Button from "@/shared/components/Button";
import logo from "@/assets/images/logo.svg";

const CreateNewPassword = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            navigate("/signin");
        }, 2000);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="max-w-md mx-auto">
            {/* Logo beside 4 */}
            <div className="flex justify-center items-baseline gap-1 mb-8">
                <img src={logo} alt="4RENT" className="h-10 w-8" />
                <span 
                    className="text-primary text-4xl font-logo"
                    style={{ WebkitTextStroke: "1px black" }}
                >
                    4
                </span>
                <span className="text-gray-800 text-3xl font-logo">
                    RENT
                </span>
            </div>

            {/* Message */}
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Create New Password
                </h1>
                <p className="text-gray-600">
                    Your new password must be different from your previous password
                </p>
            </div>

            {/* Form - No shadow */}
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* New Password Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary transition-colors"
                            placeholder="Enter new password"
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

                {/* Confirm Password Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary transition-colors"
                            placeholder="Confirm new password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>

                {/* Submit Button with Icon */}
                <Button
                    type="submit"
                    disabled={isLoading}
                    icon={isLoading ? Loader2 : KeyRound}
                    className="w-full justify-center mt-6"
                >
                    {isLoading ? "Resetting..." : "Reset Password"}
                </Button>
            </form>

            {/* Back to Sign In */}
            <p className="text-center mt-6">
                <Link to="/signin" className="text-primary font-semibold hover:underline">
                    Back to Sign In
                </Link>
            </p>
        </div>
    );
};

export default CreateNewPassword;