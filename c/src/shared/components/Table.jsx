// src/shared/components/Table.jsx
import React, { useState } from "react";
import { ChevronDown, ChevronUp, Search, Filter, X } from "lucide-react";

const Table = ({
    columns = [],
    data = [],
    keyField = "id",
    onRowClick = null,
    showSearch = true,
    searchPlaceholder = "Search...",
    onSearch = null,
    itemsPerPage = 10,
    emptyMessage = "No data available",
    className = "",
    headerClassName = "",
    rowClassName = "",
    cellClassName = "",
    actions = null, // Function that returns action buttons for each row
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState("asc");
    const [currentPage, setCurrentPage] = useState(1);

    // Handle sorting
    const handleSort = (columnKey) => {
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

        return data.filter((item) => {
            return Object.values(item).some((value) =>
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

            // Handle nested values (e.g., "category.name")
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

    // Pagination
    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const paginatedData = sortedData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const clearSearch = () => {
        setSearchTerm("");
        setCurrentPage(1);
    };

    // Get sort icon
    const getSortIcon = (columnKey) => {
        if (sortColumn !== columnKey) return null;
        return sortDirection === "asc" ? (
            <ChevronUp className="w-4 h-4 inline ml-1" />
        ) : (
            <ChevronDown className="w-4 h-4 inline ml-1" />
        );
    };

    return (
        <div className={`w-full ${className}`}>
            {/* Search Bar */}
            {showSearch && (
                <div className="mb-4 flex justify-between items-center gap-3 flex-wrap">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full pl-9 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        />
                        {searchTerm && (
                            <button
                                onClick={clearSearch}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                    <div className="text-sm text-gray-500">
                        Showing {paginatedData.length} of {sortedData.length}{" "}
                        entries
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr className={headerClassName}>
                            {columns.map((column, index) => (
                                <th
                                    key={column.key || index}
                                    onClick={() =>
                                        column.sortable !== false &&
                                        handleSort(column.key)
                                    }
                                    className={`px-4 py-3 text-left font-semibold text-gray-700 ${
                                        column.sortable !== false
                                            ? "cursor-pointer hover:bg-gray-100 transition-colors"
                                            : ""
                                    } ${column.className || ""}`}
                                    style={{ width: column.width }}
                                >
                                    <div className="flex items-center gap-1">
                                        {column.icon && (
                                            <span className="w-4 h-4">
                                                {column.icon}
                                            </span>
                                        )}
                                        {column.header}
                                        {column.sortable !== false &&
                                            getSortIcon(column.key)}
                                    </div>
                                </th>
                            ))}
                            {actions && (
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">
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
                                    {columns.map((column, colIndex) => (
                                        <td
                                            key={column.key || colIndex}
                                            className={`px-4 py-3 text-gray-600 ${cellClassName} ${column.cellClassName || ""}`}
                                        >
                                            {column.render
                                                ? column.render(row)
                                                : row[column.key]}
                                        </td>
                                    ))}
                                    {actions && (
                                        <td className="px-4 py-3">
                                            {actions(row)}
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={
                                        columns.length + (actions ? 1 : 0)
                                    }
                                    className="px-4 py-8 text-center text-gray-400"
                                >
                                    {emptyMessage}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === 1
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        Previous
                    </button>
                    <div className="flex gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                            (page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                                        currentPage === page
                                            ? "bg-primary text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    {page}
                                </button>
                            )
                        )}
                    </div>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === totalPages
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default Table;