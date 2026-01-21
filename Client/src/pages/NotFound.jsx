import { Link } from "react-router-dom";
import { Home, ShoppingBag } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-3xl w-full text-center">
        {/* 404 */}
        <div className="mb-8">
          <h1 className="text-[8rem] lg:text-[10rem] font-black tracking-tighter leading-none text-black">
            404
          </h1>
        </div>

        {/* Message */}
        <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tight mb-4">
          Page Not Found
        </h2>
        <p className="text-lg text-black/60 mb-12 max-w-xl mx-auto">
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full hover:bg-gray-800 transition font-bold uppercase tracking-wider"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full border-2 border-black hover:bg-black hover:text-white transition font-bold uppercase tracking-wider"
          >
            <ShoppingBag className="w-5 h-5" />
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;