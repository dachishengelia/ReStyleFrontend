import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext.jsx";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState([]);

  // Axios instance for backend
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE || "http://localhost:3000", // Use environment variable
    withCredentials: true, // Ensure cookies are sent with requests
  });

  // Fetch cart items
  const fetchCart = async () => {
    if (!user) return; // Ensure user is logged in
    try {
      const res = await api.get("/cart");
      setCart(res.data);
    } catch (err) {
      console.error("Fetch cart failed:", err);
      if (err.response?.status === 401) {
        alert("Session expired. Please log in again.");
      }
      setCart([]);
    }
  };

  // Add item to cart
  const addToCart = async (productId, quantity = 1) => {
    if (!user) return alert("Please login first!");
    try {
      const res = await api.post("/cart", { productId, quantity });
      setCart(res.data);
    } catch (err) {
      console.error("Add to cart failed:", err);
    }
  };

  // Update cart item quantity
  const updateCart = async (cartItemId, quantity) => {
    try {
      const res = await api.put(`/cart/${cartItemId}`, { quantity });
      setCart(res.data);
    } catch (err) {
      console.error("Update cart failed:", err);
    }
  };

  // Remove item from cart
  const removeFromCart = async (cartItemId) => {
    try {
      const res = await api.delete(`/cart/${cartItemId}`);
      setCart(res.data);
    } catch (err) {
      console.error("Remove from cart failed:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateCart, removeFromCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};
