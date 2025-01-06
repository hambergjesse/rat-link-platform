const User = require("../models/User");

const authController = {
  // Get current authenticated user
  getCurrentUser: async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      res.json({ user: req.user });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // Logout user
  logout: (req, res) => {
    req.logout((err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error logging out", error: err.message });
      }
      res.json({ message: "Logged out successfully" });
    });
  },
};

module.exports = authController;
