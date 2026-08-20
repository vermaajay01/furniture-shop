import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  Save,
  Package,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  Globe,
} from "lucide-react";

import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../../firebase/firebase";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    category: "Sofas",
    price: "",
    material: "",
    image: "",
    description: "",
    stockQuantity: 0,
    featured: false,
    available: true,
  });

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // ======================================================
  // LOAD PRODUCT
  // ======================================================

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const productRef = doc(
          db,
          "products",
          id
        );

        const productSnapshot =
          await getDoc(productRef);

        if (!productSnapshot.exists()) {
          setError(
            "Product not found."
          );

          setLoading(false);
          return;
        }

        const product =
          productSnapshot.data();

        setFormData({
          name: product.name || "",
          category:
            product.category ||
            "Sofas",
          price:
            product.price ?? "",
          material:
            product.material || "",
          image:
            product.image || "",
          description:
            product.description || "",

          // Existing products without
          // stockQuantity are treated as 0.
          stockQuantity:
            product.stockQuantity ??
            0,

          featured:
            product.featured === true,

          available:
            product.available === false
              ? false
              : true,
        });

        setLoading(false);
      } catch (err) {
        console.error(
          "Load product error:",
          err
        );

        setError(
          "Unable to load product."
        );

        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

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
  // UPDATE PRODUCT
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
        "Please enter a product image URL."
      );
      return;
    }

    const stockQuantity = Math.max(
      0,
      Math.floor(
        Number(
          formData.stockQuantity || 0
        )
      )
    );

    try {
      setSaving(true);

      const productRef = doc(
        db,
        "products",
        id
      );

      await updateDoc(productRef, {
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

        stockQuantity,

        // Stock quantity controls
        // actual stock availability.
        available:
          stockQuantity > 0 &&
          formData.available,

        featured:
          formData.featured,

        updatedAt:
          serverTimestamp(),
      });

      setSuccess(
        "Product updated successfully."
      );

      setTimeout(() => {
        navigate(
          "/admin/products"
        );
      }, 800);
    } catch (err) {
      console.error(
        "Update product error:",
        err
      );

      setError(
        "Unable to update product. Check your Firestore rules and try again."
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
            Loading product...
          </p>

        </div>

      </div>
    );
  }

  // ======================================================
  // PRODUCT NOT FOUND
  // ======================================================

  if (
    error === "Product not found."
  ) {
    return (
      <div className="min-h-screen bg-[#F8F1E7]">

        <header className="border-b border-[#6B1E1E]/15 bg-[#F8F1E7]">

          <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-5 md:px-6">

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

              <h1 className="text-xl font-bold text-[#6B1E1E]">
                Edit Product
              </h1>

            </div>

          </div>

        </header>

        <main className="mx-auto max-w-3xl px-5 py-16 md:px-6">

          <div className="bg-white p-10 text-center shadow-sm">

            <AlertCircle
              size={45}
              className="mx-auto text-red-400"
            />

            <h2 className="mt-5 text-2xl font-bold text-[#6B1E1E]">
              Product Not Found
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              This product may have been
              deleted or the product ID is
              incorrect.
            </p>

            <Link
              to="/admin/products"
              className="mt-6 inline-flex items-center gap-2 bg-[#6B1E1E] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#8B2E2E]"
            >
              <ArrowLeft size={17} />
              Back to Products
            </Link>

          </div>

        </main>

      </div>
    );
  }

  const imageUrl =
    formData.image.trim();

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <div className="min-h-screen bg-[#F8F1E7]">

      {/* ==================================================
          HEADER
      ================================================== */}

      <header className="sticky top-0 z-30 border-b border-[#6B1E1E]/15 bg-[#F8F1E7]/95 shadow-sm backdrop-blur-md">

        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 md:px-6">

          <div className="flex items-center gap-4">

            <Link
              to="/admin/products"
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#6B1E1E] transition hover:bg-[#6B1E1E]/10"
              title="Back to Products"
            >
              <ArrowLeft size={21} />
            </Link>

            <div>

              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#B8863B]">
                Admin Panel
              </p>

              <h1 className="text-xl font-bold text-[#6B1E1E] md:text-2xl">
                Edit Product
              </h1>

              <p className="hidden text-xs text-gray-500 sm:block">
                Update furniture information
              </p>

            </div>

          </div>

          <Link
            to="/"
            className="hidden items-center gap-2 rounded-md border border-[#6B1E1E]/20 px-4 py-2.5 text-sm font-medium text-[#6B1E1E] transition hover:bg-[#6B1E1E]/10 sm:flex"
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
            Update Product
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            Change the information displayed
            on your Hari Om Furniture House
            website.
          </p>

        </div>

        {/* ==================================================
            ALERTS
        ================================================== */}

        {error && (
          <div className="mb-6 flex items-start gap-3 border border-red-200 bg-red-50 p-4 text-sm text-red-700">

            <AlertCircle
              size={20}
              className="mt-0.5 shrink-0"
            />

            <div>

              <p className="font-semibold">
                Unable to update product
              </p>

              <p className="mt-1">
                {error}
              </p>

            </div>

          </div>
        )}

        {success && (
          <div className="mb-6 flex items-start gap-3 border border-green-200 bg-green-50 p-4 text-sm text-green-700">

            <CheckCircle
              size={20}
              className="mt-0.5 shrink-0"
            />

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
                  Update the details customers
                  will see.
                </p>

              </div>

            </div>

          </div>

          <div className="px-6 py-8 md:px-10">

            <div className="grid gap-7 md:grid-cols-2">

              {/* NAME */}

              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-semibold text-[#2B1714]">
                  Product Name *
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Example: Premium Sheesham Sofa"
                  className="w-full border border-gray-200 px-4 py-3.5 text-sm outline-none transition focus:border-[#8B2E2E] focus:ring-1 focus:ring-[#8B2E2E]"
                />

              </div>

              {/* CATEGORY */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-[#2B1714]">
                  Category *
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border border-gray-200 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#8B2E2E] focus:ring-1 focus:ring-[#8B2E2E]"
                >
                  <option value="Sofas">
                    Sofas
                  </option>

                  <option value="Beds">
                    Beds
                  </option>

                  <option value="Tables">
                    Tables
                  </option>

                  <option value="Chairs">
                    Chairs
                  </option>

                  <option value="Wardrobes">
                    Wardrobes
                  </option>

                  <option value="TV Units">
                    TV Units
                  </option>

                  <option value="Study Tables">
                    Study Tables
                  </option>

                  <option value="Shoe Racks">
                    Shoe Racks
                  </option>

                  <option value="Bookshelves">
                    Bookshelves
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>

              </div>

              {/* PRICE */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-[#2B1714]">
                  Price (₹) *
                </label>

                <div className="relative">

                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-medium text-[#8B2E2E]">
                    ₹
                  </span>

                  <input
                    type="number"
                    name="price"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="24999"
                    className="w-full border border-gray-200 py-3.5 pl-9 pr-4 text-sm outline-none transition focus:border-[#8B2E2E] focus:ring-1 focus:ring-[#8B2E2E]"
                  />

                </div>

              </div>

              {/* MATERIAL */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-[#2B1714]">
                  Material
                </label>

                <input
                  type="text"
                  name="material"
                  value={formData.material}
                  onChange={handleChange}
                  placeholder="Sheesham Wood"
                  className="w-full border border-gray-200 px-4 py-3.5 text-sm outline-none transition focus:border-[#8B2E2E] focus:ring-1 focus:ring-[#8B2E2E]"
                />

              </div>

              {/* STOCK QUANTITY */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-[#2B1714]">
                  Stock Quantity *
                </label>

                <input
                  type="number"
                  name="stockQuantity"
                  min="0"
                  step="1"
                  value={
                    formData.stockQuantity
                  }
                  onChange={handleChange}
                  placeholder="10"
                  className="w-full border border-gray-200 px-4 py-3.5 text-sm outline-none transition focus:border-[#8B2E2E] focus:ring-1 focus:ring-[#8B2E2E]"
                />

                <p className="mt-2 text-xs text-gray-400">
                  Set to 0 when the product
                  is out of stock.
                </p>

              </div>

              {/* IMAGE */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-[#2B1714]">
                  Image URL *
                </label>

                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full border border-gray-200 px-4 py-3.5 text-sm outline-none transition focus:border-[#8B2E2E] focus:ring-1 focus:ring-[#8B2E2E]"
                />

                <p className="mt-2 text-xs text-gray-400">
                  Paste a direct image URL.
                </p>

              </div>

              {/* DESCRIPTION */}

              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-semibold text-[#2B1714]">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Describe the furniture, its design, material and features..."
                  className="w-full resize-none border border-gray-200 px-4 py-3.5 text-sm outline-none transition focus:border-[#8B2E2E] focus:ring-1 focus:ring-[#8B2E2E]"
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

                <div>

                  <h3 className="font-semibold text-[#6B1E1E]">
                    Product Image
                  </h3>

                  <p className="text-xs text-gray-500">
                    Preview the current or updated
                    product image.
                  </p>

                </div>

              </div>

              <div className="overflow-hidden border border-gray-200 bg-[#F8F1E7]">

                {imageUrl ? (
                  <div className="relative aspect-[16/7] w-full">

                    <img
                      src={imageUrl}
                      alt={
                        formData.name ||
                        "Product preview"
                      }
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display =
                          "none";

                        const errorElement =
                          e.currentTarget.parentElement?.querySelector(
                            ".image-error"
                          );

                        if (
                          errorElement
                        ) {
                          errorElement.classList.remove(
                            "hidden"
                          );

                          errorElement.classList.add(
                            "flex"
                          );
                        }
                      }}
                    />

                    <div className="image-error absolute inset-0 hidden items-center justify-center">

                      <div className="text-center">

                        <ImageIcon
                          size={38}
                          className="mx-auto text-gray-300"
                        />

                        <p className="mt-3 text-sm text-gray-500">
                          Unable to load image
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          Check the image URL.
                        </p>

                      </div>

                    </div>

                  </div>
                ) : (
                  <div className="flex h-52 items-center justify-center">

                    <div className="text-center">

                      <ImageIcon
                        size={40}
                        className="mx-auto text-gray-300"
                      />

                      <p className="mt-3 text-sm text-gray-500">
                        No image available
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

              <p className="mt-1 text-sm text-gray-500">
                Control how this product appears
                on your website.
              </p>

              <div className="mt-5 grid gap-4 md:grid-cols-2">

                {/* AVAILABLE */}

                <label
                  className={`flex cursor-pointer items-start gap-4 border p-5 transition ${
                    formData.available
                      ? "border-[#8B2E2E]/30 bg-[#F8F1E7]"
                      : "border-gray-200 bg-white"
                  }`}
                >

                  <input
                    type="checkbox"
                    name="available"
                    checked={
                      formData.available
                    }
                    onChange={handleChange}
                    className="mt-1 h-5 w-5 accent-[#8B2E2E]"
                  />

                  <div>

                    <p className="font-semibold text-[#6B1E1E]">
                      Show Product
                    </p>

                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      Allow this product to
                      appear on the website.
                    </p>

                  </div>

                </label>

                {/* FEATURED */}

                <label
                  className={`flex cursor-pointer items-start gap-4 border p-5 transition ${
                    formData.featured
                      ? "border-[#B8863B]/40 bg-[#FFF8EA]"
                      : "border-gray-200 bg-white"
                  }`}
                >

                  <input
                    type="checkbox"
                    name="featured"
                    checked={
                      formData.featured
                    }
                    onChange={handleChange}
                    className="mt-1 h-5 w-5 accent-[#B8863B]"
                  />

                  <div>

                    <p className="font-semibold text-[#6B1E1E]">
                      Featured Product
                    </p>

                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      Highlight this product in
                      featured sections.
                    </p>

                  </div>

                </label>

              </div>

              {/* ==================================================
                  STOCK STATUS PREVIEW
              ================================================== */}

              <div className="mt-5 border border-gray-200 bg-[#F8F1E7] p-5">

                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Customer Stock Preview
                </p>

                {Number(
                  formData.stockQuantity || 0
                ) <= 0 ? (
                  <p className="mt-2 font-semibold text-red-600">
                    ✕ Out of Stock
                  </p>
                ) : Number(
                    formData.stockQuantity
                  ) <= 2 ? (
                  <p className="mt-2 font-semibold text-orange-600">
                    ⚠ Only{" "}
                    {Number(
                      formData.stockQuantity
                    )}{" "}
                    {Number(
                      formData.stockQuantity
                    ) === 1
                      ? "item"
                      : "items"}{" "}
                    left
                  </p>
                ) : (
                  <p className="mt-2 font-semibold text-green-700">
                    ✓{" "}
                    {Number(
                      formData.stockQuantity
                    )}{" "}
                    items in stock
                  </p>
                )}

              </div>

            </div>

            {/* ==================================================
                BUTTONS
            ================================================== */}

            <div className="mt-10 flex flex-col-reverse gap-3 border-t border-gray-100 pt-8 sm:flex-row sm:justify-end">

              <Link
                to="/admin/products"
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
                  ? "Updating..."
                  : "Update Product"}

              </button>

            </div>

          </div>

        </form>

      </main>

    </div>
  );
}

export default EditProduct;