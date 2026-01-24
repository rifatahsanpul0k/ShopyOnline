import React, { useEffect, useState } from "react";
import {
    Package,
    Plus,
    Edit2,
    Trash2,
    Search,
    DollarSign,
    Image as ImageIcon,
    Tag,
    AlertCircle,
    X,
    Star,
    UploadCloud,
    Layers,
    XCircle,
    Grid3x3,
    List
} from "lucide-react";
import {
    fetchAllProductsAdmin,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../../services/productsAdminService";
import { formatPrice } from "../../utils/currencyFormatter";
import { toast } from "react-toastify";

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState("create");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [viewMode, setViewMode] = useState("grid");

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
    });

    // Separate state for images
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [existingImages, setExistingImages] = useState([]);

    const categories = [
        "Laptops",
        "Smartphones",
        "Components",
        "Watches"
    ];

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const response = await fetchAllProductsAdmin();
            if (response.success) {
                setProducts(response.products || []);
            }
        } catch (error) {
            console.error("Error loading products:", error);
            toast.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (mode, product = null) => {
        setModalMode(mode);
        if (mode === "edit" && product) {
            setSelectedProduct(product);
            setFormData({
                name: product.name || "",
                description: product.description || "",
                price: product.price || "",
                category: product.category || "",
                stock: product.stock || "",
            });
            // Set existing images for edit mode
            setExistingImages(product.images || []);
            setImageFiles([]);
            setImagePreviews([]);
        } else {
            setSelectedProduct(null);
            setFormData({
                name: "",
                description: "",
                price: "",
                category: "",
                stock: "",
            });
            setExistingImages([]);
            setImageFiles([]);
            setImagePreviews([]);
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedProduct(null);
        setImageFiles([]);
        setImagePreviews([]);
        setExistingImages([]);
    };

    // Handle image file selection
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        if (files.length + imagePreviews.length > 4) {
            toast.error("Maximum 4 images allowed");
            return;
        }

        // Validate file types and sizes
        const validFiles = [];
        const previews = [];

        files.forEach(file => {
            if (!file.type.startsWith('image/')) {
                toast.error(`${file.name} is not an image file`);
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error(`${file.name} is too large (max 5MB)`);
                return;
            }

            validFiles.push(file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                previews.push(reader.result);
                if (previews.length === validFiles.length) {
                    setImagePreviews(prev => [...prev, ...previews]);
                }
            };
            reader.readAsDataURL(file);
        });

        setImageFiles(prev => [...prev, ...validFiles]);
    };

    // Remove image preview
    const removeImagePreview = (index) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    // Remove existing image (for edit mode)
    const removeExistingImage = (index) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    // --- Form Logic ---
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.name || !formData.price || !formData.category || !formData.stock) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (modalMode === "create" && imageFiles.length === 0) {
            toast.error("Please upload at least one product image");
            return;
        }

        try {
            setSubmitting(true);

            // Create FormData for file upload
            const data = new FormData();
            data.append("name", formData.name);
            data.append("description", formData.description);
            data.append("price", parseFloat(formData.price));
            data.append("category", formData.category);
            data.append("stock", parseInt(formData.stock));

            // Append new image files
            imageFiles.forEach((file) => {
                data.append("images", file);
            });

            // For edit mode, include existing images info if needed
            if (modalMode === "edit" && existingImages.length > 0) {
                data.append("existingImages", JSON.stringify(existingImages));
            }

            let response;
            if (modalMode === "create") {
                response = await createProduct(data);
            } else {
                response = await updateProduct(selectedProduct.id, data);
            }

            if (response.success) {
                toast.success(`Product ${modalMode === 'create' ? 'created' : 'updated'} successfully`);
                loadProducts();
                handleCloseModal();
            }
        } catch (error) {
            console.error("Error submitting product:", error);
            toast.error(error.response?.data?.message || "Failed to save product");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteClick = (product) => {
        setSelectedProduct(product);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        try {
            const response = await deleteProduct(selectedProduct.id);
            if (response.success) {
                toast.success("Product deleted successfully");
                loadProducts();
                setShowDeleteModal(false);
                setSelectedProduct(null);
            }
        } catch (error) {
            toast.error("Failed to delete product");
        }
    };

    const filteredProducts = products.filter(
        (product) =>
            product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = {
        total: products.length,
        limitedStock: products.filter((p) => p.stock <= 5 && p.stock > 0).length,
        outOfStock: products.filter((p) => p.stock === 0).length,
        totalValue: products.reduce((sum, p) => sum + parseFloat(p.price || 0) * parseInt(p.stock || 0), 0),
    };

    // --- Render Helpers ---

    // Reusable Stat Card
    const ProductStatCard = ({ label, value, icon: Icon, alert = false }) => (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${alert ? "bg-red-50 text-red-600" : "bg-black/5 text-black"}`}>
                    <Icon size={24} />
                </div>
            </div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{label}</p>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black mt-1 text-black truncate">{value}</h3>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* 1. Header & Actions */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-black tracking-tight mb-2 uppercase">
                        Product Inventory
                    </h1>
                    <p className="text-gray-500">Manage your catalog, stock levels, and pricing.</p>
                </div>
                <button
                    onClick={() => handleOpenModal("create")}
                    className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full font-bold hover:bg-gray-800 transition-transform active:scale-95 shadow-lg"
                >
                    <Plus size={20} />
                    Add Product
                </button>
            </div>

            {/* 2. Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <ProductStatCard label="Total Products" value={stats.total} icon={Package} />
                <ProductStatCard label="Inventory Value" value={formatPrice(stats.totalValue)} icon={DollarSign} />
                <ProductStatCard label="Limited Stock" value={stats.limitedStock} icon={AlertCircle} alert={stats.limitedStock > 0} />
                <ProductStatCard label="Out of Stock" value={stats.outOfStock} icon={Layers} alert={stats.outOfStock > 0} />
            </div>

            {/* 3. Search & Filters */}
            <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 flex items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search products by name, category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-transparent border-none focus:ring-0 placeholder-gray-400 text-black"
                    />
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-full">
                    <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 rounded-full transition ${viewMode === "grid"
                            ? "bg-black text-white"
                            : "hover:bg-white"
                            }`}
                    >
                        <Grid3x3 className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 rounded-full transition ${viewMode === "list"
                            ? "bg-black text-white"
                            : "hover:bg-white"
                            }`}
                    >
                        <List className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* 4. Products Grid/List */}
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "flex flex-col gap-6"}>
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            className={`group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 ${viewMode === "grid" ? "flex flex-col" : "flex gap-6 items-start"}`}
                        >
                            {/* Image Area */}
                            <div className={`${viewMode === "grid" ? "aspect-[4/5] w-full" : "w-40 h-40 flex-shrink-0"} bg-gray-100 relative overflow-hidden`}>
                                {product.images && product.images[0]?.url ? (
                                    <img
                                        src={product.images[0].url}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                                        <ImageIcon size={48} />
                                        <span className="text-xs mt-2 font-medium">No Image</span>
                                    </div>
                                )}

                                {/* Stock Badge */}
                                <div className="absolute top-3 right-3">
                                    {product.stock === 0 ? (
                                        <span className="px-3 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-wide rounded-full">
                                            Out of Stock
                                        </span>
                                    ) : product.stock <= 5 ? (
                                        <span className="px-3 py-1 bg-red-100 text-red-600 text-[10px] font-bold uppercase tracking-wide rounded-full border border-red-200">
                                            Limited Stock
                                        </span>
                                    ) : (
                                        <span className="px-3 py-1 bg-white/90 backdrop-blur text-black text-[10px] font-bold uppercase tracking-wide rounded-full shadow-sm">
                                            In Stock
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className={`${viewMode === "grid" ? "p-5 flex flex-col flex-1" : "p-5 flex-1 flex flex-col justify-between"}`}>
                                <div className="mb-1 flex items-center justify-between">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                        {product.category}
                                    </span>
                                    <div className="flex items-center gap-1 text-yellow-500 text-xs font-bold">
                                        <Star size={12} fill="currentColor" />
                                        {product.ratings || "0.0"}
                                    </div>
                                </div>

                                <h3 className={`font-bold ${viewMode === "grid" ? "text-lg" : "text-base"} mb-1 leading-tight text-black line-clamp-1`}>
                                    {product.name}
                                </h3>
                                <p className={`text-sm text-gray-500 ${viewMode === "grid" ? "line-clamp-2" : "line-clamp-1"} mb-4 flex-1`}>
                                    {product.description}
                                </p>

                                <div className={`flex items-end justify-between pt-4 border-t border-gray-50 ${viewMode === "list" ? "pt-3" : ""}`}>
                                    <div>
                                        <p className="text-xs text-gray-400 mb-0.5">Price</p>
                                        <p className={`${viewMode === "grid" ? "text-xl" : "text-lg"} font-black text-black`}>
                                            {formatPrice(product.price)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400 mb-0.5">Stock</p>
                                        <p className="font-bold text-black">{product.stock}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions Overlay (Always visible on mobile, hover on desktop) */}
                            <div className={`${viewMode === "grid" ? "px-5 pb-5 pt-0" : "px-5 pb-5"} flex gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200`}>
                                <button
                                    onClick={() => handleOpenModal("edit", product)}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-black text-white text-sm font-bold rounded-lg hover:bg-gray-800"
                                >
                                    <Edit2 size={16} /> Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(product)}
                                    className="px-4 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 border border-red-100"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
                        <Package size={64} className="mb-4 opacity-20" />
                        <p className="text-lg font-medium text-gray-900">No products found</p>
                        <p className="text-sm">Try adjusting your search terms</p>
                    </div>
                )}
            </div>

            {/* --- Create/Edit Modal --- */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white z-10 px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-2xl font-black uppercase tracking-tight">
                                {modalMode === "create" ? "Add New Product" : "Edit Product"}
                            </h3>
                            <button
                                onClick={handleCloseModal}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">

                            {/* Image Upload Section */}
                            <div className="space-y-4">
                                <label className="block text-xs font-bold text-gray-500 uppercase">Product Images</label>

                                {/* Upload Area */}
                                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 hover:border-black/20 hover:bg-gray-50 transition-colors">
                                    <input
                                        type="file"
                                        id="productImages"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="productImages"
                                        className="flex flex-col items-center justify-center cursor-pointer"
                                    >
                                        <div className="h-14 w-14 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                            <UploadCloud size={24} className="text-gray-400" />
                                        </div>
                                        <p className="text-sm font-bold text-black">Click to upload images</p>
                                        <p className="text-xs text-gray-500 mt-1">PNG, JPG or WEBP (max. 5MB each, up to 4 images)</p>
                                    </label>
                                </div>

                                {/* Image Previews */}
                                {(imagePreviews.length > 0 || existingImages.length > 0) && (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {/* Existing Images (Edit Mode) */}
                                        {existingImages.map((img, index) => (
                                            <div key={`existing-${index}`} className="relative group">
                                                <img
                                                    src={img.url}
                                                    alt={`Existing ${index + 1}`}
                                                    className="w-full h-32 object-cover rounded-xl border-2 border-gray-200"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeExistingImage(index)}
                                                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                                >
                                                    <XCircle size={16} />
                                                </button>
                                                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded-md">
                                                    Existing
                                                </div>
                                            </div>
                                        ))}

                                        {/* New Image Previews */}
                                        {imagePreviews.map((preview, index) => (
                                            <div key={`new-${index}`} className="relative group">
                                                <img
                                                    src={preview}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-32 object-cover rounded-xl border-2 border-green-200"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImagePreview(index)}
                                                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                                >
                                                    <XCircle size={16} />
                                                </button>
                                                <div className="absolute bottom-2 left-2 px-2 py-1 bg-green-600 text-white text-xs rounded-md">
                                                    New
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Name & Desc */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Product Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:border-black focus:ring-0 transition-all font-medium"
                                        placeholder="e.g. Wireless Noise Cancelling Headphones"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:border-black focus:ring-0 transition-all font-medium resize-none"
                                        placeholder="Product details..."
                                        rows="4"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Grid Inputs */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Price (USD)</label>
                                    <div className="relative">
                                        <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:border-black focus:ring-0 transition-all font-bold"
                                            placeholder="0.00"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Stock Quantity</label>
                                    <input
                                        type="number"
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:border-black focus:ring-0 transition-all font-bold"
                                        placeholder="0"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:border-black focus:ring-0 transition-all font-medium appearance-none"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Footer Actions */}
                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 px-6 py-4 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 px-6 py-4 bg-black text-white rounded-xl font-bold hover:bg-gray-900 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {submitting ? "Processing..." : modalMode === 'create' ? "Create Product" : "Save Changes"}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}

            {/* --- Delete Confirmation Modal --- */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95">
                        <div className="h-20 w-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertCircle size={40} className="text-red-500" />
                        </div>
                        <h3 className="text-xl font-black mb-2">Delete Product?</h3>
                        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                            Are you sure you want to remove <span className="font-bold text-black">"{selectedProduct?.name}"</span>? This action cannot be undone.
                        </p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleConfirmDelete}
                                className="w-full py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors"
                            >
                                Yes, Delete it
                            </button>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="w-full py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;