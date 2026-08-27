import { Link } from "react-router-dom";

import {
  ShoppingCart,
  PackageCheck,
  AlertTriangle,
  XCircle,
  Minus,
  Plus,
} from "lucide-react";

import { useCart } from "../context/CartContext";
import { useOffers } from "../context/OfferContext";

function ProductCard({ product }) {
  const {
    addToCart,
    cartItems,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  // ======================================================
  // SHARED ACTIVE OFFER
  // ======================================================

  const {
    activeOffer: offer,
  } = useOffers();

  // ======================================================
  // FIND CURRENT CART ITEM
  // ======================================================

  const cartItem =
    cartItems.find(
      (item) =>
        item.id === product.id
    );

  const cartQuantity =
    Number(
      cartItem?.quantity || 0
    );

  // ======================================================
  // STOCK
  // ======================================================

  const stockQuantity =
    Math.max(
      0,
      Number(
        product.stockQuantity ?? 0
      )
    );

  const isOutOfStock =
    stockQuantity <= 0;

  const isLowStock =
    stockQuantity > 0 &&
    stockQuantity <= 2;

  const maximumReached =
    cartQuantity >=
    stockQuantity;

  // ======================================================
  // PRICE CALCULATION
  // ======================================================

  const originalPrice =
    Number(product.price || 0);

  const discountPercent =
    Number(
      offer?.discountPercent || 0
    );

  const hasOffer =
    !!offer &&
    discountPercent > 0;

  const discountedPrice =
    hasOffer
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
    if (isOutOfStock) {
      return;
    }

    const productToAdd = {
      ...product,

      originalPrice:
        originalPrice,

      price:
        discountedPrice,

      discountPercent:
        discountPercent || 0,

      stockQuantity:
        stockQuantity,
    };

    addToCart(productToAdd);
  };

  // ======================================================
  // INCREASE
  // ======================================================

  const handleIncrease = () => {
    if (
      isOutOfStock ||
      maximumReached
    ) {
      return;
    }

    increaseQuantity(
      product.id
    );
  };

  // ======================================================
  // DECREASE
  // ======================================================

  const handleDecrease = () => {
    if (cartQuantity <= 0) {
      return;
    }

    decreaseQuantity(
      product.id
    );
  };

  // ======================================================
  // PRODUCT CARD
  // ======================================================

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
            className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${
              isOutOfStock
                ? "opacity-70"
                : ""
            }`}
          />

          {/* OFFER BADGE */}

          {hasOffer && (
            <span className="absolute left-3 top-3 rounded-full bg-[#8B2E2E] px-3 py-1.5 text-xs font-bold text-white shadow-md">
              {discountPercent}% OFF
            </span>
          )}

          {/* OUT OF STOCK */}

          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">

              <span className="rounded-full bg-[#6B1E1E] px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-white shadow-lg">
                Out of Stock
              </span>

            </div>
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
            STOCK STATUS
        ================================================== */}

        <div className="mt-3">

          {isOutOfStock ? (
            <div className="flex items-center gap-1.5 text-sm font-semibold text-red-600">

              <XCircle size={17} />

              Out of Stock

            </div>
          ) : isLowStock ? (
            <div className="flex items-center gap-1.5 text-sm font-semibold text-orange-600">

              <AlertTriangle
                size={17}
              />

              Only {stockQuantity}{" "}
              {stockQuantity === 1
                ? "item"
                : "items"}{" "}
              left

            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-sm font-semibold text-green-700">

              <PackageCheck
                size={17}
              />

              {stockQuantity}{" "}
              {stockQuantity === 1
                ? "item"
                : "items"}{" "}
              in stock

            </div>
          )}

        </div>

        {/* ==================================================
            PRICE + CART
        ================================================== */}

        <div className="mt-4">

          <div className="flex items-end justify-between gap-3">

            {/* PRICE */}

            <div>

              {hasOffer ? (
                <>
                  <p className="text-sm text-gray-400 line-through">
                    ₹
                    {
                      formattedOriginalPrice
                    }
                  </p>

                  <p className="text-xl font-bold text-[#8B2E2E]">
                    ₹
                    {
                      formattedDiscountedPrice
                    }
                  </p>
                </>
              ) : (
                <p className="text-xl font-bold text-[#8B2E2E]">
                  ₹
                  {
                    formattedOriginalPrice
                  }
                </p>
              )}

            </div>

            {/* ==================================================
                CART CONTROLS
            ================================================== */}

            {isOutOfStock ? (
              <button
                type="button"
                disabled
                className="flex cursor-not-allowed items-center gap-2 bg-gray-400 px-4 py-2.5 text-sm font-semibold text-white"
              >

                <XCircle
                  size={17}
                />

                Unavailable

              </button>
            ) : cartQuantity === 0 ? (

              /* ================================================
                 ADD TO CART
              ================================================ */

              <button
                type="button"
                onClick={
                  handleAddToCart
                }
                className="flex items-center gap-2 bg-[#6B1E1E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#8B2E2E]"
              >

                <ShoppingCart
                  size={17}
                />

                Add

              </button>

            ) : (

              /* ================================================
                 QUANTITY + VIEW CART
              ================================================ */

              <div className="flex flex-col items-end gap-2">

                <div className="flex items-center">

                  {/* MINUS */}

                  <button
                    type="button"
                    onClick={
                      handleDecrease
                    }
                    className="flex h-10 w-9 items-center justify-center bg-[#6B1E1E] text-white transition hover:bg-[#8B2E2E]"
                    aria-label="Decrease quantity"
                  >

                    <Minus
                      size={16}
                    />

                  </button>

                  {/* QUANTITY */}

                  <span className="flex h-10 min-w-10 items-center justify-center border-y border-gray-200 bg-white px-2 text-sm font-bold text-[#6B1E1E]">
                    {cartQuantity}
                  </span>

                  {/* PLUS */}

                  <button
                    type="button"
                    onClick={
                      handleIncrease
                    }
                    disabled={
                      maximumReached
                    }
                    className="flex h-10 w-9 items-center justify-center bg-[#6B1E1E] text-white transition hover:bg-[#8B2E2E] disabled:cursor-not-allowed disabled:bg-gray-300"
                    aria-label="Increase quantity"
                  >

                    <Plus
                      size={16}
                    />

                  </button>

                </div>

              </div>

            )}

          </div>

          {/* ==================================================
              VIEW CART
          ================================================== */}

          {cartQuantity > 0 && (
            <Link
              to="/cart"
              className="mt-3 flex w-full items-center justify-center gap-2 border border-[#6B1E1E] px-4 py-2.5 text-sm font-semibold text-[#6B1E1E] transition hover:bg-[#6B1E1E] hover:text-white"
            >

              <ShoppingCart
                size={17}
              />

              View Cart

              <span className="rounded-full bg-[#6B1E1E] px-2 py-0.5 text-xs text-white">
                {cartQuantity}
              </span>

            </Link>
          )}

          {/* MAXIMUM STOCK */}

          {cartQuantity > 0 &&
            maximumReached && (
              <p className="mt-2 text-right text-[11px] font-medium text-orange-600">
                Maximum{" "}
                {stockQuantity}{" "}
                available
              </p>
            )}

        </div>

      </div>

    </div>
  );
}

export default ProductCard;