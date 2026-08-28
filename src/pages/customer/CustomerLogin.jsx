import {
  useState,
} from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";

import {
  auth,
} from "../../firebase/firebase";

function CustomerLogin() {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [resetLoading, setResetLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  // ====================================================
  // LOGIN
  // ====================================================

  const handleLogin = async (
    event
  ) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (
      !email.trim() ||
      !password
    ) {
      setError(
        "Please enter your email and password."
      );

      return;
    }

    try {
      setLoading(true);

      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      // ==================================================
      // RETURN TO THE PAGE THAT REQUIRED LOGIN
      // ==================================================

      const from =
        location.state?.from ||
        "/";

      navigate(from, {
        replace: true,
      });
    } catch (firebaseError) {
      console.error(
        "Customer login failed:",
        firebaseError
      );

      if (
        firebaseError.code ===
        "auth/invalid-credential"
      ) {
        setError(
          "Incorrect email or password."
        );
      } else if (
        firebaseError.code ===
        "auth/user-not-found"
      ) {
        setError(
          "No account was found with this email."
        );
      } else if (
        firebaseError.code ===
        "auth/wrong-password"
      ) {
        setError(
          "Incorrect password."
        );
      } else {
        setError(
          "Unable to login. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // PASSWORD RESET
  // ====================================================

  const handleForgotPassword =
    async () => {
      setError("");
      setMessage("");

      if (!email.trim()) {
        setError(
          "Enter your email address first."
        );

        return;
      }

      try {
        setResetLoading(true);

        await sendPasswordResetEmail(
          auth,
          email.trim()
        );

        setMessage(
          "Password reset instructions have been sent to your email."
        );
      } catch (firebaseError) {
        console.error(
          "Password reset failed:",
          firebaseError
        );

        if (
          firebaseError.code ===
          "auth/user-not-found"
        ) {
          setError(
            "No account was found with this email."
          );
        } else {
          setError(
            "Unable to send the reset email. Please check the email address."
          );
        }
      } finally {
        setResetLoading(false);
      }
    };

  return (
    <div className="flex min-h-[75vh] items-center justify-center bg-[#F8F1E7] px-4 py-12">

      <div className="w-full max-w-md bg-white p-7 shadow-lg sm:p-9">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="text-center">

          <h1 className="text-3xl font-bold text-[#6B1E1E]">
            Welcome Back
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Login to your Hari Om Furniture House account
          </p>

        </div>

        {/* ==================================================
            ERROR
        ================================================== */}

        {error && (
          <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* ==================================================
            SUCCESS MESSAGE
        ================================================== */}

        {message && (
          <div className="mt-6 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {/* ==================================================
            FORM
        ================================================== */}

        <form
          onSubmit={handleLogin}
          className="mt-7 space-y-5"
        >

          {/* EMAIL */}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
              placeholder="Enter your email"
              autoComplete="email"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#8B2E2E]"
            />
          </div>

          {/* PASSWORD */}

          <div>

            <div className="mb-1 flex items-center justify-between">

              <label className="text-sm font-medium text-gray-700">
                Password
              </label>

              <button
                type="button"
                onClick={
                  handleForgotPassword
                }
                disabled={
                  resetLoading
                }
                className="text-xs font-semibold text-[#6B1E1E] hover:underline disabled:opacity-50"
              >
                {resetLoading
                  ? "Sending..."
                  : "Forgot Password?"}
              </button>

            </div>

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              placeholder="Enter your password"
              autoComplete="current-password"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#8B2E2E]"
            />

          </div>

          {/* LOGIN */}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#6B1E1E] px-4 py-3 font-semibold text-white transition hover:bg-[#8B2E2E] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Logging In..."
              : "Login"}
          </button>

        </form>

        {/* ==================================================
            SIGNUP
        ================================================== */}

        <p className="mt-6 text-center text-sm text-gray-500">

          Don't have an account?{" "}

          <Link
            to="/signup"
            className="font-semibold text-[#6B1E1E] hover:underline"
          >
            Create Account
          </Link>

        </p>

      </div>

    </div>
  );
}

export default CustomerLogin;