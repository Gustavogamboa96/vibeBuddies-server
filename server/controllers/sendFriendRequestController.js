const { errorResponse } = require("../utils/errorResponse");
const { friendRequest } = require("../services/sendFriendRequestService");
async function sendFreindRequest(req, res) {
    /**
     * controller layer function to send a friend request to another user
     * 
     * userId is verified by middleware
     * username should be present in the body, service layer will ensure this
     */

    try {
        // destructuring required variables
        const { userId } = req.params;
        const { username } = req.body;

        // calling the service layer friend request
        const response = await friendRequest(userId, username);

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

module.exports = { sendFreindRequest }