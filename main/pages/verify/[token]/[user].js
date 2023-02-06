import { useEffect,useState } from "react";
import {Dialog} from '@mui/material'
import axios from 'axios'
import HOST from "../../../config";
import {useRouter} from 'next/router'
import styles from '../../../styles/styling/verify.module.css'


export async function getServerSideProps({params}){

    try{
        let res = await fetch(`${HOST}verify/${params.token}/${params.user}/`)
        let token = await res.json()
        return({
            props:{token}
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





export default function Verify(){
    const [message, setMessage] = useState("");
    const [domLoaded,setDomLoaded] = useState(false)
    const [error,setError] = useState(null)
    
    const redirect = useRouter()
    const {token} = redirect.query;
    const {user} = redirect.query;
    console.log("Start logging here")
    console.log(`this is token : ${token}`)
    console.log(`user : ${user}`)
    console.log(`${HOST}`)


    useEffect(() => {
        console.log(`router is ready? ${redirect}`)

        if(redirect.isReady){

            console.log("Inside useEffect assuming the router is ready : ")
    
        axios.get(`${HOST}verify/${token}/${user}/`).then((res)=>{
            console.log(`This is data response : ${res.data}`)
            setMessage(res.data)

        
        }).catch((e)=>{
            console.log(`This is error response : ${e.response.data}`)
            setError(e.response.data)
      
            
        
        })
    }
}



    ,[redirect.isReady])

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
           <div style={{color:'green',padding:'25px',fontSize:'18px'}}>{message}</div>
        </Dialog>
    )

}
