import axios from "axios";
import { useState,useEffect,useContext,createContext } from "react";
import { useParams,Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {ListAllArticles} from './articles'
import {themeContext} from '../App.js';
import {cyanDark} from '@radix-ui/colors';
import Footer from './footer.js'
import Navigation from "./navig";
import Cookies from "js-cookie";
import {Dialog} from '@mui/material'
import {faHome} from "@fortawesome/free-solid-svg-icons";


export function EditProfile(){
  const [profileInfo,setProfileInfo] = useState({'img':'','bio':''})
  const articleContext = createContext()

  const {bio,img} = profileInfo

  const {theme} = useContext(themeContext) //consuming the context
  const {user} = useParams()
  const redirect = useNavigate('/')
  useEffect(()=>{
    axios.get(`https://backend.globeofarticles.com/userprofile/${user}/`).then((res)=>{
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
    formData.append('user',user)
    formData.append('bio',bio)
    formData.append('img',img)
    axios.put(`https://backend.globeofarticles.com/userprofile/${user}/`,formData,{withCredentials:true,headers:{'X-CSRFToken':Cookies.get('csrftoken')}}).then((res)=>{
      redirect(`/userprofile/${user}`)
    }).catch((e)=>{
    })
   }

  return(
    <div className='edit-profile-div' style={{backgroundColor:theme.setBg,color:theme.setColor}}>
             <button  className='top-left'  style={{backgroundColor:'white'}} onClick={()=>redirect('/')}><FontAwesomeIcon icon={faHome}></FontAwesomeIcon></button>

        <form method='put'  onSubmit={(e)=>submitChange(e)}>
          BIO:
          <input  className='bio-inp' name='bio' value={bio} onChange={(e)=>handleChange(e,e.target.value)} style={{backgroundColor:theme.setBg}}></input>
          Profile Picture:
          <img src={img} style={{width:'300px',height:'300px'}}></img>
          <input type='file' name='img'  onChange={(e)=>handleChange(e,e.target.files[0])} ></input>
          <button type='submit' style={{backgroundColor:theme.setButtonColor,color:theme.setColor}}>Submit changes</button>
        </form>
    </div>
  )

  




}

function UserProfile(){
    const articleContext = createContext()
    const {theme} = useContext(themeContext) //consuming the context
    let {user} = useParams()
    let [userInfo,setUserInfo] = useState({'username':'','user_posts':[],'img':null,bio:''})
    let [isHidden,setIsHidden] = useState(false)
    let {username,user_posts,bio,img} = userInfo
    let [selection,setSelection] = useState('')

    const listUserArticles = (selector)=>{
        const bc = theme === cyanDark.cyan1 ? cyanDark.cyan6 : "white"
        const tagColor = theme === cyanDark.cyan1 ? cyanDark.cyan11 : cyanDark.cyan12
        let articles = user_posts.filter((post)=>post.tag==selector)
        if(articles.length===0){
          articles = user_posts
        }
        return(
        articles.map((post)=>{
            return(
                    <div
                      className="user-artcls"
                      style={{ backgroundColor: theme.setButtonColor, borderColor: bc, color: theme.setColor}}
                    >
                      <Link
                        to={{
                          pathname: `/article/${post.id}/`,
                        }}
                      >
                        <img src={post.title_img}  alt='img' className="image" />
                        <h4 className="title"  style={{color:theme.setColor}}>
                          {post.title}
                        </h4>
                        <h4 className="user" style={{color:theme.setColor}} >
                          {" "}
                          <FontAwesomeIcon icon="fa-solid fa-user" /> {post.user}
                        </h4>
                        <h4 className="date" style={{ color: theme.setColor }}>
                          <FontAwesomeIcon icon="fa-solid fa-calendar" /> {post.date}
                        </h4>
                        <button className="tag-sec" disabled>
                          <h4 style={{ color: tagColor }}>{post.tag}</h4>
                        </button>
                      </Link>
                    </div>
            )

        })
        )
    }


    useEffect(()=>{
      axios.get('https://backend.globeofarticles.com/current/',{withCredentials:true}).then((res)=>{
        if(res.data===username){
          setIsHidden(false)
        }
        else{
          setIsHidden(true)
        }
  
      })
    },[])


    useEffect(()=>{
      axios.get(`https://backend.globeofarticles.com/userprofile/${user}/`).then((res)=>{
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
      axios.put(`https://backend.globeofarticles.com/userprofile/${user}/`,formData,{withCredentials:true,headers:{'X-CSRFToken':Cookies.get('csrftoken')}}).then((res)=>{

      })
    }

    return(
        <div className='profile-div' style={{backgroundColor:theme.setBg,color:theme.setColor}}>
          <articleContext.Provider value={user_posts}>
          <Navigation></Navigation>
          </articleContext.Provider>
          <div className='userinfo-div' style={{backgroundColor:theme.setButtonColor}}>
            <form method='post' onSubmit={(e)=>handleSubmit(e)}>
            <div className='img-div'>
            <img className='the-img' src={img} />
            </div>
            <h1 >{user}</h1>
            <h3>{bio}</h3>
            </form>
             </div>
             
            <div className='user-post-section-div'>
              <select  className='tag-sel' onChange={(e)=>handleChange(e)} style={{backgroundColor:theme.setButtonColor,color:theme.setColor}} >
                <option default value='choose an option'>choose a tag option...</option>
                <option value='programming'>programming</option>
                <option value='science'>science</option>
              </select>
              <div className='user-articles'>
                {listUserArticles(selection)}
                </div>
            </div>
            <Footer></Footer>

            
        </div>
    )

}

export default UserProfile;
