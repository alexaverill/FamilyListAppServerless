import {DynamoDBClient} from '@aws-sdk/client-dynamodb';
import {DynamoDBDocumentClient, PutCommand, QueryCommand} from '@aws-sdk/lib-dynamodb';
import {mockClient} from 'aws-sdk-client-mock';
import {handler} from './getEvent';
import 'aws-sdk-client-mock-jest';
describe('Get Event Tests',()=>{
    const dynamoDB = new DynamoDBClient({});
    const dynamoDBMock = mockClient(DynamoDBDocumentClient);
    
    beforeEach(()=>{
        dynamoDBMock.reset()
    });
    let handlerEvent = {
        pathParameters:{
            eventId:"abcd"
        }
    }
    let validationErrorText = "Invalid Event provided, a name, date and id are required";
    it("Calls Dynamo and returns 200 with a valid payload",async ()=>{
        dynamoDBMock.on(QueryCommand).resolves({Items:[{name:"123"}]});
        var result = await handler(handlerEvent,null,null);
        expect(result.statusCode).toBe(200);
        //expect(dynamoDBMock).toHaveReceivedCommandTimes(QueryCommand, 1);

    });
    it("returns an error code with an invalid payload",async ()=>{
        var payload = {body:JSON.stringify({"Cat":"Yellow"})};
        var result = await handler(payload,null,null);
        expect(result.statusCode).toBe(400);
        expect(result.body).toBe("eventID is required in the path");
    });

    it('handles dynamoDb Error',async ()=>{
        dynamoDBMock.on(QueryCommand).rejects('Validation Error');
        var result = await handler(handlerEvent,null,null);
        expect(result.statusCode).toBe(500);
    })
})