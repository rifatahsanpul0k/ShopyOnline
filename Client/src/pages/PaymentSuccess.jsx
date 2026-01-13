import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearCart } from "../store/slices/cartSlice";
import { Check, Package, Mail, Home, ArrowLeft } from "lucide-react";
import Button from "../components/ui/Button";
import { formatPrice } from "../utils/currencyFormatter";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const successData = location.state;

  // Clear cart on successful payment
  useEffect(() => {
    if (successData?.orderId) {
      dispatch(clearCart());
    }
  }, [successData, dispatch]);

  // Redirect if no success data
  useEffect(() => {
    if (!successData?.orderId) {
      setTimeout(() => navigate("/"), 3000);
    }
  }, [successData, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4">
      <div className="max-w-[1440px] mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-600 hover:text-black transition mb-6 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        {/* Success Animation */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-25"></div>
            <div className="relative w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-12 h-12 text-green-600" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h1 className="text-5xl font-heading font-bold text-black mb-4">
            Payment Successful!
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Thank you for your purchase.
          </p>
          <p className="text-gray-600 mb-8">
            Your order has been confirmed and is being prepared for shipment.
          </p>

          {/* Order ID */}
          <div className="bg-white border border-gray-200 rounded-3xl p-8 mb-8">
            <p className="text-sm text-gray-600 uppercase mb-2">Order ID</p>
            <p className="text-2xl font-bold text-black font-mono">
              {successData?.orderId || "---"}
            </p>
          </div>

          {/* Amount */}
          <div className="bg-green-50 border border-green-200 rounded-3xl p-8 mb-12">
            <p className="text-sm text-gray-600 uppercase mb-2">
              Total Amount Paid
            </p>
            <p className="text-4xl font-bold text-green-600">
              {formatPrice(successData?.amount || 0)}
            </p>
          </div>
        </div>

        {/* Next Steps */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-heading font-bold text-black mb-8 text-center">
            What's Next?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1: Order Confirmation */}
            <div className="bg-white border border-gray-200 rounded-3xl p-8 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-black mb-2">
                Order Confirmation
              </h3>
              <p className="text-gray-600 text-sm">
                A detailed confirmation email will be sent to your inbox
                shortly.
              </p>
            </div>

            {/* Step 2: Shipping */}
            <div className="bg-white border border-gray-200 rounded-3xl p-8 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-black mb-2">
                Preparing Shipment
              </h3>
              <p className="text-gray-600 text-sm">
                Your order is being prepared and will ship within 2-3 business
                days.
              </p>
            </div>

            {/* Step 3: Tracking */}
            <div className="bg-white border border-gray-200 rounded-3xl p-8 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-black mb-2">
                Track & Receive
              </h3>
              <p className="text-gray-600 text-sm">
                You'll receive a tracking number to monitor your delivery.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button onClick={() => navigate("/orders")} className="w-full">
            View My Orders
          </Button>

          <Button
            variant="secondary"
            onClick={() => navigate("/products")}
            className="w-full"
          >
            Continue Shopping
          </Button>
        </div>

        {/* Support Info */}
        <div className="max-w-2xl mx-auto mt-16 pt-12 border-t border-gray-200 text-center">
          <p className="text-gray-600 mb-4">
            Need help? We're here to assist you.
          </p>
          <div className="flex justify-center gap-6 text-sm">
            <a
              href="mailto:support@shopyonline.com"
              className="text-black hover:opacity-70 transition"
            >
              support@shopyonline.com
            </a>
            <span className="text-gray-400">•</span>
            <a
              href="tel:+1234567890"
              className="text-black hover:opacity-70 transition"
            >
              +1 (234) 567-890
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
