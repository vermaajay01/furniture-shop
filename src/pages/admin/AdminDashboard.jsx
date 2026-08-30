import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  collection,
  onSnapshot,
  query,
  where,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

import {
  Package,
  ShoppingCart,
  IndianRupee,
  MessageSquare,
  Bell,
  Users,
  CalendarDays,
  CalendarRange,
  ArrowRight,
  Settings,
  Globe,
  ShoppingBag,
  Palette,
  Check,
  X,
} from "lucide-react";

import { db } from "../../firebase/firebase";

function AdminDashboard() {
  const [visitorCount, setVisitorCount] =
    useState(0);

  const [todayVisitors, setTodayVisitors] =
    useState(0);

  const [monthVisitors, setMonthVisitors] =
    useState(0);

  const [todayUsers, setTodayUsers] =
    useState([]);

  const [showTodayUsers, setShowTodayUsers] =
    useState(false);

  const [deletingVisitors, setDeletingVisitors] =
    useState(false);

  const [visitorDeleteMessage, setVisitorDeleteMessage] =
    useState("");

  const [productCount, setProductCount] =
    useState(0);

  const [requestCount, setRequestCount] =
    useState(0);

  const [customerCount, setCustomerCount] =
    useState(0);

  const [orderCount, setOrderCount] =
    useState(0);

  const [newOrderCount, setNewOrderCount] =
    useState(0);

  const [orderValue, setOrderValue] =
    useState(0);

  const [unreadNotifications, setUnreadNotifications] =
    useState(0);

  const [recentNotifications, setRecentNotifications] =
    useState([]);

  // ======================================================
  // WEBSITE THEME
  // ======================================================

  const themes = [
    {
      id: "classic-maroon",
      name: "Classic Maroon",
      description: "Current Hari Om theme",
      preview: "bg-[#6B1E1E]",
      accent: "#8B2E2E",
      gold: "#B8863B",
    },
    {
      id: "forest-green",
      name: "Forest Green",
      description: "Natural and premium",
      preview: "bg-[#315C46]",
      accent: "#3E7658",
      gold: "#C2A15A",
    },
    {
      id: "royal-navy",
      name: "Royal Navy",
      description: "Elegant and sophisticated",
      preview: "bg-[#243B5A]",
      accent: "#31577F",
      gold: "#C7A65A",
    },
    {
      id: "walnut-brown",
      name: "Walnut Brown",
      description: "Warm wooden finish",
      preview: "bg-[#5A3928]",
      accent: "#765039",
      gold: "#C19A63",
    },
    {
      id: "modern-charcoal",
      name: "Modern Charcoal",
      description: "Clean contemporary look",
      preview: "bg-[#30343B]",
      accent: "#464D57",
      gold: "#C5A66A",
    },
  ];

  const [selectedTheme, setSelectedTheme] =
    useState("classic-maroon");

  const [themeSaving, setThemeSaving] =
    useState(false);

  const [themeMessage, setThemeMessage] =
    useState("");

  // ======================================================
  // DATE HELPERS
  // ======================================================

  const getToday = () => {
    const now = new Date();

    const year =
      now.getFullYear();

    const month = String(
      now.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      now.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const getCurrentMonth = () => {
    const now = new Date();

    const year =
      now.getFullYear();

    const month = String(
      now.getMonth() + 1
    ).padStart(2, "0");

    return `${year}-${month}`;
  };

  // ======================================================
  // WEBSITE THEME
  // ======================================================

  useEffect(() => {
    const settingsRef = doc(
      db,
      "settings",
      "website"
    );

    const unsubscribe =
      onSnapshot(
        settingsRef,
        (snapshot) => {
          if (!snapshot.exists()) {
            return;
          }

          const data =
            snapshot.data();

          setSelectedTheme(
            data.themeId ||
              "classic-maroon"
          );
        },
        (error) => {
          console.error(
            "Theme settings error:",
            error
          );
        }
      );

    return () =>
      unsubscribe();
  }, []);

  useEffect(() => {
    if (!themeMessage) {
      return;
    }

    const timer =
      window.setTimeout(() => {
        setThemeMessage("");
      }, 2500);

    return () =>
      window.clearTimeout(timer);
  }, [themeMessage]);

  const handleThemeChange =
    async (themeId) => {
      if (
        themeId === selectedTheme ||
        themeSaving
      ) {
        return;
      }

      try {
        setThemeSaving(true);
        setThemeMessage("");

        await setDoc(
          doc(
            db,
            "settings",
            "website"
          ),
          {
            themeId,
          },
          {
            merge: true,
          }
        );

        setSelectedTheme(
          themeId
        );

        setThemeMessage(
          "Theme saved successfully."
        );
      } catch (error) {
        console.error(
          "Unable to save website theme:",
          error
        );

        setThemeMessage(
          "Unable to save theme."
        );
      } finally {
        setThemeSaving(false);
      }
    };

  // ======================================================
  // WEBSITE ANALYTICS
  // ======================================================

  useEffect(() => {
    const analyticsRef =
      collection(
        db,
        "visitorAnalytics"
      );

    const unsubscribe =
      onSnapshot(
        analyticsRef,
        (snapshot) => {
          const analyticsUsers =
            snapshot.docs.map(
              (item) => ({
                id: item.id,
                ...item.data(),
              })
            );

          const today =
            getToday();

          const currentMonth =
            getCurrentMonth();

          // ==================================================
          // TODAY'S USERS
          // ==================================================

          const todayList =
            analyticsUsers
              .filter(
                (user) =>
                  user.date === today
              )
              .sort((a, b) => {
                const timeA =
                  a.lastVisitAt?.toMillis?.() ||
                  a.firstVisitAt?.toMillis?.() ||
                  0;

                const timeB =
                  b.lastVisitAt?.toMillis?.() ||
                  b.firstVisitAt?.toMillis?.() ||
                  0;

                return (
                  timeB - timeA
                );
              });

          // ==================================================
          // THIS MONTH
          // ==================================================

          const monthCount =
            analyticsUsers.filter(
              (user) =>
                typeof user.date ===
                  "string" &&
                user.date.startsWith(
                  currentMonth
                )
            ).length;

          // ==================================================
          // DASHBOARD COUNTS
          // ==================================================

          setTodayUsers(
            todayList
          );

          setTodayVisitors(
            todayList.length
          );

          setMonthVisitors(
            monthCount
          );

          setVisitorCount(
            analyticsUsers.length
          );
        },
        (error) => {
          console.error(
            "Website analytics error:",
            error
          );
        }
      );

    return () =>
      unsubscribe();
  }, []);

  // ======================================================
  // FORMAT ANALYTICS TIME
  // ======================================================

  const formatAnalyticsTime =
    (timestamp) => {
      if (!timestamp) {
        return "—";
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
              hour: "numeric",
              minute: "2-digit",
            }
          );
      } catch {
        return "—";
      }
    };

  // ======================================================
  // ANALYTICS TABLE
  // ======================================================

  const TodayUsersTable = () => {
    if (!showTodayUsers) {
      return null;
    }

    return (
      <section className="mt-8 bg-white shadow-sm">

        <div className="flex flex-col gap-4 border-b border-gray-100 p-6 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#B8863B]">
              Website Analytics
            </p>

            <h2 className="mt-1 text-2xl font-bold text-[#6B1E1E]">
              Today's Users
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {todayUsers.length.toLocaleString(
                "en-IN"
              )}{" "}
              unique anonymous users recorded today.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setShowTodayUsers(false)
            }
            className="flex w-fit items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
          >
            <X size={17} />
            Close
          </button>

        </div>

        <div className="overflow-x-auto">

          {todayUsers.length === 0 ? (

            <div className="p-12 text-center">

              <Users
                size={38}
                className="mx-auto text-gray-300"
              />

              <p className="mt-4 font-semibold text-gray-600">
                No users recorded today
              </p>

              <p className="mt-1 text-sm text-gray-400">
                New visitors will appear here when analytics tracking records them.
              </p>

            </div>

          ) : (

            <table className="min-w-[1500px] w-full text-left text-sm">

              <thead className="bg-[#F8F1E7] text-xs uppercase tracking-wider text-gray-500">

                <tr>

                  <th className="px-4 py-4 font-semibold">
                    Time
                  </th>

                  <th className="px-4 py-4 font-semibold">
                    User ID
                  </th>

                  <th className="px-4 py-4 font-semibold">
                    City
                  </th>

                  <th className="px-4 py-4 font-semibold">
                    Region
                  </th>

                  <th className="px-4 py-4 font-semibold">
                    Country
                  </th>

                  <th className="px-4 py-4 font-semibold">
                    Device
                  </th>

                  <th className="px-4 py-4 font-semibold">
                    Browser
                  </th>

                  <th className="px-4 py-4 font-semibold">
                    OS
                  </th>

                  <th className="px-4 py-4 font-semibold">
                    Screen
                  </th>

                  <th className="px-4 py-4 font-semibold">
                    First Page
                  </th>

                  <th className="px-4 py-4 font-semibold">
                    Last Page
                  </th>

                  <th className="px-4 py-4 font-semibold">
                    Source
                  </th>

                  <th className="px-4 py-4 font-semibold">
                    Visits
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-gray-100">

                {todayUsers.map(
                  (user) => (
                    <tr
                      key={user.id}
                      className="transition hover:bg-[#F8F1E7]/60"
                    >

                      <td className="whitespace-nowrap px-4 py-4 text-gray-600">
                        {formatAnalyticsTime(
                          user.lastVisitAt ||
                            user.firstVisitAt
                        )}
                      </td>

                      <td className="px-4 py-4">
                        <span className="font-mono text-xs text-[#6B1E1E]">
                          {user.visitorId ||
                            user.id}
                        </span>
                      </td>

                      <td className="px-4 py-4 font-medium text-gray-700">
                        {user.city ||
                          "—"}
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        {user.region ||
                          "—"}
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        {user.country ||
                          "—"}
                      </td>

                      <td className="px-4 py-4 font-medium text-gray-700">
                        {user.deviceType ||
                          "—"}
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        {user.browser ||
                          "—"}
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        {user.operatingSystem ||
                          "—"}
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        {user.screenResolution ||
                          "—"}
                      </td>

                      <td className="max-w-[180px] truncate px-4 py-4 text-gray-600">
                        {user.firstPage ||
                          "—"}
                      </td>

                      <td className="max-w-[180px] truncate px-4 py-4 text-gray-600">
                        {user.lastPage ||
                          "—"}
                      </td>

                      <td className="max-w-[160px] truncate px-4 py-4 text-gray-600">
                        {user.trafficSource ||
                          "—"}
                      </td>

                      <td className="px-4 py-4 font-semibold text-[#6B1E1E]">
                        {Number(
                          user.visitCount ||
                            0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          )}

        </div>

      </section>
    );
  };

  // ======================================================
  // DELETE OLD VISITOR DATA
  // ======================================================

  const handleDeleteOldVisitorData =
    async () => {

      if (deletingVisitors) {
        return;
      }

      const confirmed =
        window.confirm(
          "Delete all old visitor data?\n\n" +
            "This will permanently delete records from the legacy " +
            '"visitors" collection only.\n\n' +
            "Your new visitorAnalytics data, orders, products, " +
            "requests and other website data will NOT be deleted."
        );

      if (!confirmed) {
        return;
      }

      try {
        setDeletingVisitors(
          true
        );

        setVisitorDeleteMessage(
          ""
        );

        const visitorsRef =
          collection(
            db,
            "visitors"
          );

        const snapshot =
          await new Promise(
            (resolve, reject) => {
              const unsubscribe =
                onSnapshot(
                  visitorsRef,
                  (currentSnapshot) => {
                    unsubscribe();
                    resolve(
                      currentSnapshot
                    );
                  },
                  (error) => {
                    unsubscribe();
                    reject(error);
                  }
                );
            }
          );

        if (snapshot.empty) {
          setVisitorDeleteMessage(
            "No old visitor data was found."
          );

          return;
        }

        await Promise.all(
          snapshot.docs.map(
            (visitorDoc) =>
              deleteDoc(
                visitorDoc.ref
              )
          )
        );

        setVisitorDeleteMessage(
          `${snapshot.size.toLocaleString(
            "en-IN"
          )} old visitor record${
            snapshot.size === 1
              ? ""
              : "s"
          } deleted successfully.`
        );

      } catch (error) {

        console.error(
          "Unable to delete old visitor data:",
          error
        );

        setVisitorDeleteMessage(
          "Unable to delete old visitor data. Please try again."
        );

      } finally {
        setDeletingVisitors(
          false
        );
      }
    };

  // ======================================================
  // PRODUCT COUNT
  // ======================================================

  useEffect(() => {

    const productsRef =
      collection(
        db,
        "products"
      );

    const unsubscribe =
      onSnapshot(
        productsRef,
        (snapshot) => {
          setProductCount(
            snapshot.size
          );
        },
        (error) => {
          console.error(
            "Product count error:",
            error
          );
        }
      );

    return () =>
      unsubscribe();

  }, []);

  // ======================================================
  // CUSTOM REQUEST COUNT
  // ======================================================

  useEffect(() => {

    const requestsRef =
      collection(
        db,
        "customRequests"
      );

    const unsubscribe =
      onSnapshot(
        requestsRef,
        (snapshot) => {
          setRequestCount(
            snapshot.size
          );
        },
        (error) => {
          console.error(
            "Request count error:",
            error
          );
        }
      );

    return () =>
      unsubscribe();

  }, []);

  // ======================================================
  // CUSTOMER COUNT
  // ======================================================

  useEffect(() => {

    const customersRef =
      collection(
        db,
        "customers"
      );

    const unsubscribe =
      onSnapshot(
        customersRef,
        (snapshot) => {
          setCustomerCount(
            snapshot.size
          );
        },
        (error) => {
          console.error(
            "Customer count error:",
            error
          );
        }
      );

    return () =>
      unsubscribe();

  }, []);

  // ======================================================
  // ORDER STATISTICS
  // ======================================================

  useEffect(() => {

    const ordersRef =
      collection(
        db,
        "orders"
      );

    const unsubscribe =
      onSnapshot(
        ordersRef,
        (snapshot) => {

          let newOrders = 0;
          let totalValue = 0;

          snapshot.docs.forEach(
            (item) => {

              const order =
                item.data();

              if (
                !order.status ||
                order.status === "new"
              ) {
                newOrders++;
              }

              if (
                order.status !==
                "cancelled"
              ) {
                totalValue +=
                  Number(
                    order.total ||
                      0
                  );
              }

            }
          );

          setOrderCount(
            snapshot.size
          );

          setNewOrderCount(
            newOrders
          );

          setOrderValue(
            totalValue
          );

        },
        (error) => {
          console.error(
            "Order statistics error:",
            error
          );
        }
      );

    return () =>
      unsubscribe();

  }, []);

  // ======================================================
  // NOTIFICATIONS
  // ======================================================

  useEffect(() => {

    const notificationsRef =
      collection(
        db,
        "notifications"
      );

    const notificationsQuery =
      query(
        notificationsRef,
        where(
          "read",
          "==",
          false
        )
      );

    const unsubscribe =
      onSnapshot(
        notificationsQuery,
        (snapshot) => {

          const notifications =
            snapshot.docs.map(
              (item) => ({
                id: item.id,
                ...item.data(),
              })
            );

          notifications.sort(
            (a, b) => {

              const timeA =
                a.createdAt?.toMillis?.() ||
                0;

              const timeB =
                b.createdAt?.toMillis?.() ||
                0;

              return (
                timeB - timeA
              );
            }
          );

          setUnreadNotifications(
            notifications.length
          );

          setRecentNotifications(
            notifications.slice(
              0,
              5
            )
          );

        },
        (error) => {
          console.error(
            "Notification error:",
            error
          );
        }
      );

    return () =>
      unsubscribe();

  }, []);

  // ======================================================
  // FORMAT TIME
  // ======================================================

  const formatTime =
    (timestamp) => {

      if (!timestamp) {
        return "Just now";
      }

      try {
        return timestamp
          .toDate()
          .toLocaleString(
            "en-IN",
            {
              day: "numeric",
              month: "short",
              hour: "numeric",
              minute: "2-digit",
            }
          );
      } catch {
        return "Recently";
      }
    };

  // ======================================================
  // STAT CARD
  // ======================================================

  const StatCard = ({
    title,
    value,
    icon: Icon,
    description,
    iconClass,
  }) => {

    return (
      <div className="bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">

        <div className="flex items-start justify-between">

          <div>

            <p className="text-sm font-medium text-gray-500">
              {title}
            </p>

            <p className="mt-3 text-3xl font-bold text-[#2B1714]">
              {Number(
                value || 0
              ).toLocaleString(
                "en-IN"
              )}
            </p>

            <p className="mt-2 text-xs text-gray-400">
              {description}
            </p>

          </div>

          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full ${iconClass}`}
          >
            <Icon size={22} />
          </div>

        </div>

      </div>
    );
  };

  // ======================================================
  // DASHBOARD
  // ======================================================

  return (
    <div>

      {/* ==================================================
          WELCOME
      ================================================== */}

      <div className="mb-10">

        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#B8863B]">
          Overview
        </p>

        <h1 className="mt-2 text-3xl font-bold text-[#6B1E1E]">
          Welcome to your dashboard
        </h1>

        <p className="mt-2 text-gray-500">
          Monitor your furniture store,
          users, products and
          customer orders.
        </p>

      </div>

      {/* ==================================================
          VISITOR + PRODUCT STATISTICS
      ================================================== */}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Recorded Users"
          value={visitorCount}
          icon={Users}
          description="All recorded analytics records"
          iconClass="bg-[#F5E4E4] text-[#8B2E2E]"
        />

        <button
          type="button"
          onClick={() =>
            setShowTodayUsers(true)
          }
          className="text-left"
        >
          <StatCard
            title="Today's Users"
            value={todayVisitors}
            icon={CalendarDays}
            description="Click to view today's users"
            iconClass="bg-[#F4EBD9] text-[#9A6B43]"
          />
        </button>

        <StatCard
          title="This Month's Users"
          value={monthVisitors}
          icon={CalendarRange}
          description="Users recorded this month"
          iconClass="bg-[#E8EFE5] text-green-700"
        />

        <StatCard
          title="Products"
          value={productCount}
          icon={Package}
          description="Products in Firestore"
          iconClass="bg-[#E7EAF2] text-blue-700"
        />

        <StatCard
          title="Customers"
          value={customerCount}
          icon={Users}
          description="Registered customer accounts"
          iconClass="bg-[#E8EFE5] text-green-700"
        />

      </div>

      {/* ==================================================
          LEGACY VISITOR DATA
      ================================================== */}

      <section className="mt-8 bg-white p-6 shadow-sm">

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#B8863B]">
              Visitor Data
            </p>

            <h2 className="mt-1 text-xl font-bold text-[#6B1E1E]">
              Legacy Visitor Records
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              The old visitor collection is no longer used by the new
              analytics system. Delete these old records to start fresh.
              This does not affect the new visitorAnalytics data.
            </p>

            {visitorDeleteMessage && (
              <p
                className={`mt-3 text-sm font-medium ${
                  visitorDeleteMessage.includes(
                    "successfully"
                  ) ||
                  visitorDeleteMessage.includes(
                    "No old"
                  )
                    ? "text-green-700"
                    : "text-red-600"
                }`}
              >
                {visitorDeleteMessage}
              </p>
            )}

          </div>

          <button
            type="button"
            onClick={
              handleDeleteOldVisitorData
            }
            disabled={
              deletingVisitors
            }
            className="flex w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-[#8B2E2E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6B1E1E] disabled:cursor-not-allowed disabled:opacity-60 lg:w-auto"
          >

            <X size={17} />

            {deletingVisitors
              ? "Deleting..."
              : "Delete Old Visitor Data"}

          </button>

        </div>

      </section>

      <TodayUsersTable />

      {/* ==================================================
          ORDER STATISTICS
      ================================================== */}

      <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

        <StatCard
          title="Total Orders"
          value={orderCount}
          icon={ShoppingCart}
          description="Orders received from website"
          iconClass="bg-[#F5E4E4] text-[#8B2E2E]"
        />

        <StatCard
          title="New Orders"
          value={newOrderCount}
          icon={Package}
          description="Orders awaiting action"
          iconClass="bg-[#F4EBD9] text-[#9A6B43]"
        />

        <StatCard
          title="Order Value"
          value={orderValue}
          icon={IndianRupee}
          description="Non-cancelled order value"
          iconClass="bg-[#E8EFE5] text-green-700"
        />

      </div>

      {/* ==================================================
          REQUESTS + NOTIFICATIONS
      ================================================== */}

      <div className="mt-5 grid gap-5 md:grid-cols-2">

        {/* CUSTOM REQUESTS */}

        <div className="bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F5E4E4] text-[#8B2E2E]">

                <MessageSquare
                  size={22}
                />

              </div>

              <div>

                <p className="text-sm text-gray-500">
                  Custom Furniture
                </p>

                <p className="text-2xl font-bold text-[#6B1E1E]">
                  {requestCount}
                </p>

              </div>

            </div>

            <Link
              to="/admin/requests"
              className="flex items-center gap-1 text-sm font-semibold text-[#8B2E2E]"
            >
              View
              <ArrowRight
                size={16}
              />
            </Link>

          </div>

          <p className="mt-5 text-sm text-gray-500">
            Total custom furniture
            requests received from
            customers.
          </p>

        </div>

        {/* NOTIFICATIONS */}

        <div className="bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-4">

              <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#F4EBD9] text-[#9A6B43]">

                <Bell size={22} />

                {unreadNotifications >
                  0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#8B2E2E] px-1 text-[10px] font-bold text-white">
                    {unreadNotifications >
                    99
                      ? "99+"
                      : unreadNotifications}
                  </span>
                )}

              </div>

              <div>

                <p className="text-sm text-gray-500">
                  Notifications
                </p>

                <p className="text-2xl font-bold text-[#6B1E1E]">
                  {unreadNotifications}
                </p>

              </div>

            </div>

            <Link
              to="/admin/requests"
              className="flex items-center gap-1 text-sm font-semibold text-[#8B2E2E]"
            >
              Requests
              <ArrowRight
                size={16}
              />
            </Link>

          </div>

          <p className="mt-5 text-sm text-gray-500">
            Unread notifications
            requiring your attention.
          </p>

        </div>

      </div>

      {/* ==================================================
          QUICK ACTIONS
      ================================================== */}

      <section className="mt-10">

        <h2 className="mb-5 text-xl font-bold text-[#6B1E1E]">
          Quick Actions
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">

          {/* PRODUCTS */}

          <Link
            to="/admin/products"
            className="group flex items-center justify-between bg-[#6B1E1E] p-6 text-white transition hover:bg-[#8B2E2E]"
          >

            <div className="flex items-center gap-4">

              <ShoppingBag
                size={25}
              />

              <div>

                <p className="font-semibold">
                  Manage Products
                </p>

                <p className="mt-1 text-sm text-white/70">
                  Add, edit or remove
                  furniture
                </p>

              </div>

            </div>

            <ArrowRight
              size={20}
              className="transition group-hover:translate-x-1"
            />

          </Link>

          {/* CUSTOMERS */}

          <Link
            to="/admin/customers"
            className="group flex items-center justify-between bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >

            <div className="flex items-center gap-4">

              <Users
                size={25}
                className="text-[#8B2E2E]"
              />

              <div>

                <p className="font-semibold text-[#6B1E1E]">
                  Customers
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  View registered users
                </p>

              </div>

            </div>

            <ArrowRight
              size={20}
              className="text-[#8B2E2E]"
            />

          </Link>

          {/* ORDERS */}

          <Link
            to="/admin/orders"
            className="group flex items-center justify-between bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >

            <div className="flex items-center gap-4">

              <ShoppingCart
                size={25}
                className="text-[#8B2E2E]"
              />

              <div>

                <p className="font-semibold text-[#6B1E1E]">
                  Customer Orders
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  View and manage orders
                </p>

              </div>

            </div>

            <ArrowRight
              size={20}
              className="text-[#8B2E2E]"
            />

          </Link>

          {/* REQUESTS */}

          <Link
            to="/admin/requests"
            className="group flex items-center justify-between bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >

            <div className="flex items-center gap-4">

              <MessageSquare
                size={25}
                className="text-[#8B2E2E]"
              />

              <div>

                <p className="font-semibold text-[#6B1E1E]">
                  Custom Requests
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  View customer requirements
                </p>

              </div>

            </div>

            <ArrowRight
              size={20}
              className="text-[#8B2E2E]"
            />

          </Link>

          {/* SETTINGS */}

          <Link
            to="/admin/settings"
            className="group flex items-center justify-between bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >

            <div className="flex items-center gap-4">

              <Settings
                size={25}
                className="text-[#B8863B]"
              />

              <div>

                <p className="font-semibold text-[#6B1E1E]">
                  Website Settings
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Edit shop information
                </p>

              </div>

            </div>

            <ArrowRight
              size={20}
              className="text-[#8B2E2E]"
            />

          </Link>

          {/* THEME MANAGER */}

          <div className="bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

            <div className="flex items-center gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F5E4E4] text-[#8B2E2E]">
                <Palette
                  size={22}
                />
              </div>

              <div className="min-w-0">

                <p className="font-semibold text-[#6B1E1E]">
                  Website Theme
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Change customer theme
                </p>

              </div>

            </div>

            <div className="mt-5 space-y-2">

              {themes.map(
                (theme) => (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() =>
                      handleThemeChange(
                        theme.id
                      )
                    }
                    disabled={
                      themeSaving
                    }
                    className={`flex w-full items-center gap-3 rounded-lg border p-2 text-left transition ${
                      selectedTheme ===
                      theme.id
                        ? "border-[#8B2E2E] bg-[#F8F1E7]"
                        : "border-gray-100 hover:border-[#B8863B]/50 hover:bg-gray-50"
                    }`}
                  >

                    <span
                      className={`h-7 w-7 shrink-0 rounded-full ${theme.preview}`}
                    />

                    <span className="min-w-0 flex-1">

                      <span className="block truncate text-xs font-semibold text-[#2B1714]">
                        {theme.name}
                      </span>

                      <span className="block truncate text-[10px] text-gray-400">
                        {theme.description}
                      </span>

                    </span>

                    {selectedTheme ===
                      theme.id && (
                      <Check
                        size={17}
                        className="shrink-0 text-[#8B2E2E]"
                      />
                    )}

                  </button>
                )
              )}

            </div>

            {themeMessage && (
              <p
                className={`mt-3 text-xs font-medium ${
                  themeMessage.includes(
                    "successfully"
                  )
                    ? "text-green-700"
                    : "text-red-600"
                }`}
              >
                {themeMessage}
              </p>
            )}

          </div>

          {/* VIEW STORE */}

          <Link
            to="/"
            className="group flex items-center justify-between bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >

            <div className="flex items-center gap-4">

              <Globe
                size={25}
                className="text-[#B8863B]"
              />

              <div>

                <p className="font-semibold text-[#6B1E1E]">
                  View Store
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  See your customer website
                </p>

              </div>

            </div>

            <ArrowRight
              size={20}
              className="text-[#8B2E2E]"
            />

          </Link>

        </div>

      </section>

      {/* ==================================================
          RECENT NOTIFICATIONS
      ================================================== */}

      <section className="mt-10">

        <div className="mb-5 flex items-center justify-between">

          <h2 className="text-xl font-bold text-[#6B1E1E]">
            Recent Notifications
          </h2>

          <Link
            to="/admin/requests"
            className="text-sm font-semibold text-[#8B2E2E]"
          >
            View Requests
          </Link>

        </div>

        <div className="overflow-hidden bg-white shadow-sm">

          {recentNotifications.length ===
          0 ? (

            <div className="p-10 text-center">

              <Bell
                size={35}
                className="mx-auto text-gray-300"
              />

              <p className="mt-4 font-medium text-gray-500">
                No unread notifications
              </p>

            </div>

          ) : (

            recentNotifications.map(
              (notification) => (

                <Link
                  key={
                    notification.id
                  }
                  to="/admin/requests"
                  className="flex items-center gap-4 border-b border-[#6B1E1E]/10 p-5 transition last:border-b-0 hover:bg-[#F8F1E7]"
                >

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F5E4E4] text-[#8B2E2E]">
                    <Bell
                      size={18}
                    />
                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="font-semibold text-[#6B1E1E]">
                      {notification.title ||
                        "New Notification"}
                    </p>

                    <p className="mt-1 truncate text-sm text-gray-500">
                      {notification.message ||
                        "New notification received."}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {formatTime(
                        notification.createdAt
                      )}
                    </p>

                  </div>

                  <ArrowRight
                    size={18}
                    className="shrink-0 text-[#B8863B]"
                  />

                </Link>

              )
            )

          )}

        </div>

      </section>

    </div>
  );
}

export default AdminDashboard;