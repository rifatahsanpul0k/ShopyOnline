import React from "react";
import { ArrowRight } from "lucide-react";

const CategoryGrid = ({ categories, onCategoryClick }) => {
    return (
        <section className="py-24 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage:
                            "repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)",
                    }}
                ></div>
            </div>

            <div className="max-w-[1440px] mx-auto px-6 relative z-10">
                <div className="text-center mb-12">
                    <h2 className="text-5xl lg:text-6xl font-black tracking-tighter uppercase mb-3">
                        Shop by Category
                    </h2>
                    <p className="text-lg text-white/70 max-w-2xl mx-auto">
                        Explore our curated collections of premium tech products
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {categories.map((cat, i) => (
                        <button
                            key={i}
                            onClick={() => onCategoryClick(cat.slug)}
                            className="relative h-[280px] overflow-hidden group cursor-pointer rounded-xl border-2 border-white/10 hover:border-white/40 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl"
                        >
                            {/* Image Background */}
                            <div className="absolute inset-0">
                                <img
                                    src={cat.image}
                                    alt={cat.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                                />
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500"></div>
                            </div>

                            {/* Content */}
                            <div className="absolute inset-0 flex flex-col items-center justify-end p-6 text-center">
                                {/* Category Name */}
                                <h3 className="text-2xl font-black uppercase tracking-tighter mb-2 transform group-hover:-translate-y-1 transition-transform duration-500">
                                    {cat.name}
                                </h3>

                                {/* Description */}
                                <p className="text-xs text-white/80 mb-3 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                                    {cat.description}
                                </p>

                                {/* Arrow */}
                                <div className="flex items-center gap-2 text-xs font-bold opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500 delay-75">
                                    <span>EXPLORE</span>
                                    <ArrowRight className="w-3 h-3 animate-pulse" />
                                </div>
                            </div>

                            {/* Corner Accent */}
                            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 transform translate-x-10 -translate-y-10 rotate-45 group-hover:translate-x-8 group-hover:-translate-y-8 transition-transform duration-500"></div>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoryGrid;
