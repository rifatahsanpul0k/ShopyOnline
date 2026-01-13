import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
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

  const { products } = useSelector((state) => state.product);

  // Dummy products for demonstration (replace with actual API data)
  const dummyProducts = useMemo(
    () => [
      {
        id: 1,
        name: "HP Victus 15-fa1137tx Gaming Laptop",
        price: 950,
        originalPrice: 1200,
        rating: 5,
        category: "laptops",
        subcategory: "Gaming Laptops",
        brand: "HP",
        image: "/img2.png",
        specs: {
          ram: "16GB",
          storage: "512GB SSD",
          processor: "Intel Core i5",
        },
        inStock: true,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        id: 2,
        name: 'Gaming Monitor 24" 165Hz',
        price: 240,
        rating: 4.8,
        category: "gaming",
        subcategory: "Monitors",
        brand: "ASUS",
        image: "/img2.png",
        specs: { screenSize: "24 inch", refreshRate: "165Hz" },
        inStock: true,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
      {
        id: 3,
        name: "Logitech G502 Hero Wired Gaming Mouse",
        price: 55,
        rating: 4.9,
        category: "gaming",
        subcategory: "Gaming Mice",
        brand: "Logitech",
        image: "/img2.png",
        specs: { connectivity: "Wired", rgb: "RGB" },
        inStock: true,
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      },
      {
        id: 4,
        name: "High-Performance Processor 16-Core",
        price: 420,
        rating: 4.7,
        category: "components",
        subcategory: "Processors",
        brand: "Intel",
        image: "/img2.png",
        specs: { type: "CPU", performance: "High End" },
        inStock: true,
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      },
      {
        id: 5,
        name: "MacBook Pro 14-inch M3",
        price: 1999,
        originalPrice: 2199,
        rating: 5,
        category: "laptops",
        subcategory: "MacBooks",
        brand: "Apple",
        image: "/img2.png",
        specs: { ram: "16GB", storage: "512GB SSD", processor: "Apple M3" },
        inStock: true,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        id: 6,
        name: "Dell XPS 15 Ultrabook",
        price: 1499,
        rating: 4.8,
        category: "laptops",
        subcategory: "Ultrabooks",
        brand: "Dell",
        image: "/img2.png",
        specs: { ram: "32GB", storage: "1TB SSD", processor: "Intel Core i7" },
        inStock: false,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    ],
    []
  );

  // Use dummy products for now (replace with real products from Redux)
  const allProducts =
    products && products.length > 0 ? products : dummyProducts;

  // Get price range from available products
  const priceRange = useMemo(() => {
    if (!allProducts || allProducts.length === 0) return { min: 0, max: 5000 };
    const prices = allProducts.map((p) => p.price);
    return {
      min: Math.floor(Math.min(...prices) / 10) * 10,
      max: Math.ceil(Math.max(...prices) / 10) * 10,
    };
  }, [allProducts]);

  // Filter products
  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts];

    // Category filter
    if (filters.category) {
      filtered = filtered.filter((p) => p.category === filters.category);
    }

    // Subcategory filter
    if (filters.subcategory) {
      filtered = filtered.filter((p) => p.subcategory === filters.subcategory);
    }

    // Search filter
    if (filters.search) {
      filtered = filtered.filter((p) =>
        p.name?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Price filter
    filtered = filtered.filter(
      (p) => p.price >= filters.minPrice && p.price <= filters.maxPrice
    );

    // Brand filter
    if (filters.brands.length > 0) {
      filtered = filtered.filter((p) => filters.brands.includes(p.brand));
    }

    // Stock filter
    if (filters.inStock) {
      filtered = filtered.filter((p) => p.inStock);
    }

    // Rating filter
    if (filters.minRating > 0) {
      filtered = filtered.filter((p) => (p.rating || 0) >= filters.minRating);
    }

    // Sorting
    switch (filters.sort) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      default:
        filtered.sort((a, b) => a.price - b.price);
    }

    return filtered;
  }, [allProducts, filters]);

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
            Showing {filteredProducts.length} of{" "}
            {allProducts.filter((p) => p.category === filters.category).length}{" "}
            results
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
                    <div className="h-8 relative w-full px-2">
                      {/* Gray Background Line */}
                      <div className="absolute top-1/2 -translate-y-1/2 left-2 right-2 h-1.5 bg-gray-200 rounded-full" />

                      {/* Black Active Range Line */}
                      <div
                        className="absolute top-1/2 -translate-y-1/2 h-1.5 bg-black rounded-full z-10"
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
                          const value = Number(e.target.value);
                          if (value < filters.maxPrice) {
                            setFilters({ ...filters, minPrice: value });
                          }
                        }}
                        className="absolute top-1/2 -translate-y-1/2 left-2 w-[calc(100%-1rem)] h-8 appearance-none bg-transparent pointer-events-none z-20 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:appearance-none [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-black [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:border-none"
                      />

                      {/* Max Slider Input */}
                      <input
                        type="range"
                        min={priceRange.min}
                        max={priceRange.max}
                        value={filters.maxPrice}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          if (value > filters.minPrice) {
                            setFilters({ ...filters, maxPrice: value });
                          }
                        }}
                        className="absolute top-1/2 -translate-y-1/2 left-2 w-[calc(100%-1rem)] h-8 appearance-none bg-transparent pointer-events-none z-20 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:appearance-none [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-black [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:border-none"
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
            {filteredProducts.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    : "flex flex-col gap-6"
                }
              >
                {filteredProducts.map((product) => (
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
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                      />

                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {!product.inStock && (
                          <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                            Out of Stock
                          </span>
                        )}
                        {product.originalPrice && (
                          <span className="bg-black text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                            Sale
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
                        {/* Brand */}
                        <p className="text-xs text-black/40 font-bold uppercase tracking-widest mb-2">
                          {product.brand}
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

                        {/* Specs */}
                        {product.specs && (
                          <div
                            className={
                              viewMode === "grid"
                                ? "space-y-1 mb-4"
                                : "flex flex-wrap gap-4 mb-4"
                            }
                          >
                            {Object.entries(product.specs)
                              .slice(0, viewMode === "list" ? 6 : 3)
                              .map(([key, value]) => (
                                <p
                                  key={key}
                                  className="text-[11px] text-black/50 font-medium uppercase tracking-wider"
                                >
                                  — {value}
                                </p>
                              ))}
                          </div>
                        )}

                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(product.rating)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="text-sm text-black/60 ml-1">
                            ({product.rating})
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
                              {formatPrice(product.price)}
                            </span>
                            {product.originalPrice && (
                              <span className="text-sm line-through text-black/40">
                                {formatPrice(product.originalPrice)}
                              </span>
                            )}
                          </div>
                          {product.originalPrice && (
                            <p className="text-xs text-green-600 font-bold mt-1">
                              Save{" "}
                              {Math.round(
                                (1 - product.price / product.originalPrice) *
                                  100
                              )}
                              %
                            </p>
                          )}
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
                ))}
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
