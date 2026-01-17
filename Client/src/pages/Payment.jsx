import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Lock, AlertCircle, Check, ArrowLeft, Loader } from "lucide-react";
import Button from "../components/ui/Button";
import { formatPrice } from "../utils/currencyFormatter";
import { createPaymentIntentAPI, updatePaymentStatusAPI } from "../services/paymentService";

// Note: This component requires Stripe setup. See implementation notes below.

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const _authUser = useSelector((state) => state.auth.authUser);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);

  const paymentData = location.state;

  // Initialize Stripe
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    if (!paymentData) {
      navigate("/checkout");
      return;
    }

    // Create payment intent on mount
    const initializePayment = async () => {
      try {
        console.log("Initializing payment with data:", paymentData);
        const response = await createPaymentIntentAPI(
          paymentData.orderId,
          paymentData.orderSummary.total
        );

        console.log("Payment initialization response:", response);

        if (response.success) {
          setClientSecret(response.clientSecret);
        } else {
          console.error("Payment initialization failed:", response);
          setError(response.message || "Failed to initialize payment");
        }
      } catch (err) {
        console.error("Payment initialization error:", err);
        setError(err.message || "Failed to initialize payment");
      }
    };

    initializePayment();
  }, [paymentData, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      setError("Payment system not ready");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const cardElement = elements.getElement(CardElement);

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: paymentData.shippingInfo.fullName,
              email: paymentData.shippingInfo.email,
              address: {
                line1: paymentData.shippingInfo.address,
                city: paymentData.shippingInfo.city,
                state: paymentData.shippingInfo.state,
                postal_code: paymentData.shippingInfo.zipCode,
              },
            },
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message);
        setIsProcessing(false);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        console.log("Payment succeeded:", paymentIntent);

        // Update payment status in database (non-blocking)
        try {
          await updatePaymentStatusAPI(paymentData.orderId, "Paid");
          console.log("Database updated successfully");
        } catch (dbError) {
          console.error("Failed to update database but payment succeeded:", dbError);
          // We intentionally ignore this error for the UI flow because the payment WAS successful
        }

        setSuccess(true);
        setIsProcessing(false);

        // Redirect to success page
        setTimeout(() => {
          navigate("/payment/success", {
            state: {
              orderId: paymentData.orderId,
              amount: paymentData.orderSummary.total,
            },
          });
        }, 2000);
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError(err.message || "Payment failed. Please try again.");
      setIsProcessing(false);
    }
  };

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-white py-12 px-4">
        <div className="max-w-[1440px] mx-auto text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-black mb-4">
            Payment Information Missing
          </h1>
          <p className="text-gray-600 mb-8">Please complete checkout first.</p>
          <Button onClick={() => navigate("/checkout")}>
            Back to Checkout
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-[1440px] mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-black transition">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/cart" className="hover:text-black transition">
            Cart
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/checkout" className="hover:text-black transition">
            Checkout
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-black font-medium">Payment</span>
        </div>

        {/* Page Title */}
        <h1 className="text-5xl font-heading font-bold text-black mb-12">
          Complete Payment
        </h1>

        {/* Success State */}
        {success && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-12 text-center max-w-md">
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="w-10 h-10 text-green-600" />
                </div>
              </div>
              <h2 className="text-3xl font-heading font-bold text-black mb-3">
                Payment Successful!
              </h2>
              <p className="text-gray-600 mb-2">
                Your payment has been processed successfully.
              </p>
              <p className="text-sm text-gray-500">
                Redirecting to order confirmation...
              </p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-3xl p-8">
              <h2 className="text-2xl font-heading font-bold text-black mb-6">
                Payment Details
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Cardholder Name */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    defaultValue={paymentData.shippingInfo.fullName}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-pill bg-gray-50 text-gray-600"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    defaultValue={paymentData.shippingInfo.email}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-pill bg-gray-50 text-gray-600"
                  />
                </div>

                {/* Card Element */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Card Information
                  </label>
                  <div className="border border-gray-300 rounded-pill p-4 bg-white">
                    <CardElement
                      options={{
                        style: {
                          base: {
                            fontSize: "16px",
                            color: "#000000",
                            "::placeholder": {
                              color: "#999999",
                            },
                          },
                          invalid: {
                            color: "#dc2626",
                          },
                        },
                      }}
                    />
                  </div>
                </div>

                {/* Billing Address */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Billing Address
                  </label>
                  <div className="bg-gray-50 rounded-pill p-4 text-gray-700">
                    <p className="font-medium">
                      {paymentData.billingInfo.sameAsShipping
                        ? "Same as shipping"
                        : paymentData.billingInfo.address}
                    </p>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-card p-4 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <div className="overflow-hidden">
                      <p className="font-medium text-red-900">Payment Failed</p>
                      <p className="text-sm text-red-800 whitespace-pre-wrap break-words">
                        {typeof error === 'object' ? JSON.stringify(error, null, 2) : error}
                      </p>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isProcessing || !stripe || !elements}
                  className="w-full bg-black text-white font-bold py-4 rounded-pill hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      Pay {formatPrice(paymentData.orderSummary.total)}
                    </>
                  )}
                </button>

                {/* Test Card Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-card p-4 text-sm">
                  <p className="font-medium text-blue-900 mb-2">
                    Test Card Numbers:
                  </p>
                  <p className="text-blue-800 mb-1">
                    Success:{" "}
                    <code className="bg-blue-100 px-2 py-1 rounded">
                      4242 4242 4242 4242
                    </code>
                  </p>
                  <p className="text-blue-800">
                    Any future expiry date & any 3-digit CVC
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-200 sticky top-20">
              <h2 className="text-2xl font-heading font-bold text-black mb-6">
                Order Summary
              </h2>

              {/* Items */}
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {paymentData.orderSummary.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-sm py-2 border-b border-gray-300"
                  >
                    <div>
                      <p className="font-medium text-black">{item.name}</p>
                      <p className="text-gray-600">x{item.quantity}</p>
                    </div>
                    <p className="font-bold text-black">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 border-t border-gray-300 pt-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(paymentData.orderSummary.subtotal)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>{formatPrice(paymentData.orderSummary.tax)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{formatPrice(paymentData.orderSummary.shipping)}</span>
                </div>

                <div className="border-t border-gray-300 pt-4">
                  <div className="flex justify-between text-xl font-bold text-black">
                    <span>Total</span>
                    <span>{formatPrice(paymentData.orderSummary.total)}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="mt-8 pt-6 border-t border-gray-300">
                <p className="text-xs uppercase font-bold text-gray-600 mb-3">
                  Shipping To
                </p>
                <div className="text-sm text-gray-700 space-y-1">
                  <p className="font-medium">
                    {paymentData.shippingInfo.fullName}
                  </p>
                  <p>{paymentData.shippingInfo.address}</p>
                  <p>
                    {paymentData.shippingInfo.city},
                    {paymentData.shippingInfo.state}{" "}
                    {paymentData.shippingInfo.zipCode}
                  </p>
                </div>
              </div>

              {/* Security Info */}
              <div className="mt-8 pt-6 border-t border-gray-300 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Lock className="w-4 h-4" />
                  Encrypted & Secure
                </div>
                <div className="text-xs text-gray-500">
                  Your payment information is secured with industry-standard
                  encryption.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;