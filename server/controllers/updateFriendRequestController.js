const { errorResponse } = require("../utils/errorResponse");
const { friendRequestUpdate } = require("../services/updateFriendRequestService")

async function updateFriendRequest(req, res) {
    /**
     * controller layer function to handle the accepting/denying of a friend request
     */
    try {
        // destructuring required params
        const { user_id: userId, username } = req.user;
        const { status, targetUsername } = req.body;

        const response = await friendRequestUpdate(userId, username, targetUsername, status);

        // responding to client with object data
        res.status(response.httpStatus).json({
            status: response.status,
            ...(response.data && { data: response.data }),
        })
    } catch (error) {
        console.log(error.message);
        const response = errorResponse(500, "Internal server error during loggin");
        res.status(response.httpStatus).json({
            message: response.message
        });
    }
}


module.exports = { updateFriendRequest };