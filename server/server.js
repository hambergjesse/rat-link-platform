require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const cors = require("cors");
const path = require("path");

// Import routes
const authRoutes = require("./routes/auth");
const apiRoutes = require("./routes/api");
const uploadRoutes = require("./routes/upload");

// Import database connection
const connectDB = require("./config/database");

// Create Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add trust proxy for production
app.set("trust proxy", 1);

// CORS configuration
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? [process.env.CLIENT_URL, process.env.CLIENT_URL_ALT]
        : "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: "rat-link-platform",
      ttl: 24 * 60 * 60,
      autoRemove: "native",
      crypto: {
        secret: process.env.SESSION_SECRET,
      },
      touchAfter: 24 * 3600,
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
      domain: process.env.NODE_ENV === "production" ? "brckt.me" : "localhost",
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport");

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// API rate limiting
const rateLimit = require("express-rate-limit");
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use("/api/", apiLimiter);

// Routes
app.use("/auth", authRoutes);
app.use("/api", apiRoutes);
app.use("/api/upload", uploadRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date(),
    uptime: process.uptime(),
  });
});

// User session check endpoint
app.get("/api/auth/check", (req, res) => {
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

// Global error handlers
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

// Production setup
if (process.env.NODE_ENV === "production") {
  // Serve static files from the React app
  app.use(express.static(path.join(__dirname, "../client/dist")));

  // Handle React routing, return all requests to React app
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
  });
}

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`
    🚀 Server is running on port ${PORT}
    📱 Client URL: ${process.env.CLIENT_URL || "http://localhost:5173"}
    🔧 Environment: ${process.env.NODE_ENV || "development"}
    📅 Started at: ${new Date().toISOString()}
  `);
});
