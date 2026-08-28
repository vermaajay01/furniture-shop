import {
  useEffect,
  useState,
} from "react";

import {
  collection,
  getDocs,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

import {
  Search,
  Users,
  Loader2,
  Eye,
  X,
  Mail,
  Phone,
  CalendarDays,
  ShoppingBag,
} from "lucide-react";

import { db } from "../../firebase/firebase";

function AdminCustomers() {
  const [customers, setCustomers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [selectedCustomer, setSelectedCustomer] =
    useState(null);

  const [orderStats, setOrderStats] =
    useState({});

  // ======================================================
  // LOAD CUSTOMERS
  // ======================================================

  useEffect(() => {
    const usersQuery = query(
      collection(db, "users"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe =
      onSnapshot(
        usersQuery,
        (snapshot) => {
          const users =
            snapshot.docs.map(
              (item) => ({
                id: item.id,
                ...item.data(),
              })
            );

          setCustomers(users);

          // Load order counts / totals for the customers.
          // Orders created by the updated Cart contain userId.
          getDocs(
            collection(db, "orders")
          )
            .then((ordersSnapshot) => {
              const stats = {};

              ordersSnapshot.docs.forEach(
                (orderDoc) => {
                  const order =
                    orderDoc.data();

                  const uid =
                    order.userId ||
                    order.customer?.uid;

                  if (!uid) {
                    return;
                  }

                  if (!stats[uid]) {
                    stats[uid] = {
                      count: 0,
                      total: 0,
                    };
                  }

                  stats[uid].count += 1;
                  stats[uid].total +=
                    Number(order.total || 0);
                }
              );

              setOrderStats(stats);
            })
            .catch((error) => {
              console.error(
                "Customer order statistics error:",
                error
              );
            })
            .finally(() => {
              setLoading(false);
            });
        },
        (error) => {
          console.error(
            "Customer loading error:",
            error
          );

          setLoading(false);
        }
      );

    return () => unsubscribe();
  }, []);

  // ======================================================
  // FORMAT DATE
  // ======================================================

  const formatDate = (value) => {
    if (!value) {
      return "—";
    }

    try {
      const date =
        typeof value?.toDate === "function"
          ? value.toDate()
          : new Date(value);

      if (Number.isNaN(date.getTime())) {
        return "—";
      }

      return date.toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return "—";
    }
  };

  // ======================================================
  // SEARCH
  // ======================================================

  const normalizedSearch =
    search.trim().toLowerCase();

  const filteredCustomers =
    customers.filter((customer) => {
      if (!normalizedSearch) {
        return true;
      }

      const values = [
        customer.name,
        customer.displayName,
        customer.email,
        customer.phone,
        customer.mobile,
        customer.id,
        customer.uid,
      ];

      return values.some(
        (value) =>
          String(value || "")
            .toLowerCase()
            .includes(normalizedSearch)
      );
    });

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-[#6B1E1E]">
          <Loader2
            size={24}
            className="animate-spin"
          />
          Loading customers...
        </div>
      </div>
    );
  }

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <div className="space-y-6">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-[#B8863B]">
            Admin
          </p>

          <h1 className="mt-1 text-3xl font-bold text-[#6B1E1E]">
            Customers
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View registered customer information.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white px-5 py-3 shadow-sm">
          <Users
            size={21}
            className="text-[#8B2E2E]"
          />

          <span className="font-bold text-[#6B1E1E]">
            {customers.length}
          </span>

          <span className="text-sm text-gray-500">
            Registered
          </span>
        </div>

      </div>

      {/* ==================================================
          SEARCH
      ================================================== */}

      <div className="relative max-w-xl">

        <Search
          size={19}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search by name, email, phone or user ID..."
          className="w-full border border-gray-200 bg-white py-3 pl-11 pr-4 outline-none transition focus:border-[#8B2E2E]"
        />

      </div>

      {/* ==================================================
          CUSTOMER TABLE
      ================================================== */}

      <div className="overflow-hidden bg-white shadow-sm">

        {filteredCustomers.length === 0 ? (
          <div className="px-6 py-16 text-center">

            <Users
              size={48}
              className="mx-auto text-gray-300"
            />

            <p className="mt-4 font-semibold text-[#6B1E1E]">
              No customers found
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Try a different search.
            </p>

          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full min-w-[850px]">

              <thead>
                <tr className="border-b border-gray-100 bg-[#F8F1E7] text-left text-xs uppercase tracking-wider text-gray-500">

                  <th className="px-5 py-4">
                    Customer
                  </th>

                  <th className="px-5 py-4">
                    Contact
                  </th>

                  <th className="px-5 py-4">
                    Registered
                  </th>

                  <th className="px-5 py-4">
                    Orders
                  </th>

                  <th className="px-5 py-4">
                    Total Spent
                  </th>

                  <th className="px-5 py-4">
                    User ID
                  </th>

                  <th className="px-5 py-4 text-right">
                    Action
                  </th>

                </tr>
              </thead>

              <tbody>

                {filteredCustomers.map(
                  (customer) => (
                    <tr
                      key={customer.id}
                      className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                    >

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F1E2D3] font-bold text-[#6B1E1E]">
                            {(
                              customer.name ||
                              customer.displayName ||
                              customer.email ||
                              "U"
                            )
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div className="min-w-0">

                            <p className="truncate font-semibold text-[#2B1714]">
                              {customer.name ||
                                customer.displayName ||
                                "Unnamed Customer"}
                            </p>

                            <p className="truncate text-xs text-gray-400">
                              {customer.email ||
                                "No email"}
                            </p>

                          </div>

                        </div>

                      </td>

                      <td className="px-5 py-4">

                        <p className="text-sm text-gray-700">
                          {customer.phone ||
                            customer.mobile ||
                            "—"}
                        </p>

                      </td>

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <CalendarDays
                            size={15}
                            className="text-gray-400"
                          />

                          {formatDate(
                            customer.createdAt
                          )}
                        </div>

                      </td>

                      <td className="px-5 py-4">
                        <p className="flex items-center gap-2 text-sm font-semibold text-[#6B1E1E]">
                          <ShoppingBag size={15} />
                          {orderStats[
                            customer.uid ||
                            customer.id
                          ]?.count || 0}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-[#6B1E1E]">
                          ₹
                          {Number(
                            orderStats[
                              customer.uid ||
                              customer.id
                            ]?.total || 0
                          ).toLocaleString("en-IN")}
                        </p>
                      </td>

                      <td className="max-w-[220px] px-5 py-4">

                        <p className="truncate font-mono text-xs text-gray-500">
                          {customer.uid ||
                            customer.id}
                        </p>

                      </td>

                      <td className="px-5 py-4 text-right">

                        <button
                          type="button"
                          onClick={() =>
                            setSelectedCustomer(
                              customer
                            )
                          }
                          className="inline-flex items-center gap-2 border border-[#6B1E1E] px-4 py-2 text-sm font-semibold text-[#6B1E1E] transition hover:bg-[#6B1E1E] hover:text-white"
                        >
                          <Eye
                            size={16}
                          />
                          View
                        </button>

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* ==================================================
          CUSTOMER DETAILS MODAL
      ================================================== */}

      {selectedCustomer && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-4">

          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">

              <div>
                <p className="text-xs uppercase tracking-wider text-[#B8863B]">
                  Customer Details
                </p>

                <h2 className="mt-1 text-xl font-bold text-[#6B1E1E]">
                  {selectedCustomer.name ||
                    selectedCustomer.displayName ||
                    "Customer"}
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedCustomer(null)
                }
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
                aria-label="Close"
              >
                <X size={21} />
              </button>

            </div>

            <div className="space-y-5 px-6 py-6">

              <div className="grid gap-4 sm:grid-cols-2">

                <div className="border border-gray-100 p-4">
                  <Mail
                    size={18}
                    className="text-[#8B2E2E]"
                  />

                  <p className="mt-2 text-xs text-gray-400">
                    Email
                  </p>

                  <p className="mt-1 break-all text-sm font-medium">
                    {selectedCustomer.email ||
                      "—"}
                  </p>
                </div>

                <div className="border border-gray-100 p-4">
                  <Phone
                    size={18}
                    className="text-[#8B2E2E]"
                  />

                  <p className="mt-2 text-xs text-gray-400">
                    Phone
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {selectedCustomer.phone ||
                      selectedCustomer.mobile ||
                      "—"}
                  </p>
                </div>

              </div>

              <div className="border border-gray-100 p-4">

                <CalendarDays
                  size={18}
                  className="text-[#8B2E2E]"
                />

                <p className="mt-2 text-xs text-gray-400">
                  Registered
                </p>

                <p className="mt-1 text-sm font-medium">
                  {formatDate(
                    selectedCustomer.createdAt
                  )}
                </p>

              </div>

              <div className="border border-gray-100 p-4">

                <ShoppingBag
                  size={18}
                  className="text-[#8B2E2E]"
                />

                <p className="mt-2 text-xs text-gray-400">
                  Orders
                </p>

                <p className="mt-1 text-sm font-medium">
                  {orderStats[
                    selectedCustomer.uid ||
                    selectedCustomer.id
                  ]?.count || 0}
                </p>

              </div>

              <div className="border border-gray-100 p-4">

                <p className="text-xs text-gray-400">
                  Total Spent
                </p>

                <p className="mt-1 text-sm font-semibold text-[#6B1E1E]">
                  ₹
                  {Number(
                    orderStats[
                      selectedCustomer.uid ||
                      selectedCustomer.id
                    ]?.total || 0
                  ).toLocaleString("en-IN")}
                </p>

              </div>

              <div className="border border-gray-100 p-4">

                <p className="text-xs text-gray-400">
                  Firebase User ID
                </p>

                <p className="mt-1 break-all font-mono text-xs text-gray-600">
                  {selectedCustomer.uid ||
                    selectedCustomer.id}
                </p>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default AdminCustomers;