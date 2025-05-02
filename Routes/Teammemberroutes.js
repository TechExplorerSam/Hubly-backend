const express = require('express');
const TeamMemberController = require('../Controllers/TeamMembersController');
const app = express.Router();
const jwtVerficationMiddelware = require('../Middlewares/JwtVerficationMiddelware');
const UserRoleVerificationMiddleware = require('../Middlewares/UserRoleVerificationMiddleware');
//these comments are for guiding which route is handling which request
// Creating a new team member
app.post('/createnewteammember',jwtVerficationMiddelware,UserRoleVerificationMiddleware, TeamMemberController.addATeamMemberToUser);
// Getting all team members
app.get('/getallteammembers/:userId',jwtVerficationMiddelware,UserRoleVerificationMiddleware, TeamMemberController.getAllTeamMembersOfUser);

// Updating a team member by ID
app.put('/updateteammemberbyid/:id',jwtVerficationMiddelware,UserRoleVerificationMiddleware, TeamMemberController.EditATeamMember);
// Deleting a team member by ID
app.delete('/deleteteammemberbyid/:teamMemberId',jwtVerficationMiddelware,UserRoleVerificationMiddleware,TeamMemberController.DeleteATeamMember);

app.put('/updateteammemberrole/:id',jwtVerficationMiddelware,UserRoleVerificationMiddleware, TeamMemberController.changeTeamMemberRole);

app.post('/addteammemberbyadminteammember',jwtVerficationMiddelware,UserRoleVerificationMiddleware, TeamMemberController.AdminTeamMemberAddTeamMember);
module.exports = app;