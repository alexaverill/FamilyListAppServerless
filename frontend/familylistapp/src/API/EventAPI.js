import {genericApiCall,EventsByUser} from "./BaseApi";
import { fetchAuthSession } from "aws-amplify/auth";
export async function GetEvents() {
  let url = '/get-events'
  return await genericApiCall(url,"GET",null);
}
export async function GetEventsByUser(userId){
  return await EventsByUser();
}
export async function CreateEvent(eventObject){
  let url = '/create-events'
  return await genericApiCall(url,"POST",eventObject);      
}
export async function GetEvent(eventId) {
  let url = '/get-event/'+eventId
  return await genericApiCall(url,"GET",null);
}
