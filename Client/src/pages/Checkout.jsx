import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ChevronLeft, Lock, Check, AlertCircle } from "lucide-react";
import Button from "../components/ui/Button";
import { formatPrice } from "../utils/currencyFormatter";
import { createOrderAPI } from "../services/ordersService";
import { toast } from "react-toastify";
import { clearCart } from "../store/slices/cartSlice";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { authUser } = useSelector((state) => state.auth);
  const orderSummary = location.state?.orderSummary;

  const [formStep, setFormStep] = useState(1); // 1: Shipping, 2: Billing, 3: Review
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [shippingInfo, setShippingInfo] = useState({
    fullName: authUser?.name || "",
    email: authUser?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  });

  const [billingInfo, setBillingInfo] = useState({
    sameAsShipping: true,
    fullName: authUser?.name || "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  });

  // Validate shipping form
  const validateShipping = () => {
    const newErrors = {};
    if (!shippingInfo.fullName.trim())
      newErrors.fullName = "Full name is required";
    if (!shippingInfo.email.trim()) newErrors.email = "Email is required";
    if (!shippingInfo.phone.trim()) newErrors.phone = "Phone is required";
    if (!shippingInfo.address.trim()) newErrors.address = "Address is required";
    if (!shippingInfo.city.trim()) newErrors.city = "City is required";
    if (!shippingInfo.state.trim()) newErrors.state = "State is required";
    if (!shippingInfo.zipCode.trim())
      newErrors.zipCode = "Zip code is required";

    // Phone validation
    if (
      shippingInfo.phone &&
      !/^\d{10,}/.test(shippingInfo.phone.replace(/\D/g, ""))
    ) {
      newErrors.phone = "Phone must be at least 10 digits";
    }

    // Email validation
    if (
      shippingInfo.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingInfo.email)
    ) {
      newErrors.email = "Invalid email address";
    }

    // Zip code validation
    if (
      shippingInfo.zipCode &&
      !/^\d{5,}/.test(shippingInfo.zipCode.replace(/\D/g, ""))
    ) {
      newErrors.zipCode = "Zip code must be at least 5 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateBilling = () => {
    if (billingInfo.sameAsShipping) return true;

    const newErrors = {};
    if (!billingInfo.fullName.trim())
      newErrors.fullName = "Full name is required";
    if (!billingInfo.address.trim()) newErrors.address = "Address is required";
    if (!billingInfo.city.trim()) newErrors.city = "City is required";
    if (!billingInfo.state.trim()) newErrors.state = "State is required";
    if (!billingInfo.zipCode.trim()) newErrors.zipCode = "Zip code is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleBillingChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setBillingInfo((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setBillingInfo((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleContinueToPayment = async () => {
    if (formStep === 1) {
      if (!validateShipping()) return;
      setFormStep(2);
    } else if (formStep === 2) {
      if (!validateBilling()) return;
      setFormStep(3);
    } else if (formStep === 3) {
      // Proceed to payment - Create order in backend
      setIsLoading(true);
      try {
        // Prepare order data for backend
        const orderData = {
          orderItems: orderSummary.items.map(item => ({
            product_id: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
          shippingInfo: {
            address: shippingInfo.address,
            city: shippingInfo.city,
            state: shippingInfo.state,
            zip_code: shippingInfo.zipCode,
            country: shippingInfo.country,
            phone_number: shippingInfo.phone,
          },
          itemsPrice: orderSummary.subtotal,
          taxPrice: orderSummary.tax,
          shippingPrice: orderSummary.shipping,
          totalPrice: orderSummary.total,
          paymentInfo: {
            status: "Pending", // Will be updated after payment
          },
        };

        // Create order via API
        const response = await createOrderAPI(orderData);
        
        if (response.success) {
          toast.success("Order created successfully!");
          
          // Clear cart after successful order creation
          dispatch(clearCart());
          
          // Redirect to payment page with real order ID
          navigate("/payment", {
            state: {
              orderId: response.order.id,
              shippingInfo,
              billingInfo,
              orderSummary,
            },
          });
        }
      } catch (error) {
        console.error("Error creating order:", error);
        toast.error(error.message || "Failed to create order. Please try again.");
        setErrors({ submit: error.message || "Failed to create order. Please try again." });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBackStep = () => {
    if (formStep > 1) {
      setFormStep(formStep - 1);
      setErrors({});
    } else {
      navigate("/cart");
    }
  };

  if (!orderSummary) {
    return (
      <div className="min-h-screen bg-white py-12 px-4">
        <div className="max-w-[1440px] mx-auto text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-black mb-4">
            Order Information Missing
          </h1>
          <p className="text-gray-600 mb-8">Please start from the cart page.</p>
          <Button onClick={() => navigate("/cart")}>Back to Cart</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-[1440px] mx-auto">
        {/* Back Button */}
        <button
          onClick={handleBackStep}
          className="flex items-center gap-2 text-black hover:opacity-70 transition mb-8"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                  step < formStep
                    ? "bg-black text-white"
                    : step === formStep
                    ? "bg-black text-white ring-4 ring-black ring-offset-2"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {step < formStep ? <Check className="w-5 h-5" /> : step}
              </div>
              {step < 3 && (
                <div
                  className={`w-16 h-1 ${
                    step < formStep ? "bg-black" : "bg-gray-300"
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>

        {/* Step Labels */}
        <div className="flex justify-between mb-12 text-center">
          <div>
            <p
              className={`font-bold ${
                formStep >= 1 ? "text-black" : "text-gray-400"
              }`}
            >
              Shipping
            </p>
          </div>
          <div>
            <p
              className={`font-bold ${
                formStep >= 2 ? "text-black" : "text-gray-400"
              }`}
            >
              Billing
            </p>
          </div>
          <div>
            <p
              className={`font-bold ${
                formStep >= 3 ? "text-black" : "text-gray-400"
              }`}
            >
              Review & Pay
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Form Section */}
          <div className="lg:col-span-2">
            {/* STEP 1: SHIPPING */}
            {formStep === 1 && (
              <div className="bg-white border border-gray-200 rounded-3xl p-8">
                <h2 className="text-3xl font-heading font-bold text-black mb-8">
                  Shipping Address
                </h2>

                <div className="space-y-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={shippingInfo.fullName}
                      onChange={handleShippingChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-pill focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="John Doe"
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={shippingInfo.email}
                      onChange={handleShippingChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-pill focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleShippingChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-pill focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="+1 (555) 000-0000"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleShippingChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-pill focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="123 Main Street"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.address}
                      </p>
                    )}
                  </div>

                  {/* City, State, Zip */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleShippingChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-pill focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="New York"
                      />
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.city}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={shippingInfo.state}
                        onChange={handleShippingChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-pill focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="NY"
                      />
                      {errors.state && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.state}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Zip Code *
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={shippingInfo.zipCode}
                        onChange={handleShippingChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-pill focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="10001"
                      />
                      {errors.zipCode && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.zipCode}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Country
                    </label>
                    <select
                      name="country"
                      value={shippingInfo.country}
                      onChange={handleShippingChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-pill focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="Mexico">Mexico</option>
                      <option value="UK">United Kingdom</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: BILLING */}
            {formStep === 2 && (
              <div className="bg-white border border-gray-200 rounded-3xl p-8">
                <h2 className="text-3xl font-heading font-bold text-black mb-8">
                  Billing Address
                </h2>

                {/* Same as Shipping Checkbox */}
                <div className="mb-8 flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="sameAsShipping"
                    checked={billingInfo.sameAsShipping}
                    onChange={handleBillingChange}
                    className="w-5 h-5 rounded border-gray-300 focus:ring-black cursor-pointer"
                  />
                  <label className="text-black font-medium cursor-pointer">
                    Same as shipping address
                  </label>
                </div>

                {/* Billing Form (hidden if same as shipping) */}
                {!billingInfo.sameAsShipping && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={billingInfo.fullName}
                        onChange={handleBillingChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-pill focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="John Doe"
                      />
                      {errors.fullName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.fullName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={billingInfo.address}
                        onChange={handleBillingChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-pill focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="123 Main Street"
                      />
                      {errors.address && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.address}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={billingInfo.city}
                          onChange={handleBillingChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-pill focus:outline-none focus:ring-2 focus:ring-black"
                          placeholder="New York"
                        />
                        {errors.city && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.city}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-black mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={billingInfo.state}
                          onChange={handleBillingChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-pill focus:outline-none focus:ring-2 focus:ring-black"
                          placeholder="NY"
                        />
                        {errors.state && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.state}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-black mb-2">
                          Zip Code *
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          value={billingInfo.zipCode}
                          onChange={handleBillingChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-pill focus:outline-none focus:ring-2 focus:ring-black"
                          placeholder="10001"
                        />
                        {errors.zipCode && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.zipCode}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Country
                      </label>
                      <select
                        name="country"
                        value={billingInfo.country}
                        onChange={handleBillingChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-pill focus:outline-none focus:ring-2 focus:ring-black"
                      >
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="Mexico">Mexico</option>
                        <option value="UK">United Kingdom</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: REVIEW */}
            {formStep === 3 && (
              <div className="space-y-8">
                {/* Shipping Review */}
                <div className="bg-white border border-gray-200 rounded-3xl p-8">
                  <h3 className="text-2xl font-heading font-bold text-black mb-6">
                    Shipping Address
                  </h3>
                  <div className="space-y-2 text-gray-700">
                    <p>
                      <strong>{shippingInfo.fullName}</strong>
                    </p>
                    <p>{shippingInfo.address}</p>
                    <p>
                      {shippingInfo.city}, {shippingInfo.state}{" "}
                      {shippingInfo.zipCode}
                    </p>
                    <p>{shippingInfo.country}</p>
                    <p className="pt-2 text-sm">Email: {shippingInfo.email}</p>
                    <p className="text-sm">Phone: {shippingInfo.phone}</p>
                  </div>
                </div>

                {/* Billing Review */}
                <div className="bg-white border border-gray-200 rounded-3xl p-8">
                  <h3 className="text-2xl font-heading font-bold text-black mb-6">
                    Billing Address
                  </h3>
                  {billingInfo.sameAsShipping ? (
                    <p className="text-gray-600">Same as shipping address</p>
                  ) : (
                    <div className="space-y-2 text-gray-700">
                      <p>
                        <strong>{billingInfo.fullName}</strong>
                      </p>
                      <p>{billingInfo.address}</p>
                      <p>
                        {billingInfo.city}, {billingInfo.state}{" "}
                        {billingInfo.zipCode}
                      </p>
                      <p>{billingInfo.country}</p>
                    </div>
                  )}
                </div>

                {/* Items Review */}
                <div className="bg-white border border-gray-200 rounded-3xl p-8">
                  <h3 className="text-2xl font-heading font-bold text-black mb-6">
                    Order Items
                  </h3>
                  <div className="space-y-3">
                    {orderSummary.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center py-3 border-b border-gray-200 last:border-0"
                      >
                        <div>
                          <p className="font-medium text-black">{item.name}</p>
                          <p className="text-sm text-gray-600">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="font-bold text-black">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-200 sticky top-20">
              <h2 className="text-2xl font-heading font-bold text-black mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(orderSummary.subtotal)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>{formatPrice(orderSummary.tax)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{formatPrice(orderSummary.shipping)}</span>
                </div>

                <div className="border-t border-gray-300 pt-4">
                  <div className="flex justify-between text-xl font-bold text-black">
                    <span>Total</span>
                    <span>{formatPrice(orderSummary.total)}</span>
                  </div>
                </div>
              </div>

              {/* Security Badge */}
              <div className="bg-green-50 border border-green-200 rounded-card p-3 mb-6 flex gap-2">
                <Lock className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div className="text-xs text-green-800">
                  Secure payment processing with Stripe
                </div>
              </div>

              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-card p-3 mb-6 flex gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <div className="text-xs text-red-800">{errors.submit}</div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleContinueToPayment}
                  disabled={isLoading}
                  className="w-full bg-black text-white font-bold py-4 rounded-pill hover:opacity-90 transition disabled:opacity-50"
                >
                  {isLoading
                    ? "Processing..."
                    : formStep === 3
                    ? "Proceed to Payment"
                    : "Continue"}
                </button>

                <button
                  onClick={handleBackStep}
                  disabled={isLoading}
                  className="w-full border border-gray-300 text-black font-medium py-3 rounded-pill hover:bg-gray-100 transition disabled:opacity-50"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
