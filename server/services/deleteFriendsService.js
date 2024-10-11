const { dataResponse } = require("../utils/dataResponse");
const userDAO = require("../repositories/userDAO");
const friendshipDAO = require("../repositories/friendshipDAO");

async function deleteFriend(userId, username, targetUsername) {
    /**
     * service layer function to handle the deletion of user friends link
     * 
     * userId, username - valdiated by middleware
     * targetUsername - will be validated here
     */
    try {
        const data = {}

        // block checks if targetUserame is valid
        if (!targetUsername || typeof targetUsername !== "string") {
            data.message = "invalid - required username of type string";
            return dataResponse(400, 'fail', data);
        }

        const returnedUser = await userDAO.getUserByUsername(targetUsername);

        // block checks if returnedUser does not exists
        if (returnedUser.Count === 0) {
            data.message = `invalid - user ${targetUsername} not found`;
            return dataResponse(404, 'fail', data);
        }

        // block checks if more than 1 user is found in the database
        if (returnedUser.Count > 1) {
            data.message = `invalid - more than one user by username ${targetUsername} found`;
            return dataResponse(400, 'fail', data);
        }

        const { user_id: targetUserId } = returnedUser.Items[0];

        // console.log(userId, username, targetUsername, targetUserId);
        await friendshipDAO.deleteFriend(userId, targetUserId);
        await friendshipDAO.deleteFriend(targetUserId, userId);

        return dataResponse(204, "success");
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = { deleteFriend }