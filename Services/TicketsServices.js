const Tickets=require('../Models/Tickets')
const User=require('../Models/User')
const TeamMembers=require('../Models/TeamMembers')
const ChatbotUser=require('../Models/ChatbotUsers');
const Chats = require('../Models/Chats');

exports.assignToLeastLoadedWithTicketsAdmin = async () => {
    const admins = await User.find({ UserRole: 'Admin' });
  
    let leastLoadedAdmin = null;
    let minTickets = Infinity;
  
    for (const admin of admins) {
      const ticketCount = await Tickets.countDocuments({
        ticketAssignedToUser: admin._id,
        ticketStatus: { $ne: "Resolved" }
      });
       console.log("Ticket Count",ticketCount);
      if (ticketCount < minTickets) {
        minTickets = ticketCount;
        leastLoadedAdmin = admin;
      }
    }
  
    return leastLoadedAdmin;
  };
  
 exports. createaNewTicketandAssignToUser=async(ticketData)=>{
    console.log("Ticket Data",ticketData);
    const {ticketTitle,ticketDescription,ticketPostedTime,ticketCreatedByUser}=ticketData;
   
    const ticketCreatedByExistingUser=await User.findById(ticketCreatedByUser);
    if(!ticketCreatedByExistingUser){
       const userthroughchatbot=await ChatbotUser.findById(ticketCreatedByUser);
       if(!userthroughchatbot){
        throw new Error("Ticket Creating  User not found");
       }
    }
    const ticketAssignedtoUser=await User.find({UserRole:"Admin"});
    if(!ticketAssignedtoUser){
        throw new Error("No Admins found for this ticket");
    } 
    const assignedAdmin = await exports.assignToLeastLoadedWithTicketsAdmin(); 
    console.log("Assigned Admin",assignedAdmin._id);
   
   
    const newTicket=new Tickets({
        ticketTitle:ticketTitle,
        ticketDescription:ticketDescription,
        ticketPostedTime:ticketPostedTime,
        ticketstatus:"Pending",
        ticketCreatedByUser:ticketCreatedByUser,
        ticketAssignedToUser:assignedAdmin._id,


        })
        const savedTicket=await newTicket.save();
       
        return savedTicket;

   
}

exports.assignTicketToTeamMembers = async (ticketId, assigningUserId, teamMemberId) => {
    const ticket = await Tickets.findById(ticketId);
    if (!ticket) {
      throw new Error("Ticket not found in database");
    }
  
    let assigningUser = await User.findById(assigningUserId);
    let isTeamMemberAssigner = false;
  
    if (!assigningUser) {
      assigningUser = await TeamMembers.findById(assigningUserId);
      if (!assigningUser) {
        throw new Error("Assigning user not found in users or team members");
      }
      isTeamMemberAssigner = true;
    }
  
    if (assigningUserId.toString() === teamMemberId.toString()) {
      throw new Error("Cannot assign ticket to yourself");
    }
  
    const targetTeamMember = await TeamMembers.findById(teamMemberId);
    if (!targetTeamMember) {
      throw new Error("Target team member not found in database");
    }
  
    if (
      ticket.ticketAssignedToTeamMember &&
      ticket.ticketAssignedToTeamMember.toString() === teamMemberId.toString()
    ) {
      throw new Error("Ticket already assigned to this team member");
    }
  
    ticket.ticketAssignedToTeamMember = targetTeamMember._id;
    ticket.ticketAssignedToTeamMemberAccess = "Granted";
  
    targetTeamMember.AssignedToTicket = ticket._id;
  
    let accessEntry = targetTeamMember.AccessToaTicket.find(
      entry => entry.AssignedticketId.toString() === ticket._id.toString()
    );
  
    if (!accessEntry) {
      targetTeamMember.AccessToaTicket.push({
        AssignedticketId: ticket._id,
        Ticketaccess: "Granted"
      });
    } else {
      accessEntry.Ticketaccess = "Granted";
    }
  
    if (!isTeamMemberAssigner) {
      assigningUser.UserAccessToTicket = "Revoked";
    }
  
    const chats = await Chats.findOne({ TicketDetails: ticketId });
    if (!chats) {
      throw new Error("No Chats Found for this Ticket");
    }
  
    if (chats.ChatAssignedToTeamMemberUser) {
      throw new Error("Ticket already assigned to a team member in chat");
    }
  
    chats.ChatAssignedToTeamMemberUser = targetTeamMember._id;
  
    await Promise.all([
      ticket.save(),
      targetTeamMember.save(),
      chats.save(),
      assigningUser.save()
    ]);
  
    return ticket;
  };

