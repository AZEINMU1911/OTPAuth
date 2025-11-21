// controllers/authController.js
const { User, EmailVerification } = require('../models');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

class AuthController {
    static async testAuth(req, res) {
        return res.status(200).json({ message: 'Auth route is working!' });
    }

    static async requestOtp(req, res, next) {
        try {
            const { email } = req.body || "";
            if (!email) {
                return res.status(400).json({
                    message: 'Email is required'
                });
            }

            const normalizedEmail = email.toLowerCase().trim();

            const existingUser = await User.findOne({
                where: { email: normalizedEmail, isVerified: true },
            });

            if (existingUser) {
                return res.status(400).json({ message: 'Email already registered' });
            } else {
                console.log('Safe to use this email');
            }

            const otp = Math.floor(100000 + Math.random() * 900000).toString();

            const expiresAt = new Date(Date.now() + 3 * 60 * 1000);

            const [record, created] = await EmailVerification.findOrCreate({
                where: { email: normalizedEmail },
                defaults: {
                    otp,
                    otpExpiresAt: expiresAt,
                    used: false,
                },
            });

            if (!created) {
                record.otp = otp;
                record.otpExpiresAt = expiresAt;
                record.used = false;
                await record.save();
            }

            console.log(`OTP for ${normalizedEmail}: ${otp}`);

            return res.status(200).json({
                message: `OTP sent to ${normalizedEmail}`
                , otp: `${otp}`
            });
        } catch (error) {
            console.error('Error in requestOtp:', error);
            next(error);
        }
    }

    static async verifyOtp(req, res, next) {
        try {
            const { email, otp } = req.body || {};

            if (!email || !otp) {
                return res.status(400).json({ message: 'Email and OTP are required' });
            }

            const normalizedEmail = email.toLowerCase().trim();

            const record = await EmailVerification.findOne({
                where: { email: normalizedEmail },
            });

            if (!record) {
                return res.status(400).json({ message: 'Invalid email or OTP' });
            }

            if (record.used) {
                return res.status(400).json({ message: 'OTP already used, request a new one' });
            }

            const now = new Date();
            if (record.otpExpiresAt <= now) {
                return res.status(400).json({ message: 'OTP has expired, request a new one' });
            }

            if (record.otp !== otp) {
                return res.status(400).json({ message: 'Invalid email or OTP' });
            }

            record.used = true;
            await record.save();

            const payload = {
                email: normalizedEmail,
                type: 'emailVerification',
            };

            const secret = process.env.EMAIL_VERIFY_SECRET;
            const expiresIn = process.env.EMAIL_VERIFY_EXPIRES_IN || '3m';

            const emailVerifiedToken = jwt.sign(payload, secret, { expiresIn });
            console.log(`Email verified token for ${normalizedEmail}: ${emailVerifiedToken}`);

            return res.status(200).json({
                message: 'OTP verified successfully',
                emailVerifiedToken,
            });
        } catch (error) {
            console.error('Error in verifyOtp:', error);
            next(error);
        }
    }

    static async register(req, res, next) {
        try {
            //Checks
            const { email, password, emailVerifiedToken } = req.body || {};

            if (!email || !password || !emailVerifiedToken) {
                return res.status(400).json({ message: 'Email, password, and emailVerifiedToken are required' });
            }
            const normalizedEmail = email.toLowerCase().trim();

            //Token Check
            let payload
            try {
                payload = jwt.verify(emailVerifiedToken, process.env.EMAIL_VERIFY_SECRET);
            } catch (err) {
                return res.status(400).json({ message: 'Invalid or expired emailVerifiedToken' });
            }

            if (payload.type !== 'emailVerification') {
                return res.status(400).json({ message: 'Invalid token type' });
            }

            if (payload.email !== normalizedEmail) {
                return res
                    .status(400)
                    .json({ message: 'Token email does not match the provided email' });
            }

            //User Check
            const existingUser = await User.findOne({ where: { email: normalizedEmail } });
            if (existingUser && existingUser.isVerified) {
                return res.status(400).json({ message: 'Email is already registered' });
            }

            if (password.length < 8) {
                return res
                    .status(400)
                    .json({ message: 'Password must be at least 8 characters long' });
            }

            //Create User
            let user;
            const passwordHash = await bcrypt.hash(password, 10);
            user = await User.create({
                email: normalizedEmail,
                passwordHash,
                isVerified: true,
            });

            console.log("Successfully registered");
            return res.status(201).json({ message: 'User registered successfully' });

        } catch (error) {
            console.error('Error in register:', error);
            next(error);
        }
    }

    static async login(req, res, next) {
        try {
            const { email, password } = req.body || {};

            if (!email || !password) {
                return res.status(400).json({ message: 'Email and password are required' });
            }

            const user = await User.findOne({ where: { email } });

            const isMatch = user ? await bcrypt.compare(password, user.passwordHash) : false;

            if (!user || !isMatch) {
                return res.status(400).json({ message: 'Invalid email or password' });
            }
            
            const payload = {
                id: user.id,
                email: user.email,
            };
            const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '1d' });

            return res.status(200).json({
                message: 'Login successful',
                accessToken: token,
            });

        } catch (error) {
            console.error('Error in login:', error);
            next(error);
        }
    }
}

module.exports = { AuthController };
