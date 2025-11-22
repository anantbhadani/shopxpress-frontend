import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Loader from "./components/Loader"; // Loader for lazy loading
import NotFoundPage from "./NotFoundPage"; // Import the NotFoundPage
import ProtectedAdminRoute from "./components/ProtectedAdminRoute"; // Protected admin route
import ProtectedUserRoute from "./components/ProtectedUserRoute"; // Protected user route

// Lazy load components for better performance
const Home = lazy(() => import("./pages/Home"));
const Products = lazy(() => import("./components/ProductCard"));
const Cart = lazy(() => import("./pages/Cart"));
const AuthForm = lazy(() => import("./components/AuthForm"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const UserDashboard = lazy(() => import("./pages/UserDashboard"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderDetail = lazy(() => import("./pages/OrderDetail"));

const AppRouter = ({ isAuthenticated, handleLogin, authLoading }) => {
  // Show loader while auth is being determined
  if (authLoading) {
    return <Loader />;
  }

  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Admin Routes - Public login, Protected dashboard */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedAdminRoute>
              <AdminPage />
            </ProtectedAdminRoute>
          }
        />

        {/* Public Routes */}
        <Route path="/login" element={<AuthForm onLogin={handleLogin} />} />
        {!isAuthenticated && (
          <Route path="/" element={<AuthForm onLogin={handleLogin} />} />
        )}

        {/* Private Routes (only accessible when authenticated, not for admins) */}
        {isAuthenticated && (
          <>
            <Route
              path="/"
              element={
                <ProtectedUserRoute>
                  <Home />
                </ProtectedUserRoute>
              }
            />
            <Route
              path="/products"
              element={
                <ProtectedUserRoute>
                  <Products />
                </ProtectedUserRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <ProtectedUserRoute>
                  <Cart />
                </ProtectedUserRoute>
              }
            />
            <Route
              path="/user-dashboard"
              element={
                <ProtectedUserRoute>
                  <UserDashboard />
                </ProtectedUserRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedUserRoute>
                  <UserDashboard />
                </ProtectedUserRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedUserRoute>
                  <Checkout />
                </ProtectedUserRoute>
              }
            />
            <Route
              path="/orders/:orderId"
              element={
                <ProtectedUserRoute>
                  <OrderDetail />
                </ProtectedUserRoute>
              }
            />
          </>
        )}

        {/* Fallback Route (404 Page) - Only show if not loading */}
        {!authLoading && <Route path="*" element={<NotFoundPage />} />}
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
