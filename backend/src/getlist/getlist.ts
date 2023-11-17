import { Handler } from 'aws-lambda';
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
        TableName:"Lists",
        IndexName:"listIdIndex",
        KeyConditionExpression:"listId=:e",
        ExpressionAttributeValues: {
            ':e': {S:`${event.pathParameters.listId.toString()}`}
           }
    });
    
      const response = await docClient.send(command);
      console.log(response);
      const items = response?.Items.map( (item) => {
        return unmarshall(item);
    });
    return {
        statusCode: 200,
        body: JSON.stringify(items)
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
  return request.pathParameters?.eventId;
}
