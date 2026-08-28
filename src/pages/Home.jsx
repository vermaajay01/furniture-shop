import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowRight,
  ArrowUp,
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
  ChevronLeft,
  ChevronRight,
  Tag,
  X,
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
  const [featuredProducts, setFeaturedProducts] =
    useState([]);

  const [loadingProducts, setLoadingProducts] =
    useState(true);

  const [showScrollTop, setShowScrollTop] =
    useState(false);

  // ======================================================
  // DYNAMIC HERO BACKGROUND
  // ======================================================

  const heroImages = [
    {
      src:
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2200&q=85",
      alt:
        "Elegant modern living room furniture",
      position: "center",
    },
    {
      src:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=2200&q=85",
      alt:
        "Modern wooden furniture showroom",
      position: "center",
    },
    {
      src:
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=2200&q=85",
      alt:
        "Warm wooden dining and living furniture",
      position: "center",
    },
    {
      src:
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2200&q=85",
      alt:
        "Contemporary wooden furniture showroom",
      position: "center",
    },
  ];

  const [heroIndex, setHeroIndex] =
    useState(0);

  const [heroLoaded, setHeroLoaded] =
    useState(true);

  // ======================================================
  // DYNAMIC OFFERS
  // ======================================================

  const [offers, setOffers] =
    useState([]);

  const [offerIndex, setOfferIndex] =
    useState(0);

  const [offersLoading, setOffersLoading] =
    useState(true);

  // ======================================================
  // WEBSITE SETTINGS
  // ======================================================

  const [settings, setSettings] =
    useState({
      shopName:
        "हरि ॐ Furniture House",

      address:
        "Your Furniture Shop Address, Your City, India",

      phone:
        "+91 XXXXX XXXXX",

      whatsapp:
        "919596492640",

      email:
        "info@hariomfurniture.com",

      mapsUrl: "",

      openingHours:
        "Mon - Sun: 10:00 AM - 8:00 PM",

      themeId: "classic-maroon",
    });

  // ======================================================
  // VISITOR TRACKING
  // ======================================================

  useEffect(() => {
    trackVisitor();
  }, []);

  // ======================================================
  // ROTATE HERO IMAGES
  // ======================================================

  useEffect(() => {
    const preloadImages =
      heroImages.map(({ src }) => {
        const image =
          new Image();

        image.src = src;

        return image;
      });

    const interval =
      window.setInterval(() => {
        setHeroLoaded(false);

        window.setTimeout(() => {
          setHeroIndex(
            (previous) =>
              (previous + 1) %
              heroImages.length
          );

          setHeroLoaded(true);
        }, 180);
      }, 5500);

    return () => {
      window.clearInterval(
        interval
      );

      preloadImages.forEach(
        (image) => {
          image.src = "";
        }
      );
    };
  }, []);

  // ======================================================
  // SCROLL TO TOP VISIBILITY
  // ======================================================

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(
        window.scrollY > 500
      );
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    handleScroll();

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  // ======================================================
  // SCROLL TO TOP
  // ======================================================

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

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
            "Website settings error:",
            error
          );
        }
      );

    return () => unsubscribe();
  }, []);

  // ======================================================
  // LOAD ACTIVE OFFERS
  // ======================================================

  useEffect(() => {
    const loadOffers =
      async () => {
        try {
          setOffersLoading(true);

          const snapshot =
            await getDocs(
              collection(
                db,
                "offers"
              )
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
                const discount =
                  Number(
                    offer.discountPercent ||
                      0
                  );

                const isActive =
                  offer.active === true;

                const validDiscount =
                  discount > 0;

                const validStart =
                  !offer.startDate ||
                  today >=
                    offer.startDate;

                const validEnd =
                  !offer.endDate ||
                  today <=
                    offer.endDate;

                return (
                  isActive &&
                  validDiscount &&
                  validStart &&
                  validEnd
                );
              })
              .sort((a, b) => {
                const dateA =
                  a.endDate || "";

                const dateB =
                  b.endDate || "";

                return dateA.localeCompare(
                  dateB
                );
              });

          setOffers(
            activeOffers
          );

          setOfferIndex(0);
        } catch (error) {
          console.error(
            "Unable to load offers:",
            error
          );

          setOffers([]);
        } finally {
          setOffersLoading(false);
        }
      };

    loadOffers();
  }, []);

  // ======================================================
  // AUTOMATIC OFFER ROTATION
  // ======================================================

  useEffect(() => {
    if (offers.length <= 1) {
      return;
    }

    const interval =
      window.setInterval(() => {
        setOfferIndex(
          (previous) =>
            (previous + 1) %
            offers.length
        );
      }, 5000);

    return () => {
      window.clearInterval(
        interval
      );
    };
  }, [offers.length]);

  // ======================================================
  // OFFER NAVIGATION
  // ======================================================

  const nextOffer = () => {
    if (!offers.length) {
      return;
    }

    setOfferIndex(
      (previous) =>
        (previous + 1) %
        offers.length
    );
  };

  const previousOffer = () => {
    if (!offers.length) {
      return;
    }

    setOfferIndex(
      (previous) =>
        (previous - 1 +
          offers.length) %
        offers.length
    );
  };

  // ======================================================
  // CURRENT OFFER
  // ======================================================

  const currentOffer =
    offers.length > 0
      ? offers[offerIndex]
      : null;

  const currentDiscount =
    Number(
      currentOffer?.discountPercent ||
        0
    );

  // ======================================================
  // LOAD FEATURED PRODUCTS
  // ======================================================

  useEffect(() => {
    const loadFeaturedProducts =
      async () => {
        try {
          setLoadingProducts(
            true
          );

          const snapshot =
            await getDocs(
              collection(
                db,
                "products"
              )
            );

          const productList =
            snapshot.docs.map(
              (item) => ({
                id: item.id,
                ...item.data(),
              })
            );

          const availableFeatured =
            productList.filter(
              (product) =>
                product.featured ===
                  true &&
                product.available !==
                  false
            );

          setFeaturedProducts(
            availableFeatured.slice(
              0,
              4
            )
          );
        } catch (error) {
          console.error(
            "Unable to load featured products:",
            error
          );
        } finally {
          setLoadingProducts(
            false
          );
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
  // ACTIVE WEBSITE THEME
  // ======================================================

  const themes = {
    "classic-maroon": { page: "var(--site-page)", surface: "#FFFFFF", section: "var(--site-section)", primary: "var(--site-primary)", accent: "var(--site-accent)", dark: "var(--site-dark)", gold: "var(--site-gold)", softGold: "var(--site-soft-gold)", softAccent: "var(--site-soft-accent)", text: "var(--site-text)" },
    "forest-green": { page: "#F2F7F3", surface: "#FFFFFF", section: "#E2EDE5", primary: "#315C46", accent: "#3E7658", dark: "#193B2A", gold: "#C2A15A", softGold: "#A7B99F", softAccent: "#E2EDE5", text: "#183025" },
    "royal-navy": { page: "#F2F5F9", surface: "#FFFFFF", section: "#E1E8F0", primary: "#243B5A", accent: "#31577F", dark: "#172B43", gold: "#C7A65A", softGold: "#AEBED0", softAccent: "#E1E8F0", text: "#172B43" },
    "walnut-brown": { page: "#F7F1EB", surface: "#FFFFFF", section: "#EADFD4", primary: "#5A3928", accent: "#765039", dark: "#382318", gold: "#C19A63", softGold: "#B99A78", softAccent: "#EADFD4", text: "#382318" },
    "modern-charcoal": { page: "#F3F4F5", surface: "#FFFFFF", section: "#E3E5E8", primary: "#30343B", accent: "#464D57", dark: "#20242A", gold: "#C5A66A", softGold: "#AEB1B5", softAccent: "#E3E5E8", text: "#25282D" },
  };

  const activeTheme = themes[settings.themeId] || themes["classic-maroon"];

  // ======================================================
  // CONTACT LINKS
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

  const phoneNumber =
    settings.phone?.replace(
      /[^\d+]/g,
      ""
    );

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <div
      className="min-h-screen text-[var(--site-text)]"
      style={{
        "--site-page": activeTheme.page,
        "--site-surface": activeTheme.surface,
        "--site-section": activeTheme.section,
        "--site-primary": activeTheme.primary,
        "--site-accent": activeTheme.accent,
        "--site-dark": activeTheme.dark,
        "--site-gold": activeTheme.gold,
        "--site-soft-gold": activeTheme.softGold,
        "--site-soft-accent": activeTheme.softAccent,
        "--site-text": activeTheme.text,
        backgroundColor: "var(--site-page)",
      }}
    >

      {/* ==================================================
          FLOATING DYNAMIC OFFER BANNER
      ================================================== */}

      {!offersLoading &&
        currentOffer && (
          <section className="relative z-30 px-3 py-2 sm:px-5 sm:py-3">

            <div className="relative mx-auto max-w-7xl overflow-hidden rounded-xl border border-[var(--site-gold)]/40 bg-[var(--site-dark)] shadow-[0_8px_30px_rgba(58,13,13,0.25)]">

              {/* SUBTLE GLOW */}

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[var(--site-accent)]/20 via-[var(--site-gold)]/10 to-[var(--site-accent)]/20" />

              <div className="relative flex min-h-[64px] items-center justify-center gap-2 px-10 py-3 sm:min-h-[72px] sm:px-16">

                {/* PREVIOUS */}

                {offers.length > 1 && (
                  <button
                    type="button"
                    onClick={
                      previousOffer
                    }
                    aria-label="Previous offer"
                    className="absolute left-2 flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white sm:left-4"
                  >
                    <ChevronLeft
                      size={21}
                    />
                  </button>
                )}

                {/* OFFER CONTENT */}

                <Link
                  to="/shop"
                  className="flex min-w-0 flex-1 items-center justify-center gap-3 text-center"
                >

                  <span className="hidden shrink-0 sm:flex h-9 w-9 items-center justify-center rounded-full bg-[var(--site-gold)]/15 text-[var(--site-gold)]">
                    <Tag size={17} />
                  </span>

                  <div className="min-w-0">

                    <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">

                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--site-gold)] sm:text-xs">
                        Limited Time Offer
                      </span>

                      <span className="hidden text-white/30 sm:inline">
                        •
                      </span>

                      <span className="text-sm font-bold text-white sm:text-base">
                        {currentDiscount}% OFF
                      </span>

                    </div>

                    <p className="mt-0.5 truncate text-xs text-white/75 sm:text-sm">
                      {currentOffer.title ||
                        currentOffer.name ||
                        "Special Offer on Selected Furniture"}
                    </p>

                  </div>

                  <ArrowRight
                    size={17}
                    className="hidden shrink-0 text-[var(--site-gold)] sm:block"
                  />

                </Link>

                {/* NEXT */}

                {offers.length > 1 && (
                  <button
                    type="button"
                    onClick={
                      nextOffer
                    }
                    aria-label="Next offer"
                    className="absolute right-2 flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white sm:right-4"
                  >
                    <ChevronRight
                      size={21}
                    />
                  </button>
                )}

              </div>

              {/* PROGRESS DOTS */}

              {offers.length > 1 && (
                <div className="absolute bottom-1 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
                  {offers.map(
                    (_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() =>
                          setOfferIndex(
                            index
                          )
                        }
                        aria-label={`Show offer ${
                          index + 1
                        }`}
                        className={`h-1 rounded-full transition-all duration-300 ${
                          index ===
                          offerIndex
                            ? "w-5 bg-[var(--site-gold)]"
                            : "w-1 bg-white/40"
                        }`}
                      />
                    )
                  )}
                </div>
              )}

            </div>

          </section>
        )}

      {/* ==================================================
          HERO
      ================================================== */}

      <section className="relative flex min-h-[calc(100vh-80px)] items-center overflow-hidden sm:min-h-screen">

        {/* DYNAMIC BACKGROUND */}

        {heroImages.map(
          (image, index) => (
            <img
              key={image.src}
              src={image.src}
              alt={image.alt}
              loading={
                index === 0
                  ? "eager"
                  : "lazy"
              }
              className={`absolute inset-0 h-full w-full object-cover transition-all duration-1000 ease-in-out ${
                index === heroIndex
                  ? heroLoaded
                    ? "scale-100 opacity-100"
                    : "scale-[1.02] opacity-0"
                  : "scale-105 opacity-0"
              }`}
              style={{
                objectPosition:
                  image.position,
              }}
            />
          )
        )}

        {/* DARK OVERLAY */}

        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/65" />

        {/* WARM BRAND TINT */}

        <div className="absolute inset-0 bg-[var(--site-dark)]/10" />

        {/* HERO CONTENT */}

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-28 sm:px-6 sm:py-32">

          <div className="max-w-3xl text-white">

            <p className="mb-5 uppercase tracking-[0.35em] text-[var(--site-gold)]">
              Crafted with care
            </p>

            <h1 className="text-4xl font-bold leading-[1.08] sm:text-5xl md:text-7xl">

              Furniture that makes

              <span className="block text-[var(--site-gold)]">
                your house a home.
              </span>

            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-white/85 sm:mt-6 sm:text-lg sm:leading-8">
              Discover beautifully crafted
              furniture designed for comfort,
              durability and timeless style.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">

              <Link
                to="/shop"
                className="flex w-full items-center justify-center gap-2 bg-[var(--site-accent)] px-6 py-3.5 font-semibold transition hover:bg-[var(--site-primary)] sm:w-auto sm:px-7 sm:py-4"
              >
                Explore Collection

                <ArrowRight size={18} />
              </Link>

              <Link
                to="/custom-furniture"
                className="flex w-full items-center justify-center border border-white/70 px-6 py-3.5 text-center font-semibold backdrop-blur-sm transition hover:bg-white hover:text-black sm:w-auto sm:px-7 sm:py-4"
              >
                Custom Furniture
              </Link>

            </div>

          </div>

        </div>

        {/* HERO IMAGE DOTS */}

        <div className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">

          {heroImages.map(
            (_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Show hero image ${
                  index + 1
                }`}
                onClick={() => {
                  setHeroLoaded(
                    false
                  );

                  setHeroIndex(
                    index
                  );

                  window.setTimeout(
                    () => {
                      setHeroLoaded(
                        true
                      );
                    },
                    180
                  );
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === heroIndex
                    ? "w-7 bg-[var(--site-gold)]"
                    : "w-2 bg-white/60 hover:bg-white"
                }`}
              />
            )
          )}

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

            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-[var(--site-accent)]">
              Explore
            </p>

            <h2 className="text-4xl font-bold md:text-5xl">
              Shop by Category
            </h2>

          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">

            {categories.map(
              (category) => {
                const Icon =
                  category.icon;

                if (
                  category.name ===
                  "Custom Furniture"
                ) {
                  return (
                    <Link
                      key={
                        category.name
                      }
                      to="/custom-furniture"
                      className="group border border-black/10 bg-[var(--site-surface)] p-7 text-center transition hover:-translate-y-1 hover:shadow-xl"
                    >

                      <Icon
                        className="mx-auto mb-5 text-[var(--site-accent)] transition group-hover:scale-110"
                        size={36}
                        strokeWidth={1.5}
                      />

                      <h3 className="font-semibold">
                        {
                          category.name
                        }
                      </h3>

                    </Link>
                  );
                }

                return (
                  <Link
                    key={
                      category.name
                    }
                    to={`/shop?category=${encodeURIComponent(
                      category.name
                    )}`}
                    className="group border border-black/10 bg-[var(--site-surface)] p-7 text-center transition hover:-translate-y-1 hover:shadow-xl"
                  >

                    <Icon
                      className="mx-auto mb-5 text-[var(--site-accent)] transition group-hover:scale-110"
                      size={36}
                      strokeWidth={1.5}
                    />

                    <h3 className="font-semibold">
                      {
                        category.name
                      }
                    </h3>

                  </Link>
                );
              }
            )}

          </div>

        </div>

      </section>

      {/* ==================================================
          FEATURED PRODUCTS
      ================================================== */}

      <section
        id="shop"
        className="bg-[var(--site-section)] px-6 py-24"
      >

        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

            <div>

              <p className="mb-3 text-sm uppercase tracking-[0.3em] text-[var(--site-accent)]">
                Our Collection
              </p>

              <h2 className="text-4xl font-bold md:text-5xl">
                Featured Furniture
              </h2>

            </div>

            <Link
              to="/shop"
              className="flex items-center gap-2 font-semibold text-[var(--site-accent)]"
            >
              View All

              <ArrowRight size={18} />
            </Link>

          </div>

          {loadingProducts && (
            <div className="flex min-h-[300px] items-center justify-center">

              <div className="flex items-center gap-3 text-[var(--site-accent)]">

                <Loader2
                  size={24}
                  className="animate-spin"
                />

                Loading furniture...

              </div>

            </div>
          )}

          {!loadingProducts &&
            featuredProducts.length ===
              0 && (
              <div className="mt-12 bg-white p-12 text-center">

                <h3 className="text-xl font-bold">
                  Featured furniture
                  coming soon
                </h3>

                <p className="mt-3 text-gray-500">
                  Products marked as
                  Featured in the Admin
                  Panel will appear here.
                </p>

                <Link
                  to="/shop"
                  className="mt-6 inline-flex items-center gap-2 bg-[var(--site-accent)] px-6 py-3 font-semibold text-white"
                >
                  Browse All Furniture

                  <ArrowRight
                    size={18}
                  />
                </Link>

              </div>
            )}

          {!loadingProducts &&
            featuredProducts.length >
              0 && (
              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

                {featuredProducts.map(
                  (product) => (
                    <ProductCard
                      key={
                        product.id
                      }
                      product={
                        product
                      }
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

        <div className="mx-auto grid max-w-7xl overflow-hidden bg-[var(--site-dark)] md:grid-cols-2">

          <div className="p-10 text-white md:p-16">

            <p className="mb-4 uppercase tracking-[0.3em] text-[var(--site-gold)]">
              Made for you
            </p>

            <h2 className="text-4xl font-bold md:text-5xl">
              Have a design in mind?
            </h2>

            <p className="mt-6 leading-7 text-white/70">
              Tell us what you need.
              Share your design,
              dimensions and preferred
              finish, and our team will
              help turn your idea into
              beautiful furniture.
            </p>

            <Link
              to="/custom-furniture"
              className="mt-8 inline-flex items-center gap-2 bg-[var(--site-accent)] px-7 py-4 font-semibold transition hover:bg-[var(--site-primary)]"
            >
              Request Custom Quote

              <ArrowRight
                size={18}
              />
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
        className="bg-[var(--site-surface)] px-6 py-24"
      >

        <div className="mx-auto max-w-7xl text-center">

          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-[var(--site-accent)]">
            Why Choose Us
          </p>

          <h2 className="text-4xl font-bold md:text-5xl">
            Built with quality. Made
            to last.
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

                  <p className="text-4xl font-bold text-[var(--site-soft-gold)]">
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
        className="bg-[var(--site-page)] px-6 py-24"
      >

        <div className="mx-auto max-w-7xl">

          <div className="mb-12 text-center">

            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-[var(--site-accent)]">
              Visit Us
            </p>

            <h2 className="text-4xl font-bold md:text-5xl">
              Contact{" "}
              {settings.shopName}
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-7 text-gray-600">
              Visit our showroom or
              contact us for furniture
              enquiries, custom designs
              and product information.
            </p>

          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

            {/* ADDRESS */}

            <div className="bg-[var(--site-surface)] p-7 shadow-sm">

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--site-soft-accent)] text-[var(--site-accent)]">
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
                  href={
                    settings.mapsUrl
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--site-accent)] hover:underline"
                >
                  Open in Google Maps

                  <ArrowRight
                    size={15}
                  />
                </a>
              )}

            </div>

            {/* PHONE */}

            <div className="bg-[var(--site-surface)] p-7 shadow-sm">

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--site-soft-accent)] text-[var(--site-accent)]">
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
                className="mt-3 block text-gray-600 transition hover:text-[var(--site-accent)]"
              >
                {settings.phone}
              </a>

              <p className="mt-2 text-sm text-gray-400">
                Call us for product
                enquiries.
              </p>

            </div>

            {/* WHATSAPP */}

            <div className="bg-[var(--site-surface)] p-7 shadow-sm">

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--site-soft-accent)] text-[var(--site-accent)]">
                <MessageCircle
                  size={22}
                />
              </div>

              <h3 className="mt-5 text-lg font-bold">
                WhatsApp
              </h3>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 block font-medium text-[var(--site-accent)] hover:underline"
              >
                Chat With Us
              </a>

              <p className="mt-2 text-sm text-gray-400">
                Send us your furniture
                enquiry directly on
                WhatsApp.
              </p>

            </div>

            {/* EMAIL / HOURS */}

            <div className="bg-[var(--site-surface)] p-7 shadow-sm">

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--site-soft-accent)] text-[var(--site-accent)]">
                <Mail size={22} />
              </div>

              <h3 className="mt-5 text-lg font-bold">
                Contact Details
              </h3>

              <a
                href={`mailto:${settings.email}`}
                className="mt-3 block break-all text-gray-600 transition hover:text-[var(--site-accent)]"
              >
                {settings.email}
              </a>

              <div className="mt-4 flex items-start gap-2 text-sm text-gray-500">

                <Clock
                  size={16}
                  className="mt-0.5 shrink-0 text-[var(--site-accent)]"
                />

                <span>
                  {
                    settings.openingHours
                  }
                </span>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ==================================================
          SCROLL TO TOP
      ================================================== */}

      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll to top"
          title="Back to top"
          className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--site-primary)] text-white shadow-xl transition duration-300 hover:-translate-y-1 hover:bg-[var(--site-accent)] hover:shadow-[0_8px_25px_rgba(107,30,30,0.4)]"
        >
          <ArrowUp size={21} />
        </button>
      )}

    </div>
  );
}

export default Home;