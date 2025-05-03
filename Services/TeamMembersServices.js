const TeamMembers=require('../Models/TeamMembers');
const User = require('../Models/User');

exports.addATeamMember=async(createdAdminDetails,teamMemberDetails)=>{
   const {UserName,UserPhone,UserEmail,UserRole}=teamMemberDetails;
   console.log("Team Member Details",teamMemberDetails);
   console.log("Created Admin Details",createdAdminDetails);
    if(!createdAdminDetails || !UserName || !UserPhone || !UserEmail || !UserRole){
        throw new Error("Please provide all the required values createdAdminDetails, UserName, UserPhone, UserEmail and UserRole");
    }
    const checkifTeamMemberExists=await TeamMembers.findOne({createdAdmin:createdAdminDetails,Email:UserEmail});
    if(checkifTeamMemberExists){
        throw new Error("Team Member already exists with this credentials");
    }
   const newTeamMember=new TeamMembers({
    createdAdmin:createdAdminDetails,
       FullName:UserName,
       Phone:UserPhone,
       Email:UserEmail,
       Role:UserRole,
       
   })
   const updateAdminUserAssociatedTeamMember = await User.findById(createdAdminDetails);
   if (!updateAdminUserAssociatedTeamMember) {
    const teamMember = await TeamMembers.findById(createdAdminDetails);
    if (!teamMember) {
        throw new Error("User not found in database");
    }
    
    if (teamMember.Role !== "Admin") {
        throw new Error("You are not authorized to access this data as you are a team member but don't have the role as admin");
    }
    
    await newTeamMember.save();
    console.log("New Team Member Created", newTeamMember);
    console.log("Team Member ID", newTeamMember._id);
    
    if (!Array.isArray(teamMember.TeamMembersTeam)) {
        teamMember.TeamMembersTeam = [];
    }
    
    teamMember.TeamMembersTeam.push(newTeamMember._id);
    await teamMember.save();
    return teamMember;
    
    
   }
   

   if (!Array.isArray(updateAdminUserAssociatedTeamMember.UserAssociatedTeamMembers)) {
       updateAdminUserAssociatedTeamMember.UserAssociatedTeamMembers = [];
   }
   
  
   updateAdminUserAssociatedTeamMember.UserAssociatedTeamMembers.push(newTeamMember._id);
   
   await updateAdminUserAssociatedTeamMember.save();
   
   const savedTeamMember=await newTeamMember.save();
    return savedTeamMember;
}
exports. getAllTeamMembersForaSpecificUser=async(userDetails)=>{
    const teamMembers=await TeamMembers.find({createdAdmin:userDetails});
    return teamMembers;


}
exports. EditATeamMember=async(AdminuserId,teamMemberId,updatedDetails)=>{
    const AdminUser=await User.findById(AdminuserId);
    if(!AdminUser){
        throw new Error("Admin User not found in database");
    }
    const {UserName,UserPhone,UserEmail,UserRole}=updatedDetails;
    const teamMember=await TeamMembers.findById(teamMemberId);
    if(!teamMember){
        throw new Error("Team Member not found in database");
    }
    teamMember.FullName=UserName;
    teamMember.Phone=UserPhone;
    teamMember.Email=UserEmail;
    teamMember.Role=UserRole;

    await teamMember.save();
    return teamMember;

}
exports. deleteATeamMember=async(teamMemberId)=>{
    const teamMember=await TeamMembers.findById(teamMemberId);
    if(!teamMember){
        throw new Error("Team Member not found in database");
    }
    await teamMember.deleteOne();
    return teamMember;
}

exports.changeTeamMemberRole=async(updatingAdminId,teamMemberId,updatedRole)=>{
    if(!updatingAdminId || !teamMemberId || !updatedRole){
        throw new Error("Please provide all the required three values updatingAdminId, teamMemberId and updatedRole");
    }
    const updatingAdmin=await User.findById(updatingAdminId);
    if(updatingAdmin?.UserRole!=="Admin"){
       const teamMember=await TeamMembers.findById(updatingAdminId);
         if(!teamMember){
              throw new Error("Admin Team Member not found in database");

         }
            if(teamMember.Role!=="Admin"){
                throw new Error("Only Admin Team Member can update the role of other Team Members");
            }
            const AdminCreatedteamMember = await TeamMembers.findById(teamMemberId);
        if (!AdminCreatedteamMember) {
            throw new Error("Admin Team Member not found in database");
        }
        AdminCreatedteamMember.Role = updatedRole;
        await AdminCreatedteamMember.save();
        return AdminCreatedteamMember;
    }
    const teamMember=await TeamMembers.findById(teamMemberId);
    if(!teamMember){
        throw new Error("Team Member not found in database");
    }
    teamMember.Role=updatedRole;
    await teamMember.save();
    return teamMember;
}

exports.AdminTeamMemberAddTeamMember=async(adminUserId,teamMemberDetails)=>{
   const adminTeamMember=await TeamMembers.findById({_id:adminUserId});
   if(!adminTeamMember){
       throw new Error("Admin Team Member not found in database");
   }
   const newTeamMember=new TeamMembers({
       createdAdmin:adminUserId,
       FullName:teamMemberDetails.UserName,
       Phone:teamMemberDetails.UserPhone,
       Email:teamMemberDetails.UserEmail,
       Role:teamMemberDetails.UserRole
   })
   await newTeamMember.save();
   return newTeamMember;
   
}

exports.getAllTeamMembersForaSpecificAdminTeamMember=async(adminUserId)=>{
    const teamMembers=await TeamMembers.find({createdAdmin:adminUserId});
    if(!teamMembers){
        throw new Error("No Team Members Found");
    }
    return teamMembers;
}
exports.EditTeamMemberAdminUser=async(adminUserId,teamMemberId,updatedDetails)=>{
    const adminUser=await TeamMembers.findById(adminUserId);
    if(!adminUser){
        throw new Error("Admin User not found in database");
    }
    const {UserName,UserPhone,UserEmail,UserRole}=updatedDetails;
    const teamMember=await TeamMembers.findById(teamMemberId);
    if(!teamMember){
        throw new Error("Team Member not found in database");
    }
    teamMember.FullName=UserName;
    teamMember.Phone=UserPhone;
    teamMember.Email=UserEmail;
    teamMember.Role=UserRole;   
    await teamMember.save();
    return teamMember;
}
exports.deleteTeamMemberAdminUser=async(adminUserId,teamMemberId)=>{
    const adminUser=await TeamMembers.findById(adminUserId);
    if(!adminUser){
        throw new Error("Admin User not found in database");
    }
    const teamMember=await TeamMembers.findById(teamMemberId);
    if(!teamMember){
        throw new Error("Team Member not found in database");
    }
    await teamMember.deleteOne();
    return teamMember;
}