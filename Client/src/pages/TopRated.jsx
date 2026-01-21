import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllProducts } from "../store/slices/productSlice";
import { formatPrice } from "../utils/currencyFormatter";
import {
    Star,
    ShoppingBag,
    ChevronDown,
    SlidersHorizontal,
    X,
    Grid3x3,
    List,
    Award,
} from "lucide-react";
import StockBadge from "../components/ui/StockBadge";

const TopRated = () => {
    const dispatch = useDispatch();
    const { topRatedProducts, loading } = useSelector((state) => state.product);
    const [viewMode, setViewMode] = useState("grid");
    const [expandedSections, setExpandedSections] = useState({
        price: true,
        rating: true,
        availability: true,
    });

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    // Slider bounds
    const [sliderBounds, setSliderBounds] = useState({ min: 0, max: 2000 });
    const [isBoundsInitialized, setIsBoundsInitialized] = useState(false);

    // Filters
    const [filters, setFilters] = useState({
        minPrice: 0,
        maxPrice: 2000,
        sort: "rating",
        minRating: 0,
        availability: "all",
    });

    useEffect(() => {
        dispatch(fetchAllProducts());
    }, [dispatch]);

    // Initialize Slider Bounds
    useEffect(() => {
        if (!loading && topRatedProducts && topRatedProducts.length > 0 && !isBoundsInitialized) {
            const prices = topRatedProducts.map((p) => parseFloat(p.price));
            const min = Math.floor(Math.min(...prices));
            const max = Math.ceil(Math.max(...prices));
            const safeMax = max === min ? max + 100 : max;

            setSliderBounds({ min, max: safeMax });
            setFilters((prev) => ({
                ...prev,
                minPrice: min,
                maxPrice: safeMax,
            }));
            setIsBoundsInitialized(true);
        }
    }, [topRatedProducts, loading, isBoundsInitialized]);

    // Filter and sort products
    const filteredProducts = useMemo(() => {
        if (!topRatedProducts || topRatedProducts.length === 0) return [];

        let filtered = [...topRatedProducts];

        // Filter by price
        filtered = filtered.filter(
            (p) => parseFloat(p.price) >= filters.minPrice && parseFloat(p.price) <= filters.maxPrice
        );

        // Filter by rating
        if (filters.minRating > 0) {
            filtered = filtered.filter((p) => (p.ratings || 0) >= filters.minRating);
        }

        // Filter by availability
        if (filters.availability === "in-stock") {
            filtered = filtered.filter((p) => p.stock > 5);
        } else if (filters.availability === "limited") {
            filtered = filtered.filter((p) => p.stock > 0 && p.stock <= 5);
        } else if (filters.availability === "out-of-stock") {
            filtered = filtered.filter((p) => p.stock === 0);
        }

        // Sort
        switch (filters.sort) {
            case "price-low":
                filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
                break;
            case "price-high":
                filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
                break;
            case "newest":
                filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                break;
            case "rating":
                filtered.sort((a, b) => (b.ratings || 0) - (a.ratings || 0));
                break;
            default:
                break;
        }

        return filtered;
    }, [topRatedProducts, filters]);

    // Pagination
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredProducts, currentPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [filters]);

    const toggleSection = (section) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const resetFilters = () => {
        setFilters({
            minPrice: sliderBounds.min,
            maxPrice: sliderBounds.max,
            sort: "rating",
            minRating: 0,
            availability: "all",
        });
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-[1440px] mx-auto px-6 py-12">
                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-2 text-sm text-black/60 mb-4">
                        <Link to="/" className="hover:text-black transition">
                            Home
                        </Link>
                        <ChevronDown className="w-4 h-4 -rotate-90" />
                        <span className="font-medium text-black">Top Rated Products</span>
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter uppercase mb-4 flex items-center gap-4">
                        <Award className="w-12 h-12 text-yellow-400" />
                        Top Rated Products
                    </h1>
                    <p className="text-black/60">
                        Showing {filteredProducts.length} of {topRatedProducts?.length || 0} results
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-50 rounded-3xl p-6 sticky top-20">
                            <div className="flex items-center justify-between mb-8 pb-6 border-b-2 border-black/10">
                                <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
                                    <SlidersHorizontal className="w-6 h-6" />
                                    Filters
                                </h2>
                                <button
                                    onClick={resetFilters}
                                    className="text-sm font-bold text-black/60 hover:text-black transition flex items-center gap-1"
                                >
                                    <X className="w-4 h-4" />
                                    Reset
                                </button>
                            </div>

                            {/* Price Range */}
                            <div className="mb-8">
                                <button
                                    onClick={() => toggleSection("price")}
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
                                        <div className="h-8 relative w-full px-2 flex items-center">
                                            <div className="absolute left-2 right-2 h-1.5 bg-gray-200 rounded-full" />
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
                                            <input
                                                type="range"
                                                min={sliderBounds.min}
                                                max={sliderBounds.max}
                                                value={filters.minPrice}
                                                onChange={(e) => {
                                                    const value = Math.min(Number(e.target.value), filters.maxPrice - 1);
                                                    setFilters({ ...filters, minPrice: value });
                                                }}
                                                className="range-slider-input absolute w-full h-full left-0 top-0 z-20 m-0"
                                                style={{
                                                    WebkitAppearance: "none",
                                                    appearance: "none",
                                                    pointerEvents: "none",
                                                    background: "transparent",
                                                }}
                                            />
                                            <input
                                                type="range"
                                                min={sliderBounds.min}
                                                max={sliderBounds.max}
                                                value={filters.maxPrice}
                                                onChange={(e) => {
                                                    const value = Math.max(Number(e.target.value), filters.minPrice + 1);
                                                    setFilters({ ...filters, maxPrice: value });
                                                }}
                                                className="range-slider-input absolute w-full h-full left-0 top-0 z-20 m-0"
                                                style={{
                                                    WebkitAppearance: "none",
                                                    appearance: "none",
                                                    pointerEvents: "none",
                                                    background: "transparent",
                                                }}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between gap-4 px-2">
                                            <div className="flex-1">
                                                <label className="text-xs text-black/60 uppercase font-bold mb-1 block">
                                                    Min
                                                </label>
                                                <div className="bg-white px-3 py-2 rounded-full border-2 border-black/10 font-bold text-sm text-center">
                                                    {formatPrice(filters.minPrice)}
                                                </div>
                                            </div>
                                            <div className="text-black/40 font-bold self-end mb-3">-</div>
                                            <div className="flex-1">
                                                <label className="text-xs text-black/60 uppercase font-bold mb-1 block">
                                                    Max
                                                </label>
                                                <div className="bg-white px-3 py-2 rounded-full border-2 border-black/10 font-bold text-sm text-center">
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
                                    onClick={() => toggleSection("rating")}
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
                                        {[5, 4.5, 4, 3, 2].map((rating) => (
                                            <label
                                                key={rating}
                                                className="flex items-center gap-3 px-2 py-2 hover:bg-white/50 rounded-lg cursor-pointer transition"
                                            >
                                                <input
                                                    type="radio"
                                                    name="rating"
                                                    checked={filters.minRating === rating}
                                                    onChange={() => setFilters({ ...filters, minRating: rating })}
                                                    className="w-4 h-4 accent-black"
                                                />
                                                <div className="flex items-center gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`w-4 h-4 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-sm">& up</span>
                                            </label>
                                        ))}
                                        <label className="flex items-center gap-3 px-2 py-2 hover:bg-white/50 rounded-lg cursor-pointer transition">
                                            <input
                                                type="radio"
                                                name="rating"
                                                checked={filters.minRating === 0}
                                                onChange={() => setFilters({ ...filters, minRating: 0 })}
                                                className="w-4 h-4 accent-black"
                                            />
                                            <span className="text-sm font-medium">All Ratings</span>
                                        </label>
                                    </div>
                                )}
                            </div>

                            {/* Availability Filter */}
                            <div className="mb-8">
                                <button
                                    onClick={() => toggleSection("availability")}
                                    className="w-full flex items-center justify-between mb-4 font-bold text-sm uppercase tracking-wider"
                                >
                                    Availability
                                    <ChevronDown
                                        className={`w-4 h-4 transition-transform ${expandedSections.availability ? "" : "-rotate-90"
                                            }`}
                                    />
                                </button>
                                {expandedSections.availability && (
                                    <div className="space-y-2">
                                        {[
                                            { value: "all", label: "All Products" },
                                            { value: "in-stock", label: "In Stock" },
                                            { value: "limited", label: "Limited Stock" },
                                            { value: "out-of-stock", label: "Out of Stock" },
                                        ].map((option) => (
                                            <label
                                                key={option.value}
                                                className="flex items-center gap-3 px-2 py-2 hover:bg-white/50 rounded-lg cursor-pointer transition"
                                            >
                                                <input
                                                    type="radio"
                                                    name="availability"
                                                    checked={filters.availability === option.value}
                                                    onChange={() => setFilters({ ...filters, availability: option.value })}
                                                    className="w-4 h-4 accent-black"
                                                />
                                                <span className="text-sm font-medium">{option.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="lg:col-span-3">
                        {/* Sort and View Options */}
                        <div className="flex items-center justify-between mb-8 pb-6 border-b-2 border-black/5">
                            <div className="flex items-center gap-4">
                                <label className="text-sm font-bold uppercase tracking-wider">Sort By:</label>
                                <select
                                    value={filters.sort}
                                    onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                                    className="bg-white border-2 border-black/10 rounded-full px-4 py-2 font-bold text-sm focus:outline-none focus:border-black transition"
                                >
                                    <option value="rating">Highest Rated</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="newest">Newest First</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`p-2 rounded-lg transition ${viewMode === "grid" ? "bg-black text-white" : "bg-gray-100 hover:bg-gray-200"
                                        }`}
                                >
                                    <Grid3x3 className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`p-2 rounded-lg transition ${viewMode === "list" ? "bg-black text-white" : "bg-gray-100 hover:bg-gray-200"
                                        }`}
                                >
                                    <List className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                            </div>
                        ) : paginatedProducts.length > 0 ? (
                            <>
                                <div
                                    className={
                                        viewMode === "grid"
                                            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
                                            : "flex flex-col gap-6"
                                    }
                                >
                                    {paginatedProducts.map((product) => {
                                        const images =
                                            typeof product.images === "string" ? JSON.parse(product.images) : product.images;
                                        const productImage = images && images.length > 0 ? images[0].url : "/img2.png";

                                        return (
                                            <Link
                                                key={product.id}
                                                to={`/product/${product.id}`}
                                                className={`group border-b-2 border-transparent hover:border-black transition-all pb-6 ${viewMode === "list" ? "flex gap-6" : ""
                                                    }`}
                                            >
                                                <div
                                                    className={`overflow-hidden mb-6 bg-gray-50 flex items-center justify-center p-4 relative ${viewMode === "list" ? "w-48 h-48 mb-0" : "h-64"
                                                        }`}
                                                >
                                                    <img
                                                        src={productImage}
                                                        alt={product.name}
                                                        className={`w-full h-full object-contain transition-all duration-500 ${product.stock === 0 ? "grayscale" : ""
                                                            }`}
                                                    />
                                                    <StockBadge stock={product.stock || 0} />
                                                    {product.ratings >= 4.5 && (
                                                        <div className="absolute top-2 left-2 bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-black uppercase flex items-center gap-1">
                                                            <Award className="w-3 h-3" />
                                                            Best
                                                        </div>
                                                    )}
                                                </div>
                                                <div className={viewMode === "list" ? "flex-1" : ""}>
                                                    <h3 className="font-bold text-lg leading-tight mb-3 uppercase tracking-tight line-clamp-2">
                                                        {product.name}
                                                    </h3>
                                                    <div className="space-y-1 mb-4">
                                                        <p className="text-[11px] text-black/50 font-medium uppercase tracking-wider">
                                                            — {product.category}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-1 mb-4">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`w-4 h-4 ${i < Math.floor(product.ratings || 0)
                                                                        ? "fill-yellow-400 text-yellow-400"
                                                                        : "text-gray-300"
                                                                    }`}
                                                            />
                                                        ))}
                                                        <span className="text-sm text-black/60 ml-1">
                                                            ({product.ratings ? Number(product.ratings).toFixed(1) : "0.0"})
                                                        </span>
                                                        {product.review_count && (
                                                            <span className="text-xs text-black/40 ml-1">
                                                                ({product.review_count} reviews)
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-2xl font-black">{formatPrice(product.price)}</span>
                                                        <button className="bg-black text-white p-3 rounded-full hover:bg-gray-800 transition">
                                                            <ShoppingBag className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-2 mt-12">
                                        <button
                                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            className="px-4 py-2 rounded-lg border-2 border-black/10 font-bold disabled:opacity-30 hover:bg-black hover:text-white transition"
                                        >
                                            Previous
                                        </button>
                                        {[...Array(totalPages)].map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setCurrentPage(i + 1)}
                                                className={`w-10 h-10 rounded-lg font-bold transition ${currentPage === i + 1
                                                        ? "bg-black text-white"
                                                        : "border-2 border-black/10 hover:bg-black hover:text-white"
                                                    }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className="px-4 py-2 rounded-lg border-2 border-black/10 font-bold disabled:opacity-30 hover:bg-black hover:text-white transition"
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-xl text-black/60 mb-6">No products match your filters</p>
                                <button
                                    onClick={resetFilters}
                                    className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full hover:bg-gray-800 transition font-bold uppercase"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopRated;
