import { Handler } from 'aws-lambda';
import {Event} from "/opt/nodejs/Event"
import { randomUUID } from 'crypto';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { CognitoIdentityProviderClient, AdminCreateUserCommand } from "@aws-sdk/client-cognito-identity-provider";
const cognitoClient = new CognitoIdentityProviderClient({ region: "us-west-2" }); 
const client = new DynamoDBClient({ region: "us-west-2" });
const docClient = DynamoDBDocumentClient.from(client);

export const handler: Handler = async (event, context) => {
    let parsedEvent:Event = JSON.parse(event.body);
    if(!validateIsEvent(parsedEvent)){
      return {
        statusCode:400,
        body:"Invalid User provided, a name, email,password, and birthday are required"
      }
    }
    const input = { // AdminCreateUserRequest
      UserPoolId: "us-west-2_0LeazpP2L", 
      Username: "Testing",
      Password: "Testing123!",
      UserAttributes: [
        { 
          Name: "User name", // required
          Value: "testing",
        },
        { 
          Name: "Email Address", // required
          Value: "testing",
        },
        {
          Name:"Birthdate",
          Value:"10-27-94"
        }
      ]
    };
    const command = new AdminCreateUserCommand(input);
    const response = await cognitoClient.send(command);
    console.log(response);
    // try {
    //     const command = new PutCommand({
    //         TableName: "Users",
    //         ConditionExpression: "attribute_not_exists(eventId)",
    //         Item: parsedEvent
    //       });
        
    //       const response = await docClient.send(command);
    //       console.log(response);
    //   } catch (error) {
    //     console.log(error);
    //     //throw error
    //     return {
    //       statusCode:500,
    //       body:JSON.stringify(error)
    //     };
    //   } 
    return {
        statusCode: 200,
        body: JSON.stringify({
          message: parsedEvent,
          input: event,
        }),
        headers : {
          'Access-Control-Allow-Origin': '*'
      }
      }
};



const validateIsEvent = (item:any)=>{
  return item.date && item.name; 
}