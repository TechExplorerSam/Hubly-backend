const ChatbotController = require('../Controllers/ChatbotController');
const express = require('express');
const app = express.Router();
// Registering a new user
app.post('/registeranewuserthroughchatbot', ChatbotController.registerUserthroughChatbot);

//loogging in a chatbot user

app.post('/loginchatbotuser', ChatbotController.loginChatbotUser);

// Customizing the chatbot styles
app.post('/customizechatbotstyles', ChatbotController.customizechatbotStyles);
// Sending a reply to the chatbot user
app.post('/sendreplytochatbotuser', ChatbotController.sendReplytoChatbotUser);
// Creating a new chat with the user
app.post('/createanewchatwithuser', ChatbotController.createanewChatWithUser);


app.get('/getchatbotuserdetails/:userId', ChatbotController.getChatbotUserDetails);

app.get('/getchatbotstylesforuser',ChatbotController.getChatbotStylesForUser);

app.post('/sendmessagetochat/:chatId',ChatbotController.addChatsToExistingUser)
module.exports = app;