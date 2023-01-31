import React,{useEffect} from 'react';
import axios from 'axios';
import HOST from '../config';
const AuthContext = React.createContext();


function AuthProvider({ children, value }) {
  const [isAuth, setIsAuth] = React.useState(value);
  async function checkAuth(){
    axios.get(`${HOST}isauthenticated/`,{withCredentials:true}).then((res)=>{
        setIsAuth(true)
    }).catch((e)=>{
        setIsAuth(false)
    })
  }

    useEffect(()=>{
      checkAuth()
    },[])
  const { Provider } = AuthContext;
  return <Provider value={{ isAuth, setIsAuth }}>{children}</Provider>;
}
export { AuthContext, AuthProvider };
