const { errorResponse } = require("../utils/errorResponse");
const { getFriendsByUsername } = require("../services/retrieveFriendsByUsernameService");

async function retrieveFriendsByUsername(req, res) {
    /**
     * controller layer function to hanlde the retrieving of a username
     * 
     */
    try {
        const { username } = req.params

        const response = await getFriendsByUsername(username);

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

module.exports = { retrieveFriendsByUsername }