const mongoose = require("mongoose");

// Site-wide settings. There is only ever one of these documents.
const settingSchema = new mongoose.Schema(
  {
    // Pictures for the big slideshow at the top of the home page
    heroImages: {
      type: [String],
      default: [],
    },

    // Pictures for the "Tradition in Every Detail" banner slideshow
    cultureImages: {
      type: [String],
      default: [],
    },

    // Older single-picture fields. Kept so a picture saved before
    // slideshows existed keeps working.
    heroImage: {
      type: String,
      default: "",
    },

    cultureImage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Setting", settingSchema);
