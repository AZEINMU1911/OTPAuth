const { UserController } = require('../controllers/userController');
const { AuthController } = require('../controllers/authController');
const protect = require('../middlewares/protection');
const express = require('express');
const route = express.Router();

// route.get('/test', UserController.testRoute);
// route.get('/auth-test', AuthController.testAuth);

route.post('/request-otp', AuthController.requestOtp);
route.post('/verify-otp', AuthController.verifyOtp);
route.post('/register', AuthController.register);
route.post('/login', AuthController.login);
route.post('/login-otp/request', AuthController.requestLoginOtp);
route.post('/login-otp/verify', AuthController.verifyLoginOtp);

//Protected route
route.get('/me', protect, (req, res) => {
    res.json({ message: `Hello, your user ID is ${req.user.id} and email is ${req.user.email}` });
});

module.exports = route;