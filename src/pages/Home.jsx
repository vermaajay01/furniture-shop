import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowRight,
  Loader2,
  Sofa,
  BedDouble,
  Table2,
  Armchair,
  DoorOpen,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Clock,
} from "lucide-react";

import {
  collection,
  getDocs,
  doc,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../firebase/firebase";
import ProductCard from "../components/ProductCard";
import { trackVisitor } from "../firebase/visitorTracking";

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [settings, setSettings] = useState({
    shopName: "हरि ॐ Furniture House",
    address:
      "Your Furniture Shop Address, Your City, India",
    phone: "+91 XXXXX XXXXX",
    whatsapp: "919596492640",
    email: "info@hariomfurniture.com",
    mapsUrl: "",
    openingHours: "Mon - Sun: 10:00 AM - 8:00 PM",
  });

  // ======================================================
  // VISITOR TRACKING
  // ======================================================

  useEffect(() => {
    trackVisitor();
  }, []);

  // ======================================================
  // LOAD WEBSITE SETTINGS
  // ======================================================

  useEffect(() => {
    const settingsRef = doc(
      db,
      "settings",
      "website"
    );

    const unsubscribe = onSnapshot(
      settingsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setSettings((previous) => ({
            ...previous,
            ...snapshot.data(),
          }));
        }
      },
      (error) => {
        console.error(
          "Website settings error:",
          error
        );
      }
    );

    return () => unsubscribe();
  }, []);

  // ======================================================
  // LOAD FEATURED PRODUCTS
  // ======================================================

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        setLoadingProducts(true);

        const snapshot = await getDocs(
          collection(db, "products")
        );

        const productList = snapshot.docs.map(
          (item) => ({
            id: item.id,
            ...item.data(),
          })
        );

        const availableFeatured =
          productList.filter(
            (product) =>
              product.featured === true &&
              product.available !== false
          );

        setFeaturedProducts(
          availableFeatured.slice(0, 4)
        );
      } catch (error) {
        console.error(
          "Unable to load featured products:",
          error
        );
      } finally {
        setLoadingProducts(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  // ======================================================
  // CATEGORIES
  // ======================================================

  const categories = [
    {
      name: "Sofas",
      icon: Sofa,
    },
    {
      name: "Beds",
      icon: BedDouble,
    },
    {
      name: "Tables",
      icon: Table2,
    },
    {
      name: "Chairs",
      icon: Armchair,
    },
    {
      name: "Wardrobes",
      icon: DoorOpen,
    },
    {
      name: "Custom Furniture",
      icon: Sparkles,
    },
  ];

  // ======================================================
  // CONTACT LINKS
  // ======================================================

  const whatsappNumber =
    settings.whatsapp?.replace(
      /\D/g,
      ""
    );

  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}`
    : "#";

  const phoneNumber =
    settings.phone?.replace(
      /[^\d+]/g,
      ""
    );

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <div className="min-h-screen bg-[#F8F1E7] text-[#2B1714]">

      {/* ==================================================
          HERO
      ================================================== */}

      <section className="relative flex min-h-screen items-center overflow-hidden">

        <img
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2000&q=85"
          alt="Luxury furniture"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-32">

          <div className="max-w-3xl text-white">

            <p className="mb-5 uppercase tracking-[0.35em] text-[#E0B66B]">
              Crafted with care
            </p>

            <h1 className="text-5xl font-bold leading-tight md:text-7xl">
              Furniture that makes
              <span className="block text-[#E0B66B]">
                your house a home.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-white/80">
              Discover beautifully crafted furniture
              designed for comfort, durability and
              timeless style.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">

              <Link
                to="/shop"
                className="flex items-center gap-2 bg-[#8B2E2E] px-7 py-4 font-semibold transition hover:bg-[#6B1E1E]"
              >
                Explore Collection
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/custom-furniture"
                className="border border-white/70 px-7 py-4 font-semibold backdrop-blur-sm transition hover:bg-white hover:text-black"
              >
                Custom Furniture
              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* ==================================================
          CATEGORIES
      ================================================== */}

      <section
        id="categories"
        className="px-6 py-24"
      >

        <div className="mx-auto max-w-7xl">

          <div className="mb-12 text-center">

            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-[#8B2E2E]">
              Explore
            </p>

            <h2 className="text-4xl font-bold md:text-5xl">
              Shop by Category
            </h2>

          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">

            {categories.map((category) => {

              const Icon = category.icon;

              if (
                category.name ===
                "Custom Furniture"
              ) {
                return (
                  <Link
                    key={category.name}
                    to="/custom-furniture"
                    className="group border border-black/10 bg-white p-7 text-center transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <Icon
                      className="mx-auto mb-5 text-[#8B2E2E] transition group-hover:scale-110"
                      size={36}
                      strokeWidth={1.5}
                    />

                    <h3 className="font-semibold">
                      {category.name}
                    </h3>
                  </Link>
                );
              }

              return (
                <Link
                  key={category.name}
                  to={`/shop?category=${encodeURIComponent(
                    category.name
                  )}`}
                  className="group border border-black/10 bg-white p-7 text-center transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <Icon
                    className="mx-auto mb-5 text-[#8B2E2E] transition group-hover:scale-110"
                    size={36}
                    strokeWidth={1.5}
                  />

                  <h3 className="font-semibold">
                    {category.name}
                  </h3>
                </Link>
              );

            })}

          </div>

        </div>

      </section>

      {/* ==================================================
          FEATURED PRODUCTS
      ================================================== */}

      <section
        id="shop"
        className="bg-[#EDE0D2] px-6 py-24"
      >

        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

            <div>

              <p className="mb-3 text-sm uppercase tracking-[0.3em] text-[#8B2E2E]">
                Our Collection
              </p>

              <h2 className="text-4xl font-bold md:text-5xl">
                Featured Furniture
              </h2>

            </div>

            <Link
              to="/shop"
              className="flex items-center gap-2 font-semibold text-[#8B2E2E]"
            >
              View All
              <ArrowRight size={18} />
            </Link>

          </div>

          {loadingProducts && (
            <div className="flex min-h-[300px] items-center justify-center">

              <div className="flex items-center gap-3 text-[#8B2E2E]">

                <Loader2
                  size={24}
                  className="animate-spin"
                />

                Loading furniture...

              </div>

            </div>
          )}

          {!loadingProducts &&
            featuredProducts.length === 0 && (
              <div className="mt-12 bg-white p-12 text-center">

                <h3 className="text-xl font-bold">
                  Featured furniture coming soon
                </h3>

                <p className="mt-3 text-gray-500">
                  Products marked as Featured in
                  the Admin Panel will appear here.
                </p>

                <Link
                  to="/shop"
                  className="mt-6 inline-flex items-center gap-2 bg-[#8B2E2E] px-6 py-3 font-semibold text-white"
                >
                  Browse All Furniture
                  <ArrowRight size={18} />
                </Link>

              </div>
            )}

          {!loadingProducts &&
            featuredProducts.length > 0 && (
              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

                {featuredProducts.map(
                  (product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                    />
                  )
                )}

              </div>
            )}

        </div>

      </section>

      {/* ==================================================
          CUSTOM FURNITURE
      ================================================== */}

      <section
        id="custom"
        className="px-6 py-24"
      >

        <div className="mx-auto grid max-w-7xl overflow-hidden bg-[#3A0D0D] md:grid-cols-2">

          <div className="p-10 text-white md:p-16">

            <p className="mb-4 uppercase tracking-[0.3em] text-[#E0B66B]">
              Made for you
            </p>

            <h2 className="text-4xl font-bold md:text-5xl">
              Have a design in mind?
            </h2>

            <p className="mt-6 leading-7 text-white/70">
              Tell us what you need. Share your
              design, dimensions and preferred finish,
              and our team will help turn your idea
              into beautiful furniture.
            </p>

            <Link
              to="/custom-furniture"
              className="mt-8 inline-flex items-center gap-2 bg-[#8B2E2E] px-7 py-4 font-semibold transition hover:bg-[#6B1E1E]"
            >
              Request Custom Quote
              <ArrowRight size={18} />
            </Link>

          </div>

          <img
            src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=85"
            alt="Custom furniture"
            className="h-full min-h-[350px] w-full object-cover"
          />

        </div>

      </section>

      {/* ==================================================
          WHY CHOOSE US
      ================================================== */}

      <section
        id="about"
        className="bg-white px-6 py-24"
      >

        <div className="mx-auto max-w-7xl text-center">

          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-[#8B2E2E]">
            Why Choose Us
          </p>

          <h2 className="text-4xl font-bold md:text-5xl">
            Built with quality. Made to last.
          </h2>

          <div className="mt-14 grid gap-8 md:grid-cols-4">

            {[
              [
                "01",
                "Quality Materials",
                "Carefully selected materials for long-lasting furniture.",
              ],
              [
                "02",
                "Custom Designs",
                "Furniture designed according to your space and needs.",
              ],
              [
                "03",
                "Skilled Craftsmanship",
                "Attention to detail in every piece we create.",
              ],
              [
                "04",
                "Reliable Service",
                "From selection to delivery, we are here to help.",
              ],
            ].map(
              ([
                number,
                title,
                description,
              ]) => (
                <div
                  key={number}
                  className="p-6"
                >

                  <p className="text-4xl font-bold text-[#CFAE8A]">
                    {number}
                  </p>

                  <h3 className="mt-4 text-xl font-semibold">
                    {title}
                  </h3>

                  <p className="mt-3 text-gray-600">
                    {description}
                  </p>

                </div>
              )
            )}

          </div>

        </div>

      </section>

      {/* ==================================================
          CONTACT
      ================================================== */}

      <section
        id="contact"
        className="bg-[#F8F1E7] px-6 py-24"
      >

        <div className="mx-auto max-w-7xl">

          <div className="mb-12 text-center">

            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-[#8B2E2E]">
              Visit Us
            </p>

            <h2 className="text-4xl font-bold md:text-5xl">
              Contact {settings.shopName}
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-7 text-gray-600">
              Visit our showroom or contact us for
              furniture enquiries, custom designs and
              product information.
            </p>

          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

            {/* ADDRESS */}

            <div className="bg-white p-7 shadow-sm">

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F5E4E4] text-[#8B2E2E]">
                <MapPin size={22} />
              </div>

              <h3 className="mt-5 text-lg font-bold">
                Visit Our Shop
              </h3>

              <p className="mt-3 leading-6 text-gray-600">
                {settings.address}
              </p>

              {settings.mapsUrl && (
                <a
                  href={settings.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#8B2E2E] hover:underline"
                >
                  Open in Google Maps
                  <ArrowRight size={15} />
                </a>
              )}

            </div>

            {/* PHONE */}

            <div className="bg-white p-7 shadow-sm">

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F5E4E4] text-[#8B2E2E]">
                <Phone size={22} />
              </div>

              <h3 className="mt-5 text-lg font-bold">
                Call Us
              </h3>

              <a
                href={
                  phoneNumber
                    ? `tel:${phoneNumber}`
                    : "#"
                }
                className="mt-3 block text-gray-600 transition hover:text-[#8B2E2E]"
              >
                {settings.phone}
              </a>

              <p className="mt-2 text-sm text-gray-400">
                Call us for product enquiries.
              </p>

            </div>

            {/* WHATSAPP */}

            <div className="bg-white p-7 shadow-sm">

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F5E4E4] text-[#8B2E2E]">
                <MessageCircle size={22} />
              </div>

              <h3 className="mt-5 text-lg font-bold">
                WhatsApp
              </h3>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 block font-medium text-[#8B2E2E] hover:underline"
              >
                Chat With Us
              </a>

              <p className="mt-2 text-sm text-gray-400">
                Send us your furniture enquiry
                directly on WhatsApp.
              </p>

            </div>

            {/* EMAIL / HOURS */}

            <div className="bg-white p-7 shadow-sm">

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F5E4E4] text-[#8B2E2E]">
                <Mail size={22} />
              </div>

              <h3 className="mt-5 text-lg font-bold">
                Contact Details
              </h3>

              <a
                href={`mailto:${settings.email}`}
                className="mt-3 block break-all text-gray-600 transition hover:text-[#8B2E2E]"
              >
                {settings.email}
              </a>

              <div className="mt-4 flex items-start gap-2 text-sm text-gray-500">

                <Clock
                  size={16}
                  className="mt-0.5 shrink-0 text-[#8B2E2E]"
                />

                <span>
                  {settings.openingHours}
                </span>

              </div>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Home;