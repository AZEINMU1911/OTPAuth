const { User, EmailVerification } = require('../models');
class UserController {

    static async testRoute(req, res, next) {
        try {
            res.status(200).json({ message: "User route is working!" });
        } catch (error) {
            console.log(error);

        }
    }

    static async me(req, res) {
        try {
            // from your protect middleware:
            // req.user = { id: decoded.userId, email: decoded.email };

            const { id, email } = req.user || {};

            if (!id || !email) {
                return res.status(401).json({ message: 'Invalid token payload' });
            }

            // Optional: hit DB to get fresh user data
            const user = await User.findByPk(id, {
                attributes: ['id', 'email', 'createdAt'],
            });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            return res.status(200).json({
                id: user.id,
                email: user.email,
                createdAt: user.createdAt,
            });
        } catch (error) {
            console.error('Error in me:', error);
            if (res.headersSent) return;
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }


}

module.exports = { UserController };