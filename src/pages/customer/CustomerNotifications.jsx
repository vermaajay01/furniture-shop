import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";

import {
  Bell,
  Check,
  CheckCheck,
  ArrowLeft,
  Package,
  Info,
  Loader2,
} from "lucide-react";

import { db } from "../../firebase/firebase";
import { useAuth } from "../../context/AuthContext";

function CustomerNotifications() {
  const { user, loading: authLoading } =
    useAuth();

  const [notifications, setNotifications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    const notificationsQuery = query(
      collection(
        db,
        "customerNotifications"
      ),
      where(
        "userId",
        "==",
        user.uid
      )
    );

    const unsubscribe =
      onSnapshot(
        notificationsQuery,
        (snapshot) => {
          const data =
            snapshot.docs.map(
              (item) => ({
                id: item.id,
                ...item.data(),
              })
            );

          data.sort((a, b) => {
            const timeA =
              a.createdAt?.toMillis?.() || 0;

            const timeB =
              b.createdAt?.toMillis?.() || 0;

            return timeB - timeA;
          });

          setNotifications(data);
          setLoading(false);
        },
        (error) => {
          console.error(
            "Customer notification loading error:",
            error
          );

          setNotifications([]);
          setLoading(false);
        }
      );

    return () => unsubscribe();
  }, [user, authLoading]);

  const markAsRead = async (id) => {
    try {
      await updateDoc(
        doc(
          db,
          "customerNotifications",
          id
        ),
        {
          read: true,
        }
      );
    } catch (error) {
      console.error(
        "Unable to mark notification as read:",
        error
      );
    }
  };

  const markAllAsRead = async () => {
    const unread =
      notifications.filter(
        (item) => item.read !== true
      );

    if (!unread.length) {
      return;
    }

    try {
      const batch = writeBatch(db);

      unread.forEach((item) => {
        batch.update(
          doc(
            db,
            "customerNotifications",
            item.id
          ),
          {
            read: true,
          }
        );
      });

      await batch.commit();
    } catch (error) {
      console.error(
        "Unable to mark all notifications as read:",
        error
      );
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) {
      return "Just now";
    }

    try {
      return timestamp
        .toDate()
        .toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
    } catch {
      return "Recently";
    }
  };

  const unreadCount =
    notifications.filter(
      (item) => item.read !== true
    ).length;

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#F8F1E7]">
        <div className="flex items-center gap-3 text-[#6B1E1E]">
          <Loader2
            size={24}
            className="animate-spin"
          />
          Loading notifications...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#F8F1E7] px-4">
        <div className="w-full max-w-md bg-white p-8 text-center shadow-sm">
          <Bell
            size={48}
            className="mx-auto text-[#6B1E1E]"
          />

          <h1 className="mt-5 text-2xl font-bold text-[#6B1E1E]">
            Login Required
          </h1>

          <p className="mt-2 text-gray-500">
            Login to view your notifications.
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

  return (
    <div className="min-h-[70vh] bg-[#F8F1E7] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[#B8863B]">
              Customer Account
            </p>

            <div className="mt-2 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F4EBD9] text-[#8B2E2E]">
                <Bell size={23} />
              </div>

              <h1 className="text-3xl font-bold text-[#6B1E1E]">
                Notifications
              </h1>
            </div>

            <p className="mt-2 text-gray-500">
              Stay updated about your orders.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="inline-flex items-center justify-center gap-2 bg-[#6B1E1E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#8B2E2E]"
            >
              <CheckCheck size={18} />
              Mark All as Read
            </button>
          )}

        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          <div className="bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Notifications
            </p>

            <p className="mt-2 text-3xl font-bold text-[#6B1E1E]">
              {notifications.length}
            </p>
          </div>

          <div className="bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Unread
            </p>

            <p className="mt-2 text-3xl font-bold text-[#8B2E2E]">
              {unreadCount}
            </p>
          </div>
        </div>

        <div className="mt-7 overflow-hidden bg-white shadow-sm">

          {!notifications.length ? (
            <div className="px-6 py-16 text-center">
              <Bell
                size={50}
                className="mx-auto text-gray-300"
              />

              <h2 className="mt-5 text-xl font-bold text-[#6B1E1E]">
                No Notifications
              </h2>

              <p className="mt-2 text-gray-500">
                You're all caught up.
              </p>

              <Link
                to="/account/orders"
                className="mt-6 inline-flex items-center gap-2 bg-[#6B1E1E] px-6 py-3 font-semibold text-white hover:bg-[#8B2E2E]"
              >
                <Package size={18} />
                View My Orders
              </Link>
            </div>
          ) : (
            notifications.map(
              (notification) => {
                const isUnread =
                  notification.read !== true;

                return (
                  <div
                    key={notification.id}
                    className={`flex flex-col gap-4 border-b border-gray-100 p-5 last:border-b-0 sm:flex-row sm:items-start ${
                      isUnread
                        ? "bg-[#FFF9F0]"
                        : "bg-white"
                    }`}
                  >

                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                        isUnread
                          ? "bg-[#F5E4E4] text-[#8B2E2E]"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {notification.type ===
                      "order_status" ? (
                        <Package size={20} />
                      ) : (
                        <Info size={20} />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3
                          className={`text-sm ${
                            isUnread
                              ? "font-bold text-[#6B1E1E]"
                              : "font-semibold text-gray-700"
                          }`}
                        >
                          {notification.title ||
                            "Notification"}
                        </h3>

                        {isUnread && (
                          <span className="h-2 w-2 rounded-full bg-[#8B2E2E]" />
                        )}
                      </div>

                      <p className="mt-1 text-sm text-gray-500">
                        {notification.message ||
                          "Your order has been updated."}
                      </p>

                      {notification.orderId && (
                        <Link
                          to="/account/orders"
                          className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#8B2E2E] hover:underline"
                        >
                          View Order
                        </Link>
                      )}

                      <p className="mt-2 text-xs text-gray-400">
                        {formatDate(
                          notification.createdAt
                        )}
                      </p>
                    </div>

                    {isUnread && (
                      <button
                        type="button"
                        onClick={() =>
                          markAsRead(
                            notification.id
                          )
                        }
                        title="Mark as read"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#6B1E1E] transition hover:bg-[#6B1E1E]/10"
                      >
                        <Check size={18} />
                      </button>
                    )}

                  </div>
                );
              }
            )
          )}

        </div>

      </div>
    </div>
  );
}

export default CustomerNotifications;
