import React from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Star, X } from "lucide-react";
import { formatPrice } from "../../utils/currencyFormatter";

const FilterSidebar = ({
    filters,
    onFilterChange,
    onResetFilters,
    currentCategory,
    sliderBounds,
    expandedSections,
    onToggleSection,
    categoryParam,
    CATEGORY_FILTERS,
}) => {
    return (
        <div className="lg:col-span-1">
            <div className="sticky top-24">
                {/* Filter Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-black uppercase tracking-tight">
                        Filters
                    </h2>
                    <button
                        onClick={onResetFilters}
                        className="text-sm font-bold text-black/60 hover:text-black transition flex items-center gap-1"
                    >
                        <X className="w-4 h-4" />
                        Reset
                    </button>
                </div>

                <div className="bg-gray-50 p-6 rounded-3xl">
                    {/* Category Filter */}
                    <div className="mb-8">
                        <button
                            onClick={() => onToggleSection("category")}
                            className="w-full flex items-center justify-between mb-4 font-bold text-sm uppercase tracking-wider"
                        >
                            Category
                            <ChevronDown
                                className={`w-4 h-4 transition-transform ${expandedSections.category ? "" : "-rotate-90"
                                    }`}
                            />
                        </button>
                        {expandedSections.category && (
                            <div className="space-y-2">
                                <Link
                                    to="/products"
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition ${!categoryParam
                                            ? "bg-black text-white font-bold"
                                            : "bg-white hover:bg-black/5"
                                        }`}
                                >
                                    <span className="text-sm font-medium">All Products</span>
                                    {!categoryParam && <span className="ml-auto text-xs">✓</span>}
                                </Link>
                                {Object.entries(CATEGORY_FILTERS).map(([key, category]) => (
                                    <Link
                                        key={key}
                                        to={`/products?category=${key}`}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition ${categoryParam === key
                                                ? "bg-black text-white font-bold"
                                                : "bg-white hover:bg-black/5"
                                            }`}
                                    >
                                        <span className="text-sm font-medium">{category.name}</span>
                                        {categoryParam === key && (
                                            <span className="ml-auto text-xs">✓</span>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Price Range */}
                    <div className="mb-8">
                        <button
                            onClick={() => onToggleSection("price")}
                            className="w-full flex items-center justify-between mb-4 font-bold text-sm uppercase tracking-wider"
                        >
                            Price Range
                            <ChevronDown
                                className={`w-4 h-4 transition-transform ${expandedSections.price ? "" : "-rotate-90"
                                    }`}
                            />
                        </button>
                        {expandedSections.price && (
                            <div className="space-y-4">
                                {/* Slider Container */}
                                <div className="h-8 relative w-full px-2 flex items-center">
                                    {/* Gray Background Line */}
                                    <div className="absolute left-2 right-2 h-1.5 bg-gray-200 rounded-full" />

                                    {/* Black Active Range Line */}
                                    <div
                                        className="absolute h-1.5 bg-black rounded-full z-10"
                                        style={{
                                            left: `calc(0.5rem + ${((filters.minPrice - sliderBounds.min) /
                                                    (sliderBounds.max - sliderBounds.min)) *
                                                100
                                                }% * (100% - 1rem) / 100%)`,
                                            right: `calc(0.5rem + ${100 -
                                                ((filters.maxPrice - sliderBounds.min) /
                                                    (sliderBounds.max - sliderBounds.min)) *
                                                100
                                                }% * (100% - 1rem) / 100%)`,
                                        }}
                                    />

                                    {/* Min Slider Input */}
                                    <input
                                        type="range"
                                        min={sliderBounds.min}
                                        max={sliderBounds.max}
                                        value={filters.minPrice}
                                        onChange={(e) => {
                                            const value = Math.min(
                                                Number(e.target.value),
                                                filters.maxPrice - 1
                                            );
                                            onFilterChange({ ...filters, minPrice: value });
                                        }}
                                        className="range-slider-input absolute w-full h-full left-0 top-0 z-20 m-0"
                                    />

                                    {/* Max Slider Input */}
                                    <input
                                        type="range"
                                        min={sliderBounds.min}
                                        max={sliderBounds.max}
                                        value={filters.maxPrice}
                                        onChange={(e) => {
                                            const value = Math.max(
                                                Number(e.target.value),
                                                filters.minPrice + 1
                                            );
                                            onFilterChange({ ...filters, maxPrice: value });
                                        }}
                                        className="range-slider-input absolute w-full h-full left-0 top-0 z-20 m-0"
                                    />
                                </div>

                                {/* Price Labels */}
                                <div className="flex items-center justify-between gap-4 px-2">
                                    <div className="flex-1">
                                        <label className="text-xs text-black/60 uppercase font-bold mb-1 block">
                                            Min
                                        </label>
                                        <div className="bg-white px-3 py-2 rounded-pill border-2 border-black/10 font-bold text-sm text-center">
                                            {formatPrice(filters.minPrice)}
                                        </div>
                                    </div>
                                    <div className="text-black/40 font-bold self-end mb-3">-</div>
                                    <div className="flex-1">
                                        <label className="text-xs text-black/60 uppercase font-bold mb-1 block">
                                            Max
                                        </label>
                                        <div className="bg-white px-3 py-2 rounded-pill border-2 border-black/10 font-bold text-sm text-center">
                                            {formatPrice(filters.maxPrice)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Rating Filter */}
                    <div className="mb-8">
                        <button
                            onClick={() => onToggleSection("rating")}
                            className="w-full flex items-center justify-between mb-4 font-bold text-sm uppercase tracking-wider"
                        >
                            Rating
                            <ChevronDown
                                className={`w-4 h-4 transition-transform ${expandedSections.rating ? "" : "-rotate-90"
                                    }`}
                            />
                        </button>
                        {expandedSections.rating && (
                            <div className="space-y-2">
                                {[5, 4, 3, 2, 1].map((rating) => (
                                    <label
                                        key={rating}
                                        className="flex items-center gap-3 px-2 py-2 hover:bg-white/50 rounded-lg cursor-pointer transition"
                                    >
                                        <input
                                            type="radio"
                                            name="rating"
                                            checked={filters.minRating === rating}
                                            onChange={() =>
                                                onFilterChange({ ...filters, minRating: rating })
                                            }
                                            className="w-5 h-5 accent-black cursor-pointer"
                                        />
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-4 h-4 ${i < rating
                                                            ? "fill-yellow-400 text-yellow-400"
                                                            : "text-gray-300"
                                                        }`}
                                                />
                                            ))}
                                            <span className="text-sm font-medium ml-1">& Up</span>
                                        </div>
                                    </label>
                                ))}
                                <label className="flex items-center gap-3 px-2 py-2 hover:bg-white/50 rounded-lg cursor-pointer transition">
                                    <input
                                        type="radio"
                                        name="rating"
                                        checked={filters.minRating === 0}
                                        onChange={() =>
                                            onFilterChange({ ...filters, minRating: 0 })
                                        }
                                        className="w-5 h-5 accent-black cursor-pointer"
                                    />
                                    <span className="text-sm font-medium">All Ratings</span>
                                </label>
                            </div>
                        )}
                    </div>

                    {/* Availability */}
                    <div className="mb-8">
                        <button
                            onClick={() => onToggleSection("availability")}
                            className="w-full flex items-center justify-between mb-4 font-bold text-sm uppercase tracking-wider"
                        >
                            Availability
                            <ChevronDown
                                className={`w-4 h-4 transition-transform ${expandedSections.availability ? "" : "-rotate-90"
                                    }`}
                            />
                        </button>
                        {expandedSections.availability && (
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { label: "All", value: "all" },
                                    { label: "In Stock", value: "in-stock" },
                                    { label: "Limited", value: "limited" },
                                    { label: "Out of Stock", value: "out-of-stock" },
                                ].map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() =>
                                            onFilterChange({ ...filters, availability: option.value })
                                        }
                                        className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full border transition-all ${filters.availability === option.value
                                                ? "bg-black text-white border-black"
                                                : "bg-white text-black border-gray-200 hover:border-black"
                                            }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Apply Filters Button */}
                    <button className="w-full bg-black text-white font-bold py-4 rounded-pill hover:bg-gray-800 transition uppercase tracking-wider">
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterSidebar;
