import axios from "axios";
import Cookies from "js-cookie";
import { React, useState, useEffect } from "react";
import { Dialog } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

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
  const [pass, setPass] = useState({
    display: "none",
    color: "red",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  });
  const [innerHtml, setInnerHtml] = useState("");
  const [isUp,setIsUp] = useState(false)
  const [disabled,isDisabled] = useState(false)
  const { username, email, password } = signup;
  const redirect = useNavigate();
  const [error, setError] = useState("");
  useEffect(() => {
    axios
      .post("https://backend.globeofarticles.com/exists/", { username: username })
      .then((res) => {
        setExist({
          ...exist,
          display: "flex",
          color: "yellowgreen",
        });
        setInnerHtml(res.data);
      })
      .catch((e) => {
        if (username.trim().length === 0) {
          setExist({
            ...exist,
            display: "none",
          });
        } else {
          setExist({
            ...exist,
            display: "flex",
            color: "red",
          });
          setInnerHtml(e.response.data);
        }
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
        isDisabled(true)
        setIsUp(true)
        setTimeout(()=>{setIsUp(false)
        redirect('/')},5000)
        

      })
      .catch((e) => {
        let err = e.response.data
        setError(err);
      });
  };

  return (
    <div className="signup-page">
      <form
        method="post"
        onSubmit={(e) => handleSubmit(e)}
        autoComplete="off"
        autoCorrect="off"
      >
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
          <div style={exist}>{innerHtml}</div>
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
            type="password"
            name="password"
            className="password-inp"
            onChange={(e) => handleChange(e)}
            placeholder="Password"
            value={password}
          ></input>
          <VerfiyAcc isUp={isUp}></VerfiyAcc>
          <WrongUserPass error={error}></WrongUserPass>
          <button type="submit" className="signupsbmt" disabled={disabled}>
            Signup
          </button>
          <Link to="/login">Already have an account?</Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;
