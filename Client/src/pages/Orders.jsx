import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
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
  ArrowLeft,
  Trash2,
  AlertTriangle,
  Star,
  Check,
} from "lucide-react";
import Button from "../components/ui/Button";
import { getUserOrdersAPI, deleteOrderAPI } from "../services/ordersService.js";
import { generateInvoicePDF } from "../utils/invoiceGenerator.js";
import { toast } from "react-toastify";
import { postReview, fetchSingleProduct } from "../store/slices/productSlice";

// Dummy data for development/testing
const DUMMY_ORDERS = [
  {
    id: "ORD-2026-001",
    date: "2026-01-05",
    total: 299.99,
    status: "delivered",
    items: [
      {
        id: 1,
        name: "Premium Wireless Headphones",
        price: 149.99,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop",
      },
      {
        id: 2,
        name: "USB-C Cable Pack",
        price: 29.99,
        quantity: 2,
        image:
          "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=100&h=100&fit=crop",
      },
    ],
    shippingInfo: {
      fullName: "John Doe",
      email: "john@example.com",
      phone: "+1 (555) 123-4567",
      address: "123 Main Street, Apt 4B",
      city: "New York",
      state: "NY",
      country: "United States",
      pincode: "10001",
    },
  },
  {
    id: "ORD-2026-002",
    date: "2026-01-08",
    total: 199.99,
    status: "shipped",
    items: [
      {
        id: 3,
        name: "Mechanical Keyboard RGB",
        price: 199.99,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1587829191301-39c67b60ae4f?w=100&h=100&fit=crop",
      },
    ],
    shippingInfo: {
      fullName: "John Doe",
      email: "john@example.com",
      phone: "+1 (555) 123-4567",
      address: "123 Main Street, Apt 4B",
      city: "New York",
      state: "NY",
      country: "United States",
      pincode: "10001",
    },
  },
  {
    id: "ORD-2026-003",
    date: "2026-01-10",
    total: 89.99,
    status: "processing",
    items: [
      {
        id: 4,
        name: "Wireless Mouse Pro",
        price: 49.99,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1527814050087-3793815479db?w=100&h=100&fit=crop",
      },
      {
        id: 5,
        name: "Mouse Pad",
        price: 19.99,
        quantity: 2,
        image:
          "https://images.unsplash.com/photo-1587829191351-b8da7e50b91b?w=100&h=100&fit=crop",
      },
    ],
    shippingInfo: {
      fullName: "John Doe",
      email: "john@example.com",
      phone: "+1 (555) 123-4567",
      address: "123 Main Street, Apt 4B",
      city: "New York",
      state: "NY",
      country: "United States",
      pincode: "10001",
    },
  },
  {
    id: "ORD-2026-004",
    date: "2025-12-28",
    total: 449.97,
    status: "delivered",
    items: [
      {
        id: 6,
        name: "27 inch Monitor 4K",
        price: 349.99,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=100&h=100&fit=crop",
      },
      {
        id: 7,
        name: "HDMI Cable",
        price: 9.99,
        quantity: 10,
        image:
          "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=100&h=100&fit=crop",
      },
    ],
    shippingInfo: {
      fullName: "John Doe",
      email: "john@example.com",
      phone: "+1 (555) 123-4567",
      address: "123 Main Street, Apt 4B",
      city: "New York",
      state: "NY",
      country: "United States",
      pincode: "10001",
    },
  },
  {
    id: "ORD-2026-005",
    date: "2025-12-20",
    total: 129.99,
    status: "cancelled",
    items: [
      {
        id: 8,
        name: "Gaming Controller",
        price: 129.99,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1578303512254-e540dcedd309?w=100&h=100&fit=crop",
      },
    ],
    shippingInfo: {
      fullName: "John Doe",
      email: "john@example.com",
      phone: "+1 (555) 123-4567",
      address: "123 Main Street, Apt 4B",
      city: "New York",
      state: "NY",
      country: "United States",
      pincode: "10001",
    },
  },
];

