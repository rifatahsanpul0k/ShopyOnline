import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingCart, User, Menu, X, LogOut } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../store/slices/authSlice";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const { authUser } = useSelector((state) => state.auth);

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
                {/* Cart Counter Badge could go here */}
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
    </div>
  );
};

export default Navbar;