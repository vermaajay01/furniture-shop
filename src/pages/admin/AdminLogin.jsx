import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  LogIn,
} from "lucide-react";

import { adminLogin } from "../../firebase/auth";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await adminLogin(email, password);

      navigate("/admin/dashboard");
    } catch (error) {
      console.error(error);

      if (error.code === "auth/not-admin") {
        setError(
          "Access denied. This account is not authorized as an admin."
        );
      } else if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/user-not-found"
      ) {
        setError("Invalid email or password.");
      } else if (error.code === "auth/too-many-requests") {
        setError(
          "Too many login attempts. Please try again later."
        );
      } else {
        setError(
          "Unable to login. Please check your Firebase configuration."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F1E7] px-6">

      <div className="w-full max-w-md">

        {/* Logo */}

        <div className="mb-8 text-center">

          <h1 className="text-4xl font-bold text-[#6B1E1E]">
            हरि <span className="text-[#B8863B]">ॐ</span>
          </h1>

          <p className="mt-1 text-xs tracking-[0.35em] text-[#6B1E1E]">
            FURNITURE HOUSE
          </p>

          <p className="mt-6 text-sm uppercase tracking-[0.25em] text-[#8B2E2E]">
            Admin Panel
          </p>

        </div>

        {/* Login Card */}

        <div className="bg-white p-8 shadow-xl md:p-10">

          <div className="mb-8">

            <h2 className="text-2xl font-bold text-[#2B1714]">
              Admin Login
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Sign in to manage हरि ॐ Furniture House.
            </p>

          </div>

          {/* Error */}

          {error && (
            <div className="mb-6 border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Email */}

            <div>

              <label className="mb-2 block text-sm font-medium text-[#2B1714]">
                Email Address
              </label>

              <div className="relative">

                <Mail
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="Admin email"
                  className="w-full border border-gray-200 py-3 pl-12 pr-4 outline-none transition focus:border-[#8B2E2E]"
                />

              </div>

            </div>

            {/* Password */}

            <div>

              <label className="mb-2 block text-sm font-medium text-[#2B1714]">
                Password
              </label>

              <div className="relative">

                <Lock
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="Enter password"
                  className="w-full border border-gray-200 py-3 pl-12 pr-12 outline-none transition focus:border-[#8B2E2E]"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#8B2E2E]"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>

              </div>

            </div>

            {/* Login */}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 bg-[#8B2E2E] py-4 font-semibold text-white transition hover:bg-[#6B1E1E] disabled:cursor-not-allowed disabled:opacity-60"
            >

              {loading ? (
                "Signing in..."
              ) : (
                <>
                  <LogIn size={19} />
                  Sign In
                </>
              )}

            </button>

          </form>

          {/* Back */}

          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-6 w-full text-center text-sm text-gray-500 transition hover:text-[#8B2E2E]"
          >
            ← Back to Website
          </button>

        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          Authorized administrator access only.
        </p>

      </div>

    </main>
  );
}

export default AdminLogin;