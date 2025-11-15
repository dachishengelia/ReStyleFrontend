import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext.jsx";
import ProductCard from "../components/ProductCard";

export default function YourProducts({ toggleFav, cart, addToCart, removeFromCart }) {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSellerProducts = async () => {
    try {
      console.log("Fetching products for seller:", user?.email); // Log the seller's email
      const res = await axios.get("https://re-style-backend.vercel.app/api/products/seller", { withCredentials: true }); // Updated to Vercel backend
      console.log("Fetched products:", res.data); // Log the fetched products
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch seller products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "seller") {
      fetchSellerProducts();
    }
  }, [user]);

  if (loading) {
    return <div className="p-4">Loading your products...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Your Products</h1>
      {products.length === 0 ? (
        <p>You have not added any products yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard
              key={p._id}
              p={p}
              onToggleFav={toggleFav}
              isFav={false} // Favorites are not relevant for seller's products
              cart={cart}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
            />
          ))}
        </div>
      )}
    </div>
  );
}
