import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "../axios.js";
import { AuthContext } from "./AuthContext.jsx";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  const fetchCart = async () => {
    if (!user) return;
    try {
      const { data } = await axios.get("/cart");
      const validProducts = (data.products || []).filter((item) => item.product && item.product.name);
      setCart(validProducts);
      setTotal(validProducts.reduce((sum, item) => sum + item.product.price * item.quantity, 0));
    } catch (err) {
      console.error("Failed to fetch cart:", err.message);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      alert("Please log in to add items to your cart.");
      return;
    }
    try {
      const { data } = await axios.post("/cart", { productId, quantity });
      setCart(data.cart.products || []);
      setTotal(data.cart.total || 0);
    } catch (err) {
      console.error("Failed to add product to cart:", err.message);
      alert("Failed to add product to cart.");
    }
  };

  const updateCart = async (productId, quantity) => {
    try {
      const { data } = await axios.patch(`/cart/${productId}`, { quantity });
      setCart(data.cart.products || []);
      setTotal(data.cart.total || 0);
    } catch (err) {
      console.error("Failed to update cart:", err.message);
      alert("Failed to update cart.");
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const { data } = await axios.delete(`/cart/${productId}`);
      setCart(data.cart.products || []);
      setTotal(data.cart.total || 0);
    } catch (err) {
      console.error("Failed to remove product from cart:", err.message);
      alert("Failed to remove product from cart.");
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete("/cart");
      setCart([]);
      setTotal(0);
    } catch (err) {
      console.error("Failed to clear cart:", err.message);
      alert("Failed to clear cart.");
    }
  };

  useEffect(() => {
    if (user) fetchCart();
  }, [user]);

  return (
    <CartContext.Provider value={{ cart, total, addToCart, updateCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
