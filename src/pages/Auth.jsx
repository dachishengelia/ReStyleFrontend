import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

const API_BASE = "http://localhost:3000"; // Updated to local backend

export default function Auth() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "buyer" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleCredentialResponse,
        });
        window.google.accounts.id.renderButton(
          document.getElementById("googleSignInDiv"),
          { theme: "outline", size: "large", width: 300 }
        );
      }
    };

    return () => document.body.removeChild(script);
  }, []);

  const handleGoogleCredentialResponse = async (response) => {
    try {
      const { data } = await axios.post(`${API_BASE}/google-login`, { id_token: response.credential });
      login(data.user, data.token);
      navigate("/");
    } catch (err) {
      console.error("Google login failed:", err);
      setMessage(err.response?.data?.message || "Google login failed");
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const url = isLogin ? `${API_BASE}/auth/login` : `${API_BASE}/auth/register`;
    try {
      const { data } = await axios.post(url, form, { withCredentials: true });
      document.cookie = `user=${encodeURIComponent(JSON.stringify(data.user))}; path=/;`; 
      login(data.user); 
      navigate("/");
    } catch (err) {
      setMessage(err.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">{isLogin ? "Log In" : "Sign Up"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input type="text" name="username" placeholder="Username" value={form.username} onChange={handleChange} className="w-full border rounded-lg px-4 py-2" required />
          )}
          <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full border rounded-lg px-4 py-2" required />
          <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} className="w-full border rounded-lg px-4 py-2" required />
          {!isLogin && (
            <select name="role" value={form.role} onChange={handleChange} className="w-full border rounded-lg px-4 py-2">
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
            </select>
          )}
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
            {isLogin ? "Log In" : "Sign Up"}
          </button>
        </form>

        <div className="my-4 text-center">
          <div id="googleSignInDiv" className="mx-auto" />
        </div>

        {message && <p className="text-center mt-4 text-gray-700">{message}</p>}

        <p className="text-center mt-6 text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button onClick={() => setIsLogin(!isLogin)} className="text-blue-500 hover:underline ml-1">{isLogin ? "Sign Up" : "Log In"}</button>
        </p>
      </div>
    </div>
  );
}
