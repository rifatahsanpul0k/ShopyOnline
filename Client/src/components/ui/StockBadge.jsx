import React from "react";

const StockBadge = ({ stock }) => {
    // Logic for stock status
    // 0 = Out of Stock
    // 1-10 = Limited Stock
    // > 10 = In Stock (implied)

    if (stock === 0) {
        return (
            <div className="absolute top-2 left-2 bg-black text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider z-10 whitespace-nowrap">
                Out of Stock
            </div>
        );
    }

    if (stock > 0 && stock <= 10) {
        return (
            <div className="absolute top-2 left-2 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider z-10 shadow-sm animate-pulse whitespace-nowrap">
                Limited Stock
            </div>
        );
    }

    // Default: In Stock (stock > 10)
    return (
        <div className="absolute top-2 left-2 bg-white text-black px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider z-10 shadow-md border border-gray-100 whitespace-nowrap">
            In Stock
        </div>
    );
};

export default StockBadge;
