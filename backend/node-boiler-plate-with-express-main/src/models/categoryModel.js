// models/categoryModel.js
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
 Category: { type: String, required: true },
   subcategories: [
    {
      subcategory: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    
      Name:String,
    },
  ],
});



module.exports = mongoose.model("Category", categorySchema);
