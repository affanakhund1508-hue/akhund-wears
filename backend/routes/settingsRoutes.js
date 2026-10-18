const express = require("express");
const Setting = require("../models/Setting");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

// GET site settings
// Public — the home page needs the hero picture
router.get("/", async (req, res) => {
  try {
    const settings = await Setting.findOne();

    res.json({
      heroImage: settings ? settings.heroImage : "",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// UPDATE site settings
// Admin only. An empty heroImage means "use the original picture".
router.put("/", adminAuth, async (req, res) => {
  try {
    const { heroImage } = req.body;

    if (typeof heroImage !== "string") {
      return res.status(400).json({
        message: "heroImage must be text",
      });
    }

    const settings = await Setting.findOneAndUpdate(
      {},
      { heroImage },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    res.json({
      heroImage: settings.heroImage,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

module.exports = router;
