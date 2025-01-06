const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    twitterId: {
      type: String,
      required: true,
      unique: true,
    },
    bio: {
      type: String,
      default: "",
    },
    profilePicture: {
      type: String,
      default: "",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "rat-link-platform.users",
  }
);

userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ twitterId: 1 }, { unique: true });

module.exports = mongoose.model("User", userSchema);
