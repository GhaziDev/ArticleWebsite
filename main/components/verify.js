import { useEffect,useState } from "react";
import {useParams,useNavigate} from 'react-router-dom';
import Dialog from '@mui/material/Dialog'
import axios from 'axios'
import HOST from "../config";

function Verify(){
    const [message, setMessage] = useState("");
    const token = useParams();
    const user = useParams();
    const redirect = useNavigate()
    useEffect(() => {
        axios.get(`${HOST}verify/${token.token}/${token.user}/`).then((res)=>{
            setMessage(res.data)
            setTimeout(()=>{
                redirect('/')
            },2500)

        }).catch((e)=>{
            setMessage(e.response.data)
        })
    }
    ,[])

    return (
        <Dialog open={true} className='verify-div'>
           <div style={{color:'green',padding:'25px',fontSize:'18px'}}>{message}</div>
        </Dialog>
    )

}


export default Verify