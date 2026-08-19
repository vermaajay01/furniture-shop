import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Clock,
  ExternalLink,
} from "lucide-react";

import {
  FaInstagram,
  FaFacebookF,
  FaWhatsapp,
} from "react-icons/fa";

import {
  doc,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

function Footer() {
  const [settings, setSettings] = useState({
    shopName: "हरि ॐ Furniture House",

    address:
      "Your Furniture Shop Address, Your City, India",

    phone: "+91 XXXXX XXXXX",

    whatsapp: "919596492640",

    email:
      "info@hariomfurniture.com",

    mapsUrl: "",

    openingHours:
      "Mon - Sun: 10:00 AM - 8:00 PM",

    instagram: "",

    facebook: "",

    footerDescription:
      "Beautifully crafted furniture designed to bring comfort, elegance and lasting quality to your home.",
  });

  // ======================================================
  // LOAD WEBSITE SETTINGS
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
          if (snapshot.exists()) {
            setSettings(
              (previous) => ({
                ...previous,
                ...snapshot.data(),
              })
            );
          }
        },
        (error) => {
          console.error(
            "Footer settings error:",
            error
          );
        }
      );

    return () => unsubscribe();
  }, []);

  // ======================================================
  // WHATSAPP URL
  // ======================================================

  const whatsappNumber =
    settings.whatsapp?.replace(
      /\D/g,
      ""
    );

  const whatsappUrl =
    whatsappNumber
      ? `https://wa.me/${whatsappNumber}`
      : "#";

  // ======================================================
  // PHONE URL
  // ======================================================

  const phoneNumber =
    settings.phone?.replace(
      /[^\d+]/g,
      ""
    );

  // ======================================================
  // FOOTER
  // ======================================================

  return (
    <footer className="bg-[#2B1714] text-white">

      {/* ==================================================
          MAIN FOOTER
      ================================================== */}

      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-2 lg:grid-cols-4">

        {/* ==================================================
            BRAND
        ================================================== */}

        <div>

          <Link to="/">

            <h2 className="text-3xl font-bold">
              हरि{" "}
              <span className="text-[#E0B66B]">
                ॐ
              </span>
            </h2>

            <p className="mt-1 text-xs tracking-[0.35em] text-white/60">
              FURNITURE HOUSE
            </p>

          </Link>

          <p className="mt-6 max-w-xs leading-7 text-white/60">
            {settings.footerDescription}
          </p>

          {/* ==================================================
              SOCIAL LINKS
          ================================================== */}

          {(settings.instagram ||
            settings.facebook ||
            settings.whatsapp) && (
            <div className="mt-6 flex flex-wrap items-center gap-3">

              {/* INSTAGRAM */}

              {settings.instagram && (
                <a
                  href={
                    settings.instagram
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/60 transition hover:border-[#E0B66B] hover:bg-[#E0B66B]/10 hover:text-[#E0B66B]"
                >
                  <FaInstagram
                    size={18}
                  />
                </a>
              )}

              {/* FACEBOOK */}

              {settings.facebook && (
                <a
                  href={
                    settings.facebook
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/60 transition hover:border-[#E0B66B] hover:bg-[#E0B66B]/10 hover:text-[#E0B66B]"
                >
                  <FaFacebookF
                    size={17}
                  />
                </a>
              )}

              {/* WHATSAPP */}

              {settings.whatsapp && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/60 transition hover:border-[#E0B66B] hover:bg-[#E0B66B]/10 hover:text-[#E0B66B]"
                >
                  <FaWhatsapp
                    size={19}
                  />
                </a>
              )}

            </div>
          )}

        </div>

        {/* ==================================================
            QUICK LINKS
        ================================================== */}

        <div>

          <h3 className="text-lg font-semibold text-[#E0B66B]">
            Quick Links
          </h3>

          <div className="mt-5 flex flex-col gap-3 text-white/60">

            <Link
              to="/"
              className="transition hover:text-white"
            >
              Home
            </Link>

            <Link
              to="/shop"
              className="transition hover:text-white"
            >
              Shop
            </Link>

            <a
              href="/#categories"
              className="transition hover:text-white"
            >
              Categories
            </a>

            <Link
              to="/custom-furniture"
              className="transition hover:text-white"
            >
              Custom Furniture
            </Link>

            <a
              href="/#about"
              className="transition hover:text-white"
            >
              About Us
            </a>

            <a
              href="/#contact"
              className="transition hover:text-white"
            >
              Contact
            </a>

          </div>

        </div>

        {/* ==================================================
            FURNITURE
        ================================================== */}

        <div>

          <h3 className="text-lg font-semibold text-[#E0B66B]">
            Furniture
          </h3>

          <div className="mt-5 flex flex-col gap-3 text-white/60">

            <Link
              to="/shop"
              className="transition hover:text-white"
            >
              Sofas
            </Link>

            <Link
              to="/shop"
              className="transition hover:text-white"
            >
              Beds
            </Link>

            <Link
              to="/shop"
              className="transition hover:text-white"
            >
              Dining Tables
            </Link>

            <Link
              to="/shop"
              className="transition hover:text-white"
            >
              Chairs
            </Link>

            <Link
              to="/shop"
              className="transition hover:text-white"
            >
              Wardrobes
            </Link>

            <Link
              to="/custom-furniture"
              className="transition hover:text-white"
            >
              Custom Furniture
            </Link>

          </div>

        </div>

        {/* ==================================================
            CONTACT
        ================================================== */}

        <div>

          <h3 className="text-lg font-semibold text-[#E0B66B]">
            Contact Us
          </h3>

          <div className="mt-5 space-y-5 text-white/60">

            {/* ADDRESS */}

            {settings.address && (
              <div className="flex gap-3">

                <MapPin
                  size={20}
                  className="mt-1 shrink-0 text-[#E0B66B]"
                />

                <div>

                  {settings.mapsUrl ? (
                    <a
                      href={
                        settings.mapsUrl
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition hover:text-white"
                    >

                      <p className="leading-6">
                        {settings.address}
                      </p>

                      <span className="mt-1 inline-flex items-center gap-1 text-xs text-[#E0B66B]">
                        Open in Google Maps

                        <ExternalLink
                          size={12}
                        />
                      </span>

                    </a>
                  ) : (
                    <p className="leading-6">
                      {settings.address}
                    </p>
                  )}

                </div>

              </div>
            )}

            {/* PHONE */}

            {settings.phone && (
              <div className="flex items-center gap-3">

                <Phone
                  size={19}
                  className="shrink-0 text-[#E0B66B]"
                />

                <a
                  href={
                    phoneNumber
                      ? `tel:${phoneNumber}`
                      : "#"
                  }
                  className="transition hover:text-white"
                >
                  {settings.phone}
                </a>

              </div>
            )}

            {/* WHATSAPP */}

            {settings.whatsapp && (
              <div className="flex items-center gap-3">

                <FaWhatsapp
                  size={19}
                  className="shrink-0 text-[#E0B66B]"
                />

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-white"
                >
                  WhatsApp
                </a>

              </div>
            )}

            {/* EMAIL */}

            {settings.email && (
              <div className="flex items-center gap-3">

                <Mail
                  size={19}
                  className="shrink-0 text-[#E0B66B]"
                />

                <a
                  href={`mailto:${settings.email}`}
                  className="break-all transition hover:text-white"
                >
                  {settings.email}
                </a>

              </div>
            )}

            {/* OPENING HOURS */}

            {settings.openingHours && (
              <div className="flex items-start gap-3">

                <Clock
                  size={19}
                  className="mt-0.5 shrink-0 text-[#E0B66B]"
                />

                <p className="leading-6">
                  {settings.openingHours}
                </p>

              </div>
            )}

          </div>

        </div>

      </div>

      {/* ==================================================
          BOTTOM FOOTER
      ================================================== */}

      <div className="border-t border-white/10">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-sm text-white/40 md:flex-row">

          <p>
            © {new Date().getFullYear()}{" "}
            {settings.shopName ||
              "हरि ॐ Furniture House"}
            . All rights reserved.
          </p>

          <div className="flex gap-5">

            <a
              href="#"
              className="transition hover:text-white"
            >
              Privacy Policy
            </a>

            <a
              href="#"
              className="transition hover:text-white"
            >
              Terms & Conditions
            </a>

          </div>

        </div>

      </div>

    </footer>
  );
}

export default Footer;
