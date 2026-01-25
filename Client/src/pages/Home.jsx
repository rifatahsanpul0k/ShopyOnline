import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllProducts } from "../store/slices/productSlice";
import {
  Zap,
  Truck,
  RotateCcw,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

// Extracted Components
import HeroSlider from "../components/home/HeroSlider";
import ProductCard from "../components/home/ProductCard";
import AuthModal from "../components/home/AuthModal";
import CategoryGrid from "../components/home/CategoryGrid";

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

const CATEGORIES = [
  {
    name: "Laptops",
    image: "/cat_laptop.jpg",
    slug: "laptops",
    description: "High-performance computing"
  },
  {
    name: "Smartphones",
    image: "/cat_smartphone.jpg",
    slug: "smartphones",
    description: "Latest mobile technology"
  },
  {
    name: "Components",
    image: "/cat_component.jpg",
    slug: "components",
    description: "Build your dream PC"
  },
  {
    name: "Watches",
    image: "/cat_watch.jpg",
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

  // Auth Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [intendedDestination, setIntendedDestination] = useState("");

  // Fetch products on component mount
  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

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
  return (
    <main className="w-full overflow-x-hidden bg-white text-black">
      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        intendedDestination={intendedDestination}
      />

      {/* 1. HERO SECTION WITH SLIDER */}
      <HeroSlider
        slides={HERO_SLIDES}
        totalProducts={totalProducts}
        onProtectedNavigation={handleProtectedNavigation}
      />

      {/* 2. NEW ARRIVALS - Products from last 30 days */}
      <section className="py-24 px-6 lg:px-12 max-w-[1440px] mx-auto">
        <div className="mb-16 flex items-center justify-between">
          <h2 className="text-5xl font-black tracking-tighter uppercase">
            New Arrivals
          </h2>
          <Link
            to="/new-arrivals"
            onClick={handleProtectedNavigation}
            className="group inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-all font-bold uppercase tracking-wider text-sm"
          >
            View All
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
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
              {newProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onProtectedNavigation={handleProtectedNavigation}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-black/60">No new arrivals at the moment</p>
          </div>
        )}
      </section>

      {/* 3. CATEGORIES - Clickable to filter products */}
      <CategoryGrid
        categories={CATEGORIES}
        onCategoryClick={handleCategoryClick}
      />

      {/* 4. TOP RATED PRODUCTS - Rating 4.5 or higher */}
      <section className="py-24 px-6 lg:px-12 max-w-[1440px] mx-auto">
        <div className="mb-16 flex items-center justify-between">
          <h2 className="text-5xl font-black tracking-tighter uppercase">
            Top Rated Products
          </h2>
          <Link
            to="/top-rated"
            onClick={handleProtectedNavigation}
            className="group inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-all font-bold uppercase tracking-wider text-sm"
          >
            View All
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
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
              {topRatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onProtectedNavigation={handleProtectedNavigation}
                />
              ))}
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