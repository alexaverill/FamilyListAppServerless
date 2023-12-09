import { genericApiCall } from "./BaseApi";

export async function CreateItem(eventObject){
  return await genericApiCall('/create-items',"POST",eventObject);     
  }
  export async function GetList(eventId,userId){
    let url = '/get-list/'+eventId+'/'+userId
    return await genericApiCall(url,"GET",null)
  }
  export async function ClaimItem(eventObject){
    return await genericApiCall('/claim-item',"POST",eventObject)     
  }
  export async function UnClaimItem(eventObject){
    return await genericApiCall('/unclaim-item',"DELETE",eventObject);      
  }
  export async function DeleteItem(eventObject,token){
    return await genericApiCall('/delete-item',"DELETE",eventObject);   
  }