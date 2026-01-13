import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Mail, Lock, ArrowLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../store/slices/authSlice";
import Button from "../../components/ui/Button";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isLoggingIn } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🔐 Login attempt with:", formData.email);

    const result = await dispatch(loginUser(formData));
    console.log("Login result:", result);

    if (result.payload?.user) {
      console.log("✅ Login successful!");
      setFormData({ email: "", password: "" });

      // Check if there's a redirect parameter
      const redirectTo = searchParams.get("redirect");
      if (redirectTo) {
        navigate(redirectTo);
      } else {
        navigate("/");
      }
    } else {
      console.log("❌ Login failed - error handled by interceptor");
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
            Sign In
          </h1>
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link
              to={`/auth/register${
                searchParams.get("redirect")
                  ? `?redirect=${searchParams.get("redirect")}`
                  : ""
              }`}
              className="text-black font-medium hover:opacity-70 transition-opacity"
            >
              Register
            </Link>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
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

          {/* Forgot Password */}
          <div className="text-right">
            <Link
              to="/auth/forgot-password"
              className="text-sm text-black font-medium hover:opacity-70 transition-opacity"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button disabled={isLoggingIn} className="w-full">
              {isLoggingIn ? "Signing in..." : "Sign In"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
