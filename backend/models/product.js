const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    // First picture (kept so older products keep working)
    image: {
      type: String,
      default: "",
    },

    // All pictures of the product, in the order they are shown
    images: {
      type: [String],
      default: [],
    },

    stock: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);