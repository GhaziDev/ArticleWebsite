
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
import LoginIcon  from '@mui/icons-material/Login'
import CreateIcon from '@mui/icons-material/Create';
import HOST from '../config.js'

const host = HOST



function DisplayDialogOrLogin(){
  let [disabled,setDisabled] = useState(false)
    let [error,setError] = useState('')
    let [auth, setAuth] = useState(true);
    const {theme} = useContext(themeContext)
    let [isVerified,setVerified] = useState(false)
    let [tagList,setTagList] = useState([])
    const [editorState, setEditorState] = useState(() =>
    EditorState?.createEmpty(),
    )
    const resizeablePlugin = createResizeablePlugin()
    const plugins = [resizeablePlugin]
    const redirect = useNavigate()



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
    axios.post(`${host}articles/`, formData, {
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


  useEffect(()=>{
    axios.get(`${HOST}tags/`).then((res)=>{
      setTagList(res.data)
    })
  },[])


  useEffect(() => {
    axios
      .get(`${host}current/`,{withCredentials:true})
      .then((res) => {
        setArticle({
          ...article,
          user: res.data.user,
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
      axios.get(`${host}verified/`,{withCredentials:true}).then((res)=>{
        setVerified(res.data)
      })
    },[isVerified])

    useEffect(() => {
        axios
          .get(`${host}isauthenticated/`, { withCredentials: true })
          .then((res) => {
            setAuth(true)
          })
          .catch((e) => {
            setAuth(false);
          });
      }, []);
    return(
      <div className='create-article-wrapper'>
      <div className='create-article-div' style={{backgroundColor:theme.setButtonColor}}>
      <button className='create-article-input' onClick={auth?(e)=>setOpen(true):(e)=>redirect('/login')} placeholder='Create an Article' >Create An Article</button>
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
        <div className='title-div'>
        <CharsLeft
          chars={title.length}
          handleCount={handleCount}
        ></CharsLeft>
        <input
          minLength={20}
          maxLength={60}
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

        <div className="tag">
          <select style={{color:theme.setColor,backgroundColor:theme.setButtonColor}}
            default="select a tag"
            name="tag"
            className="tag-sel"
            required
            onChange={(e) => handleChange(e.target.name, e.target.value)}
          >
            <option default='Select A Tag' value=''>Select A Tag</option>
            {tagList.map((tag)=>{
              return(
                
                <option name='tag' value={tag} className='tag-btn' onClick={(e)=>handleChange(e.target.name, e.target.value)}>{tag}</option>
              )
            })}
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
          <span>{disabled?<div class="lds-ring"><div></div><div></div><div></div><div></div></div>:'Post'}</span>
        </button>
        </div>
        <InvalidImage error={error}></InvalidImage>
      </form>
      </div>
    </Dialog>
    </div>
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

  function Profile(){
    const {theme,setTheme} = useContext(themeContext)
    const redirect = useNavigate()
    const [current,setCurrent] = useState('')
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    const redirectLogout = ()=>{
      axios.get(`${host}logout/`,{withCredentials:true}).then((res)=>{
        redirect('/login')
      })

    }
    useEffect(()=>{
        axios.get(`${host}current/`,{withCredentials:true}).then((res)=>{
            setCurrent(res.data)
          
            })     
        },[])




    return(
      <span className='right-btns'>
      <Button
        id="fade-button"
        aria-controls={open ? 'fade-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        style={{backgroundColor:theme.setBg,paddingBottom:'10px',borderRadius:'50%'}}
        onClick={handleClick}>
          <img className='profile-img' src={current.img}/>
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
            <MenuItem><button className='ll-div' style = {{backgroundColor:theme.setButtonColor,color:theme.setTextColor}} onClick={(e)=>{redirect(`/userprofile/${current.user}/`)}}>My Profile</button></MenuItem>
            <MenuItem><EditProfile username={current.user} className='ll-div' style = {{backgroundColor:theme.setButtonColor,color:theme.setTextColor}}>Settings</EditProfile></MenuItem>
            <MenuItem><button onClick={redirectLogout} type='submit' className='ll-div' style={{backgroundColor:theme.setButtonColor,color:theme.setTextColor}} >Logout </button></MenuItem>
        </Menu>
        </span>
    )
}


function LoginOrLogout(){ //Login Or Logout component
    let redirect = useNavigate()
    let {theme}= useContext(themeContext)
    let [auth,setAuth] = useState(false)



    useEffect(()=>{
        axios.get(`${host}isauthenticated/`,{withCredentials:true}).then((res)=>{
            setAuth(true)
            return ()=>{
              setAuth(auth)
            }
        }).catch((e)=>{
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

        axios.get(`${host}logout/`,{withCredentials:true},{headers:{'X-CSRFToken':Cookies.get('csrftoken')}}).then((res)=>{
          setAuth(false)
            setTimeout(()=>{
              redirect('/login')
            }
            ,2000)
            
        }).catch((err)=>{
            console.log(err.response.data)
        })
    }

    if(auth){
        return (
          <div className='right-div'>
            <form method='get' onSubmit={(e)=>handleLogout(e)}>
            <Profile></Profile>

            </form>
            </div>
        )

    }
    return(
      <div className='right-div'>
            <div className='l-div' style={{color:theme.setTextColor}} onClick={()=>handleRedirectLogin()}>Login</div>
            <div onClick = {()=>handleRedirectSignUp()} style={{color:theme.setTextColor}} className='l-div'>Signup</div>
            </div>
        )

}





export {LoginOrLogout,DisplayDialogOrLogin}