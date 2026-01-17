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

// Post a product review
export const postReview = createAsyncThunk(
  "product/postReview",
  async ({ productId, rating, comment }, thunkAPI) => {
    try {
      const res = await axiosInstance.put(
        `/product/post-new/review/${productId}`,
        { rating, comment }
      );
      toast.success("Review submitted successfully");
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to post review");
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to post review"
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
        // Ensure reviews are parsed if they are strings (based on how other JSON fields were handled)
        if (state.productDetails && typeof state.productDetails.reviews === 'string') {
          try {
            state.productDetails.reviews = JSON.parse(state.productDetails.reviews);
          } catch (e) {
            state.productDetails.reviews = [];
          }
        }
      })
      .addCase(fetchSingleProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.productDetails = null;
      })

      // Post Review
      .addCase(postReview.pending, (state) => {
        state.isPostingReview = true;
        state.error = null;
      })
      .addCase(postReview.fulfilled, (state, action) => {
        state.isPostingReview = false;
        // Update product details with new review info
        if (state.productDetails && state.productDetails.id === action.payload.product.id) {
          state.productDetails.ratings = action.payload.product.ratings;
          // Optimistically add the new review or replace if it exists
          const review = action.payload.review;
          // Since backend returns reviews as part of product, we might need a better way, 
          // but for now we can rely on re-fetching or manual update if structure matches.
          // The best way is to re-fetch the single product to get the full updated list including the new one.
        }
      })
      .addCase(postReview.rejected, (state, action) => {
        state.isPostingReview = false;
        state.error = action.payload;
      });
  },
});

export const { clearProductDetails } = productSlice.actions;
export default productSlice.reducer;