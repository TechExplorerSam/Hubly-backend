const Chats=require('../Models/Chats')
const Tickets=require('../Models/Tickets')
const User=require('../Models/User')
const ChabotUser=require('../Models/ChatbotUsers')
const TeamMembers=require('../Models/TeamMembers')
exports.createNewChat = async (chatData) => {
    const { chatPostedByUser, chatTicketId ,chatAssignedToUser} = chatData;
    if (!chatPostedByUser || !chatTicketId || !chatAssignedToUser) {
      throw new Error("Please provide all the required values chat posted by user, chat ticket id and chat assigned to user");
    }
    const ticket = await Tickets.findById(chatTicketId);
    if (!ticket) {
      throw new Error("Ticket not found in database");
    }
  
    const user = await ChabotUser.findById(chatPostedByUser);
    if (!user) {
      throw new Error("Chatbot user not found in database");
    }
  
    const newChat = new Chats({
      TicketDetails: chatTicketId,
      SenderUser: chatPostedByUser,
      SenderUserRole: "User",
      Messages: [
        {
          senderId: chatPostedByUser,
          senderRole: "User",
          senderRoleRef: "ChatbotUser",
          text: ticket.ticketDescription, 
        },
      ],
      ChatAssignedToAdminUser: chatAssignedToUser,
      ChatStatus: "Ongoing",
      ChatAccess: "Granted",
      missed: false,
      
    });
  
    const savedChat = await newChat.save();
    return savedChat;
  };
exports.ReplyToChat=async(replyUserId,replyUserRole,chatId,replyMessage)=>{
    if(!replyUserId || !chatId || !replyMessage){
        throw new Error("Please provide all the required three values reply user id , chat id and reply message");
    }
    
  
    const chatDataUser=await User.findById(replyUserId);
    if(!chatDataUser){
       const chatDataTeamMember=await TeamMembers.findById(replyUserId);
       if(!chatDataTeamMember){
        throw new Error("Replying User not found in database");       }
    }
    
    const chat=await Chats.findById(chatId);
    if(!chat){
        throw new Error("Chat not found in database");
    }
    chat.Messages.push({
        senderId: replyUserId,
        senderRole: replyUserRole,
        senderRoleRef: "User",
        text: replyMessage,
        timestamp: new Date()
      });
    
   
    const savedChat=await chat.save();
    return savedChat;
   
}


exports.getAllChatsForTicket=async(ticketId)=>{

    const chats=await Chats.find({TicketDetails:ticketId}).sort({ChatCreatedOnTime:-1});
    if(!chats){
        throw new Error("No chats found for this ticket");
    }
    console.log("All Chats for Ticket:", chats);
    return  chats;
}

exports.endUserChat=async(chatId)=>{
    const chat=await Chats.findById(chatId);
    if(!chat){
        throw new Error("Chat not found in database");
    }
    chat.ChatStatus="Ended";
    await chat.save();
    return chat;
}

