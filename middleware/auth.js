const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req, res, next) => {
  try {
    // 1. Try to retrieve token from cookies, headers, or body
    let token = null;

    if (req.cookies?.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.body?.token) {
      token = req.body.token;
    }

    // 2. No token found
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed. Token not provided.",
      });
    }

    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // 4. Proceed
    next();

  } catch (error) {
    console.error("❌ Authentication error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Authentication failed. Invalid or expired token.",
    });
  }
};
