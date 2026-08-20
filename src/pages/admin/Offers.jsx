import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

import {
  Tag,
  Plus,
  Trash2,
  Check,
  X,
  Percent,
  CalendarDays,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { db } from "../../firebase/firebase";

function Offers() {
  const [offers, setOffers] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [showForm, setShowForm] =
    useState(false);

  const [form, setForm] = useState({
    title: "",
    discountPercent: "",
    startDate: "",
    endDate: "",
    active: true,
  });

  // ======================================================
  // LOAD OFFERS
  // ======================================================

  const loadOffers = async () => {
    try {
      setLoading(true);

      const offersQuery = query(
        collection(db, "offers"),
        orderBy("createdAt", "desc")
      );

      const snapshot =
        await getDocs(offersQuery);

      const data =
        snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

      setOffers(data);
    } catch (err) {
      console.error(
        "Load offers error:",
        err
      );

      setError(
        "Unable to load offers."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOffers();
  }, []);

  // ======================================================
  // FORM CHANGE
  // ======================================================

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // ======================================================
  // CREATE OFFER
  // ======================================================

  const createOffer = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    const discount =
      Number(
        form.discountPercent
      );

    if (!form.title.trim()) {
      setError(
        "Please enter an offer name."
      );
      return;
    }

    if (
      !discount ||
      discount <= 0 ||
      discount > 100
    ) {
      setError(
        "Discount must be between 1% and 100%."
      );
      return;
    }

    if (!form.startDate) {
      setError(
        "Please select a start date."
      );
      return;
    }

    if (!form.endDate) {
      setError(
        "Please select an end date."
      );
      return;
    }

    if (
      form.endDate <
      form.startDate
    ) {
      setError(
        "End date cannot be before the start date."
      );
      return;
    }

    try {
      setSaving(true);

      await addDoc(
        collection(db, "offers"),
        {
          title:
            form.title.trim(),

          discountPercent:
            discount,

          startDate:
            form.startDate,

          endDate:
            form.endDate,

          active:
            form.active,

          createdAt:
            serverTimestamp(),
        }
      );

      setForm({
        title: "",
        discountPercent: "",
        startDate: "",
        endDate: "",
        active: true,
      });

      setShowForm(false);

      setMessage(
        "Offer created successfully."
      );

      await loadOffers();
    } catch (err) {
      console.error(
        "Create offer error:",
        err
      );

      setError(
        "Unable to create offer."
      );
    } finally {
      setSaving(false);
    }
  };

  // ======================================================
  // TOGGLE OFFER
  // ======================================================

  const toggleOffer = async (
    offer
  ) => {
    try {
      setError("");

      await updateDoc(
        doc(
          db,
          "offers",
          offer.id
        ),
        {
          active:
            !offer.active,
        }
      );

      await loadOffers();
    } catch (err) {
      console.error(
        "Toggle offer error:",
        err
      );

      setError(
        "Unable to update offer."
      );
    }
  };

  // ======================================================
  // DELETE OFFER
  // ======================================================

  const deleteOffer = async (
    offerId
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this offer?"
      );

    if (!confirmed) {
      return;
    }

    try {
      await deleteDoc(
        doc(
          db,
          "offers",
          offerId
        )
      );

      setMessage(
        "Offer deleted successfully."
      );

      await loadOffers();
    } catch (err) {
      console.error(
        "Delete offer error:",
        err
      );

      setError(
        "Unable to delete offer."
      );
    }
  };

  // ======================================================
  // CHECK ACTIVE STATUS
  // ======================================================

  const isCurrentlyActive = (
    offer
  ) => {
    if (!offer.active) {
      return false;
    }

    const today =
      new Date()
        .toISOString()
        .split("T")[0];

    return (
      today >= offer.startDate &&
      today <= offer.endDate
    );
  };

  // ======================================================
  // CLEAR MESSAGE
  // ======================================================

  const clearMessages = () => {
    setMessage("");
    setError("");
  };

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <div>

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

        <div>

          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#B8863B]">
            Promotions
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[#6B1E1E]">
            Offers
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            Create and manage discounts
            that appear automatically on
            your customer website.
          </p>

        </div>

        <button
          type="button"
          onClick={() =>
            setShowForm(
              !showForm
            )
          }
          className="flex items-center justify-center gap-2 bg-[#6B1E1E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#8B2E2E]"
        >
          {showForm ? (
            <>
              <X size={18} />
              Close
            </>
          ) : (
            <>
              <Plus size={18} />
              Create Offer
            </>
          )}
        </button>

      </div>

      {/* ==================================================
          MESSAGES
      ================================================== */}

      {message && (
        <div className="mb-6 flex items-center gap-3 border border-green-200 bg-green-50 p-4 text-sm text-green-700">

          <Check size={19} />

          <span className="flex-1">
            {message}
          </span>

          <button
            type="button"
            onClick={clearMessages}
          >
            ×
          </button>

        </div>
      )}

      {error && (
        <div className="mb-6 flex items-center gap-3 border border-red-200 bg-red-50 p-4 text-sm text-red-700">

          <AlertCircle size={19} />

          <span className="flex-1">
            {error}
          </span>

          <button
            type="button"
            onClick={clearMessages}
          >
            ×
          </button>

        </div>
      )}

      {/* ==================================================
          CREATE FORM
      ================================================== */}

      {showForm && (
        <form
          onSubmit={createOffer}
          className="mb-8 bg-white p-6 shadow-sm md:p-8"
        >

          <div className="mb-6">

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B8863B]">
              New Promotion
            </p>

            <h2 className="mt-1 text-xl font-bold text-[#6B1E1E]">
              Create Offer
            </h2>

          </div>

          <div className="grid gap-5 md:grid-cols-2">

            {/* TITLE */}

            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Offer Name
              </label>

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Diwali Furniture Sale"
                className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#8B2E2E] focus:ring-1 focus:ring-[#8B2E2E]"
              />

            </div>

            {/* DISCOUNT */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Discount Percentage
              </label>

              <div className="relative">

                <input
                  type="number"
                  name="discountPercent"
                  value={
                    form.discountPercent
                  }
                  onChange={handleChange}
                  min="1"
                  max="100"
                  placeholder="10"
                  className="w-full border border-gray-200 px-4 py-3 pr-12 text-sm outline-none focus:border-[#8B2E2E] focus:ring-1 focus:ring-[#8B2E2E]"
                />

                <Percent
                  size={17}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

              </div>

            </div>

            {/* START DATE */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Start Date
              </label>

              <div className="relative">

                <input
                  type="date"
                  name="startDate"
                  value={
                    form.startDate
                  }
                  onChange={handleChange}
                  className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#8B2E2E] focus:ring-1 focus:ring-[#8B2E2E]"
                />

              </div>

            </div>

            {/* END DATE */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                End Date
              </label>

              <input
                type="date"
                name="endDate"
                value={
                  form.endDate
                }
                onChange={handleChange}
                className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#8B2E2E] focus:ring-1 focus:ring-[#8B2E2E]"
              />

            </div>

          </div>

          {/* ACTIVE */}

          <label className="mt-6 flex cursor-pointer items-center gap-3">

            <input
              type="checkbox"
              name="active"
              checked={
                form.active
              }
              onChange={handleChange}
              className="h-4 w-4 accent-[#6B1E1E]"
            />

            <span className="text-sm font-medium text-gray-700">
              Activate this offer immediately
            </span>

          </label>

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={saving}
            className="mt-7 flex items-center gap-2 bg-[#6B1E1E] px-6 py-3 font-semibold text-white transition hover:bg-[#8B2E2E] disabled:cursor-not-allowed disabled:opacity-60"
          >

            {saving ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />
                Creating...
              </>
            ) : (
              <>
                <Tag size={18} />
                Create Offer
              </>
            )}

          </button>

        </form>
      )}

      {/* ==================================================
          OFFER LIST
      ================================================== */}

      {loading ? (

        <div className="flex min-h-[300px] items-center justify-center bg-white">

          <div className="flex items-center gap-3 text-[#8B2E2E]">

            <Loader2
              size={24}
              className="animate-spin"
            />

            Loading offers...

          </div>

        </div>

      ) : offers.length === 0 ? (

        <div className="bg-white px-6 py-16 text-center shadow-sm">

          <Tag
            size={45}
            className="mx-auto text-gray-300"
          />

          <h2 className="mt-5 text-xl font-bold text-[#6B1E1E]">
            No offers created
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
            Create your first offer and
            it will automatically appear
            on the customer website when
            active.
          </p>

        </div>

      ) : (

        <div className="grid gap-5 lg:grid-cols-2">

          {offers.map((offer) => {

            const current =
              isCurrentlyActive(
                offer
              );

            return (
              <div
                key={offer.id}
                className="bg-white p-6 shadow-sm"
              >

                <div className="flex items-start justify-between gap-4">

                  <div className="flex items-center gap-4">

                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F5E4E4] text-[#8B2E2E]">

                      <Tag size={22} />

                    </div>

                    <div>

                      <h3 className="font-bold text-[#6B1E1E]">
                        {offer.title}
                      </h3>

                      <p className="mt-1 text-2xl font-bold text-[#8B2E2E]">
                        {offer.discountPercent}%
                        OFF
                      </p>

                    </div>

                  </div>

                  <span
                    className={`px-3 py-1 text-xs font-semibold ${
                      current
                        ? "bg-green-100 text-green-700"
                        : offer.active
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {current
                      ? "Active"
                      : offer.active
                      ? "Scheduled / Expired"
                      : "Inactive"}
                  </span>

                </div>

                <div className="mt-6 grid gap-3 border-t border-gray-100 pt-5 sm:grid-cols-2">

                  <div className="flex items-center gap-2 text-sm text-gray-500">

                    <CalendarDays
                      size={17}
                    />

                    <span>
                      {offer.startDate}
                    </span>

                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500">

                    <CalendarDays
                      size={17}
                    />

                    <span>
                      {offer.endDate}
                    </span>

                  </div>

                </div>

                <div className="mt-6 flex gap-2">

                  <button
                    type="button"
                    onClick={() =>
                      toggleOffer(
                        offer
                      )
                    }
                    className={`flex flex-1 items-center justify-center gap-2 border px-4 py-2.5 text-sm font-semibold transition ${
                      offer.active
                        ? "border-yellow-200 text-yellow-700 hover:bg-yellow-50"
                        : "border-green-200 text-green-700 hover:bg-green-50"
                    }`}
                  >

                    {offer.active ? (
                      <>
                        <X size={17} />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <Check size={17} />
                        Activate
                      </>
                    )}

                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      deleteOffer(
                        offer.id
                      )
                    }
                    className="flex items-center justify-center gap-2 border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                  >

                    <Trash2
                      size={17}
                    />

                    Delete

                  </button>

                </div>

              </div>
            );
          })}

        </div>

      )}

    </div>
  );
}

export default Offers;