const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  TicketDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ticket",
    required: true,
  },

  SenderUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChatbotUser",
    required: true,
  },

  SenderUserRole: {
    type: String,
    enum: ["User","TeamMember", "ChatbotUser"],
    default: "User",
  },

  Messages: [
    {
      senderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "Messages.senderRoleRef", 
      },
      senderRole: {
        type: String,
        enum: ["User", "TeamMember", "ChatbotUser"],
        required: true,
      },
      senderRoleRef: {
        type: String,
        required: true,
        enum: ["User", "TeamMember", "ChatbotUser"],
      },
      text: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  ChatCreatedOnDate: {
    type: Date,
    default: Date.now,
  },

  ChatCreatedOnTime: {
    type: Date,
    default: Date.now,
  },

  ChatStatus: {
    type: String,
    enum: ["Ongoing", "Ended"],
    default: "Ongoing",
    required: true,
  },

  ChatAccess: {
    type: String,
    enum: ["Granted", "Revoked"],
    default: "Granted",
    required: true,
  },

  missed: {
    type: Boolean,
    default: false,
  },
  ChatAssignedToAdminUser:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  ChatAssignedToTeamMemberUser:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "TeamMembers",
    default: null,
  }
});

const Chats = mongoose.model("Chats", chatSchema);
module.exports = Chats;
