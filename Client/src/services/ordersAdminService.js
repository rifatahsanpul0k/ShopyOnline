import axiosInstance from "../lib/axios";

// Get all orders (Admin)
export const fetchAllOrders = async () => {
    const response = await axiosInstance.get("/order/admin/getall");
    return response.data;
};

// Update order status (Admin)
export const updateOrderStatus = async (orderId, orderStatus) => {
    const response = await axiosInstance.put(`/order/admin/update/${orderId}`, {
        order_status: orderStatus,
    });
    return response.data;
};

// Get order statistics (Admin)
export const fetchOrderStats = async () => {
    const response = await axiosInstance.get("/order/stats/overview");
    return response.data;
};