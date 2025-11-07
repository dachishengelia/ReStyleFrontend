import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { CartContext } from "../context/CartContext.jsx";
import logo from "/logo.png";

export default function Navbar({ favoritesCount }) {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow sticky top-0 z-20">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-3 px-4 md:px-6">
        <div className="flex items-center gap-2">
          <img src={logo} alt="logo" className="w-14 h-14 object-contain" />
          <span className="font-bold text-2xl text-gray-800">ReStyle</span>
        </div>

        <nav className="flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">Home</Link>
          <Link to="/favorites" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">Favorites ({favoritesCount})</Link>
          <Link to="/discounts" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">Discounts</Link>
          <Link to="/secondhand" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">Secondhand</Link>
          <Link to="/cart" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">Cart ({cart.length})</Link>

          {user ? (
            <div className="flex items-center gap-4">
              {user.role === "seller" && <button onClick={() => navigate("/seller")} className="text-sm font-medium text-blue-600 hover:underline">Add Product</button>}
              {user.role === "admin" && <button onClick={() => navigate("/admin")} className="text-sm font-medium text-purple-600 hover:underline">Admin</button>}
              <span className="text-sm font-medium text-gray-700">{user.email}</span>
              <button onClick={logout} className="text-sm font-medium text-red-500 hover:underline">Logout</button>
            </div>
          ) : (
            <Link to="/auth" className="text-sm font-medium text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition">Login / Sign Up</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
