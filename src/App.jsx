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
import YourProducts from "./pages/YourProducts.jsx";
import { AuthProvider, AuthContext } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import Success from "./pages/Success.jsx";
import Cancel from "./pages/Cancel.jsx";

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

  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("ecom_cart")) || [];
    } catch {
      return [];
    }
  });

  React.useEffect(() => {
    localStorage.setItem("ecom_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (id) => {
    setCart((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item !== id));
  };

  return (
    <AuthProvider>
      <CartProvider>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Navbar favoritesCount={favorites.length} />
          <main className="flex-1 w-full">
            <Routes>
              <Route
                path="/"
                element={
                  <Home
                    favorites={favorites}
                    toggleFav={toggleFav}
                    cart={cart}
                    addToCart={addToCart}
                    removeFromCart={removeFromCart}
                  />
                }
              />
              <Route
                path="/favorites"
                element={
                  <Favorites
                    favorites={favorites}
                    toggleFav={toggleFav}
                    cart={cart}
                    addToCart={addToCart}
                    removeFromCart={removeFromCart}
                  />
                }
              />
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/discounts"
                element={
                  <DiscountFeed
                    favorites={favorites}
                    toggleFav={toggleFav}
                    cart={cart}
                    addToCart={addToCart}
                    removeFromCart={removeFromCart}
                  />
                }
              />
              <Route
                path="/secondhand"
                element={
                  <Secondhand
                    favorites={favorites}
                    toggleFav={toggleFav}
                    cart={cart}
                    addToCart={addToCart}
                    removeFromCart={removeFromCart}
                  />
                }
              />

              <Route path="/cart" element={<CartPage />} />

              <Route path="/admin" element={<RequireAdmin><AdminPanel /></RequireAdmin>} />
              <Route path="/add-product" element={<RequireSeller><AddProduct /></RequireSeller>} />
              <Route path="/seller" element={<RequireSeller><AddProduct /></RequireSeller>} />

              <Route
                path="/your-products"
                element={
                  <RequireSeller>
                    <YourProducts
                      toggleFav={toggleFav}
                      cart={cart}
                      addToCart={addToCart}
                      removeFromCart={removeFromCart}
                    />
                  </RequireSeller>
                }
              />

              {/* Stripe redirect pages */}
              <Route path="/success" element={<Success />} />
              <Route path="/cancel" element={<Cancel />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

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
