const chatbotUser=require('../Models/ChatbotUsers')
const ChatServices=require('../Services/ChatServices')
const Chatbotstyles=require('../Models/Chatbot')
const TicketServices=require('../Services/TicketsServices')
const Tickets=require('../Models/Tickets')
const TeamMebers=require('../Models/TeamMembers')
const User = require('../Models/User')
const Chats = require('../Models/Chats')
const Ticket = require('../Models/Tickets')
exports.registerUserthroughChatbot=async(userdetails)=>{
    const {chatbotregisteredUsername,chatbotregisteredEmail,chatbotregisteredPhone}=userdetails;
    if(!chatbotregisteredUsername || !chatbotregisteredEmail || !chatbotregisteredPhone){
        throw new Error("Please provide all the required three values username, email and phone");
    }
    const existingUser=await chatbotUser.findOne({chatbotregisteredEmail});
    if(existingUser){
        throw new Error("User already registered with this email no need to register again");
    }
    const newChatbotUser=new chatbotUser({
        chatbotregisteredUsername,
        chatbotregisteredEmail,
        chatbotregisteredPhone
    })
    const savedChatbotUser=await newChatbotUser.save();
    return savedChatbotUser;
   
}

exports.sendReplytoChatbotUser=async(replyUserId,replyUserRole,chatId,replyMessage)=>{
    const chatreply=await ChatServices.ReplyToChat(replyUserId,replyUserRole,chatId,replyMessage);
    if(!chatreply){
        throw new Error("Chat not found in database");
    }

    return chatreply;

   
}

exports.customizechatbotStyles = async (chatbotStyles) => {
  console.log("Chatbot Styles:", chatbotStyles);
  const {
      HeaderColor,
      BackgroundColor,
      UserMessage,
      WelcomeMessage,
      MissedChatTimer,
      creatingAdminId,
      introductionFormPlaceholderValues
  } = chatbotStyles;

  if (
      !HeaderColor ||
      !BackgroundColor ||
      !UserMessage ||
      !WelcomeMessage ||
      !MissedChatTimer ||
      !creatingAdminId
  ) {
      throw new Error(
          "Please provide all the required values: HeaderColor, BackgroundColor, UserMessage, WelcomeMessage, MissedChatTimer, creatingAdminId"
      );
  }

  let user = await User.findById(creatingAdminId);
  if (!user) {
      user = await TeamMebers.findById(creatingAdminId);
      if (!user) {
          throw new Error("Creating admin not found in database");
      }
      if (user.Role !== "Admin") {
          throw new Error("You are not authorized to update chatbot styles");
      }
  }
  

  let existingChatbotStyles = await Chatbotstyles.findOne();

  if (existingChatbotStyles) {
      existingChatbotStyles.headerColor = HeaderColor;
      existingChatbotStyles.backgroundColor = BackgroundColor;
      existingChatbotStyles.userMessage = UserMessage;
      existingChatbotStyles.welcomeMessage = WelcomeMessage;
      existingChatbotStyles.missedChatTimer = MissedChatTimer;
      existingChatbotStyles.introductionFormPlaceholderValues = {
          chattingUserNamePlaceholderValue:
              introductionFormPlaceholderValues?.chattingUserNamePlaceholderValue || "Enter your name",
          chattingUserPhonePlaceholderValue:
              introductionFormPlaceholderValues?.chattingUserPhonePlaceholderValue || "Enter your phone number",
          chattingUserEmailPlaceholderValue:
              introductionFormPlaceholderValues?.chattingUserEmailPlaceholderValue || "Enter your email address"
      };
      existingChatbotStyles.creatingAdminId = creatingAdminId;
      const updated = await existingChatbotStyles.save();
      if (!updated) {
          throw new Error("Failed to update chatbot styles");
      }
      user.MissedChattimer={
        hours: MissedChatTimer.hours,
        minutes: MissedChatTimer.minutes,
        seconds: MissedChatTimer.seconds
     }
   const saveuser= await user.save();
    if (!saveuser) {
        throw new Error("Failed to save user chat missed timer");
    }
      return updated;
  }
  
  const newChatbotStyles = new Chatbotstyles({
      headerColor: HeaderColor,
      backgroundColor: BackgroundColor,
      userMessage: UserMessage,
      welcomeMessage: WelcomeMessage,
      missedChatTimer: MissedChatTimer,
      creatingAdminId: creatingAdminId,
      introductionFormPlaceholderValues: {
          chattingUserNamePlaceholderValue:
              introductionFormPlaceholderValues?.chattingUserNamePlaceholderValue || "Enter your name",
          chattingUserPhonePlaceholderValue:
              introductionFormPlaceholderValues?.chattingUserPhonePlaceholderValue || "Enter your phone number",
          chattingUserEmailPlaceholderValue:
              introductionFormPlaceholderValues?.chattingUserEmailPlaceholderValue || "Enter your email address"
      }
  });

  if (!await User.findById(creatingAdminId)) {
      newChatbotStyles.creatingTeamMemberAdminId = creatingAdminId;
  }

  const saved = await newChatbotStyles.save();
  if (!saved) {
      throw new Error("Failed to save chatbot styles");
  }
  return saved;
};

