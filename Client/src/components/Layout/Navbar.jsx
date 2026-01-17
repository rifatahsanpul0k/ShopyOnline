import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User, Menu, X, LogOut } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../store/slices/authSlice";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { authUser } = useSelector((state) => state.auth);
  const state = useSelector((state) => state);

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
          <div className="hidden lg:flex flex-1 max-w-xl bg-gray-100 rounded-pill px-4 py-3 items-center gap-3">
            <Search className="text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search for products..."
              className="bg-transparent border-none outline-none w-full text-sm placeholder-gray-400"
            />
          </div>

          {/* Icons & Auth */}
          <div className="flex items-center gap-4">
            {/* Only show cart button when user is logged in */}
            {authUser && (
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
                <button
                  onClick={handleLogout}
                  className="hover:opacity-70 transition-opacity"
                  title="Logout"
                >
                  <LogOut size={24} />
                </button>
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