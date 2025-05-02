const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  ticketTitle: {
    type: String,
    required: true
  },
  ticketDescription: {
    type: String,
    required: true
  },
  ticketStatus: {
    type: String,
    enum: ["Resolved", "UnResolved", "Pending"],
    default: "Pending",
    required: true
  },
  ticketPostedTime: {
    type: Date,
    required: true
  },
  ticketCreatedByUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChatbotUser",
    required: true
  },
  ticketAssignedToTeamMemberAccess: {
    type: String,
    enum: ["Granted", "Revoked"],
    default: "Revoked",
    required: true
  },
  ticketAssignedToUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  ticketAssignedToTeamMember: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TeamMembers",
    default: null
  },
  latestChatSummary: {
    type: String,
    default: ""
  }
}, {
  timestamps: true 
});

const Ticket = mongoose.model("Ticket", ticketSchema);
module.exports = Ticket;
