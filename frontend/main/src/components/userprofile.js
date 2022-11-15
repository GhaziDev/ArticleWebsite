import axios from "axios";
import { useState,useEffect,useContext,createContext } from "react";
import { useParams,Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {themeContext} from '../App.js';
import {cyanDark} from '@radix-ui/colors';
import Footer from './footer.js'
import Navigation from "./navig";
import Cookies from "js-cookie";
import {Dialog} from '@mui/material'
import {faHome} from "@fortawesome/free-solid-svg-icons";
import {Filter,ListAllArticles} from './filtertag';
import HOST from "../config.js";

export function EditProfile({username}){
  const [profileInfo,setProfileInfo] = useState({'img':'','bio':''})
  const articleContext = createContext()
  const [open,setOpen] = useState(false)
  const {bio,img} = profileInfo

  const {theme} = useContext(themeContext) //consuming the context
  const {user} = useParams()
  const redirect = useNavigate('/')
  useEffect(()=>{
    axios.get(`${HOST}userprofile/${username}/`).then((res)=>{
        setProfileInfo({
          bio:res.data.bio,
          img:res.data.img
        })

    }).catch((e)=>{
    })
},[])
   const handleChange = (e,value)=>{
    setProfileInfo({
      ...profileInfo,
      [e.target.name]:value
    })

   }
   const submitChange = (e)=>{
    e.preventDefault()
    let formData= new FormData()
    formData.append('user',username)
    formData.append('bio',bio)
    if(!(typeof img=="string")){
      formData.append('img',img)

    }
    axios.put(`${HOST}userprofile/${username}/`,formData,{withCredentials:true,headers:{'X-CSRFToken':Cookies.get('csrftoken')}}).then((res)=>{
      redirect(`/userprofile/${username}`)
    }).catch((e)=>{
    })
   }

  return(
    <div>
    <button onClick={(e)=>setOpen(true)} style={{backgroundColor:theme.setButtonColor,color:theme.setColor}} className='ll-div'>
    <Dialog open={open} onClose={(e)=>setOpen(false)} width='xl' >
      
    <div className='edit-profile-div' style={{backgroundColor:theme.setBg,color:theme.setTextColor,}}>
      <h1 style={{textAlign:'center'}}>Edit Your Profile</h1>
        <form method='put'  onSubmit={(e)=>submitChange(e)} style={{backgroundColor:theme.setBg,color:theme.setColor,}}>
          BIO
          <input  className='bio-inp' name='bio' value={bio} onChange={(e)=>handleChange(e,e.target.value)} style={{backgroundColor:theme.setButtonColor,color:theme.setTextColor}}></input>
          Profile Picture
          <img src={img} className='edit-img'></img>
          <input type='file' name='img'  onChange={(e)=>handleChange(e,e.target.files[0])} ></input>
          <button type='submit' style={{backgroundColor:theme.setButtonColor,color:theme.setColor}}>Submit changes</button>
        </form>
    </div>
    </Dialog>
    Settings
    </button>
    </div>
  )

  




}

function UserProfile(){
    const articleContext = createContext()
    const {theme} = useContext(themeContext) //consuming the context
    let {user} = useParams()
    let [userInfo,setUserInfo] = useState({'user':'','user_posts':[],'img':null,bio:''})
    let [isHidden,setIsHidden] = useState(false)

    let {username,user_posts,bio,img} = userInfo
    let [selection,setSelection] = useState('')
    let [articleList,setArticleList] = useState([])
    useEffect(()=>{
      axios.get(`${HOST}current/`,{withCredentials:true}).then((res)=>{
        if(res.data.user===username){
          setIsHidden(false)
        }
        else{
          setIsHidden(true)
        }
  
      })
    },[])


    useEffect(()=>{
      axios.get(`${HOST}userprofile/${user}/`).then((res)=>{
          setUserInfo({
            username:res.data.user,
            user_posts:[
              ...res.data.user_posts
            ],
            bio:res.data.bio,
            img:res.data.img
          })


      }).catch((e)=>{
      })
  },[])


    const handleChange = (e)=>{
      setSelection(e.target.value)
    }

    const handleSubmit = (e)=>{
      e.preventDefault()
      let formData = new FormData()
      formData.append('img',img)
      formData.append('bio',bio)
      axios.put(`${HOST}userprofile/${user}/`,formData,{withCredentials:true,headers:{'X-CSRFToken':Cookies.get('csrftoken')}}).then((res)=>{

      })
    }

    return(
        <div className='profile-div' style={{backgroundColor:theme.setBg,color:theme.setColor}}>
          <articleContext.Provider value={user_posts}>
          <Navigation></Navigation>
          </articleContext.Provider>
          <div className='userinfo-div-wrapper'>
          <div className='userinfo-div' style={{backgroundColor:theme.setButtonColor}}>
            <form method='post' onSubmit={(e)=>handleSubmit(e)}>
            <div className='img-div'>
            <img className='the-img' src={img} />
            </div>
            <h1 >{user}</h1>
            <h3>{bio}</h3>
            </form>

             </div>

             </div>

             <div className='main' style={{ backgroundColor: theme.setBg, color: theme.setTextColor}}>
             <Filter isHiddenInput={true} setArticleList={setArticleList} user={user}></Filter>
             <div className="parent-grid" >
        <ListAllArticles
          articles={articleList}
          theme={theme}
  
        />

      </div>

      <div className='footer-container'>
      <Footer ></Footer>
      </div>
      </div>
            
        </div>
    )

}

export default UserProfile;
