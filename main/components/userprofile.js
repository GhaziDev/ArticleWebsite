import axios from "axios";
import { useState,useEffect,useContext,createContext } from "react";
import { useParams,useNavigate } from "react-router-dom";
import {themeContext} from '../pages/_app';
import Navigation from "./navig";
import Cookies from "js-cookie";
import Dialog from '@mui/material/Dialog'
import {Filter,ListAllArticles} from './filtertag';
import HOST from "../config.js";
import ReactPaginate from 'react-paginate';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { AuthContext } from "../store/provider.js";
import { useRouter } from "next/router";

function PaginatedItems({ itemsPerPage,articleList,theme}) { //managing items by paginating them.
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = useState(0);
  const [selectedPage,setSelectedPage] = useState();

  // Simulate fetching items from another resources.
  // (This could be items from props; or items loaded in a local state
  // from an API endpoint with useEffect and useState)
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = articleList.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(articleList.length / itemsPerPage);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % articleList.length;
    setItemOffset(newOffset);
  };
  return(
    <>
    <ListAllArticles articles={currentItems} theme={theme} />
    <div className="paginator" >
    <ReactPaginate
      breakLabel="..."
      nextLabel={<ArrowForwardIosIcon></ArrowForwardIosIcon>}
      onPageChange={(e)=>handlePageClick(e)}
      pageRangeDisplayed={5}
      pageCount={pageCount}
      pageClassName="page-item"
      pageLinkClassName="page-link"
      previousClassName="page-item"
      previousLinkClassName="page-link"
      nextClassName="page-item"
      nextLinkClassName="page-link"
      breakClassName="page-item"
      breakLinkClassName="page-link"
      containerClassName="pagination"
      activeClassName="active"
      previousLabel={<ArrowBackIosIcon></ArrowBackIosIcon>}
      renderOnZeroPageCount={null}
      marginPagesDisplayed={2}
    />
    </div>
  </>
  )
}


export function EditProfile({username}){
  const [profileInfo,setProfileInfo] = useState({'img':'','bio':''})
  const [open,setOpen] = useState(false)
  const [userField,setUserField] = useState(false)
  const [user,setUser] = useState()
  const [error,setError] = useState(null)
  const [isUpdated,setIsUpdated] = useState(0)

  const {bio,img} = profileInfo

  const {theme} = useContext(themeContext) //consuming the context
  const redirect = useRouter('/')
  useEffect(()=>{
    axios.get(`${HOST}userprofile/${username}/`).then((res)=>{
        setProfileInfo({
          bio:res.data.bio,
          img:res.data.img
        })
        console.log(res.data.img)

    }).catch((e)=>{
    })
},[isUpdated])
   const handleChange = (e,value)=>{
    setProfileInfo({
      ...profileInfo,
      [e.target.name]:value
    })

   }



   const handleUserChange = (e)=>{
    setUser(
      e.target.value
    )
   }
   const submitUsernameCheck = (e)=>{
    e.preventDefault()
    axios.delete(`${HOST}userprofile/${username}/${user}/`,{withCredentials:true,headers:{'X-CSRFToken':Cookies.get('csrftoken')}}).then((res)=>{
      redirect.replace('/login')

    }).catch((e)=>{
      setError(e.response.data)


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
      setOpen(false)
      setIsUpdated(isUpdated+1)
    }).catch((e)=>{
    })
   }

   let handleImageRemove = (e)=>{
    setProfileInfo({
      ...profileInfo,img:''
    })
   }


  return(
    <div>
    <button onClick={(e)=>setOpen(true)} style={{backgroundColor:theme.setButtonColor,color:theme.setColor}}  className='ll-div'>
    <Dialog className='dialog-div' open={open} onClose={(e)=>setOpen(false)} width='xl' >
    <form id='Form2' method='delete' onSubmit={(e)=>submitUsernameCheck(e)}/>

    <div className='edit-profile-div' style={{backgroundColor:theme.setBg,color:theme.setTextColor}}>
      
      <form onSubmit={(e)=>{e.preventDefault() 
        setOpen(false)}} className='back-btn-form' >
      <button  type='cancel' className='back-btn'>&larr;</button>
      </form>
      <h1 style={{textAlign:'center'}}>Edit Your Profile</h1>
        <form method='put' id='Form1' className='edit-profile-form' onSubmit={(e)=>submitChange(e)} style={{backgroundColor:theme.setBg,color:theme.setColor,}}>
          <div className='edit-img-div'>
        
          <img src={img} className='edit-img'></img>
        <div className='edit-img-sub-div'>
          <h3>Update Your Profile Picture</h3>
          <label className='imglbl' htmlFor='upload'>Upload a Photo</label>
          <input form='Form1' id='upload' type='file' name='img'  onChange={(e)=>handleChange(e,e.target.files[0])} className='img0' ></input>
          <div onClick={(e)=>handleImageRemove(e)}  className='remove-pfp'>Remove Profile Picture</div>

          </div>

          </div>

          <div className='edit-bio-div'>
          BIO
          <input form='Form1' className='bio-inp' name='bio' value={bio} onChange={(e)=>handleChange(e,e.target.value)} style={{backgroundColor:theme.setButtonColor,color:theme.setTextColor}}></input>
          Account Deletion
          <button  className='delete-btn' type="button" onClick={(e)=>setUserField(!userField)} name='bio' value={bio} style={{backgroundColor:theme.setButtonColor,color:theme.setTextColor}}>Delete Account</button>
          
          {userField?
          <div className='deletion-section'>
          <input form='Form2' required onChange={(e)=>handleUserChange(e)} placeholder='Enter your username' value={user} className='bio-inp'  name='password' style={{backgroundColor:theme.setButtonColor,color:theme.setTextColor}} ></input>
          <div className='txt'>By Pressing Cofirm you aknowledge that you can't retrieve your account back</div>
          <input form='Form2' type='submit' className='delete-confirm' value='Confirm' ></input>
          <div>{error}</div>
          </div>
          :null}

          
          </div>


         <div className='submission-btn-div'>
          <input type='submit' form='Form1' value='Submit Change'  className='submission-btn'  style={{backgroundColor:theme.setButtonColor,color:theme.setColor}}></input>
          </div>
        </form>
    </div>
    </Dialog>
    Settings
    </button>
    </div>
  )

  




}


