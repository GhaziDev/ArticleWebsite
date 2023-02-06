import axios from "axios";
import { React, useState, useEffect, useContext, createContext } from "react";
import { useNavigate, Link, useParams, redirect } from "react-router-dom";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUser,
  faTag,
  faCalendar,
} from "@fortawesome/free-solid-svg-icons";
import CsrfToken from "./csrf.js";
import Footer from "./footer.js";
import { themeContext } from "../pages/_app";
import { AuthContext } from "../store/provider";
import Dialog from "@mui/material/Dialog";
import Navigation from "./navig.js";

import HOST from "../config.js";
import { Helmet } from "react-helmet";
import ReactMarkDown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkToc from "remark-toc";

import rehypeSlugger from "rehype-slug";
import remarkRehype from "remark-rehype";
//import remarkEmbedder from '@remark-embedder/core';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import remarkGemoji from "remark-gemoji";
import {

  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/cjs/styles/prism";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";


import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LinkIcon from "@mui/icons-material/Link";


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
  let handleEdit = (e) => {
    e.preventDefault();
    axios
      .put(`${HOST}articles/${id}/`, article, {
        withCredentials: true,
        headers: { "X-CSRFToken": Cookies.get("csrftoken") },
      })
      .then((res) => {
        setArticle({
          ...article,
          description: res.data,
          date: res.data.date,
        });
        setOpen(false);
        redirect(`/article/${id}`);
        setUpdate(update + 1);
      })
      .catch((e) => {
        console.log(e.response.data);
      });
  };

  let handleDescChange = (e) => {
    setArticle({
      ...article,
      description: e.target.value,
    });
  };

  useEffect(() => {
    axios.get(`${HOST}articles/${id}/`).then((res) => {
      setArticle(res.data);
    });
  }, [update]);

  if (user === article.user) {
    //comparing the current user id to the owner user id (owner of post)
    return (
      <div className="edit-article-div">
        <button
          className="edit-btn"
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
          className="dialog"
        >
          <div class="dialog-content" style={{ backgroundColor: theme.setBg }}>
            <form
              method="put"
              onSubmit={(e) => handleEdit(e)}
              className="dialog-form"
              style={{ backgroundColor: theme.setBg }}
            >
              <div className="back-btn-div">
                <button
                  onClick={(e) => setOpen(false)}
                  style={{ backgroundColor: "red", color: "white" }}
                  className="back-btn"
                >
                  &larr;
                </button>
              </div>
              <div className="page-name">
                <h1 style={{ color: theme.setTextColor }}>Edit Page</h1>
              </div>
              <div
                className="description-container"
                style={{
                  backgroundColor: theme.setBg,
                  color: theme.setTextColor,
                }}
              >
                <textarea
                  required
                  minLength={"2000"}
                  className="description-input1"
                  value={description}
                  onChange={(e) => handleDescChange(e)}
                  style={{
                    backgroundColor: theme.setButtonColor,
                    color: theme.setTextColor,
                  }}
                ></textarea>
                <div>
                  <div
                    className="description-output"
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
                    <ReactMarkDown
                      children={description}
                      remarkPlugins={[
                        remarkGfm,
                        remarkMath,
                        remarkToc,
                        remarkRehype,
                        remarkGemoji,
                      ]}
                      rehypePlugins={[rehypeKatex, rehypeSlugger]}
                      components={{
                        code({ node, inline, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || "");
                          return !inline && match ? (
                            <SyntaxHighlighter
                              children={String(children).replace(/\n$/, "")}
                              style={
                                theme.setBg === "#1b1b1b" ? oneDark : oneLight
                              }
                              language={match[1]}
                              PreTag="div"
                              {...props}
                            />
                          ) : (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          );
                        },
                      }}
                    ></ReactMarkDown>
                  </div>
                </div>
              </div>
              <div className="edit-btn-div">
                <button
                  type="submit"
                  className="edit-btn"
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
        redirect("/");
      })
      .catch((e) => {
        console.log(e.response.data);
      });
  };

  if (user === article.user) {
    return (
      <div className="delete-div">
        <button
          className="delete-btn"
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
            <button  className="delete-btn" type="submit">
              Delete
            </button>
          </form>
        </Dialog>
      </div>
    );
  }
  return null;
};

