
import {useEffect,useContext,useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {themeContext} from '../App.js';
import { Dialog} from '@mui/material';
import CsrfToken from './csrf.js';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Editor } from 'react-draft-wysiwyg'
import './react-draft-wysiwyg.css';

import { convertToRaw, AtomicBlockUtils,EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import {stateToHTML} from 'draft-js-export-html';
import {MenuList,MenuItem,Menu,Fade,Button} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import Popper from '@mui/material/Popper';
import { EditProfile } from './userprofile.js';
import createResizeablePlugin from '@draft-js-plugins/resizeable';




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

  function Profile(){
    const {theme,setTheme} = useContext(themeContext)
    const redirect = useNavigate()
    const [current,setCurrent] = useState('')
    let [img,setImage] = useState(null)
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    const redirectLogout = ()=>{
      axios.get('https://backend.globeofarticles.com/logout/',{withCredentials:true}).then((res)=>{
        redirect('/login')
      })

    }
    useEffect(()=>{
        axios.get('https://backend.globeofarticles.com/current/',{withCredentials:true}).then((res)=>{
            setCurrent(res.data)
        })
    },[])




    return(
      <div>
      <Button
        id="fade-button"
        aria-controls={open ? 'fade-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        style={{backgroundColor:theme.setButtonColor}}
        onClick={handleClick}>
          <PersonIcon fontSize='large' style={{backgroundColor:theme.setButtonColor,color:'white'}}></PersonIcon>
      </Button>
        <Menu
        id="fade-menu"

        MenuListProps={{
          'aria-labelledby': 'fade-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
        >
            <MenuItem><button className='l-div' style = {{backgroundColor:theme.setButtonColor,color:theme.setTextColor}} onClick={(e)=>{redirect(`userprofile/${current}/`)}}>My Profile</button></MenuItem>
            <MenuItem><button className='l-div' style = {{backgroundColor:theme.setButtonColor,color:theme.setTextColor}} onClick={(e)=>{redirect(`/userprofile/${current}/edit/`)}}>Settings</button></MenuItem>
            <MenuItem><button onClick={redirectLogout} type='submit' className='l-div' style={{backgroundColor:theme.setButtonColor,color:theme.setTextColor}} >Logout </button></MenuItem>
        </Menu>
        </div>
    )
}

function LoginOrLogout({auth,setAuth}){ //Login Or Logout component
    let redirect = useNavigate()
    let {theme}= useContext(themeContext)
    useEffect(()=>{
        axios.get('https://backend.globeofarticles.com/isauthenticated/',{withCredentials:true},{timeout:2000}).then((res)=>{
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

        axios.get('https://backend.globeofarticles.com/logout/',{withCredentials:true},{headers:{'X-CSRFToken':Cookies.get('csrftoken')}}).then((res)=>{
            
            redirect('/login')
        }).catch((err)=>{
            console.log(err.response.data)
        })
    }

    if(auth){
        return (

            <form method='get' onSubmit={(e)=>handleLogout(e)}>
            <Profile></Profile>

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
    const resizeablePlugin = createResizeablePlugin()
    const plugins = [resizeablePlugin]



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
      .post("https://backend.globeofarticles.com/articles/", formData, {
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

  function uploadImageCallback(file){
    // long story short, every time we upload an image, we
    // need to save it to the state so we can get it's data
    // later when we decide what to do with it.
    
   // Make sure you have a uploadImages: [] as your default state

    const imageObject = {
      file: file,
      localSrc: URL.createObjectURL(file),
    }

    
    // We need to return a promise with the image src
    // the img src we will use here will be what's needed
    // to preview it in the browser. This will be different than what
    // we will see in the index.md file we generate.
    return new Promise(
      (resolve, reject) => {
        resolve({ data: { link: imageObject.localSrc } });
      }
    );
  }

  const insertImage = ( url) => {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
        'IMAGE',
        'IMMUTABLE',
        { src: url },)
const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
const newEditorState = EditorState.set( editorState, { currentContent: contentStateWithEntity });
return AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, '');
};

  useEffect(() => {
    axios
      .get("https://backend.globeofarticles.com/current/",{withCredentials:true})
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
      axios.get('https://backend.globeofarticles.com/verified/',{withCredentials:true}).then((res)=>{
        setVerified(res.data)
      })
    },[isVerified])

    useEffect(() => {
        axios
          .get("https://backend.globeofarticles.com/isauthenticated/", { withCredentials: true })
          .then((res) => {
            setAuth(true)
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
                <label required htmlFor="upload" className="imglbl" alt='Error'>
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
                    science
                  </option>
                </select>
              </div>
              </div>
              <div className='editor-div'>
                <Editor  toolbar={{previewImage:true}}    ref={(element) => element} plugins={plugins} wrapperClassName='editor'  onChange={(e)=>handleText(e)} editorClassName='texteditor'editorState={editorState} onEditorStateChange={setEditorState}></Editor>
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