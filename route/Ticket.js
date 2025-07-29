const express = require("express");
const router = express.Router();

const { auth } = require("../middleware/auth");

const {
  createTicket,
  searchTickets,
  getTicketDetails,
  getAllTickets,
 // Import the update controller
} = require("../controllers/Ticket");

const {
  getUserTickets,
  deleteUserTicket,
  updateticket,
  updateUserTicket,
} = require("../controllers/userTicket");

// Route to create a new ticket - requires authentication
router.post("/tickets", auth, createTicket);

// Route to search tickets - requires authentication
router.get("/tickets/search", auth, searchTickets);

// Route to get a specific ticket by ID - requires authentication
router.get("/tickets/:id", auth, getTicketDetails);

// Route to get tickets for a user - requires authentication
router.get("/user/tickets", auth, getUserTickets);

// Route to delete a user ticket - requires authentication
router.delete("/remove/tickets/:id", auth, deleteUserTicket);

// Route to update a specific ticket - requires authentication
// router.put("/tickets/:id", auth, updateTicket);
router.put("/update/tickets/:id", auth, updateUserTicket);    

// Public route to get all tickets (no authentication)
router.get("/tickets/all", auth, getAllTickets);

module.exports = router;
