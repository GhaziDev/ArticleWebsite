
import {useEffect,useContext,useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {themeContext} from '../App.js';
import { Dialog} from '@mui/material';
import CsrfToken from './csrf.js';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Editor, EditorState } from 'react-draft-wysiwyg'
import './react-draft-wysiwyg.css';
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import {stateToHTML} from 'draft-js-export-html';


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
    const [editorState, setEditorState] = useState(() =>
    EditorState?.createEmpty(),
    )


    let [article, setArticle] = useState({
        title: "",
        title_img: "",
        description: "",
        tag: "",
        user: "",
        date: new Date().getDate(),
      });
    let { title, title_img, description, user, tag, date } = article;



    let handleText = (e)=>{
      let html = draftToHtml(convertToRaw(editorState.getCurrentContent()));
      console.log(html)
      setArticle(
        {
          ...article,
          'description':html
        }
      )
      
    } 
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
        <head><meta charset="utf-8" /></head>
        <div className="nav-div-right">
        <div className='nav-div'>
            <button
              id="article-btn"
              onClick={() => handleOpen()}
              style={{ color: theme.setTextColor, backgroundColor: theme.setButtonColor }}
              className="create-button">
              Create Article
            </button>
            <LoginOrLogout auth={auth} setAuth={setAuth} theme={{theme}}
            ></LoginOrLogout>
            </div>
        
        </div>
          <Dialog PaperProps={{
              style:{
                  backgroundColor:theme.setBg,color:theme.setButtonColor}}}  fullWidth={true} maxWidth='lg' open={open} onClose={() => handleClose()} className="dialog">
            <div className='dialog-content'>
            <form method="dialog" onSubmit={(e) => handleSubmit(e)}  style={{backgroundColor:theme.setBg,color:theme.setTextColor}} className='dialog-form'>
              <button onClick={handleClose} style={{backgroundColor:theme.setButtonColor,color:theme.setTextColor,borderRadius:'4px',border:'none'}} className="exit">
                Exit
              </button>
              <CsrfToken />
              <div className='upper-side'>
              <div className="title-img">
                <label required for="upload" className="imglbl" alt='Error'>
                  Upload An Image
                </label>
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
              <div className='title-div'>
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
              </div>

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
              <div className='editor-div'>
                <Editor UploadEnabled wrapperClassName='editor'  onChange={(e)=>handleText(e)} editorClassName='texteditor'editorState={editorState} onEditorStateChange={setEditorState}></Editor>
                </div>
                <div className='artcl-sub-div'>
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
              </div>
              <InvalidImage error={error}></InvalidImage>
            </form>
            </div>
          </Dialog>
        </div>
    );
  }
}


export default DisplayDialogOrAuth;
export {LoginOrLogout}