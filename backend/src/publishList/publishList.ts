
import { Handler } from 'aws-lambda';
import { List } from "/opt/nodejs/List"
// ES6+ example
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { UpdateCommand,QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { unmarshall } from '@aws-sdk/util-dynamodb';
const client = new DynamoDBClient({ region: "us-west-2" });
const docClient = DynamoDBDocumentClient.from(client);
export const handler: Handler = async (event, context) => {
  let claim: any = JSON.parse(event.body);
  if (!validateClaime(claim)) {
    return {
      statusCode: 400,
      body: "Invalid list provided"
    }
  }
  try {
    let userId = claim.userId;
    let eventId = claim.eventId;
    const command =  new QueryCommand({
      TableName:"ListItems",
      IndexName:"userIdIndex",
      KeyConditionExpression:"eventId=:e and userId=:u",
    ExpressionAttributeValues: {
        ':u': userId,
        ':e': eventId
       }
    });    
      const response = await docClient.send(command);
      console.log(response);
      const itemIds = response?.Items.map( (item) => item.itemId);
    console.log(itemIds);
    for (let item of itemIds) {
      let itemId = item;
      const command = new UpdateCommand({
        TableName: "ListItems",
        Key: {
          itemId,
          eventId
        },
        UpdateExpression: "set published = :value",
        ExpressionAttributeValues: {
          ":value":true
        },
        ReturnValues: "NONE",
      });

      const response = await docClient.send(command);
      console.log(response);
    }
  } catch (error) {
    console.log(error);
    //throw error
    return {
      statusCode: 500,
      body: JSON.stringify(error)
    };
  }
  return {
    statusCode: 200,
    body:JSON.stringify("")
  }
};

const validateClaime = (claimEvent: any) => {
  return claimEvent.userId && claimEvent.eventId;
}