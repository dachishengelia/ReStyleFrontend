import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext.jsx";

const AdminPanel = () => {
  const { user, fetchUser } = useContext(AuthContext);
  const [stats, setStats] = useState({ totalUsers: 0, buyers: 0, sellers: 0, admins: 0 });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const api = axios.create({
    baseURL: "http://localhost:3000/",
    withCredentials: true, // Ensure cookies are sent with requests
  });

  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/stats");
      console.log("Fetched stats:", res.data); // Debugging log
      setStats(res.data); // Ensure the backend returns { totalUsers, buyers, sellers, admins }
    } catch (err) {
      console.error("Failed to fetch stats:", err); // Debugging log
      if (err.response?.status === 401) {
        alert("Unauthorized: Please log in again.");
      }
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      console.log("Fetched users:", res.data); // Debugging log
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err); // Debugging log
      if (err.response?.status === 401) {
        alert("Unauthorized: Please log in again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(users.filter((user) => user._id !== id));
    } catch (err) {
      console.error("Failed to delete user:", err);
      alert("Failed to delete user");
    }
  };

  const changeUserRole = async (id, newRole) => {
    try {
      const res = await api.patch(`/admin/users/${id}/role`, { role: newRole });
      setUsers(users.map((u) => (u._id === id ? res.data : u)));
    } catch (err) {
      console.error("Failed to update role:", err);
      alert("Failed to update role");
    }
  };

  useEffect(() => {
    if (!user) {
      fetchUser(); // Fetch user data on page load
    }
    fetchStats();
    fetchUsers();
  }, [user]);

  if (loading) return <div>Loading admin panel...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>

      <div>
        <h2>Stats</h2>
        <div>Total Users: {stats.totalUsers}</div>
        <div>Buyers: {stats.buyers}</div>
        <div>Sellers: {stats.sellers}</div>
        <div>Admins: {stats.admins}</div>
      </div>

      <hr />

      <h2>All Users</h2>
      <table
        border="1"
        cellPadding="8"
        style={{ borderCollapse: "collapse", width: "100%" }}
      >
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Change Role</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <select
                  value={u.role}
                  onChange={(e) => changeUserRole(u._id, e.target.value)}
                >
                  <option value="buyer">Buyer</option>
                  <option value="seller">Seller</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td>
                <button
                  onClick={() => deleteUser(u._id)}
                  style={{ backgroundColor: "red", color: "white" }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
