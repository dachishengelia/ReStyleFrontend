import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext.jsx";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState([]);

  const api = axios.create({
    baseURL: "http://localhost:3000", // Ensure this matches your backend URL
    withCredentials: true,
  });

  const fetchCart = async () => {
    if (!user) return;
    try {
      const res = await api.get("/cart");
      setCart(res.data.products || []);
    } catch (err) {
      console.error("Fetch cart failed:", err);
      setCart([]);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      alert("Please login first!");
      return;
    }
    try {
      const res = await api.post("/cart", { productId, quantity });
      setCart(res.data.products || []);
    } catch (err) {
      console.error("Add to cart failed:", err);
      alert("Failed to add to cart");
    }
  };

  const updateCart = async (cartItemId, quantity) => {
    try {
      console.log(`Updating cart item with ID: ${cartItemId}, Quantity: ${quantity}`); // Debugging log
      const res = await api.put(`/cart/${cartItemId}`, { quantity });
      setCart(res.data.products || []);
    } catch (err) {
      console.error("Update cart failed:", err);
      alert("Failed to update cart");
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      console.log(`Removing cart item with ID: ${cartItemId}`); // Debugging log
      await api.delete(`/cart/${cartItemId}`);
      setCart((prevCart) => prevCart.filter((item) => item._id !== cartItemId));
    } catch (err) {
      console.error("Remove from cart failed:", err);
      alert("Failed to remove from cart");
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
