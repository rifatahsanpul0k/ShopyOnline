import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  logoutUser,
  updateProfile,
  updatePassword,
} from "../store/slices/authSlice";
import {
  Mail,
  Phone,
  MapPin,
  Lock,
  LogOut,
  Edit2,
  Save,
  X,
  Eye,
  EyeOff,
  ShoppingBag,
  Settings,
  ChevronRight,
  AlertCircle,
  Check,
  Upload,
  User,
  Loader,
  ArrowLeft,
} from "lucide-react";
import Button from "../components/ui/Button";

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { authUser, isUpdatingProfile, isUpdatingPassword } = useSelector(
    (state) => state.auth
  );

  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Initialize form with user data
  useEffect(() => {
    if (authUser) {
      setProfileForm({
        name: authUser.name || "",
        email: authUser.email || "",
        phone: authUser.phone || "",
        address: authUser.address || "",
      });
      // Set avatar preview from server
      setAvatarPreview(authUser.avatar?.url || null);
    }
  }, [authUser]);

  // Redirect if not authenticated
  if (!authUser) {
    return (
      <div className="min-h-screen bg-white py-12 px-4">
        <div className="max-w-[1440px] mx-auto text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-black mb-4">Please Log In</h1>
          <p className="text-gray-600 mb-8">
            You need to be logged in to view your profile.
          </p>
          <Button onClick={() => navigate("/auth/login")}>Go to Login</Button>
        </div>
      </div>
    );
  }

  // Handle profile form change
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle password form change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setErrors({ avatar: "Please upload an image file" });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors({ avatar: "Image size must be less than 5MB" });
      return;
    }

    setErrors({});

    // Create local preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Store file to be uploaded
    setAvatarFile(file);

    // Auto-enable edit mode if not already
    if (!isEditing) {
      setIsEditing(true);
    }
  };

  // Validate and update profile
  const handleUpdateProfile = async () => {
    const newErrors = {};

    if (!profileForm.name.trim()) newErrors.name = "Full name is required";
    if (!profileForm.email.trim()) newErrors.email = "Email is required";
    if (
      profileForm.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email)
    ) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      const formData = new FormData();
      formData.append("name", profileForm.name);
      formData.append("email", profileForm.email);
      formData.append("phone", profileForm.phone || "");
      formData.append("address", profileForm.address || "");

      // Add avatar file if selected
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const result = await dispatch(updateProfile(formData));
      if (result.type === "auth/profile/update/fulfilled") {
        setIsEditing(false);
        setAvatarFile(null);

        // Update preview with the new avatar URL from server
        if (result.payload?.avatar?.url) {
          setAvatarPreview(result.payload.avatar.url);
        }

        setSuccessMessage("Profile updated successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    }
  };

  // Validate and update password
  const handleUpdatePassword = async () => {
    const newErrors = {};

    if (!passwordForm.currentPassword.trim())
      newErrors.currentPassword = "Current password is required";
    if (!passwordForm.newPassword.trim())
      newErrors.newPassword = "New password is required";
    if (passwordForm.newPassword.length < 6)
      newErrors.newPassword = "Password must be at least 6 characters";
    if (!passwordForm.confirmPassword.trim())
      newErrors.confirmPassword = "Confirm password is required";
    if (passwordForm.newPassword !== passwordForm.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      const result = await dispatch(
        updatePassword({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
          confirmNewPassword: passwordForm.confirmPassword,
        })
      );
      if (result.type === "auth/password/update/fulfilled") {
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setSuccessMessage("Password updated successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    }
  };

  // Handle logout
  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      await dispatch(logoutUser());
      navigate("/");
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setIsEditing(false);
    setProfileForm({
      name: authUser?.name || "",
      email: authUser?.email || "",
      phone: authUser?.phone || "",
      address: authUser?.address || "",
    });
    setAvatarPreview(authUser?.avatar?.url || null);
    setAvatarFile(null);
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-[1440px] mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-black transition mb-6 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-black mb-2">
            My Profile
          </h1>
          <p className="text-gray-600">Manage your account and settings</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-3xl p-4 flex gap-3 items-center">
            <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-green-800 font-medium">{successMessage}</p>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl border border-gray-200 p-6 sticky top-20">
              {/* Avatar */}
              <div className="text-center mb-6 pb-6 border-b border-gray-200">
                <div className="relative inline-block mb-3">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt={authUser?.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-black"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center border-4 border-black">
                      <span className="text-white font-bold text-3xl">
                        {authUser?.name?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    </div>
                  )}

                  {/* Upload Button */}
                  {isEditing && (
                    <label
                      htmlFor="avatar-upload"
                      className="absolute bottom-0 right-0 bg-black text-white rounded-full p-2 cursor-pointer hover:bg-gray-800 transition"
                      title="Upload profile picture"
                    >
                      <Upload className="w-4 h-4" />
                    </label>
                  )}
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </div>

                {errors.avatar && (
                  <p className="text-red-500 text-sm mb-2">{errors.avatar}</p>
                )}

                <h3 className="font-bold text-black text-lg mb-1">
                  {authUser?.name || "User"}
                </h3>
                <p className="text-gray-600 text-sm break-all">
                  {authUser?.email || "No email"}
                </p>
              </div>

              {/* Navigation */}
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setActiveTab("profile");
                    setIsEditing(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-pill transition ${
                    activeTab === "profile"
                      ? "bg-black text-white font-semibold"
                      : "text-black hover:bg-gray-100"
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span className="flex-1 text-left">Profile</span>
                  {activeTab === "profile" && (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>

                <button
                  onClick={() => {
                    setActiveTab("orders");
                    setIsEditing(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-pill transition ${
                    activeTab === "orders"
                      ? "bg-black text-white font-semibold"
                      : "text-black hover:bg-gray-100"
                  }`}
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span className="flex-1 text-left">Orders</span>
                  {activeTab === "orders" && (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>

                <button
                  onClick={() => {
                    setActiveTab("settings");
                    setIsEditing(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-pill transition ${
                    activeTab === "settings"
                      ? "bg-black text-white font-semibold"
                      : "text-black hover:bg-gray-100"
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  <span className="flex-1 text-left">Security</span>
                  {activeTab === "settings" && (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full mt-6 flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-pill transition font-medium"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {/* PROFILE INFO TAB */}
            {activeTab === "profile" && (
              <div className="bg-white rounded-3xl border border-gray-200 p-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-heading font-bold text-black">
                    Profile Information
                  </h2>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-pill hover:opacity-90 transition"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit Profile
                    </button>
                  )}
                </div>

                {isEditing ? (
                  // Edit Mode
                  <div className="space-y-6">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={profileForm.name}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-pill focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="John Doe"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={profileForm.email}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-pill focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="john@example.com"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={profileForm.phone}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-pill focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>

                    {/* Address */}
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={profileForm.address}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-pill focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="123 Main Street, New York, NY 10001"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleUpdateProfile}
                        disabled={isUpdatingProfile}
                        className="flex-1 flex items-center justify-center gap-2 bg-black text-white font-bold py-3 rounded-pill hover:opacity-90 transition disabled:opacity-50"
                      >
                        {isUpdatingProfile ? (
                          <>
                            <Loader className="w-5 h-5 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-5 h-5" />
                            Save Changes
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex-1 flex items-center justify-center gap-2 border border-gray-300 text-black font-medium py-3 rounded-pill hover:bg-gray-100 transition"
                      >
                        <X className="w-5 h-5" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="space-y-5">
                    {/* Name */}
                    <div className="flex items-start gap-4 pb-5 border-b border-gray-200">
                      <User className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 font-medium">
                          Full Name
                        </p>
                        <p className="text-lg text-black font-semibold">
                          {authUser?.name || "Not provided"}
                        </p>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-start gap-4 pb-6 border-b border-gray-200">
                      <Mail className="w-6 h-6 text-gray-400 flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 font-medium">
                          Email Address
                        </p>
                        <p className="text-lg text-black font-semibold">
                          {authUser.email}
                        </p>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-start gap-4 pb-6 border-b border-gray-200">
                      <Phone className="w-6 h-6 text-gray-400 flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 font-medium">
                          Phone Number
                        </p>
                        <p className="text-lg text-black font-semibold">
                          {authUser.phone || "Not provided"}
                        </p>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="flex items-start gap-4">
                      <MapPin className="w-6 h-6 text-gray-400 flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 font-medium">
                          Address
                        </p>
                        <p className="text-lg text-black font-semibold">
                          {authUser.address || "Not provided"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ORDERS TAB */}
            {activeTab === "orders" && (
              <div className="bg-white rounded-3xl border border-gray-200 p-8">
                <h2 className="text-3xl font-heading font-bold text-black mb-8">
                  My Orders
                </h2>

                {/* Placeholder for orders */}
                <div className="text-center py-16">
                  <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg mb-4">No orders yet</p>
                  <p className="text-gray-500 mb-8">
                    Start shopping and complete a purchase to see your orders
                    here.
                  </p>
                  <Button onClick={() => navigate("/products")}>
                    Continue Shopping
                  </Button>
                </div>

                {/* TODO: Connect to backend to fetch user orders */}
                {/* Backend endpoint: GET /api/v1/orders */}
              </div>
            )}

            {/* SETTINGS TAB */}
            {activeTab === "settings" && (
              <div className="space-y-8">
                {/* Change Password */}
                <div className="bg-white rounded-3xl border border-gray-200 p-8">
                  <h2 className="text-3xl font-heading font-bold text-black mb-8 flex items-center gap-3">
                    <Lock className="w-8 h-8" />
                    Change Password
                  </h2>

                  <div className="space-y-6">
                    {/* Current Password */}
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          name="currentPassword"
                          value={passwordForm.currentPassword}
                          onChange={handlePasswordChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-pill focus:outline-none focus:ring-2 focus:ring-black pr-12"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black"
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      {errors.currentPassword && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.currentPassword}
                        </p>
                      )}
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          name="newPassword"
                          value={passwordForm.newPassword}
                          onChange={handlePasswordChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-pill focus:outline-none focus:ring-2 focus:ring-black pr-12"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black"
                        >
                          {showNewPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      {errors.newPassword && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.newPassword}
                        </p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={passwordForm.confirmPassword}
                          onChange={handlePasswordChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-pill focus:outline-none focus:ring-2 focus:ring-black pr-12"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>

                    {/* Update Button */}
                    <button
                      onClick={handleUpdatePassword}
                      disabled={isUpdatingPassword}
                      className="w-full bg-black text-white font-bold py-4 rounded-pill hover:opacity-90 transition disabled:opacity-50"
                    >
                      {isUpdatingPassword ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </div>

                {/* Account Settings */}
                <div className="bg-white rounded-3xl border border-gray-200 p-8">
                  <h2 className="text-3xl font-heading font-bold text-black mb-8 flex items-center gap-3">
                    <Settings className="w-8 h-8" />
                    Account Settings
                  </h2>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 border border-gray-200 rounded-card hover:bg-gray-50 transition">
                      <div>
                        <p className="font-medium text-black">
                          Email Notifications
                        </p>
                        <p className="text-sm text-gray-600">
                          Receive updates about orders
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-5 h-5 rounded cursor-pointer"
                      />
                    </div>

                    <div className="flex justify-between items-center p-4 border border-gray-200 rounded-card hover:bg-gray-50 transition">
                      <div>
                        <p className="font-medium text-black">
                          Marketing Emails
                        </p>
                        <p className="text-sm text-gray-600">
                          Get special offers and promotions
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-5 h-5 rounded cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
