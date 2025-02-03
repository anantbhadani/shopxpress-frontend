import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { FaHome, FaBox, FaShoppingCart } from "react-icons/fa";
import styled from "styled-components";
import "./styles/app.css";
import "./styles/pullToRefresh.css"; // Import the CSS for animation
import UserProfile from "./pages/Profile";
import useStore from "./store/useStore";
import AppRouter from "./AppRouter";

// Styled Components for Navbar
const Navbar = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #24292e;
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

const NavbarCenter = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: center;
`;

const SearchBar = styled.input`
  padding: 8px 12px;
  width: 300px;
  border-radius: 5px;
  border: 1px solid #ccc;
  outline: none;
  font-size: 14px;
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

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const cart = useStore((state) => state.cart);

  // Check authentication status on component mount
  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(storedAuth);
  }, []);

  // Handle login and logout
  function handleLogin() {
    localStorage.setItem("isAuthenticated", "true");
    setIsAuthenticated(true);
  }

  function handleLogout() {
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
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

        {/* Navbar */}
        {isAuthenticated && (
          <Navbar>
            <NavbarLeft>
              <Link to="/">
                <FaHome size={24} /> Home
              </Link>
              <Link to="/products">
                <FaBox size={24} /> Products
              </Link>
            </NavbarLeft>
            <NavbarCenter>
              <SearchBar type="text" placeholder="Search..." />
            </NavbarCenter>
            <NavbarRight>
              <CartIconContainer to="/cart">
                <FaShoppingCart size={24} />
                {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
              </CartIconContainer>
              <UserProfile isLoggedIn={isAuthenticated} onLogout={handleLogout} />
            </NavbarRight>
          </Navbar>
        )}

        {/* Router */}
        <AppRouter isAuthenticated={isAuthenticated} handleLogin={handleLogin} />
      </div>
    </Router>
  );
}

export default App;
