import React, { useState } from "react";
import "./user.css";
import { FiEdit2, FiTrash2, FiX } from "react-icons/fi";

export default function Users() {
  const [users, setUsers] = useState(() => {
    const userData = localStorage.getItem("users");
    if (!userData) return [];
    return JSON.parse(userData);
  });
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    address: "",
    email: "",
  });
console.log("users", users);
 localStorage.setItem("users", JSON.stringify(users));
  // handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // add or edit user
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.contact || !formData.address || !formData.email) {
      alert("Please fill in all fields!");
      return;
    }

    if (isEditing) {
      const updated = [...users];
      updated[editIndex] = formData;
      setUsers(updated);
      setIsEditing(false);
      setEditIndex(null);
    } else {
      setUsers([...users, formData]);
    }

    setFormData({ name: "", contact: "", address: "", email: "" });
    setShowForm(false);
  };

  // edit user
  const handleEdit = (index) => {
    setIsEditing(true);
    setEditIndex(index);
    setFormData(users[index]);
    setShowForm(true);
  };

  // delete user
  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const updated = users.filter((_, i) => i !== index);
      setUsers(updated);
    }
  };

  return (
    <div className="user-table-container">
      <div className="user-header">
        <h2 className="user-title">
          Users <span className="count">({users.length})</span>
        </h2>
        <button className="add-btn" onClick={() => setShowForm(true)}>
          + Add User
        </button>
      </div>

      <table className="user-table">
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Contact</th>
            <th>Address</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", color: "#888" }}>
                No users added yet
              </td>
            </tr>
          ) : (
            users.map((user, index) => (
              <tr key={index}>
                <td>{user.name}</td>
                <td>{user.contact}</td>
                <td>{user.address}</td>
                <td>{user.email}</td>
                <td>
                  <FiEdit2 className="edit" onClick={() => handleEdit(index)} />
                  <FiTrash2 className="delete" onClick={() => handleDelete(index)} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showForm && (
        <div className="popup-overlay">
          <div className="popup-form">
            <div className="popup-header">
              <h3>{isEditing ? "Edit User" : "Add New User"}</h3>
              <FiX className="close-icon" onClick={() => setShowForm(false)} />
            </div>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Customer Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="contact"
                placeholder="Contact"
                value={formData.contact}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <button type="submit" className="save-btn">
                {isEditing ? "Update User" : "Save User"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
