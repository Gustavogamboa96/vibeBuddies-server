const { dataResponse } = require("../utils/dataResponse");
const friendshipDAO = require("../repositories/friendshipDAO");

async function deleteAllFriends(userId) {
    /**
     * service layer function to delete all the friends associated with a user
     * 
     * userId - required and expected
     */
    try {
        // getting friends
        const acceptedFriends = await friendshipDAO.retrieveAllFriendsByStatus(userId, "accepted");
        // getting friend requests
        const pendingFriends = await friendshipDAO.retrieveAllFriendsByStatus(userId, "pending");
        // getting friend request sent out
        const sentOutRequest = await friendshipDAO.retrievePendingRequestSent(userId);

        // block deletes any friend requests sent out by user
        if (sentOutRequest.Count > 0) {
            const { Items } = sentOutRequest;
            Items.forEach(async (value, index) => {
                await friendshipDAO.deleteFriend(value.userId, value.targetUserId);
            })
        }

        // block deletes both directions of friends
        if (acceptedFriends.Count > 0) {
            const { Items } = acceptedFriends;
            Items.forEach(async (value, index) => {
                await friendshipDAO.deleteFriend(value.userId, value.targetUserId);
                await friendshipDAO.deleteFriend(value.targetUserId, value.userId);
            })
        }

        // block deletes any pending request user might have
        if (pendingFriends.Count > 0) {
            const { Items } = pendingFriends;
            Items.forEach(async (value, index) => {
                await friendshipDAO.deleteFriend(value.userId, value.targetUserId);
            })
        }

    } catch (error) {
        throw error;
    }
}

module.exports = { deleteAllFriends }