import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import {
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from "@mui/material";
import { AdminPanelSettings } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // First authenticate with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const token = await user.getIdToken();

      // Then verify with backend to get role
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/users/login`,
        { email, password },
        { 
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );

      if (response.data.users.role === "admin") {
        // Store admin info
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userId", response.data.users.uid);
        localStorage.setItem("email", response.data.users.email);
        localStorage.setItem("userRole", "admin");
        localStorage.setItem("username", response.data.users.name);
        localStorage.setItem("authToken", token);

        toast.success("Admin login successful!", { position: "top-right" });
        setTimeout(() => {
          navigate("/admin-dashboard");
        }, 1000);
      } else {
        // Sign out if not admin
        await auth.signOut();
        setError("Access denied. Admin credentials required.");
        toast.error("You do not have admin privileges.", { position: "top-right" });
      }
    } catch (error) {
      console.error("Admin login error:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Invalid email or password.";
      setError(errorMessage);
      toast.error(errorMessage, { position: "top-right" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f4f4f4",
      }}
    >
      <ToastContainer />
      <Card style={{ width: 400, padding: 30, textAlign: "center" }}>
        <CardContent>
          <AdminPanelSettings
            style={{ fontSize: 60, color: "#1976d2", marginBottom: 20 }}
          />
          <Typography variant="h4" gutterBottom>
            Admin Login
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Enter your admin credentials to access the dashboard
          </Typography>

          {error && (
            <Alert severity="error" style={{ marginTop: 20, marginBottom: 20 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Admin Email"
              type="email"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading || !email || !password}
              style={{ marginTop: 20, backgroundColor: "#1976d2" }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Login as Admin"
              )}
            </Button>
          </form>

          <Typography
            variant="body2"
            style={{ marginTop: 20, cursor: "pointer", color: "#1976d2" }}
            onClick={() => navigate("/")}
          >
            Back to User Login
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;

