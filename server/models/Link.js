const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    platform: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    backgroundColor: {
      type: String,
      default: "#ffffff",
    },
    order: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "rat-link-platform.links",
  }
);

linkSchema.index({ userId: 1, order: 1 });
linkSchema.index({ userId: 1, platform: 1 });

module.exports = mongoose.model("Link", linkSchema);
