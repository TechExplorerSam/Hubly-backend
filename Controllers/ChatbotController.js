const ChatbotServices=require('../Services/ChatbotServices')

exports.registerUserthroughChatbot=async(req,res)=>{
    try {
        const {chatbotregisteredUsername,chatbotregisteredEmail,chatbotregisteredPhone}=req.body;
        if(!chatbotregisteredUsername || !chatbotregisteredEmail || !chatbotregisteredPhone){
            return res.status(400).json({message:"Please provide all the required three values username, email and phone"});
        }
        const newChatbotUser=await ChatbotServices.registerUserthroughChatbot({
            chatbotregisteredUsername,
            chatbotregisteredEmail,
            chatbotregisteredPhone
        });
        return res.status(200).json({message:"User registered successfully through the chatbot",data:newChatbotUser});
    }
    catch (error) {
        console.error("Error in registerUserthroughChatbot:", error);
        return res.status(500).json({message:"Internal server error"});
    }
}
exports.customizechatbotStyles=async(req,res)=>{
    try {
        console.log("Request Body:",req.body);
        const {HeaderColor,BackgroundColor,UserMessage,WelcomeMessage,MissedChatTimer,creatingAdminId}=req.body;
        if(!HeaderColor || !BackgroundColor || !UserMessage || !WelcomeMessage || !MissedChatTimer||!creatingAdminId){
            return res.status(400).json({message:"Please provide all the required five values HeaderColor, BackgroundColor, UserMessage, WelcomeMessage and MissedChatTimer"});
        }
        const newChatbotStyles=await ChatbotServices.customizechatbotStyles({
            HeaderColor,
            BackgroundColor,
            UserMessage,
            WelcomeMessage,
            MissedChatTimer,
            introductionFormPlaceholderValues: {
                chattingUserNamePlaceholderValue: req.body.introductionFormPlaceholderValues?.chattingUserNamePlaceholderValue || "Enter your name",
                chattingUserPhonePlaceholderValue: req.body.introductionFormPlaceholderValues?.chattingUserPhonePlaceholderValue || "Enter your phone number",
                chattingUserEmailPlaceholderValue: req.body.introductionFormPlaceholderValues?.chattingUserEmailPlaceholderValue || "Enter your email address"
            }
            ,creatingAdminId
        });
        return res.status(200).json({message:"Chatbot styles customized successfully",data:newChatbotStyles});
    }
    catch (error) {
        console.error("Error in customizechatbotStyles:", error);
        return res.status(500).json({message:"Internal server error"});
    }
}
exports.sendReplytoChatbotUser=async(req,res)=>{
    try {
        const {replyUserId,replyUserRole,chatId,replyMessage}=req.body;
        if(!replyUserId || !chatId || !replyMessage){
            return res.status(400).json({message:"Please provide all the required three values reply user id , chat id and reply message"});
        }
        const chatreply=await ChatbotServices.sendReplytoChatbotUser(replyUserId,replyUserRole,chatId,replyMessage);
        return res.status(200).json({message:"Reply sent successfully to the chatbot user",data:chatreply});
    }
    catch (error) {
        console.error("Error in sendReplytoChatbotUser:", error);
        return res.status(500).json({message:"Internal server error"});
    }
}
exports.createanewChatWithUser=async(req,res)=>{
    try {
        console.log("Request Body:",req.body);
        const {ticketDescription, ticketPostedTime, ticketCreatedByUser }=req.body;
        if(!ticketDescription || !ticketPostedTime || !ticketCreatedByUser){
            return res.status(400).json({message:"Please provide all the required three values ticket description, ticket posted time and ticket created by user"});
        }
        const newChat=await ChatbotServices.createanewchatwithuser({
            ticketDescription,
            ticketPostedTime,
            ticketCreatedByUser
        });
        return res.status(200).json({message:"New chat created successfully with the user",data:newChat});  
        }
    catch (error) {
        console.error("Error in create a newChat WithUser:", error);
        return res.status(500).json({message:"Internal server error"});
        }
}


exports.getChatbotUserDetails=async(req,res)=>{
    try {
        const userId=req.params.userId;
        if(!userId){
            return res.status(400).json({message:"Please provide the user id"});
        }
        const userDetails=await ChatbotServices.getChatbotUserDetails(userId);
        if(!userDetails){
            return res.status(404).json({message:"User not found"});
        }
        return res.status(200).json({message:"User details fetched successfully",data:userDetails});
    }
    catch (error) {
        console.error("Error in getChatbotUserDetails:", error);
        return res.status(500).json({message:"Internal server error"});
    }
}

exports.getChatbotStylesForUser = async (req, res) => {
    try {
      const styles = await ChatbotServices.getChatbotStyles();
      
      if (!styles) {
        return res.status(404).json({ message: "Chatbot styles not found" });
      }
  
      return res.status(200).json({
        message: "Chatbot styles fetched successfully",
        data: styles
      });
  
    } catch (error) {
      console.error("Error in getChatbotStylesForUser:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  
exports.loginChatbotUser=async(req,res)=>{
    try {
        console.log("Request Body:",req.body);
        const {Email,FullName}=req.body;
        if(!FullName){
            return res.status(400).json({message:"Please provide the Full Name and Email"});
        }
        const user=await ChatbotServices.loginChatbotUser(Email,FullName);
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        return res.status(200).json({message:"User logged in successfully",data:user});
    }
    catch (error) {
        console.error("Error in loginChatbotUser:", error);
        return res.status(500).json({message:"Internal server error"});
    }
}

exports.addChatsToExistingUser = async (req, res) => {
    try {
        console.log("Request Body:", req.body);
      const { userId, chatId, chatMessage, replyUserId } = req.body;
  
      if (!userId || !chatId || !chatMessage || !replyUserId) {
        return res.status(400).json({
          message: "Please provide userId, chatId, chatMessage, and replyUserId."
        });
      }
  
      const updatedUserChat = await ChatbotServices.addChatsToExistingChat(userId, chatId, chatMessage, replyUserId);
  
      if (!updatedUserChat) {
        return res.status(404).json({ message: "User or chat not found." });
      }
       console.log("Updated User Chat:", updatedUserChat);
       console.log("successfully added chat to the user");
      return res.status(200).json({
        message: "Chat added to the user successfully.",
        data: updatedUserChat
      });
      
    } catch (error) {
      console.error("Error in addChatsToExistingUser:", error.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
//680fb751cd84da96b155f143