exports.generateFormattedTicketNumber = async () => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const dateString = `${year}${month}${day}`;

  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  const ticketCountToday = await Tickets.countDocuments({
    ticketpostedtime: { $gte: startOfDay, $lte: endOfDay },
  });

  const sequence = String(ticketCountToday + 1).padStart(5, "0");

  return `Ticket# ${dateString}-${sequence}`;
};



exports.createanewchatwithuser = async (chatData) => {
    const { ticketDescription, ticketPostedTime, ticketCreatedByUser } = chatData;

    const tickettitle = await exports.generateFormattedTicketNumber(); 
    
    const createdTicket = await TicketServices.createaNewTicketandAssignToUser({
        ticketTitle:tickettitle,
        ticketDescription,
        ticketPostedTime,
        ticketCreatedByUser:ticketCreatedByUser,
    });

    if (!createdTicket) {
        throw new Error("Failed to create ticket");
    }
    
    const createdChat = await ChatServices.createNewChat({
        chatPostedByUser: createdTicket.ticketCreatedByUser,
        chatTicketId: createdTicket._id,
        chatAssignedToUser:createdTicket.ticketAssignedToUser,
    });

    if (!createdChat) {
        throw new Error("Error in creating new chat");
    }

    return createdChat;
};



exports.getChatbotUserDetails=async(userId)=>{
    const user=await chatbotUser.findById(userId);
    if(!user){
        throw new Error("Chatbot user not found in database");
    }
    console.log("Chatbot User Details:",user);
    return user;
}

exports.getChatbotStyles = async () => {
  const styles = await Chatbotstyles.findOne(); 
  if (!styles) {
    throw new Error("Chatbot styles not found in the database");
  }

  console.log("Chatbot Styles:", styles);
  return styles;
};

  
  exports.loginChatbotUser = async (Email,FullName) => {
    if (!FullName) {
      throw new Error("Please provide the username");
    }
  
    const user = await chatbotUser.findOne({ chatbotregisteredUsername: FullName ,chatbotregisteredEmail: Email});
    if (!user) {
      throw new Error("Chatbot user not found in database");
    }
  
    console.log("Chatbot User Details:", user);
    return user;
  }

  exports.addChatsToExistingChat = async (userId,chatId, chatMessage, replyUserId) => {
    try {
      console.log("Request Body:", userId,chatId, chatMessage, replyUserId);
      const chat = await Chats.findById(chatId)

      if (!chat) {
        throw new Error("Chat not found in database");
      }
      if(chat.ChatStatus==="Ended"){
        throw new Error("Chat already ended");
      }
      const chatbotuser = await chatbotUser.findById(userId);
      if (!chatbotuser) {
        throw new Error("Chatbot user not found in database");
      }
      const replyUserDetails = await User.findById(replyUserId);
      if (!replyUserDetails) {
        const teamMember = await TeamMebers.findById(replyUserId);
        if (!teamMember) {
          throw new Error("Reply user not found in database");
        }
        replyUserId = teamMember;
      } else {
        replyUserId = replyUserDetails;
      }
      if (!replyUserId) {
        throw new Error("Reply user not found in database");
      }
      if (!chatMessage) {
        throw new Error("Chat message is required");
      }
  
      const chatTicket = await Ticket.findOne({ _id: chat.TicketDetails });
      if (!chatTicket) {
        throw new Error("Chat ticket not found in database");
      }
  
      const chatMessageDetails = {
        senderId: replyUserId ,           
        senderRole: replyUserDetails.role || "User",            
        senderRoleRef: replyUserDetails.roleRef || "ChatbotUser",
        text: chatMessage,
        timestamp: new Date()
      };
  
      chat.Messages.push(chatMessageDetails);
      await chat.save(); 
  
      return { success: true, message: "Message added successfully" };
    } catch (err) {
      console.error('Error in addChatsToExistingChat:', err.message);
      return { success: false, message: err.message };
    }
  };
  