const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customer: {
      name: String,
      phone: String,
      city: String,
      address: String,
    },

    items: [
      {
        productId: String,
        name: String,
        price: Number,
        quantity: Number,
      },
    ],

    total: Number,

    paymentMethod: {
      type: String,
      default: "Cash on Delivery",
    },

    status: {
      type: String,
      enum: ["Pending", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);