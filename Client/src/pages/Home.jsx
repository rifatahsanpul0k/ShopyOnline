import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Button from "../components/ui/Button";
import { formatPrice } from "../utils/currencyFormatter";
import { fetchAllProducts } from "../store/slices/productSlice";
import {
  Star,
  ChevronRight,
  ChevronLeft,
  Zap,
  Truck,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  ArrowRight,
  Clock,
} from "lucide-react";
import StockBadge from "../components/ui/StockBadge";

// Hero Slider Data
const HERO_SLIDES = [
  {
    id: 1,
    title: "TRUSTED BRANDS.",
    subtitle: "Precision engineered components. Uncompromising power.",
    image: "/img1.jpg",
    cta: "SHOP NOW",
    link: "/products",
  },
  {
    id: 2,
    title: "GAMING LAPTOPS.",
    subtitle: "Experience ultimate performance with cutting-edge technology.",
    image: "/img2.png",
    cta: "EXPLORE",
    link: "/products?category=Laptops",
  },
  {
    id: 3,
    title: "PC COMPONENTS.",
    subtitle: "Build your dream setup with premium parts.",
    image: "/img2.png",
    cta: "BROWSE",
    link: "/products?category=Components",
  },
];

const FEATURED_TECH = [
  {
    id: 1,
    name: "HP Victus 15-fa1137tx Gaming Laptop",
    price: 950,
    rating: 5,
    specs: ["Core i5 13th Gen", "RTX 3050 6GB", "16GB DDR4 RAM"],
    image: "/img2.png",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
  },
  {
    id: 2,
    name: 'Gaming Monitor 24" 165Hz',
    price: 240,
    rating: 4.8,
    specs: ["165Hz Refresh Rate", "IPS Panel", "1ms MPRT"],
    image: "/img2.png",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
  },
  {
    id: 3,
    name: "Logitech G502 Hero Wired Gaming Mouse",
    price: 55,
    rating: 4.9,
    specs: ["25K DPI Sensor", "11 Buttons", "RGB Lighting"],
    image: "/img2.png",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
  },
  {
    id: 4,
    name: "High-Performance Processor 16-Core",
    price: 420,
    rating: 4.7,
    specs: ["16 Cores", "24 Threads", "5.40 GHz Boost"],
    image: "/img2.png",
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
  },
  {
    id: 5,
    name: "Corsair Vengeance RGB 32GB DDR5",
    price: 180,
    rating: 4.6,
    specs: ["5600MHz", "RGB Lighting", "Low Latency"],
    image: "/img2.png",
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), // 25 days ago
  },
  {
    id: 6,
    name: "Ultra-Fast 1TB NVMe SSD",
    price: 150,
    rating: 4.8,
    specs: ["7000MB/s Read", "PCIe 4.0", "Heatsink"],
    image: "/img2.png",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
  },
  {
    id: 7,
    name: "NVIDIA GeForce RTX 4070 Ti",
    price: 850,
    rating: 5,
    specs: ["12GB GDDR6X", "DLSS 3", "Ray Tracing"],
    image: "/img2.png",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
  },
  {
    id: 8,
    name: "Cooler Master MasterLiquid 360",
    price: 120,
    rating: 4.5,
    specs: ["360mm Radiator", "RGB Fans", "Silent Operation"],
    image: "/img2.png",
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), // 12 days ago
  },
];

const CATEGORIES = [
  { name: "Laptops", image: "/img2.png", slug: "laptops" },
  { name: "Smartphones", image: "/img2.png", slug: "smartphones" },
  { name: "Components", image: "/img2.png", slug: "components" },
  { name: "Watches", image: "/img2.png", slug: "watches" },
];

