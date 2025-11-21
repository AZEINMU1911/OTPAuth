class UserController {

    static async testRoute(req, res, next) {
        try {
            res.status(200).json({ message: "User route is working!" });
        } catch (error) {
            console.log(error);

        }
    }

}

module.exports = {UserController};