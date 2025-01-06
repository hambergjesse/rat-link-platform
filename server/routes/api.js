const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middleware/auth");
const User = require("../models/User");
const Link = require("../models/Link");

// Get user's own profile
router.get("/profile", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
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
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ message: "Error fetching profile" });
  }
});

// Get profile by username
router.get("/profile/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
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
    console.error("Profile fetch error:", error);
    res.status(500).json({ message: "Error fetching profile" });
  }
});

// Update profile
router.put("/profile", isAuthenticated, async (req, res) => {
  try {
    const { bio } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { bio },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      profile: {
        username: user.username,
        bio: user.bio,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: "Error updating profile" });
  }
});

router.post("/links", isAuthenticated, async (req, res) => {
  try {
    const { platform, url, title, backgroundColor } = req.body;

    // Get the highest order number
    const lastLink = await Link.findOne({ userId: req.user._id }).sort(
      "-order"
    );
    const order = lastLink ? lastLink.order + 1 : 0;

    const newLink = await Link.create({
      userId: req.user._id,
      platform,
      url,
      title,
      backgroundColor,
      order,
    });

    res.status(201).json({ link: newLink });
  } catch (error) {
    console.error("Error creating link:", error);
    res.status(500).json({ message: "Error creating link" });
  }
});

// Get all links for a user
router.get("/links", isAuthenticated, async (req, res) => {
  try {
    const links = await Link.find({ userId: req.user._id }).sort("order");
    res.json({ links });
  } catch (error) {
    res.status(500).json({ message: "Error fetching links" });
  }
});

// Update link order
router.put("/links/reorder", isAuthenticated, async (req, res) => {
  try {
    const { links } = req.body;

    for (const link of links) {
      await Link.findOneAndUpdate(
        { _id: link.id, userId: req.user._id },
        { order: link.order }
      );
    }

    const updatedLinks = await Link.find({ userId: req.user._id }).sort(
      "order"
    );
    res.json({ links: updatedLinks });
  } catch (error) {
    res.status(500).json({ message: "Error reordering links" });
  }
});

// Delete link
router.delete("/links/:id", isAuthenticated, async (req, res) => {
  try {
    await Link.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    // Reorder remaining links
    const remainingLinks = await Link.find({ userId: req.user._id }).sort(
      "order"
    );
    for (let i = 0; i < remainingLinks.length; i++) {
      remainingLinks[i].order = i;
      await remainingLinks[i].save();
    }

    res.json({ message: "Link deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting link" });
  }
});

// Delete account
router.delete("/account", isAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id;

    // Delete all user's links
    await Link.deleteMany({ userId });

    // Delete the user
    await User.findByIdAndDelete(userId);

    // Logout the user
    req.logout((err) => {
      if (err) {
        console.error("Logout error:", err);
      }
      res.json({ message: "Account deleted successfully" });
    });
  } catch (error) {
    console.error("Account deletion error:", error);
    res.status(500).json({ message: "Error deleting account" });
  }
});

module.exports = router;
