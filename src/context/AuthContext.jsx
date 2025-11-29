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
      const { data } = await axios.get(`${import.meta.env.VITE_API_BASE}/auth/me`, {
        withCredentials: true,
      });
      setUser(data.user);
    } catch (err) {
      console.error("Failed to fetch user:", err.message);
      if (err.code === "ERR_NETWORK") {
        console.error("Network error: Unable to reach the server. Please ensure the backend is running at the correct URL.");
        alert("Unable to connect to the server. Please ensure the backend is running.");
      } else if (err.response) {
        console.error("Response status:", err.response.status);
        if (err.response.status === 401) {
          alert("Unauthorized: Please sign in again.");
        }
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logIn = (userData) => {
    setUser(userData);
    setIsLoggedOut(false);
  };

  const signOut = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_PROD}/auth/logout`, {}, { withCredentials: true });
      document.cookie = "token=; Max-Age=0; path=/;";
    } catch (err) {
      console.error("Sign out failed:", err.message);
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
    <AuthContext.Provider value={{ user, logIn, signOut, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};