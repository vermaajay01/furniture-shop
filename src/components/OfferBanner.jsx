import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import {
  Flame,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

import { db } from "../firebase/firebase";

function OfferBanner() {
  const [offers, setOffers] = useState([]);

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  // ======================================================
  // LOAD ACTIVE OFFERS
  // ======================================================

  useEffect(() => {
    const loadOffers = async () => {
      try {
        setLoading(true);

        const snapshot =
          await getDocs(
            collection(db, "offers")
          );

        const today =
          new Date()
            .toISOString()
            .split("T")[0];

        const activeOffers =
          snapshot.docs
            .map((item) => ({
              id: item.id,
              ...item.data(),
            }))
            .filter((offer) => {
              return (
                offer.active === true &&
                Number(
                  offer.discountPercent
                ) > 0 &&
                offer.startDate &&
                offer.endDate &&
                today >= offer.startDate &&
                today <= offer.endDate
              );
            });

        setOffers(activeOffers);
        setCurrentIndex(0);
      } catch (error) {
        console.error(
          "Offer banner error:",
          error
        );

        setOffers([]);
      } finally {
        setLoading(false);
      }
    };

    loadOffers();
  }, []);

  // ======================================================
  // AUTO SLIDE
  // ======================================================

  useEffect(() => {
    if (offers.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex(
        (previous) =>
          (previous + 1) % offers.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [offers.length]);

  // ======================================================
  // NAVIGATION
  // ======================================================

  const previousOffer = () => {
    setCurrentIndex(
      (previous) =>
        previous === 0
          ? offers.length - 1
          : previous - 1
    );
  };

  const nextOffer = () => {
    setCurrentIndex(
      (previous) =>
        (previous + 1) % offers.length
    );
  };

  // ======================================================
  // NOTHING TO SHOW
  // ======================================================

  if (
    loading ||
    offers.length === 0
  ) {
    return null;
  }

  const offer =
    offers[currentIndex];

  // ======================================================
  // FORMAT END DATE
  // ======================================================

  const formattedEndDate =
    new Date(
      `${offer.endDate}T00:00:00`
    ).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <section className="relative z-20 w-full overflow-hidden bg-[#3A0D0D]">

      {/* ==================================================
          BACKGROUND GLOW
      ================================================== */}

      <div className="pointer-events-none absolute inset-0">

        <div className="absolute left-1/2 top-1/2 h-40 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#B8863B]/20 blur-3xl animate-pulse" />

        <div className="absolute -left-10 top-0 h-28 w-28 rounded-full bg-[#8B2E2E]/40 blur-3xl" />

        <div className="absolute -bottom-10 right-0 h-36 w-36 rounded-full bg-[#B8863B]/30 blur-3xl" />

      </div>

      {/* ==================================================
          BANNER
      ================================================== */}

      <div className="relative mx-auto w-full max-w-7xl px-4 py-2 sm:px-6">

        <div className="relative overflow-hidden rounded-xl border border-[#D6A756]/60 shadow-[0_0_25px_rgba(184,134,59,0.25)]">

          {/* ANIMATED GLOW */}

          <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-[#E0B66B]/30 animate-pulse" />

          {/* ==================================================
              MAIN BANNER CONTENT
          ================================================== */}

          <div className="relative flex min-h-[82px] items-center justify-center px-10 py-3 sm:px-14">

            {/* ==================================================
                LEFT ARROW
            ================================================== */}

            {offers.length > 1 && (
              <button
                type="button"
                onClick={previousOffer}
                aria-label="Previous offer"
                className="absolute left-2 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20 sm:left-4"
              >
                <ArrowLeft size={16} />
              </button>
            )}

            {/* ==================================================
                OFFER CONTENT
            ================================================== */}

            <div
              key={offer.id}
              className="flex w-full flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left"
            >

              {/* TITLE */}

              <div className="flex items-center gap-3">

                <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#B8863B]/15 text-[#E0B66B] sm:flex">

                  <Flame
                    size={21}
                    className="animate-pulse"
                  />

                </div>

                <div>

                  <div className="flex items-center justify-center gap-1.5 sm:justify-start">

                    <Sparkles
                      size={12}
                      className="text-[#E0B66B]"
                    />

                    <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#E0B66B] sm:text-[10px]">
                      Limited Time Offer
                    </p>

                    <Sparkles
                      size={12}
                      className="text-[#E0B66B]"
                    />

                  </div>

                  <h2 className="mt-0.5 text-lg font-bold text-white sm:text-xl">
                    {offer.title}
                  </h2>

                  <p className="text-[11px] text-white/50">
                    Offer ends{" "}
                    {formattedEndDate}
                  </p>

                </div>

              </div>

              {/* ==================================================
                  DISCOUNT + BUTTON
              ================================================== */}

              <div className="flex items-center gap-3 sm:gap-5">

                <div className="text-center">

                  <p className="text-[9px] uppercase tracking-widest text-white/40">
                    Get
                  </p>

                  <p className="text-2xl font-black leading-none text-[#E0B66B] drop-shadow-[0_0_10px_rgba(224,182,107,0.45)] sm:text-3xl">

                    {offer.discountPercent}%

                    <span className="ml-1 text-base">
                      OFF
                    </span>

                  </p>

                </div>

                <Link
                  to="/shop"
                  className="group flex items-center gap-1.5 rounded-full bg-[#E0B66B] px-4 py-2 text-xs font-bold text-[#3A0D0D] shadow-[0_0_15px_rgba(224,182,107,0.25)] transition duration-300 hover:scale-105 hover:bg-white hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] sm:px-5 sm:py-2.5 sm:text-sm"
                >
                  Shop Now

                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>

              </div>

            </div>

            {/* ==================================================
                RIGHT ARROW
            ================================================== */}

            {offers.length > 1 && (
              <button
                type="button"
                onClick={nextOffer}
                aria-label="Next offer"
                className="absolute right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20 sm:right-4"
              >
                <ArrowRight size={16} />
              </button>
            )}

          </div>

        </div>

        {/* ==================================================
            DOT NAVIGATION
        ================================================== */}

        {offers.length > 1 && (
          <div className="flex items-center justify-center gap-1.5 pt-1">

            {offers.map(
              (item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    setCurrentIndex(index)
                  }
                  aria-label={`Show offer ${
                    index + 1
                  }`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "w-5 bg-[#E0B66B]"
                      : "w-1.5 bg-white/30 hover:bg-white/60"
                  }`}
                />
              )
            )}

          </div>
        )}

      </div>

    </section>
  );
}

export default OfferBanner;