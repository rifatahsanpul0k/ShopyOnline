import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Eye,
  X,
  Loader,
} from "lucide-react";
import Button from "../components/ui/Button";
import { getUserOrdersAPI } from "../services/ordersService.js";
import { generateInvoicePDF } from "../utils/invoiceGenerator.js";

// Dummy order data (fallback)
const DUMMY_ORDERS = [
  {
    id: "ORD-001",
    date: "2026-01-05",
    total: 299.99,
    status: "delivered",
    items: [
      {
        id: 1,
        name: "T-shirt with Tape Details",
        price: 120,
        quantity: 2,
        image:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop",
      },
      {
        id: 2,
        name: "Skinny Fit Jeans",
        price: 240,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1542272604-787c62d465d1?w=100&h=100&fit=crop",
      },
    ],
    deliveryDate: "2026-01-08",
    trackingNumber: "TRACK123456789",
  },
  {
    id: "ORD-002",
    date: "2026-01-02",
    total: 145.0,
    status: "in-transit",
    items: [
      {
        id: 3,
        name: "Checkered Shirt",
        price: 180,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=100&h=100&fit=crop",
      },
    ],
    deliveryDate: "2026-01-10",
    trackingNumber: "TRACK987654321",
  },
  {
    id: "ORD-003",
    date: "2025-12-28",
    total: 450.5,
    status: "processing",
    items: [
      {
        id: 4,
        name: "Sleeve Striped T-shirt",
        price: 130,
        quantity: 2,
        image:
          "https://images.unsplash.com/photo-1618354691551-418cb976055b?w=100&h=100&fit=crop",
      },
      {
        id: 5,
        name: "Vertical Striped Shirt",
        price: 212,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1570102519953-144402bfc4ea?w=100&h=100&fit=crop",
      },
    ],
    deliveryDate: "2026-01-12",
    trackingNumber: "TRACK555666777",
  },
  {
    id: "ORD-004",
    date: "2025-12-20",
    total: 89.99,
    status: "cancelled",
    items: [
      {
        id: 6,
        name: "Courage Graphic T-shirt",
        price: 145,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop",
      },
    ],
    deliveryDate: null,
    trackingNumber: null,
  },
];

