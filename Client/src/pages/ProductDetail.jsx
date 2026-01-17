import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Minus, Plus, Star, Check, ChevronRight, SlidersHorizontal, X } from "lucide-react"; // Added Icons
import StockBadge from "../components/ui/StockBadge";
import { formatPrice } from "../utils/currencyFormatter";
import {
  fetchSingleProduct,
  clearProductDetails,
  postReview,
} from "../store/slices/productSlice";
import { addToCart } from "../store/slices/cartSlice";
import { toast } from "react-toastify";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // UI State
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);

  // Review State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  // Data State
  const { productDetails, loading, isPostingReview } = useSelector((state) => state.product);

  // Fetch product details on mount
  useEffect(() => {
    if (id) {
      dispatch(fetchSingleProduct(id));
    }
    return () => {
      dispatch(clearProductDetails());
    };
  }, [dispatch, id]);

  // Set initial image when product loads
  useEffect(() => {
    if (productDetails?.images?.length > 0) {
      setSelectedImage(productDetails.images[0].url);
    }
  }, [productDetails]);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  // Error State
  if (!productDetails) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <h1 className="text-2xl font-bold mb-4 font-sans">Product Not Found</h1>
        <button
          onClick={() => navigate("/products")}
          className="text-black underline hover:text-gray-600"
        >
          Back to Products
        </button>
      </div>
    );
  }

  const product = productDetails;

  // Fallback image logic
  const mainImage =
    selectedImage ||
    (product.images && product.images.length > 0
      ? product.images[0].url
      : "https://via.placeholder.com/500");

  // Price Logic - Parse string to number
  const displayPrice = parseFloat(product.price || 0);



  // ... existing imports

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        quantity: quantity,
        image: mainImage,
        category: product.category,
        stock: product.stock,
      })
    );
    toast.success("Added to cart!");
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    try {
      await dispatch(postReview({ productId: id, rating, comment })).unwrap();
      setShowReviewModal(false);
      setComment("");
      setRating(5);
      // Refresh product data to show new review
      dispatch(fetchSingleProduct(id));
    } catch (error) {
      console.error("Failed to post review:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-black pb-20">
      {/* Top Divider Line */}
      <hr className="border-gray-200" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link
            to="/"
            className="cursor-pointer hover:text-black transition"
          >
            Home
          </Link>
          <ChevronRight size={16} />
          <Link
            to="/products"
            className="cursor-pointer hover:text-black transition"
          >
            Shop
          </Link>
          <ChevronRight size={16} />
          <span className="text-black font-medium truncate">
            {product.name}
          </span>
        </div>

        {/* Hero Section: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 mb-20">
          {/* LEFT: Image Gallery */}
          <div className="flex flex-col-reverse lg:flex-row gap-4">
            {/* Thumbnails (Vertical Strip on Desktop, Horizontal on Mobile) */}
            <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible w-full lg:w-32 shrink-0">
              {product.images && product.images.length > 0
                ? product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img.url)}
                    className={`border rounded-[20px] overflow-hidden bg-[#F0EEED] h-32 w-full lg:h-40 flex items-center justify-center ${selectedImage === img.url
                      ? "border-black"
                      : "border-transparent"
                      }`}
                  >
                    <img
                      src={img.url}
                      alt="thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))
                : // Placeholder thumbnails if no gallery
                [1, 2, 3].map((_, idx) => (
                  <div
                    key={idx}
                    className="bg-[#F0EEED] rounded-[20px] h-32 lg:h-40 w-full"
                  ></div>
                ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 bg-[#F0EEED] rounded-[20px] overflow-hidden aspect-[4/5] relative">
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 z-10">
                {product && <StockBadge stock={product.stock} />}
              </div>
            </div>
          </div>

          {/* RIGHT: Product Details */}
          <div className="flex flex-col">
            <h1 className="text-4xl lg:text-5xl font-extrabold mb-4 uppercase leading-tight font-integral">
              {product.name}
            </h1>

            {/* Ratings */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    fill={
                      i < Math.round(parseFloat(product.ratings || 0))
                        ? "currentColor"
                        : "none"
                    }
                    className={
                      i < Math.round(parseFloat(product.ratings || 0))
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>
              <span className="text-sm">
                {product.ratings || "4.5"}/
                <span className="text-gray-400">5</span>
              </span>
            </div>

            {/* Price Block */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold">
                {formatPrice(displayPrice)}
              </span>
              {/* <span className="text-3xl font-bold text-gray-300 line-through">
                {formatPrice(originalPrice)}
              </span>
              <div className="bg-red-500/10 text-red-500 text-sm font-medium px-4 py-1.5 rounded-full">
                -{discountPercentage}%
              </div> */}
            </div>

            <p className="text-gray-600 leading-relaxed mb-6 border-b border-gray-200 pb-6">
              {product.description ||
                "This graphic t-shirt which is perfect for any occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style."}
            </p>

            {/* Stock Status */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              {product.stock > 0 ? (
                <p className="text-green-600 font-medium">
                  ✓ In Stock
                </p>
              ) : (
                <p className="text-red-600 font-medium">✗ Out of Stock</p>
              )}
            </div>

            {/* Color Selector - Disabled (not in database) */}
            {/* <div className="mb-6 border-b border-gray-200 pb-6">
              <p className="text-gray-600 mb-3 text-sm">Select Colors</p>
              <div className="flex gap-3">
                {colors.map((color, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedColor(color)}
                    className="w-10 h-10 rounded-full flex items-center justify-center relative"
                    style={{ backgroundColor: color }}
                  >
                    {selectedColor === color && (
                      <Check className="text-white" size={16} />
                    )}
                  </button>
                ))}
              </div>
            </div> */}

            {/* Size Selector - Disabled (not in database) */}
            {/* <div className="mb-8 border-b border-gray-200 pb-6">
              <p className="text-gray-600 mb-3 text-sm">Choose Size</p>
              <div className="flex flex-wrap gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-3 rounded-full text-sm font-medium transition-colors ${
                      selectedSize === size
                        ? "bg-black text-white"
                        : "bg-[#F0F0F0] text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div> */}

            {/* Actions: Quantity & Add to Cart */}
            <div className="flex items-center gap-4">
              {/* Quantity Stepper (Pill Shape) */}
              <div className="bg-[#F0F0F0] rounded-full px-4 py-3 flex items-center gap-6 w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="hover:text-black text-gray-800"
                >
                  <Minus size={20} />
                </button>
                <span className="font-medium w-4 text-center">{quantity}</span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                  className="hover:text-black text-gray-800"
                  disabled={quantity >= product.stock}
                >
                  <Plus size={20} />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-black text-white rounded-full py-3.5 font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section (Formerly Tabs) */}
        <div className="mt-16">
          <div className="py-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                All Reviews
                <span className="text-gray-400 text-sm font-normal">
                  ({product.reviews?.length || 0})
                </span>
              </h3>
              <div className="flex gap-2">
                <button className="bg-[#F0F0F0] hover:bg-gray-200 rounded-full w-12 h-12 flex items-center justify-center">
                  <SlidersHorizontal className="w-5 h-5 text-black" />
                </button>
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="bg-black text-white px-6 py-3 rounded-full font-medium text-sm">
                  Write a Review
                </button>
              </div>
            </div>

            {/* Reviews Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((review, i) => (
                  <div
                    key={review.review_id || i}
                    className="border border-gray-200 rounded-[20px] p-6 lg:p-8"
                  >
                    <div className="flex justify-between mb-3">
                      <div className="flex text-yellow-400 gap-1">
                        {[...Array(5)].map((_, starIdx) => (
                          <Star
                            key={starIdx}
                            size={16}
                            fill={
                              starIdx < review.rating ? "currentColor" : "none"
                            }
                            className={
                              starIdx < review.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-bold text-lg">
                        {review.reviewer?.name || "Anonymous"}
                      </h4>
                      <div className="bg-green-500 rounded-full p-[2px]">
                        <Check size={10} className="text-white" />
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                      {review.comment}
                    </p>
                    <p className="text-gray-400 text-xs font-medium">
                      Posted on {new Date().toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-12 text-gray-500">
                  <p>No reviews yet. Be the first to review this product!</p>
                </div>
              )}
            </div>

            {product.reviews && product.reviews.length > 6 && (
              <div className="mt-8 flex justify-center">
                <button className="border border-gray-200 px-8 py-3 rounded-full font-medium hover:bg-gray-50 transition">
                  Load More Reviews
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-[20px] p-8 max-w-lg w-full relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowReviewModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black transition"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-black uppercase mb-6">Write a Review</h2>

            <form onSubmit={handleReviewSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-bold uppercase mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        size={32}
                        className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold uppercase mb-2">Your Review</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience with this product..."
                  className="w-full h-32 p-4 rounded-xl border-2 border-gray-200 focus:border-black outline-none resize-none transition"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isPostingReview}
                className="w-full bg-black text-white py-4 rounded-full font-bold uppercase hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPostingReview ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;