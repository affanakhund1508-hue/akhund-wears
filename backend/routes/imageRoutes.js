const express = require("express");
const Image = require("../models/Image");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

const MAX_BYTES = 3 * 1024 * 1024;

const DATA_URL =
  /^data:(image\/(?:png|jpe?g|webp));base64,([A-Za-z0-9+/=]+)$/;

// Upload a picture
// Admin only. Body: { dataUrl: "data:image/jpeg;base64,...." }
router.post("/", adminAuth, async (req, res) => {
  try {
    const { dataUrl } = req.body;

    const match =
      typeof dataUrl === "string" ? DATA_URL.exec(dataUrl) : null;

    if (!match) {
      return res.status(400).json({
        message: "Please upload a valid picture (PNG, JPG or WebP).",
      });
    }

    const buffer = Buffer.from(match[2], "base64");

    if (buffer.length > MAX_BYTES) {
      return res.status(413).json({
        message: "That picture is too large.",
      });
    }

    const image = await Image.create({
      data: buffer,
      contentType: match[1],
    });

    res.status(201).json({
      url: `/api/images/${image._id}`,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

// Show a picture
// Public — customers see these on the website
router.get("/:id", async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(404).json({
        message: "Image not found",
      });
    }

    res.set("Content-Type", image.contentType);
    res.set("Cache-Control", "public, max-age=31536000, immutable");

    res.send(image.data);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

module.exports = router;
