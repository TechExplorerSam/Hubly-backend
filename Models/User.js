const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UsersSchema = new Schema({
    firstName: String,
    lastName: String,
    username:{
        type: String,
        required: [true, 'Username is required!'],
        unique: true


    },
    email: {
        type: String,
        required: [true, 'Email is required!'],
        
        unique: true
    },
    password: {
        type: String,
        validate: {
            validator: function (v) {
                return v.length > 6;
            },
            message: props => `${props.value} must be at least 6 characters!`
        },
        required: [true, 'Password is required!'],
    },
    confirmPassword: {
        type: String,
        validate: {
            validator: function (v) {
                return this.password === v;
            },
            message: props => `${props.value} confirm password must match the password!`
        
        },
    },
    UserRole: {
        type: String,
        enum: ['Admin'],
        default: 'Admin',
    },
    UserReplyToChatTime: {
        type: Date,
       
    },
    MissedChatDetails: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Chats',
          default: null,
        }
       
      ]
 ,     
    MissedChatsCount: {
        type: Number,
        default: 0,
    },
    UserAccessToTicket: {
        type: String,
        enum: ['Granted', 'Revoked'],
        default: 'Granted',
    },
    UserAssociatedTeamMembers: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TeamMembers' }],
        },
        
   MissedChattimer: {
        hours: {
            type: String,
            default: "0",
        },
        minutes: {
            type: String,
            default:" 0",
        },
        seconds: {
            type: String,
            default: "0",
        },
    },
   
   
    
});
const User = mongoose.model('User', UsersSchema);
module.exports = User;