exports.UpdateTicketStatus=async(ticketId,ticketStatus)=>{
    console.log("Ticket ID",ticketId);
    const ticket=await Tickets.findById(ticketId);
    if(!ticket){
        throw new Error("Ticket not found in database");
    }
    if(ticket.ticketStatus==="Resolved"){
        throw new Error("Ticket already Resolved");
    }
    console.log("Ticket Status",ticketStatus);
    ticket.ticketStatus=ticketStatus;
    
    await ticket.save();
    const chats=await Chats.findOne({TicketDetails:ticketId});
    console.log("Fetched Chats",chats);
    if(!chats){
        throw new Error("No Chats Found for this Ticket");
    }
    if(ticket.ticketStatus==="Resolved"){
        chats.ChatStatus="Ended";
        chats.ChatAccess="Revoked";
        
    }
    else{
        chats.ChatStatus="Ongoing";
        chats.ChatAccess="Granted";
        
    }
    console.log("Chat Status",chats.ChatStatus);
    console.log("Chat Access",chats.ChatAccess);
    console.log("Chat ID",chats._id);
  const chatsave=  await chats.save();
  if(!chatsave){
    throw new Error("Chat not saved");
    }
    console.log(chatsave)
    return ticket;
}

exports.grantAccessToTicket=async(ticketId,teamMemberId)=>{
    const ticket=await Tickets.findById(ticketId);
    if(!ticket){
        throw new Error("Ticket not found in database");
    }   
    const teamMember=await TeamMembers.findById(teamMemberId);
    if(!teamMember){
        throw new Error("Team Member not found in database");
    }
    ticket.ticketAssignedToTeamMemberAccess="Granted";
    await ticket.save();
    return ticket;
}

exports.revokeAccessToTicket=async(ticketId,teamMemberId)=>{
    const ticket=await Tickets.findById(ticketId);
    if(!ticket){
        throw new Error("Ticket not found in database");
    }
    const teamMember=await TeamMembers.findById(teamMemberId);
    if(!teamMember){
        throw new Error("Team Member not found in database");
    }
    ticket.ticketAssignedToTeamMemberAccess="Revoked";
    await ticket.save();
    return ticket;
}
exports.getAllTicketsSpecificToUser=async(userId)=>{
    console.log("User ID",userId);
    const tickets=await Tickets.find({ticketAssignedToUser:userId});
    
     if(!tickets||(Array.isArray(tickets) && tickets.length===0)){
       const teamMeberTickets=await Tickets.find({ticketAssignedToTeamMember:userId});
       console.log("Team Member Tickets",teamMeberTickets);
       if(!teamMeberTickets){
        throw new Error("No Tickets Found for this User");
       }
       return teamMeberTickets;
    }
     console.log("Tickets",tickets);
    return tickets;
}

exports.deleteTicket=async(ticketId)=>{
    const ticket=await Tickets.findById(ticketId);
    if(!ticket){
        throw new Error("Ticket not found in database");
    }
    await ticket.remove();
    return ticket;
}

exports.searchATicket = async (searchQuery) => {
    const query = searchQuery.searchQuery || searchQuery;
    console.log("Search Query:", query);
  
    if (!query) throw new Error('Search query is missing');
  
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const searchRegex = new RegExp(escapedQuery, 'i');
  
    const tickets = await Tickets.find({
      $or: [
        { ticketTitle: searchRegex },
        { ticketDescription: searchRegex },
        { ticketStatus: searchRegex },
        { ticketNumber: { $regex: `^${escapedQuery}`, $options: 'i' } }
      ],
    });
  
    return tickets;
  };
  

