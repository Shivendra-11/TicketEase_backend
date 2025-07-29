const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL);
    console.log("Database connected successfully");
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1); // Exit the process with an error code if the connection fails
  }
};

module.exports = connectDB;
