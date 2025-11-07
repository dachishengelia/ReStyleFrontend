import React from "react"
import products from "../data/products";
import ProductCard from "../components/ProductCard"



export default function Favorites({ favorites, toggleFav }) {
  const favItems = products.filter((p) => favorites.includes(p.id))

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Favorites</h1>
      {favItems.length === 0 ? (
        <p>No favorites yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {favItems.map((p) => (
            <ProductCard
              key={p.id}
              p={p}
              onToggleFav={toggleFav}
              isFav={favorites.includes(p.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
