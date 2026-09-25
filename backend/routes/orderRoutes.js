const express = require("express");
const Order = require("../models/Order");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

// GET all orders
// Admin only
router.get("/", adminAuth, async (req, res) => {
  try {
    const orders = await Order.find().sort({
      createdAt: -1,
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// POST new order
// Public — customers need to place orders
router.post("/", async (req, res) => {
  try {
    const order = new Order(req.body);

    const savedOrder = await order.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

module.exports = router;
