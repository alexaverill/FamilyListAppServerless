
import { useState, useEffect, createContext } from "react";
import { getCurrentUser,fetchAuthSession } from "aws-amplify/auth";
export const UserContext = createContext(null);
export const UserContextProvider = ({children}) =>{
    const [data, setData] = useState({user:{},token:{}})
  
    useEffect(() =>{
        getUserAndSession();
    },[]);
   const getUserAndSession = async () =>{
    let user = await getCurrentUser();
    let session = await fetchAuthSession();
    console.log(session);
    let token = session.tokens?.accessToken;
    setData({user,token})

   }
   const { Provider } = UserContext;
   return(
       <Provider value={data}>
           {children}
       </Provider>
   )
}