import { Handler } from 'aws-lambda';
import {List} from "@Layers/List"
// ES6+ example
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
const client = new DynamoDBClient({ region: "us-west-2" });
const docClient = DynamoDBDocumentClient.from(client);
const handler: Handler = async (event, context) => {
    let list = JSON.parse(event.body);
    var listList = new List();
    listList.eventBid = "1";
    console.log(list);
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
export default handler;