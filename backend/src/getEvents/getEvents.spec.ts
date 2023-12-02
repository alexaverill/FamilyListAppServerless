import {DynamoDBClient, ScanCommand} from '@aws-sdk/client-dynamodb';
import {DynamoDBDocumentClient, PutCommand, QueryCommand} from '@aws-sdk/lib-dynamodb';
import {mockClient} from 'aws-sdk-client-mock';
import {handler} from './getEvent';
import 'aws-sdk-client-mock-jest';
describe('Get Events Tests',()=>{
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
    // let validationErrorText = "Invalid Event provided, a name, date and id are required";
    // it("Calls Dynamo and returns 200 with a valid payload",async ()=>{
    //     dynamoDBMock.on(QueryCommand).resolves({Items:[{name:"123"}]});
    //     var result = await handler(handlerEvent,null,null);
    //     expect(result.statusCode).toBe(200);
    //     //expect(dynamoDBMock).toHaveReceivedCommandTimes(QueryCommand, 1);

    // });
    // it("returns an error code with an invalid payload",async ()=>{
    //     var payload = {body:JSON.stringify({"Cat":"Yellow"})};
    //     var result = await handler(payload,null,null);
    //     expect(result.statusCode).toBe(400);
    //     expect(result.body).toBe("eventID is required in the path");
    // });

    // it('handles dynamoDb Error',async ()=>{
    //     dynamoDBMock.on(QueryCommand).rejects('Validation Error');
    //     var result = await handler(handlerEvent,null,null);
    //     expect(result.statusCode).toBe(500);
    // })
    it('filters by provided user ID',async ()=>{
        let event = {pathParameters:{proxy:"12345"}};
        var eventreturn = {eventId:"1",recieving:["12345"],giving:["12345"]};
        dynamoDBMock.on(ScanCommand).resolves({Items:[eventreturn]});
        var result = await handler(event,null,null);

        // {
        //     eventId: 'c4b31776-4534-4495-9e96-c9b25791e39f',
        //     date: '2023-12-14',
        //     recieving: [
        //       '84698e11-2cb9-4916-977e-5efe7cbf43d5',
        //       '525dda90-0b00-4df2-bac8-2dcc19d0aa0b',
        //       '5d1b297d-96d1-4393-bf35-d3aeab09cc95'
        //     ],
        //     name: 'masda',
        //     giving: [
        //       '84698e11-2cb9-4916-977e-5efe7cbf43d5',
        //       '525dda90-0b00-4df2-bac8-2dcc19d0aa0b',
        //       '5d1b297d-96d1-4393-bf35-d3aeab09cc95'
        //     ]
        //   }
    });
})