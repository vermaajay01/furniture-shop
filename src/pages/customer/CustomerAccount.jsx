import {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  User,
  Package,
  Heart,
  Bell,
  MapPin,
  Lock,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

import {
  useAuth,
} from "../../context/AuthContext";

function CustomerAccount() {
  const navigate = useNavigate();

  const {
    user,
    profile,
    logout,
  } = useAuth();

  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(false);

  // ======================================================
  // LOGOUT
  // ======================================================

  const handleLogout = async () => {
    try {
      await logout();

      navigate("/", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Logout failed:",
        error
      );
    }
  };

  // ======================================================
  // SIDEBAR ITEMS
  // ======================================================

  const menuItems = [
    {
      label: "My Account",
      icon: User,
      path: "/account",
    },
    {
      label: "My Orders",
      icon: Package,
      path: "/account/orders",
    },
    {
      label: "Wishlist",
      icon: Heart,
      path: "/account/wishlist",
    },
    {
      label: "Notifications",
      icon: Bell,
      path: "/account/notifications",
    },
    {
      label: "Addresses",
      icon: MapPin,
      path: "/account/addresses",
    },
    {
      label: "Change Password",
      icon: Lock,
      path: "/account/password",
    },
  ];

  // ======================================================
  // NOT LOGGED IN
  // ======================================================

  if (!user) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#F8F1E7] px-4">
        <div className="w-full max-w-md bg-white p-8 text-center shadow-lg">

          <User
            size={48}
            className="mx-auto text-[#6B1E1E]"
          />

          <h1 className="mt-5 text-2xl font-bold text-[#6B1E1E]">
            Login Required
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Please login to access your account.
          </p>

          <Link
            to="/login"
            className="mt-6 inline-flex rounded-lg bg-[#6B1E1E] px-6 py-3 font-semibold text-white transition hover:bg-[#8B2E2E]"
          >
            Login
          </Link>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[75vh] bg-[#F8F1E7]">

      {/* ==================================================
          MOBILE SIDEBAR BUTTON
      ================================================== */}

      <div className="border-b border-[#6B1E1E]/10 bg-white px-4 py-3 lg:hidden">

        <button
          type="button"
          onClick={() =>
            setSidebarOpen(true)
          }
          className="flex items-center gap-3 font-semibold text-[#6B1E1E]"
        >
          <Menu size={21} />
          My Account
        </button>

      </div>

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">

        {/* ==================================================
            SIDEBAR
        ================================================== */}

        <aside
          className={`
            fixed inset-y-0 left-0 z-[100]
            w-72 transform bg-white shadow-2xl
            transition-transform duration-300
            lg:static lg:z-auto lg:w-72
            lg:translate-x-0 lg:shadow-sm
            ${
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full"
            }
          `}
        >

          {/* MOBILE CLOSE */}

          <div className="flex items-center justify-between border-b border-gray-100 p-5 lg:hidden">

            <span className="font-bold text-[#6B1E1E]">
              My Account
            </span>

            <button
              type="button"
              onClick={() =>
                setSidebarOpen(false)
              }
              aria-label="Close account menu"
            >
              <X size={22} />
            </button>

          </div>

          {/* PROFILE HEADER */}

          <div className="border-b border-gray-100 p-6">

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F5E4E4] text-[#6B1E1E]">
              <User size={28} />
            </div>

            <h2 className="mt-4 font-bold text-[#6B1E1E]">
              {profile?.name ||
                user.displayName ||
                "Customer"}
            </h2>

            <p className="mt-1 truncate text-xs text-gray-500">
              {profile?.email ||
                user.email}
            </p>

          </div>

          {/* MENU */}

          <nav className="p-3">

            {menuItems.map(
              (item) => {
                const Icon =
                  item.icon;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() =>
                      setSidebarOpen(false)
                    }
                    className="mb-1 flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-[#F8F1E7] hover:text-[#6B1E1E]"
                  >

                    <span className="flex items-center gap-3">

                      <Icon
                        size={19}
                      />

                      {item.label}

                    </span>

                    <ChevronRight
                      size={16}
                      className="text-gray-400"
                    />

                  </Link>
                );
              }
            )}

            {/* LOGOUT */}

            <button
              type="button"
              onClick={handleLogout}
              className="mt-4 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
            >
              <LogOut
                size={19}
              />

              Logout
            </button>

          </nav>

        </aside>

        {/* ==================================================
            MOBILE BACKDROP
        ================================================== */}

        {sidebarOpen && (
          <button
            type="button"
            aria-label="Close account menu"
            onClick={() =>
              setSidebarOpen(false)
            }
            className="fixed inset-0 z-[90] bg-black/40 lg:hidden"
          />
        )}

        {/* ==================================================
            ACCOUNT CONTENT
        ================================================== */}

        <main className="min-w-0 flex-1">

          <div className="bg-white p-6 shadow-sm sm:p-8">

            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#B8863B]">
              Customer Account
            </p>

            <h1 className="mt-2 text-3xl font-bold text-[#6B1E1E]">
              Welcome,{" "}
              {profile?.name ||
                user.displayName ||
                "Customer"}
            </h1>

            <p className="mt-2 text-gray-500">
              Manage your account, orders,
              wishlist and preferences.
            </p>

          </div>

          {/* ==================================================
              PROFILE
          ================================================== */}

          <div className="mt-6 grid gap-5 sm:grid-cols-2">

            <div className="bg-white p-6 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="rounded-lg bg-[#F5E4E4] p-3 text-[#6B1E1E]">
                  <User size={21} />
                </div>

                <h2 className="font-bold text-[#6B1E1E]">
                  Personal Information
                </h2>

              </div>

              <div className="mt-5 space-y-3 text-sm">

                <div>
                  <p className="text-gray-400">
                    Name
                  </p>

                  <p className="font-medium text-gray-700">
                    {profile?.name ||
                      user.displayName ||
                      "—"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400">
                    Email
                  </p>

                  <p className="break-all font-medium text-gray-700">
                    {profile?.email ||
                      user.email ||
                      "—"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400">
                    Mobile
                  </p>

                  <p className="font-medium text-gray-700">
                    {profile?.mobile ||
                      "—"}
                  </p>
                </div>

              </div>

            </div>

            {/* ==================================================
                QUICK LINKS
            ================================================== */}

            <div className="bg-white p-6 shadow-sm">

              <h2 className="font-bold text-[#6B1E1E]">
                Quick Access
              </h2>

              <div className="mt-4 space-y-2">

                <Link
                  to="/account/orders"
                  className="flex items-center justify-between rounded-lg border border-gray-100 p-3 text-sm font-medium text-gray-600 transition hover:border-[#6B1E1E]/20 hover:bg-[#F8F1E7]"
                >
                  <span className="flex items-center gap-3">
                    <Package size={18} />
                    My Orders
                  </span>

                  <ChevronRight size={17} />
                </Link>

                <Link
                  to="/account/wishlist"
                  className="flex items-center justify-between rounded-lg border border-gray-100 p-3 text-sm font-medium text-gray-600 transition hover:border-[#6B1E1E]/20 hover:bg-[#F8F1E7]"
                >
                  <span className="flex items-center gap-3">
                    <Heart size={18} />
                    Wishlist
                  </span>

                  <ChevronRight size={17} />
                </Link>

                <Link
                  to="/account/notifications"
                  className="flex items-center justify-between rounded-lg border border-gray-100 p-3 text-sm font-medium text-gray-600 transition hover:border-[#6B1E1E]/20 hover:bg-[#F8F1E7]"
                >
                  <span className="flex items-center gap-3">
                    <Bell size={18} />
                    Notifications
                  </span>

                  <ChevronRight size={17} />
                </Link>

              </div>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}

export default CustomerAccount;