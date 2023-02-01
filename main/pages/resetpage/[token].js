import axios from "axios";
import {useState,useEffect,useContext} from "react";
import { useNavigate } from "react-router-dom";
import { useRouter } from "next/router";
import CsrfToken from "../../components/csrf";
import Cookies from "js-cookie";
import {ThemeSwitch} from '../../components/navig'
import {themeContext} from '../../pages/_app'
import HOST from "../../config";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Checkbox } from "@mui/material";
import Navigation from "../../components/navig";
import { AuthContext, AuthProvider } from "../../store/provider";
import Link from "next/link";
import styles from '../../styles/styling/reset.module.css'


export async function getServerSideProps({ params }) {
    if (!params) return { props: { isSuccess: false } };
    const { token } = params;
    const res = await fetch(`${HOST}resetpage/${token}`);
    return { props: { isSuccess: res.ok } };
  }



export default function PasswordResetPage(){

  
    let [password,setPassword] = useState('')
    let [confirm,setConfirm] = useState('')
    let [found,setFound] = useState({'found':true,val:0})
    let [error,setError] = useState({})
    let redirect = useRouter()
    let {token} = redirect.query
    let {theme} = useContext(themeContext)
    let [type,setType] = useState('password')
    let {isAuth} = useContext(AuthContext)

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


    useEffect(()=>{
        axios.get(`${HOST}reset/${token}/`).then((e)=>{
            setFound({'found':true,val:1})
            found.val = 1


        })
    },[found.val])
    
    let handleSubmit = (e)=>{
        e.preventDefault()
        axios.post(`${HOST}reset/${token}/`,{"password":password},{headers:{'X-CSRFToken':Cookies.get('csrftoken')}}).then((res)=>{
            redirect.replace('/')
        }).catch((e)=>{
  
            setError(e.response.data)

        })
    }

    let displayErrors = ()=>{
    
        if(typeof error== "object" && error.length>0){
        return error.map((e)=>{
            return(
            <div className={styles['error']} style={{display:'block'}}>
                <div>{e}</div>
            </div>
            )
        })
    }
    else{
        return <div className={styles['error']} style={{display:'block'}}>{}</div>
    }
    }


    if(!isAuth){
    return(
        <form method='post' onSubmit={(e)=>handleSubmit(e)} style={{backgroundColor:theme.setBg}}>
        <div className='nav-side'>
            <Navigation/>
            </div>
            <div className={styles['pass_change']}>
            <label className={styles['label']} style={{color:theme.setColor}}>Password</label>
            <input className={styles['password']}style={{color:theme.setColor,backgroundColor:theme.setButtonColor,borderBottomColor:theme.setColor}} type='password' required value={password} onChange={(e)=>handleChange(e)}></input>
            <label className={styles['label']} style={{color:theme.setColor}}>Confirm Password </label>
            <input className={styles['password']} style={{color:theme.setColor,backgroundColor:theme.setButtonColor,borderBottomColor:theme.setColor}} type={type} required value={confirm} onChange={(e)=>handleConfirmChange(e)}></input>
            <Checkbox className={styles['hide-show']} type='checkbox' onChange={(e)=>handleToggle(e)} value={type} icon={<VisibilityIcon style={{color:theme.setColor}}/>} checkedIcon={<VisibilityOffIcon/>} />
            <div  className={styles['password-invalid']} style={{display:error.length?'block':'none',color:'red'}}>{displayErrors()}</div>
            <div className={styles['reset-btn-div']}>
            {password===confirm?<button type='submit' className={styles['ll-div']}>Reset</button>:<div style={{color:'red'}}>Password is not matching</div>}
            </div>


        </div>
        </form>
    )


    }
    return(
        <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh'}}><div style={{fontSize:'25px'}}>You are already Logged in <Link href='/'>Back to main page</Link></div></div>
    )
}
