import React, { useEffect, useState, useContext } from "react";
import useStore from "../store/useStore"; // Zustand store
import { AuthContext } from "../context/AuthContext"; // Authentication context
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Grid,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
} from "@mui/material";
import { Add, Remove, Delete } from "@mui/icons-material";
import { toast } from "react-toastify"; // Import toast for notifications

const Cart = () => {
  const { isAuthenticated, userId } = useContext(AuthContext); // Get authentication status and userId
  const {
    cart,
    fetchCart,
    addToCart,
    removeFromCart,
    clearCart,
    isLoading,
    error,
  } = useStore((state) => state); // Get Zustand state and actions

  const [openClearDialog, setOpenClearDialog] = useState(false);
  const [localError, setLocalError] = useState(error); // Local state for error handling

  // Fetch cart when component mounts
  useEffect(() => {
    if (isAuthenticated && userId) {
      const localCart = localStorage.getItem("cart");
      if (localCart) {
        useStore.setState({ cart: JSON.parse(localCart) });
      } else {
        fetchCart(userId).catch((err) => setLocalError("Failed to load cart"));
      }
    } else {
      setLocalError("User is not authenticated.");
    }
  }, [isAuthenticated, userId, fetchCart]);

  // Store cart in localStorage whenever it updates
  useEffect(() => {
    if (cart) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  const handleAddItem = (productId) => {
    if (isAuthenticated && userId) {
      addToCart(productId, userId);
    } else {
      setLocalError("User is not authenticated.");
    }
  };

  const handleRemoveItem = (productId) => {
    if (isAuthenticated && userId) {
      removeFromCart(productId, userId); // Trigger removeFromCart with userId (email) and productId
    } else {
      setLocalError("User is not authenticated.");
    }
  };

  const handleClearCart = async () => {
    if (isAuthenticated && userId) {
      setLocalError(null); // Reset previous errors (if any)
      
      // Set loading state directly from Zustand
      // useStore.setState({ isLoading: true }); // Set isLoading to true for progress indication

      try {
        await clearCart(userId); // Call the Zustand action to clear the cart
        setOpenClearDialog(false); // Close the confirmation dialog
        toast.success("Cart cleared successfully!"); // Show success message
      } catch (error) {
        setLocalError("Failed to clear cart. Please try again.");
      } finally {
        // useStore.setState({ isLoading: false }); // Reset loading state when done
      }
    } else {
      setLocalError("User is not authenticated.");
    }
  };

  // Calculate totals
  const subtotal = cart.reduce((acc, item) => {
    const price = item.price || 0; // Default to 0 if price is invalid
    const quantity = item.quantity || 0; // Default to 0 if quantity is invalid
    return acc + price * quantity;
  }, 0);

  const tax = subtotal * 0.1; // Assume 10% sales tax
  const grandTotal = subtotal + tax;

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "auto" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Your Cart ({cart.length} items)
      </Typography>

      {isLoading ? (
        <Typography align="center">Loading...</Typography>
      ) : localError ? (
        <Typography align="center" color="error">
          {localError}
        </Typography>
      ) : cart.length === 0 ? (
        <Typography align="center" style={{ fontSize: "18px", color: "#888" }}>
          Your cart is empty
        </Typography>
      ) : (
        <>
          {cart.map((item) => (
            <Card key={item.productId} sx={{ display: "flex", mb: 2, p: 2 }}>
              <CardMedia
                component="img"
                image={item.imageUrl}
                alt={item.name}
                sx={{ width: 100, height: 100, objectFit: "cover", borderRadius: 1 }}
              />
              <CardContent sx={{ flex: "1 0 auto" }}>
                <Typography variant="h6">{item.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Price: Rs.{item.price.toFixed(2)}
                </Typography>

                {/* Quantity Control */}
                <Grid container alignItems="center" spacing={1} sx={{ mt: 1 }}>
                  <Grid item>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleRemoveItem(item.productId)}
                      disabled={item.quantity <= 1}
                    >
                      <Remove />
                    </IconButton>
                  </Grid>
                  <Grid item>
                    <Typography variant="body1">{item.quantity}</Typography>
                  </Grid>
                  <Grid item>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleAddItem(item.productId)}
                    >
                      <Add />
                    </IconButton>
                  </Grid>
                </Grid>
              </CardContent>

              {/* Remove Item */}
              <IconButton
                color="error"
                onClick={() => handleRemoveItem(item.productId)}
                sx={{ alignSelf: "center" }}
              >
                <Delete />
              </IconButton>
            </Card>
          ))}

          <Divider sx={{ my: 2 }} />

          {/* Cart Summary */}
          <div style={{ textAlign: "right", marginBottom: "20px" }}>
            <Typography variant="h6">Subtotal: Rs.{subtotal.toFixed(2)}</Typography>
            <Typography variant="body2" color="textSecondary">
              Sales Tax (10%): Rs.{tax.toFixed(2)}
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              Grand Total: Rs.{grandTotal.toFixed(2)}
            </Typography>
          </div>

          {/* Checkout & Clear Cart Buttons */}
          <Grid container spacing={2} justifyContent="flex-end">
            <Grid item>
              <Button variant="contained" color="primary" size="large">
                Checkout
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="error"
                size="large"
                onClick={() => setOpenClearDialog(true)}
              >
                Clear Cart
              </Button>
            </Grid>
          </Grid>
        </>
      )}

      {/* Confirmation Dialog for Clearing Cart */}
      <Dialog open={openClearDialog} onClose={() => setOpenClearDialog(false)}>
        <DialogTitle>Clear Cart</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to clear all items from your cart?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenClearDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClearCart} color="error">
            Clear Cart
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Cart;
