const { errorResponse } = require("../utils/errorResponse");
const { retrieveUserByUsername } = require("../services/retrieveUserByUsernameService");

async function getUserByUsername(req, res) {
    /**
     * controller layer function to handle getting a users information
     */

    try {
        const { username } = req.body;

        // calling the service layer function to a user based on the username
        const response = await retrieveUserByUsername(username);

        // responding to client with object data
        return res.status(response.httpStatus).json({
            status: response.status,
            ...(response.data && { data: response.data })
        });
    } catch (error) {
        console.log(error.message);
        const response = errorResponse(500, "Internal server error during loggin");
        res.status(response.httpStatus).json({
            message: response.message
        });
    }
}

module.exports = { getUserByUsername }