exports.classifyChatAsMissedChat = async (userId, ticketId) => {
  console.log("Classifying chat as missed chat for user:", userId, "and ticket:", ticketId);
  try {
    const chats = await Chats.find({ TicketDetails: ticketId }).sort({ timestamp: 1 });

    if (!chats.length) {
      throw new Error('No chats found for this ticket');
    }

    const firstUserMessage = chats.find(chat =>
      chat.SenderUserRole === 'ChatbotUser' || chat.SenderUserRole === 'User'
    );

    if (!firstUserMessage || !Array.isArray(firstUserMessage.Messages) || firstUserMessage.Messages.length === 0) {
      throw new Error('No valid user message found');
    }

    const firstUserMessageInsideMessages = firstUserMessage.Messages.find(
      msg => msg.senderRoleRef === 'User' || msg.senderRoleRef === 'ChatbotUser'
    );

    if (!firstUserMessageInsideMessages || !firstUserMessageInsideMessages.timestamp) {
      throw new Error('No timestamp in first user message');
    }

    const user = await User.findById(userId);
    if (!user || !user.MissedChattimer) {
      throw new Error('User or MissedChattimer not found');
    }

let hours = "1", minutes = "0", seconds = "0";

if (user && user.MissedChattimer) {
  hours = user.MissedChattimer.hours || "1";
  minutes = user.MissedChattimer.minutes || "0";
  seconds = user.MissedChattimer.seconds || "0";
}

const waitTimeInMs =
  (parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds)) * 1000;

const deadline = new Date(firstUserMessageInsideMessages.timestamp.getTime() + waitTimeInMs);

    const repliedInTime = chats.some(chat =>
      (chat.SenderUserRole === 'Admin' || chat.SenderUserRole === 'Team') &&
      chat.timestamp <= deadline
    );

    if (!repliedInTime) {
      firstUserMessage.missed = true;
      await firstUserMessage.save();

      if (!user.MissedChatDetails) user.MissedChatDetails = [];

      const alreadyExists = user.MissedChatDetails.some(
        id => id.toString() === firstUserMessage._id.toString()
      );

      if (!alreadyExists) {
        user.MissedChatDetails.push(firstUserMessage._id);
        user.MissedChatsCount += 1;
        await user.save();
      }

      return firstUserMessage;
    }

    return null;
  } catch (error) {
    console.error('Error classifying chat as missed:', error);
    throw error;
  }
};



 exports.grantAccessToChat=async(chatId)=>{
 const chat=await Chats.findById(chatId);
            if(!chat){
            throw new Error("Chat not found in database");
            }
        chat.ChatAccess="Granted";
    await chat.save();
    return chat;
 }
  exports.revokeaccessToChat=async(chatId)=>{
    const chat=await Chats.findById(chatId);
    if(!chat){
        throw new Error("Chat not found in database");
    }
    chat.ChatAccess="Revoked";
    await chat.save();
    return chat;
    }

    exports.getAllChatsForUser = async (userId) => {
      
      console.log("User ID:", userId);
    
      const adminChats = await Chats.find({ ChatAssignedToAdminUser: userId }).sort({ ChatCreatedOnTime: -1 });
      console.log("Chats for Admin User:", adminChats.length);
    
      if (adminChats.length > 0) return adminChats;
    
      const teamMemberChats = await Chats.find({ ChatAssignedToTeamMemberUser: userId }).sort({ ChatCreatedOnTime: -1 });
      console.log("Chats for Team Member User:", teamMemberChats.length);
    
      if (teamMemberChats.length > 0) return teamMemberChats;
    
      
      throw new Error("No chats found for this user in the entire database");
    };
    

    const isCreatedByOrAbove = async (requestUserId, teamMemberId) => {
      let currentMember = await TeamMembers.findById(teamMemberId);
    
      while (currentMember) {
        if (!currentMember.createdAdmin) break;
    
        if (currentMember.createdAdmin.toString() === requestUserId.toString()) {
          return true;
        }
    
        currentMember = await TeamMembers.findById(currentMember.createdAdmin);
      }
    
      return false;
    };
    
    exports.checkIfChatAssignedToAnotherUser = async (userId, ticketId) => {
      if (!userId || !ticketId) {
        throw new Error("User ID and Ticket ID are required");
      }
    
      console.log("User ID:", userId);
      console.log("Ticket ID:", ticketId);
    
      const chats = await Chats.find({ TicketDetails: ticketId });
    
      if (!chats || chats.length === 0) {
        throw new Error("No chats found for this ticket");
      }
    
      const chat = chats[0];
    
      const assignedUserId = chat.ChatAssignedToTeamMemberUser?.toString();
      const requestUserId = userId.toString();
    
      if (!assignedUserId) {
        console.log("Chat is not yet assigned to any user");
        return { assignedToAnotheruser: false, chats };
      }
    
      const isAssignedToAnother = assignedUserId !== requestUserId;
    
      if (isAssignedToAnother) {
        console.log("Chat is assigned to another user");
    
        const assignedTeamMember = await TeamMembers.findById(assignedUserId);
        if (!assignedTeamMember) {
          throw new Error("Assigned team member not found");
        }
    
        const wasCreatedByYouOrAbove = await isCreatedByOrAbove(requestUserId, assignedUserId);
    
        return {
          assignedToAnotheruser: true,
          createdByYou: wasCreatedByYouOrAbove,
          assignedUser: assignedTeamMember,
          chats,
        };
      }
    
      console.log("Chat is not assigned to another user");
      return { assignedToAnotheruser: false, chats };
    };
    
    

  exports.getChatToChatBotUser=async(chatId)=>{
    if(!chatId){
        throw new Error("Chat ID is required");
    }
    console.log("Chat ID:", chatId);
    const chat=await Chats.findById(chatId);
    if(!chat){
        throw new Error("Chat not found in database");
    }
   
    return chat;
  }