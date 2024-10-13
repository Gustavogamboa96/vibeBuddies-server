const userDAO = require("../repositories/userDAO");
const vibeCheckService = require("../services/vibeCheckService");
const { deleteAllFriends } = require("../services/deleteAllFriendsService");
const { dataResponse } = require("../utils/dataResponse");

async function deleteUser(username, userId) {
    /**
     * service layer function to handle the deletion of a user based on their id
     * deletes users vibeChecks and friends
     * 
     * username - grabbed from the auth middleware
     * userId - grabbed from the auth middleware
     */


    try {
        // deleting all the vibeChecks
        await vibeCheckService.deleteAllVibeChecksByUserId(userId);

        // calling the delete all friends service
        await deleteAllFriends(userId);

        const response = await userDAO.deleteUserById(username);
        const data = {}

        // block to check we get back some response
        if (!response) {
            data.message = "Sorry something went wrong.";
        }

        data.message = `${username} deleted successfully`;

        return dataResponse(204, "success", data);

    } catch (error) {
        throw new Error(error.message);
    }

}

module.exports = { deleteUser }