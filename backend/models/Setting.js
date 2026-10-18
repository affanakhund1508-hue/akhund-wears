const mongoose = require("mongoose");

// Site-wide settings. There is only ever one of these documents.
const settingSchema = new mongoose.Schema(
  {
    heroImage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Setting", settingSchema);
