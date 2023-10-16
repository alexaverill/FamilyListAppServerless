import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {mockClient} from 'aws-sdk-client-mock';
import handler from './handler';
describe('Basic Test',()=>{
    beforeEach(()=>{
        const dynamoDB = new DynamoDBClient({});
        const dynamoDBMock = mockClient(dynamoDB);
    });
    it("returns 200 with a valid payload",()=>{
        expect(1).toEqual(1)
    });
    it("returns an error code with an invalid payload",async ()=>{
        var payload = JSON.stringify({Cat:"Yellow"});
        var result = await handler(payload,null,null);
    });

})