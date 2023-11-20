
export async function CreateEvent(name,date){
        await fetch(process.env.REACT_APP_API_URL+'/create-event', {
        method: 'POST',
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