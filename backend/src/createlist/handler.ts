import { Handler } from 'aws-lambda';
import { List } from './List';
import { ListItem } from './ListItem';
// ES6+ example
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
const client = new DynamoDBClient({ region: "us-west-2" });
const docClient = DynamoDBDocumentClient.from(client);
export const handler: Handler = async (event, context) => {
    let list = JSON.parse(event.body);
    try {
        const command = new PutCommand({
            TableName: "Lists",
            Item: list
          });
        
          const response = await docClient.send(command);
          console.log(response);
      } catch (error) {
        console.log(error);
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
//List stucture
// {
//     eventBid:12345
//     userId:12
//     items:[
//         {
//             name: "",
//             url:"",
//             price: 1.1,
//             isClaimed: false,
//             claimedBy: 123,
//             quantity: 1,
//             comments: ""
//         }
//     ]
// }