// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import AuthLayout from "@/layouts/AuthLayout";
import AppLayout from "@/layouts/AppLayout";
import Home from "@/features/(landing)/pages/Home";
import AllProperties from "@/features/(landing)/pages/AllProperties";
import PropertyDetails from "@/features/(landing)/pages/PropertyDetails";
import FindPropertyViaMap from "@/features/(landing)/pages/FindPropertyViaMap";
import LandlordHome from "@/features/(landing)/pages/LandlordHome";
import SignIn from "@/features/(auth)/pages/SignIn";
import SignUp from "@/features/(auth)/pages/SignUp";
import ForgotPassword from "@/features/(auth)/pages/ForgotPassword";
import CreateNewPassword from "@/features/(auth)/pages/CreateNewPassword";

import Dashboard from "@/features/(app)/pages/Dashboard";
import MyProperties from "@/features/(app)/pages/MyProperties";
import NewBoarding from "@/features/(app)/pages/NewBoarding";
import NewApartment from "@/features/(app)/pages/NewApartment";
import Tenants from "@/features/(app)/pages/Tenants";
import NewTenant from "@/features/(app)/pages/NewTenant";
import CalendarPage from "@/features/(app)/pages/Calendar";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Main/Landing Routes */}
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Home />} />
                    <Route path="/home" element={<LandlordHome />} />
                </Route>

                {/* Auth Routes */}
                <Route element={<AuthLayout />}>
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route
                        path="/forgot-password"
                        element={<ForgotPassword />}
                    />
                    <Route
                        path="/new-password"
                        element={<CreateNewPassword />}
                    />

                    <Route path="/properties" element={<AllProperties />} />
                    <Route path="/property/:id" element={<PropertyDetails />} />
                    <Route
                        path="/find-properties-map"
                        element={<FindPropertyViaMap />}
                    />
                </Route>

                {/* Dashboard Routes */}
                <Route element={<AppLayout />}>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="my-properties" element={<MyProperties />} />
                    <Route path="new-boarding" element={<NewBoarding />} />
                    <Route path="new-apartment" element={<NewApartment />} />
                    <Route path="/tenants" element={<Tenants />} />
                    <Route path="new-tenant" element={<NewTenant />} />
                    <Route path="calendar" element={<CalendarPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
