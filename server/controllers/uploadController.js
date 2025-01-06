const { cloudinary } = require("../config/cloudinary");
const User = require("../models/User");

const uploadController = {
  uploadProfilePicture: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const user = await User.findByIdAndUpdate(
        req.user._id,
        { profilePicture: req.file.path },
        { new: true }
      );

      res.json({
        message: "Profile picture uploaded successfully",
        profilePicture: user.profilePicture,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error uploading file", error: error.message });
    }
  },

  deleteProfilePicture: async (req, res) => {
    try {
      const user = await User.findById(req.user._id);

      if (user.profilePicture) {
        // Extract public_id from Cloudinary URL
        const publicId = user.profilePicture.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }

      user.profilePicture = "";
      await user.save();

      res.json({ message: "Profile picture deleted successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting file", error: error.message });
    }
  },
};

module.exports = uploadController;
