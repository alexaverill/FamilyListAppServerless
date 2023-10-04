import { Handler } from 'aws-lambda';
import { List } from './List';
import { ListItem } from './ListItem';
// ES6+ example
import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
const client = new DynamoDBClient({ region: "us-west-2" });
const docClient = DynamoDBDocumentClient.from(client);
export const handler: Handler = async (event, context) => {
    const command =new QueryCommand({
        TableName:"Lists",
        IndexName:"eventIndex",
        KeyConditionExpression:"eventId=:e",
        ExpressionAttributeValues: {
            ':e': {S:`${"2"}`}
           }
    });
    
      const response = await docClient.send(command);
    return {
        statusCode: 200,
        body: JSON.stringify(response)
      }
};
