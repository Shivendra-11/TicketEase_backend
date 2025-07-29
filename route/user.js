const express = require("express");
const router = express.Router();

// Import the Signup controller
const { Signup,login, logout } = require("../controllers/Auth");

// Route for user signup
router.post("/signup", Signup); 
router.post("/login",login);
router.get("/logout",logout);    
module.exports = router; 
