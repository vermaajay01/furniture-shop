import {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import {
  auth,
  db,
} from "../../firebase/firebase";

function CustomerSignup() {
  const navigate =
    useNavigate();

  const [name, setName] =
    useState("");

  const [mobile, setMobile] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // ====================================================
  // SIGN UP
  // ====================================================

  const handleSignup = async (
    event
  ) => {
    event.preventDefault();

    setError("");

    // ==================================================
    // VALIDATION
    // ==================================================

    if (
      !name.trim() ||
      !mobile.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      setError(
        "Please fill in all fields."
      );

      return;
    }

    const cleanMobile =
      mobile.replace(
        /\D/g,
        ""
      );

    if (
      cleanMobile.length !== 10
    ) {
      setError(
        "Please enter a valid 10-digit mobile number."
      );

      return;
    }

    if (
      password.length < 6
    ) {
      setError(
        "Password must contain at least 6 characters."
      );

      return;
    }

    if (
      password !==
      confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );

      return;
    }

    try {
      setLoading(true);

      // ==================================================
      // CREATE FIREBASE USER
      // ==================================================

      const credential =
        await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

      const currentUser =
        credential.user;

      // ==================================================
      // UPDATE DISPLAY NAME
      // ==================================================

      await updateProfile(
        currentUser,
        {
          displayName:
            name.trim(),
        }
      );

      // ==================================================
      // CUSTOMER PROFILE
      // ==================================================

      await setDoc(
        doc(
          db,
          "customers",
          currentUser.uid
        ),
        {
          uid:
            currentUser.uid,

          name:
            name.trim(),

          mobile:
            cleanMobile,

          email:
            email.trim(),

          createdAt:
            serverTimestamp(),

          updatedAt:
            serverTimestamp(),
        }
      );

      // ==================================================
      // GO HOME
      // ==================================================

      navigate("/");
    } catch (firebaseError) {
      console.error(
        "Customer signup failed:",
        firebaseError
      );

      if (
        firebaseError.code ===
        "auth/email-already-in-use"
      ) {
        setError(
          "An account with this email already exists."
        );
      } else if (
        firebaseError.code ===
        "auth/invalid-email"
      ) {
        setError(
          "Please enter a valid email address."
        );
      } else if (
        firebaseError.code ===
        "auth/weak-password"
      ) {
        setError(
          "Password is too weak."
        );
      } else {
        setError(
          "Unable to create your account. Please try again."
        );
      }
    } finally {
      setLoading(false);
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
            Create Account
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Create your Hari Om Furniture House account
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
            FORM
        ================================================== */}

        <form
          onSubmit={handleSignup}
          className="mt-7 space-y-4"
        >

          {/* NAME */}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Full Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(event) =>
                setName(
                  event.target.value
                )
              }
              placeholder="Enter your name"
              autoComplete="name"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#8B2E2E]"
            />
          </div>

          {/* MOBILE */}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Mobile Number
            </label>

            <input
              type="tel"
              value={mobile}
              onChange={(event) =>
                setMobile(
                  event.target.value
                )
              }
              placeholder="10-digit mobile number"
              inputMode="numeric"
              autoComplete="tel"
              maxLength={10}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#8B2E2E]"
            />
          </div>

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
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              placeholder="Create a password"
              autoComplete="new-password"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#8B2E2E]"
            />
          </div>

          {/* CONFIRM PASSWORD */}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Confirm Password
            </label>

            <input
              type="password"
              value={
                confirmPassword
              }
              onChange={(event) =>
                setConfirmPassword(
                  event.target.value
                )
              }
              placeholder="Confirm your password"
              autoComplete="new-password"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#8B2E2E]"
            />
          </div>

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#6B1E1E] px-4 py-3 font-semibold text-white transition hover:bg-[#8B2E2E] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>

        {/* ==================================================
            LOGIN
        ================================================== */}

        <p className="mt-6 text-center text-sm text-gray-500">

          Already have an account?{" "}

          <Link
            to="/login"
            className="font-semibold text-[#6B1E1E] hover:underline"
          >
            Login
          </Link>

        </p>

      </div>

    </div>
  );
}

export default CustomerSignup;