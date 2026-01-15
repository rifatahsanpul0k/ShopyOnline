import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { formatPrice } from "../utils/currencyFormatter";
import {
  fetchSingleProduct,
  clearProductDetails,
} from "../store/slices/productSlice";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const { productDetails, loading } = useSelector((state) => state.product);

  // Fetch product details on mount
  useEffect(() => {
    if (id) {
      dispatch(fetchSingleProduct(id));
    }

    // Cleanup on unmount
    return () => {
      dispatch(clearProductDetails());
    };
  }, [dispatch, id]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  // Show error state if product not found
  if (!productDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <button
            onClick={() => navigate("/products")}
            className="text-red-500 hover:text-red-600"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const product = productDetails;

  // Get first image from images array or use placeholder
  const productImage =
    product.images && product.images.length > 0
      ? product.images[0].url
      : "https://via.placeholder.com/500";

  // Convert price back to display format (multiply by 122)
  const displayPrice = product.price * 122;

  const handleAddToCart = () => {
    // Dispatch add to cart action
    console.log("Add to cart:", { product, quantity });
    alert("Product added to cart!");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/products")}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Back to Products
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="bg-white p-8 rounded-lg shadow">
            <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
              <img
                src={productImage}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>
                      {i < Math.round(product.ratings || 0) ? "★" : "☆"}
                    </span>
                  ))}
                </div>
                <span className="text-gray-600">
                  ({product.reviews?.length || 0} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                <span className="text-4xl font-bold text-red-500">
                  {formatPrice(displayPrice)}
                </span>
              </div>
              {product.stock > 0 ? (
                <p className="text-green-600 font-medium">
                  In Stock - {product.stock} available
                </p>
              ) : (
                <p className="text-red-600 font-medium">Out of Stock</p>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>

            {/* Quantity Selector */}
            <div>
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <div className="flex items-center border rounded w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-100"
                >
                  <Minus size={20} />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="w-16 text-center border-l border-r focus:outline-none"
                />
                <button
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                  className="p-2 hover:bg-gray-100"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full px-6 py-3 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <ShoppingCart size={20} />
                <span>Add to Cart</span>
              </button>
              <button
                onClick={() => navigate("/checkout")}
                className="w-full px-6 py-3 border-2 border-red-500 text-red-500 rounded hover:bg-red-50"
              >
                Buy Now
              </button>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t">
              <div className="text-center p-4 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">Free Shipping</p>
                <p className="font-semibold">On orders over $25</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">Easy Returns</p>
                <p className="font-semibold">30-day return policy</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <section className="mt-20">
          <h2 className="text-2xl font-bold mb-8">Related Products</h2>
          <p className="text-gray-600">
            Related products will be displayed here
          </p>
        </section>
      </div>
    </div>
  );
};

export default ProductDetail;
