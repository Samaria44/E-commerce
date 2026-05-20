// controllers/categoryController.js
const Category = require("../models/categoryModel");

//  Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  Add a new category
exports.addCategory = async (req, res) => {
  try {
    const category = new Category({ Category: req.body.Category });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//  Add subcategory to existing category
exports.addSubcategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    category.subcategories.push({
      Name: req.body.Name,
    });

    await category.save();
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  Delete category
exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  Delete a subcategory
exports.deleteSubcategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.catId);
    if (!category) return res.status(404).json({ message: "Category not found" });

    category.subcategories = category.subcategories.filter(
      (sub) => sub._id.toString() !== req.params.subId
    );

    await category.save();
    res.json({ message: "Subcategory deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
