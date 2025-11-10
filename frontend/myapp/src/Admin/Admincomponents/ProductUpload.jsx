import React, { useState, useEffect } from "react";
import axios from "axios";
import "./product.css";
import { FiEdit2, FiTrash2, FiX, FiImage } from "react-icons/fi";

export default function ProductUpload() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [preview, setPreview] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    subCategory: "", // ✅ Added subCategory
    image: null,
  });

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8000/products");
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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
    uploadData.append("name", formData.name);
    uploadData.append("price", Number(formData.price));
    uploadData.append("description", formData.description);
    uploadData.append("category", formData.category);
    uploadData.append("subCategory", formData.subCategory); // ✅ Added subCategory
    if (formData.image) uploadData.append("image", formData.image);

    try {
      if (editingProductId) {
        await axios.patch(
          `http://localhost:8000/products/${editingProductId}`,
          uploadData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        alert("Product updated successfully!");
      } else {
        await axios.post("http://localhost:8000/products", uploadData, {
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
    try {
      await axios.delete(`http://localhost:8000/products/${_id}`);
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
      subCategory: p.subCategory || "", // ✅ Load subCategory
      image: null,
    });
    setPreview(p.image ? `http://localhost:8000${p.image}` : null);
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
      subCategory: "", // ✅ Reset subCategory
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
            <th>Subcategory</th> {/* ✅ Added Subcategory column */}
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
                    src={`http://localhost:8000${p.image}`}
                    alt={p.name}
                    width={50}
                  />
                ) : (
                  <FiImage />
                )}
              </td>
              <td>{p.name}</td>
              <td>{p.category}</td>
              <td>{p.subCategory}</td> {/* ✅ Display subCategory */}
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
              <input
                type="text"
                name="category"
                value={formData.category}
                placeholder="Category"
                required
                onChange={handleChange}
              />

              {/* ✅ Subcategory select */}
              <select
                name="subCategory"
                value={formData.subCategory}
                onChange={handleChange}
                required
              >
                <option value="">Select Subcategory</option>
                <option value="Office">Office</option>
                <option value="Summer">Summer</option>
              </select>

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
