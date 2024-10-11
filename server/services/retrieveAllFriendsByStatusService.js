const { dataResponse } = require("../utils/dataResponse");
const friendShipDAO = require("../repositories/friendshipDAO");

async function retrieveAllFriendsByStatus(userId, status) {
    /**
     * service layer function to handle the retrieval of friends by given status
     * 
     * status - by default is accepted
     */
    try {
        const data = {}

        // block checks that status is valid query
        if (status !== "accepted" && status !== "pending") {
            data.message = "invalid - query parameter status can only be accepted or pending";
            return dataResponse(400, 'fail', data);
        }

        // DAO layer function to get all friends by status
        const retrievedData = await friendShipDAO.retrieveAllFriendsByStatus(userId, status);

        // block to handle if no data is present
        if (retrievedData.Count === 0) {
            data.message = `no friends with status: ${status}`;
            return dataResponse(200, 'success', data);
        }

        // this is will handle the collection of users
        data.friendList = [];

        // block to return the friends returned
        retrievedData.Items.map(itemObj => {
            const friendObj = {
                ...itemObj
            }

            // pushing data to our new object
            data.friendList.push(friendObj);
        })

        data.message = `${retrievedData.Count} items found with status ${status}`;
        return dataResponse(200, 'success', data);
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = { retrieveAllFriendsByStatus }