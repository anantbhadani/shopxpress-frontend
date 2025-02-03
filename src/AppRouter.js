import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Loader from "./components/Loader"; // Loader for lazy loading
import NotFoundPage from "./NotFoundPage"; // Import the NotFoundPage

// Lazy load components for better performance
const Home = lazy(() => import("./pages/Home"));
const Products = lazy(() => import("./components/ProductCard"));
const Cart = lazy(() => import("./pages/Cart"));
const AuthForm = lazy(() => import("./components/AuthForm"));

const AppRouter = ({ isAuthenticated, handleLogin }) => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Public Routes */}
        {!isAuthenticated && (
          <Route path="/" element={<AuthForm onLogin={handleLogin} />} />
        )}

        {/* Private Routes (only accessible when authenticated) */}
        {isAuthenticated && (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
          </>
        )}

        {/* Fallback Route (404 Page) */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
