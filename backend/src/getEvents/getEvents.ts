import { Handler } from 'aws-lambda';
import {Event} from "/opt/nodejs/Event"
import { User } from "/opt/nodejs/User";
// ES6+ example
import { DynamoDBClient, QueryCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { unmarshall } from '@aws-sdk/util-dynamodb';
const client = new DynamoDBClient({ region: "us-west-2" });
const docClient = DynamoDBDocumentClient.from(client);
export const handler: Handler = async (event, context) => {
    console.log(event);
    const command =new ScanCommand({
        TableName:"Events",
        IndexName:"eventIdIndex",
    });
    //TODO filter by date/Active
    
      const response = await docClient.send(command);
      console.log(response);
      const events = response?.Items.map( (item) => {
        return unmarshall(item);
    });
    if(event.pathParameters.proxy){
      //filter by userId
      var userId = event.pathParameters.proxy;
      let filteredEvents:unknown = events.filter(event=>{
        let inGiving = event.giving?.findIndex((element:any)=>element.userId === userId) >=0;
        let inRecieving = event.recieving?.findIndex((element:any)=>element.userId === userId)>=0;
        if(inGiving || inRecieving){
          return event as Event;
        }
      })

      return {
        statusCode: 200,
        body: JSON.stringify(filteredEvents),
        headers : {
          'Access-Control-Allow-Origin': '*',
      }
      }
    }
    return {
        statusCode: 200,
        body: JSON.stringify(events),
        headers : {
          'Access-Control-Allow-Origin': '*',
      }
      }
};