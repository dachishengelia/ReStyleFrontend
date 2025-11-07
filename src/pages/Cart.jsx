import React, { useContext } from "react";
import { CartContext } from "../context/CartContext.jsx";

export default function CartPage() {
  const { cart, updateCart, removeFromCart } = useContext(CartContext);

  const handleChange = (id, qty) => {
    if (qty < 1) qty = 1;
    updateCart(id, qty);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {cart.length === 0 && <p>Your cart is empty.</p>}
      {cart.map((item) => (
        <div key={item.productId.id} className="flex items-center justify-between mb-4 border-b pb-3">
          <img src={item.productId.image} className="w-20 h-20 object-cover" />
          <div className="flex-1 mx-4">
            <h3 className="font-semibold">{item.productId.title}</h3>
            <p>{item.productId.price} {item.productId.currency}</p>
          </div>
          <input
            type="number"
            value={item.quantity}
            onChange={(e) => handleChange(item.productId.id, parseInt(e.target.value))}
            className="w-16 border rounded px-2 py-1"
          />
          <button
            onClick={() => removeFromCart(item.id)} // Use the correct cart item ID
            className="text-red-500 hover:underline"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
