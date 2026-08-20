import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Loader2,
  MessageCircle,
  X,
  ZoomIn,
} from "lucide-react";

import {
  doc,
  getDoc,
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);

  const [whatsappNumber, setWhatsappNumber] =
    useState("919596492640");

  const [offer, setOffer] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ======================================================
  // IMAGE PREVIEW
  // ======================================================

  const [imagePreview, setImagePreview] =
    useState(false);

  // ======================================================
  // LOAD PRODUCT + SETTINGS + OFFER
  // ======================================================

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        // ==================================================
        // LOAD PRODUCT
        // ==================================================

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

          setProduct(null);
          return;
        }

        const productData = {
          id: productSnapshot.id,
          ...productSnapshot.data(),
        };

        setProduct(productData);

        // ==================================================
        // LOAD WEBSITE SETTINGS
        // ==================================================

        const settingsRef = doc(
          db,
          "settings",
          "website"
        );

        const settingsSnapshot =
          await getDoc(settingsRef);

        if (
          settingsSnapshot.exists()
        ) {
          const settings =
            settingsSnapshot.data();

          if (
            settings.whatsapp
          ) {
            const cleanNumber =
              String(
                settings.whatsapp
              ).replace(
                /\D/g,
                ""
              );

            if (cleanNumber) {
              setWhatsappNumber(
                cleanNumber
              );
            }
          }
        }

        // ==================================================
        // LOAD ACTIVE OFFER
        // ==================================================

        const offersSnapshot =
          await getDocs(
            collection(
              db,
              "offers"
            )
          );

        const today =
          new Date()
            .toISOString()
            .split("T")[0];

        const activeOffer =
          offersSnapshot.docs
            .map((item) => ({
              id: item.id,
              ...item.data(),
            }))
            .find((item) => {
              return (
                item.active === true &&
                Number(
                  item.discountPercent
                ) > 0 &&
                today >= item.startDate &&
                today <= item.endDate
              );
            });

        setOffer(
          activeOffer || null
        );

      } catch (err) {
        console.error(
          "Product details error:",
          err
        );

        setError(
          "Unable to load this product."
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  // ======================================================
  // CLOSE IMAGE PREVIEW WITH ESC
  // ======================================================

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.key === "Escape"
      ) {
        setImagePreview(false);
      }
    };

    if (imagePreview) {
      document.addEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.style.overflow =
        "hidden";
    }

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.style.overflow =
        "";
    };
  }, [imagePreview]);

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F1E7]">

        <div className="flex items-center gap-3 text-[#8B2E2E]">

          <Loader2
            size={25}
            className="animate-spin"
          />

          Loading product...

        </div>

      </div>
    );
  }

  // ======================================================
  // ERROR
  // ======================================================

  if (error || !product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F1E7] px-6">

        <div className="max-w-md bg-white p-10 text-center shadow-sm">

          <h1 className="text-2xl font-bold">
            Product Not Found
          </h1>

          <p className="mt-3 text-gray-500">
            {error ||
              "This product is no longer available."}
          </p>

          <Link
            to="/shop"
            className="mt-6 inline-flex items-center gap-2 bg-[#8B2E2E] px-6 py-3 font-semibold text-white"
          >
            <ArrowLeft size={18} />
            Back to Shop
          </Link>

        </div>

      </div>
    );
  }

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
  // WHATSAPP MESSAGE
  // ======================================================

  const whatsappPriceText =
    hasOffer
      ? `₹${formattedDiscountedPrice} (${discountPercent}% OFF, original price ₹${formattedOriginalPrice})`
      : `₹${formattedOriginalPrice}`;

  const whatsappMessage = `
Hello Hari Om Furniture House 👋

I am interested in this product:

🛋️ Product: ${product.name}

📂 Category: ${
    product.category ||
    "Furniture"
  }

💰 Price: ${whatsappPriceText}

🪵 Material: ${
    product.material ||
    "Not specified"
  }

🖼️ Product Image:
${product.image}

Please provide more details about this product.

Thank you.
`.trim();

  const whatsappURL =
    `https://wa.me/${whatsappNumber}?text=` +
    encodeURIComponent(
      whatsappMessage
    );

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <>
      <main className="min-h-screen bg-[#F8F1E7] px-6 py-12">

        <div className="mx-auto max-w-7xl">

          {/* BACK */}

          <Link
            to="/shop"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#8B2E2E]"
          >
            <ArrowLeft size={18} />
            Back to Shop
          </Link>

          {/* PRODUCT */}

          <div className="grid overflow-hidden bg-white shadow-sm md:grid-cols-2">

            {/* ==================================================
                IMAGE
            ================================================== */}

            <div
              className="group relative aspect-square cursor-zoom-in overflow-hidden bg-gray-100"
              onClick={() =>
                setImagePreview(true)
              }
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (
                  event.key ===
                    "Enter" ||
                  event.key ===
                    " "
                ) {
                  setImagePreview(true);
                }
              }}
              aria-label="Open product image preview"
            >

              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />

              {/* ZOOM INDICATOR */}

              <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-black/60 px-4 py-2 text-sm font-medium text-white opacity-0 backdrop-blur-sm transition duration-300 group-hover:opacity-100">

                <ZoomIn size={17} />

                Click to enlarge

              </div>

              {/* OFFER BADGE */}

              {hasOffer && (
                <div className="absolute left-4 top-4 rounded-full bg-[#8B2E2E] px-4 py-2 text-sm font-bold text-white shadow-lg">
                  {discountPercent}% OFF
                </div>
              )}

            </div>

            {/* ==================================================
                INFORMATION
            ================================================== */}

            <div className="flex flex-col justify-center p-8 md:p-12">

              {/* CATEGORY */}

              <p className="text-sm uppercase tracking-[0.3em] text-[#8B2E2E]">
                {product.category}
              </p>

              {/* NAME */}

              <h1 className="mt-4 text-4xl font-bold text-[#2B1714] md:text-5xl">
                {product.name}
              </h1>

              {/* ==================================================
                  PRICE
              ================================================== */}

              <div className="mt-5">

                {hasOffer ? (
                  <>

                    {/* ORIGINAL PRICE */}

                    <p className="text-lg text-gray-400 line-through">
                      ₹{formattedOriginalPrice}
                    </p>

                    {/* DISCOUNTED PRICE */}

                    <div className="mt-1 flex flex-wrap items-center gap-3">

                      <p className="text-3xl font-bold text-[#8B2E2E]">
                        ₹{formattedDiscountedPrice}
                      </p>

                      <span className="rounded-full bg-[#8B2E2E] px-3 py-1 text-xs font-bold text-white">
                        {discountPercent}% OFF
                      </span>

                    </div>

                  </>
                ) : (
                  <p className="text-3xl font-bold text-[#8B2E2E]">
                    ₹{formattedOriginalPrice}
                  </p>
                )}

              </div>

              {/* MATERIAL */}

              {product.material && (
                <div className="mt-7 border-y border-gray-100 py-5">

                  <p className="text-xs uppercase tracking-widest text-gray-400">
                    Material
                  </p>

                  <p className="mt-2 font-medium">
                    {product.material}
                  </p>

                </div>
              )}

              {/* DESCRIPTION */}

              {product.description && (
                <div className="mt-6">

                  <h2 className="font-semibold">
                    Description
                  </h2>

                  <p className="mt-3 leading-7 text-gray-600">
                    {product.description}
                  </p>

                </div>
              )}

              {/* WHATSAPP */}

              <a
                href={whatsappURL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 flex items-center justify-center gap-2 bg-[#8B2E2E] px-7 py-4 font-semibold text-white transition hover:bg-[#6B1E1E]"
              >

                <MessageCircle
                  size={21}
                />

                Enquire on WhatsApp

              </a>

              <p className="mt-3 text-center text-xs text-gray-400">
                Product details and current offer
                price will be included in your
                WhatsApp enquiry.
              </p>

            </div>

          </div>

        </div>

      </main>

      {/* ======================================================
          FULL SCREEN IMAGE PREVIEW
      ====================================================== */}

      {imagePreview && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() =>
            setImagePreview(false)
          }
          role="dialog"
          aria-modal="true"
          aria-label="Product image preview"
        >

          {/* CLOSE BUTTON */}

          <button
            type="button"
            onClick={() =>
              setImagePreview(false)
            }
            className="absolute right-5 top-5 z-[110] flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Close image preview"
          >
            <X size={25} />
          </button>

          {/* IMAGE CONTAINER */}

          <div
            className="relative flex max-h-[90vh] max-w-[95vw] items-center justify-center"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <img
              src={product.image}
              alt={product.name}
              className="max-h-[88vh] max-w-[92vw] rounded-sm object-contain shadow-2xl"
            />

          </div>

          {/* PRODUCT NAME */}

          <div className="absolute bottom-5 left-1/2 max-w-[90vw] -translate-x-1/2 rounded-full bg-black/60 px-5 py-2 text-center text-sm text-white backdrop-blur-sm">
            {product.name}
          </div>

        </div>
      )}
    </>
  );
}

export default ProductDetails;