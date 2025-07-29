const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ["https://ticket-ease-frontend-apx2.vercel.app", "http://localhost:5173"],
  credentials: true
}));

// Console log to check if middleware is loaded
console.log("✅ Middleware loaded successfully");

// Import routes
const userRoutes = require("./route/user");
const ticketRoutes = require("./route/Ticket");
const profileRoutes = require("./route/profileroute");

// Console log to check if routes are imported
console.log("✅ Routes imported successfully");

// Use routes
app.use("/api/v1", userRoutes);
app.use("/api/v1", ticketRoutes);
app.use("/api/v1", profileRoutes);

// Console log to check if routes are mounted
console.log("✅ Routes mounted successfully");

// Test route
app.get("/", (req, res) => {
  console.log("🔍 Test route accessed");
  res.json({ message: "TicketEase Backend is running!" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Error occurred:", err);
  res.status(500).json({ error: "Something went wrong!" });
});

// 404 handler
app.use("*", (req, res) => {
  console.log("❌ Route not found:", req.originalUrl);
  res.status(404).json({ error: "Route not found" });
});

const PORT = 4000 ;

// Start server
const startServer = async () => {
  try {
    console.log("🚀 Starting server...");
    
    // Connect to database
    console.log("📡 Connecting to database...");
    await connectDB();
    
    // Start listening
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
      console.log(`🌐 Server URL: http://localhost:${PORT}`);
      console.log("🎯 Ready to handle requests!");
    });
    
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Promise Rejection:", err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  process.exit(1);
});

startServer();
