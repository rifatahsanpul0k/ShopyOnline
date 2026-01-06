import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Button from "../components/ui/Button";
import { Star, ChevronRight, Zap, Truck, RotateCcw, Award } from "lucide-react";

// Dummy Data for Preview
const NEW_ARRIVALS = [
  {
    id: 1,
    name: "T-shirt with Tape Details",
    price: 120,
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
  },
  {
    id: 2,
    name: "Skinny Fit Jeans",
    price: 240,
    originalPrice: 260,
    discount: "-20%",
    rating: 3.5,
    image:
      "https://images.unsplash.com/photo-1542272604-787c62d465d1?w=400&h=400&fit=crop",
  },
  {
    id: 3,
    name: "Checkered Shirt",
    price: 180,
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=400&fit=crop",
  },
  {
    id: 4,
    name: "Sleeve Striped T-shirt",
    price: 130,
    originalPrice: 160,
    discount: "-30%",
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1618354691551-418cb976055b?w=400&h=400&fit=crop",
  },
];

const TOP_SELLERS = [
  {
    id: 5,
    name: "Vertical Striped Shirt",
    price: 212,
    originalPrice: 232,
    discount: "-20%",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1570102519953-144402bfc4ea?w=400&h=400&fit=crop",
  },
  {
    id: 6,
    name: "Courage Graphic T-shirt",
    price: 145,
    rating: 4,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
  },
  {
    id: 7,
    name: "Loose Fit Bermuda Shorts",
    price: 80,
    rating: 3,
    image:
      "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=400&fit=crop",
  },
  {
    id: 8,
    name: "Faded Skinny Jeans",
    price: 210,
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1542272604-787c62d465d1?w=400&h=400&fit=crop",
  },
];

const CATEGORIES = [
  {
    name: "Casual",
    image:
      "https://images.unsplash.com/photo-1493217465235-252dd9c0d8d7?w=500&h=300&fit=crop",
  },
  {
    name: "Formal",
    image:
      "https://images.unsplash.com/photo-1591047990999-20fef7a0fd16?w=500&h=300&fit=crop",
  },
  {
    name: "Party",
    image:
      "https://images.unsplash.com/photo-1595777707802-52b71ef06af6?w=500&h=300&fit=crop",
  },
  {
    name: "Gym",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=500&h=300&fit=crop",
  },
];

const TESTIMONIALS = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Fashion Enthusiast",
    text: "The quality of clothes is amazing! I've been a customer for 2 years and never disappointed. Highly recommend!",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
  },
  {
    id: 2,
    name: "Marcus Chen",
    role: "Professional",
    text: "Great selection of formal wear. The fit is perfect and the customer service is excellent!",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
  },
  {
    id: 3,
    name: "Emma Davis",
    role: "Student",
    text: "Love the casual collection! Affordable prices and fast shipping. Will definitely shop again.",
    rating: 4,
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
  },
];

