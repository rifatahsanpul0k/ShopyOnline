import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/auth/register", data);
      toast.success(res.data.message || "Account created successfully!");
      return res.data;
    } catch (error) {
      // Error is handled by axios interceptor
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/auth/login", data);
      toast.success(res.data.message || "Login successful!");
      return res.data;
    } catch (error) {
      // Error is handled by axios interceptor
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

export const getUser = createAsyncThunk("auth/getUser", async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (error) {
    // Silently fail - user is just not authenticated
    // Don't show error toast on initial page load
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Not authenticated"
    );
  }
});

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/auth/logout");
      toast.success(res.data.message || "Logged out successfully");
      return null;
    } catch (error) {
      // Error is handled by axios interceptor
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Logout failed"
      );
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/password/forgot",
  async (email, thunkAPI) => {
    try {
      const frontendUrl = window.location.origin;
      const res = await axiosInstance.post(
        `/auth/password/forgot?frontendUrl=${frontendUrl}`,
        { email }
      );
      toast.success(res.data.message || "Reset link sent to your email");
      return res.data;
    } catch (error) {
      // Error is handled by axios interceptor
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to send reset email"
      );
    }
  }
);
export const resetPassword = createAsyncThunk(
  "auth/password/reset",
  async ({ token, password, confirmPassword }, thunkAPI) => {
    try {
      const res = await axiosInstance.put(`/auth/password/reset/${token}`, {
        password,
        confirmPassword,
      });
      toast.success(res.data.message || "Password reset successful!");
      return res.data.user;
    } catch (error) {
      // Error is handled by axios interceptor
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Password reset failed"
      );
    }
  }
);
export const updateProfile = createAsyncThunk(
  "auth/profile/update",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.put("/auth/profile/update", data);
      toast.success(res.data.message || "Profile updated successfully!");
      return res.data.user;
    } catch (error) {
      // Error is handled by axios interceptor
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Profile update failed"
      );
    }
  }
);
export const updatePassword = createAsyncThunk(
  "auth/password/update",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.put("/auth/password/update", data);
      toast.success(res.data.message || "Password updated successfully!");
      return null;
    } catch (error) {
      // Error is handled by axios interceptor
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Password update failed"
      );
    }
  }
);
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isUpdatingPassword: false,
    isRequestingForToken: false,
    isCheckingAuth: true,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.authUser = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.authUser = null;
    },
    checkAuth: (state) => {
      state.isCheckingAuth = false;
    },
  },
  //9H:51
  extraReducers: (builder) => {
    builder
      // Register User
      .addCase(registerUser.pending, (state) => {
        state.isSigningUp = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isSigningUp = false;
        // Do not auto-login after registration as per requirement
        // state.user = action.payload.user;
        // state.authUser = action.payload.user;
        // if (action.payload.token) {
        //   localStorage.setItem("token", action.payload.token);
        // }
      })
      .addCase(registerUser.rejected, (state) => {
        state.isSigningUp = false;
      })
      // Login User
      .addCase(loginUser.pending, (state) => {
        state.isLoggingIn = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoggingIn = false;
        state.user = action.payload.user;
        state.authUser = action.payload.user;
        if (action.payload.token) {
          localStorage.setItem("token", action.payload.token);
        }
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoggingIn = false;
      })
      // Get User
      .addCase(getUser.pending, (state) => {
        state.isCheckingAuth = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isCheckingAuth = false;
        state.user = action.payload.user;
        state.authUser = action.payload.user;
      })
      .addCase(getUser.rejected, (state) => {
        state.isCheckingAuth = false;
        state.user = null;
        state.authUser = null;
      })
      // Logout User
      .addCase(logoutUser.pending, (state) => {
        state.isLoggingIn = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoggingIn = false;
        state.user = null;
        state.authUser = null;
        localStorage.removeItem("token");
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isLoggingIn = false;
      })
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.isRequestingForToken = true;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isRequestingForToken = false;
      })
      .addCase(forgotPassword.rejected, (state) => {
        state.isRequestingForToken = false;
      })
      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.isUpdatingPassword = true;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isUpdatingPassword = false;
        state.user = action.payload;
        state.authUser = action.payload;
      })
      .addCase(resetPassword.rejected, (state) => {
        state.isUpdatingPassword = false;
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.isUpdatingProfile = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isUpdatingProfile = false;
        state.user = action.payload;
        state.authUser = action.payload;
      })
      .addCase(updateProfile.rejected, (state) => {
        state.isUpdatingProfile = false;
      })
      // Update Password
      .addCase(updatePassword.pending, (state) => {
        state.isUpdatingPassword = true;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.isUpdatingPassword = false;
      })
      .addCase(updatePassword.rejected, (state) => {
        state.isUpdatingPassword = false;
      });
  },
});

export const { setUser, logout, checkAuth } = authSlice.actions;

export default authSlice.reducer;