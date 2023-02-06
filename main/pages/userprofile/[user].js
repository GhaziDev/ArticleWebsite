import axios from "axios";
import React,{ useState,useEffect,useContext,createContext } from "react";


import {themeContext} from '../../pages/_app';
import Navigation from "../../components/navig";
import Cookies from "js-cookie";
import {Dialog} from '@mui/material'
import ListAllArticles,{Filter} from '../../components/filtertag';
import HOST from "../../config.js";
import ReactPaginate from 'react-paginate';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { AuthContext } from "../../store/provider.js";
import { useRouter } from "next/router";
import styles from '../../styles/styling/App.module.css'



export async function getStaticPaths(){
  try{
    const res = await fetch(`${HOST}userprofile/`)
    const profiles = await res.json()
    const paths = profiles.map((profile)=>{
      return(
      {params:{user:profile.user}}
      )
    })

    return {paths,fallback:false}


  }
  catch(err){
    return {paths:[],fallback:false}
  }
}


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
    <div className={styles["paginator"]} >
    <ReactPaginate
      breakLabel="..."
      nextLabel={<ArrowForwardIosIcon></ArrowForwardIosIcon>}
      onPageChange={(e)=>handlePageClick(e)}
      pageRangeDisplayed={5}
      pageCount={pageCount}
      pageClassName={styles["page-item"]}
      pageLinkClassName={styles["page-link"]}
      previousClassName={styles["page-item"]}
      previousLinkClassName={styles["page-link"]}
      nextClassName={styles["page-item"]}
      nextLinkClassName={styles["page-link"]}
      breakClassName={styles["page-item"]}
      breakLinkClassName={styles["page-link"]}
      containerClassName={styles["pagination"]}
      activeClassName={styles["active"]}
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
  const [disabled,setDisabled] = useState()

  const {bio,img} = profileInfo

  const {theme} = useContext(themeContext) 
  const redirect = useRouter('/')

  useEffect(()=>{
    if(redirect.isReady){
    axios.get(`${HOST}userprofile/${username}/`).then((res)=>{
        setProfileInfo({
          bio:res.data.bio,
          img:res.data.img,
          
        })
  

    }).catch((e)=>{
      
    })
  }
},[isUpdated,redirect.isReady])

   const handleChange = (e,value)=>{
    if(error){
      setError('')
    }
    setProfileInfo({
      ...profileInfo,
      [e.target.name]:value
    })

   }



   const handleUserChange = (e)=>{
    if(error){
      setError('')
    }
    setUser(
      e.target.value
    )
   
   }
   const submitUsernameCheck = (e)=>{
    e.preventDefault()
    setDisabled(true)
    axios.delete(`${HOST}userprofile/${username}/${user}/`,{withCredentials:true,headers:{'X-CSRFToken':Cookies.get('csrftoken')}}).then((res)=>{
      setTimeout(()=>{
        redirect.reload()

      },300)
      
      

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
      redirect.push(`/userprofile/${username}/`)
    }).catch((e)=>{
      console.log(e.response.data)
      setError(e.response.data)
    })

   }

   let handleImageRemove = (e)=>{
    setProfileInfo({
      ...profileInfo,img:''
    })
   }


  return(
    <div>
    <button onClick={(e)=>setOpen(true)} style={{backgroundColor:theme.setButtonColor,color:theme.setColor}}  className={styles['ll-div']}>
    <Dialog className={styles['dialog-div']} open={open} onClose={(e)=>setOpen(false)} width='xl' >
    <form id='Form2' method='delete' onSubmit={(e)=>submitUsernameCheck(e)}/>

    <div className={styles['edit-profile-div']} style={{backgroundColor:theme.setBg,color:theme.setTextColor}}>
      
      <form onSubmit={(e)=>{e.preventDefault()  
        setOpen(false)}} className={styles['back-btn-form']} >
      <button  type='cancel' className={styles['back-btn']}>&larr;</button>
      </form>
      <h1 style={{textAlign:'center'}}>Edit Your Profile</h1>
        <form method='POST' id='Form1' className={styles['edit-profile-form']} onSubmit={(e)=>submitChange(e)} style={{backgroundColor:theme.setBg,color:theme.setColor,}}>
          <div className={styles['edit-img-div']}>
        
          <img src={img} className={styles['edit-img']}></img>

        <div className={styles['edit-img-sub-div']}>
          <h3>Update Your Profile Picture</h3>
          <label className={styles['imglbl']} htmlFor='upload'>Upload a Photo</label>
          <input form='Form1' id='upload' type='file' name='img'  onChange={(e)=>handleChange(e,e.target.files[0])} className={styles['img0']} ></input>
          <div onClick={(e)=>handleImageRemove(e)}  className={styles['remove-pfp']}>Remove Profile Picture</div>

          </div>

          </div>

          <div className={styles['edit-bio-div']}>
          BIO
          <input form='Form1' className={styles['bio-inp']} name='bio' value={bio} onChange={(e)=>handleChange(e,e.target.value)} style={{backgroundColor:theme.setButtonColor,color:theme.setTextColor}}></input>
          Account Deletion
          <button  className={styles['delete-btn']} type="button" onClick={(e)=>setUserField(!userField)} name='bio' value={bio} style={{backgroundColor:theme.setButtonColor,color:theme.setTextColor}}>Delete Account</button>
          
          {userField?
          <div className={styles['deletion-section']}>
          <input autoComplete="no" form='Form2' required onChange={(e)=>handleUserChange(e)} placeholder='Enter your username' value={user} className={styles['bio-inp']}  name='password' style={{backgroundColor:theme.setButtonColor,color:theme.setTextColor}} ></input>
          <div className={styles['txt']}>By Pressing Confirm you aknowledge that you can't retrieve your account back</div>
          <input disabled={disabled} form='Form2' type='submit' className={styles['delete-confirm']} value='Confirm' ></input>
          <div style={{color:'red'}}>{error}</div>
          </div>
          :null}

          
          </div>


         <div className={styles['submission-btn-div']}>
          <input type='submit' form='Form1' value='Submit Change'  className={styles['submission-btn']}   style={{backgroundColor:theme.setButtonColor,color:theme.setColor,cursor:'pointer'}}></input>

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


  if(btn1 && !btn2){
    return(
    <div className={styles["parent-grid"]} >
    <PaginatedItems articleList={articleList} theme={theme} itemsPerPage={4} />
</div>
    )
  }
  else if(btn2 && !btn1){
    return(
      <div className={styles["parent-grid"]} >
      <PaginatedItems articleList={likedArticlesList} theme={theme} itemsPerPage={4} />

</div>
    )
  }

  else{

    return(
      <div className={styles["parent-grid"]} >
        <PaginatedItems articleList={articleList} theme={theme} itemsPerPage={4} />
      </div>
    )
    }

  }




