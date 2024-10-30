const { deleteFriend } = require("../services/deleteFriendsService");
const { errorResponse } = require("../utils/errorResponse");

async function deleteFriends(req, res) {
    /**
     * controller layer function to handle deleting of friends
     */

    try {

        // destructuring required params
        const { user_id: userId, username } = req.user;
        const { username: targetUsername } = req.params

        const response = await deleteFriend(userId, username, targetUsername);

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

module.exports = { deleteFriends };