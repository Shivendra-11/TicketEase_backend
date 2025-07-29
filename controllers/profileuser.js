const User = require("../models/user");
const bcrypt = require("bcryptjs");

// Get authenticated user's profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password -confirmpassword");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to get profile." });
  }
};

// Update authenticated user's profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = { ...req.body };
    // Prevent email from being updated
    delete updates.email;
    // Allow profileImage to be updated if provided
    if (updates.profileImage === undefined) delete updates.profileImage;
    // Handle password update if provided
    if (updates.password || updates.confirmpassword) {
      if (updates.password !== updates.confirmpassword) {
        return res.status(400).json({ success: false, message: "Passwords do not match." });
      }
      const hashedPassword = await bcrypt.hash(updates.password, 10);
      updates.password = hashedPassword;
      updates.confirmpassword = hashedPassword;
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true, runValidators: true, select: "-password -confirmpassword" }
    );
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    res.status(200).json({ success: true, message: "Profile updated successfully.", data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update profile." });
  }
};


