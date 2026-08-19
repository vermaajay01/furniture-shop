import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import {
  ArrowLeft,
  Save,
  Package,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  Globe,
  X,
} from "lucide-react";

import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../../firebase/firebase";

function AddProduct() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    category: "Sofas",
    price: "",
    material: "",
    image: "",
    description: "",
    featured: false,
    available: true,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ======================================================
  // HANDLE INPUT
  // ======================================================

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    setError("");
    setSuccess("");
  };

  // ======================================================
  // SUBMIT
  // ======================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.name.trim()) {
      setError(
        "Please enter a product name."
      );
      return;
    }

    if (
      !formData.price ||
      Number(formData.price) <= 0
    ) {
      setError(
        "Please enter a valid price."
      );
      return;
    }

    if (!formData.image.trim()) {
      setError(
        "Please enter an image URL."
      );
      return;
    }

    try {
      setSaving(true);

      // ==================================================
      // SAVE PRODUCT TO FIRESTORE
      // ==================================================

      await addDoc(
        collection(db, "products"),
        {
          name:
            formData.name.trim(),

          category:
            formData.category,

          price:
            Number(formData.price),

          material:
            formData.material.trim(),

          image:
            formData.image.trim(),

          description:
            formData.description.trim(),

          featured:
            formData.featured,

          available:
            formData.available,

          createdAt:
            serverTimestamp(),

          updatedAt:
            serverTimestamp(),
        }
      );

      setSuccess(
        "Product added successfully."
      );

      setTimeout(() => {
        navigate(
          "/admin/products"
        );
      }, 800);

    } catch (err) {
      console.error(
        "Add product error:",
        err
      );

      setError(
        err.message ||
          "Unable to add product. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <div className="min-h-screen bg-[#F8F1E7]">

      {/* ==================================================
          HEADER
      ================================================== */}

      <header className="sticky top-0 z-30 border-b border-[#6B1E1E]/15 bg-[#F8F1E7]/95 shadow-sm backdrop-blur-md">

        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-6">

          <div className="flex items-center gap-4">

            <Link
              to="/admin/products"
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#6B1E1E] transition hover:bg-[#6B1E1E]/10"
            >
              <ArrowLeft size={21} />
            </Link>

            <div>

              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#B8863B]">
                Admin Panel
              </p>

              <h1 className="text-xl font-bold text-[#6B1E1E] md:text-2xl">
                Add Product
              </h1>

            </div>

          </div>

          <Link
            to="/"
            className="hidden items-center gap-2 border border-[#6B1E1E]/20 px-4 py-2.5 text-sm font-medium text-[#6B1E1E] hover:bg-[#6B1E1E]/10 sm:flex"
          >
            <Globe size={17} />
            View Store
          </Link>

        </div>

      </header>

      {/* ==================================================
          MAIN
      ================================================== */}

      <main className="mx-auto max-w-6xl px-5 py-8 md:px-6 md:py-10">

        <div className="mb-8">

          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#B8863B]">
            Furniture Collection
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#6B1E1E]">
            Create New Product
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Add furniture directly from your
            admin panel.
          </p>

        </div>

        {/* ==================================================
            ERROR
        ================================================== */}

        {error && (
          <div className="mb-6 flex gap-3 border border-red-200 bg-red-50 p-4 text-sm text-red-700">

            <AlertCircle
              size={20}
              className="shrink-0"
            />

            <div>

              <p className="font-semibold">
                Unable to save product
              </p>

              <p className="mt-1">
                {error}
              </p>

            </div>

          </div>
        )}

        {/* ==================================================
            SUCCESS
        ================================================== */}

        {success && (
          <div className="mb-6 flex gap-3 border border-green-200 bg-green-50 p-4 text-sm text-green-700">

            <CheckCircle size={20} />

            <div>

              <p className="font-semibold">
                Success
              </p>

              <p className="mt-1">
                {success}
              </p>

            </div>

          </div>
        )}

        {/* ==================================================
            FORM
        ================================================== */}

        <form
          onSubmit={handleSubmit}
          className="overflow-hidden bg-white shadow-sm"
        >

          {/* FORM HEADER */}

          <div className="border-b border-[#6B1E1E]/10 bg-[#F8F1E7] px-6 py-6 md:px-10">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#6B1E1E] text-white">
                <Package size={22} />
              </div>

              <div>

                <h3 className="text-xl font-bold text-[#6B1E1E]">
                  Product Information
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Enter the details customers
                  will see.
                </p>

              </div>

            </div>

          </div>

          <div className="px-6 py-8 md:px-10">

            <div className="grid gap-7 md:grid-cols-2">

              {/* ==================================================
                  NAME
              ================================================== */}

              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-semibold text-[#2B1714]">
                  Product Name *
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Classic Wooden Sofa"
                  className="w-full border border-gray-200 px-4 py-3.5 text-sm outline-none focus:border-[#8B2E2E] focus:ring-1 focus:ring-[#8B2E2E]"
                />

              </div>

              {/* ==================================================
                  CATEGORY
              ================================================== */}

              <div>

                <label className="mb-2 block text-sm font-semibold">
                  Category *
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border border-gray-200 bg-white px-4 py-3.5 text-sm outline-none focus:border-[#8B2E2E]"
                >
                  <option>Sofas</option>
                  <option>Beds</option>
                  <option>Tables</option>
                  <option>Chairs</option>
                  <option>Wardrobes</option>
                  <option>TV Units</option>
                  <option>Study Tables</option>
                  <option>Shoe Racks</option>
                  <option>Bookshelves</option>
                  <option>Other</option>
                </select>

              </div>

              {/* ==================================================
                  PRICE
              ================================================== */}

              <div>

                <label className="mb-2 block text-sm font-semibold">
                  Price (₹) *
                </label>

                <div className="relative">

                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B2E2E]">
                    ₹
                  </span>

                  <input
                    type="number"
                    name="price"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="24999"
                    className="w-full border border-gray-200 py-3.5 pl-9 pr-4 text-sm outline-none focus:border-[#8B2E2E]"
                  />

                </div>

              </div>

              {/* ==================================================
                  MATERIAL
              ================================================== */}

              <div>

                <label className="mb-2 block text-sm font-semibold">
                  Material
                </label>

                <input
                  type="text"
                  name="material"
                  value={formData.material}
                  onChange={handleChange}
                  placeholder="Sheesham Wood"
                  className="w-full border border-gray-200 px-4 py-3.5 text-sm outline-none focus:border-[#8B2E2E]"
                />

              </div>

              {/* ==================================================
                  IMAGE URL
              ================================================== */}

              <div>

                <label className="mb-2 block text-sm font-semibold">
                  Product Image URL *
                </label>

                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/sofa.jpg"
                  className="w-full border border-gray-200 px-4 py-3.5 text-sm outline-none focus:border-[#8B2E2E]"
                />

                <p className="mt-2 text-xs text-gray-400">
                  Paste a direct image URL.
                </p>

              </div>

              {/* ==================================================
                  DESCRIPTION
              ================================================== */}

              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-semibold">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Describe the furniture..."
                  className="w-full resize-none border border-gray-200 px-4 py-3.5 text-sm outline-none focus:border-[#8B2E2E]"
                />

              </div>

            </div>

            {/* ==================================================
                IMAGE PREVIEW
            ================================================== */}

            <div className="mt-8 border-t border-gray-100 pt-8">

              <div className="mb-4 flex items-center gap-3">

                <ImageIcon
                  size={19}
                  className="text-[#8B2E2E]"
                />

                <h3 className="font-semibold text-[#6B1E1E]">
                  Product Image Preview
                </h3>

              </div>

              <div className="overflow-hidden border border-gray-200 bg-[#F8F1E7]">

                {formData.image ? (
                  <div className="relative">

                    <img
                      src={formData.image}
                      alt="Product preview"
                      className="h-72 w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display =
                          "none";
                      }}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setFormData(
                          (previous) => ({
                            ...previous,
                            image: "",
                          })
                        )
                      }
                      className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#6B1E1E] text-white shadow-lg hover:bg-[#8B2E2E]"
                      aria-label="Remove image URL"
                    >
                      <X size={18} />
                    </button>

                  </div>
                ) : (
                  <div className="flex h-56 items-center justify-center">

                    <div className="text-center">

                      <ImageIcon
                        size={40}
                        className="mx-auto text-gray-300"
                      />

                      <p className="mt-3 text-sm text-gray-500">
                        No image URL added
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        Paste an image URL above
                      </p>

                    </div>

                  </div>
                )}

              </div>

            </div>

            {/* ==================================================
                OPTIONS
            ================================================== */}

            <div className="mt-8 border-t border-gray-100 pt-8">

              <h3 className="font-semibold text-[#6B1E1E]">
                Product Options
              </h3>

              <div className="mt-5 grid gap-4 md:grid-cols-2">

                {/* AVAILABLE */}

                <label
                  className={`flex cursor-pointer gap-4 border p-5 ${
                    formData.available
                      ? "border-[#8B2E2E]/30 bg-[#F8F1E7]"
                      : "border-gray-200"
                  }`}
                >

                  <input
                    type="checkbox"
                    name="available"
                    checked={formData.available}
                    onChange={handleChange}
                    className="mt-1 h-5 w-5 accent-[#8B2E2E]"
                  />

                  <div>

                    <p className="font-semibold text-[#6B1E1E]">
                      Available
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Show this product to
                      customers.
                    </p>

                  </div>

                </label>

                {/* FEATURED */}

                <label
                  className={`flex cursor-pointer gap-4 border p-5 ${
                    formData.featured
                      ? "border-[#B8863B]/40 bg-[#FFF8EA]"
                      : "border-gray-200"
                  }`}
                >

                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="mt-1 h-5 w-5 accent-[#B8863B]"
                  />

                  <div>

                    <p className="font-semibold text-[#6B1E1E]">
                      Featured Product
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Highlight this product.
                    </p>

                  </div>

                </label>

              </div>

            </div>

            {/* ==================================================
                BUTTONS
            ================================================== */}

            <div className="mt-10 flex flex-col-reverse gap-3 border-t border-gray-100 pt-8 sm:flex-row sm:justify-end">

              <Link
                to="/admin/products"
                className="px-6 py-3 text-center text-sm font-medium text-gray-600 hover:text-[#8B2E2E]"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={saving}
                className="flex items-center justify-center gap-2 bg-[#6B1E1E] px-7 py-3 text-sm font-semibold text-white hover:bg-[#8B2E2E] disabled:cursor-not-allowed disabled:opacity-60"
              >

                <Save size={18} />

                {saving
                  ? "Saving..."
                  : "Save Product"}

              </button>

            </div>

          </div>

        </form>

      </main>

    </div>
  );
}

export default AddProduct;