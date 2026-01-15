import { axiosInstance } from "../lib/axios";

// Get all products (Admin)
export const fetchAllProductsAdmin = async () => {
  const response = await axiosInstance.get("/product");
  return response.data;
};

// Create product (Admin) - Handles FormData with images
export const createProduct = async (productData) => {
  const response = await axiosInstance.post("/product/admin/create", productData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Update product (Admin) - Handles FormData with images
export const updateProduct = async (productId, productData) => {
  const response = await axiosInstance.put(
    `/product/admin/update/${productId}`,
    productData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

// Delete product (Admin)
export const deleteProduct = async (productId) => {
  const response = await axiosInstance.delete(`/product/admin/delete/${productId}`);
  return response.data;
};
