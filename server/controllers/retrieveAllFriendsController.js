const { errorResponse } = require("../utils/errorResponse");
const { retrieveAllFriendsByStatus } = require("../services/retrieveAllFriendsByStatusService");

async function retrieveAllFriends(req, res) {
    /**
     * controller layer function to handle retrieving all friends by status (accepted, pending)
     * 
     * userId will be present
     * status will be by default accepted
     */
    try {

        // destructuring required params
        const { status = "accepted" } = req.query;
        const { userId } = req.params;

        const response = await retrieveAllFriendsByStatus(userId, status);

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

module.exports = { retrieveAllFriends };