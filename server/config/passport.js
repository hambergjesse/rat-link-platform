const passport = require("passport");
const TwitterStrategy = require("passport-twitter").Strategy;
const User = require("../models/User");

const strategyConfig = {
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL:
    process.env.TWITTER_CALLBACK_URL ||
    "http://localhost:3001/auth/twitter/callback",
  includeEmail: false,
  userProfileURL:
    "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true",
  proxy: true,
};

passport.use(
  new TwitterStrategy(
    strategyConfig,
    async (token, tokenSecret, profile, done) => {
      try {
        // Log the profile data for debugging
        console.log("Twitter Profile Data:", {
          id: profile.id,
          username: profile.username,
          displayName: profile.displayName,
          photos: profile.photos,
        });

        let user = await User.findOne({ twitterId: profile.id });

        if (!user) {
          // Create new user
          user = await User.create({
            twitterId: profile.id,
            username: profile.username || `user_${profile.id}`,
            profilePicture: profile.photos?.[0]?.value || "",
            bio: profile._json?.description || "",
          });
          console.log("New user created:", user.username);
        } else {
          // Update existing user's info
          user.username = profile.username || user.username;
          user.profilePicture =
            profile.photos?.[0]?.value || user.profilePicture;
          if (profile._json?.description) {
            user.bio = profile._json.description;
          }
          await user.save();
          console.log("Existing user updated:", user.username);
        }

        return done(null, user);
      } catch (error) {
        console.error("Twitter Strategy Error:", error);
        return done(error, null);
      }
    }
  )
);

// Serialize user for the session
passport.serializeUser((user, done) => {
  try {
    done(null, user.id);
  } catch (error) {
    console.error("Serialize User Error:", error);
    done(error, null);
  }
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      return done(new Error("User not found"), null);
    }
    done(null, user);
  } catch (error) {
    console.error("Deserialize User Error:", error);
    done(error, null);
  }
});

module.exports = passport;
