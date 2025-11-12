const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  getNewArrivals,
  getProductsByCategory, 
  
} = require("../controllers/productController");

const router = express.Router();

// 🧾 Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads")); // ✅ fix path (was inside routes folder before)
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// ✅ Product routes
router.get("/", getAllProducts);
router.get("/new", getNewArrivals);
router.get("/:id", getProductById);
router.get("/category/:categoryName", getProductsByCategory); // 🆕 fetch by category
router.post("/", upload.single("image"), addProduct);
router.patch("/:id", upload.single("image"), updateProduct);
router.delete("/:id", deleteProduct);


module.exports = router;
