import { useEffect,useState } from "react";
/*import Dialog from '@mui/material/Dialog'*/

import axios from 'axios'
import HOST from "../../../config";
import {useRouter} from 'next/router'
import styles from '../../../styles/styling/verify.module.css'
import dynamic from "next/dynamic";



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





export default function Verify({token,data,user}){
    const [message, setMessage] = useState("");
    const [error,setError] = useState(null)
    
    const redirect = useRouter()

    const Dialog = dynamic(()=>import('@mui/material/Dialog'))


    useEffect(() => {
    
        axios.get(`${HOST}verify/${token}/${user}/`).then((res)=>{
            console.log(`This is data response : ${res.data}`)
            setMessage(res.data)

        
        }).catch((e)=>{
            console.log(`This is error response : ${e.response.data}`)
            setError(e.response.data)
      
            
        
        })
    }



    ,[])

    if (redirect.isFallback){
        return <div>Loading...</div>
    }
    if(error){
        return(
            <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh'}}>
                <h1>{error}</h1>
            </div>
        )
    }

    
    return (

      
        <Dialog open={true} onClose={setTimeout(()=>{
            redirect.replace('/')
        },2000)}
         className={styles['verify-div']}>
           <div style={{color:'green',padding:'25px',fontSize:'18px'}}>{data}</div>
        </Dialog>
    )

}
