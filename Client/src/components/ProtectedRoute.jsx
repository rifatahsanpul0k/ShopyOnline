import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ROLE_ADMIN } from "../constants/roles";
import { ADMIN_DASHBOARD_ROUTE, HOME_ROUTE, LOGIN_ROUTE } from "../constants/routes";

// Admin Protected Route - Only admins can access
export const AdminProtectedRoute = ({ children }) => {
    const { authUser, loading } = useSelector((state) => state.auth);

    // Show loading while checking auth
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-black"></div>
            </div>
        );
    }

    // Check if user is authenticated and is admin
    if (!authUser) {
        return <Navigate to={`${LOGIN_ROUTE}?redirect=${ADMIN_DASHBOARD_ROUTE}`} replace />;
    }

    if (authUser.role !== ROLE_ADMIN) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h1 className="text-4xl font-black mb-4">Access Denied</h1>
                    <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
                    <a href={HOME_ROUTE} className="bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800">
                        Go to Home
                    </a>
                </div>
            </div>
        );
    }

    return children;
};

// User Protected Route - Only regular users can access (admins are redirected to admin dashboard)
export const UserProtectedRoute = ({ children }) => {
    const { authUser, loading } = useSelector((state) => state.auth);

    // Show loading while checking auth
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-black"></div>
            </div>
        );
    }

    return children;
};

// Auth Protected Route - Any authenticated user can access
export const AuthProtectedRoute = ({ children }) => {
    const { authUser, isCheckingAuth } = useSelector((state) => state.auth);

    // Show loading while checking auth
    if (isCheckingAuth) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-black"></div>
            </div>
        );
    }

    if (!authUser) {
        return <Navigate to={LOGIN_ROUTE} replace />;
    }

    // If admin tries to access, redirect to admin dashboard
    if (authUser.role === ROLE_ADMIN) {
        return <Navigate to={ADMIN_DASHBOARD_ROUTE} replace />;
    }

    return children;
};

export default AdminProtectedRoute;