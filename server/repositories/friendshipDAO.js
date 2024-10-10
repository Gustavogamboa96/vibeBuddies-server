const { documentClient } = require("../db/dynamoClient");
const {
    QueryCommand,
    PutCommand,
    UpdateCommand,
    DeleteCommand,
} = require("@aws-sdk/lib-dynamodb");

const TABLE_NAME = "users_relationship_table"

async function sendFriendReuest(userId, targetUserId, friendStatus = "pending") {
    /**
     * DAO layer function to handle the sending of a friend request
     * can also be used to linked two friends
     * for example: 
     * ** john sends friend request to max, max then accepts the friend request a link must be made
     * ** showing that john is friends with max and max is friends with max john <-> max
     *
     * 
     * by default the friendship status will be pending
     */
    try {
        const params = {
            TableName: TABLE_NAME,
            Item: {
                userId: userId,
                targetUserId: targetUserId,
                friendStatus: friendStatus
            }
        }

        return await documentClient.send(new PutCommand(params));
    } catch (error) {
        throw new Error(error.message)
    }
}

async function retrieveAllFriendsByStatus(userId, status) {
    /**
     * DAO layer function to retrieve all friends by the provided status
     */
    try {
        const params = {
            TableName: TABLE_NAME,
            IndexName: "userId-index",
            KeyConditionExpression: "#userId = :userId",
            FilterExpression: " #friendStatus = :status",
            ExpressionAttributeNames: {
                "#userId": "userId",
                "#friendStatus": "friendStatus"
            },
            ExpressionAttributeValues: {
                ":userId": userId,
                ":status": status
            }
        }

        return await documentClient.send(new QueryCommand(params));

    } catch (error) {
        throw new Error(error.message)
    }
}

// accepting friend
// getting friend List
// deleting (deny, delete friend) friend
// handle deleting friends if they delete their account

// query by your id
// list of all the targetUserId
// filter by block first
// filter friendstatus = [pending, accepted, ]

module.exports = { sendFriendReuest, retrieveAllFriendsByStatus };