export async function CreateUser(username,userId){

}
export async function GetUsers(token){
    let url = process.env.REACT_APP_API_URL + '/get-users'
    return await fetch(url, {
      method: "GET", // POST, PUT, DELETE, etc.
      headers: {
        'Authorization': `Bearer ${token}`,
        "Content-Type": "text/plain;charset=UTF-8",
      },
      mode: "cors",
    }).then(response => response.json()).then(data => { return data; }).catch(err => {
      console.log(err.message);
      return;
    });
}