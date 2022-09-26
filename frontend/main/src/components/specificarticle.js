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
import convert from 'htmr';


const EditArticle = ({user,article,theme,description,id,setArticle,redirect})=>{
    let [open,setOpen] = useState(false)
    let handleEdit = (e)=>{
        e.preventDefault()
        axios.put(`http://127.0.0.1:8000/articles/${id}/`,article,{withCredentials:true,headers:{'X-CSRFToken':Cookies.get('csrftoken')}}).then((res)=>{
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
        setArticle(
            {
                ...article,description:e.target.value
            }
        )
    }

    if(user===article.user){ //comparing the current user id to the owner user id (owner of post)

        return(
        <div className='edit-div'>
        <button className='edit-btn' onClick={()=>setOpen(true)} style={{backgroundColor:theme.setButtonColor,color:theme.setTextColor}}>Edit</button>
        <Dialog  open={open} onClose={()=>setOpen(false)}>
            <button onClick={()=>setOpen(false)} style={{backgroundColor:'red',color:'white'}} className='edit-btn'>Close</button>
            <form width={100} method='put' onSubmit={(e)=>handleEdit(e)}>
            <TextField
        multiline={true}
        inputProps={{minLength:4000,style:{backgroundColor:theme.setButtonColor,color:theme.setTextColor,width:'600px',height:'800px'}}}
        maxRows={7}
          required
          fullWidth={true} maxWidth='lg' 
          name="description"
          value={description}
          onChange={(e) => handleDescriptionChange(e)}
          placeholder="Write a description"
        ></TextField>
        <button type='submit' className='edit-btn' style={{backgroundColor:theme.setButtonColor,color:theme.setTextColor}}>Submit Change</button>
                
                </form>      

        </Dialog>
    </div>
        )
    }
    return null
}

const DeleteArticle = ({user,article,id,redirect})=>{
    let [open,setOpen] = useState(false)
    let handleDelete= (e)=>{
        e.preventDefault()
        axios.delete(`http://127.0.0.1:8000/articles/${id}/`,{withCredentials:true,headers:{'X-CSRFToken':Cookies.get('csrftoken')}}).then((res)=>{
            redirect('/')
        }).catch((e)=>{
            console.log(e.response.data)
        })
    }

    if(user===article.user){
        return(
            <div className='delete-div'>
                <button className='delete-btn' onClick={()=>setOpen(true)} >Delete</button>
                <Dialog open={open} onClose ={()=>setOpen(false)}>
        
                <form method='delete' onSubmit={(e)=>handleDelete(e)}>
                    Are you sure you want to delete this article?
                    <button className='confirm-div' type='submit'>Yes</button>
                </form>

                <button  className='cancel-div'  onClick={()=>setOpen(false)}>Cancel</button>

                </Dialog>

            </div>
        )
    }
    return null

}



const SpecificArticle = ()=>{
    const [article,setArticle] = useState({'title':'','title_img':'','description':'','user':'','tag':'','date':''})
    const {description} = article
    const [commentList,setCommentList] = useState([])
    const [comment,setComment] = useState({article:0,user:'',desc:'',date: new Date()})
    const {desc,date} = comment
    const [updated,setUpdated] = useState(0)
    const [user_,setUser] = useState('')
    let redirect  = useNavigate()
    let {id} = useParams()
    
    let [allowed,setAllowed] = useState(false)
    let {theme} = useContext(themeContext)


     useEffect(()=>{
        axios.get('http://127.0.0.1:8000/current/',{withCredentials:true}).then((res)=>{
            setComment(
                {...comment
                ,user:res.data
        })
           setUser(
            res.data
           )
        })
     },[])

    let handleSubmit = (e)=>{
        e.preventDefault()
        axios.post('http://127.0.0.1:8000/comments/',comment,{withCredentials:true,headers:{'X-CSRFToken':Cookies.get('csrftoken')}}).then((res)=>{
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
            [e.target.name]:e.target.value
            }
        )
    }
    
    useEffect(()=>{
        axios.get(`http://127.0.0.1:8000/articles/${id}/`).then((res)=>{
            setArticle(res.data)
            
            axios.get(`http://127.0.0.1:8000/comments/`).then((res)=>{
                setCommentList(
                     res.data.filter((comment)=>{return id==comment.article})
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
            axios.get('http://127.0.0.1:8000/isauthenticated/',{withCredentials:true}).then((res)=>{
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
            <div>
             {commentList.map((comment)=>{
                return(
                    <div className='cmntsec'>

                      
                        <div className='cmnt-user'>
                        <FontAwesomeIcon icon={faUser}/> 
                         {comment.user}    </div>    <div className='cmnt-date'>
                        {comment.date}
                        </div>


                        <div className = 'descmnt'>
                        {comment.desc}
                        </div>
                       
                      <p></p>
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
            <div className='breaker'>
            <button onClick = {()=>handleRedirectSignUp()} style={{backgroundColor:theme.setButtonColor,color:theme.setTextColor}} className='l-div'>Signup</button>
            </div>
            </div>
            )
        }
    }
    return(
        <div className='spec-article' style={{backgroundColor:theme.setBg,color:theme.setColor}}>
            <div className='navi'>
            <button style = {{backgroundColor:theme.setButtonColor,color:theme.setTextColor}} className='l-div'  onClick={()=>redirect('/')}><FontAwesomeIcon icon={faHome}></FontAwesomeIcon></button>
                <ThemeSwitch ></ThemeSwitch>
            </div>

        <div className='article-title'>
            <h1>{article.title}</h1>
            <img alt='timg' className='article-img' src={article.title_img}/>
            </div>
            <p className='article-desc' >
                    {convert(article.description)}
            </p>
            <div className='article-user'>
                <FontAwesomeIcon icon={faUser}></FontAwesomeIcon>
                <Link to={{
                    pathname:`/userprofile/${article.user}/`
                    }}>{article.user}</Link>
            </div>
            <div className='article-tag'>
                <FontAwesomeIcon icon={faTag}></FontAwesomeIcon>
                <Link to={{
                    pathname:`/tag/${article.tag}/`
                }}>{article.tag}</Link>
            </div>
            <div className='article-date'>
                <FontAwesomeIcon icon={faCalendar}></FontAwesomeIcon>
                {article.date}
            </div>
            <div className='twobtns'>
            <EditArticle redirect={redirect} setArticle={setArticle} user={user_} article={article} id={id} description = {description} theme={theme}></EditArticle>
            <DeleteArticle  user={user_} article={article} id={id} redirect={redirect}></DeleteArticle>
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