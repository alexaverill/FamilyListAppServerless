import { Handler } from 'aws-lambda';
import {List} from "/opt/nodejs/List"
// ES6+ example
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { ListItem } from '../layers/ListItem';
import { randomUUID } from "crypto";
const client = new DynamoDBClient({ region: "us-west-2" });
const docClient = DynamoDBDocumentClient.from(client);
export const handler: Handler = async (event, context) => {
    let listItem:ListItem = JSON.parse(event.body);
    if(!validateIsListItem(listItem)){
      return {
        statusCode:400,
        body:"Invalid list provided"
      }
    }
    if(!listItem.itemId){
      listItem.itemId = randomUUID();
      listItem.published = false; //default to unpublished on creation.
    }
    console.log(listItem);
    try {
        const command = new PutCommand({
            TableName: "ListItems",
            Item: listItem
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
        body: JSON.stringify(listItem)
      }
};

const validateIsListItem = (item:any)=>{
  return item.eventId && item.userId;
}