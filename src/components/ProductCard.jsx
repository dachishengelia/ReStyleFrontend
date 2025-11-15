import React, { useContext } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext.jsx";
import { AuthContext } from "../context/AuthContext.jsx";

const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(id);

export default function ProductCard({ p, onToggleFav, isFav }) {
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

  if (!p) return null;

  return (
    <div className="border rounded overflow-hidden shadow-sm bg-white">
      <img src={p.imageUrl} alt={p.name} className="w-full h-48 object-cover" />

      <div className="p-3">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold">{p.name}</h3>
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
      </div>
    </div>
  );
}
