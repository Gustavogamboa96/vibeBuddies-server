const { documentClient } = require("../db/dynamoClient")
const {
  QueryCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
} = require("@aws-sdk/lib-dynamodb")

const USERS_TABLE = "users_table"

async function deleteUserById(username) {
  /**
   * repository layer function to delete a user from the database
   * 
   * username - passed from service layer
   */

  try {
    const params = {
      TableName: USERS_TABLE,
      Key: {
        username: username,
      },
    }

    return await documentClient.send(new DeleteCommand(params))
  } catch (error) {
    throw new Error(error.message)
  }
}

async function getUserByUsername(username) {
  /**
   * repository layer function to handle the querying of a user by username
   * 
   * username - string
   */

  try {
    // params for the querying condition
    const params = {
      TableName: USERS_TABLE,
      KeyConditionExpression: "#username = :username",
      ExpressionAttributeNames: {
        "#username": "username",
      },
      ExpressionAttributeValues: {
        ":username": username,
      },
    }

    return await documentClient.send(new QueryCommand(params))
  } catch (error) {
    throw new Error(error.message)
  }
}

async function createUser(user) {
  /**
   * repository layer function to handle creating a new user
   * 
   * user - object
   */

  const command = new PutCommand({
    TableName: USERS_TABLE,
    Item: user,
  })

  try {
    await documentClient.send(command)
    return { success: true, user }
  } catch (err) {
    console.error("Failed to create user:", err)
    return { success: false, error: err }
  }
}

async function updateProfile(username, updateSettings) {
  /**
   * function to udpate data for given user by their id
   *
   * userId - required data
   * dataToUpdate - only present if the user changes something
   * dataToDelete - will
   */

  // // params for db function call
  const params = {
    TableName: USERS_TABLE,
    Key: {
      username: username,
    },
    UpdateExpression:
      updateSettings.setString + " " + updateSettings.removeString,
    ExpressionAttributeNames: {
      ...updateSettings.ExpressionAttributeNames,
    },
    ReturnValues: "ALL_NEW",
  }

  // conditionally added the ExpressionAttributeValues if they are present
  if (Object.keys(updateSettings.ExpressionAttributeValues).length !== 0) {
    params.ExpressionAttributeValues = {
      ...updateSettings.ExpressionAttributeValues,
    }
  }

  // // db funciton call
  return await documentClient.send(new UpdateCommand(params))
}

async function findUserById(userId) {
  /**
   * repository layer function to access db to query user by their id
   *
   * userId - required string
   */

  try {
    // params for the query function
    const params = {
      TableName: USERS_TABLE,
      IndexName: "user_id-index",
      KeyConditionExpression: "#user_id = :userId",
      ExpressionAttributeNames: {
        "#user_id": "user_id",
      },
      ExpressionAttributeValues: {
        ":userId": userId,
      },
    }

    // db function call
    return await documentClient.send(new QueryCommand(params))
  } catch (error) {
    throw new Error(error.message)
  }
}

async function findUserByEmail(userEmail) {
  /**
   * repository layer function to access db to query user by their id
   *
   * userId - required string
   */

  try {
    // params for the query function
    const params = {
      TableName: USERS_TABLE,
      IndexName: "email-index",
      KeyConditionExpression: "#email = :userEmail",
      ExpressionAttributeNames: {
        "#email": "email",
      },
      ExpressionAttributeValues: {
        ":userEmail": userEmail,
      },
    }

    // db function call
    return await documentClient.send(new QueryCommand(params))
  } catch (error) {
    throw new Error(error.message)
  }
}

//updatePassword
async function updatePassword(username, newPassword) {
  /**
   * function to udpate password for given user by their username
   *
   * username - required data
   * newPassword - required data
   */

  // // params for db function call
  const params = {
    TableName: USERS_TABLE,
    Key: {
      username: username,
    },
    UpdateExpression: 'SET #pwd = :newPassword',
    ExpressionAttributeNames: {
      '#pwd': 'password'
    },
    ExpressionAttributeValues: {
      ':newPassword': newPassword
    },
    ReturnValues: "ALL_NEW",
  }

  try {
    // db funciton call
    const response = await documentClient.send(new UpdateCommand(params));
    return response;
  } catch (error) {
    console.error('Error updating password:', error.message);
    throw new Error('Could not update the password');
  }
}

async function updateProfileImage(username, profileImageUrl) {
  /**
   * DAO function to handle updating the profileImageUrl attribute with the url of the bucket object
   */
  const params = {
    TableName: USERS_TABLE,
    Key: { username },
    UpdateExpression: "SET #profileImageUrl = :profileImageUrl",
    ExpressionAttributeNames: { "#profileImageUrl": "profileImageUrl" },
    ExpressionAttributeValues: { ":profileImageUrl": profileImageUrl },
    ReturnValues: "ALL_NEW"
  };

  return await documentClient.send(new UpdateCommand(params));
}

module.exports = { updateProfileImage };
module.exports = {
  getUserByUsername,
  createUser,
  updateProfile,
  findUserById,
  findUserByEmail,
  deleteUserById,
  updatePassword,
  updateProfileImage
}