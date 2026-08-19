import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowLeft,
  Save,
  Store,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  Map,
  CheckCircle,
  AlertCircle,
  Globe,
} from "lucide-react";

import {
  FaInstagram,
  FaFacebookF,
} from "react-icons/fa";

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../../firebase/firebase";

function WebsiteSettings() {
  const [formData, setFormData] = useState({
    shopName: "हरि ॐ Furniture House",
    address:
      "Your Furniture Shop Address, Your City, India",
    phone: "+91 XXXXX XXXXX",
    whatsapp: "919596492640",
    email: "info@hariomfurniture.com",
    mapsUrl: "",
    openingHours:
      "Mon - Sun: 10:00 AM - 8:00 PM",
    instagram: "",
    facebook: "",
    footerDescription:
      "Beautifully crafted furniture designed to bring comfort, elegance and lasting quality to your home.",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // ======================================================
  // LOAD WEBSITE SETTINGS
  // ======================================================

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);

        const settingsRef = doc(
          db,
          "settings",
          "website"
        );

        const snapshot =
          await getDoc(settingsRef);

        if (snapshot.exists()) {
          setFormData((previous) => ({
            ...previous,
            ...snapshot.data(),
          }));
        }
      } catch (err) {
        console.error(
          "Website settings error:",
          err
        );

        setError(
          "Unable to load website settings."
        );
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  // ======================================================
  // HANDLE CHANGE
  // ======================================================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSuccess("");
    setError("");
  };

  // ======================================================
  // SAVE SETTINGS
  // ======================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setSuccess("");
    setError("");

    try {
      const settingsRef = doc(
        db,
        "settings",
        "website"
      );

      await setDoc(
        settingsRef,
        {
          ...formData,
          updatedAt:
            serverTimestamp(),
        },
        {
          merge: true,
        }
      );

      setSuccess(
        "Website settings saved successfully."
      );
    } catch (err) {
      console.error(
        "Save settings error:",
        err
      );

      setError(
        "Unable to save settings. Check your Firestore rules and try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F1E7]">
        <div className="text-center">

          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-[#6B1E1E]/20 border-t-[#6B1E1E]" />

          <p className="mt-4 text-sm font-medium text-[#8B2E2E]">
            Loading website settings...
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F1E7]">

      {/* ==================================================
          HEADER
      ================================================== */}

      <header className="sticky top-0 z-30 border-b border-[#6B1E1E]/15 bg-[#F8F1E7]/95 px-5 py-4 shadow-sm backdrop-blur-md md:px-6">

        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">

          <div className="flex items-center gap-4">

            <Link
              to="/admin/dashboard"
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#6B1E1E] transition hover:bg-[#6B1E1E]/10"
              title="Back to Dashboard"
            >
              <ArrowLeft size={21} />
            </Link>

            <div>

              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#B8863B]">
                Admin Panel
              </p>

              <h1 className="text-xl font-bold text-[#6B1E1E] md:text-2xl">
                Website Settings
              </h1>

              <p className="hidden text-xs text-gray-500 sm:block">
                Manage your website information
                without editing code.
              </p>

            </div>

          </div>

          <Link
            to="/"
            className="hidden items-center gap-2 rounded-md border border-[#6B1E1E]/20 px-4 py-2.5 text-sm font-medium text-[#6B1E1E] transition hover:bg-[#6B1E1E]/10 sm:flex"
          >
            <Globe size={17} />
            View Website
          </Link>

        </div>

      </header>

      {/* ==================================================
          MAIN
      ================================================== */}

      <main className="mx-auto max-w-6xl px-5 py-8 md:px-6 md:py-10">

        <div className="mb-8">

          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#B8863B]">
            Website Management
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#6B1E1E]">
            Business Information
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            Update your shop information here.
            Changes can later be reflected across
            the website without changing code.
          </p>

        </div>

        {/* ==================================================
            ALERTS
        ================================================== */}

        {success && (
          <div className="mb-6 flex items-start gap-3 border border-green-200 bg-green-50 p-4 text-sm text-green-700">

            <CheckCircle
              size={20}
              className="mt-0.5 shrink-0"
            />

            <div>
              <p className="font-semibold">
                Saved successfully
              </p>

              <p className="mt-1">
                {success}
              </p>
            </div>

          </div>
        )}

        {error && (
          <div className="mb-6 flex items-start gap-3 border border-red-200 bg-red-50 p-4 text-sm text-red-700">

            <AlertCircle
              size={20}
              className="mt-0.5 shrink-0"
            />

            <div>
              <p className="font-semibold">
                Something went wrong
              </p>

              <p className="mt-1">
                {error}
              </p>
            </div>

          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* ==================================================
              SHOP INFORMATION
          ================================================== */}

          <section className="bg-white shadow-sm">

            <div className="border-b border-[#6B1E1E]/10 bg-[#F8F1E7] px-6 py-6 md:px-8">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#6B1E1E] text-white">
                  <Store size={22} />
                </div>

                <div>

                  <h2 className="text-xl font-bold text-[#6B1E1E]">
                    Shop Information
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Basic information about your
                    furniture shop.
                  </p>

                </div>

              </div>

            </div>

            <div className="grid gap-6 px-6 py-8 md:grid-cols-2 md:px-8">

              {/* SHOP NAME */}

              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-semibold">
                  Shop Name
                </label>

                <input
                  type="text"
                  name="shopName"
                  value={formData.shopName}
                  onChange={handleChange}
                  placeholder="हरि ॐ Furniture House"
                  className="w-full border border-gray-200 px-4 py-3.5 text-sm outline-none transition focus:border-[#8B2E2E] focus:ring-1 focus:ring-[#8B2E2E]"
                />

              </div>

              {/* ADDRESS */}

              <div className="md:col-span-2">

                <label className="mb-2 flex items-center gap-2 text-sm font-semibold">

                  <MapPin
                    size={16}
                    className="text-[#8B2E2E]"
                  />

                  Shop Address

                </label>

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Enter your complete shop address"
                  className="w-full resize-none border border-gray-200 px-4 py-3.5 text-sm outline-none transition focus:border-[#8B2E2E] focus:ring-1 focus:ring-[#8B2E2E]"
                />

              </div>

              {/* PHONE */}

              <div>

                <label className="mb-2 flex items-center gap-2 text-sm font-semibold">

                  <Phone
                    size={16}
                    className="text-[#8B2E2E]"
                  />

                  Phone Number

                </label>

                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full border border-gray-200 px-4 py-3.5 text-sm outline-none transition focus:border-[#8B2E2E] focus:ring-1 focus:ring-[#8B2E2E]"
                />

              </div>

              {/* WHATSAPP */}

              <div>

                <label className="mb-2 flex items-center gap-2 text-sm font-semibold">

                  <MessageCircle
                    size={16}
                    className="text-[#8B2E2E]"
                  />

                  WhatsApp Number

                </label>

                <input
                  type="text"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="919876543210"
                  className="w-full border border-gray-200 px-4 py-3.5 text-sm outline-none transition focus:border-[#8B2E2E] focus:ring-1 focus:ring-[#8B2E2E]"
                />

                <p className="mt-2 text-xs text-gray-400">
                  Use country code without +,
                  spaces or hyphens.
                </p>

              </div>

              {/* EMAIL */}

              <div>

                <label className="mb-2 flex items-center gap-2 text-sm font-semibold">

                  <Mail
                    size={16}
                    className="text-[#8B2E2E]"
                  />

                  Email

                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="info@hariomfurniture.com"
                  className="w-full border border-gray-200 px-4 py-3.5 text-sm outline-none transition focus:border-[#8B2E2E] focus:ring-1 focus:ring-[#8B2E2E]"
                />

              </div>

              {/* OPENING HOURS */}

              <div>

                <label className="mb-2 flex items-center gap-2 text-sm font-semibold">

                  <Clock
                    size={16}
                    className="text-[#8B2E2E]"
                  />

                  Opening Hours

                </label>

                <input
                  type="text"
                  name="openingHours"
                  value={formData.openingHours}
                  onChange={handleChange}
                  placeholder="Mon - Sun: 10:00 AM - 8:00 PM"
                  className="w-full border border-gray-200 px-4 py-3.5 text-sm outline-none transition focus:border-[#8B2E2E] focus:ring-1 focus:ring-[#8B2E2E]"
                />

              </div>

            </div>

          </section>

          {/* ==================================================
              MAP
          ================================================== */}

          <section className="bg-white shadow-sm">

            <div className="border-b border-[#6B1E1E]/10 bg-[#F8F1E7] px-6 py-6 md:px-8">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F4EBD9] text-[#9A6B43]">
                  <Map size={22} />
                </div>

                <div>

                  <h2 className="text-xl font-bold text-[#6B1E1E]">
                    Google Maps
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Add a link to your shop location.
                  </p>

                </div>

              </div>

            </div>

            <div className="px-6 py-8 md:px-8">

              <label className="mb-2 block text-sm font-semibold">
                Google Maps URL
              </label>

              <input
                type="url"
                name="mapsUrl"
                value={formData.mapsUrl}
                onChange={handleChange}
                placeholder="https://maps.google.com/..."
                className="w-full border border-gray-200 px-4 py-3.5 text-sm outline-none transition focus:border-[#8B2E2E] focus:ring-1 focus:ring-[#8B2E2E]"
              />

              <p className="mt-2 text-xs text-gray-400">
                Paste your Google Maps location link.
              </p>

            </div>

          </section>

          {/* ==================================================
              SOCIAL MEDIA
          ================================================== */}

          <section className="bg-white shadow-sm">

            <div className="border-b border-[#6B1E1E]/10 bg-[#F8F1E7] px-6 py-6 md:px-8">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F5E4E4] text-[#8B2E2E]">

                  <FaInstagram size={22} />

                </div>

                <div>

                  <h2 className="text-xl font-bold text-[#6B1E1E]">
                    Social Media
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Add your social media links.
                  </p>

                </div>

              </div>

            </div>

            <div className="grid gap-6 px-6 py-8 md:grid-cols-2 md:px-8">

              {/* INSTAGRAM */}

              <div>

                <label className="mb-2 flex items-center gap-2 text-sm font-semibold">

                  <FaInstagram
                    size={16}
                    className="text-[#8B2E2E]"
                  />

                  Instagram URL

                </label>

                <input
                  type="url"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  placeholder="https://instagram.com/..."
                  className="w-full border border-gray-200 px-4 py-3.5 text-sm outline-none transition focus:border-[#8B2E2E] focus:ring-1 focus:ring-[#8B2E2E]"
                />

              </div>

              {/* FACEBOOK */}

              <div>

                <label className="mb-2 flex items-center gap-2 text-sm font-semibold">

                  <FaFacebookF
                    size={16}
                    className="text-[#8B2E2E]"
                  />

                  Facebook URL

                </label>

                <input
                  type="url"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleChange}
                  placeholder="https://facebook.com/..."
                  className="w-full border border-gray-200 px-4 py-3.5 text-sm outline-none transition focus:border-[#8B2E2E] focus:ring-1 focus:ring-[#8B2E2E]"
                />

              </div>

            </div>

          </section>

          {/* ==================================================
              FOOTER CONTENT
          ================================================== */}

          <section className="bg-white shadow-sm">

            <div className="border-b border-[#6B1E1E]/10 bg-[#F8F1E7] px-6 py-6 md:px-8">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8EFE5] text-green-700">
                  <Globe size={22} />
                </div>

                <div>

                  <h2 className="text-xl font-bold text-[#6B1E1E]">
                    Footer Content
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Change the description shown
                    in the website footer.
                  </p>

                </div>

              </div>

            </div>

            <div className="px-6 py-8 md:px-8">

              <label className="mb-2 block text-sm font-semibold">
                Footer Description
              </label>

              <textarea
                name="footerDescription"
                value={
                  formData.footerDescription
                }
                onChange={handleChange}
                rows="4"
                placeholder="Write a short description about your furniture shop."
                className="w-full resize-none border border-gray-200 px-4 py-3.5 text-sm outline-none transition focus:border-[#8B2E2E] focus:ring-1 focus:ring-[#8B2E2E]"
              />

            </div>

          </section>

          {/* ==================================================
              SAVE
          ================================================== */}

          <div className="flex flex-col-reverse gap-3 border-t border-[#6B1E1E]/10 pt-6 sm:flex-row sm:justify-end">

            <Link
              to="/admin/dashboard"
              className="px-6 py-3 text-center text-sm font-medium text-gray-600 transition hover:text-[#8B2E2E]"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 bg-[#6B1E1E] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#8B2E2E] disabled:cursor-not-allowed disabled:opacity-60"
            >

              <Save size={18} />

              {saving
                ? "Saving..."
                : "Save Website Settings"}

            </button>

          </div>

        </form>

      </main>

    </div>
  );
}

export default WebsiteSettings;