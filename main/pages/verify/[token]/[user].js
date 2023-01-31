import { useEffect,useState } from "react";
import {Dialog} from '@mui/material'
import axios from 'axios'
import HOST from "../../../config";
import {useRouter} from 'next/router'
import styles from '../../../styles/styling/verify.module.css'


export default function Verify(){
    const [message, setMessage] = useState("");
    const [domLoaded,setDomLoaded] = useState(false)
    const [error,setError] = useState(null)
    
    const redirect = useRouter()
    const {token} = redirect.query;
    const {user} = redirect.query;

    useEffect(() => {

            

        if(redirect.isReady){
    
        axios.get(`${HOST}verify/${token}/${user}/`).then((res)=>{
            setMessage(res.data)

        
        }).catch((e)=>{
            setError(e.response.data)
      
            
        
        })
    }
}



    ,[redirect.isReady])
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
           <div style={{color:'green',padding:'25px',fontSize:'18px'}}>{message}</div>
        </Dialog>
    )

}
