import axios from 'axios';
import {React,useState,useEffect,useContext} from 'react';
import {useNavigate,Link} from 'react-router-dom';
import Cookies from 'js-cookie';
import CsrfToken from './csrf.js';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from '@fortawesome/free-solid-svg-icons';
import {themeContext} from '../App'; 
import {ThemeSwitch} from './navig'
import HOST from '../config.js';
import {Checkbox} from '@mui/material'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';





function WrongUserPass({errored,errorText}){
    if(errored){
        return <div className='errors' style={{color:'red',textDecoration:'bold'}}>{errorText}</div>
    }
    return null
}


function IsAuthenticated({auth,handleChange,handleSubmit,email,password,errored,errorText,theme}){
    let [type,setType] = useState('password')
    let handleToggle = (e)=>{
        if(e.target.checked){
            setType('text')
        }
        else{
            setType('password')
        }
    }
        if(auth){
            return <div  id='loggedin' style={{color:theme.setColor}}>You are already logged in <Link to='/' style={{color:'lightsalmon'}}>Back to main page</Link></div>
        }
        return (
            <form onSubmit={(e)=>handleSubmit(e)}  method='post' id='loginform' style={{backgroundColor:theme.setButtonColor,color:theme.setColor}}>
                <div  className = 'login-form' style={{backgroundColor:theme.setButtonColor,color:theme.setColor}}>

                <CsrfToken/>
                <h1 style={{color:theme.setColor}}>Login Page</h1>
                <input  type='email' className='email' name='email' onChange={(e)=>handleChange(e)} value={email} placeholder='Email' autoComplete='off' style={{backgroundColor:theme.setBg,color:theme.setTextColor}}></input>

                <input type={type} className='password' name='password' onChange={(e)=>handleChange(e)} value={password} placeholder='Password' style={{backgroundColor:theme.setBg,color:theme.setTextColor}}></input>
                <Checkbox className='hide-show' type='checkbox' onChange={(e)=>handleToggle(e)} value={type} icon={<VisibilityIcon style={{color:theme.setColor}}/>} checkedIcon={<VisibilityOffIcon/>} />

                <button  type='submit' className='user-link'style={{backgroundColor:theme.setBg,color:theme.setTextColor}}>Login</button>
                <Link to='/signup' className='user-link'style={{backgroundColor:theme.setBg,color:theme.setTextColor}}>New User?</Link>
                <Link to='/reset' className='user-link' style={{backgroundColor:theme.setBg,color:theme.setTextColor}}>Forgot Password?</Link>
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
    let {theme} = useContext(themeContext)


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
        axios.post(`${HOST}login/`,login,{withCredentials:true,headers: {'X-CSRFToken':Cookies.get('csrftoken')}}).then(
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
        axios.get(`${HOST}isauthenticated/`,{withCredentials:true}).then((res)=>{
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
        <div className='login-page' id='loginpage' style={{backgroundColor:theme.setBg}}>
            <CsrfToken></CsrfToken>
            <div className='navig-side'>
       <div  className='l-div'  style={{color:theme.setColor}}   onClick={()=>redirect('/')}>Home</div>
       <ThemeSwitch/>
       </div>
            <IsAuthenticated theme={theme} errorText={errorText} errored={isError} handleChange={handleChange} email={email} password={password} handleSubmit={handleSubmit} auth={isAuth}></IsAuthenticated>
        </div>
    )
}

export default Login;

