const { DynamoDBClient } = require("@aws-sdk/client-dynamodb")
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb")

const client = new DynamoDBClient({ region: "us-east-1" })

const documentClient = DynamoDBDocumentClient.from(client)

module.exports = { documentClient }
