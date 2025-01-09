// server/scripts/testConnection.js
require("dotenv").config();
const mongoose = require("mongoose");

async function testConnection() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // List all collections
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    collections.forEach((collection) => {});
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
