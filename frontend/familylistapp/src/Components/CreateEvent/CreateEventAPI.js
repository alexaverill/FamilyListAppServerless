
export async function CreateEvent(name,date,token){
        await fetch(process.env.REACT_APP_API_URL+'/create-event', {
        method: 'POST',
        headers:{
         'Authorization':`Bearer ${token}`,
         "Content-Type": "application/json",
        },
        body: JSON.stringify({
           name,
           date
        }),
        })
        .then((response) => response.json())
        .catch((err) => {
           console.log(err.message);
        });        
}