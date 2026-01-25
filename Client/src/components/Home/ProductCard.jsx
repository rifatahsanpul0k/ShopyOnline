import React from "react";
import { Link } from "react-router-dom";
import { Star, ShoppingBag } from "lucide-react";
import { formatPrice } from "../../utils/currencyFormatter";
import StockBadge from "../ui/StockBadge";

const ProductCard = ({ product, onProtectedNavigation }) => {
    // Parse images if it's a string
    const images =
        typeof product.images === "string"
            ? JSON.parse(product.images)
            : product.images;
    const productImage =
        images && images.length > 0 ? images[0].url : "/img2.png";

    return (
        <Link
            to={`/product/${product.id}`}
            onClick={onProtectedNavigation}
            className="group border-b-2 border-transparent hover:border-black transition-all pb-6 flex-shrink-0 snap-start"
            style={{ width: "300px" }}
        >
            <div className="h-64 overflow-hidden mb-6 bg-gray-50 flex items-center justify-center p-4 relative">
                <img
                    src={productImage}
                    alt={product.name}
                    className={`w-full h-full object-contain transition-all duration-500 ${product.stock === 0 ? "grayscale" : ""
                        }`}
                />
                <StockBadge stock={product.stock || 0} />
            </div>
            <h3 className="font-bold text-lg leading-tight mb-3 uppercase tracking-tight line-clamp-2">
                {product.name}
            </h3>
            <div className="space-y-1 mb-4">
                <p className="text-[11px] text-black/50 font-medium uppercase tracking-wider">
                    — {product.category}
                </p>
            </div>
            {/* Rating Stars */}
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
                        ({product.review_count} reviews)
                    </span>
                )}
            </div>
            <div className="flex items-center justify-between">
                <span className="text-2xl font-black">{formatPrice(product.price)}</span>
                <button className="bg-black text-white p-3 rounded-full hover:bg-gray-800 transition">
                    <ShoppingBag className="w-5 h-5" />
                </button>
            </div>
        </Link>
    );
};

export default ProductCard;
