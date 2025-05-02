const User = require("../Models/User");
const jwt = require('jsonwebtoken');
const TeamMembers = require('../Models/TeamMembers');
const UserRoleVerificationMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findById(decoded._id);

        if (!user) {
           const teamMember = await TeamMembers.findById(decoded._id);
            if (!teamMember) {
                return res.status(401).json({ message: "User is not found in the system" });
            }
            req.user = teamMember;
            return next();
        }

        if (user.UserRole !== 'Admin') {
            return res.status(403).json({ message: "Access denied as you are not admin" });
        }

        req.user = user;
      
        next();
    } catch (error) {
        console.error("Error in User Role Verification Middleware:", error);
      
        if (!res.headersSent) {
            return res.status(401).json({ message: "Invalid token" });
        }
    }
}

module.exports = UserRoleVerificationMiddleware;
