import axios from "axios";
import React,{ useState, useEffect, useContext, memo, useRef } from "react";
import Cookies from "js-cookie";
import { useDeferredValue } from "react";

import CsrfToken from "../../components/csrf"
import { themeContext } from "../_app";
import { AuthContext } from "../../store/provider";
import { clsx } from 'clsx';




//import Dialog from "@mui/material/Dialog";
//import Navigation from "../../components/navig.js"; 

import HOST from "../../config.js";

/*


import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  RedditShareButton
} from 'next-share';

*/



//import ReactMarkDown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkToc from "remark-toc";

import rehypeSlugger from "rehype-slug";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import remarkGemoji from "remark-gemoji";

/*
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";



import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LinkIcon from "@mui/icons-material/Link";
import RedditIcon from "@mui/icons-material/Reddit";
*/

import { useRouter } from "next/router.js";
import styles from '../../styles/styling/specificarticle.module.scss'

//import Link from 'next/link'
//import Head from "next/head";
//import dynamic from 'next/dynamic'

import Link from 'next/link'
import Head  from 'next/head'

import dynamic from "next/dynamic";



const ReactMarkDown = dynamic(()=>import('react-markdown'))
const Dialog = dynamic(()=>import('@mui/material/Dialog'))

import useSWR from "swr";



import Navigation from  "../../components/navig.js"



import {FacebookShareButton} from 'next-share'
import {TwitterShareButton}  from 'next-share'
import {LinkedinShareButton} from 'next-share'
import {RedditShareButton}  from 'next-share'

import 'iconify-icon'



/*
export  async function getStaticProps(){
  try{
  const res = await fetch(`${HOST}articles/${params.slug}/`, { timeout: 120000 })
  const data = await res.json()
  return {
    props: {InitialData:data,key:data._id}, // will be passed to the page component as props
    revalidate: 10,
  }

}

catch(e){


  return {
    props:{}
  }
}
}


export async function getStaticPaths() {

  try{
  const res = await fetch(`${HOST}articles/`)
  const articles= await res.json()

  // Get the paths we want to pre-render based on posts
  const paths = articles.map((article) => ({
    params: { slug: article.slug },
  }))

  // We'll pre-render only these paths at build time.
  // { fallback: 'blocking' } will server-render pages
  // on-demand if the path doesn't exist.
  return { paths, fallback: 'blocking' }

}
catch(err){
  return {paths:[],fallback:'blocking'}
}
}
*/


export const runtime = 'experimental-edge';


export async function getServerSideProps(context) {
  // Fetch data from external API
  const {slug} = context.params

  const res = await fetch(`${HOST}articles/${slug}/`)
  const data = await res.json()
 
  // Pass data to the page via props
  return { props: { data } }
}











