// src/shared/components/Select.jsx
import React from "react";
import ReactSelect from "react-select";

const Select = ({
    options = [],
    value = null,
    onChange = null,
    placeholder = "Select...",
    isSearchable = false,
    isClearable = false,
    isDisabled = false,
    isLoading = false,
    className = "",
    icon = null,
    formatOptionLabel = null,
    variant = "default", // default, outline, primary, ghost
    ...props
}) => {
    // Variant styles
    const getVariantStyles = state => {
        const variants = {
            default: {
                borderColor: state.isFocused ? "#E6B800" : "#D1D5DB",
                backgroundColor: "white",
                textColor: "#374151",
                hoverBorderColor: state.isFocused ? "#E6B800" : "#9CA3AF",
                focusRing: "0 0 0 2px rgba(230, 184, 0, 0.2)",
                hoverBg: "white"
            },
            outline: {
                borderColor: state.isFocused ? "#E6B800" : "#D1D5DB",
                backgroundColor: "transparent",
                textColor: "#374151",
                hoverBorderColor: state.isFocused ? "#E6B800" : "#9CA3AF",
                focusRing: "0 0 0 2px rgba(230, 184, 0, 0.2)",
                hoverBg: "transparent"
            },
            primary: {
                borderColor: state.isFocused ? "#C4A000" : "#E6B800",
                backgroundColor: state.isFocused ? "#C4A000" : "#E6B800",
                textColor: "white",
                hoverBorderColor: "#C4A000",
                focusRing: "0 0 0 2px rgba(230, 184, 0, 0.3)",
                hoverBg: "#C4A000"
            },
            ghost: {
                borderColor: "transparent",
                backgroundColor: "transparent",
                textColor: "#374151",
                hoverBorderColor: "transparent",
                focusRing: "none",
                hoverBg: "transparent"
            }
        };
        return variants[variant] || variants.default;
    };

    // Format option with optional icon
    const defaultFormatOptionLabel = (option, { context }) => {
        const showIcon = option.icon || icon;
        
        return (
            <div className="flex items-center gap-2">
                {showIcon && (
                    <span className="w-4 h-4 flex items-center justify-center shrink-0">
                        {option.icon || icon}
                    </span>
                )}
                <span className="truncate">{option.label}</span>
            </div>
        );
    };

    // Custom format for the selected value (to show icon in the selected value)
    const formatSelectedValue = (option) => {
        if (!option) return null;
        const showIcon = option.icon || icon;
        
        return (
            <div className={`flex items-center gap-2 ${variant === "primary" ? "w-full justify-center" : ""}`}>
                {showIcon && (
                    <span className="w-4 h-4 flex items-center justify-center shrink-0">
                        {option.icon || icon}
                    </span>
                )}
                <span className="truncate">{option.label}</span>
            </div>
        );
    };

    // Custom styles for Tailwind integration
    const customStyles = {
        control: (base, state) => {
            const variantStyles = getVariantStyles(state);
            return {
                ...base,
                backgroundColor: variantStyles.backgroundColor,
                borderColor: variantStyles.borderColor,
                borderWidth: variant === "ghost" ? "0px" : "1px",
                borderRadius: "0.5rem",
                boxShadow:
                    state.isFocused && variant !== "ghost"
                        ? variantStyles.focusRing
                        : "none",
                "&:hover": {
                    borderColor: variantStyles.hoverBorderColor,
                    backgroundColor: variantStyles.hoverBg
                },
                minHeight: "38px",
                padding: "0",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: variantStyles.textColor,
                cursor: "pointer",
                ...(variant === "primary" && {
                    "& .react-select__single-value": {
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    },
                    "& .react-select__dropdown-indicator": {
                        color: "white"
                    },
                    "& .react-select__clear-indicator": {
                        color: "white"
                    },
                    "& .react-select__placeholder": {
                        color: "white",
                        textAlign: "center",
                        width: "100%"
                    },
                    "& .react-select__value-container": {
                        justifyContent: "center"
                    }
                })
            };
        },
        menu: base => ({
            ...base,
            borderRadius: "0.5rem",
            overflow: "hidden",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            zIndex: 50
        }),
        menuList: base => ({
            ...base,
            padding: "4px 0",
            fontSize: "0.875rem"
        }),
        option: (base, state) => {
            let backgroundColor = "white";
            let color = "#374151";

            if (state.isSelected) {
                backgroundColor = "#E6B800";
                color = "white";
            } else if (state.isFocused) {
                backgroundColor = "#FEF3C7";
                color = "#374151";
            }

            return {
                ...base,
                backgroundColor,
                color,
                cursor: "pointer",
                "&:active": {
                    backgroundColor: state.isSelected ? "#C4A000" : "#FEF3C7"
                },
                padding: "8px 12px",
                fontSize: "0.875rem"
            };
        },
        singleValue: (base, state) => ({
            ...base,
            color: variant === "primary" ? "white" : "#374151",
            fontSize: "0.875rem",
            display: "flex",
            alignItems: "center",
            justifyContent: variant === "primary" ? "center" : "flex-start"
        }),
        placeholder: base => ({
            ...base,
            color: variant === "primary" ? "white" : "#9CA3AF",
            fontSize: "0.875rem",
            textAlign: "left",
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "8px"
        }),
        valueContainer: (base) => ({
            ...base,
            padding: "0 12px",
            gap: "4px",
            display: "flex",
            justifyContent: variant === "primary" ? "center" : "flex-start",
            flexWrap: "nowrap"
        }),
        input: (base) => ({
            ...base,
            padding: "0",
            margin: "0",
            fontSize: "0.875rem"
        }),
        dropdownIndicator: (base, state) => ({
            ...base,
            color: variant === "primary" ? "white" : "#9CA3AF",
            padding: "0 8px 0 0",
            "&:hover": {
                color:
                    variant === "primary" ? "rgba(255,255,255,0.8)" : "#6B7280"
            }
        }),
        clearIndicator: base => ({
            ...base,
            color: variant === "primary" ? "white" : "#9CA3AF",
            padding: "0 4px",
            "&:hover": {
                color:
                    variant === "primary" ? "rgba(255,255,255,0.8)" : "#6B7280"
            }
        }),
        indicatorSeparator: base => ({
            ...base,
            backgroundColor:
                variant === "primary" ? "rgba(255,255,255,0.3)" : "#D1D5DB",
            marginTop: "8px",
            marginBottom: "8px",
            ...(variant === "ghost" && { display: "none" })
        }),
        noOptionsMessage: base => ({
            ...base,
            color: "#9CA3AF",
            fontSize: "0.875rem",
            padding: "12px"
        }),
        loadingMessage: base => ({
            ...base,
            color: "#9CA3AF",
            fontSize: "0.875rem",
            padding: "12px"
        })
    };

    // Transform options to react-select format
    const selectOptions = options.map(opt => ({
        value: opt.value,
        label: opt.label,
        icon: opt.icon || null,
        ...opt
    }));

    // Find selected option
    const selectedOption =
        value !== null ? selectOptions.find(opt => opt.value === value) : null;

    return (
        <ReactSelect
            options={selectOptions}
            value={selectedOption}
            onChange={option => onChange && onChange(option?.value ?? null)}
            placeholder={
                variant === "primary" && icon ? (
                    <span className="flex items-center gap-2 justify-center w-full">
                        <span className="w-4 h-4 flex items-center justify-center shrink-0">{icon}</span>
                        <span>{placeholder}</span>
                    </span>
                ) : placeholder
            }
            isSearchable={isSearchable}
            isClearable={isClearable}
            isDisabled={isDisabled}
            isLoading={isLoading}
            styles={customStyles}
            formatOptionLabel={(option, { context }) => {
                // Show icon in the selected value area
                if (context === 'value') {
                    return formatSelectedValue(option);
                }
                // Show icon in dropdown options
                return defaultFormatOptionLabel(option, { context });
            }}
            className={`text-sm ${className}`}
            classNamePrefix="react-select"
            {...props}
        />
    );
};

export default Select;