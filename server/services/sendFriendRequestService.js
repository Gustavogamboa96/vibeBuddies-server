const userDAO = require("../repositories/userDAO");
const friendshipDAO = require("../repositories/friendshipDAO");
const { dataResponse } = require("../utils/dataResponse");

async function friendRequest(userId, username, targetUsername) {
    /**
     * service layer function to handle friend request
     *
     * userId - will be present, grabbed from auth middleware
     * username - will be present, grabbed from auth middleware
     * targetUsernaem - will be present, valdiated by middleware
     */
    try {
        const data = {};

        // block checks that targetUsername is valid
        if (!targetUsername || typeof targetUsername !== 'string') {
            data.message = "invalid - targetUsername of type string is required";
            return dataResponse(400, 'fail', data);
        }

        // calling the DAO layer function for user to get user by targetUsername
        const returnedUser = await userDAO.getUserByUsername(targetUsername);

        // block to see if no user is found by targetUsername
        if (returnedUser.Count === 0) {
            data.message = `invalid - no user found with targetUsername: ${targetUsername}`;
            return dataResponse(404, 'fail', data);
        }

        // 
        if (username === targetUsername) {
            data.message = "invalid - can not send request to yourself";
            return dataResponse(400, 'fail', data);
        }

        // block checks if more than 1 user is found
        if (returnedUser.Count > 1) {
            data.message = `invalid - ${returnedUser.Count} users found with the targetUsername: ${targetUsername}`;
            return dataResponse(404, 'fail', data);
        }

        // getting the response from sending a friend request
        const response = await friendshipDAO.sendFriendReuest(userId, returnedUser.Items[0].user_id, username, targetUsername);

        data.message = `friend request sent to ${targetUsername}`;
        return dataResponse(200, 'success', data);
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = { friendRequest }