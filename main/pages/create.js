import React,{ useState,useEffect,useContext,memo } from "react";
import axios from 'axios'
import HOST from "../config";
import Cookies from "js-cookie";
import ReactMarkDown from "react-markdown";
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import remarkToc from 'remark-toc'
import rehypeSlugger from 'rehype-slug'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw';
import remarkRehype from 'remark-rehype'
import {themeContext } from "../pages/_app";
import { AuthContext } from '../store/provider';

import remarkGemoji from 'remark-gemoji';
import { oneDark,oneLight} from 'react-syntax-highlighter/dist/cjs/styles/prism'
import Navigation from "../components/navig";
import { useRouter } from "next/router";
import styles from '../styles/styling/createArticle.module.css'
import { currentUser } from "../store/currentprovider";

let host = HOST


const Markdown = memo(function Markdown({children,theme}){
  return <ReactMarkDown
  children={children}
  theme={theme}
  className={theme.setClassName}
                    remarkPlugins={[
                      remarkGfm,
                      remarkMath,
                      remarkToc,
                      remarkRehype,
                      remarkGemoji,
                    ]}
                    rehypePlugins={[rehypeKatex, rehypeSlugger,[rehypeHighlight,{ignoreMissing:true}]]}
  ></ReactMarkDown>
})

 

function EmbedLinks(e){
  if(e?.href){
   
    return <iframe src={e.href}></iframe>
  }
  return null
}


function ArticleCreation(){
    let redirect = useRouter()
    let [article, setArticle] = useState({
        title: "",
        title_img: "",
        description: "",
        tag: "",
        user: "",
      });
      let [error,setError] = useState()
      let {isAuth,setIsAuth} = useContext(AuthContext)
      let [tagList,setTagList] = useState()
      let [disabled,setDisabled] = useState(false)
      let {theme} = useContext(themeContext)
    let { title, title_img, description, user, tag, date} = article;
    let {current} = useContext(currentUser)






    useEffect(() => {
      current?.user?setArticle({
              ...article,
              user: current.user,
            }):null;
      },[]);






    let handleChangeImage = (e)=>{
      setArticle(
        {
          ...article,
          'title_img':e.target.files[0],
        }
      )
      
    } 


    let handleChange = (e)=>{
        setArticle(
            {
                ...article,
                [e.target.name]:e.target.value
            }
        )
    }
  
   
  let handleSubmit = (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("title_img", title_img);
    title = title.trim()
    title = title.split(" ");
    let newTitle = title.map((string) => {
      return string[0]?.toUpperCase() + string.slice(1);
    });
    newTitle = newTitle.join(" ")
    formData.append("title", newTitle);
    formData.append("user", current.user);
    formData.append("tag", tag);
    formData.append("description", description);
    setDisabled(true)
    axios.post(`${host}articles/`, formData, {
        withCredentials: true,
        headers: { "X-CSRFToken": Cookies.get("csrftoken") },
      })
      .then((res) => {
        redirect.replace(`/article/${res.data}`)
        
      })
      .catch((e) => {
        setError(e.response.data)
        setDisabled(false)
      


      });
  };


  useEffect(()=>{
    axios.get(`${HOST}tags/`).then((res)=>{
      setTagList(res.data)
    }).catch((e)=>{
      setTagList(['None','None'])
    })
  },[])


  /*useEffect(() => {
    axios
      .get(`${host}current/`,{withCredentials:true})
      .then((res) => {
        setArticle({
          ...article,
          user: res.data.user,
        });
      });
  },[]);
  */

if(isAuth){
return(
    <div className={styles['main-content']} style={{backgroundColor:theme.setBg,color:theme.setTextColor}}>
        <Navigation></Navigation>
        <div className={styles['page-name']}>
        <h1>Article Creation Page</h1>
        </div>
        <div className={styles['container']}>
       
            <form className={styles['article-form']} onSubmit={(e)=>handleSubmit(e)}>
            <div className={styles['upper-container']} style={{backgroundColor:theme.setButtonColor}}>
            <div className={styles['title-div']}>
                <textarea placeholder="Write the title here.." required minLength={20} maxLength={60}  className={styles['title-input']} name='title' value={title} onChange={(e)=>handleChange(e)}
                style={{borderColor:theme.setTextColor,backgroundColor:theme.setButtonColor,color:theme.setTextColor}}></textarea>
          </div>
        <div className={styles["title-img"]}>
          <label required htmlFor="upload" className={styles["imglbl"]} alt='Error' >
            Upload An Image
          </label>
        <input
      
        className={styles['img0']}
          id="upload"
          required
          type="file"
          name="title_img"
          accept="image/*"
          onChange={(e) => handleChangeImage(e)}
        ></input>
          </div>
                <div className={styles['tag-input']}>
                    <select placeholder='choose' name='tag' required className={styles['tag-selection']}  onChange={(e)=>handleChange(e)} style={{backgroundColor:theme.setBg,color:theme.setTextColor}}>
                        <option onChange={(e)=>handleChange(e)} value='' >Select a Tag</option>
                        {tagList?.map((tag) => {
                            return <option name ='tag' onChange={(e)=>handleChange(e)} key='tag' value={tag}>{tag.charAt(0).toUpperCase()+tag.slice(1)}</option>

                        })}
                    </select>
                </div>

            
            <div className={styles["description-container"]}>
                <textarea placeholder="Write the description here..." style={{backgroundColor:theme.setButtonColor,color:theme.setTextColor}} minLength={2000} required className={styles['description-input']} value={description} name='description' onChange={(e)=>handleChange(e)}>

                </textarea>
          
            </div>
            </div>
            <div className={styles['error-div']} style={{paddingTop:'15px'}}>
            <InvalidImage error={error}></InvalidImage>

            </div>
            <div className={styles['lower-container']}>
            <button
          type="submit"
          id="confirmBtn"
          value="default"
          className={styles["article-submit"]}
          style={{backgroundColor:theme.setButtonColor,color:theme.setTextColor}}
          disabled={disabled}
        >
          <span>{disabled?<div class={styles["lds-ring"]}><div></div><div></div><div></div><div></div></div>:'Post'}</span>
        </button>
            </div>
            </form>

            <div className={styles['preview-container']}>
                <div  style={{backgroundColor:theme.setButtonColor,color:theme.setTextColor}} className={styles['description-output']}>
                <h1 style={{color:theme.setBg==='#1b1b1b'?'yellowgreen':'green'}}>Preview</h1>
                    <Markdown  theme={theme} children={description} ></Markdown>
                </div>

                </div>
          
         

           
       
        </div>
    </div>
)
                    }
    else{
    return(
        <div className={styles['not-authorized']}>
            You are not Authorized to access this page.
            
            </div>
    )
                    }
                  }

function InvalidImage({error}){
  if(error){
    return(
          <div className={styles['imgerror']} style={{color:'red'}}>
        {error}
      </div>
        )
      
  }
  return null
}

export default ArticleCreation;