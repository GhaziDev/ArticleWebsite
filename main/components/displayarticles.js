
import React,{useEffect,useContext,useState} from 'react';
import {themeContext} from '../pages/_app';
import { AuthContext } from '../store/provider';

import axios from 'axios';
import Cookies from 'js-cookie';
import {MenuItem,Menu,Fade,Button} from '@mui/material';
import { EditProfile } from '../pages/userprofile/[user]';
import HOST from '../config.js'
import { useRouter } from 'next/router';
import styles from '../styles/styling/displayarticles.module.scss'
import {clsx} from 'clsx';

const host = HOST


function DisplayDialogOrLogin(){
    let [error,setError] = useState('')
    let {isAuth}= useContext(AuthContext);
    const {theme} = useContext(themeContext)
    let [isVerified,setVerified] = useState(false)
    let [tagList,setTagList] = useState([])
    const redirect = useRouter()



    let [article, setArticle] = useState({
        title: "",
        title_img: "",
        description: "",
        tag: "",
        user: "",
        date: new Date().getDate(),
      });
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
    axios.post(`${host}articles/`, formData, {
        withCredentials: true,
        headers: { "X-CSRFToken": Cookies.get("csrftoken") },
      })
      .then((res) => {
        redirect.replace(`/article/${res.data}`)
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



    
   
  
    useEffect(()=>{
      axios.get(`${host}verified/`,{withCredentials:true}).then((res)=>{
        setVerified(res.data)
      })
    },[isVerified])

    return(
      <div className={styles['create-article-wrapper']}>
      <div className={`${styles['create-article-div']} ${clsx({
        [styles.dark]:theme.setChecked,
        [styles.light]:!theme.setChecked,
      })} ${styles['btn']}`}>
      <button className={styles['create-article-input']} onClick={isAuth?(e)=>redirect.replace('/create'):(e)=>redirect.replace('/login')} placeholder='Create an Article' style={{backgroundColor:'#3CCF4E'}} >Create Article</button>
    </div>
    </div>
    )

  }






  function Profile(){
    const {theme} = useContext(themeContext)
    const {setIsAuth} = useContext(AuthContext)
    const redirect = useRouter()
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
        setIsAuth(false)
        redirect.replace('/login')
      })

    }
    useEffect(()=>{
        axios.get(`${host}current/`,{withCredentials:true}).then((res)=>{
            setCurrent(res.data)
          
            })   
        },[])




    return(
      <span className={styles['right-btns']}>
      <Button
        id="fade-button"
        aria-controls={open ? 'fade-menu' : undefined}
        aria-haspopup="true"
        className={clsx({
            [styles.dark]:theme.setChecked,
            [styles.light]:!theme.setChecked,
          })
        }
        aria-expanded={open ? 'true' : undefined}
        style={{paddingBottom:'10px',borderRadius:'50%'}}
        onClick={handleClick}>
          <img className={styles['profile-img' ]}src={current.img}/>
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
            <MenuItem><button className={`${styles['ll-div']} ${clsx({
        [styles.dark]:theme.setChecked,
        [styles.light]:!theme.setChecked,
      })} ${styles['btn']}`}  onClick={(e)=>{redirect.replace(`/userprofile/${current.user}/`)}}>My Profile</button></MenuItem>
            <MenuItem><EditProfile username={current.user} className={`${styles['ll-div']} ${clsx({
        [styles.dark]:theme.setChecked,
        [styles.light]:!theme.setChecked,
      })} ${styles['btn']}`} >Settings</EditProfile></MenuItem>
            <MenuItem><button onClick={(e)=>redirectLogout(e)}  className={`${styles['ll-div']} ${clsx({
        [styles.dark]:theme.setChecked,
        [styles.light]:!theme.setChecked,
      })} ${styles['btn']}`} >Logout </button></MenuItem>
        </Menu>
        </span>
    )
}


function LoginOrLogout(){ //Login Or Logout component
    let redirect = useRouter()
    let {theme}= useContext(themeContext)
    let {isAuth} = useContext(AuthContext)





    let handleRedirectLogin = ()=>{
        redirect.replace('/login')
    }

    let handleRedirectSignUp = ()=>{
        redirect.replace('/signup')
    }

    let handleLogout= (e)=>{
        e.preventDefault()

        axios.get(`${host}logout/`,{withCredentials:true},{headers:{'X-CSRFToken':Cookies.get('csrftoken')}}).then((res)=>{
            setTimeout(()=>{
              redirect.replace('/login')
            }
            ,2000)
            
        }).catch((err)=>{
          
        })
    }

    if(isAuth){
        return (
          <div className={styles['right-div']}>
            <Profile></Profile>

            </div>
        )

    }
    return(
      <div className={styles['right-div']}>
            <div className={`${styles['l-div']} ${clsx({
        [styles.dark]:theme.setChecked,
        [styles.light]:!theme.setChecked,
      })}`}  onClick={()=>handleRedirectLogin()}>Login</div>
            <div onClick = {()=>handleRedirectSignUp()}  className={`${styles['l-div']} ${clsx({
        [styles.dark]:theme.setChecked,
        [styles.light]:!theme.setChecked,
      })}`}>Signup</div>
            </div>
        )

}





export {LoginOrLogout,DisplayDialogOrLogin}