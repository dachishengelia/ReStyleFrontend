import React, { useState, useContext, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { AuthContext } from "../context/AuthContext";

export default function Secondhand({ favorites, toggleFav, cart, addToCart, removeFromCart }) {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("ecom_secondhand")) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    console.log("Secondhand items:", items);
    localStorage.setItem("ecom_secondhand", JSON.stringify(items));
  }, [items]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Secondhand Marketplace</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((p) => (
          <ProductCard
            key={p.id}
            p={p}
            onToggleFav={toggleFav}
            isFav={favorites.includes(p.id)}
            cart={cart}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
          />
        ))}
      </div>
    </div>
  );
}
