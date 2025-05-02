const express=require('express');
const app=express();
const cron = require("node-cron");
const { storeDailyAnalytics } = require("./Services/AnalyticsServices");

const cors=require('cors');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.configDotenv();
const port=process.env.PORT || 9002;
const UserRoutes=require('./Routes/Userroutes');
const ChatRoutes=require('./Routes/ChatRoutes');
const ChatbotRoutes=require('./Routes/Chatbotroutes');
const TicketRoutes=require('./Routes/TicketRoutes');
const TeamMemberRoutes=require('./Routes/Teammemberroutes');
const AnalyticsRoutes=require('./Routes/Analyticsroutes');
app.use(cors(
  {
    origin:'https://hubly-frontend-sam.vercel.app/',
    methods:['GET','POST','PUT','DELETE'],
    credentials:true,
  }
));
app.use(express.json());

//Default route
app.get('/',(req,res)=>{
    res.send('Server is running successfully');
})
// All the routes of the application will go through this route

app.use('/User',UserRoutes);
app.use('/Ticket',TicketRoutes)
app.use('/Chatbot',ChatbotRoutes)
 app.use('/Chat', ChatRoutes);
 app.use('/TeamMember',TeamMemberRoutes)
 app.use('/Analytics',AnalyticsRoutes)
// app.use('/ChatbotUser', ChatbotUserRoutes);

  mongoose.connect(process.env.MONGO_DB_URL).then(()=>{
    console.log('Connected to MongoDB');
  }).catch((err)=>{
    console.log(err);
  }
  )
 

  cron.schedule("0 * * * *", async () => {
    console.log("Started Running hourly analytics snapshot...");
    try {
      await storeDailyAnalytics();
      console.log("Analytics snapshot stored successfully.");
    } catch (err) {
      console.error("Failed to store analytics snapshot:", err);
    }
  });
  
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})