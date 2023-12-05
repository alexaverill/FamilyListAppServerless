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