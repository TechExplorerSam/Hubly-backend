const User=require('../Models/User');
const TeamMembers = require('../Models/TeamMembers');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.loginExisitngUser = async (loggingUserDetails) => {
    console.log("Request Body:", loggingUserDetails);
    const { username, password } = loggingUserDetails;

    const user = await User.findOne({ username });
    if(username.includes("@")) {
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(username)) {
            throw new Error("Invalid Email Format");
        }
        const TeamMemberwithEmail = await TeamMembers.findOne({ Email: username });
        if (!TeamMemberwithEmail) {
            throw new Error("User not found in the system");
        }
        const teamMemberAdminPassword = await User.findById(TeamMemberwithEmail.createdAdmin);
        if (!teamMemberAdminPassword) {
            throw new Error("Admin who created this Team Member was not found");
        }
        const isPasswordValid = await bcrypt.compare(password, teamMemberAdminPassword.password);
        if (!isPasswordValid) {
            throw new Error("Invalid password: must match the Admin's password");
        }
        const token = jwt.sign({ _id: TeamMemberwithEmail._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
        return {
            _id: TeamMemberwithEmail._id,
            fullName: TeamMemberwithEmail.FullName,
            teamRole: TeamMemberwithEmail.TeamRole,
            createdByAdmin: TeamMemberwithEmail.createdAdmin,
            isTeamMember: true,
            token
        };
    }
    const isUserTeamMember = await TeamMembers.findOne({ FullName: username });
       
    if (isUserTeamMember) {
        const adminUser = await User.findById(isUserTeamMember.createdAdmin);
        if (!adminUser) {
            throw new Error("Admin who created this Team Member was not found");
        }

        const isPasswordValid = await bcrypt.compare(password, adminUser.password);
        if (!isPasswordValid) {
            throw new Error("Invalid password: must match the Admin's password");
        }

        const token = jwt.sign({ _id: isUserTeamMember._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });

        return {
            _id: isUserTeamMember._id,
            fullName: isUserTeamMember.FullName,
            teamRole: isUserTeamMember.TeamRole,
            createdByAdmin: isUserTeamMember.createdAdmin,
            isTeamMember: true,
            token
        };
    }

    if (!user) {
        throw new Error("User not found in the system");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Invalid password");
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });

    return {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        UserRole: user.UserRole,
        isTeamMember: false,
        token
    };
};


exports.registernewUser = async (registeredUserDetails) => {
    
        console.log(" Request Body:", registeredUserDetails);

        const { firstName, lastName, username, email, password, confirmPassword } = registeredUserDetails;

        if (!firstName || !lastName || !username || !email || !password || !confirmPassword ) {
            console.error(" Missing required fields!");
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password !== confirmPassword) {
            console.error("Passwords do not match");
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            console.error(" Invalid Email Format");
            return res.status(400).json({ message: "Invalid Email" });
        }

        const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
        if (!passwordRegex.test(password)) {
            console.error(" Invalid Password Format");
            return res.status(400).json({ message: "Password must be at least 6 characters long and contain one uppercase letter, one lowercase letter, and one number." });
        }

        console.log("Passed Validations");

        const hashedPassword = await bcrypt.hash(password, 12);
        console.log(" Password Hashed");

        const user = new User({
            firstName,
            lastName,
            username,
            email,
            UserRole: 'Admin',
            password: hashedPassword,
            confirmPassword: hashedPassword,
            MissedChatDetials:"",
        });

        await user.save();
        console.log(" User Saved:", user);

       
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
        console.log("🔐 JWT Token Generated");

       return {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            email: user.email,
            UserRole: user.UserRole,
            token
        };

    } 

exports.getUserDetails=async(userId)=>{
 
        const user=await User.findById(userId);
        if(!user){
            const teamMember=await TeamMembers.findById(userId);
            if(!teamMember){
                throw new Error("User not found in database");
            }
            teamMember.FullName.split(" ");
            const firstName = teamMember.FullName.split(" ")[0];
            const lastName = teamMember.FullName.split(" ")[1];
            const email = teamMember.Email;
            const phone = teamMember.Phone;
           
            return {firstName, lastName, email,phone};

        }
        return user;
   }
exports.UpdateExistingUser = async (req, res) => {        
    console.log("Request Body:", req.body);

    const user = await User.findById(req.params.id);
        if(user){
            const { firstName, lastName } = req.body;

            if (!firstName || !lastName) {
                console.error("Missing required fields!");
                throw new Error("firstName and lastName are required");
            }
            user.firstName = firstName;
            user.lastName = lastName;

            await user.save(); 
            return user;
        }
        else{
            const teamMember = await TeamMembers.findById(req.params.id);
            if (!teamMember) {
                throw new Error("User not found in database");
            }
            console.log(req.body);
            const { FullName,phone } = req.body;

            if (!FullName ) {
                console.error("Missing required fields!");
                throw new Error("FullName, Phone, Email and TeamRole are required");
            }
            teamMember.FullName = FullName;
           
           
            teamMember.Phone = phone;
           

            await teamMember.save();
            return teamMember;

        }
       

        
       

       

       

       

    }
    exports.UpdateEmailOrPasswordorBothOfUser = async (req) => { 
        const user = await User.findById(req.params.id);
        if (!user) {
            throw new Error("User Not Found in database"); 
        }
    
        let isUpdated = false;
    
        if (req.body.email && user.email !== req.body.email) {
            const emailRegex = /\S+@\S+\.\S+/;
            if (!emailRegex.test(req.body.email)) {
                throw new Error("Invalid Email Format. Please Correct It");
            }
            user.email = req.body.email;
            isUpdated = true;
        }
    
        if (req.body.password) {
            const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
            if (!passwordRegex.test(req.body.password)) {
                throw new Error("Invalid Password Format.");
            }
            const newPassword = await bcrypt.hash(req.body.password, 12);
            user.password = newPassword;
            user.confirmPassword = newPassword;
            isUpdated = true;
        }
    
        if (isUpdated) {
            await user.save();
        } else {
            throw new Error("No changes detected");
        }
    
        return user; 
    };
    
exports.DeleteExistingUser = async (userDetails) => {
    
        console.log("Request Body:", userDetails);

        const user = await User.findById(userDetails.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        let deletedUser = user;
        await user.remove();
  

       return deletedUser;

    }
    //already done in TeamMembersServices
// exports.makeaTeamMemberanAdmin = async (userDetails) => {
//     const { id, createdAdmin } = userDetails;

//     const teammember = await TeamMembers.findById(id);
//     if (!teammember) {
//         throw new Error("User not found in db");
//     }
//     const adminUser = await User.findById(createdAdmin);
//     if (!adminUser) {
//         throw new Error("Admin not found in db");
//     }
//     teammember.Role = "Admin";
//     await teammember.save();
//     return teammember;

// }

