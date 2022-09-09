
import {useEffect,useContext,useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {themeContext} from '../App.js';
import { Dialog, TextField, TextareaAutosize, CreateMUIStyled } from '@mui/material';
import {makeStyles} from '@mui/styles'
import CsrfToken from './csrf.js';
import axios from 'axios';
import Cookies from 'js-cookie';
import { text } from '@fortawesome/fontawesome-svg-core';



function TextFormat({format,setFormat,modifyText,setModifyText}){
  //default font weight is 400
  //bold font weight is 700
  let {underline,italic,bold} = format
  let handleChange = (e)=>{

    if(e.target.value==='bold'){
      setFormat({
        ...format,
        'bold':!bold
      })
      if(e.target.checked){
        console.log("this is bold")
        setModifyText(
          {
          ...modifyText,
          fontWeight:700
          }
          
        )
      }
      else{
        console.log("this is not bold")
        setModifyText(
          {
          ...modifyText,
          fontWeight:400
          }
          
        )
      }
      }
    if(e.target.value==='italic'){
      setFormat({
        ...format,
        'italic':!italic
      })
      if(e.target.checked){
        setModifyText(
          {
          ...modifyText,
          fontStyle:'italic'
          }
          
        )
      }
      else{
        setModifyText(
          {
          ...modifyText,
          fontStyle:'none'
          }
          
        )
      }

    }
    if(e.target.value==='underline'){
      setFormat({
        ...format,
        "underline":!underline
      })
      if(e.target.checked){
        setModifyText(
          {
          ...modifyText,
          textDecoration:"underline"
          }
          
        )

      }
      else{
        setModifyText(
          {
          ...modifyText,
          textDecoration:'none'
          }
          
        )
      }
    }
  }

  return(
    <div className='format' style={{backgroundColor:'white'}}>
      <input type='checkbox' name='bold'  checked ={bold} value ='bold' onChange={(e)=>handleChange(e)}>
      </input>
      <input type='checkbox' name='italic'  checked ={italic} value = 'italic' onChange={(e)=>handleChange(e)}>
      </input>
      <input type='checkbox' name='underline'  checked = {underline} value = 'underline' onChange={(e)=>handleChange(e)}>
      </input>
    </div>
  )



 
}


function InvalidImage({error}){
  if(error){
    return(
      <div className='imgerror' style={{color:'red'}}>
        {error}
      </div>
    )
  }
  return null
}

function CharsLeft({ chars, handleCount}) {
    const {theme} = useContext(themeContext)
   
    if (chars > 60) {
      return (
        <div
          value={chars}
          onChange={(e) => handleCount(e)}
          style={{ color: "red" }}
        >
          {chars} characters over
        </div>
      );
    }
    return (
      <div
      className='chars'
        value={chars}
        onChange={(e) => handleCount(e)}
        style={{ color: theme.setColor }}
      >
        Characters left : {60 - chars}
      </div>
    );
  }



function LoginOrLogout({auth,setAuth}){ //Login Or Logout component
    let redirect = useNavigate()
    let {theme}= useContext(themeContext)
    useEffect(()=>{
        axios.get('http://127.0.0.1:8000/isauthenticated/',{withCredentials:true},{timeout:2000}).then((res)=>{
            setAuth(true)
        }).catch((e)=>{
            console.log(e.response.data)
            setAuth(false)
        }
        )

    },[auth])

    let handleRedirectLogin = ()=>{
        redirect('/login')
    }

    let handleRedirectSignUp = ()=>{
        redirect('/signup')
    }

    let handleLogout= (e)=>{
        e.preventDefault()

        axios.get('http://127.0.0.1:8000/logout/',{withCredentials:true},{headers:{'X-CSRFToken':Cookies.get('csrftoken')}}).then((res)=>{
            
            redirect('/login')
        }).catch((err)=>{
            console.log(err.response.data)
        })
    }

    if(auth){
        return (

            <form method='get' onSubmit={(e)=>handleLogout(e)}>
            <button  type='submit' className='l-div' style={{backgroundColor:theme.setButtonColor,color:theme.setTextColor}} >Logout </button>
            </form>
        )

    }
    return(
            <div className='nav-div'>
            <button className='l-div' style={{backgroundColor:theme.setButtonColor,color:theme.setTextColor}} onClick={()=>handleRedirectLogin()}>Login</button>
            <div className='breaker'>
            <button onClick = {()=>handleRedirectSignUp()} style={{backgroundColor:theme.setButtonColor,color:theme.setTextColor}} className='l-div'>Signup</button>
            </div>
            </div>
        )

}



function DisplayDialogOrAuth() {
    const {theme} = useContext(themeContext)
    const redirect = useNavigate()
    
    let [isVerified,setVerified] = useState(false)
    let [disabled,setDisabled] = useState(false)
    let [error,setError] = useState('')
    let [auth, setAuth] = useState(true);
    let [article, setArticle] = useState({
        title: "",
        title_img: "",
        description: "",
        tag: "",
        user: "",
        date: new Date().getDate(),
      });
    let [modifyText,setModifyText] = useState({fontWeight:'400',textDecoration:'none',fontStyle:'none'})
    let [format,setFormat] = useState({'bold':false,'italic':false,'underline':false})
    let {fontWeight,textDecoration,fontStyle} = modifyText
    let { title, title_img, description, user, tag, date } = article;
  let handleSubmit = (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("title_img", title_img);
    title = title.split(" ");
    let newTitle = title.map((string) => {
      return string[0]?.toUpperCase() + string.slice(1);
    });
    newTitle = newTitle.join(" ");
    formData.append("title", newTitle);
    formData.append("user", user);
    formData.append("tag", tag);
    formData.append("description", description);
    formData.append("date", date);
    axios
      .post("http://127.0.0.1:8000/articles/", formData, {
        withCredentials: true,
        headers: { "X-CSRFToken": Cookies.get("csrftoken") },
      })
      .then((res) => {
        redirect(`/article/${res.data}`)
      })
      .catch((e) => {
        setError(e.response.data)


      });
  };

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/current/",{withCredentials:true})
      .then((res) => {
        setArticle({
          ...article,
          user: res.data,
        });
      });
  },[]);
    
    const [open, setOpen] = useState(false);
  
    let handleOpen = () => {
      setOpen(true);
    };
    let handleClose = () => {
      setOpen(false);
    };

    function handleChange(key, theContent) {
        setArticle({
          ...article,
          [key]: theContent,
        });
        if(key==='tag' && (theContent==='Select A Tag' || theContent === '')){
            setDisabled(true)
    
    
        }
        else{
            setDisabled(false)
        }
      }
  
    let [disp, setDisp] = useState({ display: "none" });
    let handleCount = (e) => {
      return e.target.value.length;
    };
  
    useEffect(()=>{
      axios.get('http://127.0.0.1:8000/verified/',{withCredentials:true}).then((res)=>{
        setVerified(res.data)
      })
    },[isVerified])

    useEffect(() => {
        axios
          .get("http://127.0.0.1:8000/isauthenticated/", { withCredentials: true })
          .then((res) => {
          })
          .catch((e) => {
            console.log(e.response.data);
            setAuth(false);
          });
      }, []);
    
    if (!auth) {
      return (
          <div className="article-div">
        <div className="nav-div-right">
          <div className="space-div">
  
            <LoginOrLogout auth={auth} setAuth={setAuth} 
            ></LoginOrLogout>
          </div>
        </div>
        </div>
      );
    }
    if(auth && !isVerified){
      return(
        <div className='article-div'>
        <div className='nav-div-right' >
          <div className='space-div'>
          Check your inbox to verify your account
          <LoginOrLogout auth={auth} setAuth={setAuth}
            ></LoginOrLogout>
            </div>
        </div>
        </div>
      )
    }
    else{
    return (
      <div className="article-div">
        <div className="nav-div-right">
        <div className='nav-div'>
            <button
              id="article-btn"
              onClick={() => handleOpen()}
              style={{ color: theme.setTextColor, backgroundColor: theme.setButtonColor }}
              className="create-button"
            >
              Create Article
            </button>
            <LoginOrLogout auth={auth} setAuth={setAuth} theme={{theme}}
            ></LoginOrLogout>
            </div>
        
        </div>
        <div className="toggle-div" id="tdiv" style={{ display: disp.display,backgroundColor:theme.setBg,color:theme.setTextColor}}>
          <Dialog PaperProps={{
              style:{
                  backgroundColor:theme.setBg,color:theme.setButtonColor
  
              }
          }}  fullWidth={true} maxWidth='lg' open={open} onClose={() => handleClose()} className="dialog">
             <div className='dialog-content'>
            <form method="dialog" onSubmit={(e) => handleSubmit(e)} id="subart" style={{backgroundColor:theme.setBg,color:theme.setTextColor}}>
              <button onClick={handleClose} style={{backgroundColor:theme.setButtonColor,color:theme.setTextColor,borderRadius:'4px',border:'none'}} className="exit">
                Exit
              </button>
              <CsrfToken />
              <CharsLeft
                chars={title.length}
                handleCount={handleCount}
              ></CharsLeft>
  
              <input
                minLength={20}
                maxLength={50}
                required
                name="title"
                type="text"
                value={title}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
                className="title-inp"
                placeholder="Insert your Title"
                style={{backgroundColor:theme.setBg,color:theme.setTextColor}}
              ></input>
  <div className="title-img">
              <div class="divlbl">
                <label required for="upload" className="imglbl" alt='Error'>
                  Upload An Image
                </label>
              </div>
              <input
              className='img0'
                id="upload"
                required
                type="file"
                name="title_img"
                accept="image/*"
                onChange={(e) => handleChange(e.target.name, e.target.files[0])}
              ></input>
              </div>
                <TextField
                multiline={true}
                inputProps={{minLength:4000,style:{backgroundColor:theme.setButtonColor,color:theme.setTextColor,width:'600px',whiteSpace:'pre-wrap',textDecoration:textDecoration,fontStyle:fontStyle,fontWeight:fontWeight}}}
                maxRows={7}
                  required
                  name="description"
                  value={description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Write a description"
                ></TextField>
  
              <div className='bottom'>
              <button
                type="submit"
                id="confirmBtn"
                value="default"
                className="article-submit"
                style={{backgroundColor:theme.setButtonColor,color:theme.setTextColor}}
                disabled={disabled}
              >
                <span>Post</span>
              </button>
              <div className="tag">
                <select
                  default="select a tag"
                  name="tag"
                  className="tag-sel"
                  required
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                >
                  <option value='' default="select a tag">Select A tag</option>
                  <option value='programming' name="tag">
                    programming
                  </option>
                  <option value='science'  name="tag">
                    another tag
                  </option>
                </select>
              </div>

              </div>
              <InvalidImage error={error}></InvalidImage>
              
            </form>
            </div>
          </Dialog>
        </div>
      </div>
    );
  }
}


export default DisplayDialogOrAuth;
export {LoginOrLogout}