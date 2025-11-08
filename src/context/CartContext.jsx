import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext.jsx";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState([]);


  const api = axios.create({
    baseURL: "https://re-style-backend-4la8.vercel.app", 
    withCredentials: true, 
  });


  const fetchCart = async () => {
    if (!user) return; 
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

  
  const addToCart = async (productId, quantity = 1) => {
    if (!user) return alert("Please login first!");
    try {
      const res = await api.post("/cart", { productId, quantity });
      setCart(res.data);
    } catch (err) {
      console.error("Add to cart failed:", err);
    }
  };

 
  const updateCart = async (cartItemId, quantity) => {
    try {
      const res = await api.put(`/cart/${cartItemId}`, { quantity });
      setCart(res.data);
    } catch (err) {
      console.error("Update cart failed:", err);
    }
  };

 
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
