const { UserController } = require('../controllers/userController');
const { AuthController } = require('../controllers/authController');
const express = require('express');
const route = express.Router();

// route.get('/test', UserController.testRoute);
// route.get('/auth-test', AuthController.testAuth);

route.post('/request-otp', AuthController.requestOtp);
route.post('/verify-otp', AuthController.verifyOtp);
route.post('/register', AuthController.register);
route.post('/login', AuthController.login);

module.exports = route;