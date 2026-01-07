import axios from "./axios.js";

const API_URL = "/api/v1/orders";

// Create a new order
export const createOrderAPI = async (orderData) => {
  try {
    const response = await axios.post(`${API_URL}/create`, orderData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get all orders for current user
export const getUserOrdersAPI = async () => {
  try {
    const response = await axios.get(`${API_URL}/my-orders`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get single order by ID
export const getOrderByIdAPI = async (orderId) => {
  try {
    const response = await axios.get(`${API_URL}/${orderId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Cancel an order
export const cancelOrderAPI = async (orderId) => {
  try {
    const response = await axios.put(`${API_URL}/${orderId}/cancel`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Admin: Get all orders
export const getAllOrdersAPI = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Admin: Update order status
export const updateOrderStatusAPI = async (orderId, status) => {
  try {
    const response = await axios.put(`${API_URL}/${orderId}/status`, { status });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Admin: Get order statistics
export const getOrderStatsAPI = async () => {
  try {
    const response = await axios.get(`${API_URL}/stats/overview`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
