import axios from "axios";
import {useState,useEffect} from "react";
import { useParams, useNavigate } from "react-router-dom";
import CsrfToken from "./csrf";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBorderNone, faHome } from "@fortawesome/free-solid-svg-icons";

function Popup({isSent}){
    if(isSent){
    return(
        <div style={{backgroundColor:'limegreen'}}>An Email has been sent!</div>
    )
    }
    return null
}

function PasswordResetAsk(){
    let [email,setEmail] = useState({'email':''})
    let [isSent,setIsSent] = useState(false)
    let redirect = useNavigate
    let handleChange = (e)=>{
        setEmail(
            {
                [e.target.name]:e.target.value
            }
        )
    }

    let submitChange = (e)=>{
        e.preventDefault()
        axios.post('http://127.0.0.1:8000/reset/',email,{headers:{'X-CSRFTOKEN':Cookies.get('csrftoken')}}).then((res)=>{
            setIsSent(true)
            setEmail({'email':''})
           

        }).catch((e)=>{
            console.log(e.response.data)
        })
    }

    return(
        <form method='post' onSubmit={(e)=>submitChange(e)}>
        <div className='reset-page-div'>
        <button  className='top-left'  style={{backgroundColor:'white'}} onClick={()=>redirect('/')}><FontAwesomeIcon icon={faHome}></FontAwesomeIcon></button>

            <h1>Reset Password Page</h1>
            <label>Email</label>
            <input className="email-inp" name='email'  value={email.email} onChange={(e)=>handleChange(e)}></input>
            <button type='submit'>Send reset link</button>
            <Popup isSent={isSent}></Popup>
            
        </div>
        </form>
    )
}

function PassConfirmation({confirm,password}){
    if(confirm!==password){
        return <div style={{color:'red'}}>Password is not matching</div>
    }
    return <button type='submit'>Reset</button>
}

function PasswordResetPage(){
    let {id} = useParams()
    let {token} = useParams()
    let [password,setPassword] = useState('')
    let [confirm,setConfirm] = useState('')
    let [found,setFound] = useState({'found':true,val:0})
    let redirect = useNavigate()

    let handleChange = (e)=>{
        setPassword(
            e.target.value
        )
    }
    let handleConfirmChange = (e)=>{
        setConfirm(
            e.target.value
        )

    }


    useEffect(()=>{
        axios.get(`http://127.0.0.1:8000/reset/${token}/${id}/`).catch((e)=>{
            setFound({'found':true,val:1})
            found.val = 1


        })
    },[found.val])
    
    let handleSubmit = (e)=>{
        e.preventDefault()
        axios.post(`http://127.0.0.1:8000/reset/${token}/${id}/`,{"password":password},{headers:{'X-CSRFTOKEN':Cookies.get('csrftoken')}}).then((res)=>{
            redirect('/')
        }).catch((e)=>{
        })
    }

    if(found.val===1){
        return(
            <h1 style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                Page not found :(
            </h1>
        )
    }
    return(
        <form method='post' onSubmit={(e)=>handleSubmit(e)}>
        <div className='pass_change'>
        <button  className='top-left'  style={{backgroundColor:'white'}} onClick={()=>redirect('/')}><FontAwesomeIcon icon={faHome}></FontAwesomeIcon></button>
            <label>Password : </label>
            <input type='password' required value={password} onChange={(e)=>handleChange(e)}></input>
            <label>Confirm Password </label>
            <input type='password' required value={confirm} onChange={(e)=>handleConfirmChange(e)}></input>
            <PassConfirmation confirm={confirm} password={password}></PassConfirmation>

        </div>
        </form>
    )


}


export default PasswordResetAsk;
export {PasswordResetPage};