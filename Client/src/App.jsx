import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getUser, checkAuth } from "./store/slices/authSlice";

// Layout
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import AdminLayout from "./components/Layout/AdminLayout";

// Protected Route Components
import { UserProtectedRoute, AuthProtectedRoute } from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import Orders from "./pages/Orders";
import UserProfile from "./pages/UserProfile";
import NewArrivals from "./pages/NewArrivals";
import TopRated from "./pages/TopRated";

// Auth Pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import UpdatePassword from "./pages/Auth/UpdatePassword";
import UpdateProfile from "./pages/Auth/UpdateProfile";

// Admin Pages
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminOrders from "./pages/Admin/Orders";
import AdminProducts from "./pages/Admin/Products";
import AdminUsers from "./pages/Admin/Users";
import AdminProfile from "./pages/Admin/Profile";

// 404 Page
import NotFound from "./pages/NotFound";

const App = () => {
  const dispatch = useDispatch();

  // Check if user is authenticated on app load
  // Check if user is authenticated on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(getUser());
    } else {
      dispatch(checkAuth());
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Routes>
        {/* Admin Routes (Without Navbar/Footer) */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* Redirect /admin to /admin/dashboard */}
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>

        {/* Main App Routes (With Navbar/Footer) */}
        <Route
          path="*"
          element={
            <UserProtectedRoute>
              <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
                <Navbar />
                <main className="flex-grow">
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/new-arrivals" element={<NewArrivals />} />
                    <Route path="/top-rated" element={<TopRated />} />

                    {/* Auth Routes */}
                    <Route path="/auth/login" element={<Login />} />
                    <Route path="/auth/register" element={<Register />} />
                    <Route path="/auth/forgot-password" element={<ForgotPassword />} />
                    <Route
                      path="/auth/reset-password/:token"
                      element={<ResetPassword />}
                    />
                    <Route path="/auth/update-password" element={<UpdatePassword />} />
                    <Route path="/auth/update-profile" element={<UpdateProfile />} />

                    {/* Protected Routes - Require authentication */}
                    <Route path="/checkout" element={<AuthProtectedRoute><Checkout /></AuthProtectedRoute>} />
                    <Route path="/payment" element={<AuthProtectedRoute><Payment /></AuthProtectedRoute>} />
                    <Route path="/payment/success" element={<AuthProtectedRoute><PaymentSuccess /></AuthProtectedRoute>} />
                    <Route path="/orders" element={<AuthProtectedRoute><Orders /></AuthProtectedRoute>} />
                    <Route path="/profile" element={<AuthProtectedRoute><UserProfile /></AuthProtectedRoute>} />

                    {/* 404 */}
                    <Route path="/not-found" element={<NotFound />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </UserProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;