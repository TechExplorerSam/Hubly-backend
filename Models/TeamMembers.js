const mongoose= require("mongoose");
const TeamMembersSchema= new mongoose.Schema({
    createdAdmin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    FullName:{
        type:String,
        required:true
    },
    Phone:{
        type:String,
        required:true

    },
    Email:{
        type:String,
        required:true
    },
    Role:{
        type:String,
        required:true
    },
    AssignedToTicket:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Ticket",
        default:null
    },
    AccessToaTicket:[
        {
        AssignedticketId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Ticket",
            required:true

        },
        Ticketaccess:{
            type:String,
            enum:["Granted","Revoked"],
            default:"Revoked",
            required:true
        },
        
        
    }
    ],
    TeamMembersTeam:{
                type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TeamMembers' }],
                default: [],
        
       
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
    
})
const TeamMembers= mongoose.model("TeamMembers",TeamMembersSchema);
module.exports=TeamMembers;