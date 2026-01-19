import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
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
  ChevronDown,
  Camera,
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

  // Initialize form
  useEffect(() => {
    if (authUser) {
      setProfileForm({
        name: authUser.name || "",
        email: authUser.email || "",
        phone: authUser.phone || "",
        address: authUser.address || "",
      });
      setAvatarPreview(authUser.avatar?.url || null);
    }
  }, [authUser]);

  if (!authUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Please Log In
          </h1>
          <p className="text-gray-500 mb-6">
            You need to be logged in to view your profile settings.
          </p>
          <Button onClick={() => navigate("/auth/login")} className="w-full">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  // ... (Handlers remain the same: handleProfileChange, handlePasswordChange, handleAvatarUpload, handleUpdateProfile, handleUpdatePassword, handleLogout, handleCancelEdit)
  // Re-paste your logic handlers here if copying full file, omitting for brevity as they didn't change visually.

  // --- INSERT HANDLERS HERE (The logic parts from your previous code) ---
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    if (!file.type.startsWith("image/")) {
      setErrors({ avatar: "Please upload an image file" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors({ avatar: "Image size must be less than 5MB" });
      return;
    }
    setErrors({});

    // Preview immediately
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
    setAvatarFile(file);

    // Auto-save attempt
    const formData = new FormData();
    formData.append("name", profileForm.name);
    formData.append("email", profileForm.email);
    formData.append("phone", profileForm.phone || "");
    formData.append("address", profileForm.address || "");
    formData.append("avatar", file);

    try {
      const result = await dispatch(updateProfile(formData));

      if (result.meta.requestStatus === "fulfilled") {
        setSuccessMessage("Profile photo updated successfully!");
        setAvatarFile(null); // Clear pending file
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        // If failed (e.g. missing fields), enter edit mode so user can fix
        setIsEditing(true);
      }
    } catch (error) {
      setIsEditing(true);
    }
  };

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
      if (avatarFile) formData.append("avatar", avatarFile);

      const result = await dispatch(updateProfile(formData));
      if (result.type === "auth/profile/update/fulfilled") {
        setIsEditing(false);
        setAvatarFile(null);
        if (result.payload?.avatar?.url)
          setAvatarPreview(result.payload.avatar.url);
        setSuccessMessage("Profile updated successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    }
  };

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

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      await dispatch(logoutUser());
      navigate("/");
    }
  };

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

  // --- UI RENDER STARTS HERE ---

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20 pt-10">
      {" "}
      {/* Lighter gray background */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8 ml-1">
          <Link to="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="font-medium text-black">My Profile</span>
        </div>

        {/* Title Section */}
        <div className="mb-10 ml-1">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Account Settings
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            Manage your personal data and security preferences.
          </p>
        </div>

        {/* Success Toast */}
        {successMessage && (
          <div className="mb-8 mx-1 bg-green-50 border border-green-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm animate-fade-in-down">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-green-800 font-medium">{successMessage}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT SIDEBAR */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-100/50 border border-gray-100 p-6 sticky top-24">
              {/* Profile Card Header */}
              <div className="flex flex-col items-center text-center pb-8 border-b border-gray-100">
                <div className="relative group cursor-pointer mb-4">
                  <div className="w-28 h-28 rounded-full p-1 border-2 border-dashed border-gray-300 group-hover:border-black transition-colors">
                    <div className="w-full h-full rounded-full overflow-hidden relative">
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-900 flex items-center justify-center text-white text-3xl font-bold">
                          {authUser?.name?.charAt(0) || "U"}
                        </div>
                      )}

                      {/* Hover Overlay for Upload */}
                      <label
                        htmlFor="avatar-upload"
                        className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <Camera className="w-8 h-8 text-white mb-1" />
                        <span className="text-white text-xs font-medium">
                          Change
                        </span>
                      </label>
                    </div>
                  </div>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </div>

                {errors.avatar && (
                  <p className="text-red-500 text-xs mb-2">{errors.avatar}</p>
                )}

                <h3 className="font-bold text-gray-900 text-xl">
                  {authUser?.name}
                </h3>
                <p className="text-gray-500 text-sm mt-1">{authUser?.email}</p>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-2 mt-6">
                {[
                  { id: "profile", icon: User, label: "Profile Info" },
                  { id: "orders", icon: ShoppingBag, label: "My Orders" },
                  {
                    id: "settings",
                    icon: Settings,
                    label: "Security & Settings",
                  },
                ].map((item) => {
                  // Special handling for orders - navigate to dedicated page
                  if (item.id === 'orders') {
                    return (
                      <button
                        key={item.id}
                        onClick={() => navigate('/orders')}
                        className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-200 group text-gray-600 hover:bg-gray-50 hover:text-black"
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="w-5 h-5 text-gray-400 group-hover:text-black" />
                          <span className="font-medium">{item.label}</span>
                        </div>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    );
                  }

                  // Regular tab switching for other items
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsEditing(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-200 group ${activeTab === item.id
                        ? "bg-black text-white shadow-lg shadow-black/20"
                        : "text-gray-600 hover:bg-gray-50 hover:text-black"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon
                          className={`w-5 h-5 ${activeTab === item.id
                            ? "text-white"
                            : "text-gray-400 group-hover:text-black"
                            }`}
                        />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      {activeTab === item.id && (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                  );
                })}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-red-600 hover:bg-red-50 transition-colors mt-8 font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </nav>
            </div>
          </div>

          {/* RIGHT CONTENT AREA */}
          <div className="lg:col-span-8 xl:col-span-9">
            {/* PROFILE TAB */}
            {activeTab === "profile" && (
              <div className="bg-white rounded-3xl shadow-xl shadow-gray-100/50 border border-gray-100 overflow-hidden">
                <div className="p-8">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Personal Information
                      </h2>
                      <p className="text-gray-500 mt-1">
                        Update your photo and personal details here.
                      </p>
                    </div>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-full hover:bg-black transition shadow-lg shadow-black/20 text-sm font-medium"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit Profile
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    // EDIT FORM
                    <div className="animate-fade-in">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="col-span-1 md:col-span-2">
                          <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                            Full Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={profileForm.name}
                            onChange={handleProfileChange}
                            className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black/5 focus:bg-white transition-all font-medium"
                          />
                          {errors.name && (
                            <p className="text-red-500 text-sm mt-1 ml-1">
                              {errors.name}
                            </p>
                          )}
                        </div>

                        <div className="col-span-1 md:col-span-2">
                          <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                            Email Address
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={profileForm.email}
                            onChange={handleProfileChange}
                            className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black/5 focus:bg-white transition-all font-medium"
                          />
                          {errors.email && (
                            <p className="text-red-500 text-sm mt-1 ml-1">
                              {errors.email}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={profileForm.phone}
                            onChange={handleProfileChange}
                            className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black/5 focus:bg-white transition-all font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                            Address
                          </label>
                          <input
                            type="text"
                            name="address"
                            value={profileForm.address}
                            onChange={handleProfileChange}
                            className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black/5 focus:bg-white transition-all font-medium"
                          />
                        </div>
                      </div>

                      <div className="flex gap-4 pt-6 border-t border-gray-100">
                        <button
                          onClick={handleUpdateProfile}
                          disabled={isUpdatingProfile}
                          className="px-8 py-3 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition shadow-lg shadow-black/20 flex items-center gap-2"
                        >
                          {isUpdatingProfile ? (
                            <Loader className="w-4 h-4 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4" />
                          )}
                          Save Changes
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-8 py-3 bg-white border border-gray-200 text-gray-700 rounded-full font-bold hover:bg-gray-50 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // VIEW MODE
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        {
                          label: "Full Name",
                          value: authUser?.name,
                          icon: User,
                        },
                        {
                          label: "Email Address",
                          value: authUser?.email,
                          icon: Mail,
                        },
                        {
                          label: "Phone Number",
                          value: authUser?.phone,
                          icon: Phone,
                        },
                        {
                          label: "Shipping Address",
                          value: authUser?.address,
                          icon: MapPin,
                        },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className={`p-5 rounded-2xl bg-gray-50 border border-gray-100 ${index < 2 ? "md:col-span-2" : ""
                            }`}
                        >
                          <div className="flex items-start gap-4">
                            <div className="p-2.5 bg-white rounded-xl shadow-sm text-gray-400">
                              <item.icon className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                                {item.label}
                              </p>
                              <p className="text-gray-900 font-semibold">
                                {item.value || "Not provided"}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ORDERS TAB */}
            {activeTab === "orders" && (
              <div className="bg-white rounded-3xl shadow-xl shadow-gray-100/50 border border-gray-100 p-8 min-h-[400px] flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <ShoppingBag className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No orders yet
                </h3>
                <p className="text-gray-500 max-w-sm mb-8">
                  When you place an order, it will appear here so you can track
                  its status.
                </p>
                <Button onClick={() => navigate("/products")} className="px-8">
                  Browse Products
                </Button>
              </div>
            )}

            {/* SETTINGS TAB */}
            {activeTab === "settings" && (
              <div className="space-y-8">
                {/* Security Card */}
                <div className="bg-white rounded-3xl shadow-xl shadow-gray-100/50 border border-gray-100 p-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <Lock className="w-6 h-6 text-gray-700" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Password & Security
                      </h2>
                      <p className="text-gray-500 text-sm">
                        Manage your password settings
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          name="currentPassword"
                          value={passwordForm.currentPassword}
                          onChange={handlePasswordChange}
                          className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black/5 focus:bg-white transition-all"
                        />
                        <button
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          name="newPassword"
                          value={passwordForm.newPassword}
                          onChange={handlePasswordChange}
                          className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black/5 focus:bg-white transition-all"
                        />
                        <button
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                        >
                          {showNewPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={passwordForm.confirmPassword}
                          onChange={handlePasswordChange}
                          className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black/5 focus:bg-white transition-all"
                        />
                        <button
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <button
                      onClick={handleUpdatePassword}
                      disabled={isUpdatingPassword}
                      className="px-8 py-3 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition shadow-lg shadow-black/20"
                    >
                      {isUpdatingPassword ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </div>

                {/* Preferences Card */}
                <div className="bg-white rounded-3xl shadow-xl shadow-gray-100/50 border border-gray-100 p-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <Settings className="w-6 h-6 text-gray-700" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Preferences
                      </h2>
                      <p className="text-gray-500 text-sm">
                        Manage your notification settings
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 max-w-3xl">
                    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl hover:bg-gray-50 transition cursor-pointer">
                      <div>
                        <p className="font-bold text-gray-900">
                          Order Notifications
                        </p>
                        <p className="text-sm text-gray-500">
                          Receive email updates about your order status
                        </p>
                      </div>
                      <div className="w-12 h-6 bg-black rounded-full relative">
                        <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl hover:bg-gray-50 transition cursor-pointer">
                      <div>
                        <p className="font-bold text-gray-900">
                          Promotional Emails
                        </p>
                        <p className="text-sm text-gray-500">
                          Receive emails about new products and sales
                        </p>
                      </div>
                      <div className="w-12 h-6 bg-gray-200 rounded-full relative">
                        <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1 shadow-sm"></div>
                      </div>
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