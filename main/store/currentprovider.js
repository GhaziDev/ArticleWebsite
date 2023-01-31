import axios from 'axios'
import {createContext,useState,useEffect} from 'react'
import HOST from '../config'

// a provider component for checking the current user

let currentUser = createContext()
export default function CurrentUserProvider({children,value}){
    let [current,setCurrent] = useState()
    useEffect(()=>{
        axios.get(`${HOST}current/`,{withCredentials:true}).then((res)=>{
            setCurrent(res.data)


        }).catch((err)=>{
            setCurrent(null)
        })
    },[])
    return <currentUser.Provider value={{current,setCurrent}}>{children}</currentUser.Provider>

}


export {currentUser};