const Home = () => {
  const dispatch = useDispatch();
  const { authUser } = useSelector((state) => state.auth);
  const { newProducts, topRatedProducts, loading, totalProducts } = useSelector(
    (state) => state.product
  );
  const navigate = useNavigate();

  // Hero Slider State
  const [currentSlide, setCurrentSlide] = useState(0);

  // Product Slider States
  const [newArrivalsIndex, setNewArrivalsIndex] = useState(0);
  const [topRatedIndex, setTopRatedIndex] = useState(0);

  // Auth Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [intendedDestination, setIntendedDestination] = useState("");

  // Fetch products on component mount
  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  // Auto-advance slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length
    );
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const handleCategoryClick = (categorySlug) => {
    if (!authUser) {
      setIntendedDestination(`/products?category=${categorySlug}`);
      setShowAuthModal(true);
      return;
    }
    navigate(`/products?category=${categorySlug}`);
  };

  // Protected navigation handler
  const handleProtectedNavigation = (e) => {
    if (!authUser) {
      e.preventDefault();
      const targetPath = e.currentTarget.getAttribute("href");
      setIntendedDestination(targetPath);
      setShowAuthModal(true);
      return;
    }
    // If authenticated, navigation will proceed normally
  };

  // Product slider navigation
  const nextNewArrivals = () => {
    if (newArrivalsIndex < (newProducts?.length || 0) - 4) {
      setNewArrivalsIndex(newArrivalsIndex + 1);
    }
  };

  const prevNewArrivals = () => {
    if (newArrivalsIndex > 0) {
      setNewArrivalsIndex(newArrivalsIndex - 1);
    }
  };

  const nextTopRated = () => {
    if (topRatedIndex < (topRatedProducts?.length || 0) - 4) {
      setTopRatedIndex(topRatedIndex + 1);
    }
  };

  const prevTopRated = () => {
    if (topRatedIndex > 0) {
      setTopRatedIndex(topRatedIndex - 1);
    }
  };
  return (
    <main className="w-full overflow-x-hidden bg-white text-black">
      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl p-8 lg:p-12 max-w-md w-full relative">
            {/* Close Button */}
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
              aria-label="Close modal"
            >
              <span className="text-2xl font-bold text-black">×</span>
            </button>

            <h2 className="text-3xl lg:text-4xl font-black tracking-tighter uppercase mb-4">
              Login Required
            </h2>
            <p className="text-black/60 mb-8">
              Please log in or create an account to access this feature and
              explore our products.
            </p>

            <div className="flex flex-col gap-4">
              <Link
                to={`/auth/login?redirect=${encodeURIComponent(
                  intendedDestination
                )}`}
                className="w-full bg-black text-white font-bold py-4 px-8 rounded-pill hover:bg-gray-800 transition text-center uppercase tracking-wider"
              >
                Login
              </Link>
              <Link
                to={`/auth/register?redirect=${encodeURIComponent(
                  intendedDestination
                )}`}
                className="w-full bg-white text-black font-bold py-4 px-8 rounded-pill border-2 border-black hover:bg-black hover:text-white transition text-center uppercase tracking-wider"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 1. HERO SECTION WITH SLIDER */}
      <section className="bg-white border-b border-black relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-12 lg:pt-24 pb-24">
          {/* Slider Container */}
          <div className="relative">
            {/* Slides */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[600px]">
              {/* Content Side */}
              <div className="space-y-8 z-10 relative">
                {/* Slide Number Indicator */}
                <div className="absolute -top-8 left-0 text-7xl font-black text-black/5">
                  0{currentSlide + 1}
                </div>

                <h1 className="text-5xl lg:text-[80px] leading-[0.95] font-heading font-black text-black tracking-tighter uppercase">
                  {HERO_SLIDES[currentSlide].title}
                </h1>
                <p className="text-black/60 text-base lg:text-xl max-w-md leading-relaxed">
                  {HERO_SLIDES[currentSlide].subtitle}
                </p>

                <div className="flex flex-wrap gap-4 pt-4">
                  <Link
                    to={HERO_SLIDES[currentSlide].link}
                    onClick={handleProtectedNavigation}
                  >
                    <Button className="gap-2 bg-black text-white border-2 border-black hover:bg-white hover:text-black transition-all px-10 py-6 text-base font-bold">
                      {HERO_SLIDES[currentSlide].cta}
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </Link>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-12 pt-8 border-t-2 border-black/10">
                  <div>
                    <h3 className="text-5xl font-black text-black mb-1">
                      {totalProducts || 0}
                    </h3>
                    <p className="text-black/40 text-xs font-bold uppercase tracking-widest">
                      Products
                    </p>
                  </div>
                  <div>
                    <h3 className="text-5xl font-black text-black mb-1">
                      24/7
                    </h3>
                    <p className="text-black/40 text-xs font-bold uppercase tracking-widest">
                      Support
                    </p>
                  </div>
                </div>

                {/* Slider Controls - Desktop Position */}
                <div className="hidden lg:flex items-center gap-4 pt-8">
                  {/* Previous Button */}
                  <button
                    onClick={prevSlide}
                    className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-all hover:scale-110"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  {/* Dots */}
                  <div className="flex gap-3">
                    {HERO_SLIDES.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`h-2 rounded-full transition-all ${index === currentSlide
                          ? "w-12 bg-black"
                          : "w-2 bg-black/30 hover:bg-black/50 hover:w-4"
                          }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={nextSlide}
                    className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-all hover:scale-110"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Image Side - Clickable to navigate to products */}
              <Link
                to={HERO_SLIDES[currentSlide].link}
                onClick={handleProtectedNavigation}
                className="relative flex items-center justify-center cursor-pointer group order-first lg:order-last"
              >
                {/* Decorative Background Elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-transparent opacity-50 rounded-3xl transform rotate-3"></div>
                <div className="absolute inset-0 bg-gradient-to-tl from-gray-100 to-transparent opacity-30 rounded-3xl transform -rotate-3"></div>

                {/* Product Image */}
                <img
                  src={HERO_SLIDES[currentSlide].image}
                  alt="Featured Tech"
                  className="relative w-full h-auto object-contain transition-all duration-700 transform group-hover:scale-105 z-10"
                />

                {/* Badge */}
                <div className="absolute top-4 right-4 bg-black text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider z-20">
                  NEW
                </div>
              </Link>
            </div>

            {/* Slider Controls - Mobile Position */}
            <div className="flex lg:hidden items-center justify-center gap-4 mt-8">
              {/* Previous Button */}
              <button
                onClick={prevSlide}
                className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Dots */}
              <div className="flex gap-2">
                {HERO_SLIDES.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`h-2 rounded-full transition-all ${index === currentSlide
                      ? "w-8 bg-black"
                      : "w-2 bg-black/30 hover:bg-black/50"
                      }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              {/* Next Button */}
              <button
                onClick={nextSlide}
                className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES - Clickable to filter products */}
      <section className="py-24 bg-black text-white">
        <div className="max-w-[1440px] mx-auto px-6">
          <h2 className="text-5xl font-black tracking-tighter uppercase mb-16">
            Shop by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((cat, i) => (
              <button
                key={i}
                onClick={() => handleCategoryClick(cat.slug)}
                className="relative h-[300px] overflow-hidden group cursor-pointer border border-white/20 hover:border-white transition-all"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-transparent transition">
                  <h3 className="text-3xl font-black uppercase tracking-tighter">
                    {cat.name}
                  </h3>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. NEW ARRIVALS - Products from last 30 days (max 8) */}
      <section className="py-24 px-6 lg:px-12 max-w-[1440px] mx-auto">
        <div className="flex items-end justify-between mb-16">
          <h2 className="text-5xl font-black tracking-tighter uppercase">
            New Arrivals
          </h2>
          <div className="flex items-center gap-4">
            {/* Navigation Buttons */}
            <div className="flex gap-2">
              <button
                onClick={prevNewArrivals}
                disabled={newArrivalsIndex === 0}
                className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-all hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
                aria-label="Previous products"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextNewArrivals}
                disabled={newArrivalsIndex >= (newProducts?.length || 0) - 4}
                className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-all hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
                aria-label="Next products"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <Link
              to="/products?sort=newest"
              onClick={handleProtectedNavigation}
              className="font-bold border-b-2 border-black pb-1 hover:opacity-50 transition"
            >
              VIEW ALL
            </Link>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        ) : newProducts && newProducts.length > 0 ? (
          /* Slider Container */
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out gap-10"
              style={{
                transform: `translateX(-${newArrivalsIndex * (100 / 4)}%)`,
              }}
            >
              {newProducts.map((product) => {
                // Parse images if it's a string
                const images =
                  typeof product.images === "string"
                    ? JSON.parse(product.images)
                    : product.images;
                const productImage =
                  images && images.length > 0 ? images[0].url : "/img2.png";

                return (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    onClick={handleProtectedNavigation}
                    className="group border-b-2 border-transparent hover:border-black transition-all pb-6 flex-shrink-0"
                    style={{ width: "calc(25% - 30px)" }}
                  >
                    <div className="h-64 overflow-hidden mb-6 bg-gray-50 flex items-center justify-center p-4 relative">
                      <img
                        src={productImage}
                        alt={product.name}
                        className={`w-full h-full object-contain transition-all duration-500 ${product.stock === 0 ? "grayscale" : ""
                          }`}
                      />
                      <StockBadge stock={product.stock || 0} />
                    </div>
                    <h3 className="font-bold text-lg leading-tight mb-3 uppercase tracking-tight line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="space-y-1 mb-4">
                      <p className="text-[11px] text-black/50 font-medium uppercase tracking-wider">
                        — {product.category}
                      </p>
                    </div>
                    {/* Rating Stars */}
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
                      <span className="text-2xl font-black">
                        {formatPrice(product.price)}
                      </span>
                      <button className="bg-black text-white p-3 rounded-full hover:bg-gray-800 transition">
                        <ShoppingBag className="w-5 h-5" />
                      </button>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-black/60">No new arrivals at the moment</p>
          </div>
        )}
      </section>

      {/* 4. TOP RATED PRODUCTS - Rating 4.5 or higher */}
      <section className="py-24 px-6 lg:px-12 max-w-[1440px] mx-auto bg-gray-50">
        <div className="flex items-end justify-between mb-16">
          <h2 className="text-5xl font-black tracking-tighter uppercase">
            Top Rated Products
          </h2>
          <div className="flex items-center gap-4">
            {/* Navigation Buttons */}
            <div className="flex gap-2">
              <button
                onClick={prevTopRated}
                disabled={topRatedIndex === 0}
                className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-all hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
                aria-label="Previous products"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextTopRated}
                disabled={topRatedIndex >= (topRatedProducts?.length || 0) - 4}
                className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-all hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
                aria-label="Next products"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <Link
              to="/products?sort=rating"
              onClick={handleProtectedNavigation}
              className="font-bold border-b-2 border-black pb-1 hover:opacity-50 transition"
            >
              VIEW ALL
            </Link>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        ) : topRatedProducts && topRatedProducts.length > 0 ? (
          /* Slider Container */
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out gap-10"
              style={{
                transform: `translateX(-${topRatedIndex * (100 / 4)}%)`,
              }}
            >
              {topRatedProducts.map((product) => {
                // Parse images if it's a string
                const images =
                  typeof product.images === "string"
                    ? JSON.parse(product.images)
                    : product.images;
                const productImage =
                  images && images.length > 0 ? images[0].url : "/img2.png";

                return (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    onClick={handleProtectedNavigation}
                    className="group border-b-2 border-transparent hover:border-black transition-all pb-6 bg-white p-6 rounded-lg flex-shrink-0"
                    style={{ width: "calc(25% - 30px)" }}
                  >
                    <div className="h-64 overflow-hidden mb-6 bg-gray-50 flex items-center justify-center p-4">
                      <img
                        src={productImage}
                        alt={product.name}
                        className={`w-full h-full object-contain transition-all duration-500 ${product.stock === 0 ? "grayscale" : ""
                          }`}
                      />
                    </div>
                    <h3 className="font-bold text-lg leading-tight mb-3 uppercase tracking-tight line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="space-y-1 mb-4">
                      <p className="text-[11px] text-black/50 font-medium uppercase tracking-wider">
                        — {product.category}
                      </p>
                      <p className="text-[11px] text-black/50 font-medium uppercase tracking-wider">
                        — Stock: {product.stock}
                      </p>
                    </div>
                    {/* Rating Stars - Prominent for top rated */}
                    <div className="flex items-center gap-1 mb-4 bg-yellow-50 p-2 rounded">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${i < Math.floor(product.ratings || 0)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                            }`}
                        />
                      ))}
                      <span className="text-sm font-bold text-black ml-1">
                        {product.ratings ? Number(product.ratings).toFixed(1) : "0.0"} / 5
                      </span>
                    </div>
                    {product.review_count && (
                      <p className="text-xs text-black/50 mb-3">
                        {product.review_count} customer reviews
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black">
                        {formatPrice(product.price)}
                      </span>
                      <button className="bg-black text-white p-3 rounded-full hover:bg-gray-800 transition">
                        <ShoppingBag className="w-5 h-5" />
                      </button>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-black/60">No top rated products available</p>
          </div>
        )}
      </section>

      {/* 5. TRUST FEATURES (Clean Grid) */}
      <section className="py-24 px-6 lg:px-12 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {[
            {
              icon: Truck,
              title: "EXPRESS DELIVERY",
              desc: "Safe handling for sensitive parts",
            },
            {
              icon: RotateCcw,
              title: "10-DAY RETURNS",
              desc: "No questions asked policy",
            },
            {
              icon: ShieldCheck,
              title: "AUTHENTICITY",
              desc: "Official brand authorized",
            },
            {
              icon: Zap,
              title: "EMI PLANS",
              desc: "Zero interest installments",
            },
          ].map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="space-y-4 border-l-4 border-black pl-6">
                <Icon className="w-8 h-8" />
                <h3 className="font-black text-sm tracking-widest uppercase">
                  {feature.title}
                </h3>
                <p className="text-xs text-black/50 font-bold uppercase">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
};

export default Home;