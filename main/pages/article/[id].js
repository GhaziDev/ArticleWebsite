import axios from "axios";
import React,{ useState, useEffect, useContext, createContext, memo } from "react";
import Cookies from "js-cookie";
import { useDeferredValue } from "react";

import CsrfToken from "../../components/csrf"
import { themeContext } from "../../pages/_app";
import { AuthContext } from "../../store/provider";
import { Dialog, TextField } from "@mui/material";
import Navigation, { ThemeSwitch } from "../../components/navig.js"; 
import {unified} from 'unified';
import { Suspense } from "react";

import HOST from "../../config.js";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  RedditShareButton
} from 'next-share';

import { Helmet } from "react-helmet";
import ReactMarkDown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkToc from "remark-toc";

import rehypeSlugger from "rehype-slug";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
//import remarkEmbedder from '@remark-embedder/core';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import remarkGemoji from "remark-gemoji";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/cjs/styles/prism";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LinkIcon from "@mui/icons-material/Link";
import RedditIcon from "@mui/icons-material/Reddit";
import { useRouter } from "next/router.js";
import styles from '../../styles/styling/specificarticle.module.css'
import Link from 'next/link'
import Head from "next/head";
import { currentUser } from "../../store/currentprovider";



export async function getServerSideProps({params}){
  try{
  const res = await fetch(`${HOST}articles/${params.id}/`)
  const article = res.json()
  return {
    props: {data}, // will be passed to the page component as props
  }
}
catch(e){
  return {
    props:{}
  }
}
}







