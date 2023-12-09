import { User } from "./User";

export class Event{
    eventId:string;
    date:Date;
    name:string;
    giving:User[];
    recieving:User[];
    imageId:number;
}