// Create clients and set shared const values outside of the handler.

// Create a DocumentClient that represents the query to add an item
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const { randomUUID } = require('crypto');

// Get the DynamoDB table name from environment variables
const tableName = process.env.TABLE_NAME;

/**
 * A simple example includes a HTTP post method to add one item to a DynamoDB table.
 */
exports.putItemHandler = async (event) => {
    if (event.httpMethod !== 'POST') {
        throw new Error(`postMethod only accepts POST method, you tried: ${event.httpMethod} method.`);
    }
    // All log statements are written to CloudWatch
    console.info('received:', event);

    // Get id and name from the body of the request
    const body = JSON.parse(event.body);
    const itemId = randomUUID();
    const order = {
      nftTokenAddress: body.nftTokenAddress,
      nftTokenId: body.nftTokenId,
      nftTokenType: body.nftTokenType,
      tokenAddress: body.tokenAddress,
      tokenAmount: body.tokenAmount,
      tokenType: body.tokenType,
      userAddress: body.userAddress,
      id: itemId,
    }
    console.info("ORDER", order)
    // Creates a new item, or replaces an old item with a new item
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#put-property
    var params = {
        TableName : tableName,
        Item: order
    };

    const result = await docClient.put(params).promise();

    const response = {
        statusCode: 200,
        body: JSON.stringify(body)
    };

    // All log statements are written to CloudWatch
    console.info(`results from put ${result} response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
};
