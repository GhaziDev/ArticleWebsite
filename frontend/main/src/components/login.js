import axios from 'axios';
import {React,useState,useEffect} from 'react';
import {useNavigate,Link} from 'react-router-dom';
import Cookies from 'js-cookie';
import CsrfToken from './csrf.js';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from '@fortawesome/free-solid-svg-icons';



function WrongUserPass({errored,errorText}){
    if(errored){
        return <div className='errors' style={{color:'red',textDecoration:'bold'}}>{errorText}</div>
    }
    return null
}


function IsAuthenticated({auth,handleChange,handleSubmit,email,password,errored,errorText}){
        if(auth){
            return <div  id='loggedin'>You are already logged in <Link to='/'>Back to main page</Link></div>
        }
        return (
            <form onSubmit={(e)=>handleSubmit(e)} method='post' id='loginform'>
                <div  className = 'login-form'>

                <CsrfToken/>
                <h1>Login Page</h1>
                <input  type='email' className='email' name='email' onChange={(e)=>handleChange(e)} value={email} placeholder='Email' autoComplete='off'></input>

                <input type='password' className='password' name='password' onChange={(e)=>handleChange(e)} value={password} placeholder='Password'></input>
                <button  type='submit' className='login-submit'>Login</button>
                <Link to='/signup' className='user-link'>New User?</Link>
                <Link to='/reset' className='user-link' style={{fontSize:'12px'}}>Forgot Password?</Link>
                <WrongUserPass errored={errored} errorText={errorText}></WrongUserPass>
                </div>
            </form>
            
        )
    }


const Login = ()=>{
    const [login,setLogin] = useState({'email':'','password':''})
    const {email,password} = login
    const navigate = useNavigate()
    let [errorText,setErrorText] = useState('')
    let [isError,setIsError] = useState(false);
    let [isAuth,setIsAuth] = useState(false);
    let redirect = useNavigate()

    let handleChange = (e)=>{
        setLogin(
            {
                ...login,
                [e.target.name]:e.target.value
            }
        )

    }
    let handleSubmit = (e)=>{
        e.preventDefault()
        axios.post('http://127.0.0.1:8000/login/',login,{withCredentials:true,headers: {'X-CSRFToken':Cookies.get('csrftoken')}}).then(
            (res)=>{

                    navigate('/',{replace:true})

            }
        ).catch((e)=>{
            if(e.response){
                setErrorText(e.response.data)
                setIsError(true)
                
            }
        })

    }
// useRef on a div
    useEffect(()=>{
        axios.get('https://backend.globeofarticles.com/isauthenticated/',{withCredentials:true}).then((res)=>{
            setIsAuth(true)
        


        }).catch((e)=>{
            if (e.response){
                if(e.response.status===401){
                    setIsAuth(false)
            }}
        }
    )}
    ,[])

    return(
        <div className='login-page' id='loginpage'>
             <button  className='top-left'  style={{backgroundColor:'white'}} onClick={()=>redirect('/')}><FontAwesomeIcon icon={faHome}></FontAwesomeIcon></button>
            <IsAuthenticated errorText={errorText} errored={isError} handleChange={handleChange} email={email} password={password} handleSubmit={handleSubmit} auth={isAuth}></IsAuthenticated>
        </div>
    )
}

export default Login;

