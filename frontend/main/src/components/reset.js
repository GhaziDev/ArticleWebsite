import axios from "axios";
import {useState,useEffect,useContext} from "react";
import { useParams, useNavigate } from "react-router-dom";
import CsrfToken from "./csrf";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBorderNone, faHome } from "@fortawesome/free-solid-svg-icons";
import {ThemeSwitch} from './navig'
import {themeContext} from '../App.js'

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
        axios.post('https://www.backend.globeofarticles.com/reset/',email,{headers:{'X-CSRFToken':Cookies.get('csrftoken')}}).then((res)=>{
            setIsSent(true)
            setEmail({'email':''})
           

        }).catch((e)=>{
            console.log(e.response.data)
        })
    }

    return(
        <form method='post' onSubmit={(e)=>submitChange(e)} style={{backgroundColor:theme.setBg,color:theme.setColor}}>
        <div className='reset-page-div' >
        <CsrfToken></CsrfToken>
            <div className='navig-side'>
       <button  className='top-left'   onClick={()=>redirect('/')}><FontAwesomeIcon icon={faHome}></FontAwesomeIcon></button>
       <ThemeSwitch/>
       </div>

            <h1>Reset Password Page</h1>
            <input className="email-inp" name='email'  value={email.email} onChange={(e)=>handleChange(e)} placeholder='insert your email here'></input>
            <button  style={{backgroundColor:theme.setButtonColor,color:theme.setColor}} className='reset-button' type='submit'>Send reset link</button>
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

    let {token} = useParams()
    let [password,setPassword] = useState('')
    let [confirm,setConfirm] = useState('')
    let [found,setFound] = useState({'found':true,val:0})
    let [error,setError] = useState({})
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

    console.log(token)


    useEffect(()=>{
        axios.get(`https://www.backend.globeofarticles.com/reset/${token}/`).then((e)=>{
            setFound({'found':true,val:1})
            found.val = 1
            console.log(found.val)


        })
    },[found.val])
    
    let handleSubmit = (e)=>{
        e.preventDefault()
        axios.post(`https://www.backend.globeofarticles.com/reset/${token}/`,{"password":password},{headers:{'X-CSRFToken':Cookies.get('csrftoken')}}).then((res)=>{
            redirect('/')
        }).catch((e)=>{
            console.log(e.response.data)
            setError(e.response.data)

        })
    }

    let displayErrors = ()=>{
        return error.map((e)=>{
            return(
            <div className='error' style={{display:'block'}}>
                <div>{e}</div>
            </div>
            )
        })
    }

    if(found.val===0){
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
            <div className='password-invalid' style={{display:error.length?'block':'none',color:'red'}}>{displayErrors()}</div>
            <PassConfirmation confirm={confirm} password={password}></PassConfirmation>

        </div>
        </form>
    )


}


export default PasswordResetAsk;
export {PasswordResetPage};