import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  Menu,
  X,
  Search,
  ShoppingCart,
  User,
  Bell,
  Heart,
  ArrowRight,
} from "lucide-react";

import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

import {
  useCart,
} from "../context/CartContext";

import {
  useAuth,
} from "../context/AuthContext";

import {
  useWishlist,
} from "../context/WishlistContext";

function Navbar({
  onMenuClick,
}) {
  const navigate =
    useNavigate();

  const {
    cartCount,
  } = useCart();

  const {
    user,
    isAdmin,
    role,
  } = useAuth();

  const {
    wishlist,
  } = useWishlist();

  const wishlistCount =
    wishlist.length;

  const [
    unreadNotificationCount,
    setUnreadNotificationCount,
  ] = useState(0);

  const [
    searchOpen,
    setSearchOpen,
  ] = useState(false);

  const [
    searchText,
    setSearchText,
  ] = useState("");

  // ======================================================
  // CUSTOMER NOTIFICATIONS
  // ======================================================

  useEffect(() => {
    if (
      !user ||
      isAdmin
    ) {
      setUnreadNotificationCount(
        0
      );

      return;
    }

    const notificationsQuery =
      query(
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
                item.data()
                  .read !== true
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

          setUnreadNotificationCount(
            0
          );
        }
      );

    return () =>
      unsubscribe();
  }, [
    user,
    isAdmin,
  ]);

  // ======================================================
  // SEARCH
  // ======================================================

  const handleSearch = (
    event
  ) => {
    event.preventDefault();

    const value =
      searchText.trim();

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
  };

  // ======================================================
  // CART
  // ======================================================

  const openCart = () => {
    navigate("/cart");
  };

  // ======================================================
  // ACCOUNT
  // ======================================================

  const openAccount = () => {
    if (isAdmin) {
      navigate("/admin");
      return;
    }

    if (user) {
      navigate("/account");
    } else {
      navigate("/login");
    }
  };

  return (
    <header className="fixed top-0 z-50 w-full border-b border-[#6B1E1E]/10 bg-[#FFFCF8]/95 shadow-sm backdrop-blur-md">

      <div className="mx-auto flex h-[78px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">

        {/* ==================================================
            LOGO
        ================================================== */}

        <Link
          to="/"
          className="shrink-0"
        >
          <h1 className="text-xl font-bold tracking-wide text-[#6B1E1E] sm:text-2xl">
            हरि{" "}
            <span className="text-[#B8863B]">
              ॐ
            </span>
          </h1>

          <p className="text-[8px] font-semibold tracking-[0.28em] text-[#6B1E1E] sm:text-[10px]">
            FURNITURE HOUSE
          </p>
        </Link>

        {/* ==================================================
            DESKTOP NAV
        ================================================== */}

        <nav className="hidden items-center gap-6 lg:flex xl:gap-8">

          <Link
            to="/"
            className="text-sm font-medium text-gray-700 transition hover:text-[#8B2E2E]"
          >
            Home
          </Link>

          <Link
            to="/shop"
            className="text-sm font-medium text-gray-700 transition hover:text-[#8B2E2E]"
          >
            Shop
          </Link>

          <a
            href="/#categories"
            className="text-sm font-medium text-gray-700 transition hover:text-[#8B2E2E]"
          >
            Categories
          </a>

          <Link
            to="/custom-furniture"
            className="text-sm font-medium text-gray-700 transition hover:text-[#8B2E2E]"
          >
            Custom Furniture
          </Link>

          <a
            href="/#about"
            className="text-sm font-medium text-gray-700 transition hover:text-[#8B2E2E]"
          >
            About
          </a>

          <a
            href="/#contact"
            className="text-sm font-medium text-gray-700 transition hover:text-[#8B2E2E]"
          >
            Contact
          </a>

        </nav>

        {/* ==================================================
            ACTIONS
        ================================================== */}

        <div className="flex items-center gap-1 sm:gap-2">

          {/* SEARCH */}

          <button
            type="button"
            onClick={() =>
              setSearchOpen(
                true
              )
            }
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#6B1E1E] transition hover:bg-[#F8F1E7]"
            aria-label="Search"
          >
            <Search
              size={20}
            />
          </button>

          {/* CART */}

          <button
            type="button"
            onClick={
              openCart
            }
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#6B1E1E] transition hover:bg-[#F8F1E7]"
            aria-label="Shopping cart"
          >

            <ShoppingCart
              size={20}
            />

            {cartCount >
              0 && (
              <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#8B2E2E] px-1 text-[9px] font-bold text-white">
                {cartCount >
                99
                  ? "99+"
                  : cartCount}
              </span>
            )}

          </button>

          {/* WISHLIST */}

          {user &&
            !isAdmin && (
              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/account/wishlist"
                  )
                }
                className="relative hidden h-10 w-10 items-center justify-center rounded-full text-[#6B1E1E] transition hover:bg-[#F8F1E7] sm:flex"
                aria-label="Wishlist"
              >

                <Heart
                  size={19}
                />

                {wishlistCount >
                  0 && (
                  <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#8B2E2E] px-1 text-[9px] font-bold text-white">
                    {wishlistCount >
                    99
                      ? "99+"
                      : wishlistCount}
                  </span>
                )}

              </button>
            )}

          {/* NOTIFICATIONS */}

          {user &&
            !isAdmin && (
              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/account/notifications"
                  )
                }
                className="relative hidden h-10 w-10 items-center justify-center rounded-full text-[#6B1E1E] transition hover:bg-[#F8F1E7] sm:flex"
                aria-label="Notifications"
              >

                <Bell
                  size={19}
                />

                {unreadNotificationCount >
                  0 && (
                  <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#8B2E2E] px-1 text-[9px] font-bold text-white">
                    {unreadNotificationCount >
                    99
                      ? "99+"
                      : unreadNotificationCount}
                  </span>
                )}

              </button>
            )}

          {/* ACCOUNT */}

          <button
            type="button"
            onClick={
              openAccount
            }
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#6B1E1E]/15 text-[#6B1E1E] transition hover:bg-[#6B1E1E] hover:text-white"
            aria-label="Account"
          >
            {isAdmin ? (
              <User size={18} />
            ) : (
              <User size={18} />
            )}
          </button>

          {/* MOBILE MENU */}

          <button
            type="button"
            onClick={
              onMenuClick
            }
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6B1E1E] text-white transition hover:bg-[#8B2E2E] lg:hidden"
            aria-label="Open menu"
          >
            <Menu
              size={21}
            />
          </button>

        </div>

      </div>

      {/* ==================================================
          SEARCH PANEL
      ================================================== */}

      {searchOpen && (
        <div className="border-t border-[#6B1E1E]/10 bg-[#F8F1E7]">

          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">

            <form
              onSubmit={
                handleSearch
              }
              className="flex gap-2"
            >

              <div className="relative flex-1">

                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  autoFocus
                  type="text"
                  value={
                    searchText
                  }
                  onChange={(
                    event
                  ) =>
                    setSearchText(
                      event.target
                        .value
                    )
                  }
                  placeholder="Search sofas, beds, tables..."
                  className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-[#8B2E2E]"
                />

              </div>

              <button
                type="submit"
                className="flex items-center gap-2 rounded-lg bg-[#6B1E1E] px-5 py-3 text-sm font-semibold text-white hover:bg-[#8B2E2E]"
              >
                Search
                <ArrowRight
                  size={16}
                />
              </button>

              <button
                type="button"
                onClick={() => {
                  setSearchOpen(
                    false
                  );
                  setSearchText(
                    ""
                  );
                }}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white text-gray-500"
                aria-label="Close search"
              >
                <X
                  size={19}
                />
              </button>

            </form>

          </div>

        </div>
      )}

    </header>
  );
}

export default Navbar;