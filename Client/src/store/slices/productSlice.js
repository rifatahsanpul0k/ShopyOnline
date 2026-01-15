import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

// Fetch all products with filters
export const fetchAllProducts = createAsyncThunk(
  "product/fetchAllProducts",
  async (params = {}, thunkAPI) => {
    try {
      const queryParams = new URLSearchParams();

      // Add filters to query params
      if (params.availability)
        queryParams.append("availability", params.availability);
      if (params.price) queryParams.append("price", params.price);
      if (params.category) queryParams.append("category", params.category);
      if (params.ratings) queryParams.append("ratings", params.ratings);
      if (params.search) queryParams.append("search", params.search);
      if (params.page) queryParams.append("page", params.page);

      const res = await axiosInstance.get(`/product?${queryParams.toString()}`);
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch products");
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

// Fetch single product by ID
export const fetchSingleProduct = createAsyncThunk(
  "product/fetchSingleProduct",
  async (productId, thunkAPI) => {
    try {
      const res = await axiosInstance.get(
        `/product/singleProduct/${productId}`
      );
      return res.data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch product details"
      );
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch product details"
      );
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    loading: false,
    products: [],
    productDetails: null,
    totalProducts: 0,
    topRatedProducts: [],
    newProducts: [],
    aiSearching: false,
    isReviewDeleting: false,
    isPostingReview: false,
    productReviews: [],
    error: null,
  },
  reducers: {
    clearProductDetails: (state) => {
      state.productDetails = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all products
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products || [];
        state.totalProducts = action.payload.totalProducts || 0;
        state.newProducts = action.payload.newProducts || [];
        state.topRatedProducts = action.payload.topRatedProducts || [];
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch single product
    builder
      .addCase(fetchSingleProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSingleProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.productDetails = action.payload.product || null;
      })
      .addCase(fetchSingleProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.productDetails = null;
      });
  },
});

export const { clearProductDetails } = productSlice.actions;
export default productSlice.reducer;
