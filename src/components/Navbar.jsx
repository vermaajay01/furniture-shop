import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  Menu,
  X,
  Search,
  ShoppingCart,
  ShieldCheck,
  ArrowRight,
  User,
  Bell,
  Heart,
} from "lucide-react";

import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";

function Navbar() {
  const navigate = useNavigate();

  const { cartCount } = useCart();

  const { user } = useAuth();

  const { wishlist } = useWishlist();

  const wishlistCount =
    wishlist.length;

  const [unreadNotificationCount, setUnreadNotificationCount] =
    useState(0);

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [searchOpen, setSearchOpen] =
    useState(false);

  const [searchText, setSearchText] =
    useState("");

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // ======================================================
  // CUSTOMER NOTIFICATIONS
  // ======================================================

  useEffect(() => {
    if (!user) {
      setUnreadNotificationCount(0);
      return;
    }

    const notificationsQuery = query(
      collection(
        db,
        "customerNotifications"
      ),
      where(
        "userId",
        "==",
        user.uid
      )
    );

    const unsubscribe =
      onSnapshot(
        notificationsQuery,
        (snapshot) => {
          const unread =
            snapshot.docs.filter(
              (item) =>
                item.data().read !== true
            ).length;

          setUnreadNotificationCount(
            unread
          );
        },
        (error) => {
          console.error(
            "Navbar notification listener error:",
            error
          );

          setUnreadNotificationCount(0);
        }
      );

    return () => unsubscribe();
  }, [user]);

  const openWishlist = () => {
    if (user) {
      navigate("/account/wishlist");
    } else {
      navigate("/login");
    }

    closeMenu();
  };

  const openNotifications = () => {
    navigate("/account/notifications");
    closeMenu();
  };

  // ======================================================
  // SEARCH
  // ======================================================

  const handleSearch = (e) => {
    e.preventDefault();

    const value = searchText.trim();

    if (!value) {
      navigate("/shop");
    } else {
      navigate(
        `/shop?search=${encodeURIComponent(
          value
        )}`
      );
    }

    setSearchOpen(false);
    setSearchText("");
    closeMenu();
  };

  const openSearch = () => {
    setSearchOpen(true);
    setMenuOpen(false);
  };

  // ======================================================
  // CART
  // ======================================================

  const openCart = () => {
    navigate("/cart");
    closeMenu();
  };

  // ======================================================
  // CUSTOMER ACCOUNT / LOGIN
  // ======================================================

  const openAccount = () => {
    if (user) {
      // Customer account page will be added in the next step.
      navigate("/account");
    } else {
      navigate("/login");
    }

    closeMenu();
  };

  return (
    <header className="fixed top-0 z-50 w-full border-b border-[#6B1E1E]/15 bg-[#F8F1E7]/95 shadow-sm backdrop-blur-md">

      {/* ==================================================
          MAIN NAVBAR
      ================================================== */}

      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* ==================================================
            LOGO
        ================================================== */}

        <Link
          to="/"
          onClick={closeMenu}
          className="cursor-pointer"
        >
          <h1 className="text-2xl font-bold tracking-wide text-[#6B1E1E]">
            हरि{" "}
            <span className="text-[#B8863B]">
              ॐ
            </span>
          </h1>

          <p className="text-[10px] font-medium tracking-[0.35em] text-[#6B1E1E]">
            FURNITURE HOUSE
          </p>
        </Link>

        {/* ==================================================
            DESKTOP NAVIGATION
        ================================================== */}

        <nav className="hidden items-center gap-8 md:flex">

          <Link
            to="/"
            className="transition hover:text-[#8B2E2E]"
          >
            Home
          </Link>

          <Link
            to="/shop"
            className="transition hover:text-[#8B2E2E]"
          >
            Shop
          </Link>

          <a
            href="/#categories"
            className="transition hover:text-[#8B2E2E]"
          >
            Categories
          </a>

          <Link
            to="/custom-furniture"
            className="transition hover:text-[#8B2E2E]"
          >
            Custom Furniture
          </Link>

          <a
            href="/#about"
            className="transition hover:text-[#8B2E2E]"
          >
            About
          </a>

          <a
            href="/#contact"
            className="transition hover:text-[#8B2E2E]"
          >
            Contact
          </a>

        </nav>

        {/* ==================================================
            DESKTOP ACTIONS
        ================================================== */}

        <div className="hidden items-center gap-5 md:flex">

          {/* SEARCH */}

          <button
            type="button"
            aria-label="Search"
            title="Search"
            onClick={openSearch}
            className="transition hover:text-[#8B2E2E]"
          >
            <Search size={20} />
          </button>

          {/* CART */}

          <div className="relative">

            <button
              type="button"
              aria-label="Shopping cart"
              title="Shopping Cart"
              onClick={openCart}
              className="transition hover:text-[#8B2E2E]"
            >
              <ShoppingCart size={20} />
            </button>

            {cartCount > 0 && (
              <span className="absolute -right-3 -top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#8B2E2E] px-1 text-[10px] font-bold text-white">
                {cartCount > 99
                  ? "99+"
                  : cartCount}
              </span>
            )}

          </div>

          {/* CUSTOMER WISHLIST */}

          {user && (
            <button
              type="button"
              onClick={openWishlist}
              aria-label="Wishlist"
              title="Wishlist"
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#6B1E1E]/15 text-[#6B1E1E] transition hover:border-[#8B2E2E] hover:bg-[#8B2E2E] hover:text-white"
            >
              <Heart
                size={18}
                fill="none"
              />

              {wishlistCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#8B2E2E] px-1 text-[10px] font-bold text-white">
                  {wishlistCount > 99
                    ? "99+"
                    : wishlistCount}
                </span>
              )}
            </button>
          )}

          {/* CUSTOMER NOTIFICATIONS */}

          {user && (
            <button
              type="button"
              onClick={openNotifications}
              aria-label="Notifications"
              title="Notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#6B1E1E]/15 text-[#6B1E1E] transition hover:border-[#8B2E2E] hover:bg-[#8B2E2E] hover:text-white"
            >
              <Bell size={18} />

              {unreadNotificationCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#8B2E2E] px-1 text-[10px] font-bold text-white">
                  {unreadNotificationCount > 99
                    ? "99+"
                    : unreadNotificationCount}
                </span>
              )}
            </button>
          )}

          {/* CUSTOMER ACCOUNT / LOGIN */}

          <button
            type="button"
            onClick={openAccount}
            aria-label={
              user
                ? "My Account"
                : "Customer Login"
            }
            title={
              user
                ? "My Account"
                : "Login"
            }
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#6B1E1E]/15 text-[#6B1E1E] transition hover:border-[#8B2E2E] hover:bg-[#8B2E2E] hover:text-white"
          >
            <User size={18} />
          </button>

          {/* ADMIN */}

          <Link
            to="/admin"
            aria-label="Admin login"
            title="Admin"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#6B1E1E]/15 text-[#6B1E1E] transition hover:border-[#8B2E2E] hover:bg-[#8B2E2E] hover:text-white"
          >
            <ShieldCheck size={18} />
          </Link>

        </div>

        {/* ==================================================
            MOBILE ACTIONS
        ================================================== */}

        <div className="flex items-center gap-2 md:hidden">

          {/* SEARCH */}

          <button
            type="button"
            onClick={openSearch}
            aria-label="Search"
            className="flex h-9 w-9 items-center justify-center text-[#6B1E1E]"
          >
            <Search size={20} />
          </button>

          {/* CART */}

          <div className="relative">

            <button
              type="button"
              onClick={openCart}
              aria-label="Shopping cart"
              className="flex h-9 w-9 items-center justify-center text-[#6B1E1E]"
            >
              <ShoppingCart size={20} />
            </button>

            {cartCount > 0 && (
              <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#8B2E2E] px-1 text-[9px] font-bold text-white">
                {cartCount > 99
                  ? "99+"
                  : cartCount}
              </span>
            )}

          </div>

          {/* CUSTOMER WISHLIST */}

          {user && (
            <button
              type="button"
              onClick={openWishlist}
              aria-label="Wishlist"
              title="Wishlist"
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#6B1E1E]/15 text-[#6B1E1E] transition hover:border-[#8B2E2E] hover:bg-[#8B2E2E] hover:text-white"
            >
              <Heart
                size={18}
                fill="none"
              />

              {wishlistCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#8B2E2E] px-1 text-[10px] font-bold text-white">
                  {wishlistCount > 99
                    ? "99+"
                    : wishlistCount}
                </span>
              )}
            </button>
          )}

          {/* CUSTOMER NOTIFICATIONS */}

          {user && (
            <button
              type="button"
              onClick={openNotifications}
              aria-label="Notifications"
              title="Notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#6B1E1E]/15 text-[#6B1E1E]"
            >
              <Bell size={18} />

              {unreadNotificationCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#8B2E2E] px-1 text-[9px] font-bold text-white">
                  {unreadNotificationCount > 99
                    ? "99+"
                    : unreadNotificationCount}
                </span>
              )}
            </button>
          )}

          {/* CUSTOMER ACCOUNT / LOGIN */}

          <button
            type="button"
            onClick={openAccount}
            aria-label={
              user
                ? "My Account"
                : "Customer Login"
            }
            title={
              user
                ? "My Account"
                : "Login"
            }
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#6B1E1E]/15 text-[#6B1E1E]"
          >
            <User size={18} />
          </button>

          {/* ADMIN */}

          <Link
            to="/admin"
            onClick={closeMenu}
            aria-label="Admin login"
            title="Admin"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#6B1E1E]/15 text-[#6B1E1E]"
          >
            <ShieldCheck size={18} />
          </Link>

          {/* MENU */}

          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center text-[#6B1E1E]"
            onClick={() =>
              setMenuOpen(
                (previous) => !previous
              )
            }
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>

        </div>

      </div>

      {/* ==================================================
          SEARCH PANEL
      ================================================== */}

      {searchOpen && (
        <div className="border-t border-[#6B1E1E]/10 bg-[#F8F1E7]">

          <div className="mx-auto max-w-7xl px-6 py-5">

            <form
              onSubmit={handleSearch}
              className="flex gap-3"
            >

              <div className="relative flex-1">

                <Search
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  autoFocus
                  type="text"
                  value={searchText}
                  onChange={(e) =>
                    setSearchText(
                      e.target.value
                    )
                  }
                  placeholder="Search sofas, beds, tables..."
                  className="w-full border border-gray-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-[#8B2E2E] focus:ring-1 focus:ring-[#8B2E2E]"
                />

              </div>

              <button
                type="submit"
                className="flex items-center gap-2 bg-[#6B1E1E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#8B2E2E]"
              >
                Search
                <ArrowRight size={17} />
              </button>

              <button
                type="button"
                onClick={() => {
                  setSearchOpen(false);
                  setSearchText("");
                }}
                className="flex h-12 w-12 items-center justify-center border border-gray-200 bg-white text-gray-500 transition hover:text-[#8B2E2E]"
                aria-label="Close search"
              >
                <X size={20} />
              </button>

            </form>

          </div>

        </div>
      )}

      {/* ==================================================
          MOBILE NAVIGATION
      ================================================== */}

      {menuOpen && (
        <nav className="border-t border-[#6B1E1E]/10 bg-[#F8F1E7] px-6 py-5 md:hidden">

          <div className="flex flex-col gap-5">

            <Link
              to="/"
              onClick={closeMenu}
              className="transition hover:text-[#8B2E2E]"
            >
              Home
            </Link>

            <Link
              to="/shop"
              onClick={closeMenu}
              className="transition hover:text-[#8B2E2E]"
            >
              Shop
            </Link>

            <a
              href="/#categories"
              onClick={closeMenu}
              className="transition hover:text-[#8B2E2E]"
            >
              Categories
            </a>

            <Link
              to="/custom-furniture"
              onClick={closeMenu}
              className="transition hover:text-[#8B2E2E]"
            >
              Custom Furniture
            </Link>

            <a
              href="/#about"
              onClick={closeMenu}
              className="transition hover:text-[#8B2E2E]"
            >
              About
            </a>

            <a
              href="/#contact"
              onClick={closeMenu}
              className="transition hover:text-[#8B2E2E]"
            >
              Contact
            </a>

            {user && (
              <button
                type="button"
                onClick={openWishlist}
                className="flex items-center gap-2 text-left transition hover:text-[#8B2E2E]"
              >
                <Heart size={18} />
                Wishlist
                {wishlistCount > 0 && (
                  <span className="rounded-full bg-[#8B2E2E] px-2 py-0.5 text-xs font-bold text-white">
                    {wishlistCount > 99
                      ? "99+"
                      : wishlistCount}
                  </span>
                )}
              </button>
            )}

            {user && (
              <button
                type="button"
                onClick={openNotifications}
                className="flex items-center gap-2 text-left transition hover:text-[#8B2E2E]"
              >
                <Bell size={18} />
                Notifications
                {unreadNotificationCount > 0 && (
                  <span className="rounded-full bg-[#8B2E2E] px-2 py-0.5 text-xs font-bold text-white">
                    {unreadNotificationCount > 99
                      ? "99+"
                      : unreadNotificationCount}
                  </span>
                )}
              </button>
            )}

          </div>

        </nav>
      )}

    </header>
  );
}

export default Navbar;