import { fetchAuthSession } from "aws-amplify/auth";

export async function genericApiCall(url,method,data){
    let session = await fetchAuthSession();
    let token = session.tokens.accessToken.toString();
    if(method=="GET"){
        let requestUrl = process.env.REACT_APP_API_URL + url
        return await fetch(requestUrl, {
          method: "GET", 
          headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "=application/json",
          },
      
          mode: "cors",
        }).then(response => response.json()).then(data => data).catch(err => {
          console.log(err.message);
          return;
        });
    }
    return await fetch(process.env.REACT_APP_API_URL+url, {
        method: method,
        headers:{
         'Authorization':`Bearer ${token}`,
         "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        })
        .then((response) => response.json())
        .catch((err) => {
            console.log(err);
           console.log(err.message);
        });  


}
export async function EventsByUser(){
    let session = await fetchAuthSession();
    let userId = session.userSub;
    let token = session.tokens.accessToken.toString();
    let url = '/get-events/'+userId
    let requestUrl = process.env.REACT_APP_API_URL + url
    return await fetch(requestUrl, {
      method: "GET", 
      headers: {
        'Authorization': `Bearer ${token}`,
        "Content-Type": "=application/json",
      },
  
      mode: "cors",
    }).then(response => response.json()).then(data => { console.log(data); return data; }).catch(err => {
      console.log(err.message);
      return;
    });
}
export async function ShareWishlist(eventObj){
  return await genericApiCall("/share-wishlist","POST",eventObj);
}