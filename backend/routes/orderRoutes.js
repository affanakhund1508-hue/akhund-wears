const express = require("express");
const Order = require("../models/Order");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

const ORDER_STATUSES = ["Pending", "Delivered", "Cancelled"];

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
    // Customers can never choose the status; every new order starts as Pending
    const order = new Order({
      ...req.body,
      status: "Pending",
    });

    const savedOrder = await order.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

// UPDATE order status
// Admin only
router.patch("/:id/status", adminAuth, async (req, res) => {
  try {
    const { status } = req.body;

    if (!ORDER_STATUSES.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

// DELETE order
// Admin only
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(
      req.params.id
    );

    if (!deletedOrder) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json({
      message: "Order deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

module.exports = router;
