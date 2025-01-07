// server/config/passport.js
const passport = require("passport");
const TwitterStrategy = require("passport-twitter").Strategy;
const User = require("../models/User");

const strategyConfig = {
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: "https://api.brckt.me/auth/twitter/callback",
  includeEmail: false,
  userProfileURL:
    "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true",
  proxy: true,
};

// Debug log for configuration
console.log("Twitter Strategy Config:", {
  callbackURL: strategyConfig.callbackURL,
  consumerKey: process.env.TWITTER_CONSUMER_KEY?.substring(0, 5) + "...",
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET?.substring(0, 5) + "...",
});

passport.use(
  new TwitterStrategy(
    strategyConfig,
    async (token, tokenSecret, profile, done) => {
      try {
        // Log the token and profile data
        console.log("Twitter Auth Process:", {
          tokenReceived: !!token,
          tokenSecretReceived: !!tokenSecret,
          profileReceived: !!profile,
        });

        if (profile) {
          console.log("Twitter Profile Data:", {
            id: profile.id,
            username: profile.username,
            displayName: profile.displayName,
            photos: profile.photos,
          });
        }

        let user = await User.findOne({ twitterId: profile.id });

        if (!user) {
          user = await User.create({
            twitterId: profile.id,
            username: profile.username || `user_${profile.id}`,
            profilePicture: "",
            bio: profile._json?.description || "",
          });
          console.log("New user created:", user.username);
        } else {
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
            console.log("Existing user updated:", user.username);
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

passport.serializeUser((user, done) => {
  try {
    done(null, user.id);
  } catch (error) {
    console.error("Serialize User Error:", error);
    done(error, null);
  }
});

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
