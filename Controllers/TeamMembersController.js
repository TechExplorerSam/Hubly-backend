const TeamMemberServices=require('../Services/TeamMembersServices')


exports.addATeamMemberToUser=async(req,res)=>{
    try {
        const {createdAdminId,UserName,UserPhone,UserEmail,UserRole}=req.body
        const userId=createdAdminId
        const teamMember = await TeamMemberServices.addATeamMember(userId,{
            UserName,
            UserPhone,
            UserEmail,
            UserRole
        });
        if(teamMember){
            res.status(201).json({message:"Team Member Added Successfully",teamMember});
        }
        else{
            res.status(400).json({message:"Team Member Addition Failed"});
        }
    }catch (error) {
        res.status(500).json({message:"Internal Server Error"});
        console.error("Error in Adding Team Member to User", error);
    }

}

exports.getAllTeamMembersOfUser=async(req,res)=>{
    try {
        const userDetails=req.params.userId
        const teamMembers=await TeamMemberServices.getAllTeamMembersForaSpecificUser(userDetails);
        if(teamMembers){
            res.status(200).json({message:"All Team Members Fetched Successfully",teamMembers});
        }
        else{
            res.status(400).json({message:"No Team Members Found"});
        }
        }catch (error) {
        res.status(500).json({message:"Internal Server Error"});
        console.error("Error in Fetching All Team Members", error);
    }
}

exports.EditATeamMember=async(req,res)=>{
    try {
        const {adminUserId,UserName,UserPhone,UserEmail,UserRole}=req.body
        const teamMemberId=req.params.id
        console.log("Team Member Id",teamMemberId)
        const userId=adminUserId
        if(!adminUserId||!UserName || !UserPhone || !UserEmail || !UserRole){
            return res.status(400).json({message:"Please provide all the required four values UserName, UserPhone, UserEmail and UserRole and adminUserId"});
        }
        const teamMember=await TeamMemberServices.EditATeamMember(userId,teamMemberId,{
            UserName,
            UserPhone,
            UserEmail,
            UserRole
        });
        if(teamMember){
            res.status(200).json({message:"Team Member Updated Successfully",teamMember});
        }
        else{
            res.status(400).json({message:"Team Member Update Failed"});
        }
    }
    catch (error) {
        res.status(500).json({message:"Internal Server Error"});
        console.error("Error in Updating Team Member", error);
        }
}

exports.changeTeamMemberRole=async(req,res)=>{
    try {
        const {assingingAdminId,updatedRole}=req.body
        const teamMemberId=req.params.id
        const userId=assingingAdminId
        const teamMember=await TeamMemberServices.changeTeamMemberRole(userId,teamMemberId,updatedRole);
        if(teamMember){
            res.status(200).json({message:"Team Member Role Updated Successfully",teamMember});
        }
        else{
            res.status(400).json({message:"Team Member Role Update Failed"});
        }
    }
    catch (error) {
        res.status(500).json({message:"Internal Server Error"});
        console.error("Error in Changing Team Member Role", error);
    }
}
exports.DeleteATeamMember=async(req,res)=>{
    try {
        const teamMemberId=req.params.teamMemberId
        const teamMember=await TeamMemberServices.deleteATeamMember(teamMemberId);
        if(teamMember){
            res.status(200).json({message:"Team Member Deleted Successfully"});
            }
        else{
            res.status(400).json({message:"Team Member Deletion Failed"});
        }
    }
    catch (error) {
        res.status(500).json({message:"Internal Server Error"});
        console.error("Error in Deleting Team Member", error);
    }
}

exports.AdminTeamMemberAddTeamMember=async(req,res)=>{
    try {
        const {createdAdminId,UserName,UserPhone,UserEmail,UserRole}=req.body
        const userId=createdAdminId
        const teamMember = await TeamMemberServices.AdminTeamMemberAddTeamMember(userId,{
            UserName,
            UserPhone,
            UserEmail,
            UserRole
        });
        if(teamMember){
            res.status(201).json({message:"Team Member Added Successfully",teamMember});
        }
        else{
            res.status(400).json({message:"Team Member Addition Failed"});
        }
    }catch (error) {
        res.status(500).json({message:"Internal Server Error"});
        console.error("Error in Adding Team Member to Admin", error);
    }
}
exports.getAllTeamMembersOfAdmin=async(req,res)=>{
    try {
        const userDetails=req.body.createdAdminId
        const teamMembers=await TeamMemberServices.getAllTeamMembersForaSpecificAdminTeamMember(userDetails);
        if(teamMembers){
            res.status(200).json({message:"All Team Members Fetched Successfully",teamMembers});
        }
        else{
            res.status(400).json({message:"No Team Members Found"});
        }
        }
    catch (error) {
        res.status(500).json({message:"Internal Server Error"});
        console.error("Error in Fetching All Team Members", error);
    }
}


