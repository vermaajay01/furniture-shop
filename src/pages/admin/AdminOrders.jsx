import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  collection,
  getDocs,
  orderBy,
  query,
  doc,
  updateDoc,
} from "firebase/firestore";

import {
  Package,
  Loader2,
  Phone,
  MapPin,
  ChevronDown,
  ImageOff,
  ExternalLink,
} from "lucide-react";

import { db } from "../../firebase/firebase";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ======================================================
  // LOAD ORDERS
  // ======================================================

  const loadOrders = async () => {
    try {
      setLoading(true);

      const ordersQuery = query(
        collection(db, "orders"),
        orderBy("createdAt", "desc")
      );

      const snapshot =
        await getDocs(ordersQuery);

      const orderList =
        snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

      setOrders(orderList);
    } catch (error) {
      console.error(
        "Unable to load orders:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // ======================================================
  // UPDATE ORDER STATUS
  // ======================================================

  const updateStatus = async (
    orderId,
    status
  ) => {
    try {
      await updateDoc(
        doc(db, "orders", orderId),
        {
          status,
        }
      );

      setOrders((previous) =>
        previous.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status,
              }
            : order
        )
      );
    } catch (error) {
      console.error(
        "Unable to update order:",
        error
      );

      alert(
        "Unable to update order status."
      );
    }
  };

  // ======================================================
  // FORMAT DATE
  // ======================================================

  const formatDate = (timestamp) => {
    if (!timestamp) {
      return "Just now";
    }

    try {
      return timestamp
        .toDate()
        .toLocaleString("en-IN");
    } catch {
      return "Unknown date";
    }
  };

  // ======================================================
  // STATUS COLOR
  // ======================================================

  const getStatusClass = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-700";

      case "processing":
        return "bg-yellow-100 text-yellow-700";

      case "delivered":
        return "bg-green-100 text-green-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-3 text-[#8B2E2E]">
          <Loader2
            size={25}
            className="animate-spin"
          />

          Loading orders...
        </div>
      </div>
    );
  }

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <div className="min-h-screen bg-[#F8F1E7] p-6 md:p-10">

      <div className="mx-auto max-w-7xl">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

          <div>

            <p className="text-sm uppercase tracking-[0.25em] text-[#8B2E2E]">
              Admin Panel
            </p>

            <h1 className="mt-2 text-3xl font-bold text-[#2B1714]">
              Customer Orders
            </h1>

            <p className="mt-2 text-gray-500">
              View and manage orders received
              from your website.
            </p>

          </div>

          <div className="flex items-center gap-3 bg-white px-5 py-4 shadow-sm">

            <Package
              size={22}
              className="text-[#8B2E2E]"
            />

            <div>

              <p className="text-xs text-gray-400">
                Total Orders
              </p>

              <p className="text-xl font-bold">
                {orders.length}
              </p>

            </div>

          </div>

        </div>

        {/* ==================================================
            EMPTY
        ================================================== */}

        {!orders.length ? (
          <div className="mt-10 bg-white px-6 py-20 text-center shadow-sm">

            <Package
              size={50}
              className="mx-auto text-gray-300"
            />

            <h2 className="mt-5 text-xl font-bold">
              No orders yet
            </h2>

            <p className="mt-2 text-gray-500">
              Orders placed through the website
              will appear here.
            </p>

          </div>
        ) : (

          <div className="mt-10 space-y-5">

            {orders.map((order) => (

              <div
                key={order.id}
                className="overflow-hidden bg-white shadow-sm"
              >

                {/* ==================================================
                    ORDER HEADER
                ================================================== */}

                <div className="flex flex-col gap-4 border-b border-gray-100 p-5 md:flex-row md:items-center md:justify-between">

                  <div>

                    <p className="text-xs uppercase tracking-widest text-gray-400">
                      Order ID
                    </p>

                    <p className="mt-1 break-all font-mono text-sm font-semibold text-[#6B1E1E]">
                      {order.id}
                    </p>

                    <p className="mt-2 text-xs text-gray-400">
                      {formatDate(
                        order.createdAt
                      )}
                    </p>

                  </div>

                  <div className="flex flex-wrap items-center gap-4">

                    <p className="text-xl font-bold text-[#6B1E1E]">
                      ₹
                      {Number(
                        order.total || 0
                      ).toLocaleString("en-IN")}
                    </p>

                    <div className="relative">

                      <select
                        value={
                          order.status ||
                          "new"
                        }
                        onChange={(e) =>
                          updateStatus(
                            order.id,
                            e.target.value
                          )
                        }
                        className={`appearance-none rounded-full px-4 py-2 pr-9 text-xs font-bold uppercase outline-none ${getStatusClass(
                          order.status
                        )}`}
                      >

                        <option value="new">
                          New
                        </option>

                        <option value="confirmed">
                          Confirmed
                        </option>

                        <option value="processing">
                          Processing
                        </option>

                        <option value="delivered">
                          Delivered
                        </option>

                        <option value="cancelled">
                          Cancelled
                        </option>

                      </select>

                      <ChevronDown
                        size={14}
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                      />

                    </div>

                  </div>

                </div>

                {/* ==================================================
                    ORDER CONTENT
                ================================================== */}

                <div className="grid gap-8 p-5 lg:grid-cols-[280px_1fr]">

                  {/* ==================================================
                      CUSTOMER
                  ================================================== */}

                  <div>

                    <h3 className="font-semibold text-[#2B1714]">
                      Customer
                    </h3>

                    <p className="mt-4 font-medium">
                      {order.customer?.name ||
                        "Not provided"}
                    </p>

                    <div className="mt-3 flex gap-2 text-sm text-gray-500">

                      <Phone
                        size={17}
                        className="shrink-0 text-[#B8863B]"
                      />

                      <span>
                        {order.customer?.phone ||
                          "Not provided"}
                      </span>

                    </div>

                    <div className="mt-3 flex gap-2 text-sm text-gray-500">

                      <MapPin
                        size={17}
                        className="mt-0.5 shrink-0 text-[#B8863B]"
                      />

                      <span>
                        {order.customer?.address ||
                          "Not provided"}
                      </span>

                    </div>

                  </div>

                  {/* ==================================================
                      ITEMS
                  ================================================== */}

                  <div>

                    <h3 className="font-semibold text-[#2B1714]">
                      Ordered Items
                    </h3>

                    <div className="mt-4 overflow-x-auto">

                      <table className="w-full min-w-[760px] text-left text-sm">

                        <thead>

                          <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400">

                            <th className="pb-3">
                              Product
                            </th>

                            <th className="pb-3">
                              Price
                            </th>

                            <th className="pb-3">
                              Qty
                            </th>

                            <th className="pb-3 text-right">
                              Total
                            </th>

                          </tr>

                        </thead>

                        <tbody>

                          {(order.items || []).map(
                            (item, index) => (

                              <tr
                                key={
                                  item.productId ||
                                  index
                                }
                                className="border-b border-gray-50 last:border-0"
                              >

                                {/* ==================================================
                                    PRODUCT IMAGE + DETAILS
                                ================================================== */}

                                <td className="py-4">

                                  <div className="flex items-center gap-4">

                                    {/* PRODUCT IMAGE */}

                                    {item.image ? (

                                      <Link
                                        to={`/product/${item.productId}`}
                                        className="group relative block h-16 w-16 shrink-0 overflow-hidden bg-gray-100"
                                        title="View product"
                                      >

                                        <img
                                          src={
                                            item.image
                                          }
                                          alt={
                                            item.name ||
                                            "Product"
                                          }
                                          className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
                                          onError={(
                                            e
                                          ) => {
                                            e.currentTarget.style.display =
                                              "none";
                                          }}
                                        />

                                      </Link>

                                    ) : (

                                      <div className="flex h-16 w-16 shrink-0 items-center justify-center bg-gray-100 text-gray-300">

                                        <ImageOff
                                          size={22}
                                        />

                                      </div>

                                    )}

                                    {/* PRODUCT INFORMATION */}

                                    <div className="min-w-0">

                                      <Link
                                        to={`/product/${item.productId}`}
                                        className="font-medium text-[#2B1714] transition hover:text-[#8B2E2E]"
                                      >
                                        {item.name ||
                                          "Unnamed Product"}
                                      </Link>

                                      <p className="mt-1 text-xs text-gray-400">
                                        {item.category ||
                                          "Furniture"}

                                        {item.material
                                          ? ` • ${item.material}`
                                          : ""}
                                      </p>

                                      {/* VIEW PRODUCT */}

                                      {item.productId && (
                                        <Link
                                          to={`/product/${item.productId}`}
                                          className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-[#8B2E2E] hover:underline"
                                        >
                                          View Product
                                          <ExternalLink
                                            size={11}
                                          />
                                        </Link>
                                      )}

                                    </div>

                                  </div>

                                </td>

                                {/* PRICE */}

                                <td className="py-4 align-middle">

                                  ₹
                                  {Number(
                                    item.price ||
                                      0
                                  ).toLocaleString(
                                    "en-IN"
                                  )}

                                  {Number(
                                    item.discountPercent ||
                                      0
                                  ) > 0 && (
                                    <p className="mt-1 text-[11px] font-medium text-green-600">
                                      {
                                        item.discountPercent
                                      }
                                      % OFF
                                    </p>
                                  )}

                                </td>

                                {/* QUANTITY */}

                                <td className="py-4 align-middle">
                                  {item.quantity ||
                                    0}
                                </td>

                                {/* TOTAL */}

                                <td className="py-4 text-right align-middle font-semibold">

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

                                </td>

                              </tr>

                            )
                          )}

                        </tbody>

                      </table>

                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default AdminOrders;