import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AddProduct() {
  const [form, setForm] = useState({ name: "", price: "", description: "", category: "" });
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageUpload = async () => {
    if (!imageFile) return null;

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
      return res.data.secure_url;
    } catch (err) {
      console.error("Image upload failed:", err);
      setMessage("Failed to upload image. Please check your Cloudinary configuration.");
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    let uploadedImageUrl = null;
    if (imageFile) {
      uploadedImageUrl = await handleImageUpload();
      if (!uploadedImageUrl) return;
    }

    try {
      const res = await axios.post(
        "/api/products",
        { ...form, imageUrl: uploadedImageUrl || "" },
        { withCredentials: true }
      );
      console.log("Product added:", res.data); // Log the added product
      setMessage("Product added successfully!");
      navigate("/your-products"); // Redirect to "Your Products" page
    } catch (err) {
      console.error("Failed to add product:", err);
      setMessage(err.response?.data?.message || "Failed to add product");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add Product</h2>
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Name"
        required
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
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        className="border p-2 w-full mb-2"
      />
      <input
        name="category"
        value={form.category}
        onChange={handleChange}
        placeholder="Category"
        required
        className="border p-2 w-full mb-2"
      />
      <input
        type="file"
        onChange={(e) => setImageFile(e.target.files[0])}
        className="border p-2 w-full mb-2"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 w-full">
        Add Product
      </button>
      {message && <p className="text-center mt-4 text-green-500">{message}</p>}
    </form>
  );
}
