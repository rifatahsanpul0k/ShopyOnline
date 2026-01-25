import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Grid3x3, List } from "lucide-react";
import { fetchAllProducts } from "../store/slices/productSlice";
import { addToCart } from "../store/slices/cartSlice";
import { toast } from "react-toastify";

// Extracted Components
import FilterSidebar from "../components/products/FilterSidebar";
import ProductGrid from "../components/products/ProductGrid";
import Pagination from "../components/products/Pagination";

// Dynamic category filters based on category type
const CATEGORY_FILTERS = {
  laptops: {
    name: "Laptops",
    subcategories: [
      "Gaming Laptops",
      "Ultrabooks",
      "MacBooks",
      "Business Laptops",
      "2-in-1 Laptops",
    ],
    specs: {
      brand: ["Apple", "Dell", "HP", "Lenovo", "ASUS", "Acer", "MSI"],
      ram: ["8GB", "16GB", "32GB", "64GB"],
      storage: ["256GB SSD", "512GB SSD", "1TB SSD", "2TB SSD"],
      processor: [
        "Intel Core i5",
        "Intel Core i7",
        "Intel Core i9",
        "AMD Ryzen 5",
        "AMD Ryzen 7",
        "AMD Ryzen 9",
        "Apple M1",
        "Apple M2",
        "Apple M3",
      ],
      screenSize: ["13-14 inch", "15-16 inch", "17+ inch"],
    },
  },
  components: {
    name: "Components",
    subcategories: [
      "Processors",
      "Graphics Cards",
      "Motherboards",
      "RAM",
      "Storage",
      "Power Supply",
      "Cooling",
    ],
    specs: {
      brand: [
        "Intel",
        "AMD",
        "NVIDIA",
        "Corsair",
        "G.Skill",
        "Samsung",
        "Western Digital",
      ],
      type: ["CPU", "GPU", "RAM", "SSD", "HDD", "PSU"],
      performance: ["Entry Level", "Mid Range", "High End", "Enthusiast"],
    },
  },
  smartphones: {
    name: "Smartphones",
    subcategories: [
      "Flagship Phones",
      "Mid-Range Phones",
      "Budget Phones",
      "Gaming Phones",
      "Foldable Phones",
      "5G Phones",
    ],
    specs: {
      brand: ["Apple", "Samsung", "Google", "OnePlus", "Xiaomi", "OPPO", "Vivo"],
      storage: ["64GB", "128GB", "256GB", "512GB", "1TB"],
      ram: ["4GB", "6GB", "8GB", "12GB", "16GB"],
      camera: ["Single", "Dual", "Triple", "Quad", "50MP+"],
      screen: ["6.1 inch", "6.5 inch", "6.7 inch", "6.8+ inch"],
    },
  },
  watches: {
    name: "Watches",
    subcategories: [],
    specs: {
      brand: ["Apple", "Samsung", "Garmin", "Fossil", "Casio"],
      type: ["Smartwatch", "Analog", "Digital", "Hybrid"],
    },
  },
};