const SpecificArticle = () => {
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
  const [comment, setComment] = useState({
    article_id: 0,
    user_id: "",
    desc: "",
    date: new Date(),
    is_author: false,
  });
  const [commentEdit, setCommentEdit] = useState({ description: comment.desc });
  const [wordBreak,setWordBreak] = useState({'word-break':'normal'})

  const { desc, date } = comment;
  const [updated, setUpdated] = useState(0);
  const [user_, setUser] = useState("");
  const [likesCount, setLikesCount] = useState({ like: false, likes_count: 0 });
  const [commentLikesCount, setCommentLikesCount] = useState({
    like: false,
    likes_count: 0,
  });
  const [isCommentLiked, setIsCommentLiked] = useState(false);
  const [editMode, setEditMode] = useState(false);
  let redirect = useNavigate();
  let { id } = useParams();

  let { isAuth } = useContext(AuthContext);

  let { theme } = useContext(themeContext);

  let [hasLiked, setHasLiked] = useState();
  let [_id, setId] = useState();

  const handleWordBreak = ()=>{
   
  }

  let handleTagRedirect = (e) => {
    setTimeout(() => {
      redirect("/");
    }, 5000);
  };
  useEffect(() => {
    axios.get(`${HOST}likes/${id}/`, { withCredentials: true }).then((res) => {
      setLikesCount(res.data);
      console.log(res.data);
      setHasLiked(res.data.like);
    });
  }, [likesCount.likes_count]);

  let handleLike = () => {
    axios
      .post(`${HOST}likes/${id}/`, likesCount, {
        withCredentials: true,
        headers: { "X-CSRFToken": Cookies.get("csrftoken") },
      })
      .then((res) => {
        setHasLiked(!hasLiked);
        console.log(res.data);
        setLikesCount({
          ...likesCount,
          likes_count: res.data,
        });
      })
      .catch((e) => {
        if (e.response.status == "401") {
          redirect("/login");
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
        console.log(res.data);
      })
      .catch((e) => {});
  };

  let handleChange = (e) => {
    setComment({
      ...comment,
      article: id,
      [e.target.name]: e.target.value,
      author: comment.user === user_.user,
    });
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
       

        console.log(res.data);
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
    axios
      .get(`${HOST}articles/${id}/`)
      .then((res) => {
        setArticle(res.data);
        console.log(res.data);
        let arr = res.data.title.split(" ")
        for(let i = 0;i<arr.length;i++){
          if(arr[i].length>20 || (arr[i].length>6 && arr[i+1].length>6)){
            setWordBreak({'word-break':'break-all'})
            break
          }

        }

        axios.get(`${HOST}comments_of_article/${id}/`).then((res) => {
          console.log(res.data);
          setCommentList(res.data);
        });
      })
      .catch((e) => {
        if (e.response) {
          if (e.response.status === 401) {
          }
        }
      });
  }, [updated]);

  const handleRedirectLogin = () => {
    redirect("/login");
  };
  const handleRedirectSignUp = () => {
    redirect("/signup");
  };

  const handleCommentDelete = (e, _id) => {
    e.preventDefault();
    axios
      .delete(`${HOST}comments/${_id}/`, {
        withCredentials: true,
        headers: { "X-CSRFToken": Cookies.get("csrftoken") },
      })
      .then((res) => {
        console.log(res.data);
        setUpdated(updated + 1);
      });
  };

  const handleEditMode = (e, id) => {
    setEditMode(!editMode);
    setId(id);
    setCommentEdit(comment.desc);
  };

  const handleCommentEditChange = (e, id) => {
    setCommentEdit({
      ...commentEdit,
      description: e.target.value,
    });
  };

  const handleCommentEdit = (e, _id) => {
    e.preventDefault();
    axios
      .put(`${HOST}comments/${_id}/`, commentEdit, {
        withCredentials: true,
        headers: { "X-CSRFToken": Cookies.get("csrftoken") },
      })
      .then((res) => {
        console.log(res.data);
      });
    setUpdated(updated + 1);
    setId(_id);
  };

  const getComments = () => {
    if (isAuth) {
      return (
        <div className="cmnt-div">
          <form method="post" onSubmit={(e) => handleSubmit(e)}>
            <CsrfToken></CsrfToken>
            <div className="csub">
              <h1>Comment Section</h1>
              <div className="input-img-group">
                <div class="imgsec">
                  <img src={user_.pfp} className="profile-img" />
                </div>
                <textarea
                  name="desc"
                  required
                  className="cmntinp"
                  onChange={(e) => handleChange(e)}
                  value={desc}
                  placeholder="Write your comment here"
                  style={{
                    backgroundColor: theme.setButtonColor,
                    color: theme.setTextColor,
                  }}
                ></textarea>
              </div>
              <div className="cmnt-output-container">
                {desc ? (
                  <div
                    style={{
                      backgroundColor: theme.setButtonColor,
                      color: theme.setTextColor,
                    }}
                    className="cmnt-output"
                  >
                    <h2
                      style={{
                        color:
                          theme.setBg === "#1b1b1b" ? "yellowgreen" : "green",
                      }}
                    >
                      Preview
                    </h2>
                    <ReactMarkDown
                      children={desc}
                      remarkPlugins={[
                        remarkGfm,
                        remarkMath,
                        remarkToc,
                        remarkRehype,
                        remarkGemoji,
                      ]}
                      rehypePlugins={[rehypeKatex, rehypeSlugger]}
                      components={{
                        code({ node, inline, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || "");
                          return !inline && match ? (
                            <SyntaxHighlighter
                              children={String(children).replace(/\n$/, "")}
                              style={
                                theme.setBg === "#1b1b1b" ? oneDark : oneLight
                              }
                              language={match[1]}
                              PreTag="div"
                              {...props}
                            />
                          ) : (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          );
                        },
                      }}
                    ></ReactMarkDown>
                  </div>
                ) : null}
              </div>
              <div className="submit-div">
                <button
                  type="submit"
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

          <div className="divider">
            <div></div>
          </div>
          {commentList.map((comment, index) => {
            //TODO: set if comment is liked by current user in the comment serializer to detect it in the frontend

            return (
              <div className="cmntsec" key={comment._id.toString()}>
                <div className="cmntinfo">
                  <img
                    src={user_.pfp}
                    onClick={(e) => redirect(`/userprofile/${comment.user}`)}
                    className="profile-img"
                  />
                </div>

                <div className="descmnt" key={comment.desc}>
                  <div className="user-date-cmnt-sec">
                    <div
                      className="cmnt-user"
                      onClick={(e) => redirect(`/userprofile/${comment.user}`)}
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
                      className="cmnt-date"
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
                    <div className="cmnt-likes">
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
                    </div>
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
                        className="cmnteditinp"
                        defaultValue={comment.desc}
                        value={commentEdit.description}
                        onChange={(e) => handleCommentEditChange(e)}
                      />
                      <div
                        style={{
                          backgroundColor: theme.setButtonColor,
                          color: theme.setTextColor,
                        }}
                        className="cmnt-output-edit"
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
                        <ReactMarkDown
                          children={commentEdit.description}
                          remarkPlugins={[
                            remarkGfm,
                            remarkMath,
                            remarkToc,
                            remarkRehype,
                            remarkGemoji,
                          ]}
                          rehypePlugins={[rehypeKatex, rehypeSlugger]}
                          components={{
                            code({
                              node,
                              inline,
                              className,
                              children,
                              ...props
                            }) {
                              const match = /language-(\w+)/.exec(
                                className || ""
                              );
                              return !inline && match ? (
                                <SyntaxHighlighter
                                  children={String(children).replace(/\n$/, "")}
                                  style={
                                    theme.setBg === "#1b1b1b"
                                      ? oneDark
                                      : oneLight
                                  }
                                  language={match[1]}
                                  PreTag="div"
                                  {...props}
                                />
                              ) : (
                                <code className={className} {...props}>
                                  {children}
                                </code>
                              );
                            },
                          }}
                        ></ReactMarkDown>
                      </div>
                      <button
                        type="submit"
                        style={{
                          background: theme.setButtonColor,
                          color: theme.setTextColor,
                        }}
                      >
                        Submit Change
                      </button>
                    </form>
                  ) : (
                    <ReactMarkDown
                      children={comment.desc}
                      remarkPlugins={[
                        remarkGfm,
                        remarkMath,
                        remarkToc,
                        remarkRehype,
                        remarkGemoji,
                      ]}
                      rehypePlugins={[rehypeKatex, rehypeSlugger]}
                      components={{
                        code({ node, inline, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || "");
                          return !inline && match ? (
                            <SyntaxHighlighter
                              children={String(children).replace(/\n$/, "")}
                              style={
                                theme.setBg === "#1b1b1b" ? oneDark : oneLight
                              }
                              language={match[1]}
                              PreTag="div"
                              {...props}
                            />
                          ) : (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          );
                        },
                      }}
                    ></ReactMarkDown>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      );
    } else {
      return (
        <div className="nav-div">
          <h1>Comment Section</h1>
          <button
            className="l-div"
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
            className="l-div"
          >
            Signup
          </button>
        </div>
      );
    }
  };
  return (
    <div
      className="spec-article"
      style={{ backgroundColor: theme.setBg, color: theme.setColor }}
    >
     <Navigation/>
      <Helmet>
        <title>{article.title}</title>
        <meta name="image" content={article.title_img} />
      </Helmet>
      <div className="article-title">
        <div className="left-article-side">
          <div className="top-left-side">
            <div className="article-tag" onClick={(e) => handleTagRedirect(e)}>
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
              className="article-date"
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
          {console.log(wordBreak)}
          <h1 style={{ color: theme.setColor,...wordBreak }}>{article.title}</h1>
          <div
            className="article-user"
            onClick={() => redirect(`/userprofile/${article.user}`)}
          >
            <img className="profile-img" src={article.user_profile} />
            <div> {article.user}</div>
          </div>
          <div className="share-links">
            <div>
              <FacebookIcon fontSize="large"></FacebookIcon>
            </div>
            <div>
              <TwitterIcon fontSize="large"></TwitterIcon>
            </div>
            <div>
              <LinkedInIcon fontSize="large"></LinkedInIcon>
            </div>
            <div>
              <LinkIcon fontSize="large"></LinkIcon>
            </div>
          </div>
        </div>
        <div className="title-img-div">
          <img alt="timg" className="article-img" src={article.title_img} />
        </div>
      </div>
      <div className="article-desc-div">
        <p className="article-desc">
          <ReactMarkDown
          className={theme.setClassName} 
            children={description}
            remarkPlugins={[
              remarkGfm,
              remarkMath,
              remarkToc,
              remarkRehype,
              remarkGemoji,
            ]}
            rehypePlugins={[rehypeKatex, rehypeSlugger]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <SyntaxHighlighter
                    children={String(children).replace(/\n$/, "")}
                    style={theme.setBg === "#1b1b1b" ? oneDark : oneLight}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  />
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          ></ReactMarkDown>
        </p>
      </div>
      <div className="end-of-article-div">
        <div className="twobtns">
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
      <div className="comment-section" id="cmnt">
        {getComments()}
      </div>
    </div>
  );
};

export default SpecificArticle;
