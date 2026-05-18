// src/shared/components/Table.jsx
import React, { useState, useEffect } from "react";
import {
    ChevronDown,
    ChevronUp,
    Search,
    ChevronLeft,
    ChevronRight,
    X
} from "lucide-react";
import Select from "./Select";

const Table = ({
    columns = [],
    data = [],
    keyField = "id",
    onRowClick = null,
    showSearch = true,
    searchPlaceholder = "Search...",
    onSearch = null,
    itemsPerPageOptions = [5, 10, 20, -1],
    itemsPerPage = 5,
    emptyMessage = "No data available",
    className = "",
    headerClassName = "",
    rowClassName = "",
    cellClassName = "",
    actions = null,
    responsive = true
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(itemsPerPage);
    const [viewportWidth, setViewportWidth] = useState(
        typeof window !== "undefined" ? window.innerWidth : 1024
    );

    // Track viewport width changes
    useEffect(() => {
        const handleResize = () => {
            setViewportWidth(window.innerWidth);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Determine which columns to show based on viewport width
    const getVisibleColumns = () => {
        if (!responsive) return columns;

        // Define breakpoints
        const isMobile = viewportWidth < 640; // <640px
        const isTabletSmall = viewportWidth >= 640 && viewportWidth < 768; // 640-768px
        const isTabletLarge = viewportWidth >= 768 && viewportWidth < 1024; // 768-1024px
        const isDesktop = viewportWidth >= 1024; // >=1024px

        if (isDesktop) {
            return columns; // Show all columns on desktop
        }

        if (isTabletLarge) {
            // Show first 4 columns on tablet large
            return columns.slice(0, Math.min(4, columns.length));
        }

        if (isTabletSmall) {
            // Show first 3 columns on tablet small
            return columns.slice(0, Math.min(3, columns.length));
        }

        if (isMobile) {
            // Show first 2 columns on mobile
            return columns.slice(0, Math.min(2, columns.length));
        }

        return columns;
    };

    const visibleColumns = getVisibleColumns();

    // Handle sorting
    const handleSort = columnKey => {
        if (sortColumn === columnKey) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(columnKey);
            setSortDirection("asc");
        }
    };

    // Filter data based on search term
    const filteredData = React.useMemo(() => {
        if (!searchTerm.trim() && !onSearch) {
            return data;
        }

        if (onSearch) {
            return onSearch(searchTerm, data);
        }

        return data.filter(item => {
            return Object.values(item).some(value =>
                String(value).toLowerCase().includes(searchTerm.toLowerCase())
            );
        });
    }, [data, searchTerm, onSearch]);

    // Sort data
    const sortedData = React.useMemo(() => {
        if (!sortColumn) return filteredData;

        return [...filteredData].sort((a, b) => {
            let aVal = a[sortColumn];
            let bVal = b[sortColumn];

            if (sortColumn.includes(".")) {
                const keys = sortColumn.split(".");
                aVal = keys.reduce((obj, key) => obj?.[key], a);
                bVal = keys.reduce((obj, key) => obj?.[key], b);
            }

            if (aVal === undefined || aVal === null) return 1;
            if (bVal === undefined || bVal === null) return -1;

            if (typeof aVal === "number" && typeof bVal === "number") {
                return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
            }

            const comparison = String(aVal).localeCompare(String(bVal));
            return sortDirection === "asc" ? comparison : -comparison;
        });
    }, [filteredData, sortColumn, sortDirection]);

    // Get rows per page value (handle -1 for "All")
    const getRowsPerPageValue = () => {
        if (rowsPerPage === -1) return sortedData.length;
        return rowsPerPage;
    };

    // Pagination
    const rowsPerPageValue = getRowsPerPageValue();
    const totalPages =
        rowsPerPageValue === 0
            ? 1
            : Math.ceil(sortedData.length / rowsPerPageValue);
    const paginatedData =
        rowsPerPageValue === sortedData.length
            ? sortedData
            : sortedData.slice(
                  (currentPage - 1) * rowsPerPageValue,
                  currentPage * rowsPerPageValue
              );

    const handlePageChange = page => {
        setCurrentPage(page);
    };

    const handleRowsPerPageChange = value => {
        setRowsPerPage(value);
        setCurrentPage(1);
    };

    const handleSearch = value => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const clearSearch = () => {
        setSearchTerm("");
        setCurrentPage(1);
    };

    // Get sort icon
    const getSortIcon = columnKey => {
        if (sortColumn !== columnKey) return null;
        return sortDirection === "asc" ? (
            <ChevronUp className="w-3 h-3 inline ml-1 flex-shrink-0" />
        ) : (
            <ChevronDown className="w-3 h-3 inline ml-1 flex-shrink-0" />
        );
    };

    // Get display text for rows per page
    const getRowsPerPageText = value => {
        if (value === -1) return "All";
        return value;
    };

    // Prepare options for Select component
    const selectOptions = itemsPerPageOptions.map(option => ({
        value: option,
        label: getRowsPerPageText(option)
    }));

    return (
        <div className={`w-full ${className}`}>
            {/* Search Bar and Records Selector - Responsive layout */}
            {showSearch && (
                <div className="mb-4 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                    <div className="relative flex-1 max-w-full sm:max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            value={searchTerm}
                            onChange={e => handleSearch(e.target.value)}
                            className="w-full pl-9 pr-8 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-xs"
                        />
                        {searchTerm && (
                            <button
                                onClick={clearSearch}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-4 flex-wrap">
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 whitespace-nowrap">
                                Show
                            </span>
                            <div className="w-24">
                                <Select
                                    options={selectOptions}
                                    value={rowsPerPage}
                                    onChange={handleRowsPerPageChange}
                                    placeholder="Select..."
                                    isSearchable={false}
                                    variant="outline"
                                    className="text-xs"
                                />
                            </div>
                            <span className="text-xs text-gray-500 whitespace-nowrap">
                                records
                            </span>
                        </div>
                        <div className="text-xs text-gray-500 whitespace-nowrap">
                            Showing <strong>{paginatedData.length}</strong> of{" "}
                            <strong>{sortedData.length}</strong> entries
                        </div>
                    </div>
                </div>
            )}

            {/* Table Container - Horizontal scroll on small screens */}
            <div className="overflow-x-auto overflow-y-visible relative">
                <table className="w-full text-xs border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr className={headerClassName}>
                            {visibleColumns.map((column, index) => (
                                <th
                                    key={column.key || index}
                                    onClick={() =>
                                        column.sortable !== false &&
                                        handleSort(column.key)
                                    }
                                    className={`px-3 py-2 text-left font-semibold text-gray-700 text-xs ${
                                        column.sortable !== false
                                            ? "cursor-pointer hover:bg-gray-100 transition-colors"
                                            : ""
                                    } ${column.className || ""}`}
                                    style={{
                                        width: column.width,
                                        minWidth: column.minWidth || "80px"
                                    }}
                                >
                                    <div className="flex items-center gap-1 whitespace-nowrap">
                                        {column.icon && (
                                            <span className="w-3 h-3 flex-shrink-0">
                                                {column.icon}
                                            </span>
                                        )}
                                        <span>{column.header}</span>
                                        {column.sortable !== false &&
                                            getSortIcon(column.key)}
                                    </div>
                                </th>
                            ))}
                            {actions && (
                                <th className="px-3 py-2 text-left font-semibold text-gray-700 text-xs whitespace-nowrap sticky right-0 bg-gray-50 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.05)]">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.length > 0 ? (
                            paginatedData.map((row, rowIndex) => (
                                <tr
                                    key={row[keyField] || rowIndex}
                                    onClick={() =>
                                        onRowClick && onRowClick(row)
                                    }
                                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                                        onRowClick ? "cursor-pointer" : ""
                                    } ${rowClassName}`}
                                >
                                    {visibleColumns.map((column, colIndex) => (
                                        <td
                                            key={column.key || colIndex}
                                            className={`px-3 py-2 text-gray-600 text-xs ${cellClassName} ${column.cellClassName || ""}`}
                                            style={{
                                                width: column.width,
                                                minWidth:
                                                    column.minWidth || "80px"
                                            }}
                                        >
                                            {column.render ? (
                                                column.render(row)
                                            ) : (
                                                <div className="truncate max-w-[200px] md:max-w-none">
                                                    {row[column.key]}
                                                </div>
                                            )}
                                        </td>
                                    ))}
                                    {actions && (
                                        <td className="px-3 py-2 sticky right-0 bg-white shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.05)]">
                                            {actions(row)}
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={
                                        visibleColumns.length +
                                        (actions ? 1 : 0)
                                    }
                                    className="px-3 py-8 text-center text-gray-400 text-xs"
                                >
                                    {emptyMessage}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Responsive Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center sm:justify-end items-center mt-4 pt-4 border-t border-gray-200">
                    <div className="flex gap-1 overflow-x-auto max-w-full pb-1">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`w-7 h-7 rounded-md text-xs font-medium transition-colors flex items-center justify-center flex-shrink-0 ${
                                currentPage === 1
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>

                        {/* Show limited page numbers on mobile */}
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(page => {
                                if (viewportWidth < 640) {
                                    // On mobile, show current page, first, last, and neighbors
                                    return (
                                        page === 1 ||
                                        page === totalPages ||
                                        Math.abs(page - currentPage) <= 1
                                    );
                                }
                                return true;
                            })
                            .map((page, index, filteredArray) => {
                                // Add ellipsis indicator
                                if (
                                    index > 0 &&
                                    page - filteredArray[index - 1] > 1
                                ) {
                                    return (
                                        <span
                                            key={`ellipsis-${page}`}
                                            className="w-7 h-7 flex items-center justify-center text-gray-400"
                                        >
                                            ...
                                        </span>
                                    );
                                }
                                return (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`w-7 h-7 rounded-md text-xs font-medium transition-colors flex-shrink-0 ${
                                            currentPage === page
                                                ? "bg-primary text-white"
                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                    >
                                        {page}
                                    </button>
                                );
                            })}

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`w-7 h-7 rounded-md text-xs font-medium transition-colors flex items-center justify-center flex-shrink-0 ${
                                currentPage === totalPages
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Table;