// server/routes/auth.js
const express = require("express");
const passport = require("passport");
const router = express.Router();

// routes/auth.js
router.get("/twitter", (req, res, next) => {
  console.log("Starting Twitter auth...");
  passport.authenticate("twitter")(req, res, next);
});

router.get("/twitter/callback", (req, res, next) => {
  passport.authenticate("twitter", (err, user, info) => {
    if (err) {
      console.error("Twitter Auth Error:", {
        message: err.message,
        oauthError: err.oauthError,
        stack: err.stack,
      });
      return res.redirect(`${process.env.CLIENT_URL}?error=auth_failed`);
    }

    if (!user) {
      console.error("No user returned from Twitter");
      return res.redirect(`${process.env.CLIENT_URL}?error=no_user`);
    }

    req.logIn(user, (loginErr) => {
      if (loginErr) {
        console.error("Login Error:", loginErr);
        return res.redirect(`${process.env.CLIENT_URL}?error=login_failed`);
      }

      // Add debug logging
      console.log("Login successful, user:", user);
      console.log("Session:", req.session);
      console.log("Redirecting to:", `${process.env.CLIENT_URL}/dashboard`);

      // Set session cookie explicitly
      res.cookie("connect.sid", req.sessionID, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        domain:
          process.env.NODE_ENV === "production" ? "brckt.me" : "localhost",
      });

      return res.redirect(`${process.env.CLIENT_URL}/dashboard`);
    });
  })(req, res, next);
});

// Keep your other routes the same
router.get("/check", (req, res) => {
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
