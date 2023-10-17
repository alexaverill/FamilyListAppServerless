import {DynamoDBClient} from '@aws-sdk/client-dynamodb';
import {DynamoDBDocumentClient, PutCommand} from '@aws-sdk/lib-dynamodb';
import {mockClient} from 'aws-sdk-client-mock';
import {handler} from './handler';
describe('Basic Test',()=>{
    beforeEach(()=>{
        const dynamoDB = new DynamoDBClient({});
        const dynamoDBMock = mockClient(DynamoDBDocumentClient);
        dynamoDBMock.on(PutCommand).resolves({});
    });
    let sampleList = {
        "listId":"1",
        "eventId":"2",
        "userId":"12",
        "items":[{
            "name":"A",
            "url":"http:/google.com",
            "price":12.24,
            "isClaimed":false,
            "comments":"This is a gift"
        }]
    };
    it("returns 200 with a valid payload",async ()=>{
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
})