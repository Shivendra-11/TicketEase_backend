const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    departure: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    price: {
      type: String, // You can change this to Number if you'd prefer to store the price as a number
      required: true,
    },
    seat: {
      type: String,
      required: true,
    },
    class: {
      type: String,
      required: true,
    },
    ticketScreenshot: {
      type: String,
      required: true,
      default: "https://example.com/default-screenshot.jpg", // Default URL for ticket screenshot
    },
    whatappno: {
      type: String,
      sparse: true, // Allows multiple documents to have `null` for WhatsApp number
      required: false, // You can make it required if necessary
    },
    instalink: {
      type: String,
      required: false, // Optional field for Instagram link
    },
    facebooklink: {
      type: String,
      required: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

// Creating the model for the schema
const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;
