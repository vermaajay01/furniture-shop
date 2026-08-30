import {
  Link,
} from "react-router-dom";

import {
  User,
  Package,
  Heart,
  Bell,
  ChevronRight,
} from "lucide-react";

import {
  useAuth,
} from "../../context/AuthContext";

function CustomerAccount() {
  const {
    user,
    profile,
  } = useAuth();

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

  // ======================================================
  // ACCOUNT
  // ======================================================

  return (
    <div className="min-h-[75vh] bg-[#F8F1E7]">

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        <main className="min-w-0">

          {/* ==================================================
              HEADER
          ================================================== */}

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
              PROFILE + QUICK LINKS
          ================================================== */}

          <div className="mt-6 grid gap-5 sm:grid-cols-2">

            {/* ==================================================
                PERSONAL INFORMATION
            ================================================== */}

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

                {/* NAME */}

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

                {/* EMAIL */}

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

                {/* MOBILE */}

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
                QUICK ACCESS
            ================================================== */}

            <div className="bg-white p-6 shadow-sm">

              <h2 className="font-bold text-[#6B1E1E]">
                Quick Access
              </h2>

              <div className="mt-4 space-y-2">

                {/* ORDERS */}

                <Link
                  to="/account/orders"
                  className="flex items-center justify-between rounded-lg border border-gray-100 p-3 text-sm font-medium text-gray-600 transition hover:border-[#6B1E1E]/20 hover:bg-[#F8F1E7]"
                >

                  <span className="flex items-center gap-3">

                    <Package
                      size={18}
                    />

                    My Orders

                  </span>

                  <ChevronRight
                    size={17}
                  />

                </Link>

                {/* WISHLIST */}

                <Link
                  to="/account/wishlist"
                  className="flex items-center justify-between rounded-lg border border-gray-100 p-3 text-sm font-medium text-gray-600 transition hover:border-[#6B1E1E]/20 hover:bg-[#F8F1E7]"
                >

                  <span className="flex items-center gap-3">

                    <Heart
                      size={18}
                    />

                    Wishlist

                  </span>

                  <ChevronRight
                    size={17}
                  />

                </Link>

                {/* NOTIFICATIONS */}

                <Link
                  to="/account/notifications"
                  className="flex items-center justify-between rounded-lg border border-gray-100 p-3 text-sm font-medium text-gray-600 transition hover:border-[#6B1E1E]/20 hover:bg-[#F8F1E7]"
                >

                  <span className="flex items-center gap-3">

                    <Bell
                      size={18}
                    />

                    Notifications

                  </span>

                  <ChevronRight
                    size={17}
                  />

                </Link>

                {/* ADDRESSES */}

                <Link
                  to="/account/addresses"
                  className="flex items-center justify-between rounded-lg border border-gray-100 p-3 text-sm font-medium text-gray-600 transition hover:border-[#6B1E1E]/20 hover:bg-[#F8F1E7]"
                >

                  <span className="flex items-center gap-3">

                    <User
                      size={18}
                    />

                    Addresses

                  </span>

                  <ChevronRight
                    size={17}
                  />

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