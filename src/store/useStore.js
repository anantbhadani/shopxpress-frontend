import { create } from "zustand";
import axios from "axios";

const useStore = create((set) => ({
  cart: JSON.parse(localStorage.getItem("cart")) || [], // Load cart from localStorage initially
  isLoading: false,
  error: null,

  // Fetch cart from Firestore using cookie auth
  fetchCart: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/cart`, {
        withCredentials: true,
      });

      localStorage.setItem("cart", JSON.stringify(response.data.items || []));
      set({ cart: response.data.items || [] });
    } catch (error) {
      handleError(error, set);
    } finally {
      set({ isLoading: false });
    }
  },

  // Add item to the cart
  addToCart: async (productId) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cart/add`,
        { productId },
        { withCredentials: true }
      );

      localStorage.setItem("cart", JSON.stringify(response.data.items));
      set({ cart: response.data.items });
    } catch (error) {
      handleError(error, set);
    } finally {
      set({ isLoading: false });
    }
  },

  // Remove item from cart
  removeFromCart: async (productId) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cart/remove`,
        { productId },
        { withCredentials: true }
      );

      const updatedItems = response.data.items || [];

      localStorage.setItem("cart", JSON.stringify(updatedItems));
      set({ cart: updatedItems });
    } catch (error) {
      handleError(error, set);
    } finally {
      set({ isLoading: false });
    }
  },

  // Clear the entire cart
  clearCart: async () => {
    set({ isLoading: true, error: null });

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/cart/clear`,
        {},
        { withCredentials: true }
      );

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
