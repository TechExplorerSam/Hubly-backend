const express = require('express');
const ChatController = require('../Controllers/ChatController');
const app = express.Router();

//getting all the chats for a specific ticket
app.get('/getAllChatsForaTicket/:ticketId', ChatController.getAllChatsForATicket);

app.get('/getAllChatsForaUser/:userId', ChatController.getAllChatsSpecificToUser);

app.post('/classifychatasmissedchat',ChatController.classifyChatAsMissedChat);

app.get('/checkifchatassignedtoanotheruser',ChatController.checkifchatassignedtoanotheruser);

app.get('/getAllChatsForChatbotUser/:chatId', ChatController.getChatsforChatbotUser);
module.exports = app;