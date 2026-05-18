// src/features/(app)/components/BreadCrumbs.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const BreadCrumbs = ({ items, className = "" }) => {
    const location = useLocation();
    
    // If items are provided directly, use them
    const breadcrumbItems = items || generateBreadcrumbs(location);
    
    return (
        <nav className={`flex items-center flex-wrap gap-1 text-sm ${className}`}>
            {breadcrumbItems.map((item, index) => {
                const isLast = index === breadcrumbItems.length - 1;
                
                return (
                    <React.Fragment key={item.path || item.label}>
                        {index > 0 && (
                            <ChevronRight className="w-3 h-3 text-gray-400" />
                        )}
                        {isLast ? (
                            <span className="text-primary font-medium">
                                {item.label}
                            </span>
                        ) : (
                            <Link
                                to={item.path}
                                className="text-gray-500 hover:text-primary transition-colors"
                            >
                                {item.label}
                            </Link>
                        )}
                    </React.Fragment>
                );
            })}
        </nav>
    );
};

// Helper function to generate breadcrumbs from current path
const generateBreadcrumbs = (location) => {
    const pathnames = location.pathname.split("/").filter((x) => x);
    
    // If we're on a property creation page, the parent should be "My Properties"
    if (pathnames.includes("new-boarding") || pathnames.includes("new-apartment")) {
        return [
            { label: "My Properties", path: "/my-properties" },
            { label: pathnames.includes("new-boarding") ? "New Boarding" : "New Apartment", path: location.pathname }
        ];
    }
    
    // For dashboard and other routes
    if (pathnames[0] === "dashboard") {
        const items = [{ label: "Dashboard", path: "/dashboard" }];
        
        let accumulatedPath = "";
        pathnames.forEach((pathname, index) => {
            if (index === 0) return; // Skip dashboard since we already added it
            accumulatedPath += `/${pathname}`;
            
            let label = pathname
                .replace(/-/g, " ")
                .replace(/\b\w/g, (char) => char.toUpperCase());
            
            const specialCases = {
                "my-properties": "My Properties",
                "new-boarding": "New Boarding",
                "new-apartment": "New Apartment"
            };
            
            label = specialCases[pathname] || label;
            
            items.push({
                label,
                path: accumulatedPath
            });
        });
        
        return items;
    }
    
    // Default - just show the current page
    const currentPage = pathnames[pathnames.length - 1];
    let label = currentPage
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
    
    const specialCases = {
        "my-properties": "My Properties",
        "new-boarding": "New Boarding",
        "new-apartment": "New Apartment"
    };
    
    label = specialCases[currentPage] || label;
    
    return [{ label, path: location.pathname }];
};

export default BreadCrumbs;