import { useEffect, useState } from "react";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  LayoutDashboard,
  Package,
  Plus,
  MessageSquare,
  Bell,
  Globe,
  LogOut,
  Menu,
  X,
  ShoppingCart,
  Settings,
  Tag,
  Users,
} from "lucide-react";

import {
  collection,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../firebase/firebase";
import { adminLogout } from "../firebase/auth";
import NotificationBell from "../components/NotificationBell";

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [requestCount, setRequestCount] =
    useState(0);

  const [newOrderCount, setNewOrderCount] =
    useState(0);

  // ======================================================
  // CUSTOM REQUEST COUNT
  // ======================================================

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "customRequests"),
      (snapshot) => {
        setRequestCount(snapshot.size);
      },
      (error) => {
        console.error(
          "Custom request count error:",
          error
        );
      }
    );

    return () => unsubscribe();
  }, []);

  // ======================================================
  // NEW ORDER COUNT
  // ======================================================

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "orders"),
      (snapshot) => {
        let count = 0;

        snapshot.docs.forEach((item) => {
          const order = item.data();

          if (
            !order.status ||
            order.status === "new"
          ) {
            count++;
          }
        });

        setNewOrderCount(count);
      },
      (error) => {
        console.error(
          "Order count error:",
          error
        );
      }
    );

    return () => unsubscribe();
  }, []);

  // ======================================================
  // CLOSE MOBILE SIDEBAR AFTER NAVIGATION
  // ======================================================

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // ======================================================
  // LOGOUT
  // ======================================================

  const handleLogout = async () => {
    try {
      await adminLogout();
      navigate("/admin");
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );
    }
  };

  // ======================================================
  // CHECK ACTIVE ROUTE
  // ======================================================

  const isActive = (path) => {
    if (path === "/admin/dashboard") {
      return (
        location.pathname ===
        "/admin/dashboard"
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
  // SIDEBAR LINK
  // ======================================================

  const SidebarLink = ({
    to,
    icon: Icon,
    children,
    badge = 0,
  }) => {
    const active = isActive(to);

    return (
      <Link
        to={to}
        className={`group flex items-center justify-between rounded-md px-4 py-3 text-sm font-medium transition-all duration-200 ${
          active
            ? "bg-[#6B1E1E] text-white shadow-sm"
            : "text-[#6B1E1E] hover:bg-[#6B1E1E]/10"
        }`}
      >
        <span className="flex items-center gap-3">
          <Icon
            size={19}
            className={
              active
                ? "text-white"
                : "text-[#6B1E1E]"
            }
          />

          {children}
        </span>

        {badge > 0 && (
          <span
            className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold ${
              active
                ? "bg-white text-[#6B1E1E]"
                : "bg-[#B8863B] text-white"
            }`}
          >
            {badge > 99
              ? "99+"
              : badge}
          </span>
        )}
      </Link>
    );
  };

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <div className="min-h-screen bg-[#F8F1E7]">

      {/* ==================================================
          MOBILE OVERLAY
      ================================================== */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

      {/* ==================================================
          STATIC ADMIN SIDEBAR
      ================================================== */}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-[#6B1E1E]/15 bg-[#F8F1E7] shadow-sm transition-transform duration-300 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        } lg:translate-x-0`}
      >

        {/* ==================================================
            LOGO
        ================================================== */}

        <div className="border-b border-[#6B1E1E]/15 px-6 py-6">

          <div className="flex items-start justify-between">

            <Link to="/admin/dashboard">

              <h1 className="text-2xl font-bold tracking-wide text-[#6B1E1E]">
                हरि{" "}
                <span className="text-[#B8863B]">
                  ॐ
                </span>
              </h1>

              <p className="text-[10px] font-medium tracking-[0.35em] text-[#6B1E1E]">
                FURNITURE HOUSE
              </p>

              <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#B8863B]">
                Admin Panel
              </p>

            </Link>

            {/* MOBILE CLOSE */}

            <button
              type="button"
              onClick={() =>
                setSidebarOpen(false)
              }
              className="rounded-full p-1 text-[#6B1E1E] hover:bg-[#6B1E1E]/10 lg:hidden"
              aria-label="Close admin menu"
            >
              <X size={21} />
            </button>

          </div>

        </div>

        {/* ==================================================
            SIDEBAR NAVIGATION
        ================================================== */}

        <nav className="flex-1 overflow-y-auto px-3 py-6">

          {/* MANAGEMENT */}

          <p className="mb-3 px-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#B8863B]">
            Management
          </p>

          <div className="space-y-1">

            {/* DASHBOARD */}

            <SidebarLink
              to="/admin/dashboard"
              icon={LayoutDashboard}
            >
              Dashboard
            </SidebarLink>

            {/* CUSTOMERS */}

            <SidebarLink
              to="/admin/customers"
              icon={Users}
            >
              Customers
            </SidebarLink>

            {/* PRODUCTS */}

            <SidebarLink
              to="/admin/products"
              icon={Package}
            >
              Products
            </SidebarLink>

            {/* ADD PRODUCT */}

            <SidebarLink
              to="/admin/products/add"
              icon={Plus}
            >
              Add Product
            </SidebarLink>

            {/* ORDERS */}

            <SidebarLink
              to="/admin/orders"
              icon={ShoppingCart}
              badge={newOrderCount}
            >
              Orders
            </SidebarLink>

            {/* CUSTOM REQUESTS */}

            <SidebarLink
              to="/admin/requests"
              icon={MessageSquare}
              badge={requestCount}
            >
              Custom Requests
            </SidebarLink>

            {/* NOTIFICATIONS */}

            <SidebarLink
              to="/admin/notifications"
              icon={Bell}
            >
              Notifications
            </SidebarLink>

            {/* ==================================================
                OFFERS - NEW
            ================================================== */}

            <SidebarLink
              to="/admin/offers"
              icon={Tag}
            >
              Offers
            </SidebarLink>

          </div>

          {/* WEBSITE */}

          <p className="mb-3 mt-8 px-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#B8863B]">
            Website
          </p>

          <div className="space-y-1">

            {/* VIEW WEBSITE */}

            <SidebarLink
              to="/"
              icon={Globe}
            >
              View Website
            </SidebarLink>

            {/* WEBSITE SETTINGS */}

            <SidebarLink
              to="/admin/settings"
              icon={Settings}
            >
              Website Settings
            </SidebarLink>

          </div>

        </nav>

        {/* ==================================================
            LOGOUT
        ================================================== */}

        <div className="border-t border-[#6B1E1E]/15 p-3">

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-md px-4 py-3 text-sm font-medium text-[#6B1E1E] transition hover:bg-[#6B1E1E]/10"
          >
            <LogOut size={19} />

            Logout

          </button>

        </div>

      </aside>

      {/* ==================================================
          MAIN AREA
      ================================================== */}

      <div className="lg:pl-64">

        {/* ==================================================
            MOBILE TOP BAR
        ================================================== */}

        <header className="sticky top-0 z-30 border-b border-[#6B1E1E]/15 bg-[#F8F1E7]/95 px-5 py-4 shadow-sm backdrop-blur-md lg:hidden">

          <div className="flex items-center justify-between">

            {/* MENU */}

            <button
              type="button"
              onClick={() =>
                setSidebarOpen(true)
              }
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#6B1E1E] hover:bg-[#6B1E1E]/10"
              aria-label="Open admin menu"
            >
              <Menu size={23} />
            </button>

            {/* LOGO */}

            <Link to="/admin/dashboard">

              <h1 className="text-xl font-bold text-[#6B1E1E]">
                हरि{" "}
                <span className="text-[#B8863B]">
                  ॐ
                </span>
              </h1>

              <p className="text-center text-[8px] font-medium tracking-[0.3em] text-[#6B1E1E]">
                FURNITURE HOUSE
              </p>

            </Link>

            {/* NOTIFICATIONS */}

            <NotificationBell />

          </div>

        </header>

        {/* ==================================================
            DESKTOP ADMIN HEADER
        ================================================== */}

        <header className="hidden items-center justify-between border-b border-[#6B1E1E]/15 bg-[#F8F1E7] px-8 py-5 lg:flex">

          <div>

            <p className="text-xs uppercase tracking-[0.3em] text-[#B8863B]">
              Hari Om Furniture House
            </p>

            <h2 className="mt-1 text-xl font-bold text-[#6B1E1E]">
              Admin Panel
            </h2>

          </div>

          <div className="flex items-center gap-4">

            <NotificationBell />

            <Link
              to="/admin/settings"
              title="Website Settings"
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#6B1E1E] transition hover:bg-[#6B1E1E]/10"
            >
              <Settings size={20} />
            </Link>

          </div>

        </header>

        {/* ==================================================
            PAGE CONTENT
        ================================================== */}

        <main className="min-h-screen">

          <div className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-10">

            <Outlet />

          </div>

        </main>

      </div>

    </div>
  );
}

export default AdminLayout;