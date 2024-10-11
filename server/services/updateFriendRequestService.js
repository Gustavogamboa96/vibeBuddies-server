const { dataResponse } = require("../utils/dataResponse");
const friendShipDAO = require("../repositories/friendshipDAO");
const userDAO = require("../repositories/userDAO");

async function friendRequestUpdate(userId, username, targetUsername, status) {
    /**
     * service layer function to handle updating a friend request
     * 
     * if accepted, then a relation should be made with friendStatus: accepted bewteen both people on database
     * ex. username1 is friends with username2 ANNNND username2 is friends with username1
     * 
     * if denied, then friend request should be deleted from the database
     * 
     * userId, username - grabbed from auth middleware
     * targetUsername, status - grabbed from the body of the request
     */
    try {
        const data = {};

        // block checks that body contains targetUsername
        if (!targetUsername || typeof targetUsername !== "string") {
            data.message = "invalid - targetUsername of type string is required";
            return dataResponse(400, 'fail', data);
        }

        const returnedUser = await userDAO.getUserByUsername(targetUsername);

        // block checks if the username in the body is invalid
        if (returnedUser.Count === 0) {
            data.message = "invalid - user not found";
            return dataResponse(404, 'fail', data);
        }
        // console.log(returnedUser)

        const { user_id: targetUserId } = returnedUser.Items[0];

        // block checks that status is valid type
        if (status !== "denied" && status !== "accepted") {
            data.message = "invalid - status can only be accepted or denied";
            return dataResponse(400, 'fail', data); s
        }


        const friendRequestSearch = await friendShipDAO.findFriendRequest(userId, targetUserId);

        // block checks to see if the friend request exists within the database
        if (friendRequestSearch.Count === 0) {
            data.message = "invalid - no friend request found";
            return dataResponse(404, 'fail', data);
        }

        // block accepts the friend request
        if (status === "accepted") {
            await friendShipDAO.acceptFriendRequest(userId, targetUserId, username, targetUsername);
            await friendShipDAO.sendFriendReuest(userId, targetUserId, username, targetUsername, "accepted");
            data.message = "friend request accepted";
            return dataResponse(200, "success", data);
        }

        // block handles the denying of the friend request and removing the request from the database
        if (status === "denied") {
            await friendShipDAO.deleteFriend(userId, targetUserId);
            await friendShipDAO.deleteFriend(targetUserId, userId);
            data.message = "friend request denied";
            return dataResponse(200, "accepted", data);
        }

    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = { friendRequestUpdate }