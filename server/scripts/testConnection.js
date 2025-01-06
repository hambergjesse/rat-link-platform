// server/scripts/testConnection.js
require("dotenv").config();
const mongoose = require("mongoose");

async function testConnection() {
  try {
    console.log("Attempting to connect to MongoDB...");
    console.log("Connection string:", process.env.MONGODB_URI);

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Successfully connected to MongoDB!");
    console.log("Connected to database:", mongoose.connection.db.databaseName);

    // List all collections
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log("Available collections:");
    collections.forEach((collection) => {
      console.log(`- ${collection.name}`);
    });
  } catch (error) {
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      code: error.code,
      // Print full error object for debugging
      fullError: JSON.stringify(error, null, 2),
    });
  } finally {
    // Close the connection
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.exit();
  }
}

testConnection();
