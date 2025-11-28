import React, { useContext } from "react";
import { CartContext } from "../context/CartContext.jsx";

export default function CartPage() {
  const { cart, updateCart, removeFromCart } = useContext(CartContext);

  const handleChange = (id, qty) => {
    if (qty < 1) qty = 1; 
    updateCart(id, qty);
  };

  const handleRemove = async (id) => {
    try {
      await removeFromCart(id);
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
    }
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + (item.product?.price || 0) * (item.quantity || 1),
    0
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Your Cart</h2>
      {cart.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="space-y-6">
          {cart.map((item) => (
            <div
              key={item._id} 
              className="flex items-center justify-between border-b pb-4"
            >
              <img
                src={item.product?.imageUrl || item.product?.image || "/placeholder.png"}
                className="w-24 h-24 object-cover rounded"
                alt={item.product?.name || item.product?.title || "Product"}
              />
              <div className="flex-1 mx-4">
                <h3 className="font-semibold text-lg">
                  {item.product?.name || item.product?.title || "Unnamed Product"} - 
                  <span className="text-gray-500">{item.product?.price || 0} GEL</span>
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleChange(item._id, (item.quantity || 1) - 1)}
                  className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <input
                  type="number"
                  value={item.quantity || 1} 
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value) && value > 0) {
                      handleChange(item._id, value);
                    }
                  }}
                  className="w-12 text-center border rounded"
                />
                <button
                  onClick={() => handleChange(item._id, (item.quantity || 1) + 1)}
                  className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => handleRemove(item._id)} 
                className="text-red-500 hover:underline ml-4"
                aria-label="Remove item"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="flex justify-between items-center mt-6">
            <h3 className="text-xl font-bold">Total: {totalPrice.toFixed(2)} GEL</h3>
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              onClick={() => {
                // Add functionality to handle payment
                console.log("Redirect to payment page or handle payment");
              }}
            >
              Pay for All
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
