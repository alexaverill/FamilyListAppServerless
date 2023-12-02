import {DynamoDBClient} from '@aws-sdk/client-dynamodb';
import {DynamoDBDocumentClient, QueryCommand} from '@aws-sdk/lib-dynamodb';
import {mockClient} from 'aws-sdk-client-mock';
import {handler} from './getUsers';
describe('Get Lists Test',()=>{
    const dynamoDBMock = mockClient(DynamoDBDocumentClient);
    
    beforeEach(()=>{
        dynamoDBMock.reset()
    });
    it('Returns 200 when called',async ()=>{
        dynamoDBMock.on(QueryCommand).resolves({
            Items:[{listId:'1'}]
        });
        var event = {
            pathParameters:{eventId:1}
        }
        var result = await handler(event,null,null);
        expect(result.statusCode).toBe(200);
    });
});