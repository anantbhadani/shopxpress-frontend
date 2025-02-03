import { create } from "zustand";
import axios from "axios";

const useStore = create((set) => ({
  cart: JSON.parse(localStorage.getItem("cart")) || [], // Load cart from localStorage initially
  isLoading: false,
  error: null,

  // Fetch cart from Firestore or localStorage using userId
  fetchCart: async (userId) => {
    if (!userId) {
      set({ error: "userId is required" });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const response = await axios.get(`https://shopxpress-backend-production.up.railway.app/api/cart/userId/${userId}`);
      console.log("Cart data fetched from backend:", response.data);

      localStorage.setItem("cart", JSON.stringify(response.data.items || []));
      set({ cart: response.data.items || [] });
    } catch (error) {
      handleError(error, set);
    } finally {
      set({ isLoading: false });
    }
  },

  // Add item to the cart using userId and productId
  addToCart: async (productId, userId) => {
    if (!userId) {
      set({ error: "userId is required" });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      console.log("Adding item to cart:", { productId, userId });

      const response = await axios.post("https://shopxpress-backend-production.up.railway.app/api/cart/add", {
        userId: userId, // Send userId as userId
        productId,
      });

      console.log("Item added to cart:", response.data);
      localStorage.setItem("cart", JSON.stringify(response.data.items));
      set({ cart: response.data.items });
    } catch (error) {
      handleError(error, set);
    } finally {
      set({ isLoading: false });
    }
  },

  // Remove item from cart using userId and productId
  removeFromCart: async (productId, userId) => {
    if (!userId) {
      set({ error: "userId is required" });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      console.log("Removing item from cart:", { productId, userId });

      const response = await axios.post("https://shopxpress-backend-production.up.railway.app/api/cart/remove", {
        userId: userId, // Send userId as userId
        productId,
      });

      console.log("Item removed from cart:", response.data);
      const updatedItems = response.data.items || [];

      localStorage.setItem("cart", JSON.stringify(updatedItems));
      set({ cart: updatedItems });
    } catch (error) {
      handleError(error, set);
    } finally {
      set({ isLoading: false });
    }
  },

  // Clear the entire cart using user userId
  clearCart: async (email) => {
    if (!email) {
      set({ error: "email is required" });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      console.log("Clearing cart for user:", email);

      const response = await axios.post("https://shopxpress-backend-production.up.railway.app/api/cart/clear", {
        email,
      });

      console.log("Cart cleared:", response.data);
      localStorage.setItem("cart", JSON.stringify([]));
      set({ cart: [] });
    } catch (error) {
      handleError(error, set);
    } finally {
      set({ isLoading: false });
    }
  },
}));

// Error handling utility
const handleError = (error, set) => {
  console.error("Error:", error);

  if (error.response) {
    console.error("Backend error:", error.response.data.message);
    set({ error: `Backend error: ${error.response.data.message}` });
  } else if (error.request) {
    console.error("No response received from the backend.");
    set({ error: "No response from server." });
  } else {
    console.error("Request setup error:", error.message);
    set({ error: `Request error: ${error.message}` });
  }
};

export default useStore;
