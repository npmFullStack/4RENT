// src/features/(app)/components/BreadCrumbs.jsx
import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const BreadCrumbs = ({ items, className = "" }) => {
    if (!items || items.length === 0) {
        return null;
    }

    return (
        <nav className={`flex items-center flex-wrap gap-1 text-sm ${className}`}>
            {items.map((item, index) => {
                const isLast = index === items.length - 1;
                
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

export default BreadCrumbs;