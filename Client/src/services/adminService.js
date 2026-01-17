import { axiosInstance } from "../lib/axios";

// Fetch dashboard stats
export const fetchDashboardStats = async () => {
    const response = await axiosInstance.get("/admin/fetch/dashboard-stats");
    return response.data;
};

// Fetch all users
export const fetchAllUsers = async (page = 1) => {
    const response = await axiosInstance.get(`/admin/getallusers?page=${page}`);
    return response.data;
};

// Delete user
export const deleteUser = async (userId) => {
    const response = await axiosInstance.delete(`/admin/delete/${userId}`);
    return response.data;
};