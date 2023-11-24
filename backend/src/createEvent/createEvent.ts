import { Handler } from 'aws-lambda';
import {Event} from "/opt/nodejs/Event"
import { randomUUID } from 'crypto';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
const client = new DynamoDBClient({ region: "us-west-2" });
const docClient = DynamoDBDocumentClient.from(client);

export const handler: Handler = async (event, context) => {
    let parsedEvent:Event = JSON.parse(event.body);
    if(!validateIsEvent(parsedEvent)){
      return {
        statusCode:400,
        body:"Invalid Event provided, a name, date are required"
      }
    }
    if(!parsedEvent.eventId){
      parsedEvent.eventId = randomUUID();
    }
    console.log(parsedEvent);
    try {
        const command = new PutCommand({
            TableName: "Events",
            ConditionExpression: "attribute_not_exists(eventId)",
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
        }),
        headers : {
          'Access-Control-Allow-Origin': '*'
      }
      }
};

const validateIsEvent = (item:any)=>{
  return item.date && item.name; 
}