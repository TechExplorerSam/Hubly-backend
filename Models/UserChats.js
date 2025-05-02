const mongoose=require("mongoose");
const chatSchema= new mongoose.Schema({
    message:String,
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    chatCreatedOnTime:{
        type:Date,
        default:Date.now
    },
    chatCreatedAt:{
        type:Date,
        default:Date.now
    },
    chatSenderUserDetails:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
})
const Chat= mongoose.model("Chat",chatSchema);
module.exports=Chat;
