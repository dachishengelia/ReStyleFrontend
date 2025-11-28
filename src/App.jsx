import React, { useState, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Favorites from "./pages/Favorites.jsx";
import Auth from "./pages/Auth.jsx";
import DiscountFeed from "./pages/DiscountFeed.jsx";
import AdminPanel from "./admin/AdminPanel.jsx";
import AddProduct from "./components/AddProduct.jsx";
import CartPage from "./pages/Cart.jsx";
import YourProducts from "./pages/YourProducts.jsx";
import { AuthProvider, AuthContext } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import Success from "./pages/Success.jsx";
import Cancel from "./pages/Cancel.jsx";
import Profile from "./pages/Profile.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";

export default function App() {
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("ecom_favs")) || [];
    } catch {
      return [];
    }
  });

  React.useEffect(() => {
    try {
      localStorage.setItem("ecom_favs", JSON.stringify(favorites));
    } catch (err) {
      console.error("Failed to save favorites to localStorage:", err);
    }
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
    try {
      localStorage.setItem("ecom_cart", JSON.stringify(cart));
    } catch (err) {
      console.error("Failed to save cart to localStorage:", err);
    }
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
                  <ErrorBoundary>
                    <Home
                      favorites={favorites}
                      toggleFav={toggleFav}
                      cart={cart}
                      addToCart={addToCart}
                      removeFromCart={removeFromCart}
                    />
                  </ErrorBoundary>
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
              <Route path="/cart" element={<CartPage />} />
              <Route path="/admin" element={<RequireAdmin><AdminPanel /></RequireAdmin>} />
              <Route path="/add-product" element={<RequireSeller><AddProduct /></RequireSeller>} />
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
              <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
              <Route path="/success" element={<Success />} />
              <Route path="/cancel" element={<Cancel />} />
              <Route path="/product/:productId" element={<ProductDetails />} />
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

function RequireAuth({ children }) {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/auth" />;
  return children;
}
