// services/categoryService.js
const Category = require("../models/categoryModel"); // Make sure your Category model exists

// Create a new category
const createCategory = async (categoryData) => {
  return await Category.create(categoryData);
};

// Get all categories
const getCategories = async () => {
  return await Category.find();
};

// Get category by ID
const getCategoryById = async (id) => {
  return await Category.findById(id);
};

// Update category by ID
const updateCategory = async (id, categoryData) => {
  return await Category.findByIdAndUpdate(id, categoryData, { new: true });
};

// Delete category by ID
const deleteCategory = async (id) => {
  return await Category.findByIdAndDelete(id);
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
