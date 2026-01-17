import { useState } from "react";
import { Lock } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { updatePassword } from "../../store/slices/authSlice";
import Button from "../../components/ui/Button";

const UpdatePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const dispatch = useDispatch();
  const { isUpdatingPassword } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmNewPassword) {
      return;
    }

    await dispatch(updatePassword(formData));
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-heading font-bold text-black">
            Update Password
          </h1>
          <p className="text-gray-600">Change your account password</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Old Password */}
          <div>
            <label className="block text-sm font-medium text-black">
              Current Password
            </label>
            <div className="mt-1 relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="password"
                required
                value={formData.currentPassword}
                onChange={(e) =>
                  setFormData({ ...formData, currentPassword: e.target.value })
                }
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-pill focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-black">
              New Password
            </label>
            <div className="mt-1 relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="password"
                required
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData({ ...formData, newPassword: e.target.value })
                }
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-pill focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-black">
              Confirm Password
            </label>
            <div className="mt-1 relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="password"
                required
                value={formData.confirmNewPassword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirmNewPassword: e.target.value,
                  })
                }
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-pill focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button disabled={isUpdatingPassword} className="w-full">
              {isUpdatingPassword ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;
