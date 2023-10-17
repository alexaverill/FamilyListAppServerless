import { Handler } from 'aws-lambda';
import {List} from "/opt/nodejs/List"
// ES6+ example
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
const client = new DynamoDBClient({ region: "us-west-2" });
const docClient = DynamoDBDocumentClient.from(client);
export const handler: Handler = async (event, context) => {
    let list:List = JSON.parse(event.body);
    if(!validateIsList(list)){
      return {
        statusCode:400,
        body:"Invalid list provided"
      }
    }
    try {
        const command = new PutCommand({
            TableName: "Lists",
            Item: list
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
    console.log(list);
    return {
        statusCode: 200,
        body: JSON.stringify({
          message: list,
          input: event,
        })
      }
};

const validateIsList = (list:any)=>{
  return list.listId && list.eventId && list.userId;
}