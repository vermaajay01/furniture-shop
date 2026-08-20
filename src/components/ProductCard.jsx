import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  ShoppingCart,
  Check,
} from "lucide-react";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  const [added, setAdded] =
    useState(false);

  const [offer, setOffer] =
    useState(null);

  // ======================================================
  // LOAD ACTIVE OFFER
  // ======================================================

  useEffect(() => {
    const loadOffer = async () => {
      try {
        const snapshot =
          await getDocs(
            collection(db, "offers")
          );

        const today =
          new Date()
            .toISOString()
            .split("T")[0];

        const activeOffer =
          snapshot.docs
            .map((item) => ({
              id: item.id,
              ...item.data(),
            }))
            .find((item) => {
              return (
                item.active === true &&
                item.discountPercent > 0 &&
                today >= item.startDate &&
                today <= item.endDate
              );
            });

        setOffer(
          activeOffer || null
        );
      } catch (error) {
        console.error(
          "Unable to load offer:",
          error
        );

        setOffer(null);
      }
    };

    loadOffer();
  }, []);

  // ======================================================
  // PRICE CALCULATION
  // ======================================================

  const originalPrice =
    Number(product.price || 0);

  const discountPercent =
    Number(
      offer?.discountPercent || 0
    );

  const discountedPrice =
    offer && discountPercent > 0
      ? Math.round(
          originalPrice -
            (originalPrice *
              discountPercent) /
              100
        )
      : originalPrice;

  const formattedOriginalPrice =
    originalPrice.toLocaleString(
      "en-IN"
    );

  const formattedDiscountedPrice =
    discountedPrice.toLocaleString(
      "en-IN"
    );

  // ======================================================
  // ADD TO CART
  // ======================================================

  const handleAddToCart = () => {

    // Keep original product information
    // but send the discounted price when
    // an active offer exists.

    const productToAdd = {
      ...product,

      originalPrice:
        originalPrice,

      price:
        discountedPrice,

      discountPercent:
        discountPercent || 0,
    };

    addToCart(productToAdd);

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

        <div className="relative aspect-square bg-gray-100">

          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />

          {/* OFFER BADGE */}

          {offer && (
            <span className="absolute left-3 top-3 rounded-full bg-[#8B2E2E] px-3 py-1.5 text-xs font-bold text-white shadow-md">
              {discountPercent}% OFF
            </span>
          )}

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

        {/* ==================================================
            PRICE + CART
        ================================================== */}

        <div className="mt-4 flex items-end justify-between gap-3">

          {/* PRICE */}

          <div>

            {offer ? (
              <>
                {/* ORIGINAL PRICE */}

                <p className="text-sm text-gray-400 line-through">
                  ₹{formattedOriginalPrice}
                </p>

                {/* DISCOUNTED PRICE */}

                <p className="text-xl font-bold text-[#8B2E2E]">
                  ₹{formattedDiscountedPrice}
                </p>
              </>
            ) : (
              <p className="text-xl font-bold text-[#8B2E2E]">
                ₹{formattedOriginalPrice}
              </p>
            )}

          </div>

          {/* ADD TO CART */}

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