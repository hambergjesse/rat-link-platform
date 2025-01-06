const express = require("express");
const passport = require("passport");
const router = express.Router();

// Twitter auth route with explicit error handling
router.get("/twitter", (req, res, next) => {
  passport.authenticate("twitter", (err) => {
    if (err) {
      console.error("Twitter Auth Error:", err);
      return res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
    }
    next();
  })(req, res, next);
});

// Twitter callback route with explicit error handling
router.get("/twitter/callback", (req, res, next) => {
  passport.authenticate("twitter", (err, user, info) => {
    if (err) {
      console.error("Twitter Callback Error:", err);
      return res.redirect(
        `${process.env.CLIENT_URL}/login?error=callback_failed`
      );
    }
    if (!user) {
      console.error("No user returned from Twitter");
      return res.redirect(`${process.env.CLIENT_URL}/login?error=no_user`);
    }

    req.logIn(user, (loginErr) => {
      if (loginErr) {
        console.error("Login Error:", loginErr);
        return res.redirect(
          `${process.env.CLIENT_URL}/login?error=login_failed`
        );
      }
      return res.redirect(`${process.env.CLIENT_URL}/dashboard`);
    });
  })(req, res, next);
});

// Auth check route
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

// Logout route
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
