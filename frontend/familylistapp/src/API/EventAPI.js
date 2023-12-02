export async function GetEvents(token) {
  let url = process.env.REACT_APP_API_URL + '/get-events'
  return await fetch(url, {
    method: "GET", // POST, PUT, DELETE, etc.
    headers: {
      'Authorization': `Bearer ${token}`,
      "Content-Type": "text/plain;charset=UTF-8",
    },

    mode: "cors",
  }).then(response => response.json()).then(data => { console.log(data); return data; }).catch(err => {
    console.log(err.message);
    return;
  });
}

export async function CreateEvent(eventObject,token){
  await fetch(process.env.REACT_APP_API_URL+'/create-events', {
  method: 'POST',
  headers:{
   'Authorization':`Bearer ${token}`,
   "Content-Type": "application/json",
  },
  body: JSON.stringify(eventObject),
  })
  .then((response) => response.json())
  .catch((err) => {
     console.log(err.message);
  });        
}
export async function GetEvent(token) {
  let url = process.env.REACT_APP_API_URL + '/get-event'
  return await fetch(url, {
    method: "GET", // POST, PUT, DELETE, etc.
    headers: {
      'Authorization': `Bearer ${token}`,
      "Content-Type": "text/plain;charset=UTF-8",
    },

    mode: "cors",
  }).then(response => response.json()).then(data => { console.log(data); return data; }).catch(err => {
    console.log(err.message);
    return;
  });
}