import axios from "axios";
import React,{ useState,useEffect,useContext} from "react";
import HOST from "../../config.js";
import Cookies from "js-cookie";

import {clsx} from 'clsx';

import {themeContext} from '../../pages/_app';

/*
import Navigation from "../../components/navig";

import Dialog from '@mui/material/Dialog'
import ListAllArticles,{Filter} from '../../components/filtertag';
import Head from 'next/head'

*/


import ReactPaginate from 'react-paginate';

/*
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

*/

import { AuthContext } from "../../store/provider.js";
import { useRouter } from "next/router";
import styles from '../../styles/styling/App.module.scss'
import dynamic from 'next/dynamic'
import useSWR from "swr";

const Dialog = dynamic(()=>import('@mui/material/Dialog'))
const Head = dynamic(()=>import('next/head'));
const Filter = dynamic(()=>import('../../components/filtertag').then((mod)=>mod.Filter))
const ListAllArticles = dynamic(()=>import('../../components/filtertag'))
const ArrowBackIosIcon = dynamic(()=>import('@mui/icons-material/ArrowBackIos'))
const ArrowForwardIosIcon = dynamic(()=>import('@mui/icons-material/ArrowForwardIos'))

const Navigation = dynamic(()=>import('../../components/navig'))





function PaginatedItems({ itemsPerPage,articleList,theme}) { //managing items by paginating them.
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  /*
import Navigation from "../../components/navig";

import Dialog from '@mui/material/Dialog'
import ListAllArticles,{Filter} from '../../components/filtertag';
import Head from 'next/head'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
*/


/*
 

  */
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
      <div className={`${styles["paginator"]} `}>
    <ReactPaginate
      breakLabel="..."
      nextLabel={<ArrowForwardIosIcon className={`${clsx({[styles.dark]:theme.setChecked,[styles.light]:!theme.setChecked})}  ${styles['btn']}`}></ArrowForwardIosIcon>}
      onPageChange={(e)=>handlePageClick(e)}
      pageRangeDisplayed={5}
      pageCount={pageCount}
      pageClassName={styles["page-item"]}
      pageLinkClassName={`${styles["page-link"]}`}
      previousClassName={`${styles["page-item"]}`}
      previousLinkClassName={`${styles["page-link"]}`
    }
      nextClassName={`${styles["page-item"]}`
    }
      nextLinkClassName={`${styles["page-link"]}`}
      breakClassName={styles["page-item"]}
      breakLinkClassName={styles["page-link"]}
      containerClassName={`${styles["pagination"]}
      ${clsx({[styles.dark]:theme.setChecked,[styles.light]:!theme.setChecked})} ${styles['btn']}`}
      activeClassName={`${styles["active"]}  ${clsx({[styles.dark]:theme.setChecked,[styles.light]:!theme.setChecked})}`}
      activeLinkClassName = {`${clsx({[styles.dark]:theme.setChecked,[styles.light]:!theme.setChecked})} ${styles['btn']}`}
      previousLabel={<ArrowBackIosIcon className={`${clsx({[styles.dark]:theme.setChecked,[styles.light]:!theme.setChecked})} ${styles['btn']}`}></ArrowBackIosIcon>}
      renderOnZeroPageCount={null}
      marginPagesDisplayed={2}
    />
    </div>
  </>
  )
}


