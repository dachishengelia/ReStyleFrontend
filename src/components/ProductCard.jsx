import React, { useContext } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext.jsx";
import { AuthContext } from "../context/AuthContext.jsx";

const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(id);

export default function ProductCard({ p, onToggleFav, isFav, onDelete }) {
  const { cart, addToCart, removeFromCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const isInCart = Array.isArray(cart) && cart.some((item) => item?.productId?._id === p?._id);

  const handleCartAction = () => {
    if (!p?._id) return;

    if (isInCart) {
      const cartItem = cart.find((item) => item?.productId?._id === p?._id);
      if (cartItem) removeFromCart(cartItem._id);
    } else {
      addToCart(p._id, 1);
    }
  };

  const handleBuyNow = async () => {
    try {
      const res = await axios.post(
        "https://re-style-backend.vercel.app/checkout/create-session",
        { productId: p._id },
        { withCredentials: true }
      );

      window.location.href = res.data.url;
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
  };

  const handleDelete = async () => {
    if (!p?._id || !onDelete) return;
    try {
      await onDelete(p._id);
    } catch (err) {
      console.error("Failed to delete product:", err);
      alert("Failed to delete product");
    }
  };

  if (!p) return null;

  return (
    <div className="border rounded overflow-hidden shadow-sm bg-white hover:shadow-lg transition-shadow">
      <div className="relative">
        <img src={p.image} alt={p.title} className="w-full h-48 object-cover" />
        {p.discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            {p.discount}% OFF
          </span>
        )}
        {p.secondhand && (
          <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
            2nd Hand
          </span>
        )}
      </div>

      <div className="p-3">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold">{p.title}</h3>
          <button onClick={() => onToggleFav(p._id)} className="text-sm">
            {isFav ? "♥" : "♡"}
          </button>
        </div>

        <p className="text-sm text-gray-500">{p.category}</p>

        <div className="mt-2 flex items-center justify-between">
          <div className="text-lg font-bold">{p.price} GEL</div>
        </div>

        <button
          onClick={handleCartAction}
          className={`mt-3 w-full ${
            isInCart ? "bg-red-600" : "bg-blue-600"
          } text-white py-2 rounded hover:bg-opacity-80 transition`}
        >
          {isInCart ? "Remove from Cart" : "Add to Cart"}
        </button>

        <button
          onClick={handleBuyNow}
          className="mt-2 bg-green-600 text-white py-2 rounded w-full hover:bg-green-700"
        >
          Buy Now
        </button>

        {user?.role === "admin" || user?.role === "seller" ? (
          <button
            onClick={handleDelete}
            className="mt-2 bg-red-500 text-white py-2 rounded w-full hover:bg-red-600"
          >
            Delete
          </button>
        ) : null}
      </div>
    </div>
  );
}