const Orders = () => {
  const navigate = useNavigate();
  const { authUser } = useSelector((state) => state.auth);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getUserOrdersAPI();
        
        // Transform API response to match frontend format
        const transformedOrders = data.orders.map((order) => ({
          id: order.id,
          date: order.date,
          total: order.total,
          status: order.status.toLowerCase(),
          items: order.items || [],
          deliveryDate: order.date,
          trackingNumber: order.id.substring(0, 8).toUpperCase(),
          shippingInfo: order.shippingInfo,
        }));
        
        setOrders(transformedOrders);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders");
        // Fallback to dummy data
        setOrders(DUMMY_ORDERS);
      } finally {
        setLoading(false);
      }
    };

    if (authUser) {
      fetchOrders();
    }
  }, [authUser]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authUser) {
      navigate("/auth/login");
    }
  }, [authUser, navigate]);

  // Filter orders based on status
  const filteredOrders =
    filterStatus === "all"
      ? orders
      : orders.filter((order) => order.status === filterStatus);

  // Get status badge styling
  const getStatusBadge = (status) => {
    switch (status) {
      case "delivered":
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          text: "text-green-700",
          icon: <CheckCircle className="w-5 h-5" />,
          label: "Delivered",
        };
      case "in-transit":
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          text: "text-blue-700",
          icon: <Truck className="w-5 h-5" />,
          label: "In Transit",
        };
      case "processing":
        return {
          bg: "bg-yellow-50",
          border: "border-yellow-200",
          text: "text-yellow-700",
          icon: <Clock className="w-5 h-5" />,
          label: "Processing",
        };
      case "cancelled":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          text: "text-red-700",
          icon: <AlertCircle className="w-5 h-5" />,
          label: "Cancelled",
        };
      default:
        return {
          bg: "bg-gray-50",
          border: "border-gray-200",
          text: "text-gray-700",
          icon: <Package className="w-5 h-5" />,
          label: "Unknown",
        };
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Handle view order details
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  // Handle close modal
  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
    setTimeout(() => setSelectedOrder(null), 300);
  };

  if (!authUser) {
    return null;
  }

  return (
    <main className="w-full overflow-x-hidden bg-white">
      {/* Header */}
      <section className="py-16 px-6 lg:px-12 bg-gradient-to-r from-black to-gray-900 text-white">
        <div className="max-w-[1440px] mx-auto">
          <h1 className="text-5xl lg:text-6xl font-heading font-bold mb-2">
            My Orders
          </h1>
          <p className="text-lg text-white/80">
            Track and manage all your purchases
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-6 lg:px-12 max-w-[1440px] mx-auto">
        {/* Filter Tabs */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-3">
            {[
              { value: "all", label: "All Orders", count: orders.length },
              {
                value: "delivered",
                label: "Delivered",
                count: orders.filter((o) => o.status === "delivered").length,
              },
              {
                value: "in-transit",
                label: "In Transit",
                count: orders.filter((o) => o.status === "in-transit").length,
              },
              {
                value: "processing",
                label: "Processing",
                count: orders.filter((o) => o.status === "processing").length,
              },
              {
                value: "cancelled",
                label: "Cancelled",
                count: orders.filter((o) => o.status === "cancelled").length,
              },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setFilterStatus(filter.value)}
                className={`px-6 py-3 rounded-pill font-medium transition ${
                  filterStatus === filter.value
                    ? "bg-black text-white"
                    : "bg-gray-100 text-black hover:bg-gray-200"
                }`}
              >
                {filter.label}
                <span className="ml-2 text-sm opacity-70">
                  ({filter.count})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader className="w-12 h-12 text-black animate-spin mb-4" />
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          // Empty State
          <div className="text-center py-20">
            <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-heading font-bold text-black mb-2">
              No orders found
            </h2>
            <p className="text-gray-600 mb-8">
              {filterStatus === "all"
                ? "You haven't placed any orders yet."
                : `You have no ${
                    filterStatus === "in-transit"
                      ? "orders in transit"
                      : filterStatus === "processing"
                      ? "orders being processed"
                      : filterStatus === "delivered"
                      ? "delivered orders"
                      : "cancelled orders"
                  }.`}
            </p>
            <Button onClick={() => navigate("/products")} className="gap-2">
              Continue Shopping <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const statusBadge = getStatusBadge(order.status);
              return (
                <div
                  key={order.id}
                  className="bg-white border-2 border-black rounded-3xl p-6 lg:p-8 hover:shadow-lg transition"
                >
                  {/* Order Header */}
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-gray-200">
                    <div>
                      <h3 className="text-2xl font-heading font-bold text-black mb-2">
                        {order.id}
                      </h3>
                      <p className="text-gray-600">
                        Ordered on {formatDate(order.date)}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <div
                      className={`flex items-center gap-2 px-4 py-2 rounded-pill border-2 ${statusBadge.bg} ${statusBadge.border} ${statusBadge.text} w-fit`}
                    >
                      {statusBadge.icon}
                      <span className="font-semibold">{statusBadge.label}</span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="py-6">
                    <p className="text-sm font-semibold text-gray-600 mb-4">
                      ITEMS ({order.items.length})
                    </p>
                    <div className="space-y-4">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex gap-4 pb-4 border-b border-gray-200 last:border-b-0 last:pb-0"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 rounded-card object-cover border border-gray-200"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-black line-clamp-2">
                              {item.name}
                            </h4>
                            <p className="text-gray-600 text-sm mt-1">
                              Qty: {item.quantity}
                            </p>
                            <p className="font-bold text-black mt-2">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Footer */}
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pt-6 border-t border-gray-200">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Order Total</p>
                      <p className="text-3xl font-heading font-bold text-black">
                        ${order.total.toFixed(2)}
                      </p>
                    </div>

                    {/* Tracking Info */}
                    {order.trackingNumber && (
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 mb-1">
                          Tracking Number
                        </p>
                        <p className="font-mono text-black font-semibold">
                          {order.trackingNumber}
                        </p>
                      </div>
                    )}

                    {/* Delivery Date */}
                    {order.deliveryDate && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          {order.status === "delivered"
                            ? "Delivered on"
                            : "Expected by"}
                        </p>
                        <p className="text-lg font-semibold text-black">
                          {formatDate(order.deliveryDate)}
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 flex-wrap lg:flex-nowrap">
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="flex items-center gap-2 px-4 py-3 bg-black text-white font-medium rounded-pill hover:opacity-90 transition"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                      {order.status === "delivered" && (
                        <button 
                          onClick={() => generateInvoicePDF(order, authUser)}
                          className="flex items-center gap-2 px-4 py-3 border-2 border-black text-black font-medium rounded-pill hover:bg-gray-100 transition"
                        >
                          <Download className="w-4 h-4" />
                          Invoice
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Order Details Modal */}
      {isDetailModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-black shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 lg:p-8 border-b-2 border-black sticky top-0 bg-white">
              <h2 className="text-3xl font-heading font-bold text-black">
                Order {selectedOrder.id}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <X className="w-6 h-6 text-black" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 lg:p-8 space-y-8">
              {/* Status Timeline */}
              <div>
                <h3 className="text-lg font-bold text-black mb-4">
                  Order Status
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      step: "Order Placed",
                      date: selectedOrder.date,
                      completed: true,
                    },
                    {
                      step: "Processing",
                      date: selectedOrder.date,
                      completed: ["in-transit", "delivered"].includes(
                        selectedOrder.status
                      ),
                    },
                    {
                      step: "Shipped",
                      date: selectedOrder.deliveryDate,
                      completed: ["in-transit", "delivered"].includes(
                        selectedOrder.status
                      ),
                    },
                    {
                      step: "Delivered",
                      date: selectedOrder.deliveryDate,
                      completed: selectedOrder.status === "delivered",
                    },
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition ${
                            item.completed
                              ? "bg-black text-white"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {item.completed ? "✓" : idx + 1}
                        </div>
                        {idx < 3 && (
                          <div
                            className={`w-1 h-8 ${
                              item.completed ? "bg-black" : "bg-gray-200"
                            }`}
                          />
                        )}
                      </div>
                      <div>
                        <p
                          className={`font-semibold ${
                            item.completed ? "text-black" : "text-gray-600"
                          }`}
                        >
                          {item.step}
                        </p>
                        {item.date && (
                          <p className="text-sm text-gray-600">
                            {formatDate(item.date)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Items Summary */}
              <div>
                <h3 className="text-lg font-bold text-black mb-4">
                  Order Items
                </h3>
                <div className="space-y-3 bg-gray-50 rounded-card p-4">
                  {selectedOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center pb-3 border-b border-gray-200 last:border-b-0 last:pb-0"
                    >
                      <div>
                        <p className="font-semibold text-black">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="font-bold text-black">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-black text-white rounded-card p-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${(selectedOrder.total * 0.91).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (10%):</span>
                    <span>${(selectedOrder.total * 0.09).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>Free</span>
                  </div>
                  <div className="border-t border-white/20 pt-3 flex justify-between text-xl font-bold">
                    <span>Total:</span>
                    <span>${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Tracking Info */}
              {selectedOrder.trackingNumber && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-card p-6">
                  <p className="text-sm text-blue-700 mb-1">Tracking Number</p>
                  <p className="font-mono font-bold text-blue-900 text-lg">
                    {selectedOrder.trackingNumber}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                {selectedOrder.status === "delivered" && (
                  <button 
                    onClick={() => {
                      generateInvoicePDF(selectedOrder, authUser);
                      handleCloseModal();
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-black text-black font-bold rounded-pill hover:bg-gray-100 transition"
                  >
                    <Download className="w-4 h-4" />
                    Download Invoice
                  </button>
                )}
                <button
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-3 bg-black text-white font-bold rounded-pill hover:opacity-90 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Orders;
