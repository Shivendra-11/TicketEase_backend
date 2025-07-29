const jwt = require("jsonwebtoken");
require("dotenv").config();
const user=require("../models/user");

exports.auth = (req, res, next) => {
  try {
    // Safely retrieve the token
    const token =
      (req.cookies && req.cookies.token) || // Check if req.cookies exists
      (req.headers.authorization && req.headers.authorization.replace("Bearer ", "")) || // Check if Authorization header exists
      (req.body && req.body.token); 
    
    // If no token is provided
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed. Login required",
      });
    }

  
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user information to request object
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Error in authentication middleware:", error.message);
    return res.status(401).json({
      success: false,
      message: "Authentication failed. Invalid or expired token.",
    });
  }
};
