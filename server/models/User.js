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
    profilePicturePublicId: {
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

userSchema.pre("remove", async function (next) {
  try {
    if (this.profilePicturePublicId) {
      const { cloudinary } = require("../config/cloudinary");
      await cloudinary.uploader.destroy(
        `rat-link-platform/profile-pictures/${this.profilePicturePublicId}`
      );
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("User", userSchema);
