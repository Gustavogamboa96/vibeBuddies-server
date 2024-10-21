const userDAO = require("../repositories/userDAO");
const vibeCheckService = require("./vibeCheckService");
const { deleteAllFriends } = require("./deleteAllFriendsService");
const { dataResponse } = require("../utils/dataResponse");
const logger = require("../utils/logger");

async function deleteUser(username, userId) {
    /**
     * service layer function to handle the deletion of a user based on their id
     * deletes users vibeChecks and friends before user gets deleted
     * 
     * username - grabbed from the auth middleware
     * userId - grabbed from the auth middleware
     */


    try {
        // deleting all the vibeChecks
        logger.warn(`deleting all vibechecks for user: ${username}`);
        await vibeCheckService.deleteAllVibeChecksByUserId(userId);

        // deleting all friends
        logger.warn(`deleting all friends associated with user: ${username}`);
        await deleteAllFriends(userId);

        // deleting the user
        logger.warn(`deleting user: ${username}`);
        await userDAO.deleteUserById(username);

        // data response
        return dataResponse(204, "success");

    } catch (error) {
        logger.error(`Error in deleteAccountService.js: ${error.message} `);
        throw error;
    }

}

module.exports = { deleteUser }