import { useState } from "react";
import axios from "axios";

export default function AddProduct() {
  const [form, setForm] = useState({ name: "", description: "", price: "", imageUrl: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const api = axios.create({
    baseURL: "http://localhost:3000/api",
    withCredentials: true, // Ensure cookies are sent with requests
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/products", form);
      alert(res.data.message);
      setForm({ name: "", description: "", price: "", imageUrl: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to add product");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto">
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Name"
        required
        className="border p-2 w-full mb-2"
      />
      <input
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        className="border p-2 w-full mb-2"
      />
      <input
        name="price"
        type="number"
        value={form.price}
        onChange={handleChange}
        placeholder="Price"
        required
        className="border p-2 w-full mb-2"
      />
      <input
        name="imageUrl"
        value={form.imageUrl}
        onChange={handleChange}
        placeholder="Image URL"
        className="border p-2 w-full mb-2"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 w-full">
        Add Product
      </button>
    </form>
  );
}
