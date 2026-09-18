import { lazy, Suspense } from "react";

import { Routes, Route, Outlet, useParams } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { CartProvider } from "./context/CartContext";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import ScrollToTop from "./components/ScrollToTop";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Dashboard from "./admin/pages/Dashboard";
import ProductDetails from "./pages/ProductDetails";
import { Toaster } from "react-hot-toast";
import { Navigate } from "react-router-dom";
import SEO from "./components/SEO";
import AnalyticsProvider from "./analytics/AnalyticsProvider";
import WhatsAppButton from "./components/WhatsAppButton";
import { prefetchRoute } from "./config/routePreloads";
import { PageSkeleton } from "./components/LoadingSkeleton";

/* ================= WEBSITE ================= */

const Home = lazy(() => { prefetchRoute("/"); return import("./pages/Home"); });
const About = lazy(() => { prefetchRoute("/about"); return import("./pages/About"); });
const Shop = lazy(() => { prefetchRoute("/shop"); return import("./pages/Shop"); });
const Cart = lazy(() => { prefetchRoute("/cart"); return import("./pages/Cart"); });
const ContactPage = lazy(() => { prefetchRoute("/contact"); return import("./pages/Contact"); });
const SizeGuide = lazy(() => { prefetchRoute("/size-guide"); return import("./pages/SizeGuide"); });
const FAQ = lazy(() => { prefetchRoute("/faq"); return import("./pages/FAQ"); });
const OrderSuccess = lazy(() => import("./pages/OrderSuccess"));

/* ================= AUTH ================= */

const Login = lazy(() => { prefetchRoute("/login"); return import("./pages/Login"); });
const Register = lazy(() => { prefetchRoute("/register"); return import("./pages/Register"); });
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));

/* ================= USER ================= */

const Profile = lazy(() => import("./pages/Profile"));
const EditProfile = lazy(() => import("./pages/EditProfile"));
const MyOrders = lazy(() => import("./pages/MyOrders"));
const OrderDetails = lazy(() => import("./pages/OrderDetails"));

/* ================= ADMIN ================= */

const AdminLayout = lazy(() => import("./admin/layouts/AdminLayout"));
const Products = lazy(() => import("./admin/pages/Products"));
const AddProduct = lazy(() => import("./admin/pages/AddProduct"));
const EditProduct = lazy(() => import("./admin/pages/EditProduct"));
const Categories = lazy(() => import("./admin/pages/Categories"));
const AddCategory = lazy(() => import("./admin/pages/AddCategory"));
const EditCategory = lazy(() => import("./admin/pages/EditCategory"));
const SubCategories = lazy(() => import("./admin/pages/SubCategories"));
const AddSubCategory = lazy(() => import("./admin/pages/AddSubCategory"));
const EditSubCategory = lazy(() => import("./admin/pages/EditSubCategory"));
const AdminOrders = lazy(() => import("./admin/pages/Orders"));
const AdminOrderDetails = lazy(() => import("./admin/pages/OrderDetails"));
const Clients = lazy(() => import("./admin/pages/Clients"));
const Settings = lazy(() => import("./admin/pages/Settings"));
const Tracking = lazy(() => import("./admin/pages/Tracking"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      retry: (failureCount, error) => {
        if (failureCount >= 2) return false;
        return !error?.response || error.response.status >= 500;
      },
    },
  },
});

const NotFoundPage = () => (
  <main className="flex min-h-[70vh] items-center justify-center bg-[#F7F3EC] px-6 text-center">
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-velora-gold">Erreur 404</p>
      <h1 className="mt-3 font-premium text-3xl font-bold text-velora-dark">Cette page est introuvable</h1>
      <p className="mt-3 text-sm text-velora-textGray">Le lien est peut-être expiré ou l’adresse est incorrecte.</p>
      <a href="/" className="mt-6 inline-flex h-11 items-center rounded-lg bg-velora-gold px-5 text-sm font-semibold text-white">Retour à l’accueil</a>
    </div>
  </main>
);

function LegacyProductRedirect() {
  const { id } = useParams();
  return <Navigate to={`/produit/${id}`} replace />;
}

function WebsiteLayout() {

  return (
    <>
      <SEO />
      <Navbar />

      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />

      <WhatsAppButton />

     
    </>
  );
}
function AppRoutes() {
  return (
    <Suspense
      fallback={<PageSkeleton />}
    >
      <Routes>

      {/* ================= WEBSITE ================= */}

      <Route element={<WebsiteLayout />}>

        <Route path="/" element={<Home />} />

        <Route path="/shop" element={<Shop />} />

        <Route
          path="/produit/:id"
          element={<ProductDetails />}
        />

        <Route path="/product/:id" element={<LegacyProductRedirect />} />

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
        

        <Route path="/faq" element={<FAQ />} />

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

      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />

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

        <Route path="/checkout" element={<Navigate to="/cart" replace />} />

        <Route
          path="/order-success"
          element={<OrderSuccess />}
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
          <Route path="settings" element={<Settings />} />
          <Route path="tracking" element={<Tracking />} />

        </Route>

      </Route>
            {/* ================= 404 ================= */}

      <Route
        path="*"
        element={<NotFoundPage />}
      />

      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <AnalyticsProvider>
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
    </AnalyticsProvider>
  );
}
