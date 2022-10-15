import axios from "axios";
import Cookies from "js-cookie";
import { React, useState, useEffect } from "react";
import { Dialog } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import CsrfToken from "./csrf";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	Checkbox
} from "@mui/material";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { faHome } from "@fortawesome/free-solid-svg-icons";

function VerfiyAcc({isUp}){
    if(isUp)
    return(
        <Dialog open={isUp} style={{fontSize:'18px',fontWeight:'bold'}}>
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
      <div className="errors" style={{ color: "red", textDecoration: "bold" }}>
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
    axios.post('https://backend.globeofarticles.com/password-valid/',{password:password},{headers:{'X-CSRFToken':Cookies.get('csrf')}}).then((res)=>{
      setInnerHtml(
        {
          ...innerHtml,
          password:""
        }
      )
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
      }
      setDisabled(true)
    })
  },[password])

  useEffect(() => {
    axios
      .post("https://backend.globeofarticles.com/exists/", { username: username })
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
      });
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
      .post("https://backend.globeofarticles.com/signup/", signup, {
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
    <div className="signup-page">
       <button  className='top-left'  style={{backgroundColor:'white'}} onClick={()=>redirect('/')}><FontAwesomeIcon icon={faHome}></FontAwesomeIcon></button>
      <form
        method="post"
        onSubmit={(e) => handleSubmit(e)}
        autoComplete="off"
        autoCorrect="off"
      >
        <CsrfToken></CsrfToken>
        <div className="signup-form">
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
          ></input>
          <div style={style}>{innerHtml.username}</div>
          <input
            required
            type="email"
            name="email"
            className="email"
            onChange={(e) => handleChange(e)}
            placeholder="Email"
            value={email}
          ></input>
          <input
            required
            type={type}
            name="password"
            className="password-inp"
            onChange={(e) => handleChange(e)}
            placeholder="Password"
            value={password}
          ></input>
          <Checkbox className='hide-show' type='checkbox' onChange={(e)=>handleToggle(e)} value={type} icon={<VisibilityIcon/>} checkedIcon={<VisibilityOffIcon/>} />
          <div style={{color:'red'}}>{listPasswordErrors()}</div>
          <VerfiyAcc isUp={isUp}></VerfiyAcc>
          <WrongUserPass error={error}></WrongUserPass>
          <button type="submit" className="signupsbmt"  >
            Signup
          </button>
          <Link to="/login">Already have an account?</Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;
