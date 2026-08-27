import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import {
  MessageCircle,
} from "lucide-react";

import {
  doc,
  onSnapshot,
} from "firebase/firestore";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import OfferBanner from "../components/OfferBanner";

import { db } from "../firebase/firebase";

function MainLayout() {
  const [whatsappNumber, setWhatsappNumber] =
    useState("919596492640");

  // ======================================================
  // LOAD WHATSAPP NUMBER
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

          if (data.whatsapp) {
            const cleanNumber =
              String(
                data.whatsapp
              ).replace(
                /\D/g,
                ""
              );

            if (cleanNumber) {
              setWhatsappNumber(
                cleanNumber
              );
            }
          }
        },
        (error) => {
          console.error(
            "WhatsApp settings error:",
            error
          );
        }
      );

    return () => unsubscribe();
  }, []);

  const whatsappUrl =
    `https://wa.me/${whatsappNumber}`;

  return (
    <div className="flex min-h-screen flex-col">

      {/* ==================================================
          FIXED NAVBAR
      ================================================== */}

      <Navbar />

      {/* ==================================================
          CONTENT AREA
          Navbar height = 82px
      ================================================== */}

      <div className="pt-[82px]">

        {/* OFFER BANNER */}

        <OfferBanner />

        {/* PAGE CONTENT */}

        <main className="flex-1">
          <Outlet />
        </main>

      </div>

      <Footer />

      {/* ==================================================
          FLOATING WHATSAPP BUTTON
          Visible on all customer pages
      ================================================== */}

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        title="Chat with us on WhatsApp"
        className="fixed bottom-5 right-5 z-[90] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_25px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-[0_12px_30px_rgba(0,0,0,0.28)] sm:bottom-6 sm:right-6 sm:h-16 sm:w-16"
      >

        <MessageCircle
          size={29}
          strokeWidth={2.2}
          className="sm:h-8 sm:w-8"
        />

        <span className="sr-only">
          Chat with us on WhatsApp
        </span>

      </a>

    </div>
  );
}

export default MainLayout;