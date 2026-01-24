import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    ShoppingCart,
    Clock,
    Truck,
    CheckCircle,
    XCircle,
    Search,
    Filter,
    Eye,
    Calendar,
    User,
    CreditCard,
    MapPin,
    ChevronDown,
    X,
    ArrowUpRight,
    Package,
    Trash2,
    AlertTriangle,
    Loader,
} from "lucide-react";
import {
    fetchAdminOrders,
    fetchAdminOrderStats,
    updateAdminOrderStatus,
    deleteAdminOrder
} from "../../store/slices/adminSlice";
import { fetchOrderDetails } from "../../services/ordersAdminService";
import { formatPrice } from "../../utils/currencyFormatter";
import { formatDate } from "../../utils/formatters";
import { toast } from "react-toastify";

const AdminOrders = () => {
    const dispatch = useDispatch();
    const {
        orders,
        orderStats: stats,
        ordersLoading: loading
    } = useSelector((state) => state.admin);

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderItems, setOrderItems] = useState([]);
    const [loadingItems, setLoadingItems] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [initLoading, setInitLoading] = useState(true);

    useEffect(() => {
        loadData();

        // Poll for updates every 30 seconds
        const pollInterval = setInterval(() => {
            dispatch(fetchAdminOrders());
            dispatch(fetchAdminOrderStats());
        }, 30000);

        return () => clearInterval(pollInterval);
    }, [dispatch]);

    const loadData = () => {
        Promise.all([
            dispatch(fetchAdminOrders()),
            dispatch(fetchAdminOrderStats())
        ]).finally(() => setInitLoading(false));
    };

    // ... (rest of functions)

    const loadOrderDetails = async (orderId) => {
        try {
            setLoadingItems(true);
            const response = await fetchOrderDetails(orderId);
            if (response.success && response.orders) {
                setOrderItems(response.orders.order_items || []);
            }
        } catch (error) {
            console.error("Error loading order details:", error);
            toast.error("Failed to load order details");
            setOrderItems([]);
        } finally {
            setLoadingItems(false);
        }
    };

    // ... (rest of component)


    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            setUpdatingStatus(true);
            const resultAction = await dispatch(updateAdminOrderStatus({ orderId, status: newStatus }));

            if (updateAdminOrderStatus.fulfilled.match(resultAction)) {
                // Update local state if modal is open
                if (selectedOrder?.id === orderId) {
                    setSelectedOrder({ ...selectedOrder, order_status: newStatus });
                }
                // Refresh stats
                dispatch(fetchAdminOrderStats());
            }
        } catch (error) {
            // Handled in slice
        } finally {
            setUpdatingStatus(false);
        }
    };

    const handleDeleteOrder = async () => {
        try {
            setDeleting(true);
            const resultAction = await dispatch(deleteAdminOrder(selectedOrder.id));

            if (deleteAdminOrder.fulfilled.match(resultAction)) {
                // Refresh stats
                dispatch(fetchAdminOrderStats());
                setShowDetailsModal(false);
                setShowDeleteConfirm(false);
                setSelectedOrder(null);
            }
        } catch (error) {
            // Handled in slice
        } finally {
            setDeleting(false);
        }
    };

    const handleDownloadInvoice = async (order) => {
        try {
            // Load jsPDF library
            const jsPDFScript = document.createElement('script');
            jsPDFScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';

            jsPDFScript.onload = () => {
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: 'a4'
                });

                const pageWidth = doc.internal.pageSize.getWidth();
                const pageHeight = doc.internal.pageSize.getHeight();
                let yPosition = 20;

                // Header
                doc.setFillColor(0, 0, 0);
                doc.rect(0, 0, pageWidth, 25, 'F');
                doc.setTextColor(255, 255, 255);
                doc.setFontSize(20);
                doc.setFont('helvetica', 'bold');
                doc.text('SHOPY ONLINE', pageWidth / 2, 10, { align: 'center' });
                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                doc.text('Invoice', pageWidth / 2, 18, { align: 'center' });

                yPosition = 35;

                // Invoice Details
                doc.setTextColor(0, 0, 0);
                doc.setFontSize(12);
                doc.setFont('helvetica', 'bold');
                doc.text('INVOICE', 20, yPosition);
                yPosition += 8;

                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                doc.text(`Order ID: ${order.id.slice(0, 8).toUpperCase()} `, 20, yPosition);
                yPosition += 6;
                doc.text(`Date: ${formatDate(order.created_at)} `, 20, yPosition);
                yPosition += 8;

                // Customer Info
                doc.setFont('helvetica', 'bold');
                doc.text('CUSTOMER', 20, yPosition);
                yPosition += 6;
                doc.setFont('helvetica', 'normal');
                doc.text(`Name: ${order.user_name} `, 20, yPosition);
                yPosition += 5;
                doc.text(`Email: ${order.user_email} `, 20, yPosition);
                yPosition += 10;

                // Order Summary Table
                doc.setFont('helvetica', 'bold');
                doc.setFillColor(240, 240, 240);
                doc.rect(20, yPosition, 170, 7, 'F');
                doc.text('Description', 25, yPosition + 5);
                doc.text('Amount', 150, yPosition + 5);
                yPosition += 12;

                doc.setFont('helvetica', 'normal');
                doc.text('Order Items', 25, yPosition);
                doc.text(`${formatPrice(order.items_price || 0)} `, 150, yPosition);
                yPosition += 6;

                doc.text('Tax (18%)', 25, yPosition);
                doc.text(`${formatPrice(order.tax_price || 0)} `, 150, yPosition);
                yPosition += 6;

                doc.text('Shipping', 25, yPosition);
                doc.text(`${formatPrice(order.shipping_price || 0)} `, 150, yPosition);
                yPosition += 8;

                doc.setFillColor(0, 0, 0);
                doc.rect(20, yPosition, 170, 8, 'F');
                doc.setTextColor(255, 255, 255);
                doc.setFont('helvetica', 'bold');
                doc.text('TOTAL', 25, yPosition + 5);
                doc.text(`${formatPrice(order.total_price)} `, 150, yPosition + 5);

                yPosition += 15;

                // Payment Status
                doc.setTextColor(0, 0, 0);
                doc.setFont('helvetica', 'bold');
                doc.text('PAYMENT STATUS', 20, yPosition);
                yPosition += 6;
                doc.setFont('helvetica', 'normal');
                doc.text(order.paid_at ? `Paid on ${formatDate(order.paid_at)} ` : 'Pending', 20, yPosition);

                // Save PDF
                doc.save(`Invoice - ${order.id.slice(0, 8)}.pdf`);
                toast.success('Invoice downloaded successfully!');
            };

            document.head.appendChild(jsPDFScript);
        } catch (error) {
            console.error('Error downloading invoice:', error);
            toast.error('Failed to download invoice');
        }
    };

    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order.id?.toString().includes(searchTerm) ||
            order.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user_email?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "All" || order.order_status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case "Processing": return "bg-blue-50 text-blue-700 border-blue-200";
            case "Shipped": return "bg-orange-50 text-orange-700 border-orange-200";
            case "Delivered": return "bg-green-50 text-green-700 border-green-200";
            case "Cancelled": return "bg-red-50 text-red-700 border-red-200";
            default: return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    // Derived from server stats
    const orderStats = {
        total: stats?.total || 0,
        processing: stats?.processing || 0,
        shipped: stats?.shipped || 0,
        totalRevenue: stats?.totalRevenue || 0,
    };

    // Reusable Stat Card
    const StatCard = ({ label, value, icon: Icon }) => (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-2xl bg-gray-50 group-hover:bg-black group-hover:text-white transition-colors">
                    <Icon size={24} />
                </div>
            </div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{label}</p>
            <h3 className="text-3xl font-black mt-2 text-black tracking-tight">{value}</h3>
        </div>
    );


    if (initLoading || (loading && orders.length === 0)) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* 1. Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-black tracking-tighter mb-2 uppercase">
                        Order Management
                    </h1>
                    <p className="text-gray-500 font-medium">Track and manage customer orders.</p>
                </div>
            </div>

            {/* 2. Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Total Orders" value={orderStats.total} icon={ShoppingCart} />
                <StatCard label="Revenue" value={formatPrice(orderStats.totalRevenue)} icon={CreditCard} />
                <StatCard label="Processing" value={orderStats.processing} icon={Clock} />
                <StatCard label="Shipped" value={orderStats.shipped} icon={Truck} />
            </div>

            {/* 3. Filters */}
            <div className="bg-white rounded-3xl p-2 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-2">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search Order ID, Customer..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-transparent border-none focus:ring-0 placeholder-gray-400 text-black font-medium"
                    />
                </div>

                {/* Divider */}
                <div className="w-px bg-gray-200 hidden md:block"></div>

                {/* Status Dropdown */}
                <div className="relative min-w-[200px]">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full pl-12 pr-10 py-3 bg-transparent border-none focus:ring-0 font-bold text-gray-700 cursor-pointer appearance-none"
                    >
                        <option value="All">All Status</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
            </div>

            {/* 4. Orders Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Order ID</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Customer</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase">Total</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-bold text-black">#{order.id.slice(0, 8)}...</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                {order.user_avatar?.url ? (
                                                    <img
                                                        src={order.user_avatar.url}
                                                        alt={order.user_name}
                                                        className="h-8 w-8 rounded-full object-cover border border-gray-200"
                                                    />
                                                ) : (
                                                    <div className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">
                                                        {order.user_name?.charAt(0).toUpperCase() || "U"}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-bold text-sm text-gray-900">{order.user_name}</p>
                                                    <p className="text-xs text-gray-500">{order.user_email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                                                <Calendar size={14} />
                                                {formatDate(order.created_at)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="relative inline-block group/select">
                                                <select
                                                    value={order.order_status}
                                                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                    className={`appearance-none pl-3 pr-8 py-1.5 rounded-full text-xs font-bold uppercase border cursor-pointer focus:outline-none focus:ring-2 focus:ring-black ${getStatusColor(order.order_status)}`}
                                                >
                                                    <option value="Processing">Processing</option>
                                                    <option value="Shipped">Shipped</option>
                                                    <option value="Delivered">Delivered</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                </select>
                                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-50" />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <span className="font-black text-black">{formatPrice(order.total_price)}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end">
                                                <button
                                                    onClick={() => {
                                                        setSelectedOrder(order);
                                                        setShowDetailsModal(true);
                                                        loadOrderDetails(order.id);
                                                    }}
                                                    className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye size={20} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <ShoppingCart className="w-12 h-12 text-gray-300 mb-2" />
                                            <p className="text-gray-900 font-bold">No orders found</p>
                                            <p className="text-sm text-gray-500">Try adjusting your filters</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 5. Order Details Modal */}
            {showDetailsModal && selectedOrder && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl animate-in zoom-in-95 overflow-hidden flex flex-col max-h-[90vh]">

                        {/* Modal Header */}
                        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div>
                                <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                                    Order #{selectedOrder.id.slice(0, 8)}
                                    <span className={`px - 3 py - 1 rounded - full text - [10px] border ${getStatusColor(selectedOrder.order_status)} `}>
                                        {selectedOrder.order_status}
                                    </span>
                                </h3>
                                <p className="text-xs text-gray-500 font-bold mt-1 uppercase tracking-wide">
                                    Placed on {formatDate(selectedOrder.created_at)}
                                </p>
                            </div>
                            <button onClick={() => setShowDetailsModal(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8 overflow-y-auto space-y-8">

                            {/* 3-Column Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                                {/* Customer */}
                                <div className="space-y-3">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                        <User size={14} /> Customer
                                    </p>
                                    <div>
                                        <p className="font-bold text-black">{selectedOrder.user_name}</p>
                                        <p className="text-sm text-gray-500 break-words">{selectedOrder.user_email}</p>
                                    </div>
                                </div>

                                {/* Payment */}
                                <div className="space-y-3">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                        <CreditCard size={14} /> Payment
                                    </p>
                                    <div>
                                        <p className={`text - sm font - bold ${selectedOrder.paid_at ? 'text-green-600' : 'text-red-600'} `}>
                                            {selectedOrder.paid_at ? "Paid via Card" : "Payment Pending"}
                                        </p>
                                        {selectedOrder.paid_at && (
                                            <p className="text-xs text-gray-400">{formatDate(selectedOrder.paid_at)}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Shipping */}
                                <div className="space-y-3">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                        <Truck size={14} /> Shipping
                                    </p>
                                    <div>
                                        <p className="font-bold text-black">Standard Delivery</p>
                                        <p className="text-sm text-gray-500">{formatPrice(selectedOrder.shipping_price || 0)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="border-t border-b border-gray-100 py-6">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Package size={14} /> Order Items ({orderItems.length})
                                </p>

                                {loadingItems ? (
                                    <div className="flex items-center justify-center py-8">
                                        <Loader className="w-6 h-6 animate-spin text-gray-400" />
                                    </div>
                                ) : orderItems.length > 0 ? (
                                    <div className="space-y-3">
                                        {orderItems.map((item, index) => (
                                            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                                <div className="w-8 h-8 rounded-lg bg-black/5 flex items-center justify-center flex-shrink-0">
                                                    <Package className="w-4 h-4 text-gray-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-bold text-sm text-black">{item.product_name || 'Product'}</p>
                                                    <p className="text-xs text-gray-500">Quantity: {item.quantity} × {formatPrice(item.price)}</p>
                                                </div>
                                                <p className="font-bold text-black">{formatPrice(item.price * item.quantity)}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-400">
                                        <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                        <p className="text-sm">No items found</p>
                                    </div>
                                )}
                            </div>

                            {/* Order Summary */}
                            <div className="border-b border-gray-100 pb-6">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <CreditCard size={14} /> Order Summary
                                </p>

                                {/* Financial Breakdown */}
                                <div className="bg-gray-50 rounded-xl p-6 space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 font-medium">Subtotal</span>
                                        <span className="font-bold">{formatPrice(selectedOrder.items_price || 0)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 font-medium">Tax</span>
                                        <span className="font-bold">{formatPrice(selectedOrder.tax_price || 0)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 font-medium">Shipping</span>
                                        <span className="font-bold">{formatPrice(selectedOrder.shipping_price || 0)}</span>
                                    </div>
                                    <div className="pt-4 mt-2 border-t border-gray-200 flex justify-between items-center">
                                        <span className="font-black text-lg">Total</span>
                                        <span className="font-black text-2xl text-black">{formatPrice(selectedOrder.total_price)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3 justify-between">
                            {selectedOrder.order_status === "Delivered" && (
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="px-6 py-3 font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-2 border-2 border-red-200"
                                >
                                    <Trash2 size={18} /> Delete Order
                                </button>
                            )}
                            {selectedOrder.order_status !== "Delivered" && (
                                <div></div>
                            )}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDetailsModal(false)}
                                    className="px-6 py-3 font-bold text-gray-500 hover:bg-gray-200 rounded-xl transition-colors"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => handleDownloadInvoice(selectedOrder)}
                                    className="px-6 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-900 transition-colors flex items-center gap-2"
                                >
                                    Download Invoice <ArrowUpRight size={16} />
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
                                onClick={handleDeleteOrder}
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
        </div>
    );
};

export default AdminOrders;