const mongoose = require("mongoose");

// Pictures uploaded from the admin page are stored here,
// and served to the website through /api/images/:id
const imageSchema = new mongoose.Schema(
  {
    data: {
      type: Buffer,
      required: true,
    },

    contentType: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Image", imageSchema);
