import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);

  // Use useEffect to load values from localStorage on mount
  useEffect(() => {
    const storedIsAuthenticated = localStorage.getItem("isAuthenticated");
    const storedUserId = localStorage.getItem("email");
    const storedUserRole = localStorage.getItem("userRole");

    // Check if the user is authenticated based on localStorage values
    if (storedIsAuthenticated === "true" && storedUserId) {
      setIsAuthenticated(true);
      setUserId(storedUserId);
      setUserRole(storedUserRole);
    }
  }, []);

  // Login function to set isAuthenticated, userId, and role
  const login = (email, role = "user") => {
    setIsAuthenticated(true);
    setUserId(email);
    setUserRole(role);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userId", email);
    localStorage.setItem("userRole", role);
  };

  // Logout function to reset authentication state
  const logout = () => {
    setIsAuthenticated(false);
    setUserId(null);
    setUserRole(null);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("email");
    localStorage.removeItem("userRole");
  };

  const isAdmin = userRole === "admin";

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, userRole, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
