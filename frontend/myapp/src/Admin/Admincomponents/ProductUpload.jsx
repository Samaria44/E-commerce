import React, { useState, useEffect } from "react";
import axios from "axios";
import "./product.css";
import { FiEdit2, FiTrash2, FiX, FiImage } from "react-icons/fi";

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
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Update subcategories when category changes
  useEffect(() => {
    const selectedCat = categories.find(
      (cat) => cat.name === formData.category
    );
    setSubCategories(selectedCat?.subCategories || []);

    // Reset subCategory whenever category changes
    setFormData((prev) => ({ ...prev, subCategory: "" }));
  }, [formData.category, categories]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files && files[0]) {
      setFormData({ ...formData, image: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert("Name and Price are required.");
      return;
    }

    const uploadData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) uploadData.append(key, value);
    });

    try {
      if (editingProductId) {
        await axios.patch(
          `${BACKEND_ORIGIN}/products/${editingProductId}`,
          uploadData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        alert("Product updated successfully!");
      } else {
        await axios.post(`${BACKEND_ORIGIN}/products`, uploadData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Product uploaded successfully!");
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      console.error(
        "Error saving product:",
        error.response?.data || error.message
      );
      alert(
        `Error saving product: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  // Delete product
  const handleDelete = async (_id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await axios.delete(`${BACKEND_ORIGIN}/products/${_id}`);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error deleting product!");
    }
  };

  // Edit product
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

  // Reset form
  const resetForm = () => {
    setShowForm(false);
    setFormData({
      name: "",
      price: "",
      description: "",
      category: "",
      subCategory: "",
      size: "",
      image: null,
    });
    setPreview(null);
    setEditingProductId(null);
  };

  return (
    <div className="products-page">
      <div className="products-header">
        <h2>Products ({products.length})</h2>
        <button onClick={() => setShowForm(true)}>+ Add Product</button>
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
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td>
                {p.image ? (
                  <img
                    src={`${BACKEND_ORIGIN}${p.image}`}
                    alt={p.name}
                    width={50}
                  />
                ) : (
                  <FiImage />
                )}
              </td>
              <td>{p.name}</td>
              <td>{p.category}</td>
              <td>{p.subCategory}</td>
              <td>{p.size}</td>
              <td>{p.price}</td>
              <td>{p.description}</td>
              <td className="actions">
                <FiEdit2 onClick={() => handleEdit(p)} className="edit-icon" />
                <FiTrash2
                  onClick={() => handleDelete(p._id)}
                  className="delete-icon"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <div className="popup-overlay">
          <div className="popup-form">
            <FiX className="close-btn" onClick={resetForm} />
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                value={formData.name}
                placeholder="Product Name"
                required
                onChange={handleChange}
              />

              {/* Category Dropdown */}
           <select
  name="category"
  value={formData.category}
  onChange={handleChange}
  required
>
  <option value="">Select Category</option>
  {categories.map((cat) => (
    <option key={cat._id} value={cat.name}>
      {cat.name}
    </option>
  ))}
</select>


              {/* Subcategory Dropdown */}
              <select
                name="subCategory"
                value={formData.subCategory}
                onChange={handleChange}
                required
              >
                <option value="">Select Subcategory</option>
                {categories
                  .find((cat) => cat.name === formData.category)
                  ?.subCategories.map((sub) => (
                    <option key={sub._id} value={sub.name}>
                      {sub.name}
                    </option>
                  ))}
              </select>

              {/* Size Input */}
              <input
                type="text"
                name="size"
                value={formData.size}
                placeholder="Size (e.g. S, M, L, XL)"
                required
                onChange={handleChange}
                className="styled-input"
              />

              <input
                type="number"
                name="price"
                value={formData.price}
                placeholder="Price"
                required
                onChange={handleChange}
              />
              <textarea
                name="description"
                value={formData.description}
                placeholder="Description"
                onChange={handleChange}
              ></textarea>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
              />
              {preview && <img src={preview} alt="Preview" width={80} />}
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