const Markdown = memo(function Markdown({children,theme}){

  return <ReactMarkDown className={theme.setChecked?styles['dark']:styles['light']}
  children={children}
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

 

const LoadComment = memo(function LoadComment({updated,comment,setUpdated,setId,_id,redirect,user_,theme,commentList}){
  const [commentEdit, setCommentEdit] = useState({ description: comment.desc });
  const [editMode, setEditMode] = useState(false);
  const handleCommentDelete = (e, _id) => {
    e.preventDefault();
    axios
      .delete(`${HOST}comments/${_id}/`, {
        withCredentials: true,
        headers: { "X-CSRFToken": Cookies.get("csrftoken") },
      })
      .then((res) => {
 
        setUpdated(updated + 1);
      });
  };

  const handleEditMode = (e, slug) => {
    setEditMode(!editMode);
    setId(slug);
    setCommentEdit(comment.desc);
  };
  const handleCommentEdit = (e, _id) => {
    e.preventDefault();
    axios
      .put(`${HOST}comments/${_id}/`, commentEdit, {
        withCredentials: true,
        headers: { "X-CSRFToken": Cookies.get("csrftoken") },
      })
      .then((res) => {
      
      });
    setUpdated(updated + 1);
    setId(_id);
    setEditMode(false)
  };

  useEffect(()=>{


  },[updated])
  const handleCommentEditChange = (e, id) => {
    setCommentEdit({
      ...commentEdit,
      description: e.target.value,
    });
  };


  return(
    <div>
    {commentList.map((comment, index) => {
      //TODO: set if comment is liked by current user in the comment serializer to detect it in the frontend

      return (
        <div className={styles["cmntsec"]} key={comment._id.toString()}>
          <div className={styles["cmntinfo"]}>
            <img
              src={user_.pfp}
              onClick={(e) => redirect.push(`/userprofile/${comment.user}`)}
              className={styles["profile-img"]}
            />
          </div>

          <div className={styles["descmnt"]} key={comment.desc}>
            <div className={styles["user-date-cmnt-sec"]}>
              <div
                className={`${styles["cmnt-user"]} ${clsx({
                  [styles.dark_]:theme.setChecked,
                  [styles.light_]:!theme.setChecked
                })}`}
                onClick={(e) => redirect.push(`/userprofile/${comment.user}`)}
                key={comment.user}
              >
                {comment.user}{" "}
              </div>
              <div
                style={{
                  color:
                    theme.setChecked? "yellowgreen" : "green",
                }}
                className={styles["cmnt-date"]}
                key={comment.date.toString()}
              >
                {comment.date}
              </div>
              
              {comment.user == user_.user ? (
                <div
                  key={index}
                  style={{
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                  onClick={(e) => handleEditMode(e, comment._id)}
                >
                  Edit
                </div>

                
              ) : null}

{comment.user == user_.user ? (
                <div
                  style={{
                    textDecoration: "underline",
                    color: "red",
                    cursor: "pointer",
                  }}
                  onClick={(e) => handleCommentDelete(e, comment._id)}
                >
                  Delete
                </div>
              ) : null}
              {/*<div className={styles["cmnt-likes"]}>
                {comment.user_like?    <FavoriteIcon
                onClick={(e)=>handleCommentLikes(e,comment._id)}
                      value={comment._id}
                        fontSize="medium"
                        style={{ color: "red", cursor: "pointer" }}
                      />: <FavoriteBorderIcon
                      onClick={(e)=>handleCommentLikes(e,comment._id)}
                      value={comment._id}
                        fontSize="medium"
                        style={{
                          color: theme.setTextColor,
                          cursor: "pointer",
                        }}
                      />}
              

                {comment.likey}
                      </div>*/}

            </div>

            {editMode && comment._id == _id ? (
              <form
                method="post"
                onSubmit={(e) => handleCommentEdit(e, comment._id)}
              >
                <textarea

                  className={`${styles["cmnteditinp"]} ${clsx({
                    [styles.dark_]:theme.setChecked,
                    [styles.light_]:!theme.setChecked
                  })} ${styles['btn']}`}
                  defaultValue={comment.desc}
                  value={commentEdit.description}
                  onChange={(e) => handleCommentEditChange(e)}
                />
                <div

          
                  className={`${styles["cmnt-output-edit"]} ${clsx({
                    [styles.dark_]:theme.setChecked,
                    [styles.light_]:!theme.setChecked
                  })} ${styles['btn']}`}
                >
                  {" "}
                  <h2
                    style={{
                      color:
                        theme.setChecked
                          ? "yellowgreen"
                          : "green",
                    }}
                  >
                    Preview
                  </h2>
                  <Markdown theme={theme}
                    children={commentEdit.description}
              
                  ></Markdown>
                </div>
                <button
                  type="submit"
                  style={{
                    background: theme.setButtonColor,
                    color: theme.setTextColor,
                  }}

                  className={`${styles['submitButton']} ${clsx({
                    [styles.dark_]:theme.setChecked,
                    [styles.light_]:!theme.setChecked
                  }) } ${styles['btn']}`}
                >
                  Submit Change
                </button>
              </form>
            ) : (
              <Markdown theme={theme}
                children={comment.desc}
               
                
              ></Markdown>
            )}
          </div>
        </div>
      );
    })}
    </div>
  )
})

const WriteComment = memo(function WriteComment({redirect,desc,handleSubmit,handleChange,commentPreview,theme,relatedArticles,user_}){

  
 
  
  /*
import Link from 'next/link'
import Head from "next/head";
*/




  return(
    <div className={styles["cmnt-div"]}>
    <div className={styles['heading-div']}>
      <h1>Related Articles</h1>
      </div>
    <div className={styles["parent-grid"]}>
    
      {relatedArticles.map((article)=>{
        return (
          <div
          className={`${styles["articles"]} ${clsx({
            [styles.dark_]:theme.setChecked,
            [styles.light_]:!theme.setChecked,
          })} ${styles['btn']}`} key={article._id.toString()+'1'}
        >
          <Link key={article._id.toString()}
            href={`/article/${article.slug}`}
          >
            <div className={styles['image-div']}>
            <img key={article.thumb_img} src={article.thumb_img} className={styles["image"]} />
            </div>
            <div className={`${styles['article-tag-like']}${clsx({
                [styles.dark_]:theme.setChecked,
                [styles.light_]:!theme.setChecked
              })} ${styles['btn']}`}>
              <button key={article.tag_id}  className={`${styles['tag-sec']} ${clsx({
                [styles.dark_]:theme.setChecked,
                [styles.light_]:!theme.setChecked
              })}`}>{article.tag}</button>
              <div className={`${styles['article-like-div']} ${clsx({
                [styles.dark_]:theme.setChecked,
                [styles.light_]:!theme.setChecked
              })} ${styles['btn']}`} >
              <iconify-icon width="30" height="30" icon='material-symbols:favorite'  style={{color:'red'}} />
              {article.likes}</div>
              </div>
    <div className={`${styles['title-card']} ${clsx({[styles.dark_]:theme.setChecked,[styles.light_]:!theme.setChecked})} ${styles['btn']}`}>
            <h4 key={article.title} className={`${styles["title"]}`}>
              {article.title}
            </h4>
            </div>
  
            
            <div className={styles['separator']}>
              <div className={styles['userinfo']}>
            <h4 key={article.user_id} className={`${styles["user"]} ${clsx({
                [styles.dark_]:theme.setChecked,
                [styles.light_]:!theme.setChecked
              })} ${styles['btn']}`} >
              {" "}
              <img key={article.user_profile.toString()} src={article.user_profile}/> {article.user}
            </h4>
            </div>
            <h4 key={article.date.toString()} className={`${styles["date"]} ${clsx({
                [styles.dark_]:theme.setChecked,
                [styles.light_]:!theme.setChecked
              })} ${styles['btn']}`} >
              <iconify-icon  width='30' height='30' key={article.date.toString()} icon="uim:calender" /> {article.date}
            </h4>
            </div>
          </Link>
        </div>
        )
      })}
    </div>
    <form method="post" onSubmit={(e) => handleSubmit(e)}>
      <CsrfToken></CsrfToken>
      <div className={styles["csub"]}>
        <h1>Comment Section</h1>
        <div className={styles["input-img-group"]}>
          <div className={styles["imgsec"]}>
            <img src={user_.pfp} className={styles["profile-img"]} />
          </div>
          <textarea
            name="desc"
            required
            className={`${styles["cmntinp"]}
            ${clsx({
              [styles.dark_]:theme.setChecked,
              [styles.light_]:!theme.setChecked
            })} ${styles['btn']}`
          }
            onChange={(e) => handleChange(e)}
            value={desc}
            placeholder="Write your comment here"
          ></textarea>
        </div>
        <div className={styles["cmnt-output-container"]}>
        
          {desc ? (
            <div
              style={{
                backgroundColor: theme.setButtonColor,
                color: theme.setTextColor,
              }}
              className={`${styles["cmnt-output"]} ${clsx({
                [styles.dark_]:theme.setChecked,
                [styles.light_]:!theme.setChecked
              })} ${styles['btn']}`}
            >
              <h2
                style={{
                  color:
                    theme.setChecked ? "yellowgreen" : "green",
                }}
              >
                Preview
              </h2>
              
              <Markdown theme={theme}
                children={commentPreview}
                
              ></Markdown>
              
            </div>
          ) : null}
              
        </div>
        <div className={styles["submit-div"]}>
          <button
            type="submit"
            className={`${styles['submitButton']} ${clsx({
              [styles.dark_]:theme.setChecked,
              [styles.light_]:!theme.setChecked
            })} ${styles['btn']}`}

          >
            Submit
          </button>
        </div>
      </div>
    </form>
    </div>
  )
})

const LoadDescription = memo(function LoadDescription({description,theme}){
  return  <p className={styles["article-desc"]}>
          
  <Markdown 
  theme={theme} 
    children={description}
   
    
  ></Markdown>

</p>
}
)

const EditArticle = ({
  user,
  article,
  theme,
  description,
  slug,
  setArticle,
  redirect,
}) => {
  
  let [open, setOpen] = useState(false);
  const [update, setUpdate] = useState(false);
  const [markdownDesc,setMarkdownDesc] = useState('')
  const [descEdit,setDescEdit] = useState(description)
  const value = useDeferredValue(descEdit)
  let handleEdit = (e) => {
    e.preventDefault();
    axios
      .put(`${HOST}articles/${slug}/`,{...article,description:descEdit}, {
        withCredentials: true,
        headers: { "X-CSRFToken": Cookies.get("csrftoken") },
      })
      .then((res) => {
        console.log(res.data)
        setArticle({
          ...article,
          description: res.data,
          date: res.data.date,
        });
        setOpen(false);
        redirect.push(`/article/${slug}`);
        setUpdate(update + 1);
      })
      .catch((e) => {
       
      });
  };

  let handleDescChange = (e) => {
    setDescEdit(
      e.target.value
    )
    
  };

  useEffect(() => {
    axios.get(`${HOST}articles/${slug}/`).then((res) => {
      setArticle(res.data);
      setDescEdit(res.data.description)
    });
    
  }, [update]);

  if (user === article.user) {
    //comparing the current user id to the owner user id (owner of post)
    return (
      <div className={styles["edit-article-div"]}>
        <button
          className={`${styles["edit-btn"]} ${clsx({
            [styles.dark_]:theme.setChecked,
            [styles.light_]:!theme.setChecked
          })} ${styles['btn']}` }
          onClick={() => setOpen(true)}
        >
          Edit
        </button>

        <Dialog
        
          open={open}
          onClose={(e) => setOpen(false)}
          fullWidth={true}
          maxWidth="l"
          className={styles["dialog"]}
        >
          <div class={`${styles["dialog-content"]} ${clsx({
                [styles.dark_]:theme.setChecked,
                [styles.light_]:!theme.setChecked
              })}`} >
            <form
              method="put"
              onSubmit={(e) => handleEdit(e)}
              className={`${styles["dialog-form"]} ${clsx({
                [styles.dark_]:theme.setChecked,
                [styles.light_]:!theme.setChecked
              })}`}
            >
              <div className={styles["back-btn-div"]}>
                <button
                type='button'
                  onClick={(e) => setOpen(false)}
                  style={{ backgroundColor: "red", color: "white" }}
                  className={styles["back-btn"]}
                >
                  &larr;
                </button>
              </div>
              <div className={`${styles["page-name"]} ${clsx({
                [styles.dark_]:theme.setChecked,
                [styles.light_]:!theme.setChecked
              })}`}>
                <h1 >Edit Page</h1>
              </div>
              <div
                className={`${styles["description-container"]} ${clsx({
                  [styles.dark_]:theme.setChecked,
                  [styles.light_]:!theme.setChecked
                })}`}
              >
                <textarea
                  required
                  minLength={"2000"}
                  
                  className={`${styles["description-input1"]} ${clsx({
                    [styles.dark_]:theme.setChecked,
                    [styles.light_]:!theme.setChecked
                  })} ${styles['btn']}`}
                  value={descEdit}
                  onChange={(e) => handleDescChange(e)}
              
                ></textarea>
                <div>
                  <div
                    className={`${styles["description-output"]}
                   ${clsx({
                      [styles.dark_]:theme.setChecked,
                      [styles.light_]:!theme.setChecked
                    })} ${styles['btn']}`}
  
                  >
                    <h1
                      style={{
                        color:
                          theme.setChecked? "yellowgreen" : "green",
                      }}
                    >
                      Preview
                    </h1>
                    
                    <Markdown
                      children={value}
                      theme={theme}
                    ></Markdown> 
                  </div>
                </div>
              </div>
              <div className={styles["edit-btn-div"]}>
                <button
                  type="submit"
                  className={`${styles["edit-btn"]} ${clsx({
                    [styles.dark_]:theme.setChecked,
                    [styles.light_]:!theme.setChecked
                  })} ${styles['btn']}`}
    
                >
                  Submit Change
                </button>
              </div>
            </form>
          </div>
        </Dialog>
      </div>
    );
  }
  return null;
};

const DeleteArticle = ({ user, article, slug, redirect }) => {
  const { theme } = useContext(themeContext);
  let [open, setOpen] = useState(false);

  let handleDelete = (e) => {
    e.preventDefault();
    axios
      .delete(`${HOST}articles/${slug}/`, {
        withCredentials: true,
        headers: { "X-CSRFToken": Cookies.get("csrftoken") },
      })
      .then((res) => {
        redirect.replace("/");
      })
      .catch((e) => {
      });
  };

  if (user === article.user) {
    return (
      <div className={styles["delete-div"]}>
        <button
          className={`${styles["delete-btn"]}
          ${clsx({
            [styles.dark_]:theme.setChecked,
            [styles.light_]:!theme.setChecked
          })} ${styles['btn']}`}
          onClick={() => setOpen(true)}
        >
          Delete
        </button>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          className={clsx({
            [styles.dark_]:theme.setChecked,
            [styles.light_]:!theme.setChecked
          })}

        >
          <form
            method="delete"
            onSubmit={(e) => handleDelete(e)}
            className={`${styles['artclDel']}
            ${clsx({
              [styles.dark_]:theme.setChecked,
              [styles.light_]:!theme.setChecked
            })}`
          }

          >
            <p>Are you sure you want to delete this article? </p>
            <button  className={styles["delete-btn"]} type="submit">
              Delete
            </button>
          </form>
        </Dialog>
      </div>
    );
  }
  return null;
};

const SpecificArticle = ({data}) => {
  /* function fetcher(url) {
    return fetch(url)
      .then(response => response.json())
      .then(data => {
        return data;
      })
      .catch(error => {
        console.error(error);
        return null;
      });
  }
  */
   let redirect = useRouter();
   let {slug } = redirect.query;

  // let {data,error} = useSWR(slug?`${HOST}articles/${slug}/`:null,slug?fetcher:null,{InitialData})
  console.log(data)

//some comment here


  
  //let [isLoading,setIsLoading] = useState(true)


  const [article, setArticle] = useState({
    title: "",
    title_img: "",
    description: "",
    user: "",
    tag: "",
    date: "",
    userprofile: "",
  });
  const { description } = article;
  const [commentList, setCommentList] = useState([]);
  const [relatedArticles,setRelatedArticles] = useState([]);
  const [comment, setComment] = useState({
    article_id: 0,
    user_id: "",
    desc: "",
    date: new Date(),
    is_author: false,
  });



  

  const [wordBreak,setWordBreak] = useState({'wordBreak':'normal'})

 
  const heightRef = useRef(0)
  const cmntRef = useRef(0)
  const [scroll,setScroll] = useState(0)
  const [progress,setProgress] = useState(0)

  const { desc, date } = comment;
  const [updated, setUpdated] = useState(0);
  const [user_, setUser] = useState("");
  const [domLoaded,setDomLoaded] = useState(false)
  const [likesCount, setLikesCount] = useState({ like: false, likes_count: 0 });
  const [commentLikesCount, setCommentLikesCount] = useState({
    like: false,
    likes_count: 0,
  });

  const [editMode, setEditMode] = useState(false);
 

  let { isAuth } = useContext(AuthContext);

  let { theme } = useContext(themeContext);
  let [commentPreview,setCommentPreview] = useState()


  let [hasLiked, setHasLiked] = useState();
  let [_id, setId] = useState();

  const handleWordBreak = ()=>{
   
  }

  let handleTagRedirect = (e) => {
    setTimeout(() => {
      redirect.replace("/");
    }, 5000);
  };

  useEffect(()=>{ /* this line to be removed */
    setUpdated(updated+1)
  },[])

  useEffect(()=>{
    
  },[updated])

useEffect(()=>{
  window.addEventListener("scroll", handleScroll);
  return () => {
  window.removeEventListener("scroll", handleScroll);
  }
},[scroll])

  let handleScroll = (e)=>{
    setScroll(e.target.scrollTop)
    setProgress((scroll)/((e.target.scrollHeight-e.target.offsetHeight-cmntRef.current.clientHeight))*100+'%')

    

  }
  useEffect(() => {
    if(data){
    axios.get(`${HOST}likes/${slug}/`, { withCredentials: true }).then((res) => {
      setLikesCount(res.data);
      setHasLiked(res.data.like);
    });
  }
  }, [likesCount.likes_count,data]);

  let handleLike = (e) => {
    if(data){
    axios
      .post(`${HOST}likes/${slug}/`, likesCount, {
        withCredentials: true,
        headers: { "X-CSRFToken": Cookies.get("csrftoken") },
      })
      .then((res) => {
        setHasLiked(!hasLiked);
      
        setLikesCount({
          ...likesCount,
          likes_count: res.data,
        });
      })
      
      .catch((e) => {
        console.log(e)
        if (e.response.status == "401") {
          redirect.push("/login");
        }
      });
    }


  };

  useEffect(() => {
    axios.get(`${HOST}current/`, { withCredentials: true }).then((res) => {
      setComment({ ...comment, user: res.data.user });
      setUser({ user: res.data.user, pfp: res.data.img });
    });
  }, []);

  let handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${HOST}comments/`, comment, {
        withCredentials: true,
        headers: { "X-CSRFToken": Cookies.get("csrftoken") },
      })
      .then((res) => {
        setUpdated(updated + 1);
        setComment({
          ...comment,
          desc: "",
        });
       
      })
      .catch((e) => {});
  };

  let handleChange = (e) => {
    setComment({
      ...comment,
      article: slug,
      [e.target.name]: e.target.value,
    });
    setCommentPreview(e.target.value)
  };

  let handleCommentLikes = (e, _id) => {
    e.preventDefault();
    axios
      .post(
        `${HOST}comment_likes/${_id}/`,
        {}, //TODO: the secret is found, send the user username here and manage it in the view.
        {
          withCredentials: true,
          headers: { "X-CSRFToken": Cookies.get("csrftoken") },
        }
      )
      .then((res) => {
        setId(e.target.value);
        setIsCommentLiked(res.data.like);
        setCommentLikesCount(res.data);
        setId(_id)
        setUpdated(updated + 1);
       

       
      });
  };
/*
  useEffect(() => {
    axios
      .get(`${HOST}comment_likes/${_id}/`, { withCredentials: true })
      .then((res) => {
        //FIXME: I got no idea how to fix this yet ,but i will have to fix it
        //setCommentLikesCount(res.data);
        console.log(res.data);
        //setId(comment._id)
        //console.log(_id);

      }).catch((e)=>{
        console.log(e)
      });
  }, [updated]);
  
*/

  useEffect(() => {
    if(_id){
    axios.get(`${HOST}comments/${_id}/`).then((res) => {
      setEditMode(false);
    });
}
  }, [updated]);


  useEffect(() => {
    if(redirect.isReady){
    if(data){
        let arr = data.title.split(" ")
        for(let i = 0;i<arr.length;i++){
          if(arr[i].length>20 || (arr[i].length>6 && arr[i+1]?.length>6)){
            setWordBreak({'wordBreak':'break-all'})
            break


        }
    }
  }
}

  }, [updated,data,redirect.isReady]);


  useEffect(()=>{
    if(redirect.isReady){
    axios.get(`${HOST}comments_of_article/${slug}/`).then((res) => {
      setCommentList(res.data);
    });
  }
  },[updated,redirect.isReady])


  const handleRedirectLogin = () => {
    redirect.push("/login");
    
  };
  const handleRedirectSignUp = () => {
    redirect.push("/signup");
  };

  // new addition, THIS WILL WORK


  


  useEffect(()=>{
    if(data){
      axios.get(`${HOST}fetch/${data.user}/`).then((res)=>{
        setRelatedArticles(res.data.filter((article)=>article.slug!==data.slug))

      })
    }
   

  },[data])

  let [clicked,setClicked] = useState(false)

  const getComments = () => {
    
    if (isAuth) {
      return (
       
          <div>
            <WriteComment redirect={redirect} desc={desc} theme={theme} commentPreview={commentPreview} relatedArticles={relatedArticles} handleSubmit={handleSubmit} handleChange={handleChange} user_={user_}/>
          <div className={styles["divider"]}>
          </div>
         <LoadComment updated={updated} setUpdated={setUpdated} _id={_id} setId={setId} commentList={commentList} comment={comment}   theme={theme} user_={user_} redirect={redirect}/>
        </div>
      );
    } else {
      return (
        <div className={styles["notLoggedIn"]}>
          <h1>Comment Section</h1>
          <button
            className={`${styles["submitButton"]} ${clsx({
              [styles.dark_]:theme.setChecked,
              [styles.light_]:!theme.setChecked
            })} ${styles['btn']}`}
            onClick={() => handleRedirectLogin()}
            
          >
            Login
          </button>
          <button
            onClick={() => handleRedirectSignUp()}
            className={`${styles["submitButton"]} ${clsx({
              [styles.dark_]:theme.setChecked,
              [styles.light_]:!theme.setChecked
            })} ${styles['btn']}`}
          >
            Signup
          </button>
        </div>
      );
    }
  };


  /**/


  let [popup,setPopup] = useState(false)
  const copyToClipboard= ()=>{
    navigator.clipboard.writeText(`https://www.globeofarticles.com/article/${data.slug}/`)

    setPopup(true)
    setTimeout(()=>{
      setPopup(false)
    },1500)



  }


  return (

    data?
    

    
    <div
      onScroll={(e)=>handleScroll(e)}
      className={`${styles["spec-article"]}
      ${clsx({
        [styles.dark_]:theme.setChecked,
        [styles.light_]:!theme.setChecked
      })}`}
    >
      <div className='progressBar' style={{position:'sticky',top:0,left:0,height:'5px',width:progress,backgroundColor:!theme.setChecked?'#1d6f27':'#3CCF4E'}}></div>
        <Head>
    

        <meta name="twitter:card" content="summary_large_image"/>
        <meta property="og:site_name" content="globeofarticles"/>
        <meta property="og:url" content={`www.globeofarticles.com/${data.slug}/`} />
        <meta  key={data.title} property="og:title" content={data.title}/>
        <meta property="og:type" content="article"/>
        <meta key={data.tag} property="article:tag" content={data.tag}/>
        <meta key={data.date} property="article:date" content={data.date}/>
        <meta key={data.author} property="twitter:creator" content={data.user}/>
        <meta key={data.title_img.toString()} property="twitter:image" content={data.title_img} /> 
      </Head>
     <Navigation/>
     
    
      <div className={styles["article-title"]}>
        <div className={styles["left-article-side"]}>
          <div className={styles["top-left-side"]}>
            <div className={styles["article-tag"]} onClick={(e) => handleTagRedirect(e)}>
              <span
              className={`${clsx({
                [styles.dark_]:theme.setChecked,
                [styles.light_]:!theme.setChecked
              })} ${styles['btn']}`}
                style={{
                  borderRadius: "4px",
                  textAlign: "center",
                }}
              >
                {data.tag}
              </span>
            </div>
            <div
              className={styles["article-date"]}
              style={{
                color: theme.setChecked ? "yellowgreen" : "green",
              }}
            >
              {data.date}
            </div>

            <div>
              {!hasLiked ? (
              
                <iconify-icon

                class={clsx({
                  [styles['dislike']]:clicked
                })}
            
              
                width="40" height="40"
                icon='material-symbols:favorite-outline-rounded'   
                  onClick={(e) => handleLike(e) }
                  onFocus={(e)=>setClicked(true)}
                  tabindex='0'
          
                  style={{cursor: "pointer" }}
                />




              ) : (
                <iconify-icon
                class={ clsx({
                  [styles['animate']]:clicked
                })}
                width="40" height="40"
                icon = "material-symbols:favorite"
                  onClick={(e) => handleLike(e)}
                  
                  style={{ color: "red", cursor: "pointer" }}
                />
              )}
              {likesCount.likes_count}
            </div>
          </div>
        <div className={clsx({
        [styles.dark_]:theme.setChecked,
        [styles.light_]:!theme.setChecked
      })}>

      <h1 style={{color:theme.setChecked?'white':'black' ,...wordBreak }}>{data.title}</h1></div>
          <div
            className={styles["article-user"]}
            onClick={() => redirect.push(`/userprofile/${data.user}`)}
          >
            <img className={styles["profile-img"]} src={data.user_profile} />
            <div> {data.user}</div>
          </div>
          <div className={styles["share-links"]}>
            <div>
            <FacebookShareButton
  url={`https://www.globeofarticles.com/article/${data.slug}/`}
  quote={data.description}
  hashtag={'#GlobeofArticles'}
>
  <iconify-icon class={styles['icon']} id={styles['fb']} icon='ri:facebook-box-fill' width='40' height='40' />
</FacebookShareButton>
            </div>
            <div>
              <TwitterShareButton
               url={`https://www.globeofarticles.com/article/${data.slug}/`}
               quote={data.description}
               hashtag={'#GlobeofArticles'}>
              <iconify-icon class={styles['icon']} id={styles['twitter']} icon='mdi-twitter' width='40' height='40' ></iconify-icon>
              </TwitterShareButton>
            </div>
            <div>
              <LinkedinShareButton 
               url={`https://www.globeofarticles.com/article/${data.slug}/`}
               quote={data.description}
               hashtag={'#GlobeofArticles'}>
              <iconify-icon class={styles['icon']} id={styles['linkedin']} icon='mdi:linkedin' width='40' height='40'></iconify-icon>
              </LinkedinShareButton>
            </div>
            <div>
              <RedditShareButton url={`https://www.globeofarticles.com/article/${data.slug}/`}
              title={data.title}>
              <iconify-icon id={styles['reddit']} class={styles['icon']} icon='ph:reddit-logo-fill' width='40' height='40'></iconify-icon>
              </RedditShareButton>
            </div>

            <div>
              <iconify-icon icon='material-symbols:link' titleAccess="Copy URL" style={{cursor:'pointer'}} width='40' height='40' onClick={()=>copyToClipboard()}></iconify-icon>
            </div>
            <div style={{display:popup?'flex':'none'}} className={styles['popupWrap']} >
            <div className={styles['popupDiv']} style={{display:popup?'flex':'none',position:'fixed',bottom:'12px',left:'45%',zIndex:'6',justifyContent:'center',alignItems:'center'}}>Link Copied!</div>
            </div>

          </div>
        </div>
        <div className={styles["title-img-div"]}>
          <img alt="timg" className={styles["article-img"]} src={data.title_img} />
        </div>
      </div>
      <div ref={heightRef}  className={styles["article-desc-div"]}>
       <LoadDescription theme={theme} description={description}/>


      </div>
      <div className={styles["end-of-article-div"]}>
        <div className={styles["twobtns"]}>
          <EditArticle
            redirect={redirect}
            setArticle={setArticle}
            user={user_.user}
            article={data}
          slug={slug}
            description={description}
            theme={theme}
          ></EditArticle>
          <DeleteArticle
            user={user_.user}
            article={data}
            slug={slug}
            redirect={redirect}
          ></DeleteArticle>
        </div>
      </div>
      <div ref={cmntRef} className={styles["comment-section"]} id="cmnt">
        {getComments()}
      </div>
    </div>:<div>Loading...</div>
  )

}



export default SpecificArticle;