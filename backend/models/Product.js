const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  tags: [String],
  image: String
});

ProductSchema.index({ name: "text", description: "text", tags: "text" });

module.exports = mongoose.model("Product", ProductSchema);
