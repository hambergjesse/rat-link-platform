const passport = require("passport");
const TwitterStrategy = require("passport-twitter").Strategy;
const User = require("../models/User");

const isDevelopment = process.env.NODE_ENV === "development";

const strategyConfig = {
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: process.env.TWITTER_CALLBACK_URL,
  includeEmail: false,
  proxy: !isDevelopment,
  userProfileURL: "https://api.twitter.com/1.1/account/verify_credentials.json",
};

// Debug logging
console.log("Twitter Strategy Config:", {
  callbackURL: strategyConfig.callbackURL,
  environment: process.env.NODE_ENV,
  proxy: strategyConfig.proxy,
  consumerKeySet: !!process.env.TWITTER_CONSUMER_KEY,
  consumerSecretSet: !!process.env.TWITTER_CONSUMER_SECRET,
});

passport.use(
  new TwitterStrategy(
    strategyConfig,
    async (token, tokenSecret, profile, done) => {
      try {
        let user = await User.findOne({ twitterId: profile.id });

        if (!user) {
          // Create new user with empty profile picture
          user = await User.create({
            twitterId: profile.id,
            username: profile.username || `user_${profile.id}`,
            profilePicture: "", // Initialize with empty profile picture
            bio: profile._json?.description || "",
          });
        } else {
          // Update only username and bio if needed, preserve existing profile picture
          if (
            profile.username !== user.username ||
            (profile._json?.description &&
              profile._json.description !== user.bio)
          ) {
            user.username = profile.username || user.username;
            if (profile._json?.description) {
              user.bio = profile._json.description;
            }
            await user.save();
          }
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
