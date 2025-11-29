import React, { useState } from "react";
import axios from "../axios.js";

export default function AddProduct() {
  const [form, setForm] = useState({ name: "", price: "", description: "", category: "" });
  // const [imageUrl, setImageUrl] = useState(""); // disabled for now
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // IMAGE UPLOAD DISABLED
  // const handleImageUpload = async (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;
  //   const formData = new FormData();
  //   formData.append("file", file);
  //   formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
  //   const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`;
  //   try {
  //     const { data } = await axios.post(cloudinaryUrl, formData);
  //     setImageUrl(data.secure_url);
  //   } catch (err) {
  //     setError("Image upload failed");
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE}/api/products`,
        { ...form }, // no imageUrl
        { withCredentials: true }
      );

      setMessage("Product added successfully!");
      setForm({ name: "", price: "", description: "", category: "" });
      setError("");
    } catch (err) {
      setError("Failed to add product.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Add Product</h2>
      <form onSubmit={handleSubmit}>

        {/* IMAGE INPUT HIDDEN FOR NOW */}
        {/* 
        <div className="mb-4">
          <label className="block text-gray-700">Product Image</label>
          <input type="file" onChange={handleImageUpload} className="border p-2 w-full" />
        </div>
        */}

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

        {error && <p className="text-red-500 mt-3">{error}</p>}
        {message && <p className="text-green-500 mt-3">{message}</p>}
      </form>
    </div>
  );
}
