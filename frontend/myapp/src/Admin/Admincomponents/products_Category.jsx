import React, { useEffect, useState } from "react";
import {
  FiTrash2,
  FiEdit2,
  FiX,
  FiPlus,
  FiChevronDown,
  FiChevronRight,
  FiTag,
} from "react-icons/fi";
import "./product.css";
import "./category.css";

const BACKEND_ORIGIN = process.env.REACT_APP_API_URL || "http://localhost:8000";

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);

  // Category form state
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");

  // Subcategory form state
  const [showSubForm, setShowSubForm] = useState(false);
  const [subParent, setSubParent] = useState(null); // the category we're adding sub to
  const [subName, setSubName] = useState("");

  // Expanded rows
  const [expandedRows, setExpandedRows] = useState({});

  // ── Fetch ──────────────────────────────────────────
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${BACKEND_ORIGIN}/categories`);
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ── Toggle expand ──────────────────────────────────
  const toggleRow = (id) =>
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));

  // ── Add / Edit Category ────────────────────────────
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
      body: JSON.stringify({ Category: categoryName }),
    });

    setCategoryName("");
    setEditingCategory(null);
    setShowCategoryForm(false);
    fetchCategories();
  };

  // ── Delete Category ────────────────────────────────
  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Delete this category and all its subcategories?")) return;
    await fetch(`${BACKEND_ORIGIN}/categories/${id}`, { method: "DELETE" });
    fetchCategories();
  };

  // ── Open Add Subcategory form ──────────────────────
  const openSubForm = (cat) => {
    setSubParent(cat);
    setSubName("");
    setShowSubForm(true);
  };

  // ── Add Subcategory ────────────────────────────────
  const handleSubSubmit = async (e) => {
    e.preventDefault();
    if (!subName.trim() || !subParent) return;

    await fetch(`${BACKEND_ORIGIN}/categories/${subParent._id}/subcategory`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Name: subName }),
    });

    setSubName("");
    setShowSubForm(false);
    setSubParent(null);
    // Auto-expand the parent row after adding
    setExpandedRows((prev) => ({ ...prev, [subParent._id]: true }));
    fetchCategories();
  };

  // ── Delete Subcategory ─────────────────────────────
  const handleDeleteSub = async (catId, subId) => {
    if (!window.confirm("Delete this subcategory?")) return;
    await fetch(`${BACKEND_ORIGIN}/categories/${catId}/subcategory/${subId}`, {
      method: "DELETE",
    });
    fetchCategories();
  };

  // ── Reset category form ────────────────────────────
  const closeCategoryForm = () => {
    setShowCategoryForm(false);
    setEditingCategory(null);
    setCategoryName("");
  };

  return (
    <div className="products-page">
      {/* ── Page Header ── */}
      <div className="products-header">
        <h2>
          Manage Categories
          <span className="cat-count">{categories.length}</span>
        </h2>
        <button onClick={() => setShowCategoryForm(true)}>
          <FiPlus size={15} style={{ marginRight: 6 }} />
          Add Category
        </button>
      </div>

      {/* ── Categories Table ── */}
      <table className="cat-table">
        <thead>
          <tr>
            <th style={{ width: 40 }}></th>
            <th>#</th>
            <th>Category Name</th>
            <th>Subcategories</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.length === 0 ? (
            <tr>
              <td colSpan="5" className="cat-empty">
                <FiTag size={32} />
                <p>No categories yet. Add your first one.</p>
              </td>
            </tr>
          ) : (
            categories.map((cat, index) => (
              <React.Fragment key={cat._id}>
                {/* ── Category Row ── */}
                <tr className="cat-row">
                  {/* Expand toggle */}
                  <td>
                    <button
                      className="expand-btn"
                      onClick={() => toggleRow(cat._id)}
                      title={expandedRows[cat._id] ? "Collapse" : "Expand subcategories"}
                    >
                      {expandedRows[cat._id] ? (
                        <FiChevronDown size={16} />
                      ) : (
                        <FiChevronRight size={16} />
                      )}
                    </button>
                  </td>
                  <td className="cat-index">{index + 1}</td>
                  <td className="cat-name">{cat.Category}</td>
                  <td>
                    <span className="sub-badge">
                      {cat.subcategories?.length || 0} subcategories
                    </span>
                  </td>
                  <td>
                    <div className="actions">
                      {/* Add subcategory */}
                      <button
                        className="action-btn add-sub-btn"
                        title="Add subcategory"
                        onClick={() => openSubForm(cat)}
                      >
                        <FiPlus size={14} />
                        <span>Add Sub</span>
                      </button>
                      {/* Edit category */}
                      <button
                        className="action-btn edit-btn"
                        title="Edit category"
                        onClick={() => {
                          setEditingCategory(cat);
                          setCategoryName(cat.Category);
                          setShowCategoryForm(true);
                        }}
                      >
                        <FiEdit2 size={14} />
                      </button>
                      {/* Delete category */}
                      <button
                        className="action-btn delete-btn"
                        title="Delete category"
                        onClick={() => handleDeleteCategory(cat._id)}
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>

                {/* ── Subcategory Rows (expanded) ── */}
                {expandedRows[cat._id] && (
                  <tr className="sub-row-wrapper">
                    <td colSpan="5" style={{ padding: 0 }}>
                      <div className="sub-list">
                        {cat.subcategories?.length === 0 ? (
                          <div className="sub-empty">
                            No subcategories yet.{" "}
                            <button
                              className="sub-empty-link"
                              onClick={() => openSubForm(cat)}
                            >
                              Add one
                            </button>
                          </div>
                        ) : (
                          cat.subcategories.map((sub) => (
                            <div key={sub._id} className="sub-item">
                              <span className="sub-dot" />
                              <span className="sub-name">{sub.Name}</span>
                              <button
                                className="sub-delete-btn"
                                title="Delete subcategory"
                                onClick={() => handleDeleteSub(cat._id, sub._id)}
                              >
                                <FiTrash2 size={13} />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          )}
        </tbody>
      </table>

      {/* ── Add / Edit Category Popup ── */}
      {showCategoryForm && (
        <div className="popup-overlay">
          <div className="popup-form">
            <button className="close-icon" onClick={closeCategoryForm}>
              <FiX size={18} />
            </button>
            <form onSubmit={handleCategorySubmit}>
              <h3>{editingCategory ? "Edit Category" : "Add New Category"}</h3>
              <label>Category Name</label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="e.g. Men, Women, Kids"
                required
                autoFocus
              />
              <button type="submit">
                {editingCategory ? "Update Category" : "Add Category"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Add Subcategory Popup ── */}
      {showSubForm && subParent && (
        <div className="popup-overlay">
          <div className="popup-form">
            <button
              className="close-icon"
              onClick={() => {
                setShowSubForm(false);
                setSubParent(null);
              }}
            >
              <FiX size={18} />
            </button>
            <form onSubmit={handleSubSubmit}>
              <h3>Add Subcategory</h3>
              <p className="sub-form-parent">
                Under: <strong>{subParent.Category}</strong>
              </p>
              <label>Subcategory Name</label>
              <input
                type="text"
                value={subName}
                onChange={(e) => setSubName(e.target.value)}
                placeholder="e.g. T-Shirts, Jeans, Jackets"
                required
                autoFocus
              />
              <button type="submit">Add Subcategory</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
