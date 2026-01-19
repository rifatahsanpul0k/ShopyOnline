import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { UserCircle, User, Mail, Lock, Shield, Calendar } from "lucide-react";
import { updateProfile, updatePassword } from "../../store/slices/authSlice";
import Button from "../../components/ui/Button";
import { toast } from "react-toastify";

const AdminProfile = () => {
    const dispatch = useDispatch();
    const { authUser, isUpdatingProfile, isUpdatingPassword } = useSelector((state) => state.auth);
    const [activeTab, setActiveTab] = useState("overview");

    // Profile Form State
    const [profileData, setProfileData] = useState({
        name: "",
        email: "",
        avatar: null,
    });
    const [preview, setPreview] = useState(null);

    // Password Form State
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    });

    useEffect(() => {
        if (authUser) {
            setProfileData({
                name: authUser.name || "",
                email: authUser.email || "",
                avatar: null,
            });
            setPreview(authUser.avatar?.url || null);
        }
    }, [authUser]);

    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfileData({ ...profileData, avatar: file });
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append("name", profileData.name);
        formDataToSend.append("email", profileData.email);
        if (profileData.avatar) {
            formDataToSend.append("avatar", profileData.avatar);
        }
        const result = await dispatch(updateProfile(formDataToSend));
        if (result.type === "auth/updateProfile/fulfilled") {
            toast.success("Profile updated successfully!");
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
            toast.error("New passwords do not match!");
            return;
        }
        if (passwordData.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters!");
            return;
        }
        const result = await dispatch(updatePassword(passwordData));
        if (result.type === "auth/updatePassword/fulfilled") {
            toast.success("Password updated successfully!");
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmNewPassword: "",
            });
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black tracking-tight uppercase">Admin Profile</h1>
                <p className="text-gray-500 mt-2">Manage your admin account settings</p>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="border-b border-gray-200">
                    <div className="flex space-x-8 px-6">
                        <button
                            onClick={() => setActiveTab("overview")}
                            className={`py-4 px-2 border-b-2 font-bold text-sm uppercase transition-colors ${activeTab === "overview"
                                    ? "border-black text-black"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab("edit")}
                            className={`py-4 px-2 border-b-2 font-bold text-sm uppercase transition-colors ${activeTab === "edit"
                                    ? "border-black text-black"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            Edit Profile
                        </button>
                        <button
                            onClick={() => setActiveTab("password")}
                            className={`py-4 px-2 border-b-2 font-bold text-sm uppercase transition-colors ${activeTab === "password"
                                    ? "border-black text-black"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            Change Password
                        </button>
                    </div>
                </div>

                <div className="p-8">
                    {/* Overview Tab */}
                    {activeTab === "overview" && (
                        <div className="space-y-6">
                            <div className="flex items-center space-x-6">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white flex items-center justify-center text-3xl font-black shadow-lg">
                                    {authUser?.avatar?.url ? (
                                        <img
                                            src={authUser.avatar.url}
                                            alt={authUser.name}
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        <span>{authUser?.name?.charAt(0).toUpperCase() || "A"}</span>
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black">{authUser?.name || "Admin User"}</h2>
                                    <p className="text-gray-600 text-lg">{authUser?.email || "admin@shopy.com"}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
                                            <Shield className="w-3 h-3" />
                                            {authUser?.role || "ADMIN"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <User className="w-5 h-5 text-gray-600" />
                                        <h3 className="font-bold text-sm uppercase text-gray-600">Full Name</h3>
                                    </div>
                                    <p className="text-xl font-black">{authUser?.name || "N/A"}</p>
                                </div>

                                <div className="bg-gray-50 rounded-xl p-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Mail className="w-5 h-5 text-gray-600" />
                                        <h3 className="font-bold text-sm uppercase text-gray-600">Email Address</h3>
                                    </div>
                                    <p className="text-xl font-black break-all">{authUser?.email || "N/A"}</p>
                                </div>

                                <div className="bg-gray-50 rounded-xl p-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Shield className="w-5 h-5 text-gray-600" />
                                        <h3 className="font-bold text-sm uppercase text-gray-600">Role</h3>
                                    </div>
                                    <p className="text-xl font-black">{authUser?.role || "ADMIN"}</p>
                                </div>

                                <div className="bg-gray-50 rounded-xl p-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Calendar className="w-5 h-5 text-gray-600" />
                                        <h3 className="font-bold text-sm uppercase text-gray-600">Member Since</h3>
                                    </div>
                                    <p className="text-xl font-black">
                                        {authUser?.createdAt
                                            ? new Date(authUser.createdAt).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })
                                            : "N/A"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Edit Profile Tab */}
                    {activeTab === "edit" && (
                        <form onSubmit={handleProfileSubmit} className="space-y-6 max-w-2xl">
                            <div>
                                <label className="block text-sm font-bold text-black mb-3 uppercase">
                                    Profile Picture
                                </label>
                                <div className="flex items-center space-x-6">
                                    {preview ? (
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            className="w-20 h-20 rounded-full object-cover border-4 border-gray-100"
                                        />
                                    ) : (
                                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-2xl font-black">
                                            {authUser?.name?.charAt(0).toUpperCase() || "A"}
                                        </div>
                                    )}
                                    <label className="cursor-pointer">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                            className="hidden"
                                        />
                                        <span className="inline-block px-4 py-2 bg-black text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-colors">
                                            Change Photo
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-black mb-2 uppercase">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        value={profileData.name}
                                        onChange={(e) =>
                                            setProfileData({ ...profileData, name: e.target.value })
                                        }
                                        className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black font-medium"
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-black mb-2 uppercase">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                                    <input
                                        type="email"
                                        value={profileData.email}
                                        onChange={(e) =>
                                            setProfileData({ ...profileData, email: e.target.value })
                                        }
                                        className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black font-medium"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <Button disabled={isUpdatingProfile} className="w-full md:w-auto px-8">
                                    {isUpdatingProfile ? "Updating..." : "Update Profile"}
                                </Button>
                            </div>
                        </form>
                    )}

                    {/* Change Password Tab */}
                    {activeTab === "password" && (
                        <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-2xl">
                            <div>
                                <label className="block text-sm font-bold text-black mb-2 uppercase">
                                    Current Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                                    <input
                                        type="password"
                                        required
                                        value={passwordData.currentPassword}
                                        onChange={(e) =>
                                            setPasswordData({ ...passwordData, currentPassword: e.target.value })
                                        }
                                        className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black font-medium"
                                        placeholder="Enter current password"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-black mb-2 uppercase">
                                    New Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                                    <input
                                        type="password"
                                        required
                                        value={passwordData.newPassword}
                                        onChange={(e) =>
                                            setPasswordData({ ...passwordData, newPassword: e.target.value })
                                        }
                                        className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black font-medium"
                                        placeholder="Enter new password (min 6 characters)"
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-black mb-2 uppercase">
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                                    <input
                                        type="password"
                                        required
                                        value={passwordData.confirmNewPassword}
                                        onChange={(e) =>
                                            setPasswordData({
                                                ...passwordData,
                                                confirmNewPassword: e.target.value,
                                            })
                                        }
                                        className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black font-medium"
                                        placeholder="Confirm new password"
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <Button disabled={isUpdatingPassword} className="w-full md:w-auto px-8">
                                    {isUpdatingPassword ? "Updating..." : "Update Password"}
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;