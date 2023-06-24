import axios from "axios";
import Cookies from "js-cookie";
import { React, useState, useEffect , useContext} from "react";
import CsrfToken from "../components/csrf";
import HOST from "../config";
import dynamic from 'next/dynamic'
import { themeContext } from "../pages/_app";
import { useRouter } from "next/router";
import styles from '../styles/styling/signup.module.scss';
import {clsx} from 'clsx';

const Dialog = dynamic(()=>import('@mui/material/Dialog'))
const Checkbox = dynamic(()=>import('@mui/material/Checkbox'))
const VisibilityIcon = dynamic(()=>import('@mui/icons-material/Visibility'))
const VisibilityOffIcon = dynamic(()=>import('@mui/icons-material/VisibilityOff'))
const Navigation = dynamic(()=>import('../components/navig'))



function VerfiyAcc({isUp}){
    if(isUp)
    return(
        <Dialog open={isUp} style={{fontSize:'18px',fontWeight:'400'}}>
          <div style={{padding:'25px'}}>
            Please verify your account so you are able to log in.

            </div>
        </Dialog>

    )
    else{
        return null
    }

}

function WrongUserPass({ error }) {
  if (error) {
    return (
      <div className={styles["errors"]} style={{ color: "red" ,fontSize:'1px',fontWeight:'300'}}>
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
  const redirect = useRouter();
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
      })}
    ,1000)
    return ()=>clearTimeout(usernameData)
  }, [username]);

  let handleChange = (e) => {
    setError('')
    setSignup({
      ...signup,
      [e.target.name]: e.target.value,
    });
  };

  let handleSubmit = (e) => {
    setDisabled(true)
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
          redirect.replace('/')
        },2500)
        

      })
      .catch((e) => {
        let err = e.response.data
        setError(err);
        setDisabled(false)
      });
  };

  function listPasswordErrors(){
    if(innerHtml.password){
    return(
      innerHtml.password.map((index)=>{
        return(
          <div className={styles['errorMsgs']}>{index}</div>
        )
      })
    )
  }
  return null
}

  return (
    <div className={`${styles["signup-page"]} ${clsx({
      [styles.dark]:theme.setChecked,
      [styles.light]:!theme.setChecked
    })}`} >
      <div className={styles['navig-side']}>
        <Navigation></Navigation>
       </div>


       <div className={styles['form-wrapper']}>
      <form
        method="post"
        onSubmit={(e) => handleSubmit(e)}
        autoComplete="off"
        autoCorrect="off"
      >
        <CsrfToken></CsrfToken>
        <div className={`${styles["signup-form"]}
        ${clsx({
          [styles.dark]:theme.setChecked,
          [styles.light]:!theme.setChecked
        })}
         ${styles['btn']}`} >
          <h1>Signup Page</h1>
          <input
            minLength={6}
            maxLength={30}
            required
            type="text"
            name="username"
            className={`${styles["username"]}
            ${clsx({
              [styles.dark]:theme.setChecked,
              [styles.light]:!theme.setChecked
            })}`}
            onChange={(e) => handleChange(e)}
            placeholder="Username"
            value={username}

          ></input>
          <div style={style}>{innerHtml.username}</div>
          <input
            required
            type="email"
            name="email"
            className={`${styles["username"]}
            ${clsx({
              [styles.dark]:theme.setChecked,
              [styles.light]:!theme.setChecked
            })}`}
            onChange={(e) => handleChange(e)}
            placeholder="Email"
            value={email}
          ></input>
          <div style={{color:'red'}}>{error}</div>
          <input
            required
            type={type}
            name="password"
            className={`${styles["username"]}
            ${clsx({
              [styles.dark]:theme.setChecked,
              [styles.light]:!theme.setChecked
            })}`}
            onChange={(e) => handleChange(e)}
            placeholder="Password"
            value={password}
          ></input>
          <Checkbox className={styles['hide-show']} type='checkbox' onChange={(e)=>handleToggle(e)} value={type} icon={<VisibilityIcon style={{color:theme.setChecked?'white':'black'}}/>} checkedIcon={<VisibilityOffIcon/>} />
          <div className={style['errorMsgs']} >{listPasswordErrors()}</div>

          <VerfiyAcc isUp={isUp}></VerfiyAcc>
          <button type="submit" className={`${styles["signupsbmt"]}

          ${clsx({
            [styles.dark]:theme.setChecked,
            [styles.light]:!theme.setChecked
          })}`} disabled={disabled}  >
            {disabled?<div className={theme.setChecked?styles["lds-ring"]:styles['lds-ring-white']}><div></div><div></div><div></div><div></div></div>:'Signup'}
          </button>
          <button  className={`${clsx({
      [styles.dark]:theme.setChecked,
      [styles.light]:!theme.setChecked
    })} ${styles['btn']}`} type='button' style={{border:'none'}} onClick={(e)=>redirect.replace('/login')}>Already have an account?</button>
        </div>
      </form>
      </div>
    </div>
  );
};

export default Signup;

