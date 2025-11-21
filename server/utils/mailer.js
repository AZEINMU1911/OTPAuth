// utils/mailer.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

/**
 * Sends an OTP email to the user.
 * @param {string} to - recipient email
 * @param {string} otp - the OTP code
 */
async function sendOtpEmail(to, otp) {
    const mailOptions = {
        from: process.env.SMTP_FROM,
        to,
        subject: 'Your OTP Code',
        text: `Your OTP code is: ${otp}. It will expire in 3 minutes.`,
        html: `
      <p>Your OTP code is:</p>
      <h2>${otp}</h2>
      <p>This code will expire in 3 minutes.</p>
    `,
    };

    await transporter.sendMail(mailOptions);
}

module.exports = {
    sendOtpEmail,
};
