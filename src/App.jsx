import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

// ======================================================
// GLOBAL
// ======================================================

import ScrollToTop from "./components/ScrollToTop";

import {
  ThemeProvider,
} from "./context/ThemeContext";

import {
  AuthProvider,
} from "./context/AuthContext";

import {
  WishlistProvider,
} from "./context/WishlistContext";

// ======================================================
// CUSTOMER AUTHENTICATION
// ======================================================

import CustomerLogin from "./pages/customer/CustomerLogin";
import CustomerSignup from "./pages/customer/CustomerSignup";
import CustomerAccount from "./pages/customer/CustomerAccount";
import CustomerProfile from "./pages/customer/CustomerProfile";
import MyOrders from "./pages/customer/MyOrders";
import Wishlist from "./pages/customer/Wishlist";
import CustomerNotifications from "./pages/customer/CustomerNotifications";
import Addresses from "./pages/customer/Addresses";
import ChangePassword from "./pages/customer/ChangePassword";

// ======================================================
// CUSTOMER PAGES
// ======================================================

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import CustomFurniture from "./pages/CustomFurniture";
import Cart from "./pages/Cart";

// ======================================================
// CUSTOMER LAYOUT
// ======================================================

import MainLayout from "./layouts/MainLayout";

// ======================================================
// ADMIN LAYOUT
// ======================================================

import AdminLayout from "./layouts/AdminLayout";

// ======================================================
// ADMIN PAGES
// ======================================================

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminProducts from "./pages/admin/AdminProducts";
import AddProduct from "./pages/admin/AddProduct";
import EditProduct from "./pages/admin/EditProduct";
import AdminRequests from "./pages/admin/AdminRequests";
import AdminOrders from "./pages/admin/AdminOrders";
import Notifications from "./pages/admin/Notifications";
import WebsiteSettings from "./pages/admin/WebsiteSettings";

// ======================================================
// OFFERS
// ======================================================

import Offers from "./pages/admin/Offers";

function App() {
  return (
    <ThemeProvider>

      {/* ==================================================
          CUSTOMER AUTHENTICATION PROVIDER
      ================================================== */}

      <AuthProvider>

        {/* ==================================================
            WISHLIST PROVIDER
        ================================================== */}

        <WishlistProvider>

          <BrowserRouter>

            {/* ==================================================
                SCROLL TO TOP ON EVERY ROUTE CHANGE
            ================================================== */}

            <ScrollToTop />

            <Routes>

              {/* ==================================================
                  CUSTOMER WEBSITE
                  MainLayout contains Header + Footer
              ================================================== */}

              <Route
                element={
                  <MainLayout />
                }
              >

                {/* ==================================================
                    HOME
                ================================================== */}

                <Route
                  path="/"
                  element={
                    <Home />
                  }
                />

                {/* ==================================================
                    SHOP
                ================================================== */}

                <Route
                  path="/shop"
                  element={
                    <Shop />
                  }
                />

                {/* ==================================================
                    PRODUCT DETAILS
                ================================================== */}

                <Route
                  path="/product/:id"
                  element={
                    <ProductDetails />
                  }
                />

                {/* ==================================================
                    CUSTOM FURNITURE
                ================================================== */}

                <Route
                  path="/custom-furniture"
                  element={
                    <CustomFurniture />
                  }
                />

                {/* ==================================================
                    CART
                ================================================== */}

                <Route
                  path="/cart"
                  element={
                    <Cart />
                  }
                />

                {/* ==================================================
                    CUSTOMER LOGIN
                ================================================== */}

                <Route
                  path="/login"
                  element={
                    <CustomerLogin />
                  }
                />

                {/* ==================================================
                    CUSTOMER SIGNUP
                ================================================== */}

                <Route
                  path="/signup"
                  element={
                    <CustomerSignup />
                  }
                />

                {/* ==================================================
                    CUSTOMER ACCOUNT
                ================================================== */}

                <Route
                  path="/account"
                  element={
                    <CustomerAccount />
                  }
                />

                {/* ==================================================
                    CUSTOMER MY ORDERS
                ================================================== */}

                <Route
                  path="/account/orders"
                  element={
                    <MyOrders />
                  }
                />

                {/* ==================================================
                    CUSTOMER WISHLIST
                ================================================== */}

                <Route
                  path="/account/wishlist"
                  element={
                    <Wishlist />
                  }
                />

                {/* CUSTOMER NOTIFICATIONS */}

                <Route
                  path="/account/notifications"
                  element={
                    <CustomerNotifications />
                  }
                />

                {/* CUSTOMER ADDRESSES */}

                <Route
                  path="/account/addresses"
                  element={
                    <Addresses />
                  }
                />

                {/* CUSTOMER PROFILE */}

                <Route
                  path="/account/profile"
                  element={
                    <CustomerProfile />
                  }
                />

                {/* CUSTOMER CHANGE PASSWORD */}

                <Route
                  path="/account/password"
                  element={
                    <ChangePassword />
                  }
                />

              </Route>

              {/* ==================================================
                  ADMIN LOGIN
                  NO SIDEBAR
              ================================================== */}

              <Route
                path="/admin"
                element={
                  <AdminLogin />
                }
              />

              {/* ==================================================
                  ADMIN AREA
                  AdminLayout provides static sidebar
              ================================================== */}

              <Route
                element={
                  <AdminLayout />
                }
              >

                {/* ==================================================
                    DASHBOARD
                ================================================== */}

                <Route
                  path="/admin/dashboard"
                  element={
                    <AdminDashboard />
                  }
                />

                {/* ADMIN CUSTOMERS */}

                <Route
                  path="/admin/customers"
                  element={
                    <AdminCustomers />
                  }
                />

                {/* ==================================================
                    PRODUCTS
                ================================================== */}

                <Route
                  path="/admin/products"
                  element={
                    <AdminProducts />
                  }
                />

                {/* ==================================================
                    ADD PRODUCT
                ================================================== */}

                <Route
                  path="/admin/products/add"
                  element={
                    <AddProduct />
                  }
                />

                {/* ==================================================
                    EDIT PRODUCT
                ================================================== */}

                <Route
                  path="/admin/products/edit/:id"
                  element={
                    <EditProduct />
                  }
                />

                {/* ==================================================
                    ORDERS
                ================================================== */}

                <Route
                  path="/admin/orders"
                  element={
                    <AdminOrders />
                  }
                />

                {/* ==================================================
                    CUSTOM REQUESTS
                ================================================== */}

                <Route
                  path="/admin/requests"
                  element={
                    <AdminRequests />
                  }
                />

                {/* ==================================================
                    NOTIFICATIONS
                ================================================== */}

                <Route
                  path="/admin/notifications"
                  element={
                    <Notifications />
                  }
                />

                {/* ==================================================
                    OFFERS
                ================================================== */}

                <Route
                  path="/admin/offers"
                  element={
                    <Offers />
                  }
                />

                {/* ==================================================
                    WEBSITE SETTINGS
                ================================================== */}

                <Route
                  path="/admin/settings"
                  element={
                    <WebsiteSettings />
                  }
                />

              </Route>

            </Routes>

          </BrowserRouter>

        </WishlistProvider>

      </AuthProvider>

    </ThemeProvider>
  );
}

export default App;