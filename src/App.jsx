import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

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
import AdminProducts from "./pages/admin/AdminProducts";
import AddProduct from "./pages/admin/AddProduct";
import EditProduct from "./pages/admin/EditProduct";
import AdminRequests from "./pages/admin/AdminRequests";
import AdminOrders from "./pages/admin/AdminOrders";
import Notifications from "./pages/admin/Notifications";
import WebsiteSettings from "./pages/admin/WebsiteSettings";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* ==================================================
            CUSTOMER WEBSITE
            MainLayout contains Header + Footer
        ================================================== */}

        <Route element={<MainLayout />}>

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/shop"
            element={<Shop />}
          />

          <Route
            path="/product/:id"
            element={<ProductDetails />}
          />

          <Route
            path="/custom-furniture"
            element={<CustomFurniture />}
          />

          <Route
            path="/cart"
            element={<Cart />}
          />

        </Route>

        {/* ==================================================
            ADMIN LOGIN
            NO ADMIN SIDEBAR
        ================================================== */}

        <Route
          path="/admin"
          element={<AdminLogin />}
        />

        {/* ==================================================
            ADMIN AREA
            AdminLayout provides the fixed sidebar
        ================================================== */}

        <Route element={<AdminLayout />}>

          {/* DASHBOARD */}

          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          />

          {/* PRODUCTS */}

          <Route
            path="/admin/products"
            element={<AdminProducts />}
          />

          {/* ADD PRODUCT */}

          <Route
            path="/admin/products/add"
            element={<AddProduct />}
          />

          {/* EDIT PRODUCT */}

          <Route
            path="/admin/products/edit/:id"
            element={<EditProduct />}
          />

          {/* ORDERS */}

          <Route
            path="/admin/orders"
            element={<AdminOrders />}
          />

          {/* CUSTOM REQUESTS */}

          <Route
            path="/admin/requests"
            element={<AdminRequests />}
          />

          {/* NOTIFICATIONS */}

          <Route
            path="/admin/notifications"
            element={<Notifications />}
          />

          {/* WEBSITE SETTINGS */}

          <Route
            path="/admin/settings"
            element={<WebsiteSettings />}
          />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;