const Home = () => {
  const { authUser } = useSelector((state) => state.auth);

  return (
    <main className="w-full overflow-x-hidden bg-white">
      {/* 1. HERO SECTION */}
      <section className="bg-gradient-to-r from-brand-light to-brand-gray pt-12 lg:pt-24 relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pb-20">
          {/* Hero Text */}
          <div className="space-y-8 z-10">
            <h1 className="text-5xl lg:text-[64px] leading-[1.1] font-heading font-bold text-black">
              FIND CLOTHES THAT MATCHES YOUR STYLE
            </h1>
            <p className="text-black/70 text-base lg:text-lg max-w-md leading-relaxed">
              Browse through our diverse range of meticulously crafted garments,
              designed to bring out your individuality.
            </p>

            <Link to="/products">
              <Button className="gap-2">
                Shop Now <ChevronRight className="w-5 h-5" />
              </Button>
            </Link>

            {/* Stats */}
            <div className="flex items-center gap-6 pt-8 flex-wrap">
              <div>
                <h3 className="text-3xl font-bold text-black">200+</h3>
                <p className="text-black/60 text-sm">International Brands</p>
              </div>
              <div className="w-[1px] h-12 bg-black/20"></div>
              <div>
                <h3 className="text-3xl font-bold text-black">2,000+</h3>
                <p className="text-black/60 text-sm">High-Quality Products</p>
              </div>
              <div className="w-[1px] h-12 bg-black/20"></div>
              <div>
                <h3 className="text-3xl font-bold text-black">30k+</h3>
                <p className="text-black/60 text-sm">Happy Customers</p>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative min-h-[400px] lg:min-h-[600px] flex items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center">
              <Star className="absolute top-20 right-10 text-brand-yellow fill-brand-yellow w-16 h-16 animate-bounce" />
              <Star
                className="absolute bottom-32 left-5 text-brand-yellow fill-brand-yellow w-8 h-8 animate-bounce"
                style={{ animationDelay: "0.2s" }}
              />
              <img
                src="https://images.unsplash.com/photo-1490481651971-daf3a6407e07?w=500&h=600&fit=crop"
                alt="Hero Fashion Model"
                className="w-4/5 h-auto object-contain rounded-3xl"
              />
            </div>
          </div>
        </div>

        {/* Brand Carousel */}
        <div className="bg-black py-8 mt-4">
          <div className="max-w-[1440px] mx-auto px-6 flex justify-between items-center flex-wrap gap-8">
            {["VERSACE", "ZARA", "GUCCI", "PRADA", "CALVIN KLEIN"].map(
              (brand) => (
                <span
                  key={brand}
                  className="text-white text-xl lg:text-2xl font-bold opacity-70 hover:opacity-100 transition"
                >
                  {brand}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* AUTH CTA SECTION - Only show when NOT logged in */}
      {!authUser && (
        <section className="py-16 px-6 lg:px-12 bg-black text-white">
          <div className="max-w-[1440px] mx-auto text-center">
            <h2 className="text-3xl lg:text-5xl font-heading font-bold mb-4">
              Join Our Community
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
              Sign in to get personalized recommendations, track your orders,
              save your favorites, and unlock exclusive deals!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth/login">
                <Button
                  variant="secondary"
                  className="border-white text-black bg-white hover:bg-gray-100"
                >
                  Login Now
                </Button>
              </Link>
              <Link to="/auth/register">
                <Button className="bg-white text-black hover:bg-gray-100">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* WELCOME SECTION - Only show when logged in */}
      {authUser && (
        <section className="py-16 px-6 lg:px-12 bg-gradient-to-r from-black to-gray-900 text-white">
          <div className="max-w-[1440px] mx-auto">
            <div className="flex items-center gap-6">
              {authUser?.avatar?.url ? (
                <img
                  src={authUser.avatar.url}
                  alt={authUser.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
                  <span className="text-2xl font-bold text-black">
                    {authUser.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <h2 className="text-4xl lg:text-5xl font-heading font-bold mb-2">
                  Welcome Back, {authUser.name}! 👋
                </h2>
                <p className="text-lg text-white/80">
                  Ready to find your perfect style? Let's explore our latest
                  collections.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* PERSONALIZED SECTION - Only show when logged in */}
      {authUser && (
        <section className="py-20 px-6 lg:px-12 max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Your Orders */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 border-2 border-blue-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <ChevronRight className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-heading font-bold text-black">
                  Your Orders
                </h3>
              </div>
              <p className="text-gray-700 mb-6">
                Track your purchases and manage your orders
              </p>
              <Link to="/orders">
                <Button className="w-full gap-2">
                  View Orders <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Wishlist */}
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-3xl p-8 border-2 border-pink-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-white fill-white" />
                </div>
                <h3 className="text-2xl font-heading font-bold text-black">
                  Favorites
                </h3>
              </div>
              <p className="text-gray-700 mb-6">
                Save and manage your favorite items
              </p>
              <Link to="/products">
                <Button className="w-full gap-2">
                  Browse Favorites <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Account Settings */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl p-8 border-2 border-purple-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-heading font-bold text-black">
                  Account
                </h3>
              </div>
              <p className="text-gray-700 mb-6">
                Update your profile and preferences
              </p>
              <Link to="/profile">
                <Button className="w-full gap-2">
                  Manage Profile <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Exclusive Deals */}
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-3xl p-8 border-2 border-yellow-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-heading font-bold text-black">
                  Exclusive Deals
                </h3>
              </div>
              <p className="text-gray-700 mb-6">
                Member-only discounts and early access
              </p>
              <Link to="/products">
                <Button className="w-full gap-2">
                  View Deals <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Recommended for You Section */}
          <div className="mb-12">
            <h3 className="text-4xl font-heading font-bold text-black mb-2">
              Recommended For You
            </h3>
            <div className="w-20 h-1 bg-brand-yellow rounded-full mb-8"></div>
            <p className="text-gray-600 text-lg mb-8">
              Based on your preferences, here are our top picks just for you
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {NEW_ARRIVALS.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-card p-4 shadow-sm hover:shadow-lg transition transform hover:-translate-y-1"
              >
                <div className="bg-gray-100 h-64 rounded-card overflow-hidden mb-4 relative group cursor-pointer">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-300 flex items-center justify-center">
                    <button className="opacity-0 group-hover:opacity-100 transition duration-300 bg-white text-black font-bold py-2 px-4 rounded-pill">
                      Add to Cart
                    </button>
                  </div>
                </div>
                <h3 className="font-semibold text-black line-clamp-2 mb-2">
                  {product.name}
                </h3>
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < (product.rating || 4)
                          ? "fill-brand-yellow text-brand-yellow"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-black">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm line-through text-gray-400">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                  <button
                    className="text-black hover:opacity-70 transition-opacity"
                    title="Add to Favorites"
                  >
                    <Star className="w-5 h-5 fill-current" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 2. NEW ARRIVALS */}
      <section className="py-20 px-6 lg:px-12 max-w-[1440px] mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl lg:text-5xl font-heading font-bold text-black mb-2">
              NEW ARRIVALS
            </h2>
            <div className="w-20 h-1 bg-brand-yellow rounded-full"></div>
          </div>
          <Link to="/products" className="hidden md:block">
            <Button variant="secondary" className="gap-2">
              View All <ChevronRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {NEW_ARRIVALS.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-card p-4 shadow-sm hover:shadow-lg transition"
            >
              <div className="bg-gray-100 h-64 rounded-card overflow-hidden mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-semibold text-black line-clamp-2 mb-2">
                {product.name}
              </h3>
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < (product.rating || 4)
                        ? "fill-brand-yellow text-brand-yellow"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-black">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-sm line-through text-gray-400">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center md:hidden">
          <Link to="/products">
            <Button variant="secondary">View All Products</Button>
          </Link>
        </div>
      </section>

      {/* 3. TOP SELLERS */}
      <section className="py-20 px-6 lg:px-12 max-w-[1440px] mx-auto bg-brand-light rounded-3xl">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl lg:text-5xl font-heading font-bold text-black mb-2">
              TOP SELLING
            </h2>
            <div className="w-20 h-1 bg-brand-red rounded-full"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TOP_SELLERS.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-card p-4 shadow-sm hover:shadow-lg transition"
            >
              <div className="bg-gray-100 h-64 rounded-card overflow-hidden mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-semibold text-black line-clamp-2 mb-2">
                {product.name}
              </h3>
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < (product.rating || 4)
                        ? "fill-brand-yellow text-brand-yellow"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-black">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-sm line-through text-gray-400">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. CATEGORY GRID */}
      <section className="py-20 px-6 lg:px-12 max-w-[1440px] mx-auto">
        <div className="mb-12">
          <h2 className="text-4xl lg:text-5xl font-heading font-bold text-black mb-2">
            BROWSE BY STYLE
          </h2>
          <div className="w-20 h-1 bg-brand-yellow rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Casual - Large */}
          <div className="md:col-span-2 relative h-72 rounded-3xl overflow-hidden group cursor-pointer">
            <img
              src={CATEGORIES[0].image}
              alt={CATEGORIES[0].name}
              className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition flex items-center justify-start p-8">
              <h3 className="text-4xl font-bold text-white">
                {CATEGORIES[0].name}
              </h3>
            </div>
          </div>

          {/* Formal - Stacked */}
          <div className="flex flex-col gap-6">
            <div className="relative h-32 rounded-3xl overflow-hidden group cursor-pointer">
              <img
                src={CATEGORIES[1].image}
                alt={CATEGORIES[1].name}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition flex items-center justify-start p-6">
                <h3 className="text-2xl font-bold text-white">
                  {CATEGORIES[1].name}
                </h3>
              </div>
            </div>

            <div className="relative h-32 rounded-3xl overflow-hidden group cursor-pointer">
              <img
                src={CATEGORIES[3].image}
                alt={CATEGORIES[3].name}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition flex items-center justify-start p-6">
                <h3 className="text-2xl font-bold text-white">
                  {CATEGORIES[3].name}
                </h3>
              </div>
            </div>
          </div>

          {/* Party - Bottom */}
          <div className="md:col-span-2 relative h-72 rounded-3xl overflow-hidden group cursor-pointer">
            <img
              src={CATEGORIES[2].image}
              alt={CATEGORIES[2].name}
              className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition flex items-center justify-start p-8">
              <h3 className="text-4xl font-bold text-white">
                {CATEGORIES[2].name}
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FEATURES */}
      <section className="py-20 px-6 lg:px-12 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: Truck,
              title: "Free Delivery",
              desc: "Enjoy free shipping on all orders above $50",
            },
            {
              icon: RotateCcw,
              title: "Easy Returns",
              desc: "Return within 30 days for a full refund",
            },
            {
              icon: Award,
              title: "Quality Assured",
              desc: "100% authentic and high-quality products",
            },
            {
              icon: Zap,
              title: "Fast Checkout",
              desc: "Quick and secure payment process",
            },
          ].map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center text-center space-y-4"
              >
                <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center">
                  <Icon className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-lg font-bold text-black">
                  {feature.title}
                </h3>
                <p className="text-black/60 text-sm">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="py-20 px-6 lg:px-12 max-w-[1440px] mx-auto bg-brand-light rounded-3xl">
        <div className="mb-12">
          <h2 className="text-4xl lg:text-5xl font-heading font-bold text-black mb-2">
            WHAT OUR CUSTOMERS SAY
          </h2>
          <div className="w-20 h-1 bg-brand-red rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-3xl p-8 shadow-lg"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-black">{testimonial.name}</h4>
                  <p className="text-sm text-black/60">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-brand-yellow fill-brand-yellow"
                  />
                ))}
              </div>
              <p className="text-black/70 leading-relaxed">
                "{testimonial.text}"
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. NEWSLETTER */}
      <section className="py-20 px-6 lg:px-12 max-w-[1440px] mx-auto">
        <div className="bg-black rounded-3xl p-12 lg:p-20 text-center space-y-6">
          <h2 className="text-4xl lg:text-5xl font-heading font-bold text-white">
            STAY UP TO DATE ABOUT OUR LATEST OFFERS
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-6 py-4 rounded-pill bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            />
            <button className="px-8 py-4 bg-white text-black font-semibold rounded-pill hover:bg-gray-100 transition">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
