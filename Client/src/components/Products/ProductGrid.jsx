import React from "react";
import { Link } from "react-router-dom";
import { Star, ShoppingBag } from "lucide-react";
import { formatPrice } from "../../utils/currencyFormatter";
import StockBadge from "../ui/StockBadge";

const ProductGrid = ({ products, viewMode, loading, onAddToCart }) => {
    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-black"></div>
            </div>
        );
    }

    if (!products || products.length === 0) {
        return (
            <div className="text-center py-24">
                <p className="text-2xl font-bold text-black/40 mb-2">No products found</p>
                <p className="text-black/60">Try adjusting your filters</p>
            </div>
        );
    }

    return (
        <div
            className={
                viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                    : "flex flex-col gap-8"
            }
        >
            {products.map((product) => {
                // Parse images if it's a string
                const images =
                    typeof product.images === "string"
                        ? JSON.parse(product.images)
                        : product.images;
                const productImage =
                    images && images.length > 0 ? images[0].url : "/img2.png";

                return (
                    <Link
                        key={product.id}
                        to={`/product/${product.id}`}
                        className={
                            viewMode === "grid"
                                ? "group border-b-2 border-transparent hover:border-black transition-all pb-6"
                                : "group flex gap-6 border-b-2 border-black/10 hover:border-black transition-all pb-6"
                        }
                    >
                        {/* Image */}
                        <div
                            className={
                                viewMode === "grid"
                                    ? "relative h-64 overflow-hidden mb-6 bg-gray-50 flex items-center justify-center p-4 rounded-2xl"
                                    : "relative w-48 h-48 flex-shrink-0 overflow-hidden bg-gray-50 flex items-center justify-center p-4 rounded-2xl"
                            }
                        >
                            <img
                                src={productImage}
                                alt={product.name}
                                className={`w-full h-full object-contain transition-all duration-500 group-hover:scale-105 ${product.stock === 0 ? "grayscale" : ""
                                    }`}
                            />

                            {/* Badges */}
                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                                <StockBadge stock={product.stock} />
                            </div>

                            {/* Quick Add Button (Grid View Only) */}
                            {viewMode === "grid" && (
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onAddToCart(product, productImage);
                                    }}
                                    className="absolute bottom-4 right-4 bg-black text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg"
                                    title="Add to Cart"
                                >
                                    <ShoppingBag className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        {/* Details */}
                        <div
                            className={
                                viewMode === "list"
                                    ? "flex-1 flex flex-col justify-between"
                                    : ""
                            }
                        >
                            <div>
                                {/* Category */}
                                <p className="text-xs text-black/40 font-bold uppercase tracking-widest mb-2">
                                    {product.category}
                                </p>

                                {/* Title */}
                                <h3
                                    className={
                                        viewMode === "grid"
                                            ? "font-bold text-lg leading-tight mb-3 uppercase tracking-tight line-clamp-2 group-hover:text-black/70 transition"
                                            : "font-bold text-xl leading-tight mb-3 uppercase tracking-tight group-hover:text-black/70 transition"
                                    }
                                >
                                    {product.name}
                                </h3>

                                {/* Description (List View Only) */}
                                {viewMode === "list" && product.description && (
                                    <p className="text-sm text-black/60 mb-4 line-clamp-2">
                                        {product.description}
                                    </p>
                                )}

                                {/* Rating */}
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${i < Math.floor(product.ratings || 0)
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-gray-300"
                                                }`}
                                        />
                                    ))}
                                    <span className="text-sm text-black/60 ml-1">
                                        ({product.ratings ? Number(product.ratings).toFixed(1) : "0.0"})
                                    </span>
                                    {product.review_count && (
                                        <span className="text-xs text-black/40 ml-1">
                                            ({product.review_count})
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Price & Actions */}
                            <div
                                className={
                                    viewMode === "list"
                                        ? "flex items-center justify-between"
                                        : "flex items-center justify-between"
                                }
                            >
                                <span className="text-2xl font-black">
                                    {formatPrice(product.price)}
                                </span>

                                {/* Add to Cart Button (List View) */}
                                {viewMode === "list" && (
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            onAddToCart(product, productImage);
                                        }}
                                        className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition font-bold uppercase tracking-wider text-sm flex items-center gap-2"
                                    >
                                        <ShoppingBag className="w-4 h-4" />
                                        Add to Cart
                                    </button>
                                )}
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
};

export default ProductGrid;
