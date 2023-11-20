export async function GetEvents(){
    return await fetch(process.env.REACT_APP_API_URL+'/get-events')
    .then((response) => response.json())
    .then((data) => {
       console.log(data);
       return data;
    })
    .catch((err) => {
       console.log(err.message);
       return;
    });
}