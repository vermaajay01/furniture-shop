import { useState } from "react";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { Lock, Loader2 } from "lucide-react";
import { auth } from "../../firebase/firebase";
import { useAuth } from "../../context/AuthContext";

function ChangePassword() {
  const { user } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!user) return;

    if (newPassword.length < 6) {
      setError("New password must contain at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    try {
      setSaving(true);

      const credential =
        EmailAuthProvider.credential(
          user.email,
          currentPassword
        );

      await reauthenticateWithCredential(
        user,
        credential
      );

      await updatePassword(
        user,
        newPassword
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setMessage("Password changed successfully.");
    } catch (firebaseError) {
      console.error(
        "Password change failed:",
        firebaseError
      );

      if (
        firebaseError.code ===
        "auth/invalid-credential"
      ) {
        setError("Current password is incorrect.");
      } else if (
        firebaseError.code ===
        "auth/requires-recent-login"
      ) {
        setError(
          "Please log in again before changing your password."
        );
      } else {
        setError("Unable to change password.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="p-8 text-center">
        Please login to change your password.
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] bg-[#F8F1E7] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F5E4E4] text-[#6B1E1E]">
            <Lock size={24} />
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#B8863B]">
              Customer Account
            </p>

            <h1 className="mt-1 text-2xl font-bold text-[#6B1E1E]">
              Change Password
            </h1>
          </div>
        </div>

        {error && (
          <div className="mt-6 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {message && (
          <div className="mt-6 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-7 space-y-5"
        >
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(event) =>
                setCurrentPassword(event.target.value)
              }
              autoComplete="current-password"
              className="w-full border border-gray-200 px-4 py-3 outline-none focus:border-[#8B2E2E]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(event) =>
                setNewPassword(event.target.value)
              }
              autoComplete="new-password"
              className="w-full border border-gray-200 px-4 py-3 outline-none focus:border-[#8B2E2E]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              autoComplete="new-password"
              className="w-full border border-gray-200 px-4 py-3 outline-none focus:border-[#8B2E2E]"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 bg-[#6B1E1E] px-5 py-3 font-semibold text-white hover:bg-[#8B2E2E] disabled:opacity-60"
          >
            {saving && (
              <Loader2
                size={18}
                className="animate-spin"
              />
            )}
            {saving
              ? "Changing Password..."
              : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
