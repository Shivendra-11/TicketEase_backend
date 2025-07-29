const mongoose = require("mongoose");
const Ticket = require("../models/TicketEntry");

// ✅ Create a new ticket
exports.createTicket = async (req, res) => {
  try {
    const {
      departure,
      destination,
      date,
      time,
      price,
      seat,
      class: ticketClass,
      ticketScreenshot,
      additionalField,
      whatappno,
      instalink,
      facebooklink,
    } = req.body;

    const userId = req.user?.id;
    const userName = req.body.name || req.user?.name;
    const userEmail = req.body.email || req.user?.email;
    const userPhone = req.body.phone || req.user?.phone;
    const userGender = req.body.gender || req.user?.gender;
    const userAge = req.body.age || req.user?.age;

    // Validate required fields
    if (
      !userName || !userEmail || !userPhone || !userGender || !userAge ||
      !departure || !destination || !date || !time || !price || !seat || !ticketClass || !userId
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all the required fields.",
      });
    }

    // Check for duplicate ticket by same user (same departure, destination, date, seat)
    const duplicate = await Ticket.findOne({
      user: userId,
      departure,
      destination,
      date,
      seat
    });
    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: "You have already created a ticket for this route, date, and seat.",
      });
    }

    const newTicket = new Ticket({
      name: userName,
      email: userEmail,
      phone: userPhone,
      gender: userGender,
      age: userAge,
      departure,
      destination,
      date,
      time,
      price,
      seat,
      class: ticketClass,
      ticketScreenshot: ticketScreenshot || "https://example.com/default-screenshot.jpg",
      additionalField,
      whatappno,
      instalink,
      facebooklink,
      user: userId,
    });

    await newTicket.save();

    res.status(201).json({
      success: true,
      message: "Ticket created successfully.",
      ticket: newTicket,
    });
  } catch (error) {
    console.error("Error creating ticket:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while creating the ticket.",
    });
  }
};

// ✅ Search tickets by departure, destination, and date
exports.searchTickets = async (req, res) => {
  try {
    const { departure, destination, date } = req.body;

    if (!departure || !destination || !date) {
      return res.status(400).json({
        success: false,
        message: "Departure, destination, and date are required fields.",
      });
    }

    const tickets = await Ticket.find({
      departure: { $regex: new RegExp(departure, "i") },
      destination: { $regex: new RegExp(destination, "i") },
      date,
    }).select("name time ticketScreenshot class price");

    if (tickets.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No tickets found matching the criteria.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Tickets found.",
      data: tickets,
    });
  } catch (error) {
    console.error("Error searching tickets:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while searching for tickets.",
    });
  }
};

// ✅ Get ticket details by ID (handles "all" case too)
exports.getTicketDetails = async (req, res) => {
  try {
    const { id } = req.params;

    if (id === "all") {
      const allTickets = await Ticket.find();
      return res.status(200).json({
        success: true,
        message: "All tickets retrieved successfully.",
        data: allTickets,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ticket ID.",
      });
    }

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Ticket details retrieved successfully.",
      data: ticket,
    });
  } catch (error) {
    console.error("Error retrieving ticket details:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while retrieving ticket details.",
    });
  }
};

// ✅ Get all tickets (explicit route)
exports.getAllTickets = async (req, res) => {
  try {
    // Exclude tickets created by the current user
    const tickets = await Ticket.find({ user: { $ne: req.user.id } });
    res.status(200).json({
      success: true,
      message: "All tickets retrieved successfully.",
      data: tickets,
    });
  } catch (error) {
    console.error("Error retrieving all tickets:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while retrieving all tickets.",
    });
  }
};
