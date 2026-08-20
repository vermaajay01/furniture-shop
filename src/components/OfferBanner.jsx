import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import {
  Flame,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import { db } from "../firebase/firebase";

function OfferBanner() {
  const [offer, setOffer] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const loadOffer = async () => {
      try {
        const snapshot =
          await getDocs(
            collection(db, "offers")
          );

        const today =
          new Date()
            .toISOString()
            .split("T")[0];

        const activeOffer =
          snapshot.docs
            .map((item) => ({
              id: item.id,
              ...item.data(),
            }))
            .find((item) => {
              return (
                item.active === true &&
                Number(
                  item.discountPercent
                ) > 0 &&
                today >= item.startDate &&
                today <= item.endDate
              );
            });

        setOffer(
          activeOffer || null
        );
      } catch (error) {
        console.error(
          "Offer banner error:",
          error
        );

        setOffer(null);
      } finally {
        setLoading(false);
      }
    };

    loadOffer();
  }, []);

  if (loading || !offer) {
    return null;
  }

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

  return (
    <section className="relative overflow-hidden bg-[#3A0D0D] px-6 py-8">

      {/* ==================================================
          GLOWING BACKGROUND
      ================================================== */}

      <div className="pointer-events-none absolute inset-0">

        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#B8863B]/20 blur-3xl animate-pulse" />

        <div className="absolute left-0 top-0 h-32 w-32 rounded-full bg-[#8B2E2E]/40 blur-3xl" />

        <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-[#B8863B]/30 blur-3xl" />

      </div>

      {/* ==================================================
          CONTENT
      ================================================== */}

      <div className="relative mx-auto max-w-7xl">

        <div className="relative overflow-hidden rounded-2xl border border-[#D6A756]/60 px-6 py-8 shadow-[0_0_35px_rgba(184,134,59,0.28)] md:px-12">

          {/* ANIMATED GLOW BORDER */}

          <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-[#E0B66B]/30 animate-pulse" />

          <div className="relative flex flex-col items-center justify-between gap-7 text-center md:flex-row md:text-left">

            {/* LEFT */}

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#B8863B]/15 text-[#E0B66B] shadow-[0_0_20px_rgba(224,182,107,0.35)]">

                <Flame
                  size={28}
                  className="animate-pulse"
                />

              </div>

              <div>

                <div className="flex items-center justify-center gap-2 md:justify-start">

                  <Sparkles
                    size={15}
                    className="text-[#E0B66B]"
                  />

                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#E0B66B]">
                    Limited Time Offer
                  </p>

                  <Sparkles
                    size={15}
                    className="text-[#E0B66B]"
                  />

                </div>

                <h2 className="mt-2 text-2xl font-bold text-white md:text-3xl">
                  {offer.title}
                </h2>

                <p className="mt-1 text-sm text-white/60">
                  Offer ends on{" "}
                  {formattedEndDate}
                </p>

              </div>

            </div>

            {/* DISCOUNT */}

            <div className="flex items-center gap-6">

              <div>

                <p className="text-xs uppercase tracking-widest text-white/50">
                  Get
                </p>

                <p className="text-4xl font-black text-[#E0B66B] drop-shadow-[0_0_12px_rgba(224,182,107,0.45)]">
                  {offer.discountPercent}%
                  <span className="ml-1 text-2xl">
                    OFF
                  </span>
                </p>

              </div>

              {/* SHOP BUTTON */}

              <Link
                to="/shop"
                className="group flex items-center gap-2 rounded-full bg-[#E0B66B] px-6 py-3 text-sm font-bold text-[#3A0D0D] shadow-[0_0_20px_rgba(224,182,107,0.25)] transition duration-300 hover:scale-105 hover:bg-white hover:shadow-[0_0_28px_rgba(255,255,255,0.3)]"
              >

                Shop Now

                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />

              </Link>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default OfferBanner;