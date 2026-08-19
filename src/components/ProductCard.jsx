import { useState } from "react";
import { Link } from "react-router-dom";

import {
  ShoppingCart,
  Check,
} from "lucide-react";

import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  const [added, setAdded] =
    useState(false);

  const price = Number(
    product.price || 0
  ).toLocaleString("en-IN");

  const handleAddToCart = () => {
    addToCart(product);

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  return (
    <div className="group overflow-hidden bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

      {/* ==================================================
          IMAGE
      ================================================== */}

      <Link
        to={`/product/${product.id}`}
        className="block overflow-hidden"
      >
        <div className="aspect-square bg-gray-100">

          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />

        </div>
      </Link>

      {/* ==================================================
          PRODUCT INFORMATION
      ================================================== */}

      <div className="p-5">

        <p className="text-xs uppercase tracking-[0.2em] text-[#8B2E2E]">
          {product.category ||
            "Furniture"}
        </p>

        <Link
          to={`/product/${product.id}`}
        >
          <h3 className="mt-2 text-lg font-bold text-[#2B1714] transition hover:text-[#8B2E2E]">
            {product.name}
          </h3>
        </Link>

        {product.material && (
          <p className="mt-1 text-sm text-gray-500">
            {product.material}
          </p>
        )}

        {/* PRICE + CART */}

        <div className="mt-4 flex items-center justify-between gap-3">

          <p className="text-xl font-bold text-[#8B2E2E]">
            ₹{price}
          </p>

          <button
            type="button"
            onClick={handleAddToCart}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white transition ${
              added
                ? "bg-green-700"
                : "bg-[#6B1E1E] hover:bg-[#8B2E2E]"
            }`}
          >

            {added ? (
              <>
                <Check size={17} />
                Added
              </>
            ) : (
              <>
                <ShoppingCart
                  size={17}
                />
                Add
              </>
            )}

          </button>

        </div>

      </div>

    </div>
  );
}

export default ProductCard;