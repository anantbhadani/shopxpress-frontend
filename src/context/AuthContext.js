import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);

  // Use useEffect to load values from localStorage on mount
  useEffect(() => {
    const storedIsAuthenticated = localStorage.getItem("isAuthenticated");
    const storedUserId = localStorage.getItem("email");

    // Check if the user is authenticated based on localStorage values
    if (storedIsAuthenticated === "true" && storedUserId) {
      setIsAuthenticated(true);
      setUserId(storedUserId);
    }
  }, []);

  // Login function to set isAuthenticated and userId
  const login = (email) => {
    setIsAuthenticated(true);
    setUserId(email);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userId", email);
  };

  // Logout function to reset authentication state
  const logout = () => {
    setIsAuthenticated(false);
    setUserId(null);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("email");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
