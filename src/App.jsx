import React, { useState, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Favorites from "./pages/Favorites.jsx";
import Auth from "./pages/Auth.jsx";
import DiscountFeed from "./pages/DiscountFeed.jsx";
import Secondhand from "./pages/secondhand.jsx";
import AdminPanel from "./admin/AdminPanel.jsx";
import AddProduct from "./components/AddProduct.jsx";
import CartPage from "./pages/Cart.jsx";
import { AuthProvider, AuthContext } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";

export default function App() {
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("ecom_favs")) || [];
    } catch {
      return [];
    }
  });

  React.useEffect(() => {
    localStorage.setItem("ecom_favs", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFav = (id) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  };

  return (
    <AuthProvider>
      <CartProvider>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Navbar favoritesCount={favorites.length} />
          <main className="flex-1 w-full">
            <Routes>
              <Route path="/" element={<Home favorites={favorites} toggleFav={toggleFav} />} />
              <Route path="/favorites" element={<Favorites favorites={favorites} toggleFav={toggleFav} />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/discounts" element={<DiscountFeed favorites={favorites} toggleFav={toggleFav} />} />
              <Route path="/secondhand" element={<Secondhand favorites={favorites} toggleFav={toggleFav} />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/admin" element={<RequireAdmin><AdminPanel /></RequireAdmin>} />
              <Route path="/add-product" element={<RequireSeller><AddProduct /></RequireSeller>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

// --- PROTECTED ROUTES ---
function RequireAdmin({ children }) {
  const { user } = useContext(AuthContext);
  if (!user || user.role !== "admin") return <Navigate to="/auth" />;
  return children;
}

function RequireSeller({ children }) {
  const { user } = useContext(AuthContext);
  if (!user || (user.role !== "seller" && user.role !== "admin")) return <Navigate to="/auth" />;
  return children;
}
