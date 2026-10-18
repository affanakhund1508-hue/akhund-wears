const express = require("express");
const Setting = require("../models/Setting");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

// The picture groups an admin can change. An empty list means
// "use the original picture that comes with the website".
// "legacy" is the older single-picture field of the same group.
const GROUPS = [
  { list: "heroImages", legacy: "heroImage" },
  { list: "cultureImages", legacy: "cultureImage" },
];

const MAX_PICTURES = 6;

// The pictures of one group, using the old single picture if the
// new list was never filled in.
const picturesOf = (settings, group) => {
  if (!settings) return [];

  const list = settings[group.list];

  if (Array.isArray(list) && list.length > 0) {
    return list;
  }

  return settings[group.legacy] ? [settings[group.legacy]] : [];
};

const toResponse = (settings) => {
  const result = {};

  for (const group of GROUPS) {
    const pictures = picturesOf(settings, group);

    result[group.list] = pictures;
    result[group.legacy] = pictures[0] || "";
  }

  return result;
};

// GET site settings
// Public — the home page needs these pictures
router.get("/", async (req, res) => {
  try {
    const settings = await Setting.findOne();

    res.json(toResponse(settings));
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// UPDATE site settings
// Admin only. Only the groups that are sent are changed.
router.put("/", adminAuth, async (req, res) => {
  try {
    const update = {};

    for (const group of GROUPS) {
      const list = req.body[group.list];
      const single = req.body[group.legacy];

      if (list !== undefined) {
        const valid =
          Array.isArray(list) &&
          list.length <= MAX_PICTURES &&
          list.every(
            (item) =>
              typeof item === "string" &&
              item.length > 0 &&
              item.length <= 2000
          );

        if (!valid) {
          return res.status(400).json({
            message: `${group.list} must be a list of up to ${MAX_PICTURES} picture links`,
          });
        }

        update[group.list] = list;
        update[group.legacy] = list[0] || "";
      } else if (single !== undefined) {
        if (typeof single !== "string") {
          return res.status(400).json({
            message: `${group.legacy} must be text`,
          });
        }

        update[group.legacy] = single;
        update[group.list] = single ? [single] : [];
      }
    }

    if (Object.keys(update).length === 0) {
      return res.status(400).json({
        message: "Nothing to update",
      });
    }

    const settings = await Setting.findOneAndUpdate({}, update, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    });

    res.json(toResponse(settings));
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

module.exports = router;
