import axios from "axios";
import Cookies from "js-cookie";
import { React, useState, useEffect , useContext,useCallback} from "react";
import { Dialog } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import CsrfToken from "./csrf";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ThemeSwitch } from "./navig";
import HOST from "../config";

import {
	Checkbox
} from "@mui/material";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { themeContext } from "../App";

function VerfiyAcc({isUp}){
    if(isUp)
    return(
        <Dialog open={isUp} style={{fontSize:'18px',fontWeight:'400'}}>
            Please verify your account so you are able to log in.
        </Dialog>

    )
    else{
        return null
    }

}

function WrongUserPass({ error }) {
  if (error) {
    return (
      <div className="errors" style={{ color: "red" ,fontSize:'1px',fontWeight:'300'}}>
        {error}
      </div>
    );
  }
  return null;
}

const Signup = () => {

  const [signup, setSignup] = useState({
    username: "",
    email: "",
    password: "",
  });


  const [exist, setExist] = useState({
    display: "none",
    color: "red",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  });

  const {theme} = useContext(themeContext)

  const [innerHtml, setInnerHtml] = useState({"username":"","password":""});
  const [isUp,setIsUp] = useState(false)
  const [disabled,setDisabled] = useState(false)
  const { username, email, password } = signup;
  const [error, setError] = useState("");
  const [showOrHidePassword,setShowOrHidePassword] = useState({'type':'password'})
  const [style,setStyle] = useState({color:'green'})
  const {type} = showOrHidePassword
  const redirect = useNavigate();

  const handleToggle = (e)=>{
    if(e.target.checked){
      setShowOrHidePassword({
        type:'text'
      }
      )
    }
    else{
      setShowOrHidePassword(
        {
          type:'password'
        }
      )
    }
  }


  useEffect(()=>{
    const Data = 
    setTimeout(()=>{
    axios.post(`${HOST}password-valid/`,{password:password},{headers:{'X-CSRFToken':Cookies.get('csrf')}}).then((res)=>{
      setInnerHtml(
        {
          ...innerHtml,
          password:""
        }
      )
      console.log(res.data)
    }).catch((e)=>{
      if (password.trim().length === 0) {
        setExist({
          ...exist,
          display: "none",
        });
      } 
      else {
          setExist({
            ...exist,
            display: "flex",
            color: "red",
          });
          setInnerHtml({
            ...innerHtml,
            password:e.response.data
          });
        setDisabled(true)
    
    }
  }
    )
  },1000)
  return ()=>clearTimeout(Data)
},[password])

  useEffect(() => {
    const usernameData = setTimeout(()=>{
    axios
      .post(`${HOST}exists/`, { username: username })
      .then((res) => {
        setStyle({color:'yellowgreen'})
        setExist({
          ...exist,
          display: "flex",
          color: "yellowgreen",
        });
        setInnerHtml(({
          ...innerHtml,
          username:res.data
        }
        ));
        setDisabled(false)
      })

      .catch((e) => {
        if (username.trim().length === 0) {
          setExist({
            ...exist,
            display: "none",
          });
        } else {
          setStyle({color:'red'})
          setExist({
            ...exist,
            display: "flex",
            color: "red",
          });
          setInnerHtml({
            ...innerHtml,
            username:e.response.data
          });
        }
        setDisabled(true)
      })}
    ,1000)
    return ()=>clearTimeout(usernameData)
  }, [username]);

  let handleChange = (e) => {
    setSignup({
      ...signup,
      [e.target.name]: e.target.value,
    });
  };

  let handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${HOST}signup/`, signup, {
        withCredentials: true,
        headers: { "X-CSRFToken": Cookies.get("csrftoken") },
      })
      .then((res) => {
        setDisabled(true)
        setIsUp(true)
        setTimeout(()=>{
          redirect('/')
        },1500)
        

      })
      .catch((e) => {
        let err = e.response.data
        setError(err);
      });
  };

  function listPasswordErrors(){
    if(innerHtml.password){
    return(
      innerHtml.password.map((index)=>{
        return(
          <div>{index}</div>
        )
      })
    )
  }
  return null
}

  return (
    <div className="signup-page" style={{backgroundColor:theme.setBg}}>
      <div className='navig-side'>
       <button  className='top-left'   onClick={()=>redirect('/')}><FontAwesomeIcon icon={faHome}></FontAwesomeIcon></button>
       <ThemeSwitch/>
       </div>

       <div className='form-wrapper'>
      <form
        method="post"
        onSubmit={(e) => handleSubmit(e)}
        autoComplete="off"
        autoCorrect="off"
      >
        <CsrfToken></CsrfToken>
        <div className="signup-form" style={{backgroundColor:theme.setButtonColor,color:theme.setTextColor}}>
          <h1>Signup Page</h1>
          <input
            minLength={6}
            maxLength={30}
            required
            type="text"
            name="username"
            className="username"
            onChange={(e) => handleChange(e)}
            placeholder="Username"
            value={username}
            style={{backgroundColor:theme.setBg,color:theme.setTextColor}}
          ></input>
          <div style={style}>{innerHtml.username}</div>
          <input
            required
            type="email"
            name="email"
            className="username"
            onChange={(e) => handleChange(e)}
            placeholder="Email"
            value={email}
            style={{backgroundColor:theme.setBg,color:theme.setTextColor}}
          ></input>
          <div></div>
          <input
            required
            type={type}
            name="password"
            className="username"
            onChange={(e) => handleChange(e)}
            placeholder="Password"
            value={password}
            style={{backgroundColor:theme.setBg,color:theme.setTextColor}}
          ></input>
          <Checkbox className='hide-show' type='checkbox' onChange={(e)=>handleToggle(e)} value={type} icon={<VisibilityIcon style={{color:theme.setColor}}/>} checkedIcon={<VisibilityOffIcon/>} />
          <div style={{color:'red'}}>{listPasswordErrors()}</div>
          <VerfiyAcc isUp={isUp}></VerfiyAcc>
          <button type="submit" className="signupsbmt" disabled={disabled}  style={{backgroundColor:theme.setBg,color:theme.setColor}}>
            Signup
          </button>
          <Link  style={{color:theme.setTextColor}} to="/login">Already have an account?</Link>
        </div>
      </form>
      </div>
    </div>
  );
};

export default Signup;
