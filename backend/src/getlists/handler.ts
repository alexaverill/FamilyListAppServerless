import { Handler } from 'aws-lambda';
// ES6+ example
import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { unmarshall } from '@aws-sdk/util-dynamodb';
const client = new DynamoDBClient({ region: "us-west-2" });
const docClient = DynamoDBDocumentClient.from(client);
export const handler: Handler = async (event, context) => {
    console.log(event);
    const command =new QueryCommand({
        TableName:"Lists",
        IndexName:"eventIndex",
        KeyConditionExpression:"eventId=:e",
        ExpressionAttributeValues: {
            ':e': {S:`${event.pathParameters.eventId.toString()}`}
           }
    });
    
      const response = await docClient.send(command);
      const items = response.Items.map( (item) => {
        return unmarshall(item);
    });
    return {
        statusCode: 200,
        body: JSON.stringify(items)
      }
};
