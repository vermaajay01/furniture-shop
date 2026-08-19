import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Loader2,
  MessageCircle,
} from "lucide-react";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [whatsappNumber, setWhatsappNumber] =
    useState("919596492640");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ======================================================
  // LOAD PRODUCT + WEBSITE SETTINGS
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

        setProduct({
          id: productSnapshot.id,
          ...productSnapshot.data(),
        });

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
  // PRICE
  // ======================================================

  const formattedPrice =
    Number(
      product.price || 0
    ).toLocaleString(
      "en-IN"
    );

  // ======================================================
  // WHATSAPP MESSAGE
  // ======================================================

  const whatsappMessage = `
Hello Hari Om Furniture House 👋

I am interested in this product:

🛋️ Product: ${product.name}

📂 Category: ${
    product.category ||
    "Furniture"
  }

💰 Price: ₹${formattedPrice}

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

          {/* IMAGE */}

          <div className="aspect-square bg-gray-100">

            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />

          </div>

          {/* INFORMATION */}

          <div className="flex flex-col justify-center p-8 md:p-12">

            {/* CATEGORY */}

            <p className="text-sm uppercase tracking-[0.3em] text-[#8B2E2E]">
              {product.category}
            </p>

            {/* NAME */}

            <h1 className="mt-4 text-4xl font-bold text-[#2B1714] md:text-5xl">
              {product.name}
            </h1>

            {/* PRICE */}

            <p className="mt-5 text-3xl font-bold text-[#8B2E2E]">
              ₹{formattedPrice}
            </p>

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
              Product details and image will
              be included in your WhatsApp
              enquiry.
            </p>

          </div>

        </div>

      </div>

    </main>
  );
}

export default ProductDetails;