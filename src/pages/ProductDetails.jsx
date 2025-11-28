import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../axios.js";

export default function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_PROD}/api/products/${productId}`);
        setProduct(data);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError("Product not found");
        } else {
          setError("Failed to fetch product details");
        }
      }
    };

    fetchProduct();
  }, [productId]);

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">{error}</h2>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Go Back to Home
        </button>
      </div>
    );
  }

  if (!product) {
    return <p className="text-center">Loading...</p>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <img
            src={product.imageUrl || "/placeholder.png"}
            alt={product.name}
            className="w-full h-auto rounded-lg"
          />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-4">{product.name}</h2>
          <p className="text-gray-700 mb-4">{product.description}</p>
          <p className="text-lg font-semibold mb-4">{product.price} GEL</p>
          <p className="text-sm text-gray-500 mb-4">
            Seller: {product.sellerId?.username || "Unknown"}
          </p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
