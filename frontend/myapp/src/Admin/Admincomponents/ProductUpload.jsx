import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./product.css";
import { FiEdit2, FiTrash2, FiX, FiImage, FiPlus, FiUploadCloud } from "react-icons/fi";

const BACKEND_ORIGIN = process.env.REACT_APP_API_URL || "http://localhost:8000";

const imgUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${BACKEND_ORIGIN}${path}`;
};

export default function ProductUpload() {
  const [products, setProducts]         = useState([]);
  const [categories, setCategories]     = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [showForm, setShowForm]         = useState(false);
  const [editingId, setEditingId]       = useState(null);

  // New files chosen by user
  const [newFiles, setNewFiles]         = useState([]);       // File objects
  const [newPreviews, setNewPreviews]   = useState([]);       // blob URLs
  // Existing images kept from the product being edited
  const [keptImages, setKeptImages]     = useState([]);       // path strings

  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: "", price: "", description: "",
    category: "", subCategory: "", size: "",
  });

  const fetchProducts  = () => axios.get(`${BACKEND_ORIGIN}/products`).then(r => setProducts(r.data)).catch(() => {});
  const fetchCategories = () => axios.get(`${BACKEND_ORIGIN}/categories`).then(r => setCategories(Array.isArray(r.data) ? r.data : [])).catch(() => {});

  useEffect(() => { fetchProducts(); fetchCategories(); }, []);

  useEffect(() => {
    const cat = categories.find(c => c.Category === form.category);
    setSubCategories(cat?.subcategories || []);
    setForm(p => ({ ...p, subCategory: "" }));
  }, [form.category, categories]);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  // Handle new file selection — append to existing selection
  const handleFiles = e => {
    const chosen = Array.from(e.target.files);
    const total  = keptImages.length + newFiles.length + chosen.length;
    if (total > 6) { alert("Maximum 6 images allowed."); return; }
    setNewFiles(p => [...p, ...chosen]);
    setNewPreviews(p => [...p, ...chosen.map(f => URL.createObjectURL(f))]);
    e.target.value = "";   // reset so same file can be re-selected
  };

  // Remove a newly added file (not yet uploaded)
  const removeNewFile = idx => {
    URL.revokeObjectURL(newPreviews[idx]);
    setNewFiles(p => p.filter((_, i) => i !== idx));
    setNewPreviews(p => p.filter((_, i) => i !== idx));
  };

  // Remove an already-saved image
  const removeKept = idx => setKeptImages(p => p.filter((_, i) => i !== idx));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.price) { alert("Name and Price are required."); return; }

    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => { if (v !== "") data.append(k, v); });
    newFiles.forEach(f => data.append("images", f));
    data.append("keepImages", JSON.stringify(keptImages));

    try {
      if (editingId) {
        await axios.patch(`${BACKEND_ORIGIN}/products/${editingId}`, data, { headers: { "Content-Type": "multipart/form-data" } });
      } else {
        await axios.post(`${BACKEND_ORIGIN}/products`, data, { headers: { "Content-Type": "multipart/form-data" } });
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      alert(`Error: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleEdit = p => {
    setForm({ name: p.name || "", price: p.price || "", description: p.description || "", category: p.category || "", subCategory: p.subCategory || "", size: p.size || "" });
    setKeptImages(p.images?.length ? p.images : p.image ? [p.image] : []);
    setNewFiles([]);
    setNewPreviews([]);
    setEditingId(p._id);
    setShowForm(true);
  };

  const handleDelete = async id => {
    if (!window.confirm("Delete this product?")) return;
    await axios.delete(`${BACKEND_ORIGIN}/products/${id}`).catch(() => {});
    fetchProducts();
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({ name: "", price: "", description: "", category: "", subCategory: "", size: "" });
    newPreviews.forEach(url => URL.revokeObjectURL(url));
    setNewFiles([]);
    setNewPreviews([]);
    setKeptImages([]);
  };

  const totalImages = keptImages.length + newFiles.length;

  return (
    <div className="products-page">
      <div className="products-header">
        <h2>Products <span style={{ color: "#94a3b8", fontWeight: 400, fontSize: 16 }}>({products.length})</span></h2>
        <button onClick={() => setShowForm(true)}>
          <FiPlus size={15} style={{ marginRight: 6 }} /> Add Product
        </button>
      </div>

      {/* ── Table ── */}
      <table>
        <thead>
          <tr>
            <th>Images</th>
            <th>Name</th>
            <th>Category</th>
            <th>Subcategory</th>
            <th>Size</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr><td colSpan="7" style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}>No products yet.</td></tr>
          ) : products.map(p => {
            const imgs = p.images?.length ? p.images : p.image ? [p.image] : [];
            return (
              <tr key={p._id}>
                <td>
                  <div style={{ display: "flex", gap: 4 }}>
                    {imgs.length > 0 ? imgs.slice(0, 3).map((img, i) => (
                      <img key={i} src={imgUrl(img)} alt="" style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 6, border: "1px solid rgba(255,255,255,0.08)" }} />
                    )) : <FiImage size={24} color="#94a3b8" />}
                    {imgs.length > 3 && <span style={{ fontSize: 12, color: "#94a3b8", alignSelf: "center" }}>+{imgs.length - 3}</span>}
                  </div>
                </td>
                <td style={{ fontWeight: 600 }}>{p.name}</td>
                <td>{p.category}</td>
                <td>{p.subCategory || "—"}</td>
                <td>{p.size || "—"}</td>
                <td>Rs {p.price}</td>
                <td className="actions">
                  <FiEdit2 onClick={() => handleEdit(p)} className="edit-icon" title="Edit" />
                  <FiTrash2 onClick={() => handleDelete(p._id)} className="delete-icon" title="Delete" />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* ── Form popup ── */}
      {showForm && (
        <div className="popup-overlay">
          <div className="popup-form" style={{ maxWidth: 560, width: "100%" }}>
            <button className="close-btn" onClick={resetForm}><FiX size={18} /></button>
            <form onSubmit={handleSubmit}>
              <h3>{editingId ? "Edit Product" : "Add New Product"}</h3>

              <label>Product Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Classic White Shirt" required />

              <label>Category</label>
              <select name="category" value={form.category} onChange={handleChange} required>
                <option value="">Select Category</option>
                {categories.map(c => <option key={c._id} value={c.Category}>{c.Category}</option>)}
              </select>

              <label>Subcategory</label>
              <select name="subCategory" value={form.subCategory} onChange={handleChange}>
                <option value="">Select Subcategory (optional)</option>
                {subCategories.map(s => <option key={s._id} value={s.Name}>{s.Name}</option>)}
              </select>

              <label>Size</label>
              <input type="text" name="size" value={form.size} onChange={handleChange} placeholder="e.g. S, M, L, XL" />

              <label>Price (Rs)</label>
              <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="e.g. 1500" required />

              <label>Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} placeholder="Product description..." />

              {/* ── Multi-image upload ── */}
              <label>
                Product Images
                <span style={{ fontSize: 11, color: "#94a3b8", marginLeft: 8 }}>
                  {totalImages}/6 selected
                </span>
              </label>

              {/* Image previews grid */}
              {(keptImages.length > 0 || newPreviews.length > 0) && (
                <div className="img-preview-grid">
                  {/* Existing saved images */}
                  {keptImages.map((src, i) => (
                    <div key={`kept-${i}`} className="img-preview-item">
                      <img src={imgUrl(src)} alt="" />
                      {i === 0 && <span className="img-primary-badge">Main</span>}
                      <button type="button" className="img-remove-btn" onClick={() => removeKept(i)}>
                        <FiX size={11} />
                      </button>
                    </div>
                  ))}
                  {/* Newly selected files */}
                  {newPreviews.map((src, i) => (
                    <div key={`new-${i}`} className="img-preview-item img-preview-new">
                      <img src={src} alt="" />
                      {keptImages.length === 0 && i === 0 && <span className="img-primary-badge">Main</span>}
                      <button type="button" className="img-remove-btn" onClick={() => removeNewFile(i)}>
                        <FiX size={11} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload button */}
              {totalImages < 6 && (
                <div
                  className="img-upload-zone"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FiUploadCloud size={22} />
                  <span>Click to add images</span>
                  <span style={{ fontSize: 11, color: "#6b7280" }}>PNG, JPG up to 5 MB each · max 6 total</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: "none" }}
                    onChange={handleFiles}
                  />
                </div>
              )}

              <button type="submit" style={{ marginTop: 8 }}>
                {editingId ? "Update Product" : "Save Product"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
