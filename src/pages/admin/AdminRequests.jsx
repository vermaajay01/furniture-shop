import { useEffect, useState } from "react";

import {
  collection,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import {
  ArrowLeft,
  Calendar,
  Mail,
  MessageCircle,
  Phone,
  Trash2,
  User,
  X,
  ExternalLink,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Users,
} from "lucide-react";

import { Link } from "react-router-dom";

import { db } from "../../firebase/firebase";

function AdminRequests() {
  const [requests, setRequests] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [selectedRequest, setSelectedRequest] =
    useState(null);

  const [filter, setFilter] =
    useState("all");

  // ======================================================
  // LOAD REQUESTS
  // ======================================================

  useEffect(() => {
    const requestsRef =
      collection(
        db,
        "customRequests"
      );

    const requestsQuery =
      query(
        requestsRef,
        orderBy(
          "createdAt",
          "desc"
        )
      );

    const unsubscribe =
      onSnapshot(
        requestsQuery,
        (snapshot) => {
          const requestList =
            snapshot.docs.map(
              (item) => ({
                id: item.id,
                ...item.data(),
              })
            );

          setRequests(
            requestList
          );

          setLoading(false);
        },
        (error) => {
          console.error(
            "Requests loading error:",
            error
          );

          setLoading(false);
        }
      );

    return () =>
      unsubscribe();
  }, []);

  // ======================================================
  // UPDATE STATUS
  // ======================================================

  const updateStatus = async (
    requestId,
    status
  ) => {
    try {
      await updateDoc(
        doc(
          db,
          "customRequests",
          requestId
        ),
        {
          status,
        }
      );

      setSelectedRequest(
        (previous) => {
          if (!previous) {
            return previous;
          }

          if (
            previous.id !==
            requestId
          ) {
            return previous;
          }

          return {
            ...previous,
            status,
          };
        }
      );
    } catch (error) {
      console.error(
        "Unable to update request:",
        error
      );
    }
  };

  // ======================================================
  // DELETE REQUEST
  // ======================================================

  const deleteRequest = async (
    requestId
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this request?"
      );

    if (!confirmed) {
      return;
    }

    try {
      await deleteDoc(
        doc(
          db,
          "customRequests",
          requestId
        )
      );

      setSelectedRequest(
        null
      );
    } catch (error) {
      console.error(
        "Unable to delete request:",
        error
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

  // ======================================================
  // WHATSAPP
  // ======================================================

  const getWhatsAppURL = (
    request
  ) => {
    const phone =
      request.phone?.replace(
        /\D/g,
        ""
      );

    const message = `
Hello ${request.name},

This is Hari Om Furniture House.

We received your custom furniture request.

Furniture: ${
      request.furnitureType ||
      "Custom Furniture"
    }

Dimensions: ${
      request.dimensions ||
      "Not specified"
    }

Material: ${
      request.material ||
      "Not specified"
    }

Budget: ${
      request.budget ||
      "Not specified"
    }

Description:
${
      request.description ||
      "Not provided"
    }

We would like to discuss your requirements further.

Thank you.
    `.trim();

    return `https://wa.me/${phone}?text=${encodeURIComponent(
      message
    )}`;
  };

  // ======================================================
  // FILTER
  // ======================================================

  const filteredRequests =
    filter === "all"
      ? requests
      : requests.filter(
          (request) =>
            request.status ===
            filter
        );

  // ======================================================
  // COUNTS
  // ======================================================

  const newCount =
    requests.filter(
      (request) =>
        !request.status ||
        request.status === "new"
    ).length;

  const contactedCount =
    requests.filter(
      (request) =>
        request.status ===
        "contacted"
    ).length;

  const completedCount =
    requests.filter(
      (request) =>
        request.status ===
        "completed"
    ).length;

  const cancelledCount =
    requests.filter(
      (request) =>
        request.status ===
        "cancelled"
    ).length;

  // ======================================================
  // STATUS STYLE
  // ======================================================

  const getStatusStyle = (
    status
  ) => {
    switch (status) {
      case "contacted":
        return "bg-blue-100 text-blue-700";

      case "completed":
        return "bg-green-100 text-green-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-[#F8E8C8] text-[#7A571E]";
    }
  };

  // ======================================================
  // STATUS ICON
  // ======================================================

  const getStatusIcon = (
    status
  ) => {
    switch (status) {
      case "contacted":
        return (
          <Phone size={14} />
        );

      case "completed":
        return (
          <CheckCircle size={14} />
        );

      case "cancelled":
        return (
          <XCircle size={14} />
        );

      default:
        return (
          <Clock size={14} />
        );
    }
  };

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <div className="min-h-screen bg-[#F8F1E7]">

      {/* ==================================================
          HEADER
      ================================================== */}

      <header className="sticky top-0 z-30 border-b border-[#6B1E1E]/15 bg-[#F8F1E7]/95 shadow-sm backdrop-blur-md">

        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-6">

          {/* BRAND */}

          <div className="flex items-center gap-4">

            <Link
              to="/admin/dashboard"
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#6B1E1E] transition hover:bg-[#6B1E1E]/10"
            >
              <ArrowLeft size={21} />
            </Link>

            <div>

              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#B8863B]">
                Admin Panel
              </p>

              <h1 className="text-xl font-bold text-[#6B1E1E] md:text-2xl">
                Custom Requests
              </h1>

              <p className="hidden text-xs text-gray-500 sm:block">
                Manage customer furniture enquiries
              </p>

            </div>

          </div>

          {/* REQUEST COUNT */}

          <div className="flex items-center gap-3">

            <div className="hidden text-right sm:block">

              <p className="text-xs text-gray-500">
                Total Requests
              </p>

              <p className="font-bold text-[#6B1E1E]">
                {requests.length}
              </p>

            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6B1E1E] text-white">
              <Users size={19} />
            </div>

          </div>

        </div>

      </header>

      {/* ==================================================
          CONTENT
      ================================================== */}

      <main className="mx-auto max-w-7xl px-5 py-8 md:px-6 md:py-10">

        {/* ==================================================
            PAGE INTRO
        ================================================== */}

        <div className="mb-8">

          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#B8863B]">
            Customer Enquiries
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#6B1E1E]">
            Custom Furniture Requests
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            View customer requirements,
            contact customers through WhatsApp,
            and manage request status.
          </p>

        </div>

        {/* ==================================================
            STATISTICS
        ================================================== */}

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* ALL */}

          <div className="bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  All Requests
                </p>

                <p className="mt-2 text-2xl font-bold text-[#6B1E1E]">
                  {requests.length}
                </p>

              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5E4E4] text-[#8B2E2E]">
                <Users size={19} />
              </div>

            </div>

          </div>

          {/* NEW */}

          <div className="bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  New
                </p>

                <p className="mt-2 text-2xl font-bold text-[#7A571E]">
                  {newCount}
                </p>

              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F8E8C8] text-[#7A571E]">
                <Clock size={19} />
              </div>

            </div>

          </div>

          {/* CONTACTED */}

          <div className="bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  Contacted
                </p>

                <p className="mt-2 text-2xl font-bold text-blue-700">
                  {contactedCount}
                </p>

              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                <Phone size={19} />
              </div>

            </div>

          </div>

          {/* COMPLETED */}

          <div className="bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  Completed
                </p>

                <p className="mt-2 text-2xl font-bold text-green-700">
                  {completedCount}
                </p>

              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-700">
                <CheckCircle size={19} />
              </div>

            </div>

          </div>

        </div>

        {/* ==================================================
            FILTERS
        ================================================== */}

        <div className="mb-8 flex flex-wrap gap-2">

          {[
            ["all", "All"],
            ["new", "New"],
            ["contacted", "Contacted"],
            ["completed", "Completed"],
            ["cancelled", "Cancelled"],
          ].map(
            ([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() =>
                  setFilter(value)
                }
                className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold transition ${
                  filter === value
                    ? "bg-[#6B1E1E] text-white"
                    : "bg-white text-[#6B1E1E] hover:bg-[#F1E4D7]"
                }`}
              >
                {label}

                {value === "new" &&
                  newCount > 0 && (
                    <span
                      className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] ${
                        filter === value
                          ? "bg-white text-[#6B1E1E]"
                          : "bg-[#B8863B] text-white"
                      }`}
                    >
                      {newCount}
                    </span>
                  )}

                {value ===
                  "cancelled" &&
                  cancelledCount >
                    0 && (
                    <span
                      className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] ${
                        filter === value
                          ? "bg-white text-[#6B1E1E]"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {cancelledCount}
                    </span>
                  )}
              </button>
            )
          )}

        </div>

        {/* ==================================================
            LOADING
        ================================================== */}

        {loading && (
          <div className="bg-white p-16 text-center shadow-sm">

            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#6B1E1E]/20 border-t-[#6B1E1E]" />

            <p className="mt-5 text-sm font-medium text-[#8B2E2E]">
              Loading customer requests...
            </p>

          </div>
        )}

        {/* ==================================================
            EMPTY
        ================================================== */}

        {!loading &&
          filteredRequests.length ===
            0 && (
            <div className="bg-white p-14 text-center shadow-sm">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F5E4E4] text-[#8B2E2E]">
                <MessageCircle
                  size={30}
                />
              </div>

              <h2 className="mt-5 text-xl font-bold text-[#6B1E1E]">
                No requests found
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                Customer custom furniture
                requests will appear here.
              </p>

            </div>
          )}

        {/* ==================================================
            REQUEST LIST
        ================================================== */}

        {!loading &&
          filteredRequests.length >
            0 && (
            <div className="space-y-4">

              {filteredRequests.map(
                (request) => (
                  <div
                    key={request.id}
                    className="bg-white p-5 shadow-sm transition hover:shadow-md md:p-6"
                  >

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                      {/* CUSTOMER */}

                      <div className="flex min-w-0 items-start gap-4">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F5E4E4] text-[#8B2E2E]">
                          <User size={22} />
                        </div>

                        <div className="min-w-0">

                          <div className="flex flex-wrap items-center gap-3">

                            <h2 className="text-lg font-bold text-[#6B1E1E]">
                              {request.name ||
                                "Customer"}
                            </h2>

                            <span
                              className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                                request.status
                              )}`}
                            >
                              {getStatusIcon(
                                request.status
                              )}

                              {request.status ||
                                "new"}
                            </span>

                          </div>

                          <p className="mt-1 text-sm font-medium text-[#8B2E2E]">
                            {request.furnitureType ||
                              "Custom Furniture"}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-gray-500">

                            {request.phone && (
                              <span className="flex items-center gap-1.5">
                                <Phone
                                  size={14}
                                />
                                {
                                  request.phone
                                }
                              </span>
                            )}

                            {request.email && (
                              <span className="flex items-center gap-1.5">
                                <Mail
                                  size={14}
                                />
                                {
                                  request.email
                                }
                              </span>
                            )}

                          </div>

                        </div>

                      </div>

                      {/* ACTIONS */}

                      <div className="flex flex-wrap gap-2">

                        <button
                          type="button"
                          onClick={() =>
                            setSelectedRequest(
                              request
                            )
                          }
                          className="flex items-center gap-2 border border-[#8B2E2E] px-4 py-2.5 text-sm font-semibold text-[#8B2E2E] transition hover:bg-[#8B2E2E] hover:text-white"
                        >
                          <Eye size={16} />
                          View Details
                        </button>

                        <a
                          href={getWhatsAppURL(
                            request
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() =>
                            updateStatus(
                              request.id,
                              "contacted"
                            )
                          }
                          className="flex items-center gap-2 bg-[#6B1E1E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#8B2E2E]"
                        >
                          <MessageCircle
                            size={16}
                          />
                          WhatsApp
                        </a>

                      </div>

                    </div>

                    {/* QUICK INFO */}

                    <div className="mt-5 grid gap-4 border-t border-[#6B1E1E]/10 pt-5 sm:grid-cols-3">

                      <div>

                        <p className="text-xs uppercase tracking-wider text-gray-400">
                          Dimensions
                        </p>

                        <p className="mt-1 text-sm font-medium text-[#2B1714]">
                          {request.dimensions ||
                            "Not specified"}
                        </p>

                      </div>

                      <div>

                        <p className="text-xs uppercase tracking-wider text-gray-400">
                          Material
                        </p>

                        <p className="mt-1 text-sm font-medium text-[#2B1714]">
                          {request.material ||
                            "Not specified"}
                        </p>

                      </div>

                      <div>

                        <p className="text-xs uppercase tracking-wider text-gray-400">
                          Budget
                        </p>

                        <p className="mt-1 text-sm font-medium text-[#2B1714]">
                          {request.budget ||
                            "Not specified"}
                        </p>

                      </div>

                    </div>

                    {/* DATE */}

                    <p className="mt-4 flex items-center gap-2 text-xs text-gray-400">

                      <Calendar size={13} />

                      {formatDate(
                        request.createdAt
                      )}

                    </p>

                  </div>
                )
              )}

            </div>
          )}

      </main>

      {/* ==================================================
          DETAILS MODAL
      ================================================== */}

      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">

          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto bg-white shadow-xl">

            {/* MODAL HEADER */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#6B1E1E]/10 bg-[#F8F1E7] px-6 py-5">

              <div>

                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#B8863B]">
                  Customer Request
                </p>

                <h2 className="mt-1 text-2xl font-bold text-[#6B1E1E]">
                  {selectedRequest.name ||
                    "Customer"}
                </h2>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedRequest(
                    null
                  )
                }
                className="flex h-9 w-9 items-center justify-center rounded-full text-[#6B1E1E] transition hover:bg-[#6B1E1E]/10"
              >
                <X size={20} />
              </button>

            </div>

            {/* MODAL CONTENT */}

            <div className="space-y-7 p-6">

              {/* CUSTOMER DETAILS */}

              <div className="grid gap-4 sm:grid-cols-2">

                <div className="border border-gray-200 p-4">

                  <p className="text-xs uppercase tracking-wider text-gray-400">
                    Customer
                  </p>

                  <p className="mt-2 font-semibold text-[#6B1E1E]">
                    {selectedRequest.name ||
                      "Not provided"}
                  </p>

                </div>

                <div className="border border-gray-200 p-4">

                  <p className="text-xs uppercase tracking-wider text-gray-400">
                    Phone
                  </p>

                  <p className="mt-2 font-semibold text-[#6B1E1E]">
                    {selectedRequest.phone ||
                      "Not provided"}
                  </p>

                </div>

                <div className="border border-gray-200 p-4">

                  <p className="text-xs uppercase tracking-wider text-gray-400">
                    Email
                  </p>

                  <p className="mt-2 break-all font-semibold text-[#6B1E1E]">
                    {selectedRequest.email ||
                      "Not provided"}
                  </p>

                </div>

                <div className="border border-gray-200 p-4">

                  <p className="text-xs uppercase tracking-wider text-gray-400">
                    Furniture
                  </p>

                  <p className="mt-2 font-semibold text-[#6B1E1E]">
                    {selectedRequest.furnitureType ||
                      "Custom Furniture"}
                  </p>

                </div>

              </div>

              {/* REQUIREMENTS */}

              <div>

                <h3 className="font-bold text-[#6B1E1E]">
                  Requirements
                </h3>

                <div className="mt-3 space-y-3">

                  <div className="flex flex-col justify-between gap-1 border-b pb-3 sm:flex-row">

                    <span className="text-gray-500">
                      Dimensions
                    </span>

                    <span className="font-medium text-[#2B1714] sm:text-right">
                      {selectedRequest.dimensions ||
                        "Not specified"}
                    </span>

                  </div>

                  <div className="flex flex-col justify-between gap-1 border-b pb-3 sm:flex-row">

                    <span className="text-gray-500">
                      Material
                    </span>

                    <span className="font-medium text-[#2B1714] sm:text-right">
                      {selectedRequest.material ||
                        "Not specified"}
                    </span>

                  </div>

                  <div className="flex flex-col justify-between gap-1 border-b pb-3 sm:flex-row">

                    <span className="text-gray-500">
                      Budget
                    </span>

                    <span className="font-medium text-[#2B1714] sm:text-right">
                      {selectedRequest.budget ||
                        "Not specified"}
                    </span>

                  </div>

                </div>

              </div>

              {/* DESCRIPTION */}

              <div>

                <h3 className="font-bold text-[#6B1E1E]">
                  Description
                </h3>

                <div className="mt-3 bg-[#F8F1E7] p-5 leading-7 text-gray-700">
                  {selectedRequest.description ||
                    "No description provided."}
                </div>

              </div>

              {/* REFERENCE IMAGE */}

              {selectedRequest.imageUrl && (
                <div>

                  <h3 className="font-bold text-[#6B1E1E]">
                    Reference Image
                  </h3>

                  <a
                    href={
                      selectedRequest.imageUrl
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 block"
                  >

                    <img
                      src={
                        selectedRequest.imageUrl
                      }
                      alt="Customer reference"
                      className="max-h-80 w-full bg-gray-100 object-contain"
                    />

                    <span className="mt-2 flex items-center gap-2 text-sm font-medium text-[#8B2E2E]">
                      Open image
                      <ExternalLink
                        size={15}
                      />
                    </span>

                  </a>

                </div>
              )}

              {/* STATUS */}

              <div>

                <h3 className="font-bold text-[#6B1E1E]">
                  Update Status
                </h3>

                <div className="mt-3 flex flex-wrap gap-2">

                  <button
                    type="button"
                    onClick={() =>
                      updateStatus(
                        selectedRequest.id,
                        "new"
                      )
                    }
                    className="flex items-center gap-2 bg-[#F8E8C8] px-4 py-2 text-sm font-semibold text-[#7A571E] transition hover:opacity-80"
                  >
                    <Clock size={15} />
                    New
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      updateStatus(
                        selectedRequest.id,
                        "contacted"
                      )
                    }
                    className="flex items-center gap-2 bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:opacity-80"
                  >
                    <Phone size={15} />
                    Contacted
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      updateStatus(
                        selectedRequest.id,
                        "completed"
                      )
                    }
                    className="flex items-center gap-2 bg-green-100 px-4 py-2 text-sm font-semibold text-green-700 transition hover:opacity-80"
                  >
                    <CheckCircle
                      size={15}
                    />
                    Completed
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      updateStatus(
                        selectedRequest.id,
                        "cancelled"
                      )
                    }
                    className="flex items-center gap-2 bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 transition hover:opacity-80"
                  >
                    <XCircle size={15} />
                    Cancelled
                  </button>

                </div>

              </div>

              {/* ACTIONS */}

              <div className="flex flex-col gap-3 border-t border-gray-100 pt-6 sm:flex-row">

                <a
                  href={getWhatsAppURL(
                    selectedRequest
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    updateStatus(
                      selectedRequest.id,
                      "contacted"
                    )
                  }
                  className="flex flex-1 items-center justify-center gap-2 bg-[#6B1E1E] px-6 py-4 font-semibold text-white transition hover:bg-[#8B2E2E]"
                >
                  <MessageCircle
                    size={19}
                  />
                  Contact on WhatsApp
                </a>

                <button
                  type="button"
                  onClick={() =>
                    deleteRequest(
                      selectedRequest.id
                    )
                  }
                  className="flex items-center justify-center gap-2 border border-red-300 px-5 py-4 font-semibold text-red-600 transition hover:bg-red-50"
                >
                  <Trash2 size={18} />
                  Delete
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default AdminRequests;