export function EditProfile({username}){
    /*
import Navigation from "../../components/navig";

import Dialog from '@mui/material/Dialog'
import ListAllArticles,{Filter} from '../../components/filtertag';
import Head from 'next/head'
*/



  

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
    <button onClick={(e)=>setOpen(true)}  className={`${styles['ll-div']} ${clsx({[styles.dark]:theme.setChecked,[styles.light]:!theme.setChecked})}  ${styles['btn']}`}>
    <Dialog className={styles['dialog-div']} open={open} onClose={(e)=>setOpen(false)} width='xl' >
    <form id='Form2' method='delete' onSubmit={(e)=>submitUsernameCheck(e)}/>

    <div className={`${styles['edit-profile-div']} ${clsx({[styles.dark]:theme.setChecked,[styles.light]:!theme.setChecked})}`}>
      
      <form onSubmit={(e)=>{e.preventDefault()  
        setOpen(false)}} className={styles['back-btn-form']} >
      <button  type='cancel' className={styles['back-btn']}>&larr;</button>
      </form>
      <h1 style={{textAlign:'center'}}>Edit Your Profile</h1>
        <form method='POST' id='Form1' className={`${styles['edit-profile-form']} ${clsx({[styles.dark]:theme.setChecked,[styles.light]:!theme.setChecked})} `} onSubmit={(e)=>submitChange(e)} >
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
          <input form='Form1' className={`${styles['bio-inp']} ${clsx({[styles.dark]:theme.setChecked,[styles.light]:!theme.setChecked})}  ${styles['btn']}`} name='bio' value={bio} onChange={(e)=>handleChange(e,e.target.value)} ></input>
          Account Deletion
          <button  className={`${styles['delete-btn']} ${clsx({[styles.dark]:theme.setChecked,[styles.light]:!theme.setChecked})}  ${styles['btn']}`} type="button" onClick={(e)=>setUserField(!userField)} name='bio' value={bio}>Delete Account</button>
          
          {userField?
          <div className={styles['deletion-section']}>
          <input autoComplete="no" form='Form2' required onChange={(e)=>handleUserChange(e)} placeholder='Enter your username' value={user} className={`${styles['bio-inp']} ${clsx({[styles.dark]:theme.setChecked,[styles.light]:!theme.setChecked})}  ${styles['btn']}`}  name='password'  ></input>
          <div className={styles['txt']}>By Pressing Confirm you aknowledge that you can't retrieve your account back</div>
          <input disabled={disabled} form='Form2' type='submit' className={styles['delete-confirm']} value='Confirm' ></input>
          <div style={{color:'red'}}>{error}</div>
          </div>
          :null}

          
          </div>


         <div className={styles['submission-btn-div']}>
          <input type='submit' form='Form1' value='Submit Change'  className={`${styles['submission-btn']} ${clsx({[styles.dark]:theme.setChecked,[styles.light]:!theme.setChecked})}  ${styles['btn']}`}  style={{cursor:'pointer'}}></input>

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


/*


export async function getServerSideProps({params}){
  try{
  let res = await fetch(`${HOST}userprofile/${params.user}/`)
  let userInfo = await res.json()
  return{
    props:{userInfo:userInfo}
  }
  }
  catch(e){
    return{
      props:{}
    }
  }


}

*/

function UserProfile(){
  /*
  const Dialog = dynamic(()=>import('@mui/material/Dialog'))
  const Head = dynamic(()=>import('next/head'));
  const Filter = dynamic(()=>import('../../components/filtertag').then((mod)=>mod.Filter))
  */

  function fetcher(url) {
    return fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        return data;
      })
      .catch(error => {
        console.error(error);
        return null;
      });
  }
    const {theme} = useContext(themeContext) //consuming the context
    let [isHidden,setIsHidden] = useState(false)
    let [btnState,setBtnState] = useState({'btn1':true,'btn2':false})
    let [articleList,setArticleList] = useState([])
    let [domLoaded,setDomLoaded] = useState(false)
    let [likedArticlesList,setLikedArticlesList] = useState([])
    let {isAuth} = useContext(AuthContext)
    let redirect = useRouter()
    let {user} = redirect.query
    let {data:userInfo,error} = useSWR(`${HOST}userprofile/${user}/`,fetcher)

    useEffect(()=>{
      if(userInfo){
      axios.get(`${HOST}current/`,{withCredentials:true}).then((res)=>{
        if(res.data.user===userInfo.user){
          setIsHidden(false)
        }
        else{
          setIsHidden(true)
        }

        setDomLoaded(true)
  
      })
    }
    },[userInfo])



    useEffect(()=>{
      if(userInfo){
      axios.get(`${HOST}liked_articles/${userInfo.user}/`).then((res)=>{
        setLikedArticlesList(res.data)
      })
    }
    },[userInfo])



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
      formData.append('img',userInfo.img)
      formData.append('bio',userInfo.bio)
      axios.put(`${HOST}userprofile/${userInfo.user}/`,formData,{withCredentials:true,headers:{'X-CSRFToken':Cookies.get('csrftoken')}}).then((res)=>{

      })
    }

    return(
      userInfo?
        <div className={`${styles['profile-div']} ${clsx({[styles.dark]:theme.setChecked,[styles.light]:!theme.setChecked})} `}>
          <Head>

          </Head>

          <Navigation></Navigation>
          

          <div className={styles['userinfo-div-wrapper']}>
          <div className={`${styles['userinfo-div']} ${clsx({[styles.dark]:theme.setChecked,[styles.light]:!theme.setChecked})}  ${styles['btn']}`}>
            <form method={styles['post']} onSubmit={(e)=>handleSubmit(e)}>
            <div className={styles['img-div']}>
            <img className={styles['the-img']} src={userInfo.img}  />
            </div>
            <h1 >{userInfo.user}</h1>
            <h3>{userInfo.bio}</h3>
            </form>

             </div>

             </div>

             <div className={`${styles['main']} ${clsx({[styles.dark]:theme.setChecked,[styles.light]:!theme.setChecked})} `}>
             <Filter isHiddenInput={true} setArticleList={setArticleList} user={userInfo.user}></Filter>
             <div className={styles['switch-btns']}>
             <button style={{borderColor:btnState.btn1?(theme.setChecked?'white':'black'):theme.setChecked?'#1b1b1b':'white'}} className={`${styles['switch-btn1']} ${clsx({[styles.dark]:theme.setChecked,[styles.light]:!theme.setChecked})}  ${styles['btn']}`} value={'btn1'} onClick={(e)=>{handleBtnSwitch(e)}}>{userInfo.user}'s Articles</button>
             <button style={{borderColor:btnState.btn2?(theme.setChecked?'white':'black'):theme.setChecked?'#1b1b1b':'white'}} className={`${styles['switch-btn2']} ${clsx({[styles.dark]:theme.setChecked,[styles.light]:!theme.setChecked})}  ${styles['btn']}`} value={'btn2'} onClick={(e)=>{handleBtnSwitch(e)}}>Favorites</button>
             </div>
             <SwitchArticles theme={theme} articleList={articleList} likedArticlesList={likedArticlesList} btn1={btnState.btn1} btn2 ={btnState.btn2}></SwitchArticles>

      </div>
            
        </div>:<div>Loading</div>
    )

}

export default UserProfile;
