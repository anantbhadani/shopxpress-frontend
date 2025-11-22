import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import axios from "axios";
import { TextField, Button, Typography, Card, CardContent, CircularProgress } from "@mui/material";
import { Facebook, Google, Twitter } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AuthForm = ({ onLogin }) => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    try {
      if (isSignup) {
        // Sign up flow
        const url = `${process.env.REACT_APP_API_URL || "https://shopxpress-backend.onrender.com/api"}/users/signup`;
        const payload = { name, email, password };

        const response = await axios.post(url, payload, { withCredentials: true });

        if (response.status === 200 || response.status === 201) {
          toast.success(response.data.message, { position: "top-right" });
          
          // After backend signup, authenticate with Firebase
          try {
            await createUserWithEmailAndPassword(auth, email, password);
            toast.success("Account created successfully! Please login.", { position: "top-right" });
            setIsSignup(false);
          } catch (firebaseError) {
            console.error("Firebase signup error:", firebaseError);
            // Backend user created but Firebase signup failed - user can still login
          }
        }

        setName("");
        setEmail("");
        setPassword("");
      } else {
        // Login flow - First authenticate with Firebase
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const token = await user.getIdToken();

        // Then verify with backend to get user role and data
        const url = `${process.env.REACT_APP_API_URL || "https://shopxpress-backend.onrender.com/api"}/users/login`;
        const response = await axios.post(
          url,
          { email, password },
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          // Save user data to localStorage
          const userRole = response.data.users.role || "user";
          localStorage.setItem("userId", response.data.users.uid);
          localStorage.setItem("username", response.data.users.displayName || response.data.users.name);
          localStorage.setItem("email", response.data.users.email || response.data.users.email);
          localStorage.setItem("userRole", userRole);
          localStorage.setItem("isAuthenticated", "true");
          
          toast.success(response.data.message, { position: "top-right" });
          onLogin(); // Trigger login state update
          
          // Redirect based on user role after successful login
          setTimeout(() => {
            if (userRole === "admin") {
              navigate("/admin-dashboard");
            } else {
              navigate("/");
            }
          }, 1000);
        }

        setEmail("");
        setPassword("");
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      let errorMessage = "An error occurred during authentication.";
      
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        errorMessage = "Invalid email or password.";
      } else if (error.code === "auth/email-already-in-use") {
        errorMessage = "Email already in use. Please login instead.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password should be at least 6 characters.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage, { position: "top-right" });
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f4f4f4" }}>
      <ToastContainer />
      <Card style={{ width: 350, padding: 20, textAlign: "center" }}>
        <CardContent>
          <Typography variant="h5">{isSignup ? "Create an Account" : "Welcome to ShopXpress"}</Typography>
          <form onSubmit={handleAuth}>
            {isSignup && (
              <TextField
                fullWidth
                label="Full Name"
                margin="normal"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            )}
            <TextField
              fullWidth
              label="Email"
              type="email"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              fullWidth
              disabled={isLoading || (isSignup ? !name || !email || !password : !email || !password)}
              style={{ backgroundColor: "#d4c618", color: "#fff", marginTop: 15 }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : isSignup ? "Sign Up" : "Login"}
            </Button>
          </form>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
            <Typography variant="body2" style={{ cursor: "pointer" }}>Forgot Password?</Typography>
            <Typography variant="body2" style={{ cursor: "pointer" }} onClick={() => setIsSignup(!isSignup)}>
              {isSignup ? "Already have an account? Login" : "Create an Account"}
            </Typography>
          </div>
          <Typography variant="body2" style={{ margin: "15px 0" }}>or</Typography>
          <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
            <Facebook style={{ cursor: "pointer", color: "#3b5998" }} aria-label="Login with Facebook" />
            <Google style={{ cursor: "pointer", color: "#db4437" }} aria-label="Login with Google" />
            <Twitter style={{ cursor: "pointer", color: "#1da1f2" }} aria-label="Login with Twitter" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;