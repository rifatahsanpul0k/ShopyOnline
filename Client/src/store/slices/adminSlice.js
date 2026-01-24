import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchDashboardStats, fetchAllUsers, deleteUser } from "../../services/adminService";
import { fetchAllOrders, fetchOrderStats, updateOrderStatus, deleteOrderAPI } from "../../services/ordersAdminService";
import { toast } from "react-toastify";

// Fetch dashboard stats
export const getDashboardStats = createAsyncThunk(
    "admin/getDashboardStats",
    async (_, thunkAPI) => {
        try {
            const data = await fetchDashboardStats();
            return data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch dashboard stats");
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to fetch dashboard stats"
            );
        }
    }
);

// Fetch all users
export const getAllUsers = createAsyncThunk(
    "admin/getAllUsers",
    async (page, thunkAPI) => {
        try {
            const data = await fetchAllUsers(page);
            return data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch users");
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to fetch users"
            );
        }
    }
);

// Delete user
export const removeUser = createAsyncThunk(
    "admin/removeUser",
    async (userId, thunkAPI) => {
        try {
            const data = await deleteUser(userId);
            toast.success(data.message || "User deleted successfully");
            return { userId, ...data };
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete user");
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to delete user"
            );
        }
    }
);

// Fetch all orders (Admin)
export const fetchAdminOrders = createAsyncThunk(
    "admin/fetchAdminOrders",
    async (_, thunkAPI) => {
        try {
            const data = await fetchAllOrders();
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to load orders"
            );
        }
    }
);

// Fetch order stats (Admin)
export const fetchAdminOrderStats = createAsyncThunk(
    "admin/fetchAdminOrderStats",
    async (_, thunkAPI) => {
        try {
            const data = await fetchOrderStats();
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to load order stats"
            );
        }
    }
);

// Update order status
export const updateAdminOrderStatus = createAsyncThunk(
    "admin/updateAdminOrderStatus",
    async ({ orderId, status }, thunkAPI) => {
        try {
            const data = await updateOrderStatus(orderId, status);
            toast.success(`Order #${orderId} marked as ${status}`);
            return { orderId, status, ...data };
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update status");
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to update status"
            );
        }
    }
);

// Delete order
export const deleteAdminOrder = createAsyncThunk(
    "admin/deleteAdminOrder",
    async (orderId, thunkAPI) => {
        try {
            await deleteOrderAPI(orderId);
            toast.success("Order deleted successfully");
            return orderId;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete order");
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to delete order"
            );
        }
    }
);

const adminSlice = createSlice({
    name: "admin",
    initialState: {
        loading: false,
        statsLoading: false,
        usersLoading: false,
        ordersLoading: false,
        stats: null,
        orderStats: null,
        users: [],
        orders: [],
        totalUsers: 0,
        currentPage: 1,
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Get dashboard stats
        builder
            .addCase(getDashboardStats.pending, (state) => {
                state.statsLoading = true;
                state.error = null;
            })
            .addCase(getDashboardStats.fulfilled, (state, action) => {
                state.statsLoading = false;
                state.stats = action.payload;
            })
            .addCase(getDashboardStats.rejected, (state, action) => {
                state.statsLoading = false;
                state.error = action.payload;
            });

        // Get all users
        builder
            .addCase(getAllUsers.pending, (state) => {
                state.usersLoading = true;
                state.error = null;
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.usersLoading = false;
                state.users = action.payload.users || [];
                state.totalUsers = action.payload.totalUsers || 0;
                state.currentPage = action.payload.currentPage || 1;
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.usersLoading = false;
                state.error = action.payload;
            });

        // Delete user
        builder
            .addCase(removeUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users = state.users.filter((user) => user.id !== action.payload.userId);
                state.totalUsers -= 1;
            })
            .addCase(removeUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // --- Orders Reducers ---

        // Fetch All Orders
        builder
            .addCase(fetchAdminOrders.pending, (state) => {
                state.ordersLoading = true;
                state.error = null;
            })
            .addCase(fetchAdminOrders.fulfilled, (state, action) => {
                state.ordersLoading = false;
                state.orders = action.payload.orders || [];
            })
            .addCase(fetchAdminOrders.rejected, (state, action) => {
                state.ordersLoading = false;
                state.error = action.payload;
            });

        // Fetch Order Stats
        builder
            .addCase(fetchAdminOrderStats.fulfilled, (state, action) => {
                state.orderStats = action.payload.stats;
            });

        // Update Order Status
        builder.addCase(updateAdminOrderStatus.fulfilled, (state, action) => {
            const { orderId, status } = action.payload;
            const orderIndex = state.orders.findIndex((o) => o.id === orderId);
            if (orderIndex !== -1) {
                state.orders[orderIndex].order_status = status;
            }
        });

        // Delete Order
        builder.addCase(deleteAdminOrder.fulfilled, (state, action) => {
            state.orders = state.orders.filter((order) => order.id !== action.payload);
        });
    },
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;