import { Handler } from 'aws-lambda';
import {Event} from "/opt/nodejs/Event"
// ES6+ example
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
const client = new DynamoDBClient({ region: "us-west-2" });
const docClient = DynamoDBDocumentClient.from(client);
export const handler: Handler = async (event, context) => {
    let parsedEvent:Event = JSON.parse(event.body);
    if(!validateIsEvent(parsedEvent)){
      return {
        statusCode:400,
        body:"Invalid Event provided, a name, date and id are required"
      }
    }
    console.log(parsedEvent);
    try {
        const command = new PutCommand({
            TableName: "Events",
            Item: parsedEvent
          });
        
          const response = await docClient.send(command);
          console.log(response);
      } catch (error) {
        console.log(error);
        //throw error
        return {
          statusCode:500,
          body:JSON.stringify(error)
        };
      } 
    console.log('EVENT: \n' + JSON.stringify(event, null, 2));
    return {
        statusCode: 200,
        body: JSON.stringify({
          message: parsedEvent,
          input: event,
        })
      }
};

const validateIsEvent = (item:any)=>{
  return item.id && item.date && item.name; 
}