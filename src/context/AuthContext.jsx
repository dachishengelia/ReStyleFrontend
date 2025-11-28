import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Start with null to indicate loading state
  const [loading, setLoading] = useState(true); // Add loading state to prevent premature logout
  const [isLoggedOut, setIsLoggedOut] = useState(false); // Track if the user has explicitly logged out

  const fetchUser = async () => {
    if (isLoggedOut) return; // Do not fetch user details if the user has logged out
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_BASE}/auth/me`, {
        withCredentials: true,
      });
      setUser(data.user);
    } catch (err) {
      console.error("Failed to fetch user:", err.message);
      setUser(null); // Ensure user is null if fetching fails
    } finally {
      setLoading(false); // Set loading to false after fetch attempt
    }
  };

  const login = (userData) => {
    setUser(userData);
    setIsLoggedOut(false); // Reset the logout state on login
  };

  const logout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE}/auth/logout`, {}, { withCredentials: true }); // Updated endpoint
      document.cookie = "token=; Max-Age=0; path=/;"; // Explicitly delete the token cookie
      document.cookie = "token=; Expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // Ensure token is removed
    } catch (err) {
      console.error("Logout failed:", err.message);
    } finally {
      setUser(null);
      setIsLoggedOut(true); // Mark the user as explicitly logged out
      localStorage.removeItem("auth"); // Clear any local storage related to auth
    }
  };

  useEffect(() => {
    fetchUser(); // Always fetch user details on app load unless explicitly logged out
  }, []);

  if (loading) {
    // Show a loading state while fetching user details
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};