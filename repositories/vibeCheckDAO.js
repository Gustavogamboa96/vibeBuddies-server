const { documentClient } = require("../db/dynamoClient")
const {
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  ScanCommand,
  QueryCommand,
  BatchWriteCommand,
} = require("@aws-sdk/lib-dynamodb")
const chunkArray = require("../utils/splitDataInChunks")

const TableName = "vibe_checks_table"

//used to createVibeChecks
async function addItem(vibeCheck) {
  const command = new PutCommand({
    TableName,
    Item: vibeCheck,
    ReturnValues: "ALL_OLD",
  })
  try {
    const data = await documentClient.send(command)
    return data
  } catch (err) {
    console.error(err)
    throw err
  }
}

async function addCommentToVibeCheck(vibeCheckId, newComment) {
  const command = new UpdateCommand({
    TableName,
    Key: { vibe_check_id: vibeCheckId },
    UpdateExpression: "SET comments = list_append(comments, :newComment)",
    ExpressionAttributeValues: {
      ":newComment": [newComment],
    },
    ReturnValues: "UPDATED_NEW",
  })

  try {
    const result = await documentClient.send(command)
    if (!result || !result.Attributes) {
      console.error("addCommentToVibeCheck: No attributes returned")
      return null
    }
    console.log("Updated comments:", result.Attributes.comments)
    return result.Attributes.comments
  } catch (error) {
    console.error("Error in addCommentToVibeCheck:", error)
    throw error
  }
}

async function deleteComment(vibeCheckId, commentId, userId) {
  try {
    // fetch the vibecheck by the ID passed in
    const getParams = {
      TableName,
      Key: { vibe_check_id: vibeCheckId },
    }

    const vibeCheck = await documentClient.send(new GetCommand(getParams))

    if (!vibeCheck.Item) {
      throw new Error("failed to retrieve nonexistent vibeCheck")
    }

    const comments = vibeCheck.Item.comments || []

    // filter for the correct coment by commentId/userId
    const updatedComments = comments.filter(
      (comment) =>
        comment.comment_id !== commentId || comment.user_id !== userId
    )

    if (updatedComments.length === comments.length) {
      throw new Error("comment not found or not owned by the user")
    }

    //set the modified comments[]
    const updateParams = {
      TableName,
      Key: { vibe_check_id: vibeCheckId },
      UpdateExpression: "SET comments = :updatedComments",
      ExpressionAttributeValues: {
        ":updatedComments": updatedComments,
      },
      ReturnValues: "UPDATED_NEW",
    }

    const result = await documentClient.send(new UpdateCommand(updateParams))

    return result.Attributes.comments
  } catch (error) {
    console.error("Error deleting comment:", error)
    throw new Error(`Failed to delete comment: ${error.message}`)
  }
}

//get all vibechecks
async function getAllItems() {
  const command = new ScanCommand({
    TableName,
  })
  try {
    const data = await documentClient.send(command)
    return data
  } catch (err) {
    console.error(err)
    throw err
  }
}
//delete a single vibecheck
async function deleteItem(vibe_check_id) {
  const command = new DeleteCommand({
    TableName,
    Key: {
      vibe_check_id: vibe_check_id,
    },
    ReturnValues: "ALL_OLD",
  })
  try {
    const data = await documentClient.send(command)
    // console.log("Deleted item:", data.Attributes);
    return data
  } catch (error) {
    console.error("Error deleting item from DynamoDB:", error)
    throw new Error(error.message)
  }
}
//add one like to the count
async function updateItemLikes(vibe_check_id, value) {
  const command = new UpdateCommand({
    TableName,
    Key: { vibe_check_id: vibe_check_id }, // Replace with your primary key
    UpdateExpression: "SET likes = if_not_exists(likes, :start) + :incr", // Increment by 1
    ExpressionAttributeValues: {
      ":incr": value,
      ":start": 0, // Start from 0 if dislikes doesn't exist
    },
    ReturnValues: "UPDATED_NEW", // Optional: to get the updated item
  })

  try {
    const data = await documentClient.send(command)
    return data
  } catch (error) {
    console.error(error)
    throw error
  }
}

//add username to the liked_by list
async function addItemLikedBy(username, vibe_check_id) {
  const command = new UpdateCommand({
    TableName,
    Key: { vibe_check_id: vibe_check_id }, // Replace with your primary key
    UpdateExpression:
      "SET liked_by = list_append(if_not_exists(liked_by, :empty_list), :username)", // Increment by 1
    ExpressionAttributeValues: {
      ":username": username,
      ":empty_list": { L: [] },
    },
    ReturnValues: "UPDATED_NEW", // Optional: to get the updated item
  })

  try {
    const data = await documentClient.send(command)
    return data
  } catch (error) {
    console.error(error)
    throw error
  }
}

