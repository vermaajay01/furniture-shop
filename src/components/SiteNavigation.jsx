import {
  useState,
} from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  MessageSquare,
  Bell,
  Gift,
  Settings,
  Globe,
  Heart,
  User,
  MapPin,
  LockKeyhole,
  LogIn,
  ShieldCheck,
  Home,
  Sofa,
  X,
  LogOut,
  ChevronRight,
} from "lucide-react";

import {
  useAuth,
} from "../context/AuthContext";

// ======================================================
// COMMON SIDEBAR
// ======================================================

function SiteNavigation({
  open = false,
  onClose,
  adminMode = false,
}) {
  const location =
    useLocation();

  const navigate =
    useNavigate();

  const {
    user,
    profile,
    role,
    logout,
  } = useAuth();

  const [loggingOut, setLoggingOut] =
    useState(false);

  // ======================================================
  // CLOSE
  // ======================================================

  const closeNavigation = () => {
    if (onClose) {
      onClose();
    }
  };

  // ======================================================
  // ACTIVE
  // ======================================================

  const isActive = (
    path
  ) => {
    if (path === "/") {
      return (
        location.pathname === "/"
      );
    }

    return (
      location.pathname === path ||
      location.pathname.startsWith(
        `${path}/`
      )
    );
  };

  // ======================================================
  // LOGOUT
  // ======================================================

  const handleLogout =
    async () => {
      if (loggingOut) {
        return;
      }

      try {
        setLoggingOut(true);

        await logout();

        closeNavigation();

        navigate("/");
      } catch (error) {
        console.error(
          "Logout failed:",
          error
        );
      } finally {
        setLoggingOut(false);
      }
    };

  // ======================================================
  // NAVIGATION LINK
  // ======================================================

  const NavigationLink = ({
    to,
    label,
    icon: Icon,
    end = false,
  }) => {
    const active = end
      ? location.pathname === to
      : isActive(to);

    return (
      <Link
        to={to}
        onClick={
          closeNavigation
        }
        className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
          active
            ? "bg-[#6B1E1E] text-white shadow-sm"
            : "text-gray-700 hover:bg-[#F8F1E7] hover:text-[#6B1E1E]"
        }`}
      >
        <Icon
          size={19}
          className={
            active
              ? "text-[#E7C98A]"
              : "text-[#8B2E2E] group-hover:text-[#6B1E1E]"
          }
        />

        <span className="flex-1">
          {label}
        </span>

        {active && (
          <ChevronRight
            size={15}
            className="text-[#E7C98A]"
          />
        )}
      </Link>
    );
  };

  // ======================================================
  // ADMIN MENU
  // ======================================================

  const AdminMenu = () => (
    <>
      <div className="px-4 pb-2 pt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#B8863B]">
        Management
      </div>

      <NavigationLink
        to="/admin"
        label="Dashboard"
        icon={LayoutDashboard}
        end
      />

      <NavigationLink
        to="/admin/customers"
        label="Customers"
        icon={Users}
      />

      <NavigationLink
        to="/admin/products"
        label="Products"
        icon={Package}
      />

      <NavigationLink
        to="/admin/products/add"
        label="Add Product"
        icon={Sofa}
      />

      <NavigationLink
        to="/admin/orders"
        label="Orders"
        icon={ShoppingCart}
      />

      <NavigationLink
        to="/admin/requests"
        label="Custom Requests"
        icon={MessageSquare}
      />

      <NavigationLink
        to="/admin/notifications"
        label="Notifications"
        icon={Bell}
      />

      <NavigationLink
        to="/admin/offers"
        label="Offers"
        icon={Gift}
      />

      <div className="px-4 pb-2 pt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#B8863B]">
        Website
      </div>

      <NavigationLink
        to="/"
        label="View Website"
        icon={Globe}
        end
      />

      <NavigationLink
        to="/admin/settings"
        label="Website Settings"
        icon={Settings}
      />
    </>
  );

  // ======================================================
  // CUSTOMER MENU
  // ======================================================

  const CustomerMenu = () => (
    <>
      <div className="px-4 pb-2 pt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#B8863B]">
        Shop
      </div>

      <NavigationLink
        to="/"
        label="Home"
        icon={Home}
        end
      />

      <NavigationLink
        to="/shop"
        label="Products"
        icon={Package}
      />

      <NavigationLink
        to="/custom-furniture"
        label="Custom Furniture"
        icon={Sofa}
      />

      <div className="px-4 pb-2 pt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#B8863B]">
        My Account
      </div>

      <NavigationLink
        to="/account"
        label="My Account"
        icon={User}
      />

      <NavigationLink
        to="/account/orders"
        label="My Orders"
        icon={ShoppingCart}
      />

      <NavigationLink
        to="/account/wishlist"
        label="Wishlist"
        icon={Heart}
      />

      <NavigationLink
        to="/account/notifications"
        label="Notifications"
        icon={Bell}
      />

      <NavigationLink
        to="/account/addresses"
        label="Addresses"
        icon={MapPin}
      />

      <NavigationLink
        to="/account/change-password"
        label="Change Password"
        icon={LockKeyhole}
      />
    </>
  );

  // ======================================================
  // GUEST MENU
  // ======================================================

  const GuestMenu = () => (
    <>
      <div className="px-4 pb-2 pt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#B8863B]">
        Shop
      </div>

      <NavigationLink
        to="/"
        label="Home"
        icon={Home}
        end
      />

      <NavigationLink
        to="/shop"
        label="Products"
        icon={Package}
      />

      <NavigationLink
        to="/custom-furniture"
        label="Custom Furniture"
        icon={Sofa}
      />

      <div className="px-4 pb-2 pt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#B8863B]">
        Account
      </div>

      <NavigationLink
        to="/login"
        label="Customer Login"
        icon={LogIn}
      />

      <NavigationLink
        to="/signup"
        label="Create Account"
        icon={User}
      />
    </>
  );

  // ======================================================
  // ADMIN LOGIN
  // ======================================================

  const AdminLoginButton = () => {
    if (
      role === "admin" ||
      adminMode
    ) {
      return null;
    }

    return (
      <Link
        to="/admin"
        onClick={
          closeNavigation
        }
        className="mt-3 flex items-center gap-3 rounded-xl border border-[#6B1E1E]/15 bg-white px-4 py-3 text-sm font-semibold text-[#6B1E1E] transition hover:border-[#8B2E2E] hover:bg-[#F8F1E7]"
      >
        <ShieldCheck
          size={18}
        />

        <span className="flex-1">
          Admin Login
        </span>

        <ChevronRight
          size={15}
        />
      </Link>
    );
  };

  // ======================================================
  // SIDEBAR CONTENT
  // ======================================================

  const SidebarContent = () => (
    <div className="flex h-full flex-col">

      {/* ==================================================
          SIDEBAR HEADER
      ================================================== */}

      <div className="flex items-center justify-between border-b border-[#6B1E1E]/10 px-5 py-5">

        <Link
          to="/"
          onClick={
            closeNavigation
          }
          className="min-w-0"
        >
          <h1 className="text-2xl font-bold tracking-wide text-[#6B1E1E]">
            हरि{" "}
            <span className="text-[#B8863B]">
              ॐ
            </span>
          </h1>

          <p className="text-[9px] font-semibold tracking-[0.28em] text-[#6B1E1E]">
            FURNITURE HOUSE
          </p>
        </Link>

        {/* CLOSE BUTTON — DESKTOP + MOBILE */}

        <button
          type="button"
          onClick={
            closeNavigation
          }
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-500 transition hover:bg-[#F8F1E7] hover:text-[#6B1E1E]"
          aria-label="Close navigation"
          title="Close sidebar"
        >
          <X size={21} />
        </button>

      </div>

      {/* ==================================================
          USER
      ================================================== */}

      {user && (
        <div className="border-b border-[#6B1E1E]/10 px-5 py-4">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F1E2D3] font-bold text-[#6B1E1E]">
              {(
                profile?.name ||
                user.displayName ||
                user.email ||
                "U"
              )
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="min-w-0">

              <p className="truncate text-sm font-semibold text-[#2B1714]">
                {profile?.name ||
                  user.displayName ||
                  (role === "admin"
                    ? "Administrator"
                    : "Customer")}
              </p>

              <p className="truncate text-xs text-gray-400">
                {role === "admin"
                  ? "Administrator"
                  : user.email}
              </p>

            </div>

          </div>

        </div>
      )}

      {/* ==================================================
          MENU
      ================================================== */}

      <div className="flex-1 overflow-y-auto px-3 py-4">

        <div className="space-y-1">

          {role === "admin" ? (
            <AdminMenu />
          ) : role === "customer" ? (
            <CustomerMenu />
          ) : (
            <GuestMenu />
          )}

        </div>

      </div>

      {/* ==================================================
          BOTTOM
      ================================================== */}

      <div className="border-t border-[#6B1E1E]/10 px-3 py-4">

        <AdminLoginButton />

        {user && (
          <button
            type="button"
            onClick={
              handleLogout
            }
            disabled={
              loggingOut
            }
            className="mt-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-600 transition hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
          >
            <LogOut
              size={18}
            />

            {loggingOut
              ? "Logging out..."
              : "Logout"}
          </button>
        )}

      </div>

    </div>
  );

  // ======================================================
  // SIDEBAR
  // ======================================================

  return (
    <>
      {/* ==================================================
          BACKDROP
      ================================================== */}

      {open && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={
            closeNavigation
          }
          className="fixed inset-0 z-[99] bg-black/40"
        />
      )}

      {/* ==================================================
          DESKTOP SIDEBAR
      ================================================== */}

      <aside
        className={`fixed left-0 top-0 z-[100] h-screen w-[280px] border-r border-[#6B1E1E]/10 bg-[#FFFCF8] shadow-2xl transition-transform duration-300 ${
          open
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </aside>
    </>
  );
}

export default SiteNavigation;