const Orders = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { authUser } = useSelector((state) => state.auth);
  const { isPostingReview } = useSelector((state) => state.product);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Review Modal State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewProduct, setReviewProduct] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [productReviews, setProductReviews] = useState({});

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getUserOrdersAPI();

        console.log("Orders response:", data);

        // Backend returns 'myOrders' field
        const ordersData = data.myOrders || [];

        // Transform API response to match frontend format
        const transformedOrders = ordersData.map((order) => {
          // Parse order_items which is JSON string from backend
          const orderItems = typeof order.order_items === 'string'
            ? JSON.parse(order.order_items)
            : (order.order_items || []);

          // Parse shipping_info which is JSON object
          const shippingInfo = typeof order.shipping_info === 'string'
            ? JSON.parse(order.shipping_info)
            : (order.shipping_info || {});

          return {
            id: order.id,
            date: order.created_at || order.date,
            total: parseFloat(order.total_price || 0),
            status: (order.order_status || 'processing').toLowerCase(),
            items: orderItems.map(item => ({
              id: item.product_id,
              name: item.title || 'Product',
              price: parseFloat(item.price || 0),
              quantity: parseInt(item.quantity || 1),
              image: item.image
            })),
            shippingInfo: {
              fullName: shippingInfo.full_name,
              email: authUser?.email,
              phone: shippingInfo.phone,
              address: shippingInfo.address,
              city: shippingInfo.city,
              state: shippingInfo.state,
              country: shippingInfo.country,
              pincode: shippingInfo.pincode
            }
          };
        });

        setOrders(transformedOrders);

        // Fetch reviews for all products in delivered orders
        const deliveredOrders = transformedOrders.filter(o => o.status === 'delivered');
        const reviewsMap = {};

        for (const order of deliveredOrders) {
          for (const item of order.items) {
            if (item.id && !reviewsMap[item.id]) {
              try {
                const productResponse = await dispatch(fetchSingleProduct(item.id)).unwrap();
                if (productResponse?.product?.reviews && authUser) {
                  const userReview = productResponse.product.reviews.find(
                    review => review.reviewer?.id === authUser.id
                  );
                  if (userReview) {
                    reviewsMap[item.id] = userReview;
                  }
                }
              } catch (error) {
                console.error(`Error fetching reviews for product ${item.id}:`, error);
              }
            }
          }
        }

        setProductReviews(reviewsMap);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    if (authUser) {
      fetchOrders();

      // Auto-refresh orders every 30 seconds to check for status updates
      const interval = setInterval(fetchOrders, 30000);
      return () => clearInterval(interval);
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
      case "shipped":
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          text: "text-blue-700",
          icon: <Truck className="w-5 h-5" />,
          label: "Shipped",
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

  // Handle review submit
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    try {
      await dispatch(postReview({
        productId: reviewProduct.id,
        rating,
        comment
      })).unwrap();

      // Update productReviews state with the new/updated review
      setProductReviews(prev => ({
        ...prev,
        [reviewProduct.id]: { rating, comment, reviewer: { id: authUser.id } }
      }));

      setShowReviewModal(false);
      setReviewProduct(null);
      setComment("");
      setRating(5);
      toast.success(productReviews[reviewProduct.id] ? "Review updated successfully!" : "Review submitted successfully!");
    } catch (error) {
      console.error("Failed to post review:", error);
    }
  };

  // Handle delete order
  const handleDeleteOrder = async (orderId) => {
    try {
      setDeleting(true);
      await deleteOrderAPI(orderId);

      // Remove from orders list
      setOrders(orders.filter(order => order.id !== orderId));
      setIsDetailModalOpen(false);
      setShowDeleteConfirm(false);
      setSelectedOrder(null);
      toast.success("Order deleted successfully");
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order");
    } finally {
      setDeleting(false);
    }
  };

  if (!authUser) {
    return null;
  }

  return (
    <main className="w-full overflow-x-hidden bg-white">
      {/* Header */}
      <section className="py-16 px-6 lg:px-12 bg-gradient-to-r from-black to-gray-900 text-white">
        <div className="max-w-[1440px] mx-auto">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-sm text-white/60 mb-6">
            <Link to="/" className="hover:text-white transition">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/profile" className="hover:text-white transition">
              Profile
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">My Orders</span>
          </div>

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
                value: "shipped",
                label: "Shipped",
                count: orders.filter((o) => o.status === "shipped").length,
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
                className={`px-6 py-3 rounded-pill font-medium transition ${filterStatus === filter.value
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

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader className="w-12 h-12 text-black animate-spin mb-4" />
            <p className="text-gray-600">Loading your orders...</p>
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
                : `You have no ${filterStatus} orders.`}
            </p>
            <Button onClick={() => navigate("/products")} className="gap-2">
              Continue Shopping <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        ) : (
          // Orders List
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
                      ITEMS ({order.items?.length || 0})
                    </p>
                    <div className="space-y-4">
                      {(order.items || []).map((item, idx) => (
                        <div
                          key={idx}
                          className="flex gap-4 pb-4 border-b border-gray-200 last:border-b-0 last:pb-0"
                        >
                          <Link to={`/product/${item.id}`} className="shrink-0">
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-20 h-20 rounded-card object-cover border border-gray-200 hover:opacity-80 transition"
                              />
                            )}
                          </Link>
                          <div className="flex-1">
                            <Link to={`/product/${item.id}`}>
                              <h4 className="font-semibold text-black line-clamp-2 hover:text-gray-600 transition cursor-pointer">
                                {item.name}
                              </h4>
                            </Link>
                            <p className="text-gray-600 text-sm mt-1">
                              Qty: {item.quantity}
                            </p>
                            <p className="font-bold text-black mt-2">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>

                            {/* Rate & Review Button for Delivered Orders */}
                            {order.status === "delivered" && (
                              <div>
                                {productReviews[item.id] ? (
                                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Check className="w-4 h-4 text-green-600" />
                                      <span className="text-green-700 font-semibold text-sm">
                                        You reviewed this product
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1 mb-1">
                                      {[...Array(5)].map((_, i) => (
                                        <Star
                                          key={i}
                                          className={`w-3 h-3 ${i < productReviews[item.id].rating
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-gray-300"
                                            }`}
                                        />
                                      ))}
                                      <span className="text-xs text-gray-600 ml-1">
                                        {productReviews[item.id].rating}/5
                                      </span>
                                    </div>
                                    <p className="text-xs text-gray-600 line-clamp-2">
                                      {productReviews[item.id].comment}
                                    </p>
                                    <button
                                      onClick={() => {
                                        setReviewProduct(item);
                                        setRating(productReviews[item.id].rating);
                                        setComment(productReviews[item.id].comment);
                                        setShowReviewModal(true);
                                      }}
                                      className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                      Edit Review
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => {
                                      setReviewProduct(item);
                                      setRating(5);
                                      setComment("");
                                      setShowReviewModal(true);
                                    }}
                                    className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-sm rounded-full hover:from-yellow-500 hover:to-orange-600 transition-all transform hover:scale-105 shadow-md"
                                  >
                                    <Star className="w-4 h-4 fill-black" />
                                    Rate & Review
                                  </button>
                                )}
                              </div>
                            )}
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

                    {/* Action Buttons */}
                    <div className="flex gap-3 flex-wrap lg:flex-nowrap">
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="flex items-center gap-2 px-4 py-3 bg-black text-white font-medium rounded-pill hover:opacity-90 transition"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Detail Modal */}
      {isDetailModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-black">
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
            <div className="p-6 space-y-6">
              {/* Status Timeline */}
              <div>
                <h3 className="text-lg font-bold text-black mb-4">
                  Order Status
                </h3>
                <div className="space-y-4">
                  {[
                    { step: "Order Placed", completed: true },
                    {
                      step: "Processing",
                      completed: ["shipped", "delivered"].includes(
                        selectedOrder.status
                      ),
                    },
                    {
                      step: "Shipped",
                      completed: ["shipped", "delivered"].includes(
                        selectedOrder.status
                      ),
                    },
                    {
                      step: "Delivered",
                      completed: selectedOrder.status === "delivered",
                    },
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition ${item.completed
                            ? "bg-black text-white"
                            : "bg-gray-200 text-gray-600"
                            }`}
                        >
                          {item.completed ? "✓" : idx + 1}
                        </div>
                        {idx < 3 && (
                          <div
                            className={`w-1 h-8 ${item.completed ? "bg-black" : "bg-gray-200"
                              }`}
                          />
                        )}
                      </div>
                      <div>
                        <p
                          className={`font-semibold ${item.completed ? "text-black" : "text-gray-600"
                            }`}
                        >
                          {item.step}
                        </p>
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
                  {(selectedOrder.items || []).map((item, idx) => (
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

              {/* Shipping Info */}
              {selectedOrder.shippingInfo && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-card p-6">
                  <h3 className="text-lg font-bold text-black mb-4">
                    Shipping Address
                  </h3>
                  <div className="space-y-2 text-gray-700">
                    {selectedOrder.shippingInfo.fullName && (
                      <p>{selectedOrder.shippingInfo.fullName}</p>
                    )}
                    {selectedOrder.shippingInfo.address && (
                      <p>{selectedOrder.shippingInfo.address}</p>
                    )}
                    {selectedOrder.shippingInfo.city && (
                      <p>
                        {selectedOrder.shippingInfo.city}
                        {selectedOrder.shippingInfo.state &&
                          `, ${selectedOrder.shippingInfo.state}`}
                      </p>
                    )}
                    {selectedOrder.shippingInfo.pincode && (
                      <p>{selectedOrder.shippingInfo.pincode}</p>
                    )}
                    {selectedOrder.shippingInfo.country && (
                      <p>{selectedOrder.shippingInfo.country}</p>
                    )}
                  </div>
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
                {(selectedOrder.status === "delivered" || selectedOrder.status === "cancelled") && (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-red-500 text-red-500 font-bold rounded-pill hover:bg-red-50 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Order
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in-95 overflow-hidden">
            {/* Icon */}
            <div className="pt-8 flex justify-center">
              <div className="h-16 w-16 rounded-full bg-red-50 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </div>

            {/* Content */}
            <div className="p-8 text-center space-y-4">
              <h3 className="text-2xl font-black text-black">
                Delete Order?
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Are you sure you want to delete order <span className="font-bold text-black">#{selectedOrder?.id.slice(0, 8)}</span>? This action cannot be undone.
              </p>
            </div>

            {/* Actions */}
            <div className="px-8 pb-8 flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="flex-1 px-6 py-3 font-bold text-gray-600 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteOrder(selectedOrder.id)}
                disabled={deleting}
                className="flex-1 px-6 py-3 font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && reviewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => {
                setShowReviewModal(false);
                setReviewProduct(null);
                setComment("");
                setRating(5);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-black transition"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-black uppercase mb-2">
              {productReviews[reviewProduct.id] ? "Edit Review" : "Rate & Review"}
            </h2>
            <p className="text-gray-600 mb-6">{reviewProduct.name}</p>

            <form onSubmit={handleReviewSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-bold uppercase mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        size={32}
                        className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold uppercase mb-2">Your Review</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience with this product..."
                  className="w-full h-32 p-4 rounded-xl border-2 border-gray-200 focus:border-black outline-none resize-none transition"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isPostingReview}
                className="w-full bg-black text-white py-4 rounded-full font-bold uppercase hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPostingReview ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Orders;