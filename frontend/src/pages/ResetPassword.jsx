import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Handle Password Reset
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.put(
        `https://bookcon-backend.onrender.com/api/v2/user/reset-password/${token}`,
        { password },
        { headers: { "Content-Type": "application/json" } }
      );

      setMessage(data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[#fdf7e4]">
      {/* Reset Password Container */}
      <div className="w-[90%] md:w-[400px] bg-white p-6 rounded-lg shadow-md border-t-4 border-orange-500">
        
        {/* Book Quote */}
        <p className="text-center text-gray-600 italic mb-4">
          "A room without books is like a body without a soul." 📚
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
          Reset Your Password
        </h2>

        {/* Error / Success Messages */}
        {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}
        {message && <p className="text-green-500 text-sm mb-3 text-center">{message}</p>}

        <form onSubmit={handleResetPassword}>
          {/* New Password Field */}
          <div className="relative mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              New Password
            </label>
            <input
              type={passwordVisible ? "text" : "password"}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 pr-10"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="absolute right-3 top-10 cursor-pointer text-gray-600"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>

          {/* Confirm Password Field */}
          <div className="relative mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Confirm Password
            </label>
            <input
              type={confirmPasswordVisible ? "text" : "password"}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 pr-10"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span
              className="absolute right-3 top-10 cursor-pointer text-gray-600"
              onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
            >
              {confirmPasswordVisible ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-md transition-all duration-300"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
