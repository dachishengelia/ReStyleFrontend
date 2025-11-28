import React, { useState } from "react";
import axios from "../axios.js";

export default function AddProduct() {
  const [form, setForm] = useState({ name: "", price: "", description: "", category: "" });
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setError("Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    try {
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`;
      const { data } = await axios.post(cloudinaryUrl, formData); // No withCredentials here
      setImageUrl(data.secure_url);
      setError("");
    } catch (err) {
      console.error("Image upload failed:", err.response?.data || err.message);
      setError(err.response?.data?.error?.message || "Image upload failed. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageUrl) {
      setError("Please upload an image before submitting.");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE}/api/products`,
        { ...form, imageUrl },
        { withCredentials: true }
      );
      setMessage("Product added successfully!");
      setForm({ name: "", price: "", description: "", category: "" });
      setImageUrl("");
      setError("");
    } catch (err) {
      console.error("Failed to add product:", err);
      setError(err.response?.data?.message || "Failed to add product.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Add Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Product Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="border p-2 w-full"
          />
          {error && <p className="text-red-500">{error}</p>}
          {imageUrl && <img src={imageUrl} alt="Uploaded" className="mt-4 w-32 h-32 object-cover" />}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Product Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product Name"
            className="border p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Price</label>
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            className="border p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Category</label>
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category"
            className="border p-2 w-full"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Product
        </button>
        {message && <p className="text-green-500 mt-4">{message}</p>}
      </form>
    </div>
  );
}
