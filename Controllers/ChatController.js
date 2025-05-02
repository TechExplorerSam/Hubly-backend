const chatServices = require('../Services/ChatServices');

exports.createANewChat = async (req, res) => {
    try{
        const chat=await chatServices.createNewChat(req.body);
        if(chat){
            res.status(201).json({message:"Chat Created and Added Successfully",chat});
        }
        else{
            res.status(400).json({message:"Chat Creation Failed"});
        }
    }
    catch(err){
        res.status(500).json({message:"Internal Server Error"});
        console.error("Error in Creating a New Chat", err);
    }
}
exports.getAllChatsForATicket = async (req, res) => {
    try{
        console.log(req.params);
        const ticketId=req.params.ticketId;
        console.log(ticketId);
        const chats=await chatServices.getAllChatsForTicket(ticketId);
        
        if(chats){
            res.status(200).json({message:"All Chats Fetched Successfully",chats});
        }
        else{
            res.status(400).json({message:"No Chats Found"});
        }
    }
    catch(err){
        res.status(500).json({message:"Internal Server Error"});
        console.error("Error in Fetching All Chats of User", err);
    }
}
exports.replyAChat = async (req, res) => {
    try{
        const {replyUserId,replyUserRole,chatId,replyMessage}=req.body;
        const chat=await chatServices.ReplyToChat(replyUserId,replyUserRole,chatId,replyMessage);
        if(chat){
            res.status(201).json({message:"Chat Reply Added Successfully",chat});
            }
          else{
            res.status(400).json({message:"Chat Reply Failed"});
             }
            }
             catch(err){
               res.status(500).json({message:"Internal Server Error"});
                console.error("Error in Replying a Chat", err);
                }
                }

exports.classifyChatAsMissedChat=async(req,res)=>{
    try{
        const{userId, ticketId}=req.body;
        const chat=await chatServices.classifyChatAsMissedChat(userId,ticketId);
        if(chat){
            res.status(201).json({message:"Chat Classified as Missed Chat Successfully", chat});

    }
    else{
        res.status(400).json({message:"Chat Classification Failed"});
    }

}
catch(err){
    res.status(500).json({message:"Internal Server Error"});
}
}

exports.revokeaccessToChat=async(req,res)=>{
    try{
        const{chatId}=req.body;
        const chat=await chatServices.revokeaccessToChat(chatId);
        if(chat){
            res.status(201).json({message:"Access to Chat Revoked Successfully", chat});
            }
            else{
                res.status(400).json({message:"Access Revocation Failed"});
            }
        


    }
    catch(err){
        res.status(500).json({message:"Internal Server Error"});
        console.error(err)
    }
}

exports.grantAccessToChat=async(req,res)=>{
    try{
        const{chatId}=req.body;
        const chat=await chatServices.grantAccessToChat(chatId);
        if(chat){
            res.status(201).json({message:"Access to Chat Revoked Successfully", chat});
            }
            else{
                res.status(400).json({message:"Access Revocation Failed"});
            }
        
    }
    catch(err){
        res.status(500).json({message:"Internal Server Error"});
        console.error(err)
        }
}

exports.getAllChatsSpecificToUser=async(req,res)=>{
    try{
        const userId=req.params.userId;
        const chats=await chatServices.getAllChatsForUser(userId);
        if(chats){
            res.status(200).json({message:"All Chats Fetched Successfully",chats});
        }
        else{
            res.status(400).json({message:"No Chats Found"});
        }
    }
    catch(err){
        res.status(500).json({message:"Internal Server Error"});
        console.error("Error in Fetching All Chats of User", err);
    }
}

exports.classifyChatAsMissedChat=async(req,res)=>{
    try{
        const{userId, ticketId}=req.body;
        const chat=await chatServices.classifyChatAsMissedChat(userId,ticketId);
        if(chat){
            res.status(201).json({message:"Chat Classified as Missed Chat Successfully", chat});

    }
    else{
        res.status(400).json({message:"Chat Classification Failed"});
    }

}
catch(err){
    res.status(500).json({message:"Internal Server Error"});
}
}

exports.checkifchatassignedtoanotheruser=async(req,res)=>{
    try{
      
       let assignedToAnotherUser=false;
        const {userId, ticketId}=req.query;
        const chat=await chatServices.checkIfChatAssignedToAnotherUser(userId,ticketId);
        if(chat.assignedToAnotheruser){
            res.status(201).json({message:"Chat Assigned to Another User", chat,assignedToAnotherUser:true});

    }
    else{
        res.status(201).json({message:"Chat Not Assigned to Another User",assignedToAnotherUser:false});
    }

}
catch(err){
    res.status(500).json({message:"Internal Server Error"});
}
}

exports.getChatsforChatbotUser=async(req,res)=>{
    try{
        const chatId=req.params.chatId;
        const chats=await chatServices.getChatToChatBotUser(chatId);
        if(chats){
            res.status(200).json({message:"All Chats Fetched Successfully",chats});
        }
        else{
            res.status(400).json({message:"No Chats Found"});
        }
    }
    catch(err){
        res.status(500).json({message:"Internal Server Error"});
        console.error("Error in Fetching All Chats of User", err);
    }
   
}