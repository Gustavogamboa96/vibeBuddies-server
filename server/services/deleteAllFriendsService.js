const { dataResponse } = require("../utils/dataResponse");
const friendshipDAO = require("../repositories/friendshipDAO");

async function deleteAllFriends(userId) {
    try {
        // getting all my friendShips
        const acceptedFriends = await friendshipDAO.retrieveAllFriendsByStatus(userId, "accepted");
        const pendingFriends = await friendshipDAO.retrieveAllFriendsByStatus(userId, "pending");
        const sentOutRequest = await friendshipDAO.retrievePendingRequestSent(userId);

        // block deletes and pending request user sent out
        if (sentOutRequest.Count > 0) {
            const { Items } = sentOutRequest;
            Items.forEach(async (value, index) => {
                await friendshipDAO.deleteFriend(value.userId, value.targetUserId);
                // await friendshipDAO.deleteFriend(value.targetUserId, value.userId);
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

        // block deletes any pending request you might have
        if (pendingFriends.Count > 0) {
            const { Items } = pendingFriends;
            Items.forEach(async (value, index) => {
                await friendshipDAO.deleteFriend(value.userId, value.targetUserId);
                // await friendshipDAO.deleteFriend(value.targetUserId, value.userId);
            })
        }

    } catch (error) {
        throw new error.message;
    }
}

module.exports = { deleteAllFriends }