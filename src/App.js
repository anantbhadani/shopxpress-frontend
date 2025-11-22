import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Link, useLocation } from "react-router-dom";
import { FaHome, FaBox, FaShoppingCart } from "react-icons/fa";
import styled from "styled-components";
import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import "./styles/app.css";
import "./styles/pullToRefresh.css"; // Import the CSS for animation
import UserProfile from "./pages/Profile";
import useStore from "./store/useStore";
import AppRouter from "./AppRouter";
import ErrorBoundary from "./components/ErrorBoundary";

// Styled Components for Navbar
const Navbar = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${props => props.$isScrolled ? 'rgba(36, 41, 46, 0.5)' : '#24292e'};
  backdrop-filter: ${props => props.$isScrolled ? 'blur(10px)' : 'none'};
  transition: background-color 0.3s ease, backdrop-filter 0.3s ease;
  padding: 12px 20px;
  color: white;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 1000;
`;

const NavbarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  a {
    color: white;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 500;

    &:hover {
      color: #61dafb;
    }
  }
`;


const NavbarRight = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const CartIconContainer = styled(Link)`
  position: relative;
  color: white;
  text-decoration: none;

  .cart-count {
    position: absolute;
    top: -5px;
    right: -10px;
    background: red;
    color: white;
    font-size: 12px;
    padding: 2px 6px;
    border-radius: 50%;
  }
`;

// Navbar component that checks if we're on admin route or if user is admin
const NavbarWrapper = ({ isAuthenticated, cart, handleLogout }) => {
  const location = useLocation();
  const userRole = localStorage.getItem("userRole");
  const [isScrolled, setIsScrolled] = React.useState(false);

  // Handle scroll event to make navbar transparent
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50); // Start transparency after 50px scroll
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Don't show user navbar on admin routes (admin-login, admin dashboard)
  if (location.pathname.startsWith("/admin")) {
    return null;
  }
  
  // Don't show navbar if user is admin (admins should only use admin interface)
  // This prevents admin from seeing Home, Products, Cart navigation
  if (userRole === "admin") {
    return null;
  }

  // Only show navbar for authenticated regular users (not admins)
  if (!isAuthenticated) {
    return null;
  }

  // Show navbar only for regular authenticated users
  return (
    <Navbar $isScrolled={isScrolled}>
      <NavbarLeft>
        <Link to="/">
          <FaHome size={24} /> Home
        </Link>
        <Link to="/products">
          <FaBox size={24} /> Products
        </Link>
      </NavbarLeft>
      <NavbarRight>
        <CartIconContainer to="/cart">
          <FaShoppingCart size={24} />
          {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
        </CartIconContainer>
        <UserProfile isLoggedIn={isAuthenticated} onLogout={handleLogout} />
      </NavbarRight>
    </Navbar>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [authLoading, setAuthLoading] = useState(true); // Track auth initialization
  const cart = useStore((state) => state.cart);

  // Check authentication status on component mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setIsAuthenticated(true);
        localStorage.setItem("isAuthenticated", "true");
      } else {
        delete axios.defaults.headers.common["Authorization"];
        setIsAuthenticated(false);
        localStorage.removeItem("isAuthenticated");
      }
      setAuthLoading(false); // Auth state determined
    });

    return () => unsubscribe();
  }, []);

  // Handle login and logout
  function handleLogin() {
    // Handled by onAuthStateChanged
  }

  function handleLogout() {
    auth.signOut();
  }

  // Pull to Refresh Logic
  useEffect(() => {
    let startY = 0;
    let isPulledDown = false;

    const handleTouchStart = (e) => {
      if (window.scrollY === 0) {
        startY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e) => {
      const currentY = e.touches[0].clientY;
      if (currentY - startY > 100) {
        isPulledDown = true;
      }
    };

    const handleTouchEnd = () => {
      if (isPulledDown) {
        setIsRefreshing(true);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    };

    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return (
    <Router>
      <div className="app">
        {isRefreshing && (
          <div className="refresh-indicator">
            <div className="spinner"></div>
            Refreshing...
          </div>
        )}

        {/* Navbar - Only shown for regular users, not on admin routes */}
        <NavbarWrapper 
          isAuthenticated={isAuthenticated} 
          cart={cart} 
          handleLogout={handleLogout} 
        />

        {/* Router */}
        <ErrorBoundary>
          <AppRouter 
            isAuthenticated={isAuthenticated} 
            handleLogin={handleLogin}
            authLoading={authLoading}
          />
        </ErrorBoundary>
      </div>
    </Router>
  );
}

export default App;
