const mongoose = require('mongoose');

const ChatbotUserSchema = new mongoose.Schema({
    chatbotregisteredUsername:{
        type:String,
        required:true

    },
    chatbotregisteredEmail:{
        type:String,
        required:true
    },
    chatbotregisteredPhone:{
        type:String,
        required:true
    },
    chatbotregisteredUserRole:{
        type:String,
        enum:['User'],
        default:'User'
    }
})

const ChatbotUser = mongoose.model('ChatbotUser', ChatbotUserSchema);
module.exports = ChatbotUser;