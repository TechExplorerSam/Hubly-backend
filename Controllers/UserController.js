const UserServices=require('../Services/UserServices')

exports.UserLogin=async(req,res)=>{
    try {
        const loggedInUser = await UserServices.loginExisitngUser(req.body);
        res.status(200).json({ message: "Login Successful", user: loggedInUser });
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
      
}

exports.UserRegister=async(req,res)=>{
    try {
        const user=await UserServices.registernewUser(req.body);
        if(user){
            res.status(201).json({message:"User Registered Successfully",user});
           
        }
        else{
            res.status(400).json({message:"User Registration Failed"});
        }
    }
    catch (error) {
        res.status(500).json({message:"Internal Server Error"});
        console.error("Error in User Registration Controller:", error);
    }
}
exports.UpdateExisitngUser=async(req,res)=>{
    try{
        const user=await UserServices.UpdateExistingUser(req,res);
      if(user){
        res.status(200).json({message:"User Updated Successfully",user});
        }
        else{
            res.status(400).json({message:"User Update Failed Please check your credentials Properly"});
        }
    }
    catch(error){
        console.log(error);
    }
}
exports.UpdateEmailOrPasswordorBothOfUser = async (req, res) => {
    try {
        console.log("Request Body:", req.body);
        const user = await UserServices.UpdateEmailOrPasswordorBothOfUser(req); 
        res.status(200).json({
            message: "User Updated Successfully",
            user: user,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

 exports.makeaTeamMemberAnAdmin=async(req,res)=>{
    try{
        const user=await UserServices.makeaTeamMemberanAdmin({
            id:req.params.id,
            createdAdmin:req.body.createdAdmin,
        }
            
        );
        if(user){
            res.status(200).json({message:"User Updated Successfully",user});
        }
        else{
            res.status(400).json({message:"User Update Failed Please check your credentials Properly"});
        }
    }
    catch(error){
        console.log(error);
    }
}

exports.getUserDetails=async(req,res)=>{
    
    const userId=req.params.userId
    console.log("User Id",userId)
   
    try{
        const user=await UserServices.getUserDetails(userId);
        if(user){
            res.status(200).json({message:"User Details Fetched Successfully",user});
        }
        else{
            res.status(400).json({message:"User Details Fetching Failed"});
        }
    }
    catch(error){
        console.log(error);
    }
}