import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { User, Mail, Lock, ArrowLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../store/slices/authSlice";
import Button from "../../components/ui/Button";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isSigningUp } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return;
    }

    const result = await dispatch(
      registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })
    );

    if (result.payload?.user) {
      // Check if there's a redirect parameter
      const redirectTo = searchParams.get("redirect");
      if (redirectTo) {
        navigate(redirectTo);
      } else {
        navigate("/");
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-black transition font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl font-heading font-bold text-black mb-2">
            Create Account
          </h1>
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              to={`/auth/login${
                searchParams.get("redirect")
                  ? `?redirect=${searchParams.get("redirect")}`
                  : ""
              }`}
              className="text-black font-medium hover:opacity-70 transition-opacity"
            >
              Sign In
            </Link>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-black">
              Full Name
            </label>
            <div className="mt-1 relative">
              <User className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-pill focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="John Doe"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-black">
              Email Address
            </label>
            <div className="mt-1 relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-pill focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="your@email.com"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-black">
              Password
            </label>
            <div className="mt-1 relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
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
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-pill focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button disabled={isSigningUp} className="w-full">
              {isSigningUp ? "Creating account..." : "Create Account"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
