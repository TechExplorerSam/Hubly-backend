const TicketController = require('../Controllers/TicketsController');
const express = require('express');
const app = express.Router();
const jwtVerficationMiddelware = require('../Middlewares/JwtVerficationMiddelware');
const UserRoleVerificationMiddleware = require('../Middlewares/UserRoleVerificationMiddleware');
// Creating a new ticket
app.post('/createnewticket', jwtVerficationMiddelware,UserRoleVerificationMiddleware,TicketController.createANewTicketForUser);



app.post('/assigntickettoteammember/:ticketId',jwtVerficationMiddelware,UserRoleVerificationMiddleware, TicketController.assignTicketToTeamMember);   


app.get('/getalltickets/:userid', jwtVerficationMiddelware,UserRoleVerificationMiddleware, TicketController.getAllTicketsSpecificToAUser);


app.put('/updateticketstatus/:ticketId', jwtVerficationMiddelware,UserRoleVerificationMiddleware, TicketController.updateTicketStatus);


app.get('/searchticket', jwtVerficationMiddelware,UserRoleVerificationMiddleware, TicketController.searchTicketByTicketId);









module.exports = app;