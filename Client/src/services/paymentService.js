import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";

export const createPaymentIntentAPI = async (orderId, amount) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
            `${API_URL}/payment/create-payment-intent`,
            { orderId, amount },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || {
            success: false,
            message: "Failed to create payment intent",
        };
    }
};

export const updatePaymentStatusAPI = async (orderId, paymentStatus) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.put(
            `${API_URL}/payment/update-status/${orderId}`,
            { paymentStatus },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || {
            success: false,
            message: "Failed to update payment status",
        };
    }
};
