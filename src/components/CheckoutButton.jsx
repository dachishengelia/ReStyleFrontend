// src/components/CheckoutButton.jsx
import React from "react";

const CheckoutButton = ({ items }) => {
  const handleCheckout = async () => {
    const transformedItems = items.map(item => ({
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity
    }));
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: transformedItems })
    });
    const { url } = await response.json();
    window.location.href = url;
  };

  return (
    <button onClick={handleCheckout} className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
      Checkout
    </button>
  );
};

export default CheckoutButton;
