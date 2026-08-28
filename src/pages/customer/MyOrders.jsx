import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import {
  Package,
  Loader2,
  MapPin,
  CalendarDays,
  ChevronRight,
  ShoppingBag,
  CheckCircle2,
  Clock3,
  XCircle,
  Truck,
} from "lucide-react";

import { db } from "../../firebase/firebase";
import { useAuth } from "../../context/AuthContext";

function MyOrders() {
  const {
    user,
    loading: authLoading,
  } = useAuth();

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // ======================================================
  // LOAD CUSTOMER ORDERS
  // ======================================================

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const ordersQuery = query(
      collection(db, "orders"),
      where(
        "userId",
        "==",
        user.uid
      ),
      orderBy(
        "createdAt",
        "desc"
      )
    );

    const unsubscribe =
      onSnapshot(
        ordersQuery,
        (snapshot) => {
          const orderList =
            snapshot.docs.map(
              (item) => ({
                id: item.id,
                ...item.data(),
              })
            );

          setOrders(orderList);
          setLoading(false);
        },
        (error) => {
          console.error(
            "Unable to load customer orders:",
            error
          );

          setOrders([]);
          setLoading(false);
        }
      );

    return () => unsubscribe();
  }, [
    user,
    authLoading,
  ]);

  // ======================================================
  // FORMAT DATE
  // ======================================================

  const formatDate = (
    timestamp
  ) => {
    if (!timestamp) {
      return "Date unavailable";
    }

    try {
      return timestamp
        .toDate()
        .toLocaleString(
          "en-IN",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }
        );
    } catch {
      return "Date unavailable";
    }
  };

  // ======================================================
  // STATUS INFORMATION
  // ======================================================

  const getStatusInfo = (
    status
  ) => {
    switch (status) {
      case "confirmed":
        return {
          label: "Accepted",
          icon: CheckCircle2,
          className:
            "bg-blue-100 text-blue-700",
        };

      case "processing":
        return {
          label: "Processing",
          icon: Clock3,
          className:
            "bg-yellow-100 text-yellow-700",
        };

      case "delivered":
        return {
          label: "Delivered",
          icon: Truck,
          className:
            "bg-green-100 text-green-700",
        };

      case "cancelled":
        return {
          label: "Cancelled",
          icon: XCircle,
          className:
            "bg-red-100 text-red-700",
        };

      case "new":
      default:
        return {
          label: "Order Placed",
          icon: ShoppingBag,
          className:
            "bg-orange-100 text-orange-700",
        };
    }
  };

  // ======================================================
  // STATUS STEPS
  // ======================================================

  const statusSteps = [
    {
      key: "new",
      label: "Order Placed",
    },
    {
      key: "confirmed",
      label: "Accepted",
    },
    {
      key: "processing",
      label: "Processing",
    },
    {
      key: "delivered",
      label: "Delivered",
    },
  ];

  const getStepIndex = (
    status
  ) => {
    if (status === "confirmed") {
      return 1;
    }

    if (status === "processing") {
      return 2;
    }

    if (status === "delivered") {
      return 3;
    }

    return 0;
  };

  // ======================================================
  // AUTH LOADING
  // ======================================================

  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#F8F1E7]">

        <div className="flex items-center gap-3 text-[#6B1E1E]">

          <Loader2
            size={24}
            className="animate-spin"
          />

          Loading account...

        </div>

      </div>
    );
  }

  // ======================================================
  // LOGIN REQUIRED
  // ======================================================

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#F8F1E7] px-4">

        <div className="w-full max-w-md bg-white p-8 text-center shadow-sm">

          <Package
            size={48}
            className="mx-auto text-[#6B1E1E]"
          />

          <h1 className="mt-5 text-2xl font-bold text-[#6B1E1E]">
            Login Required
          </h1>

          <p className="mt-2 text-gray-500">
            Login to view your orders.
          </p>

          <Link
            to="/login"
            className="mt-6 inline-flex bg-[#6B1E1E] px-7 py-3 font-semibold text-white transition hover:bg-[#8B2E2E]"
          >
            Login
          </Link>

        </div>

      </div>
    );
  }

  // ======================================================
  // LOADING ORDERS
  // ======================================================

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#F8F1E7]">

        <div className="flex items-center gap-3 text-[#6B1E1E]">

          <Loader2
            size={24}
            className="animate-spin"
          />

          Loading your orders...

        </div>

      </div>
    );
  }

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <div className="min-h-[70vh] bg-[#F8F1E7] px-4 py-8 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-6xl">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

          <div>

            <p className="text-sm uppercase tracking-[0.2em] text-[#B8863B]">
              Customer Account
            </p>

            <h1 className="mt-2 text-3xl font-bold text-[#6B1E1E]">
              My Orders
            </h1>

            <p className="mt-2 text-gray-500">
              Track all your furniture orders in one place.
            </p>

          </div>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 self-start bg-[#6B1E1E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#8B2E2E] sm:self-auto"
          >
            Continue Shopping

            <ChevronRight
              size={17}
            />

          </Link>

        </div>

        {/* ==================================================
            EMPTY
        ================================================== */}

        {!orders.length ? (
          <div className="mt-8 bg-white px-6 py-16 text-center shadow-sm">

            <Package
              size={55}
              className="mx-auto text-gray-300"
            />

            <h2 className="mt-5 text-xl font-bold text-[#6B1E1E]">
              No Orders Yet
            </h2>

            <p className="mt-2 text-gray-500">
              Your orders will appear here after you place one.
            </p>

            <Link
              to="/shop"
              className="mt-6 inline-flex bg-[#6B1E1E] px-6 py-3 font-semibold text-white hover:bg-[#8B2E2E]"
            >
              Explore Furniture
            </Link>

          </div>
        ) : (

          <div className="mt-8 space-y-6">

            {orders.map(
              (order) => {

                const status =
                  order.status ||
                  "new";

                const statusInfo =
                  getStatusInfo(
                    status
                  );

                const StatusIcon =
                  statusInfo.icon;

                const currentStep =
                  getStepIndex(
                    status
                  );

                return (
                  <div
                    key={order.id}
                    className="overflow-hidden bg-white shadow-sm"
                  >

                    {/* ==================================================
                        ORDER HEADER
                    ================================================== */}

                    <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">

                      <div>

                        <p className="text-xs uppercase tracking-wider text-gray-400">
                          Order ID
                        </p>

                        <p className="mt-1 break-all font-mono text-sm font-semibold text-[#6B1E1E]">
                          {order.id}
                        </p>

                        <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">

                          <CalendarDays
                            size={14}
                          />

                          {formatDate(
                            order.createdAt
                          )}

                        </div>

                      </div>

                      <div className="flex items-center justify-between gap-5 sm:justify-end">

                        <p className="text-xl font-bold text-[#6B1E1E]">
                          ₹
                          {Number(
                            order.total ||
                              0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </p>

                        <div
                          className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase ${statusInfo.className}`}
                        >
                          <StatusIcon
                            size={15}
                          />

                          {statusInfo.label}

                        </div>

                      </div>

                    </div>

                    {/* ==================================================
                        STATUS TIMELINE
                    ================================================== */}

                    {status !==
                      "cancelled" && (

                      <div className="border-b border-gray-100 px-5 py-7">

                        <div className="grid grid-cols-4">

                          {statusSteps.map(
                            (
                              step,
                              index
                            ) => {

                              const completed =
                                index <=
                                currentStep;

                              return (
                                <div
                                  key={
                                    step.key
                                  }
                                  className="relative text-center"
                                >

                                  {index >
                                    0 && (
                                    <div
                                      className={`absolute left-0 right-1/2 top-4 h-0.5 ${
                                        index <=
                                        currentStep
                                          ? "bg-[#6B1E1E]"
                                          : "bg-gray-200"
                                      }`}
                                    />
                                  )}

                                  {index <
                                    3 && (
                                    <div
                                      className={`absolute left-1/2 right-0 top-4 h-0.5 ${
                                        index <
                                        currentStep
                                          ? "bg-[#6B1E1E]"
                                          : "bg-gray-200"
                                      }`}
                                    />
                                  )}

                                  <div
                                    className={`relative z-10 mx-auto flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                                      completed
                                        ? "border-[#6B1E1E] bg-[#6B1E1E] text-white"
                                        : "border-gray-200 bg-white text-gray-300"
                                    }`}
                                  >
                                    {completed ? (
                                      <CheckCircle2
                                        size={15}
                                      />
                                    ) : (
                                      <span className="h-2 w-2 rounded-full bg-current" />
                                    )}
                                  </div>

                                  <p
                                    className={`mt-2 text-[10px] font-semibold sm:text-xs ${
                                      completed
                                        ? "text-[#6B1E1E]"
                                        : "text-gray-400"
                                    }`}
                                  >
                                    {step.label}
                                  </p>

                                </div>
                              );
                            }
                          )}

                        </div>

                      </div>
                    )}

                    {/* CANCELLED STATUS */}

                    {status ===
                      "cancelled" && (

                      <div className="border-b border-red-100 bg-red-50 px-5 py-5">

                        <div className="flex items-center gap-3 text-red-700">

                          <XCircle
                            size={23}
                          />

                          <div>

                            <p className="font-semibold">
                              Order Cancelled
                            </p>

                            <p className="mt-1 text-sm">
                              This order has been cancelled by the shop.
                            </p>

                          </div>

                        </div>

                      </div>
                    )}

                    {/* ==================================================
                        ORDER CONTENT
                    ================================================== */}

                    <div className="grid gap-7 p-5 lg:grid-cols-[1fr_280px]">

                      {/* ITEMS */}

                      <div>

                        <h2 className="font-bold text-[#2B1714]">
                          Ordered Items
                        </h2>

                        <div className="mt-4 space-y-3">

                          {(order.items ||
                            []).map(
                              (
                                item,
                                index
                              ) => (

                                <div
                                  key={
                                    item.productId ||
                                    index
                                  }
                                  className="flex gap-4 border-b border-gray-100 pb-4 last:border-0"
                                >

                                  {item.image ? (
                                    <img
                                      src={
                                        item.image
                                      }
                                      alt={
                                        item.name ||
                                        "Product"
                                      }
                                      className="h-20 w-20 shrink-0 object-cover"
                                    />
                                  ) : (
                                    <div className="flex h-20 w-20 shrink-0 items-center justify-center bg-gray-100">
                                      <Package
                                        size={24}
                                        className="text-gray-300"
                                      />
                                    </div>
                                  )}

                                  <div className="min-w-0 flex-1">

                                    {item.productId ? (
                                      <Link
                                        to={`/product/${item.productId}`}
                                        className="font-semibold text-[#2B1714] hover:text-[#8B2E2E]"
                                      >
                                        {item.name ||
                                          "Unnamed Product"}
                                      </Link>
                                    ) : (
                                      <p className="font-semibold text-[#2B1714]">
                                        {item.name ||
                                          "Unnamed Product"}
                                      </p>
                                    )}

                                    <p className="mt-1 text-xs text-gray-400">
                                      {item.category ||
                                        "Furniture"}

                                      {item.material
                                        ? ` • ${item.material}`
                                        : ""}
                                    </p>

                                    <p className="mt-2 text-sm text-gray-500">
                                      ₹
                                      {Number(
                                        item.price ||
                                          0
                                      ).toLocaleString(
                                        "en-IN"
                                      )}

                                      {" × "}

                                      {item.quantity ||
                                        0}
                                    </p>

                                  </div>

                                  <p className="shrink-0 font-semibold text-[#6B1E1E]">
                                    ₹
                                    {Number(
                                      item.itemTotal ||
                                        Number(
                                          item.price ||
                                            0
                                        ) *
                                          Number(
                                            item.quantity ||
                                              0
                                          )
                                    ).toLocaleString(
                                      "en-IN"
                                    )}
                                  </p>

                                </div>

                              )
                            )}

                        </div>

                      </div>

                      {/* CUSTOMER DETAILS */}

                      <div>

                        <h2 className="font-bold text-[#2B1714]">
                          Delivery Details
                        </h2>

                        <div className="mt-4 space-y-4 text-sm">

                          <div>

                            <p className="text-xs text-gray-400">
                              Name
                            </p>

                            <p className="mt-1 font-medium">
                              {order.customer
                                ?.name ||
                                "—"}
                            </p>

                          </div>

                          <div>

                            <p className="text-xs text-gray-400">
                              Phone
                            </p>

                            <p className="mt-1 font-medium">
                              {order.customer
                                ?.phone ||
                                "—"}
                            </p>

                          </div>

                          <div>

                            <p className="flex items-start gap-2 text-xs text-gray-400">
                              <MapPin
                                size={14}
                              />
                              Address
                            </p>

                            <p className="mt-1 leading-6 text-gray-600">
                              {order.customer
                                ?.address ||
                                "—"}
                            </p>

                          </div>

                        </div>

                      </div>

                    </div>

                  </div>
                );
              }
            )}

          </div>
        )}

      </div>

    </div>
  );
}

export default MyOrders;