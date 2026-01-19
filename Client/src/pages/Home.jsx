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
  Search,
} from "lucide-react";
import StockBadge from "../components/ui/StockBadge";

// Hero Slider Data
const HERO_SLIDES = [
  {
    id: 1,
    title: "TRUSTED BRANDS.",
    subtitle: "Precision engineered components. Uncompromising power.",
    image: "/img2.png",
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
  {
    name: "Laptops",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80",
    slug: "laptops",
    description: "High-performance computing"
  },
  {
    name: "Smartphones",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
    slug: "smartphones",
    description: "Latest mobile technology"
  },
  {
    name: "Components",
    image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&q=80",
    slug: "components",
    description: "Build your dream PC"
  },
  {
    name: "Watches",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    slug: "watches",
    description: "Premium timepieces"
  },
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
      <section className="relative overflow-hidden h-[100vh] min-h-[700px]">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={HERO_SLIDES[currentSlide].image}
            alt={HERO_SLIDES[currentSlide].title}
            className="w-full h-full object-cover transition-all duration-1000"
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/70"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12 w-full">
            <div className="max-w-3xl">
              {/* Slide Number */}
              <div className="flex items-center gap-4 mb-8">
                <div className="text-white/40 text-sm font-black">
                  0{currentSlide + 1}
                </div>
                <div className="w-16 h-px bg-white/20"></div>
                <div className="text-white/40 text-sm font-black">
                  0{HERO_SLIDES.length}
                </div>
              </div>

              {/* Main Title */}
              <h1 className="text-6xl lg:text-8xl xl:text-9xl font-black text-white tracking-tighter uppercase leading-[0.9] mb-8">
                {HERO_SLIDES[currentSlide].title}
              </h1>

              {/* Subtitle */}
              <p className="text-xl lg:text-2xl text-white/80 mb-12 max-w-2xl leading-relaxed">
                {HERO_SLIDES[currentSlide].subtitle}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 mb-16">
                <Link
                  to={HERO_SLIDES[currentSlide].link}
                  onClick={handleProtectedNavigation}
                  className="group inline-flex items-center gap-3 bg-white text-black px-10 py-5 rounded-full hover:bg-black hover:text-white border-2 border-white transition-all font-bold uppercase tracking-wider"
                >
                  {HERO_SLIDES[currentSlide].cta}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/products"
                  onClick={handleProtectedNavigation}
                  className="inline-flex items-center gap-3 bg-transparent text-white px-10 py-5 rounded-full border-2 border-white hover:bg-white hover:text-black transition-all font-bold uppercase tracking-wider"
                >
                  View All Products
                </Link>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-12 pt-8 border-t-2 border-white/20">
                <div>
                  <h3 className="text-5xl font-black text-white mb-2">
                    {totalProducts || 0}+
                  </h3>
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest">
                    Products
                  </p>
                </div>
                <div>
                  <h3 className="text-5xl font-black text-white mb-2">
                    24/7
                  </h3>
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest">
                    Support
                  </p>
                </div>
                <div>
                  <h3 className="text-5xl font-black text-white mb-2">
                    100%
                  </h3>
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest">
                    Secure
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slider Navigation */}
        <div className="absolute bottom-12 right-12 z-20 flex items-center gap-4">
          <button
            onClick={prevSlide}
            className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm text-white border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="flex gap-2">
            {HERO_SLIDES.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all ${index === currentSlide
                    ? "w-12 bg-white"
                    : "w-2 bg-white/30 hover:bg-white/60"
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm text-white border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-12 z-20 flex flex-col items-center gap-3">
          <span className="text-white/60 text-xs font-bold uppercase tracking-wider transform -rotate-90 origin-center translate-x-4">
            Scroll
          </span>
          <div className="w-px h-16 bg-white/20 relative overflow-hidden">
            <div className="w-full h-8 bg-white/60 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* 2. NEW ARRIVALS - Products from last 30 days (max 8) */}
      <section className="py-24 px-6 lg:px-12 max-w-[1440px] mx-auto">
        <div className="mb-16">
          <h2 className="text-5xl font-black tracking-tighter uppercase">
            New Arrivals
          </h2>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        ) : newProducts && newProducts.length > 0 ? (
          /* Scrollable Slider Container */
          <div className="overflow-x-auto">
            <div className="flex gap-10 pb-4">
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
                    className="group border-b-2 border-transparent hover:border-black transition-all pb-6 flex-shrink-0 snap-start"
                    style={{ width: "300px" }}
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

      {/* 3. CATEGORIES - Clickable to filter products */}
      <section className="py-24 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)',
          }}></div>
        </div>

        <div className="max-w-[1440px] mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-5xl lg:text-6xl font-black tracking-tighter uppercase mb-3">
              Shop by Category
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Explore our curated collections of premium tech products
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {CATEGORIES.map((cat, i) => (
              <button
                key={i}
                onClick={() => handleCategoryClick(cat.slug)}
                className="relative h-[280px] overflow-hidden group cursor-pointer rounded-xl border-2 border-white/10 hover:border-white/40 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl"
              >
                {/* Image Background */}
                <div className="absolute inset-0">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500"></div>
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-end p-6 text-center">
                  {/* Category Name */}
                  <h3 className="text-2xl font-black uppercase tracking-tighter mb-2 transform group-hover:-translate-y-1 transition-transform duration-500">
                    {cat.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-white/80 mb-3 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                    {cat.description}
                  </p>

                  {/* Arrow */}
                  <div className="flex items-center gap-2 text-xs font-bold opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500 delay-75">
                    <span>EXPLORE</span>
                    <ArrowRight className="w-3 h-3 animate-pulse" />
                  </div>
                </div>

                {/* Corner Accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 transform translate-x-10 -translate-y-10 rotate-45 group-hover:translate-x-8 group-hover:-translate-y-8 transition-transform duration-500"></div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. TOP RATED PRODUCTS - Rating 4.5 or higher */}
      <section className="py-24 px-6 lg:px-12 max-w-[1440px] mx-auto bg-gray-50">
        <div className="mb-16">
          <h2 className="text-5xl font-black tracking-tighter uppercase">
            Top Rated Products
          </h2>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        ) : topRatedProducts && topRatedProducts.length > 0 ? (
          /* Scrollable Slider Container */
          <div className="overflow-x-auto">
            <div className="flex gap-10 pb-4">
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
                    className="group border-b-2 border-transparent hover:border-black transition-all pb-6 bg-white p-6 rounded-lg flex-shrink-0 snap-start"
                    style={{ width: "300px" }}
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