import React, { useState, useContext, useEffect } from "react"
import ProductCard from "../components/ProductCard"
import { AuthContext } from "../context/AuthContext"




export default function Secondhand({ favorites, toggleFav }) {
  const { user } = useContext(AuthContext)
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("ecom_secondhand")) || []
    } catch {
      return []
    }
  })
  const [title, setTitle] = useState("")
  const [price, setPrice] = useState("")
  const [image, setImage] = useState("")

  useEffect(() => {
    localStorage.setItem("ecom_secondhand", JSON.stringify(items))
  }, [items])

  const addItem = () => {
    if (!title || !price) return
    const newItem = {
      id: Date.now(),
      title,
      price: parseInt(price),
      discount: 0,
      currency: "₾",
      category: "secondhand",
      color: "mixed",
      size: "-",
      image: image || "https://via.placeholder.com/300",
      secondhand: true,
    }
    setItems([...items, newItem])
    setTitle("")
    setPrice("")
    setImage("")
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Secondhand Marketplace</h1>
      {user && user.role === "seller" && (
        <div className="mb-4 p-3 border rounded bg-gray-50">
          <h2 className="font-semibold mb-2">Add Item</h2>
          <input
            type="text"
            placeholder="Title"
            className="border p-2 rounded w-full mb-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="number"
            placeholder="Price"
            className="border p-2 rounded w-full mb-2"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <input
            type="text"
            placeholder="Image URL"
            className="border p-2 rounded w-full mb-2"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
          <button
            onClick={addItem}
            className="bg-green-600 text-white py-2 px-4 rounded"
          >
            Add
          </button>
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((p) => (
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
