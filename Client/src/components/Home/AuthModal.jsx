import React from "react";
import { Link } from "react-router-dom";

const AuthModal = ({ isOpen, onClose, intendedDestination }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-3xl p-8 lg:p-12 max-w-md w-full relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
                    aria-label="Close modal"
                >
                    <span className="text-2xl font-bold text-black">×</span>
                </button>

                <h2 className="text-3xl lg:text-4xl font-black tracking-tighter uppercase mb-4">
                    Login Required
                </h2>
                <p className="text-black/60 mb-8">
                    Please log in or create an account to access this feature and explore
                    our products.
                </p>

                <div className="flex flex-col gap-4">
                    <Link
                        to={`/auth/login?redirect=${encodeURIComponent(
                            intendedDestination
                        )}`}
                        className="w-full bg-black text-white font-bold py-4 px-8 rounded-pill hover:bg-gray-800 transition text-center uppercase tracking-wider"
                    >
                        Login
                    </Link>
                    <Link
                        to={`/auth/register?redirect=${encodeURIComponent(
                            intendedDestination
                        )}`}
                        className="w-full bg-white text-black font-bold py-4 px-8 rounded-pill border-2 border-black hover:bg-black hover:text-white transition text-center uppercase tracking-wider"
                    >
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
