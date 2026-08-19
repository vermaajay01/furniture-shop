import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  Plus,
  Pencil,
  Trash2,
  Package,
  ArrowLeft,
  Database,
  CheckCircle,
  AlertCircle,
  Globe,
} from "lucide-react";

import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  writeBatch,
} from "firebase/firestore";

import { db } from "../../firebase/firebase";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ======================================================
  // INITIAL PRODUCTS
  // ======================================================

  const defaultProducts = [
    {
      id: "1",
      name: "Classic Wooden Sofa",
      category: "Sofas",
      price: 24999,
      material: "Solid Wood",
      image:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80",
      description:
        "Beautifully crafted wooden sofa.",
      featured: true,
      available: true,
    },
    {
      id: "2",
      name: "Modern King Bed",
      category: "Beds",
      price: 34999,
      material: "Sheesham Wood",
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
      description:
        "Premium king-size wooden bed.",
      featured: true,
      available: true,
    },
    {
      id: "3",
      name: "Dining Table Set",
      category: "Tables",
      price: 29999,
      material: "Solid Wood",
      image:
        "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=900&q=80",
      description:
        "Elegant wooden dining table set.",
      featured: true,
      available: true,
    },
    {
      id: "4",
      name: "Designer Armchair",
      category: "Chairs",
      price: 12999,
      material: "Wood & Fabric",
      image:
        "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=900&q=80",
      description:
        "Comfortable designer armchair.",
      featured: true,
      available: true,
    },
  ];

  // ======================================================
  // LOAD PRODUCTS
  // ======================================================

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const snapshot = await getDocs(
        collection(db, "products")
      );

      const productList =
        snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

      setProducts(productList);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to load products. Check your Firestore setup and security rules."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // ======================================================
  // SEED PRODUCTS
  // ======================================================

  const seedProducts = async () => {
    try {
      setSeeding(true);
      setError("");
      setMessage("");

      const batch = writeBatch(db);

      defaultProducts.forEach(
        (product) => {
          const productRef = doc(
            db,
            "products",
            product.id
          );

          batch.set(productRef, {
            name: product.name,
            category: product.category,
            price: product.price,
            material: product.material,
            image: product.image,
            description:
              product.description,
            featured:
              product.featured,
            available:
              product.available,
          });
        }
      );

      await batch.commit();

      setMessage(
        "Your 4 furniture products have been added to Firestore."
      );

      await loadProducts();
    } catch (err) {
      console.error(err);

      setError(
        "Could not create products. Make sure Firestore is enabled and your security rules allow this admin account."
      );
    } finally {
      setSeeding(false);
    }
  };

  // ======================================================
  // DELETE PRODUCT
  // ======================================================

  const deleteProduct = async (
    productId
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this product?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await deleteDoc(
        doc(
          db,
          "products",
          productId
        )
      );

      setProducts((previous) =>
        previous.filter(
          (product) =>
            product.id !== productId
        )
      );

      setMessage(
        "Product deleted successfully."
      );
    } catch (err) {
      console.error(err);

      setError(
        "Unable to delete the product."
      );
    }
  };

  // ======================================================
  // CLEAR MESSAGES
  // ======================================================

  const clearMessages = () => {
    setMessage("");
    setError("");
  };

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <div className="min-h-screen bg-[#F8F1E7]">

      {/* ==================================================
          HEADER
      ================================================== */}

      <header className="sticky top-0 z-30 border-b border-[#6B1E1E]/15 bg-[#F8F1E7]/95 backdrop-blur-md">

        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-6">

          {/* LEFT */}

          <div className="flex min-w-0 items-center gap-4">

            <Link
              to="/admin/dashboard"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#6B1E1E] transition hover:bg-[#6B1E1E]/10"
              title="Back to Dashboard"
            >
              <ArrowLeft size={21} />
            </Link>

            <div className="min-w-0">

              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#B8863B]">
                Admin Panel
              </p>

              <h1 className="truncate text-xl font-bold text-[#6B1E1E] md:text-2xl">
                Products
              </h1>

              <p className="hidden text-xs text-gray-500 sm:block">
                Manage your furniture collection
              </p>

            </div>

          </div>

          {/* RIGHT */}

          <div className="flex items-center gap-2">

            <Link
              to="/"
              className="hidden items-center gap-2 rounded-md border border-[#6B1E1E]/20 px-4 py-2.5 text-sm font-medium text-[#6B1E1E] transition hover:bg-[#6B1E1E]/10 sm:flex"
            >
              <Globe size={17} />
              View Store
            </Link>

            <Link
              to="/admin/products/add"
              className="flex items-center gap-2 rounded-md bg-[#6B1E1E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#8B2E2E]"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">
                Add Product
              </span>
              <span className="sm:hidden">
                Add
              </span>
            </Link>

          </div>

        </div>

      </header>

      {/* ==================================================
          MAIN
      ================================================== */}

      <main className="mx-auto max-w-7xl px-5 py-8 md:px-6 md:py-10">

        {/* ==================================================
            MESSAGES
        ================================================== */}

        {message && (
          <div className="mb-6 flex items-start gap-3 border border-green-200 bg-green-50 p-4 text-sm text-green-700">

            <CheckCircle
              size={20}
              className="mt-0.5 shrink-0"
            />

            <div className="flex-1">
              <p>{message}</p>
            </div>

            <button
              type="button"
              onClick={clearMessages}
              className="font-bold text-green-700"
            >
              ×
            </button>

          </div>
        )}

        {error && (
          <div className="mb-6 flex items-start gap-3 border border-red-200 bg-red-50 p-4 text-sm text-red-700">

            <AlertCircle
              size={20}
              className="mt-0.5 shrink-0"
            />

            <div className="flex-1">
              <p>{error}</p>
            </div>

            <button
              type="button"
              onClick={clearMessages}
              className="font-bold text-red-700"
            >
              ×
            </button>

          </div>
        )}

        {/* ==================================================
            PAGE INTRO
        ================================================== */}

        <div className="mb-8">

          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#B8863B]">
            Furniture Collection
          </p>

          <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

            <div>

              <h2 className="text-3xl font-bold text-[#6B1E1E]">
                Manage Products
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                Add, edit and remove products
                displayed on your customer
                website.
              </p>

            </div>

            {!loading && (
              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#6B1E1E] text-white">
                  <Package size={19} />
                </div>

                <div>

                  <p className="font-bold text-[#6B1E1E]">
                    {products.length}
                  </p>

                  <p className="text-xs text-gray-500">
                    Products
                  </p>

                </div>

              </div>
            )}

          </div>

        </div>

        {/* ==================================================
            DATABASE SETUP
        ================================================== */}

        {products.length === 0 &&
          !loading && (
            <div className="mb-10 overflow-hidden bg-[#6B1E1E]">

              <div className="p-7 md:p-8">

                <div className="flex flex-col gap-6 sm:flex-row">

                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#B8863B]">
                    <Database size={28} />
                  </div>

                  <div className="flex-1">

                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#B8863B]">
                      Firestore Setup
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-white">
                      Set up your furniture collection
                    </h2>

                    <p className="mt-3 max-w-2xl leading-7 text-white/70">
                      Your Firestore database
                      doesn't contain any
                      products yet. Create the
                      initial furniture collection
                      to get started.
                    </p>

                    <button
                      type="button"
                      onClick={seedProducts}
                      disabled={seeding}
                      className="mt-6 flex items-center gap-2 rounded-md bg-[#B8863B] px-6 py-3 font-semibold text-white transition hover:bg-[#9A6B32] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Database size={18} />

                      {seeding
                        ? "Creating Products..."
                        : "Create Initial Products"}
                    </button>

                  </div>

                </div>

              </div>

            </div>
          )}

        {/* ==================================================
            LOADING
        ================================================== */}

        {loading && (
          <div className="bg-white py-20 text-center shadow-sm">

            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#6B1E1E]/20 border-t-[#6B1E1E]" />

            <p className="mt-5 text-sm font-medium text-[#8B2E2E]">
              Loading products...
            </p>

          </div>
        )}

        {/* ==================================================
            EMPTY STATE
        ================================================== */}

        {!loading &&
          products.length === 0 && (
            <div className="bg-white p-12 text-center shadow-sm">

              <Package
                size={45}
                className="mx-auto text-gray-300"
              />

              <h3 className="mt-5 text-xl font-bold text-[#6B1E1E]">
                No products yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                Create your initial products
                above or add a new product
                manually.
              </p>

              <Link
                to="/admin/products/add"
                className="mt-6 inline-flex items-center gap-2 bg-[#6B1E1E] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#8B2E2E]"
              >
                <Plus size={18} />
                Add Product
              </Link>

            </div>
          )}

        {/* ==================================================
            PRODUCTS DESKTOP
        ================================================== */}

        {!loading &&
          products.length > 0 && (
            <div className="hidden overflow-hidden bg-white shadow-sm md:block">

              <div className="overflow-x-auto">

                <table className="w-full min-w-[900px]">

                  <thead className="border-b border-[#6B1E1E]/10 bg-[#F8F1E7]">

                    <tr>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#6B1E1E]">
                        Product
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#6B1E1E]">
                        Category
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#6B1E1E]">
                        Price
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#6B1E1E]">
                        Status
                      </th>

                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-[#6B1E1E]">
                        Actions
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {products.map(
                      (product) => (
                        <tr
                          key={
                            product.id
                          }
                          className="border-b border-gray-100 last:border-0 hover:bg-[#F8F1E7]/50"
                        >

                          {/* PRODUCT */}

                          <td className="px-6 py-5">

                            <div className="flex items-center gap-4">

                              <img
                                src={
                                  product.image
                                }
                                alt={
                                  product.name
                                }
                                className="h-16 w-16 object-cover"
                              />

                              <div>

                                <p className="font-semibold text-[#6B1E1E]">
                                  {
                                    product.name
                                  }
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                  {
                                    product.material
                                  }
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* CATEGORY */}

                          <td className="px-6 py-5">

                            <span className="text-sm text-gray-600">
                              {
                                product.category
                              }
                            </span>

                          </td>

                          {/* PRICE */}

                          <td className="px-6 py-5">

                            <span className="font-semibold text-[#8B2E2E]">
                              ₹
                              {Number(
                                product.price ||
                                  0
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </span>

                          </td>

                          {/* STATUS */}

                          <td className="px-6 py-5">

                            <div className="flex flex-col gap-2">

                              <span
                                className={`w-fit px-3 py-1 text-xs font-medium ${
                                  product.available ===
                                  false
                                    ? "bg-red-100 text-red-700"
                                    : "bg-green-100 text-green-700"
                                }`}
                              >
                                {product.available ===
                                false
                                  ? "Unavailable"
                                  : "Available"}
                              </span>

                              {product.featured && (
                                <span className="w-fit bg-[#F8E8C8] px-3 py-1 text-xs font-medium text-[#7A571E]">
                                  Featured
                                </span>
                              )}

                            </div>

                          </td>

                          {/* ACTIONS */}

                          <td className="px-6 py-5">

                            <div className="flex justify-end gap-2">

                              <Link
                                to={`/admin/products/edit/${product.id}`}
                                className="flex items-center gap-2 border border-[#8B2E2E]/20 px-3 py-2 text-sm text-[#8B2E2E] transition hover:bg-[#8B2E2E] hover:text-white"
                              >
                                <Pencil
                                  size={16}
                                />
                                Edit
                              </Link>

                              <button
                                type="button"
                                onClick={() =>
                                  deleteProduct(
                                    product.id
                                  )
                                }
                                className="flex items-center gap-2 border border-red-200 px-3 py-2 text-sm text-red-600 transition hover:bg-red-600 hover:text-white"
                              >
                                <Trash2
                                  size={16}
                                />
                                Delete
                              </button>

                            </div>

                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>

              </div>

            </div>
          )}

        {/* ==================================================
            PRODUCTS MOBILE
        ================================================== */}

        {!loading &&
          products.length > 0 && (
            <div className="space-y-4 md:hidden">

              {products.map(
                (product) => (
                  <div
                    key={product.id}
                    className="bg-white p-5 shadow-sm"
                  >

                    {/* PRODUCT TOP */}

                    <div className="flex gap-4">

                      <img
                        src={
                          product.image
                        }
                        alt={
                          product.name
                        }
                        className="h-20 w-20 shrink-0 object-cover"
                      />

                      <div className="min-w-0 flex-1">

                        <div className="flex items-start justify-between gap-3">

                          <div>

                            <h3 className="font-semibold text-[#6B1E1E]">
                              {
                                product.name
                              }
                            </h3>

                            <p className="mt-1 text-xs text-gray-500">
                              {
                                product.material
                              }
                            </p>

                          </div>

                          <p className="shrink-0 font-bold text-[#8B2E2E]">
                            ₹
                            {Number(
                              product.price ||
                                0
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </p>

                        </div>

                        <p className="mt-3 text-xs text-gray-500">
                          Category:{" "}
                          <span className="font-medium text-gray-700">
                            {
                              product.category
                            }
                          </span>
                        </p>

                      </div>

                    </div>

                    {/* STATUS */}

                    <div className="mt-5 flex flex-wrap gap-2">

                      <span
                        className={`px-3 py-1 text-xs font-medium ${
                          product.available ===
                          false
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {product.available ===
                        false
                          ? "Unavailable"
                          : "Available"}
                      </span>

                      {product.featured && (
                        <span className="bg-[#F8E8C8] px-3 py-1 text-xs font-medium text-[#7A571E]">
                          Featured
                        </span>
                      )}

                    </div>

                    {/* ACTIONS */}

                    <div className="mt-5 grid grid-cols-2 gap-2">

                      <Link
                        to={`/admin/products/edit/${product.id}`}
                        className="flex items-center justify-center gap-2 border border-[#8B2E2E]/20 py-2.5 text-sm font-medium text-[#8B2E2E] transition hover:bg-[#8B2E2E] hover:text-white"
                      >
                        <Pencil
                          size={16}
                        />
                        Edit
                      </Link>

                      <button
                        type="button"
                        onClick={() =>
                          deleteProduct(
                            product.id
                          )
                        }
                        className="flex items-center justify-center gap-2 border border-red-200 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-600 hover:text-white"
                      >
                        <Trash2
                          size={16}
                        />
                        Delete
                      </button>

                    </div>

                  </div>
                )
              )}

            </div>
          )}

      </main>

    </div>
  );
}

export default AdminProducts;