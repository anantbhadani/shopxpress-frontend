import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Typography, Card, CardContent, CircularProgress } from "@mui/material";
import { Facebook, Google, Twitter } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AuthForm = ({ onLogin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    const url = `https://shopxpress-backend-production.up.railway.app/api/users/${isSignup ? "signup" : "login"}`;
    const payload = isSignup ? { name, email, password } : { email, password };

    try {
      const response = await axios.post(url, payload);

      if (response.status === 200 || response.status === 201) {
        toast.success(response.data.message, { position: "top-right" });

        if (!isSignup) {
          // Save user data to localStorage
          localStorage.setItem("userId", response.data.users.uid);
          localStorage.setItem("username", response.data.users.displayName || response.data.users.name);
          localStorage.setItem("email", response.data.users.email  || response.data.users.email);
          onLogin(); // Trigger login state update
        }

        setIsSignup(false);
        setName("");
        setEmail("");
        setPassword("");
      } else {
        toast.error("Unexpected response from the server.", { position: "top-right" });
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      const errorMessage = error.response?.data?.message || error.message || "An error occurred during authentication.";
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