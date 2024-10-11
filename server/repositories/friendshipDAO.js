const { documentClient } = require("../db/dynamoClient");
const {
    QueryCommand,
    PutCommand,
    UpdateCommand,
    DeleteCommand,
} = require("@aws-sdk/lib-dynamodb");

const TABLE_NAME = "users_relationship_table"

async function sendFriendReuest(userId, targetUserId, username, targetUsername, friendStatus = "pending") {
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
                friendStatus: friendStatus,
                username: username,
                targetUsername: targetUsername
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

async function findFriendRequest(userId, targetUserId, status = "pending") {
    /**
     * DAO layer function to retrieve all friends by the provided status
     * 
     * because the main functionality is to be able to send a friend request the status is by default pending
     */
    try {
        const params = {
            TableName: TABLE_NAME,
            KeyConditionExpression: "#userId = :targetUserId  AND #targetUserId = :userId",
            FilterExpression: " #friendStatus = :status",
            ExpressionAttributeNames: {
                "#userId": "userId",
                "#targetUserId": "targetUserId",
                "#friendStatus": "friendStatus"
            },
            ExpressionAttributeValues: {
                ":userId": userId,
                ":targetUserId": targetUserId,
                ":status": status
            }
        }

        return await documentClient.send(new QueryCommand(params));

    } catch (error) {
        throw new Error(error.message)
    }
}

async function acceptFriendRequest(userId, targetUserId) {
    /**
     * DAO layer function to update a friend request from pending to accepted
     * 
     * function makes conneciton betwene two users and sets their friendStatus to accepted
     */

    try {
        const params = {
            TableName: TABLE_NAME,
            Key: {
                userId: targetUserId,
                targetUserId: userId
            },
            UpdateExpression: "SET #friendStatus = :acceptedStatus",
            ExpressionAttributeNames: {
                "#friendStatus": "friendStatus"
            },
            ExpressionAttributeValues: {
                ":acceptedStatus": "accepted"
            },
            ReturnValues: "ALL_NEW",
        }

        return await documentClient.send(new UpdateCommand(params));
    } catch (error) {
        throw new Error(error.message)
    }
}

async function deleteFriend(userId, targetUserId) {
    /**
     * DAO layer to delete a friend request or friend from database
     * 
     * finds connection between two users and deletes it in the database
     */

    try {
        const params = {
            TableName: TABLE_NAME,
            Key: {
                userId: userId,
                targetUserId: targetUserId,
            }
        }

        return await documentClient.send(new DeleteCommand(params));
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = { sendFriendReuest, retrieveAllFriendsByStatus, findFriendRequest, acceptFriendRequest, deleteFriend };