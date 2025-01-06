const User = require("../models/User");
const Link = require("../models/Link");

const cleanupUserData = async (userId) => {
  try {
    // Delete all user's links
    await Link.deleteMany({ userId });

    // If you're using Cloudinary for image storage, delete profile picture
    const user = await User.findById(userId);
    if (user?.profilePicture) {
      // Extract public_id from Cloudinary URL
      const publicId = user.profilePicture.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.error("Error deleting profile picture:", error);
      }
    }

    // Delete any other related data here
    // For example: comments, likes, etc.

    return true;
  } catch (error) {
    console.error("Cleanup error:", error);
    return false;
  }
};

module.exports = { cleanupUserData };
