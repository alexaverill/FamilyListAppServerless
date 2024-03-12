import { Handler } from 'aws-lambda';
import {Event} from "/opt/nodejs/Event"
import { User } from "/opt/nodejs/User";
import {ListItem} from "/opt/nodejs/ListItem"
// ES6+ example
import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { unmarshall } from '@aws-sdk/util-dynamodb';
const client = new DynamoDBClient({ region: "us-west-2" });
const docClient = DynamoDBDocumentClient.from(client);
export const handler: Handler = async (event, context) => {
    console.log(event);
    if(!validateRequest(event)){
      return{
        statusCode:400,
        body:"eventID is required in the path"
      }
    }
    try{
    const command =new QueryCommand({
        TableName:"Events",
        IndexName:"eventIdIndex",
        KeyConditionExpression:"eventId=:e",
        ExpressionAttributeValues: {
            ':e': {S:`${event.pathParameters.proxy.toString()}`}
           }
    });
    
      const response = await docClient.send(command);
      console.log(response);
      const items = response?.Items.map( (item) => {
        return unmarshall(item) as Event;
    });

    //check if we have lists 
    let updateItems = [];
    for (let event of items) {
        let newUsers = [];
        for (let reciever of event.recieving) {
            const checkListExistsCommand = new QueryCommand({
                TableName: "ListItems",
                IndexName: "userIdIndex",
                KeyConditionExpression: "eventId=:e and userId=:u",
                ExpressionAttributeValues: {
                    ':u': { S: `${reciever.userId}` },
                    ':e': { S: `${event.eventId}` }
                }
            });
            const hasItems:any = await docClient.send(checkListExistsCommand);        
            reciever.hasItems= hasItems.Items.some((item: { published: any; }) => item.published)
            newUsers.push(reciever);
        }
        event.recieving = newUsers;
        updateItems.push(event);
    }
    return {
        statusCode: 200,
        body: JSON.stringify(updateItems)
      }
    }catch(exception){
      console.log(exception);
      //throw error
      return {
        statusCode:500,
        body:JSON.stringify(exception)
      };
    }
};
const validateRequest = (request:any )=>{
  return request.pathParameters?.proxy;
}
