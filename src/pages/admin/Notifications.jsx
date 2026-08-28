import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  collection,
  deleteDoc,
  onSnapshot,
  doc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";

import {
  Bell,
  Check,
  CheckCheck,
  ArrowLeft,
  Trash2,
  Package,
  MessageSquare,
  ShoppingCart,
  Info,
} from "lucide-react";

import { db } from "../../firebase/firebase";

function Notifications() {
  const [notifications, setNotifications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // ======================================================
  // LOAD NOTIFICATIONS
  // ======================================================

  useEffect(() => {
    const notificationsRef =
      collection(db, "notifications");

    const customerNotificationsRef =
      collection(
        db,
        "customerNotifications"
      );

    let adminData = [];
    let customerData = [];

    const updateCombined =
      () => {
        const combined = [
          ...adminData,
          ...customerData,
        ];

        combined.sort((a, b) => {
          const timeA =
            a.createdAt?.toMillis?.() || 0;

          const timeB =
            b.createdAt?.toMillis?.() || 0;

          return timeB - timeA;
        });

        setNotifications(combined);
        setLoading(false);
      };

    const unsubscribeAdmin =
      onSnapshot(
        notificationsRef,
        (snapshot) => {
          adminData =
            snapshot.docs.map(
              (item) => ({
                id: item.id,
                notificationSource:
                  "notifications",
                ...item.data(),
              })
            );

          updateCombined();
        },
        (error) => {
          console.error(
            "Admin notification loading error:",
            error
          );

          setLoading(false);
        }
      );

    const unsubscribeCustomer =
      onSnapshot(
        customerNotificationsRef,
        (snapshot) => {
          customerData =
            snapshot.docs.map(
              (item) => ({
                id: `customer-${item.id}`,
                notificationSource:
                  "customerNotifications",
                ...item.data(),
              })
            );

          updateCombined();
        },
        (error) => {
          console.error(
            "Customer notification loading error:",
            error
          );
        }
      );

    return () => {
      unsubscribeAdmin();
      unsubscribeCustomer();
    };
  }, []);

  // ======================================================
  // MARK ONE AS READ
  // ======================================================

  const markAsRead = async (id) => {
    try {
      const notification =
        notifications.find(
          (item) => item.id === id
        );

      if (!notification) {
        return;
      }

      await updateDoc(
        doc(
          db,
          notification.notificationSource ||
            "notifications",
          notification.notificationSource ===
          "customerNotifications"
            ? id.replace(
                "customer-",
                ""
              )
            : id
        ),
        {
          read: true,
        }
      );
    } catch (error) {
      console.error(
        "Error marking notification as read:",
        error
      );
    }
  };

  // ======================================================
  // MARK ALL AS READ
  // ======================================================

  const markAllAsRead = async () => {
    try {
      const unread =
        notifications.filter(
          (item) => item.read !== true
        );

      if (unread.length === 0) {
        return;
      }

      const batch = writeBatch(db);

      unread.forEach((item) => {
        const collectionName =
          item.notificationSource ||
          "notifications";

        const documentId =
          collectionName ===
          "customerNotifications"
            ? item.id.replace(
                "customer-",
                ""
              )
            : item.id;

        batch.update(
          doc(
            db,
            collectionName,
            documentId
          ),
          {
            read: true,
          }
        );
      });

      await batch.commit();

    } catch (error) {
      console.error(
        "Error marking all notifications as read:",
        error
      );
    }
  };

  // ======================================================
  // DELETE NOTIFICATION
  // ======================================================

  const deleteNotification = async (
    id
  ) => {
    try {
      const notification =
        notifications.find(
          (item) => item.id === id
        );

      if (!notification) {
        return;
      }

      const collectionName =
        notification.notificationSource ||
        "notifications";

      const documentId =
        collectionName ===
        "customerNotifications"
          ? id.replace(
              "customer-",
              ""
            )
          : id;

      await deleteDoc(
        doc(
          db,
          collectionName,
          documentId
        )
      );
    } catch (error) {
      console.error(
        "Delete notification error:",
        error
      );
    }
  };

  // ======================================================
  // NOTIFICATION ICON
  // ======================================================

  const getNotificationIcon = (
    type
  ) => {
    switch (type) {
      case "order":
        return (
          <ShoppingCart size={20} />
        );

      case "product":
        return (
          <Package size={20} />
        );

      case "request":
        return (
          <MessageSquare size={20} />
        );

      default:
        return (
          <Info size={20} />
        );
    }
  };

  // ======================================================
  // FORMAT DATE
  // ======================================================

  const formatDate = (
    timestamp
  ) => {
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
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
          }
        );
    } catch {
      return "Recently";
    }
  };

  const unreadCount =
    notifications.filter(
      (item) => item.read !== true
    ).length;

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <div>

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F4EBD9] text-[#9A6B43]">

              <Bell size={24} />

            </div>

            <div>

              <p className="text-sm uppercase tracking-[0.2em] text-[#B8863B]">
                Admin
              </p>

              <h1 className="text-3xl font-bold text-[#6B1E1E]">
                Notifications
              </h1>

            </div>

          </div>

          <p className="mt-3 text-gray-500">
            Stay updated with orders,
            requests and website activity.
          </p>

        </div>

        {/* MARK ALL */}

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllAsRead}
            className="flex items-center justify-center gap-2 rounded-md bg-[#6B1E1E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#8B2E2E]"
          >
            <CheckCheck size={18} />
            Mark All as Read
          </button>
        )}

      </div>

      {/* ==================================================
          SUMMARY
      ================================================== */}

      <div className="mb-6 grid gap-4 sm:grid-cols-2">

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
            Unread Notifications
          </p>

          <p className="mt-2 text-3xl font-bold text-[#8B2E2E]">
            {unreadCount}
          </p>

        </div>

      </div>

      {/* ==================================================
          NOTIFICATION LIST
      ================================================== */}

      <div className="overflow-hidden bg-white shadow-sm">

        {loading ? (

          <div className="p-12 text-center">

            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#B8863B] border-t-transparent" />

            <p className="mt-4 text-sm text-gray-500">
              Loading notifications...
            </p>

          </div>

        ) : notifications.length ===
          0 ? (

          <div className="p-12 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F8F1E7] text-[#B8863B]">

              <Bell size={28} />

            </div>

            <h2 className="mt-5 text-lg font-semibold text-[#6B1E1E]">
              No notifications
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              You're all caught up.
            </p>

            <Link
              to="/admin/dashboard"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#8B2E2E]"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
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
                  className={`flex flex-col gap-4 border-b border-[#6B1E1E]/10 p-5 transition last:border-b-0 md:flex-row md:items-center ${
                    isUnread
                      ? "bg-[#FFF9F0]"
                      : "bg-white"
                  }`}
                >

                  {/* ICON */}

                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                      isUnread
                        ? "bg-[#F5E4E4] text-[#8B2E2E]"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {getNotificationIcon(
                      notification.type
                    )}
                  </div>

                  {/* CONTENT */}

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
                        "New activity has been recorded."}
                    </p>

                    <p className="mt-2 text-xs text-gray-400">
                      {formatDate(
                        notification.createdAt
                      )}
                    </p>

                  </div>

                  {/* ACTIONS */}

                  <div className="flex items-center gap-2">

                    {isUnread && (
                      <button
                        type="button"
                        onClick={() =>
                          markAsRead(
                            notification.id
                          )
                        }
                        title="Mark as read"
                        className="flex h-9 w-9 items-center justify-center rounded-full text-[#6B1E1E] transition hover:bg-[#6B1E1E]/10"
                      >
                        <Check size={18} />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        deleteNotification(
                          notification.id
                        )
                      }
                      title="Delete"
                      className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={17} />
                    </button>

                  </div>

                </div>
              );
            }
          )

        )}

      </div>

    </div>
  );
}

export default Notifications;
