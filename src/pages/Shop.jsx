import { useEffect, useMemo, useState } from "react";
import {
  Link,
  useSearchParams,
} from "react-router-dom";

import {
  Loader2,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "../firebase/firebase";
import ProductCard from "../components/ProductCard";

function Shop() {
  const [searchParams, setSearchParams] =
    useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const urlSearch =
    searchParams.get("search") || "";

  const selectedCategory =
    searchParams.get("category") || "All";

  const [search, setSearch] =
    useState(urlSearch);

  // ======================================================
  // KEEP SEARCH FIELD IN SYNC WITH URL
  // ======================================================

  useEffect(() => {
    setSearch(urlSearch);
  }, [urlSearch]);

  // ======================================================
  // LOAD PRODUCTS
  // ======================================================

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);

        const snapshot = await getDocs(
          collection(db, "products")
        );

        const productList =
          snapshot.docs.map((item) => ({
            id: item.id,
            ...item.data(),
          }));

        setProducts(productList);
      } catch (error) {
        console.error(
          "Unable to load products:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // ======================================================
  // FILTER PRODUCTS
  // ======================================================

  const filteredProducts = useMemo(() => {

    const searchText =
      search.trim().toLowerCase();

    return products.filter((product) => {

      if (product.available === false) {
        return false;
      }

      const categoryMatch =
        selectedCategory === "All" ||
        product.category === selectedCategory;

      const searchMatch =
        !searchText ||
        product.name
          ?.toLowerCase()
          .includes(searchText) ||
        product.category
          ?.toLowerCase()
          .includes(searchText) ||
        product.material
          ?.toLowerCase()
          .includes(searchText) ||
        product.description
          ?.toLowerCase()
          .includes(searchText);

      return (
        categoryMatch &&
        searchMatch
      );
    });

  }, [
    products,
    selectedCategory,
    search,
  ]);

  // ======================================================
  // CATEGORIES
  // ======================================================

  const categories = [
    "All",
    "Sofas",
    "Beds",
    "Tables",
    "Chairs",
    "Wardrobes",
    "TV Units",
    "Study Tables",
    "Shoe Racks",
    "Bookshelves",
    "Other",
  ];

  // ======================================================
  // CATEGORY CHANGE
  // ======================================================

  const handleCategoryChange = (
    category
  ) => {

    const nextParams = {};

    if (category !== "All") {
      nextParams.category = category;
    }

    if (search.trim()) {
      nextParams.search =
        search.trim();
    }

    setSearchParams(nextParams);
  };

  // ======================================================
  // SEARCH CHANGE
  // ======================================================

  const handleSearch = (e) => {

    const value = e.target.value;

    setSearch(value);

    const nextParams = {};

    if (selectedCategory !== "All") {
      nextParams.category =
        selectedCategory;
    }

    if (value.trim()) {
      nextParams.search =
        value.trim();
    }

    setSearchParams(nextParams);
  };

  // ======================================================
  // CLEAR FILTERS
  // ======================================================

  const clearFilters = () => {
    setSearch("");
    setSearchParams({});
  };

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <div className="min-h-screen bg-[#F8F1E7]">

      {/* ==================================================
          SHOP HERO
      ================================================== */}

      <section className="bg-[#3A0D0D] px-6 py-20 text-white">

        <div className="mx-auto max-w-7xl">

          <p className="text-sm uppercase tracking-[0.3em] text-[#E0B66B]">
            Our Collection
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-6xl">
            Furniture Shop
          </h1>

          <p className="mt-5 max-w-2xl leading-7 text-white/70">
            Explore our collection of beautifully
            crafted furniture for every room in
            your home.
          </p>

        </div>

      </section>

      {/* ==================================================
          SHOP CONTENT
      ================================================== */}

      <main className="mx-auto max-w-7xl px-6 py-12">

        {/* SEARCH */}

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div className="relative w-full lg:max-w-md">

            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search furniture..."
              className="w-full border border-gray-200 bg-white py-3.5 pl-11 pr-10 text-sm outline-none transition focus:border-[#8B2E2E] focus:ring-1 focus:ring-[#8B2E2E]"
            />

            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  const nextParams = {};

                  if (
                    selectedCategory !==
                    "All"
                  ) {
                    nextParams.category =
                      selectedCategory;
                  }

                  setSearchParams(
                    nextParams
                  );
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#8B2E2E]"
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}

          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">

            <SlidersHorizontal size={17} />

            <span>
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1
                ? "product"
                : "products"}
            </span>

          </div>

        </div>

        {/* CATEGORIES */}

        <div className="mt-8 flex gap-2 overflow-x-auto pb-2">

          {categories.map((category) => {

            const active =
              selectedCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() =>
                  handleCategoryChange(
                    category
                  )
                }
                className={`whitespace-nowrap border px-5 py-2.5 text-sm font-medium transition ${
                  active
                    ? "border-[#6B1E1E] bg-[#6B1E1E] text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:border-[#8B2E2E] hover:text-[#8B2E2E]"
                }`}
              >
                {category}
              </button>
            );

          })}

        </div>

        {/* ACTIVE FILTERS */}

        {(selectedCategory !== "All" ||
          search) && (
          <div className="mt-6 flex flex-wrap items-center gap-3">

            <p className="text-sm text-gray-500">
              Showing results for:
            </p>

            {selectedCategory !== "All" && (
              <span className="bg-[#EDE0D2] px-3 py-1.5 text-sm font-medium text-[#6B1E1E]">
                {selectedCategory}
              </span>
            )}

            {search && (
              <span className="bg-[#EDE0D2] px-3 py-1.5 text-sm font-medium text-[#6B1E1E]">
                "{search}"
              </span>
            )}

            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-semibold text-[#8B2E2E] hover:underline"
            >
              Clear filters
            </button>

          </div>
        )}

        {/* PRODUCTS */}

        {loading ? (
          <div className="flex min-h-[400px] items-center justify-center">

            <div className="flex items-center gap-3 text-[#8B2E2E]">

              <Loader2
                size={25}
                className="animate-spin"
              />

              Loading furniture...

            </div>

          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {filteredProducts.map(
              (product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              )
            )}

          </div>
        ) : (
          <div className="mt-10 bg-white px-6 py-20 text-center shadow-sm">

            <h2 className="text-2xl font-bold text-[#6B1E1E]">
              No furniture found
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
              We couldn't find any products
              matching your current search or
              category.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-6 inline-flex items-center bg-[#6B1E1E] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#8B2E2E]"
            >
              View All Furniture
            </button>

          </div>
        )}

      </main>

    </div>
  );
}

export default Shop;