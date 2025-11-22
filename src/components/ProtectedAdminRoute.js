import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

const ProtectedAdminRoute = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Set up Firebase auth state listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is authenticated in Firebase
        // Check if they have admin role in localStorage
        const userRole = localStorage.getItem("userRole");
        const isAuthenticated = localStorage.getItem("isAuthenticated");
        
        if (userRole === "admin" && isAuthenticated === "true") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        // User not authenticated in Firebase
        setIsAdmin(false);
      }
      setIsChecking(false);
    });

    // If Firebase auth is already initialized, check immediately
    // Otherwise, wait for onAuthStateChanged
    if (auth.currentUser) {
      const userRole = localStorage.getItem("userRole");
      const isAuthenticated = localStorage.getItem("isAuthenticated");
      
      if (userRole === "admin" && isAuthenticated === "true") {
        setIsAdmin(true);
        setIsChecking(false);
      } else {
        setIsAdmin(false);
        setIsChecking(false);
      }
    }

    return () => unsubscribe();
  }, []);

  if (isChecking) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;

