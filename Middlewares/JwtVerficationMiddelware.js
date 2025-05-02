const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../Models/User");
const TeamMembers = require('../Models/TeamMembers');

const jwtVerficationMiddelware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: "Your Token is Missing and hence you are not Authorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        let user = await User.findById(decoded._id);

        if (!user) {
            user = await TeamMembers.findById(decoded._id);
            if (!user) {
                return res.status(401).json({ message: "User is not found entirely in system" });
            }
        }

        req.user = user; 
        next(); 
    } catch (error) {
        console.error("Error in JWT Verification Middleware:", error);
        return res.status(401).json({ message: "Invalid Token" });
    }
};

module.exports = jwtVerficationMiddelware;
