import {DynamoDBClient} from '@aws-sdk/client-dynamodb';
import {DynamoDBDocumentClient, PutCommand} from '@aws-sdk/lib-dynamodb';
import {mockClient} from 'aws-sdk-client-mock';
import {handler} from './createEvent';
import 'aws-sdk-client-mock-jest';
describe('Basic Test',()=>{
    const dynamoDB = new DynamoDBClient({});
    const dynamoDBMock = mockClient(DynamoDBDocumentClient);
    
    beforeEach(()=>{
        dynamoDBMock.reset()
    });
    let sampleEvent = {
        "eventId":"1",
        "name":"2",
        "date":Date.now(),
        "givers":"",
        "recievers":""
    };
    let validationErrorText = "Invalid Event provided, a name, date and id are required";
    it("Calls Dynamo and returns 200 with a valid payload",async ()=>{
        dynamoDBMock.on(PutCommand).resolves({});
        var event = {
            body:JSON.stringify(sampleEvent)
        }
        var result = await handler(event,null,null);
        expect(result.statusCode).toBe(200);
        expect(dynamoDBMock).toHaveReceivedCommandTimes(PutCommand, 1);

    });
    it("returns an error code with an invalid payload",async ()=>{
        var payload = {body:JSON.stringify({"Cat":"Yellow"})};
        var result = await handler(payload,null,null);
        expect(result.statusCode).toBe(400);
        expect(result.body).toBe(validationErrorText);
    });
    it('returns 400 when missing name',async ()=>{
        let event = {
            "eventId":"2",
            "date":Date.now(),
            "givers":"",
            "recievers":""
        };
        let payload = {body:JSON.stringify(event)};
        var result = await handler(payload,null,null);
        expect(result.statusCode).toBe(400);
        expect(result.body).toBe(validationErrorText);
    });
    it('returns 400 when missing date',async ()=>{
        let event = {
            "eventId":"2",
            "name":"name",
            "givers":"",
            "recievers":""
        };
        let payload = {body:JSON.stringify(event)};
        var result = await handler(payload,null,null);
        expect(result.statusCode).toBe(400);
        expect(result.body).toBe(validationErrorText);
    });
    it('handles dynamoDb Error',async ()=>{
        dynamoDBMock.on(PutCommand).rejects('Validation Error');
        var event = {
            body:JSON.stringify(sampleEvent)
        }
        var result = await handler(event,null,null);
        expect(result.statusCode).toBe(500);
    })
})