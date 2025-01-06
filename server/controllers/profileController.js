const User = require("../models/User");
const Link = require("../models/Link");

const profileController = {
  // Get user profile
  getProfile: async (req, res) => {
    try {
      const username = req.params.username;
      const user = await User.findOne({ username }).select("-twitterId");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const links = await Link.find({ userId: user._id }).sort("order");

      res.json({
        profile: {
          username: user.username,
          bio: user.bio,
          profilePicture: user.profilePicture,
        },
        links,
        isOwner: req.user && req.user._id.toString() === user._id.toString(),
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // Update profile
  updateProfile: async (req, res) => {
    try {
      const { bio } = req.body;
      const userId = req.user._id;

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { bio },
        { new: true }
      ).select("-twitterId");

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ profile: updatedUser });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // Check username availability
  checkUsername: async (req, res) => {
    try {
      const { username } = req.params;
      const existingUser = await User.findOne({ username });
      res.json({ available: !existingUser });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
};

module.exports = profileController;
