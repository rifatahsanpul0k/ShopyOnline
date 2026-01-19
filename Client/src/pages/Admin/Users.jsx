import React, { useEffect, useState } from "react";
import {
    Trash2,
    Search,
    ChevronLeft,
    ChevronRight,
    Mail,
    Calendar,
    User,
    ShieldAlert
} from "lucide-react";
import { fetchAllUsers, deleteUser } from "../../services/adminService";
import { toast } from "react-toastify";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch Users
    const loadUsers = async (pageNumber) => {
        setLoading(true);
        try {
            const data = await fetchAllUsers(pageNumber);
            if (data.success) {
                setUsers(data.users);
                setFilteredUsers(data.users); // Init filtered list
                setTotalCount(data.totalUsers);
                setTotalPages(Math.ceil(data.totalUsers / 10));
            }
        } catch (error) {
            toast.error("Could not load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers(page);
    }, [page]);

    // Client-side search (for current page)
    useEffect(() => {
        if (searchTerm === "") {
            setFilteredUsers(users);
        } else {
            const lowerTerm = searchTerm.toLowerCase();
            const filtered = users.filter(
                (user) =>
                    user.name.toLowerCase().includes(lowerTerm) ||
                    user.email.toLowerCase().includes(lowerTerm)
            );
            setFilteredUsers(filtered);
        }
    }, [searchTerm, users]);

    const handleDelete = async (userId) => {
        if (window.confirm("Are you sure? This action involves removing a customer account.")) {
            try {
                const data = await deleteUser(userId);
                if (data.success) {
                    toast.success("User account removed");
                    loadUsers(page);
                }
            } catch (error) {
                toast.error("Failed to delete user");
            }
        }
    };

    // Helper for Date Format
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">

            {/* 1. Header & Search */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-black tracking-tight uppercase mb-2">
                        Customer Base
                    </h1>
                    <p className="text-gray-500 font-medium">
                        Manage registered users and account access.
                    </p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="bg-white rounded-full shadow-sm border border-gray-100 flex items-center px-4 py-3 flex-1 md:w-80">
                        <Search size={20} className="text-gray-400 min-w-[20px]" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="ml-3 bg-transparent border-none focus:ring-0 w-full text-sm font-medium placeholder-gray-400"
                        />
                    </div>
                    <div className="bg-black text-white px-5 py-3 rounded-full text-sm font-bold shadow-lg whitespace-nowrap">
                        {totalCount} Users
                    </div>
                </div>
            </div>

            {/* 2. Main Table Card */}
            <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden flex flex-col min-h-[400px]">

                <div className="overflow-x-auto flex-1">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">User Profile</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Email</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Joined</th>
                                <th className="px-8 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                // Skeleton Loader
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-8 py-5"><div className="flex items-center gap-4"><div className="h-10 w-10 bg-gray-100 rounded-full"></div><div className="h-4 w-32 bg-gray-100 rounded"></div></div></td>
                                        <td className="px-8 py-5"><div className="h-4 w-40 bg-gray-100 rounded"></div></td>
                                        <td className="px-8 py-5"><div className="h-4 w-32 bg-gray-100 rounded"></div></td>
                                        <td className="px-8 py-5"><div className="h-4 w-24 bg-gray-100 rounded"></div></td>
                                        <td className="px-8 py-5"><div className="h-8 w-8 bg-gray-100 rounded-lg ml-auto"></div></td>
                                    </tr>
                                ))
                            ) : filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="group hover:bg-gray-50/80 transition-colors">

                                        {/* Profile */}
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            <div className="flex items-center gap-4">
                                                <div className="h-11 w-11 flex-shrink-0 relative">
                                                    {user.avatar?.url ? (
                                                        <img className="h-full w-full rounded-full object-cover border border-gray-200" src={user.avatar.url} alt="" />
                                                    ) : (
                                                        <div className="h-full w-full rounded-full bg-black text-white flex items-center justify-center font-bold text-lg">
                                                            {user.name.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-sm text-gray-900">{user.name}</div>
                                                    <div className="text-[10px] text-gray-400 uppercase tracking-wide">ID: {user.id.slice(0, 8)}</div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Contact */}
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-sm text-gray-600 font-medium bg-gray-50 w-fit px-3 py-1 rounded-lg">
                                                <Mail size={14} className="text-gray-400" />
                                                {user.email}
                                            </div>
                                        </td>

                                        {/* Phone */}
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            <div className="text-sm text-gray-600 font-medium">
                                                {user.phone || "N/A"}
                                            </div>
                                        </td>

                                        {/* Date */}
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                                                <Calendar size={14} />
                                                {formatDate(user.created_at)}
                                            </div>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-8 py-5 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="p-2 bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 rounded-lg transition-colors"
                                                    title="Delete Account"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                // Empty State
                                <tr>
                                    <td colSpan="4" className="px-6 py-24 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                                <User size={32} className="text-gray-300" />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900">No users found</h3>
                                            <p className="text-gray-500 text-sm mt-1">Try adjusting your search terms.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* 3. Pagination Footer */}
                {!loading && filteredUsers.length > 0 && totalPages > 1 && (
                    <div className="px-8 py-5 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                            Showing Page <span className="text-black">{page}</span> of {totalPages}
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-2 bg-white border border-gray-200 rounded-lg hover:border-black disabled:opacity-50 disabled:hover:border-gray-200 transition-all shadow-sm"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="p-2 bg-white border border-gray-200 rounded-lg hover:border-black disabled:opacity-50 disabled:hover:border-gray-200 transition-all shadow-sm"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Users;