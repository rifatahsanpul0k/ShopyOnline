import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
  addToCart,
} from "../store/slices/cartSlice";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import Button from "../components/ui/Button";
import { formatPrice } from "../utils/currencyFormatter";

// Dummy product for testing
const DUMMY_PRODUCT = {
  id: "dummy_stripe_test",
  name: "Premium Wireless Headphones",
  price: 79.99,
  quantity: 1,
  image:
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
  category: "electronics",
};

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart } = useSelector((state) => state.cart);
  const { authUser } = useSelector((state) => state.auth);

  // Load dummy product if cart is empty (for testing Stripe payment)
  useEffect(() => {
    if (
      cart.length === 0 &&
      localStorage.getItem("showDummyProduct") === "true"
    ) {
      dispatch(addToCart(DUMMY_PRODUCT));
      localStorage.removeItem("showDummyProduct");
    }
  }, [dispatch, cart.length]);

  // Calculate totals
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1; // 10% tax
  const shipping = subtotal > 50 ? 0 : 5; // Free shipping over $50
  const total = subtotal + tax + shipping;

  // Handle quantity change
  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity <= 0) return;
    if (newQuantity > 99) return; // Max 99 items per product
    dispatch(updateCartItemQuantity({ id, quantity: newQuantity }));
  };

  // Handle remove item
  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };

  // Handle clear cart
  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      dispatch(clearCart());
    }
  };

  // Handle checkout
  const handleCheckout = () => {
    if (!authUser) {
      navigate("/auth/login", { state: { returnTo: "/cart" } });
      return;
    }
    navigate("/checkout", {
      state: {
        orderSummary: {
          subtotal,
          tax,
          shipping,
          total,
          items: cart,
        },
      },
    });
  };

  // Empty cart state
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white py-12 px-4">
        <div className="max-w-[1440px] mx-auto">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-600 hover:text-black transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
          </div>

          {/* Empty Cart */}
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <ShoppingCart className="w-24 h-24 text-gray-300 mb-6" />
            <h1 className="text-4xl font-heading font-bold text-black mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-gray-600 text-lg mb-8 max-w-md">
              Start shopping to add items to your cart and enjoy great deals on
              our collection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/products">
                <Button>Continue Shopping</Button>
              </Link>
              <button
                onClick={() => {
                  dispatch(addToCart(DUMMY_PRODUCT));
                }}
                className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-pill hover:bg-blue-600 transition"
              >
                🧪 Load Test Product (For Stripe)
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-[1440px] mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-black transition mb-6 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-heading font-bold text-black mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600">
            {cart.length} {cart.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {/* Cart Items List */}
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-6 bg-white border border-gray-200 rounded-card p-6 hover:shadow-lg transition"
                >
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-card bg-gray-100"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-grow">
                    <div className="flex justify-between mb-2">
                      <h3 className="text-lg font-semibold text-black hover:opacity-70 transition cursor-pointer">
                        <Link to={`/product/${item.id}`}>{item.name}</Link>
                      </h3>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-700 transition"
                        title="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Category & Stock */}
                    <p className="text-sm text-gray-600 mb-3">
                      Category: {item.category || "Uncategorized"}
                    </p>

                    {/* Price & Quantity */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {/* Quantity Control */}
                        <div className="flex items-center border border-gray-300 rounded-pill">
                          <button
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity - 1)
                            }
                            className="p-2 hover:bg-gray-100 transition"
                            disabled={item.quantity <= 1}
                            title="Decrease quantity"
                          >
                            <Minus className="w-4 h-4 text-gray-600" />
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 1;
                              handleQuantityChange(item.id, val);
                            }}
                            className="w-12 text-center border-0 focus:outline-none"
                            min="1"
                            max="99"
                          />
                          <button
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity + 1)
                            }
                            className="p-2 hover:bg-gray-100 transition"
                            disabled={item.quantity >= 99}
                            title="Increase quantity"
                          >
                            <Plus className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <div className="text-sm text-gray-600 mb-1">
                          {formatPrice(item.price)} each
                        </div>
                        <div className="text-xl font-bold text-black">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Shopping Button */}
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-black hover:opacity-70 transition mt-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-200 sticky top-20">
              <h2 className="text-2xl font-heading font-bold text-black mb-6">
                Order Summary
              </h2>

              {/* Summary Items */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Tax (10%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>
                    Shipping
                    {shipping === 0 && (
                      <span className="text-xs text-green-600 ml-2">
                        (FREE)
                      </span>
                    )}
                  </span>
                  <span>{formatPrice(shipping)}</span>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-300 pt-4">
                  <div className="flex justify-between text-xl font-bold text-black">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Info */}
              {subtotal < 50 && (
                <div className="bg-blue-50 border border-blue-200 rounded-card p-3 mb-6 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    Free shipping on orders over <strong>$50</strong>
                  </div>
                </div>
              )}

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full bg-black text-white font-bold py-4 rounded-pill hover:opacity-90 transition mb-3"
              >
                Proceed to Checkout
              </button>

              {/* Clear Cart Button */}
              <button
                onClick={handleClearCart}
                className="w-full border border-gray-300 text-black font-medium py-3 rounded-pill hover:bg-gray-100 transition"
              >
                Clear Cart
              </button>

              {/* Trust Badges */}
              <div className="mt-8 space-y-3 pt-6 border-t border-gray-300">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-xs font-bold">✓</span>
                  </div>
                  Secure checkout with Stripe
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-xs font-bold">✓</span>
                  </div>
                  Free returns within 30 days
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-xs font-bold">✓</span>
                  </div>
                  2-5 day delivery
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