function SwitchArticles({articleList,btn1,btn2,likedArticlesList,theme}){
  console.log(btn1)
  console.log(btn2)

  if(btn1 && !btn2){
    console.log("here")
    return(
    <div className="parent-grid" >
    <PaginatedItems articleList={articleList} theme={theme} itemsPerPage={4} />
</div>
    )
  }
  else if(btn2 && !btn1){
    console.log("here")
    return(
      <div className="parent-grid" >
      <PaginatedItems articleList={likedArticlesList} theme={theme} itemsPerPage={4} />

</div>
    )
  }

  else{
    console.log("here")
    return(
      <div className="parent-grid" >
        <PaginatedItems articleList={articleList} theme={theme} itemsPerPage={4} />
      </div>
    )
    }

  }



function UserProfile(){
    const articleContext = createContext()
    const {theme} = useContext(themeContext) //consuming the context
    let {user} = useParams()
    let [userInfo,setUserInfo] = useState({'user':'','user_posts':[],'img':null,bio:''})
    let [isHidden,setIsHidden] = useState(false)
    let [btnState,setBtnState] = useState({'btn1':true,'btn2':false})
    let {username,user_posts,bio,img} = userInfo
    let [selection,setSelection] = useState('')
    let [articleList,setArticleList] = useState([])
    let [likedArticlesList,setLikedArticlesList] = useState([])
    let {isAuth} = useContext(AuthContext)
    let redirect = useNavigate()
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
      axios.get(`${HOST}liked_articles/${user}/`).then((res)=>{
        console.log(res.data)
        setLikedArticlesList(res.data)
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


    const handleBtnSwitch = (e)=>{
      if(e.target.value==='btn1'){
        setBtnState({'btn1':true,'btn2':false})
      }
      else{
        setBtnState({'btn1':false,'btn2':true})
      }
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

          <Navigation></Navigation>
          

          <div className='userinfo-div-wrapper'>
          <div className='userinfo-div' style={{backgroundColor:theme.setButtonColor}}>
            <form method='post' onSubmit={(e)=>handleSubmit(e)}>
            <div className='img-div'>
            <img className='the-img' src={img}  />
            </div>
            <h1 >{user}</h1>
            <h3>{bio}</h3>
            </form>

             </div>

             </div>

             <div className='main' style={{ backgroundColor: theme.setBg, color: theme.setTextColor}}>
             <Filter isHiddenInput={true} setArticleList={setArticleList} user={user}></Filter>
             <div className='switch-btns'>
             <button style={{backgroundColor:theme.setButtonColor,borderColor:btnState.btn1?theme.setTextColor:theme.setBg,color:theme.setTextColor}} className='switch-btn1' value={'btn1'} onClick={(e)=>{handleBtnSwitch(e)}}>{user}'s Articles</button>
             <button style={{backgroundColor:theme.setButtonColor,borderColor:btnState.btn2?theme.setTextColor:theme.setBg,color:theme.setTextColor}} className='switch-btn2' value={'btn2'} onClick={(e)=>{handleBtnSwitch(e)}}>Favorites</button>
             </div>
             <SwitchArticles theme={theme} articleList={articleList} likedArticlesList={likedArticlesList} btn1={btnState.btn1} btn2 ={btnState.btn2}></SwitchArticles>


      <div className='footer-container'>
      </div>
      </div>
            
        </div>
    )

}

export default UserProfile;
