import axios from "axios";
import { useState,useEffect,useContext } from "react";
import { useParams,Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {ListAllArticles} from './articles'
import {themeContext} from '../App.js';
import {cyanDark} from '@radix-ui/colors';

function UserProfile(){
    const {theme} = useContext(themeContext) //consuming the context
    console.log(theme)
    console.log({theme})
    
    let {user} = useParams()
    let [userInfo,setUserInfo] = useState({'username':'','user_posts':''})
    let {username,user_posts} = userInfo
    useEffect(()=>{
        axios.get(`http://127.0.0.1:8000/userprofile/${user}/`).then((res)=>{
            setUserInfo(res.data)

        })
    })

    const listUserArticles = ()=>{
        const bc = theme === cyanDark.cyan1 ? cyanDark.cyan6 : "white"
        const tagColor = theme === cyanDark.cyan1 ? cyanDark.cyan11 : cyanDark.cyan12
        return(
        user_posts.map((post)=>{
            return(
                    <div
                      className="articles"
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

    return(
        <div className='profile-div' style={{backgroundColor:theme.setBg}}>
            <h1>
                {username}
            </h1>
            <div className='user-post-section-div'>
                {listUserArticles}
            </div>

            
        </div>
    )

}

export default UserProfile;