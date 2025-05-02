const TicketServices=require('../Services/TicketsServices')


exports.createANewTicketForUser=async(req,res)=>{
    try {
        const {ticketDescription}=req.body
        const userId=req.body.ticketCreatedByUser
        const ticket = await TicketServices.createaNewTicketandAssignToUser({
           
            ticketDescription: ticketDescription,
            ticketPostedTime: new Date(),
            ticketCreatedByUser: userId
        });
        if(ticket){
            res.status(201).json({message:"Ticket Created Successfully",ticket});
        }
        else{
            res.status(400).json({message:"Ticket Creation Failed"});
        }
    }
    catch (error) {
        res.status(500).json({message:"Internal Server Error"});
        console.error("Error in Creating a New Ticket for User", error);
    }
}

exports.assignTicketToTeamMember=async(req,res)=>{
    try {
        console.log("Request Body:", req.body);
        const {ticketId}=req.params
        if(!ticketId){
            return res.status(400).json({message:"Please provide ticketId"});
        }
        const {AdminUserId,teamMemberId}=req.body
        const userId=AdminUserId;
        const ticket=await TicketServices.assignTicketToTeamMembers(ticketId,userId,teamMemberId);
        if(ticket){
            res.status(200).json({message:"Ticket Assigned to Team Member Successfully",ticket});
        }
        else{
            res.status(400).json({message:"Ticket Assignment Failed"});
        }
    }
    catch (error) {
        res.status(500).json({message:"Internal Server Error"});
        console.error("Error in Assigning Ticket to Team Member", error);
    }
}
exports.getAllTicketsSpecificToAUser=async(req,res)=>{
    try {
        console.log('Request user id '+req.user._id);
        const tickets=await TicketServices.getAllTicketsSpecificToUser(req.user._id);
        
        if(tickets){
            res.status(200).json({message:"All Tickets Fetched Successfully",tickets});
        }
        else{
            res.status(400).json({message:"No Tickets Found"});
        }
    }
    catch (error) {
        res.status(500).json({message:"Internal Server Error"});
        console.error("Error in Fetching All Tickets", error);
    }
}

exports.updateTicketStatus=async(req,res)=>{
    try {
        const {ticketId}=req.params
        if(!ticketId){
            return res.status(400).json({message:"Please provide ticketId"});
        }
        const {ticketStatus}=req.body
        const ticket=await TicketServices.UpdateTicketStatus(ticketId,ticketStatus);
        if(ticket){
            res.status(200).json({message:"Ticket Status Updated Successfully",ticket});
        }
        else{
            res.status(400).json({message:"Ticket Status Update Failed"});
        }
    }
    catch (error) {
        res.status(500).json({message:"Internal Server Error"});
        console.error("Error in Updating Ticket Status", error);
    }
}
exports.deleteTicket=async(req,res)=>{
    try {
        const {ticketId}=req.body;
        const ticket=await TicketServices.deleteTicket(ticketId);
        if(ticket){
            res.status(200).json({message:"Ticket Deleted Successfully",ticket});
        }
        else{
            res.status(400).json({message:"Ticket Deletion Failed"});
        }
    }
    catch (error) {
        res.status(500).json({message:"Internal Server Error"});
        console.error("Error in Deleting Ticket", error);
    }
}

exports.searchTicketByTicketId=async(req,res)=>{    
    try {
        const searchQuery=req.query.searchQuery
        if(!searchQuery){
            return res.status(400).json({message:"Please provide a search query"});
        }
        const tickets=await TicketServices.searchATicket(searchQuery);
        if(tickets){
            res.status(200).json({message:"Ticket Fetched Successfully",tickets});
        }
        else{
            res.status(400).json({message:"Ticket Not Found"});
        }
    }
    catch (error) {
        res.status(500).json({message:"Internal Server Error"});
        console.error("Error in Searching Ticket by Ticket Id", error);
    }
}