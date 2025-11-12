import React, { useEffect, useState } from "react";
import { FiTrash2, FiEdit2, FiX } from "react-icons/fi";
import "./product.css"; // Using same admin theme

const BACKEND_ORIGIN = "http://localhost:8000";

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");

  // ✅ Fetch all categories
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${BACKEND_ORIGIN}/categories`);
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ✅ Add / Edit Category
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    const method = editingCategory ? "PUT" : "POST";
    const url = editingCategory
      ? `${BACKEND_ORIGIN}/categories/${editingCategory._id}`
      : `${BACKEND_ORIGIN}/categories`;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: categoryName }),
    });

    setCategoryName("");
    setEditingCategory(null);
    setShowCategoryForm(false);
    fetchCategories();
  };

  // ✅ Delete Category
  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    await fetch(`${BACKEND_ORIGIN}/categories/${id}`, { method: "DELETE" });
    fetchCategories();
  };

  return (
    <div className="products-page">
      {/* Header */}
      <div className="products-header">
        <h2>Manage Categories</h2>
        <button onClick={() => setShowCategoryForm(true)}>+ Add Category</button>
      </div>

      {/* Categories Table */}
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Category Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 ? (
            categories.map((cat, index) => (
              <tr key={cat._id}>
                <td>{index + 1}</td>
                <td>{cat.name}</td>
                <td>
                  <FiEdit2
                    className="icon-edit"
                    title="Edit"
                    onClick={() => {
                      setEditingCategory(cat);
                      setCategoryName(cat.name);
                      setShowCategoryForm(true);
                    }}
                  />
                  <FiTrash2
                    className="icon-delete"
                    title="Delete"
                    onClick={() => handleDeleteCategory(cat._id)}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: "center", padding: "20px" }}>
                No categories found 
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Popup Form */}
      {showCategoryForm && (
        <div className="popup-overlay">
          <div className="popup-form">
            <FiX
              className="close-icon"
              onClick={() => {
                setShowCategoryForm(false);
                setEditingCategory(null);
              }}
            />
            <form onSubmit={handleCategorySubmit}>
              <h3>{editingCategory ? "Edit Category" : "Add New Category"}</h3>
              <label>Category Name</label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Enter category name"
                required
              />
              <button type="submit">
                {editingCategory ? "Update" : "Add"} Category
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
