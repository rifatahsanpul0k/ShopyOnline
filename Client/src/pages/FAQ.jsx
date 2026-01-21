import React, { useState } from "react";
import { HelpCircle, Package, CreditCard, RefreshCw, Truck, Shield, Search, ChevronDown } from "lucide-react";

const FAQ = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [openCategory, setOpenCategory] = useState(null);

    const faqCategories = [
        {
            category: "Ordering & Payment",
            icon: CreditCard,
            color: "from-purple-500 to-pink-500",
            questions: [
                {
                    question: "What payment methods do you accept?",
                    answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. All transactions are encrypted and secure.",
                },
                {
                    question: "Can I modify or cancel my order?",
                    answer: "You can modify or cancel your order within 1 hour of placing it. After that, the order is processed and cannot be changed. Please contact support immediately if needed.",
                },
                {
                    question: "Do you offer EMI or installment plans?",
                    answer: "Yes, we offer zero-interest EMI plans on orders above $200. You can choose 3, 6, or 12-month installment options at checkout.",
                },
            ],
        },
        {
            category: "Shipping & Delivery",
            icon: Truck,
            color: "from-blue-500 to-cyan-500",
            questions: [
                {
                    question: "What are your shipping options?",
                    answer: "We offer standard shipping (5-7 business days) and express shipping (2-3 business days). Free standard shipping is available on orders over $50.",
                },
                {
                    question: "Do you ship internationally?",
                    answer: "Yes, we ship to over 25 countries worldwide. International shipping costs and delivery times vary by location. You can see the exact cost at checkout.",
                },
                {
                    question: "How can I track my order?",
                    answer: "Once your order is shipped, you'll receive a tracking number via email. You can use this number to track your package in real-time on our website or the carrier's site.",
                },
                {
                    question: "What if my package is lost or damaged?",
                    answer: "If your package is lost or arrives damaged, please contact us within 48 hours. We'll investigate with the carrier and provide a replacement or full refund.",
                },
            ],
        },
        {
            category: "Returns & Refunds",
            icon: RefreshCw,
            color: "from-green-500 to-emerald-500",
            questions: [
                {
                    question: "What is your return policy?",
                    answer: "We have a hassle-free 10-day return policy from the date of delivery. Items must be unused, in original packaging, and with all tags attached.",
                },
                {
                    question: "How do I initiate a return?",
                    answer: "Log into your account, go to Orders, select the item you want to return, and click 'Request Return'. You'll receive a return shipping label via email.",
                },
                {
                    question: "When will I receive my refund?",
                    answer: "Refunds are processed within 5-7 business days after we receive your returned item. The refund will be credited to your original payment method.",
                },
                {
                    question: "Are there any items that cannot be returned?",
                    answer: "For hygiene reasons, opened software, downloaded digital products, and personal care items cannot be returned unless defective.",
                },
            ],
        },
        {
            category: "Products & Stock",
            icon: Package,
            color: "from-orange-500 to-red-500",
            questions: [
                {
                    question: "Are all products authentic?",
                    answer: "Yes, 100%. We only source products from authorized distributors and manufacturers. All items come with official warranties and authenticity guarantees.",
                },
                {
                    question: "What if an item is out of stock?",
                    answer: "You can sign up for email notifications on the product page. We'll notify you as soon as the item is back in stock.",
                },
                {
                    question: "Do products come with warranty?",
                    answer: "Yes, all products come with manufacturer's warranty. Warranty periods vary by product - check the product page for specific details.",
                },
            ],
        },
        {
            category: "Account & Security",
            icon: Shield,
            color: "from-indigo-500 to-purple-500",
            questions: [
                {
                    question: "Is my personal information secure?",
                    answer: "Absolutely. We use bank-level SSL encryption to protect your data. We never share your personal information with third parties without your consent.",
                },
                {
                    question: "How do I reset my password?",
                    answer: "Click 'Forgot Password' on the login page. Enter your email address, and we'll send you a password reset link. Follow the instructions in the email.",
                },
                {
                    question: "Can I delete my account?",
                    answer: "Yes, you can delete your account from the Account Settings page. Note that this action is permanent and will delete all your order history and saved information.",
                },
            ],
        },
    ];

    const filteredCategories = faqCategories.map(category => ({
        ...category,
        questions: category.questions.filter(q =>
            q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(category => category.questions.length > 0);

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
                        <div className="bg-white/10 backdrop-blur-sm w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8">
                            <HelpCircle className="w-10 h-10" />
                        </div>
                        <h1 className="text-6xl lg:text-8xl font-black tracking-tighter uppercase mb-6 leading-[0.9]">
                            How Can We Help?
                        </h1>
                        <p className="text-xl text-white/80 leading-relaxed mb-12">
                            Find answers to frequently asked questions about orders, shipping, returns, and more.
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-2xl mx-auto">
                            <div className="relative">
                                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-black/40 w-6 h-6" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search for answers..."
                                    className="w-full pl-16 pr-6 py-5 bg-white text-black rounded-full border-2 border-white/20 focus:border-white outline-none font-medium text-lg"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute -right-20 top-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute -left-20 bottom-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
            </section>

            {/* FAQ Categories */}
            <section className="py-24 px-6 lg:px-12 max-w-[1440px] mx-auto">
                {/* Category Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-16">
                    {faqCategories.map((category, idx) => {
                        const Icon = category.icon;
                        return (
                            <button
                                key={idx}
                                onClick={() => setOpenCategory(openCategory === idx ? null : idx)}
                                className={`group p-6 rounded-2xl border-2 transition-all text-center ${openCategory === idx
                                        ? 'bg-black text-white border-black'
                                        : 'bg-white border-black/10 hover:border-black'
                                    }`}
                            >
                                <Icon className={`w-8 h-8 mx-auto mb-3 ${openCategory === idx ? 'text-white' : 'text-black'}`} />
                                <h3 className={`text-xs font-black uppercase tracking-wider ${openCategory === idx ? 'text-white' : 'text-black'
                                    }`}>
                                    {category.category}
                                </h3>
                            </button>
                        );
                    })}
                </div>

                {/* FAQ Accordions */}
                <div className="space-y-12">
                    {(searchQuery ? filteredCategories : openCategory !== null ? [faqCategories[openCategory]] : faqCategories).map((category, catIdx) => {
                        const Icon = category.icon;
                        const actualIdx = searchQuery ? faqCategories.findIndex(c => c.category === category.category) : (openCategory !== null ? openCategory : catIdx);

                        return (
                            <div key={catIdx} className="scroll-mt-24">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className={`bg-gradient-to-br ${category.color} text-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg`}>
                                        <Icon className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl lg:text-4xl font-black tracking-tighter uppercase">
                                            {category.category}
                                        </h2>
                                        <p className="text-black/60 text-sm">{category.questions.length} questions</p>
                                    </div>
                                </div>

                                <div className="space-y-4 max-w-4xl">
                                    {category.questions.map((faq, idx) => (
                                        <details
                                            key={idx}
                                            className="group bg-white border-2 border-black/10 rounded-2xl p-6 hover:border-black hover:shadow-lg transition-all"
                                        >
                                            <summary className="font-black text-lg tracking-tight cursor-pointer list-none flex items-start justify-between gap-4">
                                                <span className="flex-1">{faq.question}</span>
                                                <ChevronDown className="w-6 h-6 flex-shrink-0 group-open:rotate-180 transition-transform" />
                                            </summary>
                                            <p className="text-black/70 mt-4 leading-relaxed pl-0">
                                                {faq.answer}
                                            </p>
                                        </details>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {searchQuery && filteredCategories.length === 0 && (
                    <div className="text-center py-16">
                        <HelpCircle className="w-16 h-16 mx-auto mb-4 text-black/20" />
                        <h3 className="text-2xl font-black mb-2">No results found</h3>
                        <p className="text-black/60">Try searching with different keywords</p>
                    </div>
                )}
            </section>

            {/* Still Have Questions */}
            <section className="py-24 px-6 lg:px-12 bg-gradient-to-br from-black via-gray-900 to-black text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)',
                    }}></div>
                </div>

                <div className="max-w-[1440px] mx-auto text-center relative z-10">
                    <h2 className="text-4xl lg:text-6xl font-black tracking-tighter uppercase mb-6">
                        Still Have Questions?
                    </h2>
                    <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
                        Can't find what you're looking for? Our support team is available 24/7 to help you.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <a
                            href="/contact"
                            className="inline-flex items-center gap-3 bg-white text-black px-10 py-5 rounded-full hover:bg-white/90 transition-all font-bold uppercase tracking-wider shadow-lg hover:shadow-2xl transform hover:scale-105"
                        >
                            Contact Support
                        </a>
                        <button className="inline-flex items-center gap-3 bg-transparent text-white px-10 py-5 rounded-full border-2 border-white hover:bg-white hover:text-black transition-all font-bold uppercase tracking-wider">
                            Live Chat
                        </button>
                    </div>
                </div>

                <div className="absolute -right-20 top-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute -left-20 bottom-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
            </section>
        </div>
    );
};

export default FAQ;
