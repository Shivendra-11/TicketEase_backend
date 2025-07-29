const bcrypt = require("bcryptjs");
const User = require("../models/user");
// const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const User = require("../models/user"); 
// Signup Controller
exports.Signup = async (req, res) => {
  try {
    
    const { name, email, password, confirmpassword, phone, gender } = req.body;

    // Validate all required fields
    if (!name || !email || !password || !confirmpassword) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password, and confirm password are required",
      });
    }

    // Match the password and confirm password
    if (password !== confirmpassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // Check if user already exists
    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user account in the database
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword, // Store hashed password
      confirmpassword: hashedPassword, // Store hashed confirm password
      phone,
      gender,
    });

    // Send the response
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        gender: newUser.gender,
      },
    });
  } catch (error) {
    console.error("Error during user registration:", error);
    return res.status(500).json({
      success: false,
      message: "User registration failed",
    });
  }
};


// Login
require("dotenv").config();


exports.login = async (req, res) => {
  try {
    // Get email and password from request body
    const { email, password } = req.body;

    // Check if email or password is missing
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: `Please fill up all the required fields`,
      });
    }

    // Find user with provided email
    const user = await User.findOne({ email });

    // If user not found with the provided email
    if (!user) {
      return res.status(401).json({
        success: false,
        message: `User is not registered. Please sign up to continue.`,
      });
    }

    // Compare entered password with stored hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      // Generate JWT token
      const token = jwt.sign(
        { email: user.email, id: user._id }, // Add any other data as required
        process.env.JWT_SECRET, // Make sure you have set this secret in .env
        {
          expiresIn: "24h", // Token expires in 24 hours
        }
      );

      // Save token to the user object (optional)
      user.token = token;
      user.password = undefined; // Make sure the password is not returned in the response

      // Set cookie for token and return success response
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Token expiry date
        httpOnly: true, // Secure token
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: `User login successful`,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: `Password is incorrect`,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: `Login failure. Please try again`,
    });
  }
};


// Logout

exports.logout = async (req, res) => {
  try {
    // Clear the cookie
    res.clearCookie("token");
    return res.status(200).json({
      success: true,
      message: `User logged out successfully`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: `Logout failure. Please try again`,
    });
  }
};  
