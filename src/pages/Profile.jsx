import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext.jsx";

export default function Profile() {
  const { user, logIn, signOut } = useContext(AuthContext);
  const [form, setForm] = useState({ username: user.username, oldPassword: "", newPassword: "", confirmPassword: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      setMessage("New passwords do not match.");
      return;
    }

    try {
      const res = await axios.patch(
        "http://localhost:3000/users/update",
        { username: form.username, oldPassword: form.oldPassword, newPassword: form.newPassword },
        { withCredentials: true }
      );
      logIn(res.data.user);
      setMessage("Profile updated successfully.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to update profile.");
    }
  };

  const handleSignOut = () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      signOut();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 max-w-lg w-full mx-auto bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-center">Update Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="New Username"
              className="w-full border rounded-lg px-4 py-2 focus:ring-primary-color focus:border-primary-color"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Old Password</label>
            <input
              type="password"
              name="oldPassword"
              value={form.oldPassword}
              onChange={handleChange}
              placeholder="Old Password"
              className="w-full border rounded-lg px-4 py-2 focus:ring-primary-color focus:border-primary-color"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              placeholder="New Password"
              className="w-full border rounded-lg px-4 py-2 focus:ring-primary-color focus:border-primary-color"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm New Password"
              className="w-full border rounded-lg px-4 py-2 focus:ring-primary-color focus:border-primary-color"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Update Profile
          </button>
        </form>
        <button
          onClick={handleSignOut}
          className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 mt-4 transition"
        >
          Sign Out
        </button>
        {message && <p className="text-center mt-4 text-gray-700">{message}</p>}
      </div>
    </div>
  );
}
