import { useEffect, useState } from "react";
import { updateProfile } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { User, Loader2, Save } from "lucide-react";
import { auth, db } from "../../firebase/firebase";
import { useAuth } from "../../context/AuthContext";

function CustomerProfile() {
  const { user, profile } = useAuth();

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setName(profile?.name || user?.displayName || "");
    setMobile(profile?.mobile || "");
  }, [profile, user]);

  const handleSave = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!user) return;

    const cleanMobile = mobile.replace(/\D/g, "");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (cleanMobile && cleanMobile.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    try {
      setSaving(true);

      await updateProfile(user, {
        displayName: name.trim(),
      });

      await setDoc(
        doc(db, "customers", user.uid),
        {
          uid: user.uid,
          name: name.trim(),
          mobile: cleanMobile,
          email: user.email || "",
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setMessage("Profile updated successfully.");
    } catch (error) {
      console.error("Profile update failed:", error);
      setError("Unable to update your profile.");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="p-8 text-center">
        Please login to manage your profile.
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] bg-[#F8F1E7] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F5E4E4] text-[#6B1E1E]">
              <User size={24} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#B8863B]">
                Customer Account
              </p>
              <h1 className="text-2xl font-bold text-[#6B1E1E]">
                Edit Profile
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

          <form onSubmit={handleSave} className="mt-7 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Full Name
              </label>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full border border-gray-200 px-4 py-3 outline-none focus:border-[#8B2E2E]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Email
              </label>
              <input
                value={user.email || ""}
                readOnly
                className="w-full cursor-not-allowed border border-gray-200 bg-gray-50 px-4 py-3 text-gray-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Mobile Number
              </label>
              <input
                type="tel"
                value={mobile}
                onChange={(event) => setMobile(event.target.value)}
                inputMode="numeric"
                maxLength={10}
                className="w-full border border-gray-200 px-4 py-3 outline-none focus:border-[#8B2E2E]"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 bg-[#6B1E1E] px-5 py-3 font-semibold text-white transition hover:bg-[#8B2E2E] disabled:opacity-60"
            >
              {saving ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CustomerProfile;
