// src/features/(auth)/pages/ForgotPassword.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Loader2, Send } from "lucide-react";
import Button from "@/shared/components/Button";
import logo from "@/assets/images/logo.svg";

const ForgotPassword = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setIsSubmitted(true);
        }, 2000);
    };

    if (isSubmitted) {
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

                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                        Check Your Email
                    </h1>
                    <p className="text-gray-600 mb-6">
                        We've sent a password reset link to <strong>{email}</strong>
                    </p>
                    <Link
                        to="/signin"
                        className="text-primary font-semibold hover:underline"
                    >
                        Back to Sign In
                    </Link>
                </div>
            </div>
        );
    }

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
                    Forgot Password?
                </h1>
                <p className="text-gray-600">
                    Enter your email address and we'll send you a link to reset your password
                </p>
            </div>

            {/* Form - No shadow */}
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
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary transition-colors"
                            placeholder="you@example.com"
                        />
                    </div>
                </div>

                {/* Submit Button with Icon */}
                <Button
                    type="submit"
                    disabled={isLoading}
                    icon={isLoading ? Loader2 : Send}
                    className="w-full justify-center"
                >
                    {isLoading ? "Sending..." : "Send Reset Link"}
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

export default ForgotPassword;