const express = require("express");
const router = express.Router();
const {
  getCategories,
  addCategory,
  addSubcategory,
  deleteCategory,
  deleteSubcategory,
} = require("../controllers/categoryController");

// 🟢 Routes
router.get("/", getCategories);
router.post("/", addCategory);
router.post("/:id/subcategory", addSubcategory);
router.delete("/:id", deleteCategory);
router.delete("/:catId/subcategory/:subId", deleteSubcategory);

module.exports = router;
