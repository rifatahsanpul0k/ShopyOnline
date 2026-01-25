import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

const HeroSlider = ({ slides, totalProducts, onProtectedNavigation }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-advance slider
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(timer);
    }, [slides.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    return (
        <section className="relative overflow-hidden h-[100vh] min-h-[700px]">
            {/* Background Image */}
            <div className="absolute inset-0">
                <img
                    src={slides[currentSlide].image}
                    alt={slides[currentSlide].title}
                    className="w-full h-full object-cover transition-all duration-1000"
                />
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/70"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex items-center">
                <div className="max-w-[1440px] mx-auto px-6 lg:px-12 w-full">
                    <div className="max-w-3xl">
                        {/* Slide Number */}
                        <div className="flex items-center gap-4 mb-8">
                            <div className="text-white/40 text-sm font-black">
                                0{currentSlide + 1}
                            </div>
                            <div className="w-16 h-px bg-white/20"></div>
                            <div className="text-white/40 text-sm font-black">
                                0{slides.length}
                            </div>
                        </div>

                        {/* Main Title */}
                        <h1 className="text-6xl lg:text-8xl xl:text-9xl font-black text-white tracking-tighter uppercase leading-[0.9] mb-8">
                            {slides[currentSlide].title}
                        </h1>

                        {/* Subtitle */}
                        <p className="text-xl lg:text-2xl text-white/80 mb-12 max-w-2xl leading-relaxed">
                            {slides[currentSlide].subtitle}
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap gap-4 mb-16">
                            <Link
                                to={slides[currentSlide].link}
                                onClick={onProtectedNavigation}
                                className="group inline-flex items-center gap-3 bg-white text-black px-10 py-5 rounded-full hover:bg-black hover:text-white border-2 border-white transition-all font-bold uppercase tracking-wider"
                            >
                                {slides[currentSlide].cta}
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                to="/products"
                                onClick={onProtectedNavigation}
                                className="inline-flex items-center gap-3 bg-transparent text-white px-10 py-5 rounded-full border-2 border-white hover:bg-white hover:text-black transition-all font-bold uppercase tracking-wider"
                            >
                                View All Products
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-12 pt-8 border-t-2 border-white/20">
                            <div>
                                <h3 className="text-5xl font-black text-white mb-2">
                                    {totalProducts || 0}+
                                </h3>
                                <p className="text-white/60 text-xs font-bold uppercase tracking-widest">
                                    Products
                                </p>
                            </div>
                            <div>
                                <h3 className="text-5xl font-black text-white mb-2">24/7</h3>
                                <p className="text-white/60 text-xs font-bold uppercase tracking-widest">
                                    Support
                                </p>
                            </div>
                            <div>
                                <h3 className="text-5xl font-black text-white mb-2">100%</h3>
                                <p className="text-white/60 text-xs font-bold uppercase tracking-widest">
                                    Secure
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Slider Navigation */}
            <div className="absolute bottom-12 right-12 z-20 flex items-center gap-4">
                <button
                    onClick={prevSlide}
                    className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm text-white border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all"
                    aria-label="Previous slide"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>

                <div className="flex gap-2">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`h-2 rounded-full transition-all ${index === currentSlide
                                    ? "w-12 bg-white"
                                    : "w-2 bg-white/30 hover:bg-white/60"
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>

                <button
                    onClick={nextSlide}
                    className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm text-white border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all"
                    aria-label="Next slide"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-12 left-12 z-20 flex flex-col items-center gap-3">
                <span className="text-white/60 text-xs font-bold uppercase tracking-wider transform -rotate-90 origin-center translate-x-4">
                    Scroll
                </span>
                <div className="w-px h-16 bg-white/20 relative overflow-hidden">
                    <div className="w-full h-8 bg-white/60 animate-pulse"></div>
                </div>
            </div>
        </section>
    );
};

export default HeroSlider;
