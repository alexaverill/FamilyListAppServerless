import { genericApiCall } from "./BaseApi";

export async function CreateUser(username,userId){

}
export async function GetUsers(token){
    let url = '/get-users'
    return await genericApiCall(url,"GET",null)
}