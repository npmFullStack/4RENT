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
    variant = "default",
    menuPortalTarget = null,
    menuPosition = "absolute",
    size = "default",
    ...props
}) => {
    // Get size styles
    const getSizeStyles = () => {
        const sizes = {
            default: {
                minHeight: "28px",
                fontSize: "0.75rem",
                padding: "0 8px",
                iconSize: "w-3 h-3",
                optionPadding: "6px 10px",
                indicatorPadding: "0 6px 0 0",
                indicatorMargin: "8px"
            },
            lg: {
                minHeight: "42px",
                fontSize: "1rem",
                padding: "0 12px",
                iconSize: "w-5 h-5",
                optionPadding: "10px 12px",
                indicatorPadding: "0 8px 0 0",
                indicatorMargin: "10px"
            }
        };
        return sizes[size] || sizes.default;
    };

    const sizeStyles = getSizeStyles();

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

    // Custom styles for Tailwind integration
    const customStyles = {
        control: (base, state) => {
            const variantStyles = getVariantStyles(state);
            return {
                ...base,
                backgroundColor: variantStyles.backgroundColor,
                borderColor: variantStyles.borderColor,
                borderWidth: variant === "ghost" ? "0px" : "1px",
                borderRadius: "0.375rem",
                boxShadow:
                    state.isFocused && variant !== "ghost"
                        ? variantStyles.focusRing
                        : "none",
                "&:hover": {
                    borderColor: variantStyles.hoverBorderColor,
                    backgroundColor: variantStyles.hoverBg
                },
                minHeight: sizeStyles.minHeight,
                padding: "0",
                fontSize: sizeStyles.fontSize,
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
            zIndex: 9999
        }),
        menuList: base => ({
            ...base,
            padding: "4px 0",
            fontSize: sizeStyles.fontSize,
            maxHeight: "200px"
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

            // Get the option data to check for separator
            const optionData = state.data;
            const hasSeparator = optionData && optionData.separator;

            return {
                ...base,
                backgroundColor,
                color,
                cursor: "pointer",
                borderTop: hasSeparator ? "1px solid #E5E7EB" : "none",
                marginTop: hasSeparator ? "4px" : "0",
                paddingTop: hasSeparator ? "8px" : sizeStyles.optionPadding,
                "&:active": {
                    backgroundColor: state.isSelected ? "#C4A000" : "#FEF3C7"
                },
                padding: sizeStyles.optionPadding,
                fontSize: sizeStyles.fontSize
            };
        },
        singleValue: (base, state) => ({
            ...base,
            color: variant === "primary" ? "white" : "#374151",
            fontSize: sizeStyles.fontSize,
            display: "flex",
            alignItems: "center",
            justifyContent: variant === "primary" ? "center" : "flex-start"
        }),
        placeholder: base => ({
            ...base,
            color: variant === "primary" ? "white" : "#9CA3AF",
            fontSize: sizeStyles.fontSize,
            textAlign: "left",
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "8px"
        }),
        valueContainer: base => ({
            ...base,
            padding: sizeStyles.padding,
            gap: "4px",
            display: "flex",
            justifyContent: variant === "primary" ? "center" : "flex-start",
            flexWrap: "nowrap"
        }),
        input: base => ({
            ...base,
            padding: "0",
            margin: "0",
            fontSize: sizeStyles.fontSize
        }),
        dropdownIndicator: (base, state) => ({
            ...base,
            color: variant === "primary" ? "white" : "#9CA3AF",
            padding: sizeStyles.indicatorPadding,
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
            marginTop: sizeStyles.indicatorMargin,
            marginBottom: sizeStyles.indicatorMargin,
            ...(variant === "ghost" && { display: "none" })
        }),
        noOptionsMessage: base => ({
            ...base,
            color: "#9CA3AF",
            fontSize: sizeStyles.fontSize,
            padding: size === "lg" ? "16px" : "12px"
        }),
        loadingMessage: base => ({
            ...base,
            color: "#9CA3AF",
            fontSize: sizeStyles.fontSize,
            padding: size === "lg" ? "16px" : "12px"
        })
    };

    // Format option with optional icon
    const defaultFormatOptionLabel = (option, { context }) => {
        const showIcon = option.icon || icon;

        return (
            <div
                className={`flex items-center gap-2 ${size === "lg" ? "gap-3" : "gap-2"} ${option.className || ""}`}
            >
                {showIcon && (
                    <span
                        className={`${sizeStyles.iconSize} flex items-center justify-center shrink-0`}
                    >
                        {option.icon || icon}
                    </span>
                )}
                <span
                    className={`truncate ${size === "lg" ? "text-base" : "text-xs"} ${option.className || ""}`}
                >
                    {option.label}
                </span>
            </div>
        );
    };

    // Custom format for the selected value
    const formatSelectedValue = option => {
        if (!option) return null;
        const showIcon = option.icon || icon;

        return (
            <div
                className={`flex items-center gap-2 ${variant === "primary" ? "w-full justify-center" : ""} ${option.className || ""}`}
            >
                {showIcon && (
                    <span
                        className={`${sizeStyles.iconSize} flex items-center justify-center shrink-0`}
                    >
                        {option.icon || icon}
                    </span>
                )}
                <span
                    className={`truncate ${size === "lg" ? "text-base" : "text-xs"} ${option.className || ""}`}
                >
                    {option.label}
                </span>
            </div>
        );
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
                    <span
                        className={`flex items-center gap-2 justify-center w-full ${size === "lg" ? "gap-3" : "gap-2"}`}
                    >
                        <span
                            className={`${sizeStyles.iconSize} flex items-center justify-center shrink-0`}
                        >
                            {icon}
                        </span>
                        <span
                            className={size === "lg" ? "text-base" : "text-xs"}
                        >
                            {placeholder}
                        </span>
                    </span>
                ) : (
                    placeholder
                )
            }
            isSearchable={isSearchable}
            isClearable={isClearable}
            isDisabled={isDisabled}
            isLoading={isLoading}
            styles={customStyles}
            formatOptionLabel={(option, { context }) => {
                if (context === "value") {
                    return formatSelectedValue(option);
                }
                return defaultFormatOptionLabel(option, { context });
            }}
            className={`${size === "lg" ? "text-base" : "text-xs"} ${className}`}
            classNamePrefix="react-select"
            menuPortalTarget={menuPortalTarget}
            menuPosition={menuPosition}
            {...props}
        />
    );
};

export default Select;
