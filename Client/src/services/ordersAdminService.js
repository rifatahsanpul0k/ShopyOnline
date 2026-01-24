import { axiosInstance } from "../lib/axios";

// Fetch order stats
export const fetchOrderStats = async () => {
    try {
        const response = await axiosInstance.get("/order/admin/stats");
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};


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
// export const fetchOrderStats = async () => {
//     const response = await axiosInstance.get("/order/stats/overview");
//     return response.data;
// };

// Delete an order (Admin)
export const deleteOrderAPI = async (orderId) => {
    const response = await axiosInstance.delete(`/order/admin/delete/${orderId}`);
    return response.data;
};


// Get single order with items (Admin)
export const fetchOrderDetails = async (orderId) => {
    const response = await axiosInstance.get(`/order/${orderId}`);
    return response.data;
};