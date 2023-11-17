import { Handler } from 'aws-lambda';
// ES6+ example
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
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
    return {
        statusCode: 200,
        body: JSON.stringify(events)
      }
};