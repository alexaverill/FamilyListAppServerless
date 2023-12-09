import { Handler } from 'aws-lambda';
import {List} from "/opt/nodejs/List"
// ES6+ example
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
const client = new DynamoDBClient({ region: "us-west-2" });
const docClient = DynamoDBDocumentClient.from(client);
export const handler: Handler = async (event, context) => {
    let deleteEvent:any = JSON.parse(event.body);
    let updatedItem;
    if(!validateDelete(deleteEvent)){
      return {
        statusCode:400,
        body:"Invalid list provided"
      }
    }
    try {
      let itemId = deleteEvent.itemId;
      let eventId = deleteEvent.eventId;
      const command = new DeleteCommand({
        TableName: "ListItems",
        Key: {
          itemId,
          eventId
        },
      });
        
          const response = await docClient.send(command);
      } catch (error) {
        console.log(error);
        return {
          statusCode:500,
          body:JSON.stringify(error)
        };
      } 
    return {
        statusCode: 200
      }
};

const validateDelete = (deleteEvent:any)=>{
  return deleteEvent.itemId && deleteEvent.eventId;
}