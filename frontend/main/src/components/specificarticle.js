import axios from 'axios';
import {React,useState,useEffect, useContext} from 'react';
import {useNavigate,Link,useParams} from 'react-router-dom';
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faHome,faUser,faTag,faCalendar} from '@fortawesome/free-solid-svg-icons'
import CsrfToken from './csrf.js'
import Footer from './footer.js'
import {themeContext} from '../App.js'
import { Dialog, TextField } from '@mui/material';
import {ThemeSwitch} from './navig.js'
import parse, { domToReact } from 'html-react-parser';
import { Editor } from 'draft-js';
import convert from 'htmr';
import { EditorState } from 'draft-js';
import "./react-draft-wysiwyg.css";
import draftToHtml from 'draftjs-to-html';
import { convertToRaw } from 'draft-js';
import HOST from '../config.js';




const EditArticle = ({user,article,theme,description,id,setArticle,redirect})=>{
    let [open,setOpen] = useState(false)
    const [editorState, setEditorState] = useState(() =>
    EditorState?.createEmpty(),
    )
    let handleEdit = (e)=>{
        e.preventDefault()
        axios.put(`${HOST}articles/${id}/`,article,{withCredentials:true,headers:{'X-CSRFToken':Cookies.get('csrftoken')}}).then((res)=>{
            setArticle({
                ...article,description:res.data

            })
            setOpen(false)
            redirect(`/article/${id}`)

        }).catch((e)=>{
            console.log(e.response.data)
        })
    }

    let handleDescriptionChange = (e)=>{
        let html = draftToHtml(convertToRaw(editorState.getCurrentContent()));
        setArticle(
          {
            ...article,
            'description':html
          }
        )
        
    }

    if(user===article.user){ //comparing the current user id to the owner user id (owner of post)

        return(
        <div className='a'>
           
         <head><meta charSet="utf-8" /></head>
        <button className='edit-btn' onClick={()=>setOpen(true)} style={{backgroundColor:theme.setButtonColor,color:theme.setTextColor}}>Edit</button>

        <Dialog  open={open} onClose={()=>setOpen(false)} fullWidth={true} maxWidth='lg' className='dialog'>
            <button onClick={()=>setOpen(false)} style={{backgroundColor:'red',color:'white'}} className='edit-btn'>Close</button>
            <div class='dialog-content'>
            <form  method='put' onSubmit={(e)=>handleEdit(e)}className='dialog-form'>
                <div className='editor-div'>
            <Editor UploadEnabled wrapperClassName='editor'  onChange={(e)=>handleDescriptionChange(e)} editorClassName='texteditor'editorState={editorState} onEditorStateChange={setEditorState}></Editor>
            </div>
        <button type='submit' className='edit-btn' style={{backgroundColor:theme.setButtonColor,color:theme.setTextColor}}>Submit Change</button>
                
                </form>      
                </div>

        </Dialog>
    </div>
        )
    }
    return null
}

const DeleteArticle = ({user,article,id,redirect})=>{
    const {theme} = useContext(themeContext)
    let [open,setOpen] = useState(false)
    let handleDelete= (e)=>{
        e.preventDefault()
        axios.delete(`${HOST}articles/${id}/`,{withCredentials:true,headers:{'X-CSRFToken':Cookies.get('csrftoken')}}).then((res)=>{
            redirect('/')
        }).catch((e)=>{
            console.log(e.response.data)
        })
    }

    if(user===article.user){
        return(
            <div className='delete-div' >
                <button className='delete-btn' onClick={()=>setOpen(true)} >Delete</button>
                <Dialog open={open} onClose ={()=>setOpen(false)} style={{backgroundColor:theme.setBg}}>
        
                <form method='delete' onSubmit={(e)=>handleDelete(e)} style={{display:'flex',justifyContent:'center',flexFlow:'column wrap',alignItems:'center',backgroundColor:theme.setBg,color:theme.setTextColor}}>
                    Are you sure you want to delete this article?
                    <button className='delete-btn' type='submit'>Delete</button>
                </form>


                </Dialog>

            </div>
        )
    }
    return null

}



