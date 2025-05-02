const Ticket = require("../Models/Tickets");
const Chat = require("../Models/Chats");
const Analytics = require("../Models/ApplicationAnalytics");
const mongoose = require("mongoose");
const moment = require("moment");
const User = require("../Models/User");
const TeamMember = require("../Models/TeamMembers");
exports.getTicketStats = async () => {
  const totalTickets = await Ticket.countDocuments();
  const resolvedTickets = await Ticket.countDocuments({ ticketStatus: "Resolved" });
  const unresolvedTickets = await Ticket.countDocuments({ ticketStatus: "Unresolved" });

  return {
    totalTickets,
    resolvedTickets,
    unresolvedTickets
  };
};

exports.getAverageResolutionTime = async () => {
  const resolvedTickets = await Ticket.find({ ticketStatus: "Resolved", updatedAt: { $exists: true } });

  if (resolvedTickets.length === 0) return { averageResolutionTimeInHours: 0 };

  const totalResolutionTime = resolvedTickets.reduce((acc, ticket) => {
    const created = new Date(ticket.createdAt);
    const resolved = new Date(ticket.resolvedAt);
    const duration = (resolved - created) / (1000 * 60 * 60);
    return acc + duration;
  }, 0);

  const averageResolutionTimeInHours = (totalResolutionTime / resolvedTickets.length).toFixed(2);

  return { averageResolutionTimeInHours };
};

exports.getTicketAssignmentStats = async () => {

    const stats = await Ticket.aggregate([
      {
        $group: {
          _id: "$ticketAssignedToUser", 
          assignedTickets: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "users", 
          localField: "_id", 
          foreignField: "_id", 
          as: "userDetails" 
        }
      },
      {
        $unwind: "$userDetails" 
      },
      {
        $project: {
          _id: 0,
          userId: "$userDetails._id", 
          userName: "$userDetails.name",
          assignedTickets: 1 
        }
      }
    ]);
    
    return stats;
    
};

exports.getMissedChatsCount = async () => {
  const totalMissedChats = await Chat.countDocuments({ missed: true });
  return { totalMissedChats };
};

exports.getTeamPerformanceStats = async (adminId) => {
  if (!mongoose.Types.ObjectId.isValid(adminId)) {
    throw new Error("Invalid adminId");
  }

  const stats = await Ticket.aggregate([
    { 
      $match: { 
        ticketStatus: "Resolved", 
        ticketAssignedToTeamMember: { $exists: true }, 
        ticketAssignedToUser: new mongoose.Types.ObjectId(adminId) 
      } 
    },
    {
      $group: {
        _id: "$resolvedBy",
        resolvedCount: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: "TeamMembers",
        localField: "_id",
        foreignField: "_id",
        as: "userDetails"
      }
    },
    { 
      $unwind: "$userDetails" 
    },
    {
      $project: {
        _id: 0,
        userId: "$userDetails._id",
        userName: "$userDetails.name",
        resolvedCount: 1
      }
    }
  ]);

  return stats;
};

exports.storeWeeklyAnalytics = async (adminId) => {
  const [
    ticketStats,
    avgResolutionTime,
    missedChats,
    ticketAssignmentStats,
    teamPerformanceStats
  ] = await Promise.all([
    this.getTicketStats(),
    this.getAverageResolutionTime(),
    this.getMissedChatsCount(),
    this.getTicketAssignmentStats(),
    this.getTeamPerformanceStats(adminId)
  ]);

  const weekStartDate = moment().startOf('week').toDate();
  const weekEndDate = moment().endOf('week').toDate();

  const formattedTicketAssignments = ticketAssignmentStats.map(assignment => {
    if (!mongoose.Types.ObjectId.isValid(assignment.userId)) {
      throw new Error(`Invalid userId: ${assignment.userId}`);
    }
    return {
      userId: new mongoose.Types.ObjectId(assignment.userId), 
      userName: assignment.userName,
      assignedTickets: assignment.assignedTickets
    };
  });

  const formattedTeamPerformance = teamPerformanceStats.map(performance => {
    if (!mongoose.Types.ObjectId.isValid(performance.userId)) {
      throw new Error(`Invalid userId: ${performance.userId}`);
    }
    return {
      userId: new mongoose.Types.ObjectId(performance.userId),
      userName: performance.userName,
      resolvedCount: performance.resolvedCount
    };
  });

  const newWeeklyData = {
    weekStartDate,
    weekEndDate,
    totalChats: ticketStats.totalTickets,
    missedChats: missedChats.totalMissedChats,
    resolvedTickets: ticketStats.resolvedTickets,
    totalTickets: ticketStats.totalTickets
  };

  let analytics = await Analytics.findOne();

  if (!analytics) {
    analytics = new Analytics({
      totalTickets: ticketStats.totalTickets,
      resolvedTickets: ticketStats.resolvedTickets,
      unresolvedTickets: ticketStats.unresolvedTickets,
      averageResolutionTimeInHours: Number(avgResolutionTime.averageResolutionTimeInHours),
      totalMissedChats: missedChats.totalMissedChats,
      ticketAssignments: formattedTicketAssignments,
      teamPerformance: formattedTeamPerformance,
      weeklyData: [newWeeklyData]
    });
  } else {
    analytics.weeklyData.push(newWeeklyData); 
  }

  await analytics.save();
  return analytics;
};

