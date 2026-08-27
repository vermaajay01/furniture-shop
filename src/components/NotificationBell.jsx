import { useEffect, useState } from "react";

import {
  collection,
  onSnapshot,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";

import {
  Bell,
  MessageSquare,
  ShoppingCart,
  X,
  CheckCheck,
  Eye,
  ImageOff,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { db } from "../firebase/firebase";

function NotificationBell() {
  const navigate = useNavigate();

  const [notifications, setNotifications] =
    useState([]);

  const [open, setOpen] =
    useState(false);

  const [processing, setProcessing] =
    useState(false);

  // ======================================================
  // REAL-TIME NOTIFICATIONS
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
          const notificationList =
            snapshot.docs.map(
              (item) => ({
                id: item.id,
                ...item.data(),
              })
            );

          notificationList.sort(
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

          setNotifications(
            notificationList
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
  // MARK ONE AS READ
  // ======================================================

  const markAsRead = async (
    notificationId
  ) => {
    try {
      await updateDoc(
        doc(
          db,
          "notifications",
          notificationId
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
    if (
      notifications.length ===
      0
    ) {
      return;
    }

    try {
      setProcessing(true);

      await Promise.all(
        notifications.map(
          (notification) =>
            updateDoc(
              doc(
                db,
                "notifications",
                notification.id
              ),
              {
                read: true,
              }
            )
        )
      );
    } catch (error) {
      console.error(
        "Error marking notifications as read:",
        error
      );
    } finally {
      setProcessing(false);
    }
  };

  // ======================================================
  // OPEN NOTIFICATION
  // ======================================================

  const handleNotificationClick =
    async (notification) => {
      await markAsRead(
        notification.id
      );

      setOpen(false);

      // CUSTOMER ORDER
      if (
        notification.type ===
        "order"
      ) {
        navigate(
          "/admin/orders"
        );

        return;
      }

      // CUSTOM FURNITURE REQUEST
      if (
        notification.type ===
        "custom_request"
      ) {
        navigate(
          "/admin/requests"
        );

        return;
      }
    };

  // ======================================================
  // FORMAT DATE
  // ======================================================

  const formatTime = (
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

  // ======================================================
  // NOTIFICATION ICON
  // ======================================================

  const getNotificationIcon =
    (notification) => {
      if (
        notification.type ===
        "order"
      ) {
        return (
          <ShoppingCart
            size={18}
          />
        );
      }

      if (
        notification.type ===
        "custom_request"
      ) {
        return (
          <MessageSquare
            size={18}
          />
        );
      }

      return (
        <Bell size={18} />
      );
    };

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <div className="relative">

      {/* ==================================================
          NOTIFICATION BUTTON
      ================================================== */}

      <button
        type="button"
        onClick={() =>
          setOpen(
            (previous) =>
              !previous
          )
        }
        className={`relative flex h-11 w-11 items-center justify-center rounded-full transition ${
          open
            ? "bg-[#6B1E1E] text-white"
            : "text-[#6B1E1E] hover:bg-[#F1E4D7]"
        }`}
        aria-label="Notifications"
        aria-expanded={open}
      >

        <Bell
          size={21}
          className={
            notifications.length >
            0
              ? "animate-[wiggle_0.6s_ease-in-out]"
              : ""
          }
        />

        {/* NOTIFICATION COUNT */}

        {notifications.length >
          0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#B8863B] px-1 text-[10px] font-bold text-white shadow-sm">
            {notifications.length >
            99
              ? "99+"
              : notifications.length}
          </span>
        )}

      </button>

      {/* ==================================================
          DROPDOWN
      ================================================== */}

      {open && (
        <>
          {/* MOBILE OVERLAY */}

          <div
            className="fixed inset-0 z-40 bg-black/25 md:hidden"
            onClick={() =>
              setOpen(false)
            }
          />

          <div className="fixed right-4 top-20 z-50 w-[calc(100vw-2rem)] max-w-md overflow-hidden border border-[#6B1E1E]/15 bg-white shadow-2xl md:absolute md:right-0 md:top-14 md:w-96">

            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-[#6B1E1E]/10 bg-[#F8F1E7] px-5 py-4">

              <div>

                <div className="flex items-center gap-2">

                  <h3 className="font-bold text-[#6B1E1E]">
                    Notifications
                  </h3>

                  {notifications.length >
                    0 && (
                    <span className="rounded-full bg-[#B8863B] px-2 py-0.5 text-[10px] font-bold text-white">
                      {notifications.length}
                    </span>
                  )}

                </div>

                <p className="mt-1 text-xs text-gray-500">
                  {notifications.length >
                  0
                    ? `${notifications.length} unread notification${
                        notifications.length !==
                        1
                          ? "s"
                          : ""
                      }`
                    : "You're all caught up"}
                </p>

              </div>

              <div className="flex items-center gap-2">

                {notifications.length >
                  0 && (
                  <button
                    type="button"
                    onClick={
                      markAllAsRead
                    }
                    disabled={
                      processing
                    }
                    className="flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold text-[#8B2E2E] transition hover:bg-[#F1E4D7] disabled:opacity-50"
                  >

                    <CheckCheck
                      size={14}
                    />

                    {processing
                      ? "Updating..."
                      : "Mark all"}

                  </button>
                )}

                <button
                  type="button"
                  onClick={() =>
                    setOpen(false)
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[#6B1E1E] transition hover:bg-[#6B1E1E]/10"
                  aria-label="Close notifications"
                >
                  <X size={17} />
                </button>

              </div>

            </div>

            {/* NOTIFICATION LIST */}

            <div className="max-h-[500px] overflow-y-auto">

              {notifications.length ===
                0 && (
                <div className="px-6 py-14 text-center">

                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F5E4E4] text-[#8B2E2E]">

                    <Bell
                      size={26}
                    />

                  </div>

                  <p className="mt-4 font-semibold text-[#6B1E1E]">
                    No new notifications
                  </p>

                  <p className="mt-1 text-sm text-gray-400">
                    New customer orders
                    and enquiries will
                    appear here.
                  </p>

                </div>
              )}

              {notifications.map(
                (notification) => {

                  const isOrder =
                    notification.type ===
                    "order";

                  return (
                    <button
                      type="button"
                      key={
                        notification.id
                      }
                      onClick={() =>
                        handleNotificationClick(
                          notification
                        )
                      }
                      className="group flex w-full gap-4 border-b border-gray-100 px-5 py-4 text-left transition hover:bg-[#F8F1E7]"
                    >

                      {/* ==================================================
                          ORDER IMAGE / ICON
                      ================================================== */}

                      {isOrder &&
                      notification.image ? (

                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-gray-100">

                          <img
                            src={
                              notification.image
                            }
                            alt={
                              notification.title ||
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

                        </div>

                      ) : isOrder ? (

                        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-[#F5E4E4] text-[#8B2E2E]">

                          <ImageOff
                            size={18}
                          />

                        </div>

                      ) : (

                        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F5E4E4] text-[#8B2E2E]">

                          {getNotificationIcon(
                            notification
                          )}

                        </div>

                      )}

                      {/* CONTENT */}

                      <div className="min-w-0 flex-1">

                        <div className="flex items-start justify-between gap-3">

                          <div className="min-w-0">

                            <p className="font-semibold text-[#2B1714]">
                              {notification.title ||
                                "New Notification"}
                            </p>

                            {isOrder &&
                              notification.customerName && (
                                <p className="mt-0.5 text-xs font-medium text-[#8B2E2E]">
                                  Customer:{" "}
                                  {
                                    notification.customerName
                                  }
                                </p>
                              )}

                          </div>

                          <Eye
                            size={15}
                            className="mt-1 shrink-0 text-gray-300 transition group-hover:text-[#8B2E2E]"
                          />

                        </div>

                        <p className="mt-1 line-clamp-2 text-sm leading-5 text-gray-500">
                          {notification.message ||
                            "You have a new notification."}
                        </p>

                        {/* ORDER TOTAL */}

                        {isOrder &&
                          typeof notification.total !==
                            "undefined" && (
                            <p className="mt-1 text-sm font-bold text-[#6B1E1E]">
                              ₹
                              {Number(
                                notification.total ||
                                  0
                              ).toLocaleString(
                                "en-IN"
                              )}

                              {notification.itemCount
                                ? ` • ${notification.itemCount} item${
                                    notification.itemCount !==
                                    1
                                      ? "s"
                                      : ""
                                  }`
                                : ""}
                            </p>
                          )}

                        <p className="mt-2 text-xs text-gray-400">
                          {formatTime(
                            notification.createdAt
                          )}
                        </p>

                      </div>

                    </button>
                  );
                }
              )}

            </div>

            {/* FOOTER */}

            <div className="border-t border-[#6B1E1E]/10 bg-[#F8F1E7] px-5 py-3">

              <div className="flex gap-3">

                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);

                    navigate(
                      "/admin/orders"
                    );
                  }}
                  className="flex-1 text-sm font-semibold text-[#8B2E2E] transition hover:text-[#6B1E1E]"
                >
                  View Orders
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);

                    navigate(
                      "/admin/requests"
                    );
                  }}
                  className="flex-1 border-l border-[#6B1E1E]/10 text-sm font-semibold text-[#8B2E2E] transition hover:text-[#6B1E1E]"
                >
                  View Requests
                </button>

              </div>

            </div>

          </div>
        </>
      )}

    </div>
  );
}

export default NotificationBell;