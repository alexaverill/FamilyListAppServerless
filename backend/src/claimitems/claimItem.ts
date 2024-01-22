import { Handler } from 'aws-lambda';
import {List} from "/opt/nodejs/List"
// ES6+ example
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { UpdateCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
const client = new DynamoDBClient({ region: "us-west-2" });
const docClient = DynamoDBDocumentClient.from(client);
export const handler: Handler = async (event, context) => {
    let claim:any = JSON.parse(event.body);
    let updatedItem;
    if(!validateClaime(claim)){
      return {
        statusCode:400,
        body:"Invalid list provided"
      }
    }
    try {
      let itemId = claim.itemId;
      let eventId = claim.eventId;
      const command = new UpdateCommand({
        TableName: "ListItems",
        Key: {
          itemId,
          eventId
        },
        UpdateExpression: "set claimed = if_not_exists(claimed,:claim)",
        ExpressionAttributeValues: {
          ":claim":claim
        },
        ReturnValues: "ALL_NEW",
      });
        
          const response = await docClient.send(command);
          console.log(response);
          updatedItem = response.Attributes;
      } catch (error) {
        console.log(error);
        //throw error
        return {
          statusCode:500,
          body:JSON.stringify(error)
        };
      } 
    return {
        statusCode: 200,
        body: JSON.stringify(updatedItem)
      }
};

const validateClaime = (claimEvent:any)=>{
  return claimEvent.itemId && claimEvent.eventId && claimEvent.userId && claimEvent.username;
}