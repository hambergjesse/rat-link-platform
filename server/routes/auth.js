// server/routes/auth.js
const express = require("express");
const passport = require("passport");
const router = express.Router();

// Twitter auth route
router.get("/twitter", passport.authenticate("twitter"));

// Twitter callback route
router.get(
  "/twitter/callback",
  passport.authenticate("twitter", {
    failureRedirect: process.env.CLIENT_URL,
  }),
  (req, res) => {
    res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  }
);

// Keep your other routes the same
router.get("/check", (req, res) => {
  console.log("Auth check, authenticated:", req.isAuthenticated());
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
