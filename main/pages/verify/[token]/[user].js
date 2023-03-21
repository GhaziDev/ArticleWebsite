import { useEffect,useState } from "react";
/*import Dialog from '@mui/material/Dialog'*/

import axios from 'axios'
import HOST from "../../../config";
import {useRouter} from 'next/router'
import styles from '../../../styles/styling/verify.module.css'
import dynamic from "next/dynamic";
import useSWR from 'swr';
const Dialog = dynamic(()=>import('@mui/material/Dialog'))


/*
export async function getServerSideProps({params}){

    try{
        let res = await fetch(`${HOST}verify/${params.token}/${params.user}/`)
        let data = await res.json()
        return({
            props:{data:data,token:params.token,user:params.user}
        })

    }
    catch(e){
        return(
            {
                props:{}
            }
        )
    }
}

*/






export default function Verify(){
    const [message, setMessage] = useState("");
    const [error,setError] = useState(null)
    const redirect = useRouter()
    const {user} = redirect.query
    const {token} = redirect.query
    let {data,err1} = useSWR(`${HOST}verify/${token}/${user}/`,url=>fetch(url).then((res)=>res.json()))
    
    

    


    useEffect(() => {

        if(data){
    
        axios.get(`${HOST}verify/${token}/${user}/`).then((res)=>{
            console.log(`This is data response : ${res.data}`)
            setMessage(res.data)

        
        }).catch((e)=>{
            console.log(`This is error response : ${e.response.data}`)
            setError(e.response.data)
      
            
        
        })
    }
}



    ,[data])

    if(error){
        return(
            <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh'}}>
                <h1>{error}</h1>
            </div>
        )
    }

    
    return (

        data?

      
        <Dialog open={true} onClose={setTimeout(()=>{
            redirect.replace('/')
        },2000)}
         className={styles['verify-div']}>
           <div style={{color:'green',padding:'25px',fontSize:'18px'}}>{data}</div>
        </Dialog>:<div>Loading...</div>
    )

}
