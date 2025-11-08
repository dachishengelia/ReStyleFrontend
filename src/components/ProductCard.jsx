import React, { useContext } from "react";
import { CartContext } from "../context/CartContext.jsx";

export default function ProductCard({ p, onToggleFav, isFav }) {
  const { cart, addToCart, removeFromCart } = useContext(CartContext);
  const discountedPrice = p.discount > 0 ? Math.round(p.price * (1 - p.discount / 100)) : p.price;

  const handleCartAction = () => {
    console.log("Handling cart action for product:", p.id); // Debugging log
    const cartItem = cart.find((item) => item.productId._id === p.id);
    if (cartItem) {
      console.log("Removing from cart:", cartItem._id); // Debugging log
      removeFromCart(cartItem._id);
    } else {
      console.log("Adding to cart:", p.id); // Debugging log
      addToCart(p.id, 1); // Ensure `p.id` is used correctly
    }
  };

  return (
    <div className="border rounded overflow-hidden shadow-sm bg-white">
      <img src={p.image} alt={p.title} className="w-full h-48 object-cover" />
      <div className="p-3">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold">{p.title}</h3>
          <button onClick={() => onToggleFav(p.id)} className="text-sm">
            {isFav ? "♥" : "♡"}
          </button>
        </div>
        <p className="text-sm text-gray-500">{p.category} • {p.color}</p>
        <div className="mt-2 flex items-center justify-between">
          <div>
            <div className="text-lg font-bold">
              {discountedPrice} {p.currency}
              {p.discount > 0 && (
                <span className="line-through text-gray-400 ml-2 text-sm">
                  {p.price} {p.currency}
                </span>
              )}
            </div>
            {p.discount > 0 && <div className="text-sm text-green-600">{p.discount}% off</div>}
          </div>
          {p.secondhand && <div className="text-xs px-2 py-1 border rounded">2nd hand</div>}
        </div>
        <button
          onClick={handleCartAction}
          className={`mt-3 w-full ${
            cart.some((item) => item.productId._id === p.id) ? "bg-red-600" : "bg-blue-600"
          } text-white py-2 rounded hover:bg-opacity-80 transition`}
        >
          {cart.some((item) => item.productId._id === p.id) ? "Remove from Cart" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
