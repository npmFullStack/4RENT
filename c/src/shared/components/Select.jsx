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
    ...props
}) => {
    // Format option with optional icon
    const defaultFormatOptionLabel = (option, { context }) => {
        if (!option.icon && !icon) {
            return option.label;
        }

        return (
            <div className="flex items-center gap-2">
                {(option.icon || icon) && (
                    <span className="w-4 h-4 flex items-center">
                        {option.icon || icon}
                    </span>
                )}
                <span>{option.label}</span>
            </div>
        );
    };

    // Custom styles for Tailwind integration
    const customStyles = {
        control: (base, state) => ({
            ...base,
            backgroundColor: "white",
            borderColor: state.isFocused ? "#E6B800" : "#D1D5DB",
            borderWidth: "1px",
            borderRadius: "0.5rem",
            boxShadow: state.isFocused
                ? "0 0 0 2px rgba(230, 184, 0, 0.2)"
                : "none",
            "&:hover": {
                borderColor: state.isFocused ? "#E6B800" : "#9CA3AF"
            },
            minHeight: "32px",
            fontSize: "0.75rem"
        }),
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
            fontSize: "0.75rem"
        }),
        option: (base, state) => {
            let backgroundColor = "white";
            let color = "#374151";
            
            if (state.isSelected) {
                backgroundColor = "#E6B800"; // Deep yellow from your tailwind config
                color = "white"; // White text for selected
            } else if (state.isFocused) {
                backgroundColor = "#FEF3C7"; // Light yellow for hover
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
                padding: "6px 12px",
                fontSize: "0.75rem"
            };
        },
        singleValue: base => ({
            ...base,
            color: "#374151",
            fontSize: "0.75rem"
        }),
        placeholder: base => ({
            ...base,
            color: "#9CA3AF",
            fontSize: "0.75rem"
        }),
        dropdownIndicator: (base, state) => ({
            ...base,
            color: "#9CA3AF",
            padding: "4px",
            "&:hover": {
                color: "#6B7280"
            }
        }),
        clearIndicator: base => ({
            ...base,
            color: "#9CA3AF",
            padding: "4px",
            "&:hover": {
                color: "#6B7280"
            }
        }),
        indicatorSeparator: base => ({
            ...base,
            backgroundColor: "#D1D5DB",
            marginTop: "4px",
            marginBottom: "4px"
        }),
        noOptionsMessage: base => ({
            ...base,
            color: "#9CA3AF",
            fontSize: "0.75rem",
            padding: "12px"
        }),
        loadingMessage: base => ({
            ...base,
            color: "#9CA3AF",
            fontSize: "0.75rem",
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
            placeholder={placeholder}
            isSearchable={isSearchable}
            isClearable={isClearable}
            isDisabled={isDisabled}
            isLoading={isLoading}
            styles={customStyles}
            formatOptionLabel={formatOptionLabel || defaultFormatOptionLabel}
            className={`text-xs ${className}`}
            classNamePrefix="react-select"
            {...props}
        />
    );
};

export default Select;