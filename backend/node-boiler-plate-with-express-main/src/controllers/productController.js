const Product = require("../models/productModel");

// Helper — normalise images field so old single-image products still work
const normalise = (product) => {
  const obj = product.toObject ? product.toObject() : { ...product };
  // If images array is empty but legacy image field exists, populate it
  if ((!obj.images || obj.images.length === 0) && obj.image) {
    obj.images = [obj.image];
  }
  // Always expose a primary image for components that still read .image
  if (!obj.image && obj.images && obj.images.length > 0) {
    obj.image = obj.images[0];
  }
  return obj;
};

// GET all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products.map(normalise));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(normalise(product));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST add new product (supports multiple images via req.files)
exports.addProduct = async (req, res) => {
  try {
    const { name, price, description, category, subCategory, size } = req.body;

    // req.files is an array when using upload.array()
    const images = req.files && req.files.length > 0
      ? req.files.map(f => `/uploads/${f.filename}`)
      : req.file ? [`/uploads/${req.file.filename}`] : [];

    const newProduct = new Product({
      name,
      price,
      description,
      category,
      subCategory,
      size,
      images,
      image: images[0] || "",   // keep legacy field in sync
    });

    await newProduct.save();
    res.status(201).json(normalise(newProduct));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH update product
exports.updateProduct = async (req, res) => {
  try {
    const { name, price, description, category, subCategory, size, keepImages } = req.body;

    const updatedData = { name, price, description, category, subCategory, size };

    // New files uploaded
    const newImages = req.files && req.files.length > 0
      ? req.files.map(f => `/uploads/${f.filename}`)
      : req.file ? [`/uploads/${req.file.filename}`] : [];

    if (newImages.length > 0) {
      // keepImages is a JSON array of existing image paths to retain
      let existing = [];
      try { existing = JSON.parse(keepImages || "[]"); } catch { existing = []; }
      updatedData.images = [...existing, ...newImages];
      updatedData.image  = updatedData.images[0];
    } else if (keepImages) {
      // No new files but some existing images may have been removed
      try {
        updatedData.images = JSON.parse(keepImages);
        updatedData.image  = updatedData.images[0] || "";
      } catch { /* keep existing */ }
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    if (!updated) return res.status(404).json({ message: "Product not found" });

    res.json(normalise(updated));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE product
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET new arrivals (latest 8)
exports.getNewArrivals = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).limit(8);
    res.json(products.map(normalise));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET products by category — case-insensitive match
exports.getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({
      category: { $regex: new RegExp(`^${req.params.categoryName}$`, "i") }
    });
    if (products.length === 0)
      return res.status(404).json({ message: "No products found for this category" });
    res.json(products.map(normalise));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