function UserProfile(){
    const articleContext = createContext()
    const {theme} = useContext(themeContext) //consuming the context
    let [userInfo,setUserInfo] = useState({'user':'','user_posts':[],'img':null,bio:''})
    let [isHidden,setIsHidden] = useState(false)
    let [btnState,setBtnState] = useState({'btn1':true,'btn2':false})
    let {username,user_posts,bio,img} = userInfo
    let [articleList,setArticleList] = useState([])
    let [domLoaded,setDomLoaded] = useState(false)
    let [likedArticlesList,setLikedArticlesList] = useState([])
    let {isAuth} = useContext(AuthContext)
    let redirect = useRouter()
    let {user} = redirect.query

    useEffect(()=>{
      if(redirect.isReady){
      axios.get(`${HOST}current/`,{withCredentials:true}).then((res)=>{
        if(res.data.user===username){
          setIsHidden(false)
        }
        else{
          setIsHidden(true)
        }

        setDomLoaded(true)
  
      })
    }
    },[redirect.isReady])


    useEffect(()=>{
      if(redirect.isReady){
      axios.get(`${HOST}liked_articles/${user}/`).then((res)=>{
        setLikedArticlesList(res.data)
      })
    }
    },[redirect.isReady])



    useEffect(()=>{
      if(redirect.isReady){
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
    }
  },[redirect.isReady])


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
      domLoaded &&
        <div className={styles['profile-div']} style={{backgroundColor:theme.setBg,color:theme.setColor}}>

          <Navigation></Navigation>
          

          <div className={styles['userinfo-div-wrapper']}>
          <div className={styles['userinfo-div']} style={{backgroundColor:theme.setButtonColor}}>
            <form method={styles['post']} onSubmit={(e)=>handleSubmit(e)}>
            <div className={styles['img-div']}>
            <img className={styles['the-img']} src={img}  />
            </div>
            <h1 >{user}</h1>
            <h3>{bio}</h3>
            </form>

             </div>

             </div>

             <div className={styles['main']} style={{ backgroundColor: theme.setBg, color: theme.setTextColor}}>
             <Filter isHiddenInput={true} setArticleList={setArticleList} user={user}></Filter>
             <div className={styles['switch-btns']}>
             <button style={{backgroundColor:theme.setButtonColor,borderColor:btnState.btn1?theme.setTextColor:theme.setBg,color:theme.setTextColor}} className={styles['switch-btn1']} value={'btn1'} onClick={(e)=>{handleBtnSwitch(e)}}>{user}'s Articles</button>
             <button style={{backgroundColor:theme.setButtonColor,borderColor:btnState.btn2?theme.setTextColor:theme.setBg,color:theme.setTextColor}} className={styles['switch-btn2']} value={'btn2'} onClick={(e)=>{handleBtnSwitch(e)}}>Favorites</button>
             </div>
             <SwitchArticles theme={theme} articleList={articleList} likedArticlesList={likedArticlesList} btn1={btnState.btn1} btn2 ={btnState.btn2}></SwitchArticles>

      </div>
            
        </div>
    )

}

export default UserProfile;
