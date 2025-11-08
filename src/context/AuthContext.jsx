import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const userCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("user="));
      return userCookie ? JSON.parse(decodeURIComponent(userCookie.split("=")[1])) : null;
    } catch {
      return null;
    }
  });

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await axios.post("https://re-style-backend-4la8.vercel.app/logout", {}, { withCredentials: true });
      document.cookie = "user=; Max-Age=0; path=/;"; 
    } catch (err) {
      console.error(err);
    } finally {
      setUser(null);
    }
  };

  useEffect(() => {
    if (!user) {
      console.log("No user found in cookies, logging out.");
      logout();
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
