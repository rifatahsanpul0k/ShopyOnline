import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Headphones } from "lucide-react";
import axiosInstance from "../lib/axios";
import { toast } from "react-toastify";

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await axiosInstance.post("/contact/send", formData);

            if (response.data.success) {
                toast.success(response.data.message);
                // Reset form
                setFormData({
                    name: "",
                    email: "",
                    subject: "",
                    message: "",
                });
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to send message. Please try again.";
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full bg-white text-black">
            {/* Hero Section */}
            <section className="relative py-32 px-6 lg:px-12 bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)',
                    }}></div>
                </div>

                <div className="max-w-[1440px] mx-auto relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full mb-8">
                            <Headphones className="w-5 h-5" />
                            <span className="text-sm font-bold uppercase tracking-wider">24/7 Support</span>
                        </div>
                        <h1 className="text-6xl lg:text-8xl font-black tracking-tighter uppercase mb-6 leading-[0.9]">
                            Let's Talk
                        </h1>
                        <p className="text-xl text-white/80 leading-relaxed">
                            Have questions? We're here to help. Drop us a message and our team will get back to you within 24 hours.
                        </p>
                    </div>
                </div>

                <div className="absolute -right-20 top-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute -left-20 bottom-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
            </section>

            {/* Contact Info & Form Section */}
            <section className="py-24 px-6 lg:px-12 max-w-[1440px] mx-auto">
                {/* Quick Contact Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-20">
                    {[
                        {
                            icon: Mail,
                            title: "Email Us",
                            value: "support@shopyonline.com",
                            link: "mailto:support@shopyonline.com",
                        },
                        {
                            icon: Phone,
                            title: "Call Us",
                            value: "+1 (234) 567-890",
                            link: "tel:+1234567890",
                        },
                        {
                            icon: MapPin,
                            title: "Visit Us",
                            value: "San Francisco, CA",
                            link: null,
                        },
                        {
                            icon: Clock,
                            title: "Work Hours",
                            value: "Mon - Fri: 9AM - 6PM",
                            link: null,
                        },
                    ].map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={idx}
                                className="group relative bg-gradient-to-br from-black to-gray-900 text-white p-8 rounded-3xl hover:scale-105 transition-transform duration-300 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="relative z-10">
                                    <Icon className="w-8 h-8 mb-4" />
                                    <h3 className="text-xs font-black uppercase tracking-wider mb-2 text-white/60">
                                        {item.title}
                                    </h3>
                                    {item.link ? (
                                        <a
                                            href={item.link}
                                            className="text-sm font-bold hover:text-white/80 transition"
                                        >
                                            {item.value}
                                        </a>
                                    ) : (
                                        <p className="text-sm font-bold">{item.value}</p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Left Side - Contact Info */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-2xl lg:text-3xl font-black tracking-tighter uppercase mb-6 leading-tight">
                                Get In Touch With Our Team
                            </h2>
                            <p className="text-black/70 leading-relaxed text-lg">
                                Whether you have a question about products, orders, returns, or anything else, our team is ready to answer all your questions.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-black to-gray-900 text-white p-8 lg:p-10 rounded-3xl">
                            <MessageCircle className="w-12 h-12 mb-6" />
                            <h3 className="text-2xl font-black uppercase tracking-tight mb-4">
                                Live Chat Support
                            </h3>
                            <p className="text-white/80 mb-6 leading-relaxed">
                                Need immediate assistance? Our support team is available 24/7 to help you with any questions or concerns.
                            </p>
                            <Link
                                to="/not-found"
                                className="inline-block bg-white text-black px-8 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-white/90 transition"
                            >
                                Start Chat
                            </Link>
                        </div>

                        <div className="border-2 border-black/10 rounded-3xl p-8">
                            <h3 className="text-xl font-black uppercase tracking-tight mb-4">
                                Our Location
                            </h3>
                            <div className="space-y-2 text-black/70">
                                <p className="font-medium">ShopyOnline Headquarters</p>
                                <p>123 Tech Street</p>
                                <p>San Francisco, CA 94102</p>
                                <p>United States</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div>
                        <div className="bg-white border-2 border-black/10 rounded-3xl p-8 lg:p-10 shadow-xl">
                            <h2 className="text-3xl font-black tracking-tighter uppercase mb-2">
                                Send Message
                            </h2>
                            <p className="text-black/60 mb-8">Fill out the form and we'll be in touch soon.</p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="block text-xs font-black uppercase tracking-wider mb-2 text-black/60"
                                        >
                                            Your Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-5 py-4 border-2 border-black/10 rounded-xl focus:border-black outline-none transition bg-white"
                                            placeholder="John Doe"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="block text-xs font-black uppercase tracking-wider mb-2 text-black/60"
                                        >
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-5 py-4 border-2 border-black/10 rounded-xl focus:border-black outline-none transition bg-white"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="subject"
                                        className="block text-xs font-black uppercase tracking-wider mb-2 text-black/60"
                                    >
                                        Subject *
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-5 py-4 border-2 border-black/10 rounded-xl focus:border-black outline-none transition bg-white"
                                        placeholder="How can we help you?"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="message"
                                        className="block text-xs font-black uppercase tracking-wider mb-2 text-black/60"
                                    >
                                        Your Message *
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows="6"
                                        className="w-full px-5 py-4 border-2 border-black/10 rounded-xl focus:border-black outline-none transition resize-none bg-white"
                                        placeholder="Tell us more about your inquiry..."
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-black to-gray-900 text-white px-8 py-5 rounded-full hover:from-gray-900 hover:to-black transition-all font-bold uppercase tracking-wider flex items-center justify-center gap-3 shadow-lg hover:shadow-2xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            Send Message
                                            <Send className="w-5 h-5" />
                                        </>
                                    )}
                                </button>

                                <p className="text-xs text-black/50 text-center">
                                    We'll respond within 24 hours
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ContactUs;
