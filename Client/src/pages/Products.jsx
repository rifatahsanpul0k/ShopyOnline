import { useState, useMemo, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Star,
  SlidersHorizontal,
  X,
  ChevronDown,
  ShoppingBag,
  Grid3x3,
  List,
} from "lucide-react";
import { formatPrice } from "../utils/currencyFormatter";
import { fetchAllProducts } from "../store/slices/productSlice";

// Dynamic category filters based on category type
const CATEGORY_FILTERS = {
  laptops: {
    name: "Laptops",
    subcategories: [
      "Gaming Laptops",
      "Ultrabooks",
      "MacBooks",
      "Business Laptops",
      "2-in-1 Laptops",
    ],
    specs: {
      brand: ["Apple", "Dell", "HP", "Lenovo", "ASUS", "Acer", "MSI"],
      ram: ["8GB", "16GB", "32GB", "64GB"],
      storage: ["256GB SSD", "512GB SSD", "1TB SSD", "2TB SSD"],
      processor: [
        "Intel Core i5",
        "Intel Core i7",
        "Intel Core i9",
        "AMD Ryzen 5",
        "AMD Ryzen 7",
        "AMD Ryzen 9",
        "Apple M1",
        "Apple M2",
        "Apple M3",
      ],
      screenSize: ["13-14 inch", "15-16 inch", "17+ inch"],
    },
  },
  components: {
    name: "Components",
    subcategories: [
      "Processors",
      "Graphics Cards",
      "Motherboards",
      "RAM",
      "Storage",
      "Power Supply",
      "Cooling",
    ],
    specs: {
      brand: [
        "Intel",
        "AMD",
        "NVIDIA",
        "Corsair",
        "G.Skill",
        "Samsung",
        "Western Digital",
      ],
      type: ["CPU", "GPU", "RAM", "SSD", "HDD", "PSU"],
      performance: ["Entry Level", "Mid Range", "High End", "Enthusiast"],
    },
  },
  gaming: {
    name: "Gaming",
    subcategories: [
      "Gaming Mice",
      "Gaming Keyboards",
      "Headsets",
      "Controllers",
      "Monitors",
      "Chairs",
    ],
    specs: {
      brand: ["Logitech", "Razer", "Corsair", "SteelSeries", "HyperX"],
      connectivity: ["Wired", "Wireless", "Bluetooth"],
      rgb: ["RGB", "Non-RGB"],
    },
  },
  accessories: {
    name: "Accessories",
    subcategories: [
      "Cables",
      "Adapters",
      "Cases",
      "Bags",
      "Stands",
      "Chargers",
    ],
    specs: {
      brand: ["Anker", "Belkin", "Apple", "Samsung"],
      type: ["USB-C", "HDMI", "DisplayPort", "Thunderbolt"],
    },
  },
};