const Markdown = memo(function Markdown({children,theme}){
  return <ReactMarkDown className={theme.setClassName}
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

  const handleEditMode = (e, id) => {
    setEditMode(!editMode);
    setId(id);
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
  const handleCommentEditChange = (e, id) => {
    setCommentEdit({
      ...commentEdit,
      description: e.target.value,
    });
  };


  return(
    <Suspense>
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
                className={styles["cmnt-user"]}
                onClick={(e) => redirect.push(`/userprofile/${comment.user}`)}
                key={comment.user}
                style={{ color: theme.setTextColor }}
              >
                {comment.user}{" "}
              </div>
              <div
                style={{
                  color:
                    theme.setBg === "#1b1b1b" ? "yellowgreen" : "green",
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
                  style={{
                    backgroundColor: theme.setButtonColor,
                    color: theme.setTextColor,
                  }}
                  className={styles["cmnteditinp"]}
                  defaultValue={comment.desc}
                  value={commentEdit.description}
                  onChange={(e) => handleCommentEditChange(e)}
                />
                <div
                  style={{
                    backgroundColor: theme.setButtonColor,
                    color: theme.setTextColor,
                  }}
                  className={styles["cmnt-output-edit"]}
                >
                  {" "}
                  <h2
                    style={{
                      color:
                        theme.setBg === "#1b1b1b"
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

                  className={styles['submitButton']}
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
    </Suspense>
  )
})

const WriteComment = memo(function WriteComment({redirect,desc,handleSubmit,handleChange,commentPreview,theme,relatedArticles,user_}){
  return(
    <div className={styles["cmnt-div"]}>
    <div className={styles['heading-div']}>
      <h1>Related Articles</h1>
      </div>
    <div className={styles["parent-grid"]}>
    
      {relatedArticles.map((article)=>{
        return (
          <div
          className={styles["articles"]} key={article._id.toString()+'1'}
          style={{ backgroundColor: theme.setButtonColor}}
        >
          <Link key={article._id.toString()}
            href={{
              pathname: `/article/${article.slug}/`,
            }}
          >
            <div className={styles['image-div']}>
            <img key={article.thumb_img} src={article.thumb_img} className={styles["image"]} />
            </div>
            <div className={styles['article-tag-like']}>
              <button key={article.tag_id} style={{ backgroundColor:theme.setBg,color: theme.setColor }} className={styles['tag-sec']}>{article.tag}</button>
              <div className={styles['article-like-div']} style={{color:theme.setTextColor}}>
              <FavoriteIcon  style={{color:'red'}} />
              {article.likes}</div>
              </div>
    <div className={styles['title-card']}>
            <h4 key={article.title} className={styles["title"]} style={{color:theme.setColor}} >
              {article.title}
            </h4>
            </div>
  
            
            <div className={styles['separator']}>
              <div className={styles['userinfo']}>
            <h4 key={article.user_id} className={styles["user"]}  style={{color:theme.setColor}}>
              {" "}
              <img key={article.user_profile.toString()} src={article.user_profile}/> {article.user}
            </h4>
            </div>
            <h4 key={article.date.toString()} className={styles["date"]}  style={{color:theme.setColor}}>
              <FontAwesomeIcon  key={article.date.toString()} icon="fa-solid fa-calendar" /> {article.date}
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
            className={styles["cmntinp"]}
            onChange={(e) => handleChange(e)}
            value={desc}
            placeholder="Write your comment here"
            style={{
              backgroundColor: theme.setButtonColor,
              color: theme.setTextColor,
            }}
          ></textarea>
        </div>
        <div className={styles["cmnt-output-container"]}>
        
          {desc ? (
            <div
              style={{
                backgroundColor: theme.setButtonColor,
                color: theme.setTextColor,
              }}
              className={styles["cmnt-output"]}
            >
              <h2
                style={{
                  color:
                    theme.setBg === "#1b1b1b" ? "yellowgreen" : "green",
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
            className={styles['submitButton']}
            style={{
              background: theme.setButtonColor,
              color: theme.setTextColor,
            }}
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
  id,
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
      .put(`${HOST}articles/${id}/`,{...article,description:descEdit}, {
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
        redirect.push(`/article/${id}`);
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
    axios.get(`${HOST}articles/${id}/`).then((res) => {
      setArticle(res.data);
      setDescEdit(res.data.description)
    });
    
  }, [update,redirect.isFallback]);

  if (user === article.user) {
    //comparing the current user id to the owner user id (owner of post)
    return (
      <div className={styles["edit-article-div"]}>
        <button
          className={styles["edit-btn"]}
          onClick={() => setOpen(true)}
          style={{
            backgroundColor: theme.setButtonColor,
            color: theme.setTextColor,
          }}
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
          <div class="dialog-content" style={{ backgroundColor: theme.setBg }}>
            <form
              method="put"
              onSubmit={(e) => handleEdit(e)}
              className={styles["dialog-form"]}
              style={{ backgroundColor: theme.setBg }}
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
              <div className={styles["page-name"]}>
                <h1 style={{ color: theme.setTextColor }}>Edit Page</h1>
              </div>
              <div
                className={styles["description-container"]}
                style={{
                  backgroundColor: theme.setBg,
                  color: theme.setTextColor,
                }}
              >
                <textarea
                  required
                  minLength={"2000"}
                  
                  className={styles["description-input1"]}
                  value={descEdit}
                  onChange={(e) => handleDescChange(e)}
                  style={{
                    backgroundColor: theme.setButtonColor,
                    color: theme.setTextColor,
                  }}
                ></textarea>
                <div>
                  <div
                    className={styles["description-output"]}
                    style={{
                      backgroundColor: theme.setButtonColor,
                      color: theme.setTextColor,
                    }}
                  >
                    <h1
                      style={{
                        color:
                          theme.setBg === "#1b1b1b" ? "yellowgreen" : "green",
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
                  className={styles["edit-btn"]}
                  style={{
                    backgroundColor: theme.setButtonColor,
                    color: theme.setTextColor,
                  }}
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

const DeleteArticle = ({ user, article, id, redirect }) => {
  const { theme } = useContext(themeContext);
  let [open, setOpen] = useState(false);

  let handleDelete = (e) => {
    e.preventDefault();
    axios
      .delete(`${HOST}articles/${id}/`, {
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
          className={styles["delete-btn"]}
          onClick={() => setOpen(true)}
          style={{
            backgroundColor: theme.setButtonColor,
            color: theme.setTextColor,
          }}
        >
          Delete
        </button>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          style={{ backgroundColor: theme.setBg }}
        >
          <form
            method="delete"
            onSubmit={(e) => handleDelete(e)}
            style={{
              display: "flex",
              justifyContent: "center",
              flexFlow: "column wrap",
              alignItems: "center",
              padding:'25px',

              borderRadius:'3px',
              backgroundColor: theme.setBg,
              color: theme.setTextColor,
            }}
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



  const [commentEdit, setCommentEdit] = useState({ description: comment.desc });
  const [wordBreak,setWordBreak] = useState({'wordBreak':'normal'})

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
  let redirect = useRouter();
  let { id } = redirect.query;

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


  useEffect(()=>{
    setDomLoaded(true)
  },[redirect.isFallback])
  useEffect(() => {
    if(redirect.isReady){

    axios.get(`${HOST}likes/${id}/`, { withCredentials: true }).then((res) => {
      setLikesCount(res.data);
      setHasLiked(res.data.like);
    });
  }
  }, [likesCount.likes_count]);

  let handleLike = () => {
    axios
      .post(`${HOST}likes/${id}/`, likesCount, {
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
        if (e.response.status == "401") {
          redirect.push("/login");
        }
      });
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
      article: id,
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
        setArticle(data);

     
        let arr = res.data.title.split(" ")
        for(let i = 0;i<arr.length;i++){
          if(arr[i].length>20 || (arr[i].length>6 && arr[i+1].length>6)){
            setWordBreak({'wordBreak':'break-all'})
            break


        }
      }

  }, [updated]);

  useEffect(()=>{
    axios.get(`${HOST}comments_of_article/${id}/`).then((res) => {
      setCommentList(res.data);
    });
  },[updated])

  const handleRedirectLogin = () => {
    redirect.push("/login");
    
  };
  const handleRedirectSignUp = () => {
    redirect.push("/signup");
  };



  

  useEffect(()=>{
    if(article.user){
      axios.get(`${HOST}fetch/${article.user}/`).then((res)=>{
        setRelatedArticles(res.data.filter(artc=>artc._id!=article._id))
      })
    }
   
  },[article.user])

  const getComments = () => {
    if (isAuth &&domLoaded) {
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
            className={styles["submitButton"]}
            style={{
              backgroundColor: theme.setButtonColor,
              color: theme.setTextColor,
            }}
            onClick={() => handleRedirectLogin()}
            
          >
            Login
          </button>
          <button
            onClick={() => handleRedirectSignUp()}
            style={{
              backgroundColor: theme.setButtonColor,
              color: theme.setTextColor,
            }}
            className={styles["submitButton"]}
          >
            Signup
          </button>
        </div>
      );
    }
  };

  if(data){


  return (domLoaded &&
    <div
      className={styles["spec-article"]}
      style={{ backgroundColor: theme.setBg, color: theme.setColor }}
    >
     <Navigation/>
      <Head>
        <title>{article.title}</title>
        <meta property="og:image" content={article.title_img} />
        
      </Head>
      <div className={styles["article-title"]}>
        <div className={styles["left-article-side"]}>
          <div className={styles["top-left-side"]}>
            <div className={styles["article-tag"]} onClick={(e) => handleTagRedirect(e)}>
              <span
                style={{
                  backgroundColor: theme.setButtonColor,
                  borderRadius: "4px",
                  textAlign: "center",
                }}
              >
                {article.tag}
              </span>
            </div>
            <div
              className={styles["article-date"]}
              style={{
                color: theme.setBg == "#1b1b1b" ? "yellowgreen" : "green",
              }}
            >
              {article.date}
            </div>

            <div>
              {!hasLiked ? (
                <FavoriteBorderIcon
                  onClick={(e) => handleLike(e)}
                  fontSize="large"
                  style={{ color: theme.setTextColor, cursor: "pointer" }}
                />
              ) : (
                <FavoriteIcon
                  onClick={(e) => handleLike(e)}
                  fontSize="large"
                  style={{ color: "red", cursor: "pointer" }}
                />
              )}
              {likesCount.likes_count}
            </div>
          </div>
        
          <h1 style={{ color: theme.setColor,...wordBreak }}>{article.title}</h1>
          <div
            className={styles["article-user"]}
            onClick={() => redirect.push(`/userprofile/${article.user}`)}
          >
            <img className={styles["profile-img"]} src={article.user_profile} />
            <div> {article.user}</div>
          </div>
          <div className={styles["share-links"]}>
            <div>
            <FacebookShareButton
  url={`${HOST}article/${article.slug}/`}
  quote={article.description}
  hashtag={'#GlobeofArticles'}
>
  <FacebookIcon fontSize='large' />
</FacebookShareButton>
            </div>
            <div>
              <TwitterShareButton
               url={`${HOST}article/${article.slug}/`}
               quote={article.description}
               hashtag={'#GlobeofArticles'}>
              <TwitterIcon fontSize="large"></TwitterIcon>
              </TwitterShareButton>
            </div>
            <div>
              <LinkedinShareButton 
               url={`${HOST}article/${article.slug}/`}
               quote={article.description}
               hashtag={'#GlobeofArticles'}>
              <LinkedInIcon fontSize="large"></LinkedInIcon>
              </LinkedinShareButton>
            </div>
            <div>
              <RedditShareButton url={`${HOST}article/${article.slug}/`}
              title={article.title}>
              <RedditIcon fontSize='large'></RedditIcon>
              </RedditShareButton>
            </div>
            <div>
              <LinkIcon titleAccess="Copy URL" style={{cursor:'pointer'}} fontSize="large" onClick={()=>navigator.clipboard.writeText(`${HOST}article/${article.slug}/`)}></LinkIcon>
            </div>
          </div>
        </div>
        <div className={styles["title-img-div"]}>
          <img alt="timg" className={styles["article-img"]} src={article.title_img} />
        </div>
      </div>
      <div className={styles["article-desc-div"]}>
       <LoadDescription theme={theme} description={description}/>


      </div>
      <div className={styles["end-of-article-div"]}>
        <div className={styles["twobtns"]}>
          <EditArticle
            redirect={redirect}
            setArticle={setArticle}
            user={user_.user}
            article={article}
            id={id}
            description={description}
            theme={theme}
          ></EditArticle>
          <DeleteArticle
            user={user_.user}
            article={article}
            id={id}
            redirect={redirect}
          ></DeleteArticle>
        </div>
      </div>
      <div className={styles["comment-section"]} id="cmnt">
        {getComments()}
      </div>
    </div>
  );
}
 return(
  <div>PAGE NOT FOUND</div>
 )

}

export default SpecificArticle;