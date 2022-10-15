import { useEffect,useState } from "react";
import {useParams,useNavigate} from 'react-router-dom';
import axios from 'axios'

function Verify(){
    const [message, setMessage] = useState("");
    const token = useParams();
    const user = useParams();
    const redirect = useNavigate()
    useEffect(() => {
        axios.get(`https://backend.globeofarticles.com/verify/${token.token}/${token.user}/`).then((res)=>{
            setMessage(res.data)
            redirect('/')

        }).catch((e)=>{
            setMessage(e.response.data)
        })
    }
    ,[])

    return (
        <div className='verify-div'>
           <h1 style={{color:'yellowgreen'}}>{message}</h1>
        </div>
    )

}


export default Verify