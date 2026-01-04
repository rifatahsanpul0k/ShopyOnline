import { Menu, User, ShoppingCart, Sun, Moon, Search } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleSidebar,
  toggleSearchOverlay,
  toggleLoginModal,
  toggleProfilePanel,
  toggleCart
} from "../../store/slices/popupSlice";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const dispatch = useDispatch();

  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  let cartItemsCount = 0;

  if(cart) {
    cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);
  }

  return(
    <nav
      className="fixed left-0 w-full top-0 z-[9998] bg-background/80 backdrop-blur-md border-b border-border pointer-events-auto"
      style={{ pointerEvents: 'auto' }}
    >
      <div className="max-w-7xl mx-auto px-4" style={{ pointerEvents: 'auto' }}>
        <div className="flex items-center justify-between h-16" style={{ pointerEvents: 'auto' }}>
          {/* Left Section */}
          <button
            onClick={() => {
              dispatch(toggleSidebar());
            }}
            className="p-2 rounded-lg hover:bg-secondary transition-colors pointer-events-auto"
            style={{ pointerEvents: 'auto' }}
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6 text-foreground" />
          </button>          {/* Center Section */}
          <div className="flex-1 flex justify-center">
            <h1 className="text-2xl font-bold text-foreground">ShopyOnline</h1>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            {/* Search Button */}
            <button
              onClick={() => dispatch(toggleSearchOverlay())}
              className="p-2 rounded-lg hover:bg-secondary transition-colors pointer-events-auto"
              style={{ pointerEvents: 'auto' }}
              aria-label="Search"
            >
              <Search className="h-5 w-5 text-foreground" />
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-secondary transition-colors pointer-events-auto"
              style={{ pointerEvents: 'auto' }}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-foreground" />
              ) : (
                <Moon className="h-5 w-5 text-foreground" />
              )}
            </button>

            {/* User Profile Button */}
            <button
              onClick={() => {
                if (user) {
                  dispatch(toggleProfilePanel());
                } else {
                  dispatch(toggleLoginModal());
                }
              }}
              className="p-2 rounded-lg hover:bg-secondary transition-colors pointer-events-auto relative z-[9999]"
              aria-label="User profile"
              type="button"
            >
              <User className="h-5 w-5 text-foreground" />
            </button>

            {/* Shopping Cart Button with Badge */}
            <button
              onClick={() => dispatch(toggleCart())}
              className="p-2 rounded-lg hover:bg-secondary transition-colors relative pointer-events-auto"
              style={{ pointerEvents: 'auto' }}
              aria-label="Shopping cart"
            >
              <ShoppingCart className="h-5 w-5 text-foreground" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount > 99 ? "99+" : cartItemsCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
