const mongoose = require("mongoose");

const AnalyticsSchema = new mongoose.Schema({
  createdAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  createdTeamMemberAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TeamMembers",
    
  },
  date: {
    type: Date,
    default: Date.now
  },
  totalTickets: {
    type: Number,
    default: 0
  },
  resolvedTickets: {
    type: Number,
    default: 0
  },
  unresolvedTickets: {
    type: Number,
    default: 0
  },
  averageResolutionTimeInHours: {
    type: Number,
    default: 0
  },
  totalMissedChats: {
    type: Number,
    default: 0
  },
  ticketAssignments: [
    {
      userId: mongoose.Schema.Types.ObjectId,
      userName: String,
      assignedTickets: Number
    }
  ],
  teamPerformance: [
    {
      userId: mongoose.Schema.Types.ObjectId,
      userName: String,
      resolvedCount: Number
    }
  ],
  weeklyData: [
    {
      weekStartDate: Date,
      weekEndDate: Date,
      totalChats: Number,
      missedChats: Number,
      resolvedTickets: Number,
      totalTickets: Number
    }
  ]
});

const Analytics = mongoose.model("Analytics", AnalyticsSchema);
module.exports = Analytics;
