const mongoose = require('mongoose');

const chatbotSchema = new mongoose.Schema({
    headerColor: {
        type: String,
        required: true
    },
    backgroundColor: {
        type: String,
        required: true
    },
    userMessage: {
        type: [String],
        required: true
    },
    welcomeMessage: {
        type: String,
        required: true
    },
    introductionFormPlaceholderValues: {
        chattingUserNamePlaceholderValue: {
            type: String,
            required: true
        },
        chattingUserPhonePlaceholderValue: {
            type: String,
            required: true
        },
        chattingUserEmailPlaceholderValue: {
            type: String,
            required: true
        }
    },
    missedChatTimer: {
        type: {
            hours: { type: String, required: true },
            minutes: { type: String, required: true },
            seconds: { type: String, required: true }
          },
        required: true
    }
    ,creatingAdminId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
    ,creatingTeamMemberAdminId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TeamMembers',
       
        default: null
    }
});

const ChatbotStyle = mongoose.model('ChatbotStyle', chatbotSchema);
module.exports = ChatbotStyle;