//remove username from liked_by list
async function removeItemLikedBy(newArray, vibe_check_id) {
  const command = new UpdateCommand({
    TableName,
    Key: { vibe_check_id: vibe_check_id }, // Replace with your primary key
    UpdateExpression: "SET liked_by = :newarray", // remove user who liked
    ExpressionAttributeValues: {
      ":newarray": newArray,
    },
    ReturnValues: "UPDATED_NEW", // Optional: to get the updated item
  })

  try {
    const data = await documentClient.send(command)
    return data
  } catch (error) {
    console.error(error)
    throw error
  }
}

//add 1 dislike to count
async function updateItemDislikes(vibe_check_id, value) {
  const command = new UpdateCommand({
    TableName,
    Key: { vibe_check_id: vibe_check_id }, // Replace with your primary key
    UpdateExpression: "SET dislikes = if_not_exists(dislikes, :start) + :incr", // Increment by 1
    ExpressionAttributeValues: {
      ":incr": value,
      ":start": 0, // Start from 0 if dislikes doesn't exist
    },
    ReturnValues: "UPDATED_NEW", // Optional: to get the updated item
  })

  try {
    const data = await documentClient.send(command)
    return data
  } catch (error) {
    console.error(error)
    throw error
  }
}

//adds username to disliked_by list
async function addItemDislikedBy(username, vibe_check_id) {
  const command = new UpdateCommand({
    TableName,
    Key: { vibe_check_id: vibe_check_id }, // Replace with your primary key
    UpdateExpression:
      "SET disliked_by = list_append(if_not_exists(disliked_by, :empty_list), :username)",
    ExpressionAttributeValues: {
      ":username": username,
      ":empty_list": { L: [] },
    },
    ReturnValues: "UPDATED_NEW", // Optional: to get the updated item
  })

  try {
    const data = await documentClient.send(command)
    return data
  } catch (error) {
    console.error(error)
    throw error
  }
}

//removes username from disliked_by list
async function removeItemDislikedBy(newArray, vibe_check_id) {
  const command = new UpdateCommand({
    TableName,
    Key: { vibe_check_id: vibe_check_id }, // Replace with your primary key
    UpdateExpression: "SET disliked_by = :newarray", // remove user who liked
    ExpressionAttributeValues: {
      ":newarray": newArray,
    },
    ReturnValues: "UPDATED_NEW", // Optional: to get the updated item
  })

  try {
    const data = await documentClient.send(command)
    return data
  } catch (error) {
    console.error(error)
    throw error
  }
}

//gets vibecheck by its own vibe_check_id
async function getItemById(vibe_check_id) {
  const command = new GetCommand({
    TableName,
    Key: {
      vibe_check_id: vibe_check_id,
    },
  })

  try {
    const data = await documentClient.send(command)
    return data
  } catch (err) {
    console.error("Error querying items:", err)
    throw err
  }
}

//get all vibechecks by user_id
async function getItemsByUserId(user_id) {
  const command = new QueryCommand({
    TableName,
    IndexName: "user_id_index",
    KeyConditionExpression: "user_id = :user_id", // Query based on user_id
    ExpressionAttributeValues: {
      ":user_id": user_id, // Replace with the user_id value
    },
  })
  try {
    const data = await documentClient.send(command)
    return data
  } catch (error) {
    console.error("Error getting all items for user from DynamoDB:", error)
  }
}

//get all vibechecks by username
async function getItemsByUsername(username) {
  const command = new QueryCommand({
    TableName,
    IndexName: "username-index",
    KeyConditionExpression: "username = :username", // Query based on user_id
    ExpressionAttributeValues: {
      ":username": username, // Replace with the user_id value
    },
  })
  try {
    const data = await documentClient.send(command)
    return data
  } catch (error) {
    console.error("Error getting all items for user from DynamoDB:", error)
  }
}

//delete all vibechecks, used to perform by user_id in service
async function batchDeleteVibeChecks(vibe_checks_to_delete) {
  const MAX_BATCH_SIZE = 25

  const itemChunks = chunkArray(vibe_checks_to_delete, MAX_BATCH_SIZE)

  // Process each chunk of 25 items
  for (const chunk of itemChunks) {
    const deleteRequests = chunk.map((item) => ({
      DeleteRequest: {
        Key: {
          vibe_check_id: item.vibe_check_id, // Replace with the actual partition key
        },
      },
    }))

    const command = new BatchWriteCommand({
      RequestItems: {
        vibe_checks_table: deleteRequests, // Replace with your table name
      },
    })

    try {
      const data = await documentClient.send(command)
      //console.log('Batch delete successful:', data);
      return data
    } catch (error) {
      console.error("Error performing batch delete:", error)
    }
  }
}

module.exports = {
  getItemById,
  getAllItems,
  addItem,
  deleteItem,
  updateItemLikes,
  updateItemDislikes,
  addItemLikedBy,
  removeItemLikedBy,
  addItemDislikedBy,
  removeItemDislikedBy,
  getItemsByUserId,
  getItemsByUsername,
  batchDeleteVibeChecks,
  addCommentToVibeCheck,
  deleteComment,
}
