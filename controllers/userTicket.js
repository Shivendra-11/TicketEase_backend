const jwt = require("jsonwebtoken");
const Ticket = require("../models/TicketEntry");
const User = require("../models/user"); // Import User model
require("dotenv").config();

exports.getUserTickets = async (req, res) => {
  try {
    // Retrieve the token from cookies, headers, or body
    const token = req.cookies.token || req.header("Authorization").replace("Bearer ", "") || req.body.token;

    // If no token is provided
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed. No token provided.",
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Extract the user's id from the token
    const userId = decoded.id;

    // Fetch the user's email from the database using the id
    const user = await User.findById(userId);

    // If user is not found
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Normalize and extract the email
    const userEmail = user.email.toLowerCase().trim();
    console.log("User Email for Query:", userEmail);

    // Fetch tickets by user ObjectId
    const tickets = await Ticket.find({ user: userId });
    console.log("Tickets Found:", tickets);

    // If no tickets are found
    if (tickets.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No tickets found for the user.",
      });
    }
    // Return the user's tickets
    return res.status(200).json({
      success: true,
      message: "User's tickets retrieved successfully.",
      data: tickets,
    });
  } catch (error) {
    console.error("Error retrieving user tickets:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while retrieving user tickets.",
    });
  }
};


exports.deleteUserTicket = async (req, res) => {
  try {
    // Retrieve the token from cookies, headers, or body
    const token = req.cookies.token || req.header("Authorization").replace("Bearer ", "") || req.body.token;

    // If no token is provided
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed. No token provided.",
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Extract the user's id from the token
    const userId = decoded.id;

    // Fetch the user's email from the database using the id
    const user = await User.findById(userId);

    // If user is not found
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Extract the ticket ID from the request
    const ticketId = req.params.id;

    // Find the ticket in the database
    const ticket = await Ticket.findById(ticketId);

    // If ticket is not found
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found.",
      });
    }

    // Check if the ticket belongs to the user
    const userEmail = user.email.toLowerCase().trim();
    if (ticket.email.toLowerCase().trim() !== userEmail) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You can only delete your own tickets.",
      });
    }

    // Delete the ticket
    await Ticket.findByIdAndDelete(ticketId);

    // Return a success response
    return res.status(200).json({
      success: true,
      message: "Ticket deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting ticket:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the ticket.",
    });
  }
};




exports.updateUserTicket = async (req, res) => {
  try {
    // Retrieve the token from cookies, headers, or body
    const token = req.cookies.token || req.header("Authorization").replace("Bearer ", "") || req.body.token;

    // If no token is provided
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed. No token provided.",
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Extract the user's id from the token
    const userId = decoded.id;

    // Fetch the user's email from the database using the id
    const user = await User.findById(userId);

    // If user is not found
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Extract the ticket ID from the request
    const ticketId = req.params.id;

    // Find the ticket in the database
    const ticket = await Ticket.findById(ticketId);

    // If ticket is not found
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found.",
      });
    }

    // Check if the ticket belongs to the user
    const userEmail = user.email.toLowerCase().trim();
    if (ticket.email.toLowerCase().trim() !== userEmail) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You can only update your own tickets.",
      });
    }

    // Prepare the fields to update (only the ones provided in the request body)
    const updates = {};
    const allowedFields = [
      'name', 'email', 'phone', 'gender', 'age', 'departure', 'destination', 
      'date', 'time', 'price', 'seat', 'class', 'ticketScreenshot', 
      'whatappno', 'instalink', 'facebooklink'
    ];

    // Only add provided fields to the update object
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {  // Check if field is explicitly provided
        updates[field] = req.body[field];
      }
    });

    // If no updates are provided
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update provided.",
      });
    }

    // Now, manually retain existing fields that are not updated
    // Merge updates with the existing ticket data
    const updatedTicketData = { ...ticket.toObject(), ...updates };

    // Update the ticket with the new data
    const updatedTicket = await Ticket.findByIdAndUpdate(ticketId, updatedTicketData, {
      new: true, // Return the updated document
      runValidators: true, // Ensure validation rules are applied
    });

    // Return the updated ticket
    return res.status(200).json({
      success: true,
      message: "Ticket updated successfully.",
      data: updatedTicket,
    });
  } catch (error) {
    console.error("Error updating ticket:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the ticket.",
    });
  }
};