const SpecificArticle = ()=>{
    const [article,setArticle] = useState({'title':'','title_img':'','description':'','user':'','tag':'','date':'','userprofile':''})
    const {description} = article
    const [commentList,setCommentList] = useState([])
    const [comment,setComment] = useState({article_id:0,user_id:'',desc:'',date: new Date(),is_author:false})
    const {desc,date} = comment
    const [updated,setUpdated] = useState(0)
    const [user_,setUser] = useState('')
    let redirect  = useNavigate()
    let {id} = useParams()
    
    let [allowed,setAllowed] = useState(false)
    let {theme} = useContext(themeContext)
    let [open,setOpen] = useState(false)
    const [editorState, setEditorState] = useState(() =>
    EditorState?.createEmpty(),
    )


     useEffect(()=>{
        axios.get(`${HOST}current/`,{withCredentials:true}).then((res)=>{
            setComment(
                {...comment
                ,user:res.data.user
        })
           setUser(
            {'user':res.data.user,
            'pfp':res.data.img
            }
           )
        })
     },[])

    let handleSubmit = (e)=>{
        e.preventDefault()
        axios.post(`${HOST}comments/`,comment,{withCredentials:true,headers:{'X-CSRFToken':Cookies.get('csrftoken')}}).then((res)=>{
            setUpdated(updated+1)
            setComment({
                ...comment,
                desc:''
            })
        }).catch((e)=>{
        })
    }


    let handleChange = (e)=>{
        setComment(
            {
            ...comment,
            article:id,
            [e.target.name]:e.target.value,
            author:comment.user===user_.user, // herehhhhhhhhhhhhhhh

            }
        )
    }
    
    useEffect(()=>{
        axios.get(`${HOST}articles/${id}/`).then((res)=>{
            setArticle(res.data)
            console.log(res.data)
            
            axios.get(`${HOST}comments_of_article/${id}/`).then((res)=>{
                console.log(res.data)
        
                setCommentList(
                     res.data
                )


            })
            }).catch((e)=>{
                if(e.response){
                    if(e.response.status===401){

                        


                    }
                }
            })
        },[updated])
    
        useEffect(()=>{
            axios.get(`${HOST}isauthenticated/`,{withCredentials:true}).then((res)=>{
                setAllowed(true)

        }).catch((e)=>{
            setAllowed(false)
        })
    },[])

    const handleRedirectLogin = ()=>{
        redirect('/login')
    }
    const handleRedirectSignUp = ()=>{
        redirect('/signup')
    }
    const getComments = ()=>{
        if(allowed){
        return(
            <div className='cmnt-div'>

             {commentList.map((comment)=>{
                return(
                    <div className='cmntsec' key={comment._id.toString()}>
                        <div className='cmntinfo' >
    
                        <div className='cmnt-user' key={comment.user} style={{color:theme.setTextColor}}>
                        <img src={user_.pfp} className='profile-img' />
                         {comment.user}    </div>    <div className='cmnt-date' key={comment.date.toString()}>
                         {comment.date}
                        </div>
                        <div className='isauthor' style={{display:comment.is_author?'block':'none'}}>Author</div>
                        </div>

                        <div className = 'descmnt' key={comment.desc}>
                        {comment.desc}
                        </div>
                       
                    </div>
                )
            })}
            <form method='post' onSubmit={(e)=>handleSubmit(e)}>
                    <CsrfToken></CsrfToken>
                    <div className='csub'>
                <textarea name='desc' required className='cmntinp' onChange={(e)=>handleChange(e)} value={desc} placeholder='Write your comment here'></textarea>
                <button type='submit'>Submit</button>
                </div>
                </form>
            </div>
        )
        }
        else{
            return(
                 <div className='nav-div'>
            <button className='l-div' style={{backgroundColor:theme.setButtonColor,color:theme.setTextColor}} onClick={()=>handleRedirectLogin()}>Login</button>
            <button onClick = {()=>handleRedirectSignUp()} style={{backgroundColor:theme.setButtonColor,color:theme.setTextColor}} className='l-div'>Signup</button>
            </div>
            )
        }

    }
    return(
        <div className='spec-article' style={{backgroundColor:theme.setBg,color:theme.setColor}}>
            <div className='navi'>
            <div  className='l-div' style={{color:theme.setColor}}  onClick={()=>redirect('/')}>Home</div>
                <ThemeSwitch ></ThemeSwitch>
            </div>

        <div className='article-title'>
       
            <div className='left-article-side'>
            <div className='top-left-side'>
        <div className='article-tag'>
                <span style={{backgroundColor:theme.setButtonColor,borderRadius:'4px',textAlign:'center'}}>{article.tag}</span>
            </div>
            <div className='article-date' style={{color:theme.setBg==='#E1E2E1'?'#5A5A5A':'#D3D3D3'}}>
                {article.date}
            </div>
            </div>
            <h1 style={{color:theme.setColor}}>{article.title}</h1>
            <div className='article-user'>
            <Link to={{
                    pathname:`/userprofile/${article.user}/`
                    }}  style={{display:'flex',alignItems:'flex-start',textDecoration:'none',color:theme.setBg==='#E1E2E1'?'#2622fb':'#00e5fe',gap:'12px'}}>
                <img  className='profile-img' src={article.user_profile}/>
                {article.user}</Link>

            </div>
            </div>
            <img alt='timg'  className='article-img' src={article.title_img}/>
           
            </div>
            <div className='article-desc-div'>
            <p className='article-desc' >
                    {convert(article.description)}
            </p>
            </div>
            <div className='end-of-article-div'>
           
            <div className='twobtns'>
            <EditArticle redirect={redirect} setArticle={setArticle} user={user_} article={article} id={id} description = {description} theme={theme}></EditArticle>
            <DeleteArticle  user={user_.user} article={article} id={id} redirect={redirect}></DeleteArticle>
            </div>
            </div>
            <div className='comment-section' id='cmnt' >
                <h1>Comment Section</h1>
                {getComments()}
                
              
                
            </div>
            <Footer ></Footer>

        </div>
    )
}

export default SpecificArticle;