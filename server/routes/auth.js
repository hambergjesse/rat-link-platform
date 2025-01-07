// auth.js
const express = require("express");
const passport = require("passport");
const router = express.Router();

// Simplify Twitter auth route
router.get("/twitter", passport.authenticate("twitter"));

// Simplify callback route
router.get(
  "/twitter/callback",
  passport.authenticate("twitter", {
    successRedirect: process.env.CLIENT_URL + "/dashboard",
    failureRedirect: process.env.CLIENT_URL + "?error=auth_failed",
  })
);

// Keep the rest of your routes the same
router.get("/check", (req, res) => {
  try {
    res.json({
      authenticated: req.isAuthenticated(),
      user: req.user
        ? {
            id: req.user._id,
            username: req.user.username,
            profilePicture: req.user.profilePicture,
          }
        : null,
    });
  } catch (error) {
    console.error("Auth Check Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/logout", (req, res) => {
  try {
    req.logout((err) => {
      if (err) {
        console.error("Logout Error:", err);
        return res.status(500).json({ error: "Failed to logout" });
      }
      res.json({ message: "Logged out successfully" });
    });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
