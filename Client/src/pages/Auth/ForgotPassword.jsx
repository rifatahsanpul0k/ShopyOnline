import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../../store/slices/authSlice";
import Button from "../../components/ui/Button";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const { isRequestingForToken } = useSelector((state) => state.auth);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(forgotPassword(email));
    // Check if the request was fulfilled (successful)
    if (result.meta.requestStatus === 'fulfilled') {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md mx-auto text-center space-y-6">
          <div>
            <h1 className="text-5xl font-heading font-bold text-black mb-2">
              Check Your Email
            </h1>
            <p className="text-gray-600">
              We've sent a password reset link to {email}. Please check your
              email and follow the link to reset your password.
            </p>
          </div>
          <Link to="/auth/login">
            <Button>Back to Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl font-heading font-bold text-black mb-2">
            Forgot Password?
          </h1>
          <p className="text-gray-600">
            Enter your email address and we'll send you a link to reset your
            password.
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-pill focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="your@email.com"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button disabled={isRequestingForToken} className="w-full">
              {isRequestingForToken ? "Sending..." : "Send Reset Link"}
            </Button>
          </div>
        </form>

        {/* Back to Sign In */}
        <div className="text-center">
          <Link
            to="/auth/login"
            className="text-sm text-black font-medium hover:opacity-70 transition-opacity"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;