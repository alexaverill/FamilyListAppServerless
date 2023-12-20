import { Handler } from 'aws-lambda';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { GetCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
const ses = new SESClient({ region: "us-west-2" });
const client = new DynamoDBClient({ region: "us-west-2" });
const docClient = DynamoDBDocumentClient.from(client);
export const handler: Handler = async (event, context) => {
  let parsedBody: any = JSON.parse(event.body);
  console.log(parsedBody);
  let user = parsedBody.username;
  let eventId = parsedBody.eventId;
  let name = parsedBody.name;
  let getEventCommand = new GetCommand({
    TableName: "Events",
    Key: {
      eventId: `${eventId}`,
      name: `${name}`
    }
  });
  try {
    let eventResponse = await docClient.send(getEventCommand);
    console.log(eventResponse);
    let givingUsers = eventResponse.Item.giving;
    let givingEmails = givingUsers.map((user:any)=>user.email);
    console.log(givingEmails);
    if(givingEmails.length <=0){
      return {
        statusCode:400,
        body:JSON.stringify("No users available to share wishlist")
      }
    }
    const eventName = eventResponse.Item.name;
    let url = `http://familylistapp.com/event/${eventResponse.Item.eventId}`;
    const subjectLine = `${eventName} - ${user}'s List`; 
    const body = `${user} has created a a list for ${eventName}. This can be viewed at ${url}`;
    const command = new SendEmailCommand({
      Destination: {
        CcAddresses: givingEmails,
      },
      Message: {
        Body: {
          Text: { Data: body },
        },

        Subject: { Data: subjectLine },
      },
      Source: "no-reply@familylistapp.com",
    });
    let response = await ses.send(command);
    console.log(response);
    return {
      statusCode: 200,
      body: JSON.stringify(response)
    }

  } catch (ex) {
    console.log(ex);
    return {
      statusCode: 500,
      body: JSON.stringify(ex)
    }
  }

  return {
    statusCode: 500
  }
};
