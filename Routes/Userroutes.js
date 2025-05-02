const UserController=require('../Controllers/UserController')
const express = require('express');
const app = express.Router();
const jwtVerficationMiddelware = require('../Middlewares/JwtVerficationMiddelware');
const UserRoleVerificationMiddleware = require('../Middlewares/UserRoleVerificationMiddleware');
// Registering a new user
app.post('/registeranewuser',UserController.UserRegister);

// Logging in an existing user or newly registered user
app.post('/login',UserController.UserLogin)


// Updating an existing user
app.put('/updateuser/:id',UserController.UpdateExisitngUser);

// Updating email or password or both of a user
app.put('/updateemailorpassword/:id',jwtVerficationMiddelware,UserRoleVerificationMiddleware,UserController.UpdateEmailOrPasswordorBothOfUser);

app.get('/getUserDetails/:userId',jwtVerficationMiddelware,UserRoleVerificationMiddleware,UserController.getUserDetails);
module.exports = app;