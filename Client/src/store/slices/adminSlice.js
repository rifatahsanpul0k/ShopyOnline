import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchDashboardStats, fetchAllUsers, deleteUser } from "../../services/adminService";
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

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    loading: false,
    statsLoading: false,
    usersLoading: false,
    stats: null,
    users: [],
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
  },
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;
