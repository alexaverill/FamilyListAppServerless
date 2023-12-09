export async function CreateItem(eventObject,token){
    return await fetch(process.env.REACT_APP_API_URL+'/create-items', {
    method: 'POST',
    headers:{
     'Authorization':`Bearer ${token}`,
     "Content-Type": "application/json",
    },
    body: JSON.stringify(eventObject),
    })
    .then((response) => response.json())
    .then(data => {
        return data; 
    })
    .catch((err) => {
       console.log(err.message);
    });        
  }
  export async function GetList(eventId,userId,token){
    let url = process.env.REACT_APP_API_URL + '/get-list/'+eventId+'/'+userId
    return await fetch(url, {
      method: "GET", // POST, PUT, DELETE, etc.
      headers: {
        'Authorization': `Bearer ${token}`,
        "Content-Type": "=application/json",
      },
  
      mode: "cors",
    }).then(response => response.json()).then(data => { return data; }).catch(err => {
      console.log(err.message);
      return;
    });
  }
  export async function ClaimItem(eventObject,token){
    return await fetch(process.env.REACT_APP_API_URL+'/claim-item', {
      method: 'POST',
      headers:{
       'Authorization':`Bearer ${token}`,
       "Content-Type": "application/json",
      },
      body: JSON.stringify(eventObject),
      })
      .then((response) => response.json())
      .then(data => {
          return data; 
      })
      .catch((err) => {
         console.log(err.message);
      });        
  }
  export async function UnClaimItem(eventObject,token){
    return await fetch(process.env.REACT_APP_API_URL+'/unclaim-item', {
      method: 'DELETE',
      headers:{
       'Authorization':`Bearer ${token}`,
       "Content-Type": "application/json",
      },
      body: JSON.stringify(eventObject),
      })
      .then((response) => response.json())
      .then(data => {
          return data; 
      })
      .catch((err) => {
         console.log(err.message);
      });        
  }
  export async function DeleteItem(eventObject,token){
    return await fetch(process.env.REACT_APP_API_URL+'/delete-item', {
      method: 'DELETE',
      headers:{
       'Authorization':`Bearer ${token}`,
       "Content-Type": "application/json",
      },
      body: JSON.stringify(eventObject),
      })
      .then((response) => response.json())
      .then(data => {
          return data; 
      })
      .catch((err) => {
        console.log(err);
         console.log(err.message);
      });     
  }