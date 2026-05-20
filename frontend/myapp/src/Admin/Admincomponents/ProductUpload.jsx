import React, { useState, useEffect } from "react";
import axios from "axios";
import "./product.css";
import { FiEdit2, FiTrash2, FiX, FiImage, FiPlus } from "react-icons/fi";

const BACKEND_ORIGIN = "http://localhost:8000";

export default function ProductUpload() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [preview, setPreview] = useState(null);
  const [subCategories, setSubCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    subCategory: "",
    size: "",
    image: null,
  });

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${BACKEND_ORIGIN}/products`);
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BACKEND_ORIGIN}/categories`);
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Update subcategories when category changes
  // Fixed: backend uses cat.Category and cat.subcategories[].Name
  useEffect(() => {
    const selectedCat = categories.find(
      (cat) => cat.Category === formData.category
    );
    setSubCategories(selectedCat?.subcategories || []);
    setFormData((prev) => ({ ...prev, subCategory: "" }));
  }, [formData.category, categories]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files && files[0]) {
      setFormData({ ...formData, image: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert("Name and Price are required.");
      return;
    }

    const uploadData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== "") uploadData.append(key, value);
    });

    try {
      if (editingProductId) {
        await axios.patch(
          `${BACKEND_ORIGIN}/products/${editingProductId}`,
          uploadData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        await axios.post(`${BACKEND_ORIGIN}/products`, uploadData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error.response?.data || error.message);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDelete = async (_id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(`${BACKEND_ORIGIN}/products/${_id}`);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEdit = (p) => {
    setFormData({
      name: p.name || "",
      price: p.price || "",
      description: p.description || "",
      category: p.category || "",
      subCategory: p.subCategory || "",
      size: p.size || "",
      image: null,
    });
    setPreview(p.image ? `${BACKEND_ORIGIN}${p.image}` : null);
    setEditingProductId(p._id);
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setFormData({ name: "", price: "", description: "", category: "", subCategory: "", size: "", image: null });
    setPreview(null);
    setEditingProductId(null);
  };

  return (
    <div className="products-page">
      <div className="products-header">
        <h2>Products <span style={{ color: "#94a3b8", fontWeight: 400, fontSize: 16 }}>({products.length})</span></h2>
        <button onClick={() => setShowForm(true)}>
          <FiPlus size={15} style={{ marginRight: 6 }} />
          Add Product
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Subcategory</th>
            <th>Size</th>
            <th>Price</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
                No products yet. Add your first one.
              </td>
            </tr>
          ) : (
            products.map((p) => (
              <tr key={p._id}>
                <td>
                  {p.image ? (
                    <img src={`${BACKEND_ORIGIN}${p.image}`} alt={p.name} />
                  ) : (
                    <FiImage size={24} color="#94a3b8" />
                  )}
                </td>
                <td style={{ fontWeight: 600 }}>{p.name}</td>
                <td>{p.category}</td>
                <td>{p.subCategory || "-"}</td>
                <td>{p.size || "-"}</td>
                <td>Rs {p.price}</td>
                <td style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {p.description || "-"}
                </td>
                <td className="actions">
                  <FiEdit2 onClick={() => handleEdit(p)} className="edit-icon" title="Edit" />
                  <FiTrash2 onClick={() => handleDelete(p._id)} className="delete-icon" title="Delete" />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showForm && (
        <div className="popup-overlay">
          <div className="popup-form">
            <button className="close-btn" onClick={resetForm}>
              <FiX size={18} />
            </button>
            <form onSubmit={handleSubmit}>
              <h3>{editingProductId ? "Edit Product" : "Add New Product"}</h3>

              <label>Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                placeholder="e.g. Classic White Shirt"
                required
                onChange={handleChange}
              />

              {/* Category — fixed: uses cat.Category */}
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleChange} required>
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.Category}>
                    {cat.Category}
                  </option>
                ))}
              </select>

              {/* Subcategory — fixed: uses cat.subcategories[].Name */}
              <label>Subcategory</label>
              <select name="subCategory" value={formData.subCategory} onChange={handleChange}>
                <option value="">Select Subcategory (optional)</option>
                {subCategories.map((sub) => (
                  <option key={sub._id} value={sub.Name}>
                    {sub.Name}
                  </option>
                ))}
              </select>

              <label>Size</label>
              <input
                type="text"
                name="size"
                value={formData.size}
                placeholder="e.g. S, M, L, XL"
                onChange={handleChange}
                className="styled-input"
              />

              <label>Price (Rs)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                placeholder="e.g. 1500"
                required
                onChange={handleChange}
              />

              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                placeholder="Product description..."
                onChange={handleChange}
              />

              <label>Product Image</label>
              <input type="file" name="image" accept="image/*" onChange={handleChange} />
              {preview && (
                <img src={preview} alt="Preview" style={{ width: 80, height: 80, objectFit: "cover" }} />
              )}

              <button type="submit">
                {editingProductId ? "Update Product" : "Save Product"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
