import axios from "axios";
import {useState,useEffect,useContext} from "react";
import { useParams, useNavigate } from "react-router-dom";
import CsrfToken from "./csrf";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBorderNone, faHome } from "@fortawesome/free-solid-svg-icons";
import {ThemeSwitch} from './navig'
import {themeContext} from '../App.js'
import HOST from "../config";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Checkbox } from "@mui/material";

function Popup({isSent}){
    if(isSent){
    return(
        <div style={{color:'limegreen'}}>An Email has been sent!</div>
    )
    }
    return null
}

function PasswordResetAsk(){
    let [email,setEmail] = useState({'email':''})
    let [isSent,setIsSent] = useState(false)
    let [disabled,setDisabled] = useState(false)

    let redirect = useNavigate()
    let {theme} = useContext(themeContext)
    let handleChange = (e)=>{
        setEmail(
            {
                [e.target.name]:e.target.value
            }
        )
    }

    let submitChange = (e)=>{
        e.preventDefault()
        axios.post(`${HOST}reset/`,email,{headers:{'X-CSRFToken':Cookies.get('csrftoken')}}).then((res)=>{
            setIsSent(true)
            setEmail({'email':''})
            setDisabled(true)
           

        }).catch((e)=>{
            console.log(e.response.data)
        })
    }

    return(
        <form method='post' onSubmit={(e)=>submitChange(e)} style={{backgroundColor:theme.setBg,color:theme.setColor}}>
        <div className='reset-page-div' >
        <CsrfToken></CsrfToken>
            <div className='navig-side'>
       <div className='l-div' style={{color:theme.setColor}}  onClick={()=>redirect('/')}>Home</div>
       <ThemeSwitch/>
       </div>

            <h1>Reset Password Page</h1>
            <input className="email-inp" name='email'  value={email.email} onChange={(e)=>handleChange(e)} placeholder='insert your email here'></input>
            <button  style={{backgroundColor:theme.setButtonColor,color:theme.setColor}} disabled={disabled} className='reset-button' type='submit'>Send reset link</button>
            <Popup isSent={isSent}></Popup>
            
        </div>
        </form>
    )
}

function PassConfirmation({confirm,password,type}){
    if(confirm!==password){
        return <div style={{color:'red'}}>Password is not matching</div>
    }
    
    return <button type={type} className='ll-div'>Reset</button>
}

function PasswordResetPage(){

    let {token} = useParams()
    let [password,setPassword] = useState('')
    let [confirm,setConfirm] = useState('')
    let [found,setFound] = useState({'found':true,val:0})
    let [error,setError] = useState({})
    let redirect = useNavigate()
    let {theme} = useContext(themeContext)
    let [type,setType] = useState('password')

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

    let handleToggle = (e)=>{
        if(e.target.checked){
            setType('text')
        }
        else{
            setType('password')
        }
    }

    console.log(token)


    useEffect(()=>{
        axios.get(`${HOST}reset/${token}/`).then((e)=>{
            setFound({'found':true,val:1})
            found.val = 1
            console.log(found.val)


        })
    },[found.val])
    
    let handleSubmit = (e)=>{
        e.preventDefault()
        axios.post(`${HOST}reset/${token}/`,{"password":password},{headers:{'X-CSRFToken':Cookies.get('csrftoken')}}).then((res)=>{
            redirect('/')
        }).catch((e)=>{
            console.log(e.response.data)
            setError(e.response.data)

        })
    }

    let displayErrors = ()=>{
        console.log(typeof error)
        if(typeof error== "object" && error.length>0){
        return error.map((e)=>{
            return(
            <div className='error' style={{display:'block'}}>
                <div>{e}</div>
            </div>
            )
        })
    }
    else{
        return <div className='error' style={{display:'block'}}>{}</div>
    }
    }

    if(found.val===0){
        return(
            <h1 style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                Page not found :(
            </h1>
        )
    }
    return(
        <form method='post' onSubmit={(e)=>handleSubmit(e)} style={{backgroundColor:theme.setBg}}>
        <div className='pass_change'>
        <div className='l-div' style={{color:theme.setColor}}  onClick={()=>redirect('/')}>Home</div>
       <ThemeSwitch/>
            <label style={{color:theme.setColor}}>Password : </label>
            <input style={{color:theme.setColor,backgroundColor:theme.setBg,borderBottomColor:theme.setColor}} type='password' required value={password} onChange={(e)=>handleChange(e)}></input>
            <label style={{color:theme.setColor}}>Confirm Password </label>
            <input style={{color:theme.setColor,backgroundColor:theme.setBg,borderBottomColor:theme.setColor}} type={type} required value={confirm} onChange={(e)=>handleConfirmChange(e)}></input>
            <Checkbox className='hide-show' type='checkbox' onChange={(e)=>handleToggle(e)} value={type} icon={<VisibilityIcon style={{color:theme.setColor}}/>} checkedIcon={<VisibilityOffIcon/>} />
            <div  className='password-invalid' style={{display:error.length?'block':'none',color:'red'}}>{displayErrors()}</div>
            <PassConfirmation type={type} submit={handleSubmit} confirm={confirm} password={password}></PassConfirmation>

        </div>
        </form>
    )


}

//focus into this page tomorrow.



export default PasswordResetAsk;
export {PasswordResetPage};