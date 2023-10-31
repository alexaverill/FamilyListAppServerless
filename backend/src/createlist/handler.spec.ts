import {DynamoDBClient} from '@aws-sdk/client-dynamodb';
import {DynamoDBDocumentClient, PutCommand} from '@aws-sdk/lib-dynamodb';
import {mockClient} from 'aws-sdk-client-mock';
import {handler} from './handler';
describe('Basic Test',()=>{
    const dynamoDB = new DynamoDBClient({});
    const dynamoDBMock = mockClient(DynamoDBDocumentClient);
    
    beforeEach(()=>{
        dynamoDBMock.reset()
    });
    let sampleList = {
        "listId":"1",
        "eventId":"2",
        "userId":"12"
    };
    it("returns 200 with a valid payload",async ()=>{
        dynamoDBMock.on(PutCommand).resolves({});
        var event = {
            body:JSON.stringify(sampleList)
        }
        var result = await handler(event,null,null);
        expect(result.statusCode).toBe(200);
    });
    it("returns an error code with an invalid payload",async ()=>{
        var payload = {body:JSON.stringify({"Cat":"Yellow"})};
        var result = await handler(payload,null,null);
        expect(result.statusCode).toBe(400);
        expect(result.body).toBe("Invalid list provided");
    });
    it('returns 400 when missing listId',async ()=>{
        let list = {
            "eventId":"1",
            "userId":"1"
        };
        let payload = {body:JSON.stringify(list)};
        var result = await handler(payload,null,null);
        expect(result.statusCode).toBe(400);
        expect(result.body).toBe("Invalid list provided");
    });
    it('returns 400 when missing eventId',async ()=>{
        let list = {
            "listId":"1",
            "userId":"1"
        };
        let payload = {body:JSON.stringify(list)};
        var result = await handler(payload,null,null);
        expect(result.statusCode).toBe(400);
        expect(result.body).toBe("Invalid list provided");
    });
    it('returns 400 when missing userId',async ()=>{
        let list = {
            "listId":"1",
            "eventId":"1"
        };
        let payload = {body:JSON.stringify(list)};
        var result = await handler(payload,null,null);
        expect(result.statusCode).toBe(400);
        expect(result.body).toBe("Invalid list provided");
    });
    it('handles dynamoDb Error',async ()=>{
        dynamoDBMock.on(PutCommand).rejects('Validation Error');
        var event = {
            body:JSON.stringify(sampleList)
        }
        var result = await handler(event,null,null);
        expect(result.statusCode).toBe(500);
    })
})