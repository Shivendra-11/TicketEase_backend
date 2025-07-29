const express = require("express");
const router = express.Router();

const { getProfile, updateProfile } = require("../controllers/profileuser");
const { auth } = require("../middleware/auth");

// Get authenticated user's profile
router.get("/profile/get", auth, getProfile);
// Update authenticated user's profile
router.put("/profile/edit", auth, updateProfile);

module.exports = router;
