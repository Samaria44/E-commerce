const express = require("express");
const multer  = require("multer");
const path    = require("path");
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

// Multer — accept up to 6 images per upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../uploads")),
  filename:    (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB per file
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  },
});

// Routes
router.get("/",                          getAllProducts);
router.get("/new",                       getNewArrivals);
router.get("/category/:categoryName",    getProductsByCategory);
router.get("/:id",                       getProductById);
router.post("/",   upload.array("images", 6), addProduct);
router.patch("/:id", upload.array("images", 6), updateProduct);
router.delete("/:id",                    deleteProduct);

module.exports = router;
