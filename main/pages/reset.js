import axios from "axios";
import {useState,useEffect,useContext} from "react";
import { useRouter } from "next/router";
import CsrfToken from "../components/csrf";
import Cookies from "js-cookie";
import Navigation from '../components/navig'
import {themeContext} from '../pages/_app'
import HOST from "../config";

import styles from '../styles/styling/reset.module.css'

import { AuthContext } from "../store/provider";
import Link from "next/link";

function Popup({isSent}){
    if(isSent){
    return(
        <div style={{color:'limegreen'}}>An Email has been sent!</div>
    )
    }
    return null
}

export default function PasswordResetAsk(){
    let [email,setEmail] = useState({'email':''})
    let [isSent,setIsSent] = useState(false)
    let [disabled,setDisabled] = useState(false)

    let redirect = useRouter()
    let {theme} = useContext(themeContext)
    let {isAuth} = useContext(AuthContext)
   
    let handleChange = (e)=>{
        disabled?setDisabled(false):null
        isSent?setIsSent(null):null
        setEmail(
            {
                [e.target.name]:e.target.value
            }
        )
    }

    let submitChange = (e)=>{
        e.preventDefault()
        setDisabled(true)
        axios.post(`${HOST}reset/`,email,{headers:{'X-CSRFToken':Cookies.get('csrftoken')}}).then((res)=>{
            setIsSent(true)
            setEmail({'email':''})
            setDisabled(true)
           

        }).catch((e)=>{
           
        })
    }


    if(!isAuth){
    return(
        <form method='post' onSubmit={(e)=>submitChange(e)} style={{backgroundColor:theme.setBg,color:theme.setColor}}>
        <div className={styles['reset-page-div']} >
        <CsrfToken></CsrfToken>
        <div className={styles['navig-wrapper']}>
            <div className={styles['navig-side']}>
                <Navigation/>
       </div>
       </div>
       <div className={styles['page-wrapper']}>
            <h1>Reset Password Page</h1>
            <input className={styles["email-inp"]} name='email' required value={email.email} onChange={(e)=>handleChange(e)} placeholder='insert your email here'></input>
            <button  style={{backgroundColor:theme.setButtonColor,color:theme.setColor}} disabled={disabled}  className={styles['reset-button']} type='submit'>{disabled?<div  className={styles["lds-ring"]}><div></div><div></div><div></div><div></div></div>:'Send reset link'}</button>
            <Popup isSent={isSent}></Popup>
            </div>
            
        </div>
        </form>
    )
}
     return <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh'}}><div style={{fontSize:'25px'}}>You are already Logged in <Link href='/'>Back to main page</Link></div></div>
}

function PassConfirmation({confirm,password,type}){
    if(confirm!==password){
        return <div style={{color:'red'}}>Password is not matching</div>
    }
    
    return <button type={type} className='ll-div'>Reset</button>
}

