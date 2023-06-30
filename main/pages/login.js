import axios from 'axios';
import {React,useState,useEffect,useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import Cookies from 'js-cookie';
import CsrfToken from '../components/csrf.js';
import {themeContext} from '../pages/_app'; 
import {ThemeSwitch} from '../components/navig'
import HOST from '../config.js';
import { AuthContext } from '../store/provider';
import { useRouter } from 'next/router.js';
import styles from '../styles/styling/login.module.scss'
import dynamic from 'next/dynamic'

import {clsx} from 'clsx'

const Navigation = dynamic(()=>import('../components/navig'))
const Checkbox = dynamic(()=>import('@mui/material').then((mod)=>mod.Checkbox))
const VisibilityIcon = dynamic(()=>import('@mui/icons-material/Visibility'))
const VisibilityOffIcon = dynamic(()=>import('@mui/icons-material/VisibilityOff'))
const Link = dynamic(()=>import('next/link'))





function WrongUserPass({errored,errorText}){
    if(errored){
        return <div className='errors' style={{color:'red',textDecoration:'bold'}}>{errorText}</div>
    }
    return null
}


function IsAuthenticated({auth,handleChange,handleSubmit,email,password,errored,errorText,theme}){
    let [type,setType] = useState('password')
    let redirect = useRouter()

    let handleToggle = (e)=>{
        if(e.target.checked){
            setType('text')
        }
        else{
            setType('password')
        }
    }
        if(auth){
            return <div  id='loggedin' className={clsx({
                [styles.dark_]: theme.setChecked,
                [styles.light_]:!theme.setChecked
            })}>You are already logged in <Link href='/' style={{color:'green'}}>Back to main page</Link></div>
        }
        return (
           
            <form onSubmit={(e)=>handleSubmit(e)}  method='post' id='loginform' className={clsx({
                [styles.dark_]: theme.setChecked,
                [styles.light_]:!theme.setChecked
            })}>
                <div  className = {`${styles['login-form']}
                ${clsx({
                    [styles.dark_]: theme.setChecked,
                    [styles.light_]:!theme.setChecked
                })}`} >

                <CsrfToken/>
                <h1 style={{color:theme.setChecked?'white':'black'}}>Login Page</h1>
                <input  type='email' className={`${styles['email']}
                ${clsx({
                    [styles.dark_]: theme.setChecked,
                    [styles.light_]:!theme.setChecked
                })} ${styles['btn']}`} name='email' onChange={(e)=>handleChange(e)} value={email} placeholder='Email' autoComplete='off' ></input>

                <input type={type} className={`${styles['email']}
                ${clsx({
                    [styles.dark_]: theme.setChecked,
                    [styles.light_]:!theme.setChecked
                })} ${styles['btn']}`} name='password' onChange={(e)=>handleChange(e)} value={password} placeholder='Password'></input>
                <Checkbox className={styles['hide-show']} type='checkbox' onChange={(e)=>handleToggle(e)} value={type} icon={<VisibilityIcon style={{color:theme.setColor}}/>} checkedIcon={<VisibilityOffIcon/>} />

                <button  type='submit' className={`${styles['user-link']} ${clsx({
                [styles.dark_]: theme.setChecked,
                [styles.light_]:!theme.setChecked
            })} ${styles['btn']}`} >Login</button>
                <button type='button' onClick={(e)=>redirect.push('/signup')} className={`${styles['user-link']}
                ${clsx({
                    [styles.dark_]: theme.setChecked,
                    [styles.light_]:!theme.setChecked
                })} ${styles['btn']}`}>New User?</button>
                <button type='button' onClick={(e)=>redirect.push('/reset')} className={`${styles['user-link']}
                ${clsx({
                    [styles.dark_]: theme.setChecked,
                    [styles.light_]:!theme.setChecked
                })} ${styles['btn']}`} >Forgot Password?</button>
                <WrongUserPass errored={errored} errorText={errorText}></WrongUserPass>
                </div>
            </form>
        
            
        )
    }


const Login = ()=>{
    const [login,setLogin] = useState({'email':'','password':''})
    const {email,password} = login
    let [errorText,setErrorText] = useState('')
    let [isError,setIsError] = useState(false);
    let {isAuth,setIsAuth}= useContext(AuthContext)

    
    let redirect = useRouter()
    let {theme} = useContext(themeContext)



    let handleChange = (e)=>{
        setIsError(false)
        setLogin(
            {
                ...login,
                [e.target.name]:e.target.value
            }
        )

    }
    let handleSubmit = (e)=>{
        e.preventDefault()
        axios.post(`${HOST}login/`,login,{withCredentials:true,headers: {'X-CSRFToken':Cookies.get('csrftoken')}}).then(
            (res)=>{

                    redirect.replace('/') 
                    // manage redirect here
                    setIsAuth(true)


            }
        ).catch((e)=>{
            if(e.response){
                setErrorText(e.response.data)
                setIsError(true)
            
                
                
            }
        })

    }
// useRef on a div



    return(
        <div className={`${styles['login-page']} ${clsx({
            [styles.dark_]: theme.setChecked,
            [styles.light_]:!theme.setChecked
        })}`} id='loginpage'>
            <CsrfToken></CsrfToken>
            <div className={`${styles['navig-side']}
            ${clsx({
                [styles.dark_]: theme.setChecked,
                [styles.light_]:!theme.setChecked
            })} ${styles['btn']}`}>
                <Navigation/>
       </div>
       <div className={styles['formSec']}>
            <IsAuthenticated theme={theme} errorText={errorText} errored={isError} handleChange={handleChange} email={email} password={password} handleSubmit={handleSubmit} auth={isAuth}></IsAuthenticated>
            </div>
        </div>
    )
}

export default Login;

