// config/db.js
const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async (retries = 5, delay = 5000) => {
  while (retries) {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URL);

      console.log(
        `[${new Date().toLocaleTimeString()}] ✅ MongoDB Connected: ${conn.connection.host}`
          .cyan.underline.bold
      );

      // Close connection on app termination
      process.on("SIGINT", async () => {
        await mongoose.connection.close();
        console.log("\nMongoDB connection closed.".yellow);
        process.exit(0);
      });

      break; // Exit loop on success
    } catch (error) {
      console.error(
        `[${new Date().toLocaleTimeString()}] ❌ MongoDB Connection Error: ${error.message}`
          .red.bold
      );

      retries -= 1;
      if (!retries) {
        console.error("❌ Could not connect to MongoDB. Exiting...".red.bold);
        process.exit(1);
      }

      console.log(
        `🔄 Retrying in ${delay / 1000} seconds... (${retries} retries left)`.yellow
      );
      await new Promise((res) => setTimeout(res, delay));
    }
  }
};

module.exports = connectDB;
