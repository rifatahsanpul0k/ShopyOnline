import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User, Menu, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../store/slices/authSlice";
import NotificationBell from "./NotificationBell";
import { axiosInstance } from "../../lib/axios";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { authUser } = useSelector((state) => state.auth);
  const state = useSelector((state) => state);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search function
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim().length > 0) {
        handleSearch(searchQuery);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300); // Wait 300ms after user stops typing

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearch = async (query) => {
    if (!query.trim()) return;

    setIsSearching(true);
    setShowResults(true);

    try {
      const response = await axiosInstance.get(`/product?search=${encodeURIComponent(query)}`);
      setSearchResults(response.data.products || []);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setShowResults(false);
      setSearchQuery("");
    }
  };

  const handleProductClick = () => {
    setShowResults(false);
    setSearchQuery("");
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
  };

  return (
    <div className="w-full relative z-50">
      {/* Main Navbar */}
      <nav className="bg-white py-6 px-6 lg:px-12 border-b border-gray-200">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-8">
          {/* Mobile Menu & Logo */}
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu size={24} />
            </button>
            <Link
              to="/"
              className="text-2xl lg:text-3xl font-heading font-bold tracking-tighter"
            >
              SHOPYONLINE
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-xl relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="flex items-center gap-3 bg-black/5 border-2 border-transparent hover:border-black/10 focus-within:border-black focus-within:bg-white rounded-full px-5 py-3.5 transition-all">
                <Search className="text-black/40" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, categories..."
                  className="bg-transparent border-none outline-none w-full text-sm placeholder-black/40 font-medium"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSearchResults([]);
                      setShowResults(false);
                    }}
                    className="text-black/40 hover:text-black hover:bg-black/5 rounded-full p-1 transition"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </form>

            {/* Search Results Dropdown */}
            {showResults && (
              <div className="absolute top-full mt-3 w-full bg-white rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.15)] border-2 border-black/5 max-h-[520px] overflow-hidden z-50">
                {isSearching ? (
                  <div className="p-12 text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-2 border-black/20 border-t-black mx-auto"></div>
                    <p className="text-sm text-black/50 mt-4 font-medium">Searching products...</p>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div>
                    <div className="px-6 py-4 border-b border-black/5 bg-black/[0.02]">
                      <p className="text-xs font-black text-black/50 uppercase tracking-wider">
                        Found {searchResults.length} {searchResults.length === 1 ? "Product" : "Products"}
                      </p>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto p-2">
                      {searchResults.slice(0, 8).map((product) => {
                        const images = typeof product.images === "string" ? JSON.parse(product.images) : product.images;
                        const productImage = images && images.length > 0 ? images[0].url : "/img2.png";

                        return (
                          <Link
                            key={product.id}
                            to={`/product/${product.id}`}
                            onClick={handleProductClick}
                            className="flex items-center gap-3 p-2 hover:bg-black/5 rounded-2xl transition-all group border-2 border-transparent hover:border-black/10"
                          >
                            <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center p-1.5 group-hover:bg-white transition">
                              <img
                                src={productImage}
                                alt={product.name}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-sm line-clamp-1 group-hover:text-black/80 tracking-tight">{product.name}</h4>
                              <p className="text-xs text-black/40 uppercase tracking-wider mt-0.5">— {product.category}</p>
                              <p className="font-black text-sm mt-1">${product.price}</p>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition">
                              <div className="bg-black text-white p-1.5 rounded-full">
                                <Search className="w-4 h-4" />
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                    {searchResults.length > 8 && (
                      <div className="border-t border-black/5 p-3">
                        <Link
                          to={`/products?search=${encodeURIComponent(searchQuery)}`}
                          onClick={handleProductClick}
                          className="flex items-center justify-center gap-2 w-full py-3 text-sm font-black text-black bg-black/5 hover:bg-black hover:text-white rounded-full transition-all uppercase tracking-wider"
                        >
                          View All {searchResults.length} Results
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    )}
                  </div>
                ) : searchQuery.trim() ? (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-black/30" />
                    </div>
                    <p className="text-black/70 font-medium mb-2">No products found</p>
                    <p className="text-sm text-black/40 mb-6">Try searching with different keywords</p>
                    <Link
                      to="/products"
                      onClick={handleProductClick}
                      className="inline-block mt-4 text-sm font-bold text-black hover:underline"
                    >
                      Browse All Products
                    </Link>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {/* Icons & Auth */}
          <div className="flex items-center gap-4">
            {/* Only show cart button when user is logged in */}
            {authUser && (
              <>
                <NotificationBell />
                <Link to="/cart" className="hover:text-gray-600 relative">
                  <ShoppingCart size={24} />
                  {/* Cart Counter Badge */}
                  {state.cart?.cart?.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                      {state.cart.cart.reduce(
                        (total, item) => total + item.quantity,
                        0
                      )}
                    </span>
                  )}
                </Link>
              </>
            )}

            {authUser ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/profile"
                  className="hover:opacity-70 transition-opacity"
                  title={authUser.name}
                >
                  {authUser?.avatar?.url ? (
                    <img
                      src={authUser.avatar.url}
                      alt={authUser.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <User size={24} />
                  )}
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/auth/login"
                  className="px-4 py-2 text-sm font-medium rounded-pill hover:opacity-70 transition-opacity"
                >
                  Login
                </Link>
                <Link
                  to="/auth/register"
                  className="px-4 py-2 text-sm font-medium bg-black text-white rounded-pill hover:opacity-90 transition-opacity"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white lg:hidden animate-in slide-in-from-top-10 duration-200">
          <div className="flex flex-col h-full bg-white relative">
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <span className="text-2xl font-black tracking-tighter">MENU</span>
              <button onClick={() => setIsMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>

            {/* Mobile Links */}
            <div className="flex flex-col p-6 gap-6 text-lg font-medium">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="border-b border-gray-100 pb-4">Home</Link>
              <Link to="/products" onClick={() => setIsMenuOpen(false)} className="border-b border-gray-100 pb-4">Products</Link>
              <Link to="/products?sort=new" onClick={() => setIsMenuOpen(false)} className="border-b border-gray-100 pb-4">New Arrivals</Link>
              <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="border-b border-gray-100 pb-4 flex justify-between">
                Cart
                <span className="bg-black text-white text-xs rounded-full px-2 py-1">
                  {state.cart?.cart?.length || 0}
                </span>
              </Link>
            </div>

            {/* Mobile Auth Actions */}
            <div className="mt-auto p-6 border-t border-gray-100">
              {authUser ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 mb-4">
                    {authUser?.avatar?.url ? (
                      <img src={authUser.avatar.url} alt={authUser.name} className="w-10 h-10 rounded-full object-cover" />
                    ) : <User size={24} />}
                    <span className="font-bold">{authUser.name}</span>
                  </div>
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="w-full bg-gray-100 py-3 rounded-full text-center font-bold">My Profile</Link>
                  <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="w-full bg-black text-white py-3 rounded-full font-bold">Logout</button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link to="/auth/login" onClick={() => setIsMenuOpen(false)} className="w-full border border-black py-3 rounded-full text-center font-bold">Login</Link>
                  <Link to="/auth/register" onClick={() => setIsMenuOpen(false)} className="w-full bg-black text-white py-3 rounded-full text-center font-bold">Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div >
  );
};

export default Navbar;