import React from "react"
import products from "../data/products";
import ProductCard from "../components/ProductCard"



export default function DiscountFeed({ favorites, toggleFav }) {
  const discounted = products.filter((p) => p.discount > 0)

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Top Discounts</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {discounted.map((p) => (
          <ProductCard
            key={p.id}
            p={p}
            onToggleFav={toggleFav}
            isFav={favorites.includes(p.id)}
          />
        ))}
      </div>
    </div>
  )
}