exports.getAnalytics = async () => {
  try {
    const analyticsData = await Analytics.find()
      .sort({ createdAt: -1 })
      .limit(1);
    
    if (!analyticsData || analyticsData.length === 0) {
      throw new Error("No analytics data found");
    }

    return analyticsData[0]; 
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    throw new Error("Error fetching analytics data");
  }
};

exports.storeDailyAnalytics = async () => {
  const directAdmins = await User.find({ UserRole: 'Admin' }).select('_id');
  const directAdminIds = directAdmins.map(admin => admin._id.toString());

  const teamAdminMembers = await TeamMember.find({ role: 'Admin' }).select('_id');
  const teamAdminIds = teamAdminMembers.map(member => member.userId.toString());

  const allAdminIds = Array.from(new Set([...directAdminIds, ...teamAdminIds]));

  for (const adminId of allAdminIds) {
    const [totalTickets, resolvedTickets, totalMissedChats] = await Promise.all([
      Ticket.countDocuments({ ticketAssignedToUser: adminId }),
      Ticket.countDocuments({ ticketAssignedToUser: adminId, ticketStatus: 'Resolved' }),
      Chat.countDocuments({ ChatAssignedToAdminUser: adminId, missed: true })
    ]);

    const unresolvedTickets = totalTickets - resolvedTickets;

    const resolvedTicketDocs = await Ticket.find({
      ticketAssignedToUser: adminId,
      ticketStatus: 'Resolved',
      createdAt: { $exists: true },
      updatedAt: { $exists: true }
    });

    let totalResolutionTime = 0;
    resolvedTicketDocs.forEach(ticket => {
      totalResolutionTime += (new Date(ticket.updatedAt) - new Date(ticket.createdAt));
    });

    const averageResolutionTimeInHours = resolvedTicketDocs.length
      ? (totalResolutionTime / resolvedTicketDocs.length) / (1000 * 60 * 60)
      : 0;

    const ticketAssignments = await Ticket.aggregate([
      { $match: { ticketAssignedToUser: new mongoose.Types.ObjectId(adminId) } },
      { $group: { _id: "$ticketAssignedToTeamMember", assignedTickets: { $sum: 1 } } },
      {
        $lookup: {
          from: 'teammembers',
          localField: '_id',
          foreignField: '_id',
          as: 'teamMember'
        }
      },
      { $unwind: "$teamMember" },
      {
        $project: {
          teamMemberId: "$teamMember._id",
          teamMemberName: "$teamMember.name",
          assignedTickets: 1
        }
      }
    ]);

    const teamPerformance = await Ticket.aggregate([
      {
        $match: {
          ticketAssignedToUser: new mongoose.Types.ObjectId(adminId),
          ticketStatus: 'Resolved'
        }
      },
      {
        $group: { _id: "$ticketAssignedToTeamMember", resolvedCount: { $sum: 1 } }
      },
      {
        $lookup: {
          from: 'teammembers',
          localField: '_id',
          foreignField: '_id',
          as: 'teamMember'
        }
      },
      { $unwind: "$teamMember" },
      {
        $project: {
          teamMemberId: "$teamMember._id",
          teamMemberName: "$teamMember.name",
          resolvedCount: 1
        }
      }
    ]);

    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);

    const [weeklyTotalChats, weeklyMissedChats, weeklyResolvedTickets, weeklyTotalTickets] = await Promise.all([
      Chat.countDocuments({ ChatAssignedToAdminUser: adminId, createdAt: { $gte: startOfWeek, $lte: endOfWeek } }),
      Chat.countDocuments({ missed: true, ChatAssignedToAdminUser: adminId, createdAt: { $gte: startOfWeek, $lte: endOfWeek } }),
      Ticket.countDocuments({ ticketAssignedToUser: adminId, createdAt: { $gte: startOfWeek, $lte: endOfWeek }, ticketStatus: 'Resolved' }),
      Ticket.countDocuments({ ticketAssignedToUser: adminId, createdAt: { $gte: startOfWeek, $lte: endOfWeek } })
    ]);

    await Analytics.updateOne(
      { createdAdmin: adminId },
      {
        $set: {
          dailyData: {
            totalTickets,
            resolvedTickets,
            unresolvedTickets,
            totalMissedChats,
            averageResolutionTimeInHours,
            ticketAssignments,
            teamPerformance
          }
        },
        $push: {
          weeklyData: {
            weekStartDate: startOfWeek,
            weekEndDate: endOfWeek,
            totalChats: weeklyTotalChats,
            missedChats: weeklyMissedChats,
            resolvedTickets: weeklyResolvedTickets,
            totalTickets: weeklyTotalTickets,
            date: new Date()
          }
        }
      },
      { upsert: true }
    );
    
  }
};

