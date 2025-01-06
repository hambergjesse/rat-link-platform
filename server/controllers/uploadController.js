const { cloudinary } = require("../config/cloudinary");
const User = require("../models/User");

const uploadController = {
  uploadProfilePicture: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Delete old profile picture if it exists
      const user = await User.findById(req.user._id);
      if (user.profilePicture) {
        try {
          const publicId = user.profilePicture.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(
            `rat-link-platform/profile-pictures/${publicId}`
          );
        } catch (error) {
          console.error("Error deleting old profile picture:", error);
        }
      }

      // Save the secure URL to the database
      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
          profilePicture: req.file.path, // Cloudinary secure URL
          profilePicturePublicId: req.file.filename, // Store public ID for future reference
        },
        { new: true }
      );

      res.json({
        message: "Profile picture uploaded successfully",
        profilePicture: updatedUser.profilePicture,
      });
    } catch (error) {
      console.error("Upload error:", error);
      res
        .status(500)
        .json({ message: "Error uploading file", error: error.message });
    }
  },

  deleteProfilePicture: async (req, res) => {
    try {
      const user = await User.findById(req.user._id);

      if (user.profilePicture) {
        // Delete from Cloudinary
        try {
          const publicId = user.profilePicture.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(
            `rat-link-platform/profile-pictures/${publicId}`
          );
        } catch (error) {
          console.error("Error deleting from Cloudinary:", error);
        }

        // Update user document
        user.profilePicture = "";
        user.profilePicturePublicId = "";
        await user.save();
      }

      res.json({ message: "Profile picture deleted successfully" });
    } catch (error) {
      console.error("Delete error:", error);
      res
        .status(500)
        .json({ message: "Error deleting file", error: error.message });
    }
  },
};

module.exports = uploadController;
