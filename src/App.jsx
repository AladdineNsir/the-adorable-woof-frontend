import React from "react";

import { Routes, Route, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { CartProvider, useCart } from "./context/CartContext";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import ScrollToTop from "./components/ScrollToTop";

//import PromoBanner from "./components/PromoBanner";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";

/* ================= WEBSITE ================= */

import Home from "./pages/Home";
import About from "./pages/About";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import ContactPage from "./pages/Contact";
import SizeGuide from "./pages/SizeGuide";
import OrderSuccess from "./pages/OrderSuccess";

/* ================= AUTH ================= */

import Login from "./pages/Login";
import Register from "./pages/Register";

/* ================= USER ================= */

import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import MyOrders from "./pages/MyOrders";
import OrderDetails from "./pages/OrderDetails";

/* ================= ADMIN ================= */

import Dashboard from "./admin/pages/Dashboard";
import AdminLayout from "./admin/layouts/AdminLayout";

import Products from "./admin/pages/Products";
import AddProduct from "./admin/pages/AddProduct";
import EditProduct from "./admin/pages/EditProduct";

import Categories from "./admin/pages/Categories";
import AddCategory from "./admin/pages/AddCategory";
import EditCategory from "./admin/pages/EditCategory";

import SubCategories from "./admin/pages/SubCategories";
import AddSubCategory from "./admin/pages/AddSubCategory";
import EditSubCategory from "./admin/pages/EditSubCategory";
import AdminOrders from "./admin/pages/Orders";
import AdminOrderDetails from "./admin/pages/OrderDetails";
import Clients from "./admin/pages/Clients";

const queryClient = new QueryClient();

const DummyPage = ({ title }) => (
  <div className="min-h-[70vh] flex items-center justify-center text-3xl font-bold">
    {title}
  </div>
);

function WebsiteLayout() {

  return (
    <>
      {/* <PromoBanner /> */}
      <Navbar />

      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />

     
    </>
  );
}
function AppRoutes() {
  return (
    <Routes>

      {/* ================= WEBSITE ================= */}

      <Route element={<WebsiteLayout />}>

        <Route path="/" element={<Home />} />

        <Route path="/shop" element={<Shop />} />

        <Route
          path="/product/:id"
          element={<ProductDetails />}
        />

        <Route
          path="/cart"
          element={<Cart />}
        />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/contact"
          element={<ContactPage />}
        />

        <Route
          path="/size-guide"
          element={<SizeGuide />}
        />

                  {/* Personalisation removed */}
        

        <Route
          path="/faq"
          element={
            <DummyPage title="FAQ" />
          }
        />

      </Route>

      {/* ================= AUTH ================= */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      {/* ================= CLIENT ================= */}

      <Route element={<ProtectedRoute />}>

        <Route
          path="/account"
          element={<Profile />}
        />

        <Route
          path="/account/edit"
          element={<EditProfile />}
        />

        <Route
          path="/account/orders"
          element={<MyOrders />}
        />

        <Route
          path="/account/orders/:id"
          element={<OrderDetails />}
        />

        <Route
          path="/checkout"
          element={<Checkout />}
        />

        <Route
          path="/order-success"
          element={<OrderSuccess />}
        />

        <Route
          path="/wishlist"
          element={
            <DummyPage title="Wishlist" />
          }
        />

      </Route>

      {/* ================= ADMIN ================= */}

      <Route element={<AdminRoute />}>

        <Route
          path="/admin"
          element={<AdminLayout />}
        >

          <Route
            index
            element={<Dashboard />}
          />

          <Route
            path="products"
            element={<Products />}
          />

          <Route
            path="products/add"
            element={<AddProduct />}
          />

          <Route
            path="products/edit/:id"
            element={<EditProduct />}
          />

          <Route
            path="categories"
            element={<Categories />}
          />

          <Route
            path="categories/add"
            element={<AddCategory />}
          />

          <Route
            path="categories/edit/:id"
            element={<EditCategory />}
          />

          <Route
            path="subcategories"
            element={<SubCategories />}
          />

          <Route
            path="subcategories/add"
            element={<AddSubCategory />}
          />

          <Route
            path="subcategories/edit/:id"
            element={<EditSubCategory />}
          />

          <Route path="orders" element={<AdminOrders />} />
          <Route path="orders/:id" element={<AdminOrderDetails />} />
          <Route path="clients" element={<Clients />} />

        </Route>

      </Route>
            {/* ================= 404 ================= */}

      <Route
        path="*"
        element={
          <DummyPage title="404 - Page introuvable" />
        }
      />

    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <div className="min-h-screen flex flex-col bg-velora-cream">

          <ScrollToTop />

          <AppRoutes />

          <Toaster
  position="bottom-left"
  toastOptions={{
    duration: 3000,
    style: {
      background: "#FFFFFF",
      color: "#111111",
      border: "1px solid #E7DED2",
      borderRadius: "4px",
      padding: "18px 20px",
      fontSize: "14px",
      fontWeight: "500",
      boxShadow: "0 18px 45px rgba(17,17,17,.08)",
    },

    success: {
      iconTheme: {
        primary: "#C89B5A",
        secondary: "#fff",
      },
    },

    error: {
      iconTheme: {
        primary: "#dc2626",
        secondary: "#fff",
      },
    },
  }}
/>
        </div>
      </CartProvider>
    </QueryClientProvider>
  );
}
