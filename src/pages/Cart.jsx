import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowLeft,
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
  MessageCircle,
  User,
  Phone,
  MapPin,
  PackageCheck,
  AlertTriangle,
  XCircle,
} from "lucide-react";

import {
  doc,
  getDoc,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase/firebase";
import { useCart } from "../context/CartContext";

function Cart() {
  const {
    cartItems,
    cartTotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const [settings, setSettings] =
    useState({
      whatsapp: "919596492640",
      shopName:
        "हरि ॐ Furniture House",
    });

  const [customer, setCustomer] =
    useState({
      name: "",
      phone: "",
      address: "",
    });

  const [sending, setSending] =
    useState(false);

  // ======================================================
  // LOAD WEBSITE SETTINGS
  // ======================================================

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settingsRef = doc(
          db,
          "settings",
          "website"
        );

        const snapshot =
          await getDoc(settingsRef);

        if (snapshot.exists()) {
          setSettings((previous) => ({
            ...previous,
            ...snapshot.data(),
          }));
        }
      } catch (error) {
        console.error(
          "Unable to load settings:",
          error
        );
      }
    };

    loadSettings();
  }, []);

  // ======================================================
  // CUSTOMER DETAILS
  // ======================================================

  const handleCustomerChange = (
    e
  ) => {
    const {
      name,
      value,
    } = e.target;

    setCustomer((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ======================================================
  // STOCK HELPERS
  // ======================================================

  const getStockQuantity = (
    item
  ) => {
    return Math.max(
      0,
      Number(
        item.stockQuantity ?? 0
      )
    );
  };

  const hasStockIssue =
    cartItems.some((item) => {
      const stockQuantity =
        getStockQuantity(item);

      return (
        stockQuantity <= 0 ||
        Number(item.quantity || 0) >
          stockQuantity
      );
    });

  // ======================================================
  // SEND ORDER
  // ======================================================

  const sendOrderToWhatsApp = async (
    e
  ) => {
    e.preventDefault();

    if (!cartItems.length) {
      return;
    }

    // ==================================================
    // CHECK STOCK BEFORE ORDER
    // ==================================================

    const stockProblem =
      cartItems.find((item) => {
        const stockQuantity =
          getStockQuantity(item);

        return (
          stockQuantity <= 0 ||
          Number(item.quantity || 0) >
            stockQuantity
        );
      });

    if (stockProblem) {
      const stockQuantity =
        getStockQuantity(
          stockProblem
        );

      if (stockQuantity <= 0) {
        alert(
          `${stockProblem.name} is currently out of stock. Please remove it from your cart.`
        );
      } else {
        alert(
          `Only ${stockQuantity} ${
            stockQuantity === 1
              ? "item"
              : "items"
          } of ${stockProblem.name} ${
            stockQuantity === 1
              ? "is"
              : "are"
          } available. Please update your quantity.`
        );
      }

      return;
    }

    // ==================================================
    // CUSTOMER VALIDATION
    // ==================================================

    if (!customer.name.trim()) {
      alert(
        "Please enter your name."
      );
      return;
    }

    if (!customer.phone.trim()) {
      alert(
        "Please enter your phone number."
      );
      return;
    }

    if (!customer.address.trim()) {
      alert(
        "Please enter your delivery address."
      );
      return;
    }

    // ==================================================
    // WHATSAPP NUMBER
    // ==================================================

    const whatsappNumber = String(
      settings.whatsapp || ""
    ).replace(/\D/g, "");

    if (!whatsappNumber) {
      alert(
        "Shop WhatsApp number is not configured."
      );
      return;
    }

    try {
      setSending(true);

      // ==================================================
      // PREPARE ORDER ITEMS
      // ==================================================

      const orderItems =
        cartItems.map((item) => {
          const price = Number(
            item.price || 0
          );

          const originalPrice =
            Number(
              item.originalPrice ||
                item.price ||
                0
            );

          const discountPercent =
            Number(
              item.discountPercent ||
                0
            );

          const quantity = Number(
            item.quantity || 1
          );

          const stockQuantity =
            getStockQuantity(item);

          const itemTotal =
            price * quantity;

          return {
            productId: item.id,

            name: item.name,

            category:
              item.category ||
              "Furniture",

            material:
              item.material || "",

            image:
              item.image || "",

            // Current selling price
            price,

            // Original price
            originalPrice,

            // Discount
            discountPercent,

            // Ordered quantity
            quantity,

            // Available stock at
            // time of order
            stockQuantity,

            itemTotal,
          };
        });

      // ==================================================
      // SAVE ORDER TO FIRESTORE
      // ==================================================

      const orderData = {
        customer: {
          name:
            customer.name.trim(),

          phone:
            customer.phone.trim(),

          address:
            customer.address.trim(),
        },

        items: orderItems,

        total: Number(
          cartTotal
        ),

        status: "new",

        createdAt:
          serverTimestamp(),

        source: "website",
      };

      const orderRef =
        await addDoc(
          collection(db, "orders"),
          orderData
        );

      // ==================================================
      // WHATSAPP MESSAGE
      // ==================================================

      let message = `Hello ${settings.shopName} 👋

I would like to place an order/enquiry.

ORDER ID:
${orderRef.id}

CUSTOMER DETAILS
----------------
Name: ${customer.name}
Phone: ${customer.phone}
Address: ${customer.address}

ORDER ITEMS
-----------`;

      orderItems.forEach(
        (item, index) => {
          message += `

${index + 1}. ${item.name}
Category: ${item.category}
Material: ${
            item.material ||
            "Not specified"
          }`;

          // ==================================================
          // PRICE INFORMATION
          // ==================================================

          if (
            item.discountPercent >
              0 &&
            item.originalPrice >
              item.price
          ) {
            message += `
Original Price: ₹${item.originalPrice.toLocaleString(
              "en-IN"
            )}
Discount: ${item.discountPercent}% OFF
Offer Price: ₹${item.price.toLocaleString(
              "en-IN"
            )}`;
          } else {
            message += `
Price: ₹${item.price.toLocaleString(
              "en-IN"
            )}`;
          }

          // ==================================================
          // STOCK INFORMATION
          // ==================================================

          message += `
Quantity: ${item.quantity}
Available Stock: ${item.stockQuantity}
Item Total: ₹${item.itemTotal.toLocaleString(
            "en-IN"
          )}`;
        }
      );

      message += `

----------------
TOTAL: ₹${Number(
        cartTotal
      ).toLocaleString("en-IN")}

Order ID: ${orderRef.id}

Please contact me regarding availability,
delivery and final pricing.

Thank you.`;

      // ==================================================
      // OPEN WHATSAPP
      // ==================================================

      const whatsappURL =
        `https://wa.me/${whatsappNumber}?text=` +
        encodeURIComponent(
          message
        );

      window.open(
        whatsappURL,
        "_blank",
        "noopener,noreferrer"
      );

      alert(
        "Order saved successfully. WhatsApp will now open."
      );

      clearCart();

      setCustomer({
        name: "",
        phone: "",
        address: "",
      });
    } catch (error) {
      console.error(
        "Order creation failed:",
        error
      );

      alert(
        "Unable to save your order. Please try again."
      );
    } finally {
      setSending(false);
    }
  };

  // ======================================================
  // EMPTY CART
  // ======================================================

  if (!cartItems.length) {
    return (
      <div className="min-h-screen bg-[#F8F1E7] px-6 py-16">

        <div className="mx-auto max-w-3xl">

          <div className="bg-white px-6 py-16 text-center shadow-sm">

            <ShoppingCart
              size={55}
              className="mx-auto text-[#B8863B]"
            />

            <h1 className="mt-6 text-3xl font-bold text-[#6B1E1E]">
              Your Cart is Empty
            </h1>

            <p className="mt-3 text-gray-500">
              Add some furniture to your
              cart and send your enquiry
              directly to our WhatsApp.
            </p>

            <Link
              to="/shop"
              className="mt-7 inline-flex items-center gap-2 bg-[#6B1E1E] px-7 py-3.5 font-semibold text-white transition hover:bg-[#8B2E2E]"
            >
              <ArrowLeft size={18} />
              Continue Shopping
            </Link>

          </div>

        </div>

      </div>
    );
  }

  // ======================================================
  // CART PAGE
  // ======================================================

  return (
    <div className="min-h-screen bg-[#F8F1E7] px-6 py-12">

      <div className="mx-auto max-w-7xl">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="mb-8">

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#8B2E2E]"
          >
            <ArrowLeft size={17} />
            Continue Shopping
          </Link>

          <h1 className="mt-5 text-4xl font-bold text-[#6B1E1E]">
            Your Cart
          </h1>

          <p className="mt-2 text-gray-500">
            Review your furniture and send
            your enquiry directly to our shop.
          </p>

        </div>

        {/* ==================================================
            GLOBAL STOCK WARNING
        ================================================== */}

        {hasStockIssue && (
          <div className="mb-6 flex items-start gap-3 border border-orange-200 bg-orange-50 p-4 text-sm text-orange-700">

            <AlertTriangle
              size={20}
              className="mt-0.5 shrink-0"
            />

            <div>

              <p className="font-semibold">
                Please update your cart
              </p>

              <p className="mt-1">
                One or more products have
                insufficient stock. Update
                the quantities before placing
                your order.
              </p>

            </div>

          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">

          {/* ==================================================
              CART ITEMS
          ================================================== */}

          <div className="space-y-4">

            {cartItems.map((item) => {
              const currentPrice =
                Number(
                  item.price || 0
                );

              const originalPrice =
                Number(
                  item.originalPrice ||
                    item.price ||
                    0
                );

              const discountPercent =
                Number(
                  item.discountPercent ||
                    0
                );

              const stockQuantity =
                getStockQuantity(item);

              const quantity =
                Number(
                  item.quantity || 1
                );

              const hasDiscount =
                discountPercent > 0 &&
                originalPrice >
                  currentPrice;

              const isOutOfStock =
                stockQuantity <= 0;

              const isLowStock =
                stockQuantity > 0 &&
                stockQuantity <= 2;

              const maximumReached =
                quantity >=
                stockQuantity;

              const itemTotal =
                currentPrice *
                quantity;

              return (
                <div
                  key={item.id}
                  className="flex flex-col gap-5 bg-white p-5 shadow-sm sm:flex-row"
                >

                  {/* ==================================================
                      IMAGE
                  ================================================== */}

                  <Link
                    to={`/product/${item.id}`}
                    className="h-32 w-full shrink-0 overflow-hidden bg-gray-100 sm:w-32"
                  >

                    <div className="relative h-full w-full">

                      <img
                        src={item.image}
                        alt={item.name}
                        className={`h-full w-full object-cover ${
                          isOutOfStock
                            ? "opacity-60"
                            : ""
                        }`}
                      />

                      {hasDiscount && (
                        <span className="absolute left-2 top-2 rounded-full bg-[#8B2E2E] px-2 py-1 text-[10px] font-bold text-white">
                          {discountPercent}% OFF
                        </span>
                      )}

                      {isOutOfStock && (
                        <span className="absolute inset-0 flex items-center justify-center bg-black/25">

                          <span className="rounded-full bg-[#6B1E1E] px-3 py-1.5 text-[10px] font-bold uppercase text-white">
                            Out of Stock
                          </span>

                        </span>
                      )}

                    </div>

                  </Link>

                  {/* ==================================================
                      INFORMATION
                  ================================================== */}

                  <div className="flex flex-1 flex-col justify-between">

                    <div>

                      <p className="text-xs uppercase tracking-[0.2em] text-[#8B2E2E]">
                        {item.category}
                      </p>

                      <h2 className="mt-1 text-lg font-bold text-[#2B1714]">
                        {item.name}
                      </h2>

                      {item.material && (
                        <p className="mt-1 text-sm text-gray-500">
                          {item.material}
                        </p>
                      )}

                      {/* ==================================================
                          STOCK STATUS
                      ================================================== */}

                      <div className="mt-3">

                        {isOutOfStock ? (
                          <div className="flex items-center gap-1.5 text-sm font-semibold text-red-600">

                            <XCircle
                              size={17}
                            />

                            Out of Stock

                          </div>
                        ) : isLowStock ? (
                          <div className="flex items-center gap-1.5 text-sm font-semibold text-orange-600">

                            <AlertTriangle
                              size={17}
                            />

                            Only{" "}
                            {stockQuantity}{" "}
                            {stockQuantity ===
                            1
                              ? "item"
                              : "items"}{" "}
                            available

                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-sm font-semibold text-green-700">

                            <PackageCheck
                              size={17}
                            />

                            {stockQuantity}{" "}
                            {stockQuantity ===
                            1
                              ? "item"
                              : "items"}{" "}
                            in stock

                          </div>
                        )}

                      </div>

                      {/* ==================================================
                          PRICE
                      ================================================== */}

                      {hasDiscount ? (
                        <div className="mt-3">

                          <div className="flex flex-wrap items-center gap-2">

                            <span className="text-sm text-gray-400 line-through">
                              ₹
                              {originalPrice.toLocaleString(
                                "en-IN"
                              )}
                            </span>

                            <span className="rounded-full bg-[#F5E4E4] px-2 py-1 text-[11px] font-bold text-[#8B2E2E]">
                              {discountPercent}% OFF
                            </span>

                          </div>

                          <p className="mt-1 font-semibold text-[#8B2E2E]">
                            ₹
                            {currentPrice.toLocaleString(
                              "en-IN"
                            )}
                          </p>

                        </div>
                      ) : (
                        <p className="mt-3 font-semibold text-[#8B2E2E]">
                          ₹
                          {currentPrice.toLocaleString(
                            "en-IN"
                          )}
                        </p>
                      )}

                    </div>

                    {/* ==================================================
                        QUANTITY + TOTAL
                    ================================================== */}

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-4">

                      <div>

                        <div className="flex items-center border border-gray-200">

                          {/* MINUS */}

                          <button
                            type="button"
                            onClick={() =>
                              decreaseQuantity(
                                item.id
                              )
                            }
                            disabled={
                              quantity <= 1
                            }
                            className="flex h-9 w-9 items-center justify-center transition hover:bg-[#F8F1E7] disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={16} />
                          </button>

                          {/* QUANTITY */}

                          <span className="flex h-9 min-w-10 items-center justify-center border-x border-gray-200 text-sm font-semibold">
                            {quantity}
                          </span>

                          {/* PLUS */}

                          <button
                            type="button"
                            onClick={() =>
                              increaseQuantity(
                                item.id
                              )
                            }
                            disabled={
                              isOutOfStock ||
                              maximumReached
                            }
                            className="flex h-9 w-9 items-center justify-center transition hover:bg-[#F8F1E7] disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label="Increase quantity"
                          >
                            <Plus size={16} />
                          </button>

                        </div>

                        {/* MAX STOCK MESSAGE */}

                        {!isOutOfStock &&
                          maximumReached && (
                            <p className="mt-2 text-[11px] font-medium text-orange-600">
                              Maximum{" "}
                              {stockQuantity}{" "}
                              available
                            </p>
                          )}

                      </div>

                      <div className="flex items-center gap-5">

                        <p className="font-bold text-[#6B1E1E]">
                          ₹
                          {itemTotal.toLocaleString(
                            "en-IN"
                          )}
                        </p>

                        <button
                          type="button"
                          onClick={() =>
                            removeFromCart(
                              item.id
                            )
                          }
                          className="text-gray-400 transition hover:text-red-600"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 size={18} />
                        </button>

                      </div>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>

          {/* ==================================================
              ORDER FORM
          ================================================== */}

          <div className="h-fit bg-white p-6 shadow-sm lg:sticky lg:top-28">

            <h2 className="text-xl font-bold text-[#6B1E1E]">
              Order Details
            </h2>

            <form
              onSubmit={
                sendOrderToWhatsApp
              }
              className="mt-6 space-y-4"
            >

              {/* NAME */}

              <div>

                <label className="mb-2 block text-sm font-semibold">
                  Your Name *
                </label>

                <div className="relative">

                  <User
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    name="name"
                    value={
                      customer.name
                    }
                    onChange={
                      handleCustomerChange
                    }
                    placeholder="Enter your name"
                    className="w-full border border-gray-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-[#8B2E2E]"
                  />

                </div>

              </div>

              {/* PHONE */}

              <div>

                <label className="mb-2 block text-sm font-semibold">
                  Phone Number *
                </label>

                <div className="relative">

                  <Phone
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="tel"
                    name="phone"
                    value={
                      customer.phone
                    }
                    onChange={
                      handleCustomerChange
                    }
                    placeholder="Enter phone number"
                    className="w-full border border-gray-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-[#8B2E2E]"
                  />

                </div>

              </div>

              {/* ADDRESS */}

              <div>

                <label className="mb-2 block text-sm font-semibold">
                  Address *
                </label>

                <div className="relative">

                  <MapPin
                    size={18}
                    className="absolute left-3 top-3 text-gray-400"
                  />

                  <textarea
                    name="address"
                    value={
                      customer.address
                    }
                    onChange={
                      handleCustomerChange
                    }
                    rows="4"
                    placeholder="Enter delivery address"
                    className="w-full resize-none border border-gray-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-[#8B2E2E]"
                  />

                </div>

              </div>

              {/* ==================================================
                  STOCK CHECKOUT WARNING
              ================================================== */}

              {hasStockIssue && (
                <div className="border border-red-200 bg-red-50 p-3 text-xs leading-5 text-red-700">

                  <div className="flex items-start gap-2">

                    <XCircle
                      size={17}
                      className="mt-0.5 shrink-0"
                    />

                    <p>
                      Please correct the stock
                      quantities above before
                      placing your order.
                    </p>

                  </div>

                </div>
              )}

              {/* ==================================================
                  TOTAL
              ================================================== */}

              <div className="border-t border-gray-100 pt-5">

                <div className="flex items-center justify-between">

                  <span className="text-gray-500">
                    Total
                  </span>

                  <span className="text-2xl font-bold text-[#6B1E1E]">
                    ₹
                    {cartTotal.toLocaleString(
                      "en-IN"
                    )}
                  </span>

                </div>

              </div>

              {/* ==================================================
                  WHATSAPP
              ================================================== */}

              <button
                type="submit"
                disabled={
                  sending ||
                  hasStockIssue
                }
                className="flex w-full items-center justify-center gap-2 bg-[#6B1E1E] px-6 py-4 font-semibold text-white transition hover:bg-[#8B2E2E] disabled:cursor-not-allowed disabled:opacity-60"
              >

                <MessageCircle
                  size={21}
                />

                {sending
                  ? "Saving Order..."
                  : hasStockIssue
                  ? "Update Stock First"
                  : "Send Order on WhatsApp"}

              </button>

              <p className="text-center text-xs leading-5 text-gray-400">
                Your order will be saved
                securely and sent to our
                WhatsApp.
              </p>

            </form>

            {/* CLEAR CART */}

            <button
              type="button"
              onClick={clearCart}
              className="mt-5 w-full text-sm font-medium text-gray-400 hover:text-red-600"
            >
              Clear Cart
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Cart;