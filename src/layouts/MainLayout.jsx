import {
  useEffect,
  useState,
} from "react";

import {
  Outlet,
} from "react-router-dom";

import {
  MessageCircle,
} from "lucide-react";

import {
  doc,
  onSnapshot,
} from "firebase/firestore";

import Navbar from "../components/Navbar";
import SiteNavigation from "../components/SiteNavigation";
import Footer from "../components/Footer";
import OfferBanner from "../components/OfferBanner";

import {
  db,
} from "../firebase/firebase";

function MainLayout() {

  const [
    whatsappNumber,
    setWhatsappNumber,
  ] = useState(
    "919596492640"
  );

  const [
    menuOpen,
    setMenuOpen,
  ] = useState(false);

  // ======================================================
  // WHATSAPP
  // ======================================================

  useEffect(() => {

    const settingsRef =
      doc(
        db,
        "settings",
        "website"
      );

    const unsubscribe =
      onSnapshot(
        settingsRef,
        (snapshot) => {

          if (
            !snapshot.exists()
          ) {
            return;
          }

          const data =
            snapshot.data();

          if (
            data.whatsapp
          ) {

            const cleanNumber =
              String(
                data.whatsapp
              ).replace(
                /\D/g,
                ""
              );

            if (
              cleanNumber
            ) {
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

    return () =>
      unsubscribe();

  }, []);

  const whatsappUrl =
    `https://wa.me/${whatsappNumber}`;

  return (
    <div className="min-h-screen bg-[#FFFCF8]">

      {/* ==================================================
          SIDEBAR
      ================================================== */}

      <SiteNavigation
        open={menuOpen}
        onClose={() =>
          setMenuOpen(false)
        }
      />

      {/* ==================================================
          HEADER
      ================================================== */}

      <Navbar
        onMenuClick={() =>
          setMenuOpen(true)
        }
      />

      {/* ==================================================
          CONTENT
      ================================================== */}

      <div className="pt-[78px]">

        <OfferBanner />

        <main className="min-h-[60vh]">
          <Outlet />
        </main>

      </div>

      <Footer />

      {/* ==================================================
          WHATSAPP
      ================================================== */}

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        title="Chat with us on WhatsApp"
        className="fixed bottom-5 right-5 z-[90] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:-translate-y-1 hover:scale-105 sm:bottom-6 sm:right-6 sm:h-16 sm:w-16"
      >

        <MessageCircle
          size={29}
          strokeWidth={2.2}
        />

        <span className="sr-only">
          Chat with us on WhatsApp
        </span>

      </a>

    </div>
  );
}

export default MainLayout;