const Products = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    specs: true,
    availability: true,
    rating: true,
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;

  // Get category/sort URL params
  const categoryParam = searchParams.get("category")?.toLowerCase();
  const sortParam = searchParams.get("sort");

  const currentCategory = categoryParam
    ? CATEGORY_FILTERS[categoryParam] || CATEGORY_FILTERS.laptops
    : null;

  // Determine page title dynamically
  const pageTitle = categoryParam
    ? currentCategory?.name || "Products"
    : sortParam === "newest"
      ? "New Arrivals"
      : sortParam === "rating"
        ? "Top Rated Products"
        : "All Products";

  // --- STATE MANAGEMENT ---

  // 1. Slider Bounds: The absolute min/max of the category.
  const [sliderBounds, setSliderBounds] = useState({ min: 0, max: 2000 });
  const [isBoundsInitialized, setIsBoundsInitialized] = useState(false);

  // 2. User Filters
  const [filters, setFilters] = useState({
    category: categoryParam || "",
    subcategory: searchParams.get("subcategory") || "",
    minPrice: 0,
    maxPrice: 5000,
    sort: searchParams.get("sort") || "price-low",
    brands: [],
    specs: {},
    availability: "all",
    minRating: 0,
  });

  const { products, loading, totalProducts } = useSelector(
    (state) => state.product
  );

  // --- EFFECTS ---

  // 1. Reset everything when switching Categories
  useEffect(() => {
    setIsBoundsInitialized(false);
    setSliderBounds({ min: 0, max: 5000 });

    setFilters((prev) => ({
      ...prev,
      category: categoryParam,
      minPrice: 0,
      maxPrice: 5000,
      availability: "all",
    }));
  }, [categoryParam]);

  // 2. Initialize Slider Bounds from Data
  useEffect(() => {
    if (!loading && products && products.length > 0 && !isBoundsInitialized) {
      const prices = products.map((p) => parseFloat(p.price));
      const min = Math.floor(Math.min(...prices));
      const max = Math.ceil(Math.max(...prices));

      const safeMax = max === min ? max + 100 : max;

      setSliderBounds({ min, max: safeMax });

      setFilters((prev) => ({
        ...prev,
        minPrice: min,
        maxPrice: safeMax,
      }));

      setIsBoundsInitialized(true);
    }
  }, [products, loading, isBoundsInitialized]);

  // 3. Fetch products when filters change
  useEffect(() => {
    const params = {
      category: filters.category,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      sort: filters.sort,
      availability: filters.availability,
      minRating: filters.minRating,
    };

    dispatch(fetchAllProducts(params));
  }, [
    dispatch,
    filters.category,
    filters.minPrice,
    filters.maxPrice,
    filters.sort,
    filters.availability,
    filters.minRating,
  ]);

  // --- FILTERING & SORTING ---

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    return products.filter((product) => {
      // Availability filter
      if (filters.availability !== "all") {
        const stock = product.stock || 0;
        if (filters.availability === "in-stock" && stock <= 0) return false;
        if (filters.availability === "limited" && (stock <= 0 || stock > 10))
          return false;
        if (filters.availability === "out-of-stock" && stock > 0) return false;
      }

      return true;
    });
  }, [products, filters.availability]);

  // --- PAGINATION ---

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage, itemsPerPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // --- HANDLERS ---

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const resetFilters = () => {
    setFilters({
      category: categoryParam || "",
      subcategory: "",
      minPrice: sliderBounds.min,
      maxPrice: sliderBounds.max,
      sort: "price-low",
      brands: [],
      specs: {},
      availability: "all",
      minRating: 0,
    });
  };

  const handleAddToCart = (product, productImage) => {
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        quantity: 1,
        image: productImage,
        category: product.category,
        stock: product.stock,
      })
    );
    toast.success("Added to cart!");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white py-16 px-6">
        <div className="max-w-[1440px] mx-auto">
          <h1 className="text-5xl lg:text-6xl font-black tracking-tighter uppercase mb-4">
            {pageTitle}
          </h1>
          <p className="text-white/70 text-lg">
            {totalProducts} products available
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter Sidebar */}
          <FilterSidebar
            filters={filters}
            onFilterChange={setFilters}
            onResetFilters={resetFilters}
            currentCategory={currentCategory}
            sliderBounds={sliderBounds}
            expandedSections={expandedSections}
            onToggleSection={toggleSection}
            categoryParam={categoryParam}
            CATEGORY_FILTERS={CATEGORY_FILTERS}
          />

          {/* Product Grid */}
          <div className="lg:col-span-3">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b-2 border-black/10">
              <div className="flex items-center gap-4">
                <select
                  value={filters.sort}
                  onChange={(e) =>
                    setFilters({ ...filters, sort: e.target.value })
                  }
                  className="px-4 py-2 border-2 border-black/10 rounded-pill font-medium bg-white focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest Arrivals</option>
                  <option value="rating">Top Rated</option>
                </select>

                <p className="text-sm text-black/60 font-medium">
                  Showing {paginatedProducts.length} of {filteredProducts.length}{" "}
                  products
                </p>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-pill">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-pill transition ${viewMode === "grid"
                      ? "bg-black text-white"
                      : "text-black/60 hover:text-black"
                    }`}
                  title="Grid View"
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-pill transition ${viewMode === "list"
                      ? "bg-black text-white"
                      : "text-black/60 hover:text-black"
                    }`}
                  title="List View"
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Product Grid/List */}
            <ProductGrid
              products={paginatedProducts}
              viewMode={viewMode}
              loading={loading}
              onAddToCart={handleAddToCart}
            />

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Products;