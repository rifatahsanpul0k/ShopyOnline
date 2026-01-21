import React, { useState } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
    LayoutDashboard,
    ShoppingCart,
    Package,
    Users,
    UserCircle,
    LogOut,
    Menu,
    X,
} from "lucide-react";
import { logout } from "../../store/slices/authSlice";
import AdminProtectedRoute from "../ProtectedRoute";
import NotificationBell from "./NotificationBell";

const AdminLayout = () => {
    // Sidebar expanded by default on desktop, collapsed on mobile
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { authUser } = useSelector((state) => state.auth);

    const navigation = [
        { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
        { name: "Products", href: "/admin/products", icon: Package },
        { name: "Users", href: "/admin/users", icon: Users },
        { name: "Profile", href: "/admin/profile", icon: UserCircle },
    ];

    const handleLogout = () => {
        dispatch(logout());
        navigate("/auth/login");
    };

    return (
        <AdminProtectedRoute>
            <div className="min-h-screen bg-gray-50">
                {/* Mobile sidebar backdrop */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside
                    className={`fixed top-0 left-0 z-50 h-full w-64 bg-black text-white transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                        }`}
                >
                    <div className="flex flex-col h-full">
                        {/* Logo & Close Button */}
                        <div className="flex items-center justify-between p-6 border-b border-white/10">
                            <Link to="/admin/dashboard" className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                                    <span className="text-black font-black text-xl">S</span>
                                </div>
                                <span className="font-black text-xl tracking-tight">
                                    SHOPY<span className="text-gray-400">ADMIN</span>
                                </span>
                            </Link>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="lg:hidden text-white hover:text-gray-300"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* User Info */}
                        <div className="p-6 border-b border-white/10">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                                    {authUser?.avatar?.url ? (
                                        <img
                                            src={authUser.avatar.url}
                                            alt={authUser.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <UserCircle className="w-6 h-6" />
                                    )}
                                </div>
                                <div>
                                    <p className="font-bold text-sm">{authUser?.name || "Admin"}</p>
                                    <p className="text-xs text-gray-400">{authUser?.role || "Administrator"}</p>
                                </div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 p-4 space-y-2">
                            {navigation.map((item) => {
                                const Icon = item.icon;
                                const isActive = location.pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        onClick={() => setSidebarOpen(false)}
                                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${isActive
                                            ? "bg-white text-black font-bold"
                                            : "text-white/70 hover:bg-white/10 hover:text-white"
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="font-medium">{item.name}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Logout Button */}
                        <div className="p-4 border-t border-white/10">
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-white/70 hover:bg-red-500/10 hover:text-red-400 transition-all w-full"
                            >
                                <LogOut className="w-5 h-5" />
                                <span className="font-medium">Logout</span>
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="lg:ml-64">
                    {/* Top Navigation Bar - Desktop & Mobile */}
                    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
                        <div className="px-4 lg:px-8 py-4">
                            <div className="flex items-center justify-between">
                                {/* Mobile Menu Button & Logo */}
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setSidebarOpen(!sidebarOpen)}
                                        className="lg:hidden text-black hover:text-gray-600"
                                    >
                                        <Menu className="w-6 h-6" />
                                    </button>
                                    <h1 className="lg:hidden font-black text-xl tracking-tight">SHOPY ADMIN</h1>
                                </div>

                                {/* Notification & Admin Profile - Top Right */}
                                <div className="flex items-center gap-4">
                                    {/* Notification Bell */}
                                    <NotificationBell />

                                    {/* Admin Avatar & Info */}
                                    <Link
                                        to="/admin/profile"
                                        className="flex items-center gap-3 pl-3 border-l border-gray-200 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
                                    >
                                        <div className="hidden md:block text-right">
                                            <p className="font-bold text-sm text-gray-900">{authUser?.name || "Admin"}</p>
                                            <p className="text-xs text-gray-500 uppercase font-semibold">{authUser?.role || "Administrator"}</p>
                                        </div>
                                        {authUser?.avatar?.url ? (
                                            <img
                                                src={authUser.avatar.url}
                                                alt={authUser.name}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 bg-gradient-to-br from-black to-gray-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                {authUser?.name?.charAt(0).toUpperCase() || "A"}
                                            </div>
                                        )}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Page Content */}
                    <main className="p-6 lg:p-8 bg-gray-50 min-h-[calc(100vh-73px)]">
                        <Outlet />
                    </main>
                </div>
            </div>
        </AdminProtectedRoute>
    );
};

export default AdminLayout;