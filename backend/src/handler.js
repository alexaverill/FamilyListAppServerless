"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const List_1 = require("/opt/nodejs/List");
// ES6+ example
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const client = new client_dynamodb_1.DynamoDBClient({ region: "us-west-2" });
const docClient = lib_dynamodb_1.DynamoDBDocumentClient.from(client);
const handler = async (event, context) => {
    let list = JSON.parse(event.body);
    var listList = new List_1.List();
    listList.eventBid = "1";
    console.log(list);
    try {
        const command = new lib_dynamodb_1.PutCommand({
            TableName: "Lists",
            Item: list
        });
        const response = await docClient.send(command);
        console.log(response);
    }
    catch (error) {
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
    };
};
exports.handler = handler;
