import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  const fetchUser = async () => {
    if (isLoggedOut) return;
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_PROD}/auth/me`, {
        withCredentials: true,
      });
      setUser(data.user);
    } catch (err) {
      console.error("Failed to fetch user:", err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = (userData) => {
    setUser(userData);
    setIsLoggedOut(false);
  };

  const logout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_PROD}/auth/logout`, {}, { withCredentials: true });
      document.cookie = "token=; Max-Age=0; path=/;";
    } catch (err) {
      console.error("Logout failed:", err.message);
    } finally {
      setUser(null);
      setIsLoggedOut(true);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};