const Products = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    specs: true,
    availability: true,
    rating: true,
  });

  // Get category from URL params
  const categoryParam =
    searchParams.get("category")?.toLowerCase() || "laptops";
  const currentCategory =
    CATEGORY_FILTERS[categoryParam] || CATEGORY_FILTERS.laptops;

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: categoryParam,
    subcategory: searchParams.get("subcategory") || "",
    minPrice: 0,
    maxPrice: 5000,
    sort: searchParams.get("sort") || "price-low",
    brands: [],
    specs: {},
    inStock: false,
    minRating: 0,
  });

  const { products, loading, totalProducts } = useSelector(
    (state) => state.product
  );

  // Get price range from available products
  const priceRange = useMemo(() => {
    if (!products || products.length === 0) return { min: 0, max: 5000 };
    const prices = products.map((p) => p.price * 122); // Convert back to original price
    return {
      min: Math.floor(Math.min(...prices) / 10) * 10,
      max: Math.ceil(Math.max(...prices) / 10) * 10,
    };
  }, [products]);

  // Fetch products on mount and when filters change
  useEffect(() => {
    const params = {
      category: filters.category,
      search: filters.search,
    };

    // Add price range if changed from default
    if (filters.minPrice !== 0 || filters.maxPrice !== 5000) {
      params.price = `${filters.minPrice}-${filters.maxPrice}`;
    }

    // Add rating filter
    if (filters.minRating > 0) {
      params.ratings = filters.minRating;
    }

    // Add availability filter
    if (filters.inStock) {
      params.availability = "in-stock";
    }

    dispatch(fetchAllProducts(params));
  }, [
    dispatch,
    filters.category,
    filters.search,
    filters.minPrice,
    filters.maxPrice,
    filters.minRating,
    filters.inStock,
  ]);

  // ----------------------------------------------------------------------
  // SAFARI/WEBKIT FIX: Inject CSS to handle pointer-events on range inputs
  // ----------------------------------------------------------------------
  useEffect(() => {
    const styleId = "slider-styles";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.innerHTML = `
        .range-slider-input {
          -webkit-appearance: none;
          appearance: none;
          pointer-events: none; /* Allows clicking through the track */
          background: transparent;
        }

        /* WebKit (Safari/Chrome) Thumb */
        .range-slider-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          pointer-events: auto; /* Re-enables clicking on the thumb */
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: black;
          border: 2px solid white;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          margin-top: -8px; /* Centers thumb on track */
          position: relative;
          z-index: 20;
        }

        /* Firefox Thumb */
        .range-slider-input::-moz-range-thumb {
          pointer-events: auto;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: black;
          border: 2px solid white;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          border: none;
          z-index: 20;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);
  // ----------------------------------------------------------------------

  // Update filters when price range calculation changes (e.g. data loaded)
  useEffect(() => {
    if (
      priceRange.min !== filters.minPrice ||
      priceRange.max !== filters.maxPrice
    ) {
      setFilters((prev) => ({
        ...prev,
        minPrice: priceRange.min,
        maxPrice: priceRange.max,
      }));
    }
  }, [priceRange, filters.minPrice, filters.maxPrice]);

  // Client-side filtering for subcategory, brand, and sorting
  // (API handles category, price, rating, availability, search)
  const filteredProducts = useMemo(() => {
    if (!products || products.length === 0) return [];

    let filtered = [...products];

    // Subcategory filter (client-side)
    if (filters.subcategory) {
      filtered = filtered.filter((p) => p.subcategory === filters.subcategory);
    }

    // Brand filter (client-side)
    if (filters.brands.length > 0) {
      filtered = filtered.filter((p) => filters.brands.includes(p.brand));
    }

    // Sorting (client-side)
    switch (filters.sort) {
      case "price-low":
        filtered.sort((a, b) => a.price * 122 - b.price * 122);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price * 122 - a.price * 122);
        break;
      default:
        filtered.sort((a, b) => a.price * 122 - b.price * 122);
    }

    return filtered;
  }, [products, filters.subcategory, filters.brands, filters.sort]);

  // Toggle brand filter
  const toggleBrand = (brand) => {
    setFilters((prev) => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter((b) => b !== brand)
        : [...prev.brands, brand],
    }));
  };

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      search: "",
      category: categoryParam,
      subcategory: "",
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      sort: "price-low",
      brands: [],
      specs: {},
      inStock: false,
      minRating: 0,
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
            <span className="font-medium text-black">
              {currentCategory.name}
            </span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter uppercase mb-4">
            {currentCategory.name}
          </h1>
          <p className="text-black/60">
            Showing {filteredProducts.length} of {totalProducts || 0} results
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* SMART SIDEBAR - Dynamic Filters */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-3xl p-6 sticky top-20">
              {/* Header */}
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
                    className={`w-4 h-4 transition-transform ${
                      expandedSections.price ? "" : "-rotate-90"
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
                          left: `calc(0.5rem + ${
                            ((filters.minPrice - priceRange.min) /
                              (priceRange.max - priceRange.min)) *
                            100
                          }% * (100% - 1rem) / 100%)`,
                          right: `calc(0.5rem + ${
                            100 -
                            ((filters.maxPrice - priceRange.min) /
                              (priceRange.max - priceRange.min)) *
                              100
                          }% * (100% - 1rem) / 100%)`,
                        }}
                      />

                      {/* Min Slider Input */}
                      <input
                        type="range"
                        min={priceRange.min}
                        max={priceRange.max}
                        value={filters.minPrice}
                        onChange={(e) => {
                          const value = Math.min(
                            Number(e.target.value),
                            filters.maxPrice - 1
                          );
                          setFilters({ ...filters, minPrice: value });
                        }}
                        className="range-slider-input absolute w-full h-full left-0 top-0 z-20 m-0"
                      />

                      {/* Max Slider Input */}
                      <input
                        type="range"
                        min={priceRange.min}
                        max={priceRange.max}
                        value={filters.maxPrice}
                        onChange={(e) => {
                          const value = Math.max(
                            Number(e.target.value),
                            filters.minPrice + 1
                          );
                          setFilters({ ...filters, maxPrice: value });
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
                      <div className="text-black/40 font-bold self-end mb-3">
                        -
                      </div>
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

              {/* Brand Filters */}
              {currentCategory.specs?.brand && (
                <div className="mb-8">
                  <button
                    onClick={() => toggleSection("specs")}
                    className="w-full flex items-center justify-between mb-4 font-bold text-sm uppercase tracking-wider"
                  >
                    Brand
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        expandedSections.specs ? "" : "-rotate-90"
                      }`}
                    />
                  </button>
                  {expandedSections.specs && (
                    <div className="space-y-2">
                      {currentCategory.specs.brand.map((brand) => (
                        <label
                          key={brand}
                          className="flex items-center gap-3 px-2 py-2 hover:bg-white/50 rounded-lg cursor-pointer transition"
                        >
                          <input
                            type="checkbox"
                            checked={filters.brands.includes(brand)}
                            onChange={() => toggleBrand(brand)}
                            className="w-5 h-5 rounded border-2 border-black/20 accent-black cursor-pointer"
                          />
                          <span className="text-sm font-medium">{brand}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Rating Filter */}
              <div className="mb-8">
                <button
                  onClick={() => toggleSection("rating")}
                  className="w-full flex items-center justify-between mb-4 font-bold text-sm uppercase tracking-wider"
                >
                  Rating
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      expandedSections.rating ? "" : "-rotate-90"
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
                            setFilters({ ...filters, minRating: rating })
                          }
                          className="w-5 h-5 accent-black cursor-pointer"
                        />
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < rating
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
                          setFilters({ ...filters, minRating: 0 })
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
                  onClick={() => toggleSection("availability")}
                  className="w-full flex items-center justify-between mb-4 font-bold text-sm uppercase tracking-wider"
                >
                  Availability
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      expandedSections.availability ? "" : "-rotate-90"
                    }`}
                  />
                </button>
                {expandedSections.availability && (
                  <label className="flex items-center gap-3 px-2 py-2 hover:bg-white/50 rounded-lg cursor-pointer transition">
                    <input
                      type="checkbox"
                      checked={filters.inStock}
                      onChange={(e) =>
                        setFilters({ ...filters, inStock: e.target.checked })
                      }
                      className="w-5 h-5 rounded border-2 border-black/20 accent-black cursor-pointer"
                    />
                    <span className="text-sm font-medium">In Stock Only</span>
                  </label>
                )}
              </div>

              {/* Apply Filters Button */}
              <button className="w-full bg-black text-white font-bold py-4 rounded-pill hover:bg-gray-800 transition uppercase tracking-wider">
                Apply Filters
              </button>
            </div>
          </div>

          {/* PRODUCT GRID - Main Content */}
          <div className="lg:col-span-3">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b-2 border-black/10">
              <div className="flex items-center gap-4">
                <select
                  value={filters.sort}
                  onChange={(e) =>
                    setFilters({ ...filters, sort: e.target.value })
                  }
                  className="px-4 py-2 border-2 border-black/10 rounded-pill font-medium bg-white focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-pill">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-pill transition ${
                    viewMode === "grid"
                      ? "bg-black text-white"
                      : "hover:bg-white"
                  }`}
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-pill transition ${
                    viewMode === "list"
                      ? "bg-black text-white"
                      : "hover:bg-white"
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Products */}
            {loading ? (
              <div className="col-span-3 flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading products...</p>
                </div>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    : "flex flex-col gap-6"
                }
              >
                {filteredProducts.map((product) => {
                  // Get first image from images array or use placeholder
                  const productImage =
                    product.images && product.images.length > 0
                      ? product.images[0].url
                      : "https://via.placeholder.com/400";

                  // Convert price for display (multiply by 122)
                  const displayPrice = product.price * 122;

                  return (
                    <Link
                      key={product.id}
                      to={`/product/${product.id}`}
                      className={
                        viewMode === "grid"
                          ? "group border-b-2 border-transparent hover:border-black transition-all pb-6"
                          : "group flex gap-6 border-b-2 border-black/10 hover:border-black transition-all pb-6"
                      }
                    >
                      {/* Image */}
                      <div
                        className={
                          viewMode === "grid"
                            ? "relative h-64 overflow-hidden mb-6 bg-gray-50 flex items-center justify-center p-4 rounded-2xl"
                            : "relative w-48 h-48 flex-shrink-0 overflow-hidden bg-gray-50 flex items-center justify-center p-4 rounded-2xl"
                        }
                      >
                        <img
                          src={productImage}
                          alt={product.name}
                          className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                        />

                        {/* Badges */}
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                          {product.stock === 0 && (
                            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                              Out of Stock
                            </span>
                          )}
                        </div>

                        {/* Quick Add Button */}
                        {viewMode === "grid" && (
                          <button className="absolute bottom-4 right-4 bg-black text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg">
                            <ShoppingBag className="w-5 h-5" />
                          </button>
                        )}
                      </div>

                      {/* Details */}
                      <div
                        className={
                          viewMode === "list"
                            ? "flex-1 flex flex-col justify-between"
                            : ""
                        }
                      >
                        <div>
                          {/* Category */}
                          <p className="text-xs text-black/40 font-bold uppercase tracking-widest mb-2">
                            {product.category}
                          </p>

                          {/* Title */}
                          <h3
                            className={
                              viewMode === "grid"
                                ? "font-bold text-lg leading-tight mb-3 uppercase tracking-tight line-clamp-2 group-hover:text-black/70 transition"
                                : "font-bold text-xl leading-tight mb-3 uppercase tracking-tight group-hover:text-black/70 transition"
                            }
                          >
                            {product.name}
                          </h3>

                          {/* Description */}
                          {viewMode === "list" && product.description && (
                            <p className="text-sm text-black/60 mb-4 line-clamp-2">
                              {product.description}
                            </p>
                          )}

                          {/* Rating */}
                          <div className="flex items-center gap-1 mb-4">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(product.ratings || 0)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                            <span className="text-sm text-black/60 ml-1">
                              ({product.ratings?.toFixed(1) || "0.0"})
                            </span>
                          </div>
                        </div>

                        {/* Price */}
                        <div
                          className={
                            viewMode === "list"
                              ? "flex items-center justify-between"
                              : "flex items-center justify-between"
                          }
                        >
                          <div>
                            <div className="flex items-center gap-3">
                              <span className="text-2xl font-black">
                                {formatPrice(displayPrice)}
                              </span>
                            </div>
                          </div>
                          {viewMode === "list" && (
                            <button className="bg-black text-white px-6 py-3 rounded-pill hover:bg-gray-800 transition font-bold uppercase tracking-wider flex items-center gap-2">
                              <ShoppingBag className="w-5 h-5" />
                              Add to Cart
                            </button>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-3xl p-16 text-center">
                <div className="max-w-md mx-auto">
                  <div className="bg-black/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShoppingBag className="w-10 h-10 text-black/40" />
                  </div>
                  <h3 className="text-2xl font-black mb-4">
                    No Products Found
                  </h3>
                  <p className="text-black/60 mb-8">
                    We couldn't find any products matching your filters. Try
                    adjusting your search criteria.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="bg-black text-white font-bold px-8 py-4 rounded-pill hover:bg-gray-800 transition uppercase tracking-wider"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
