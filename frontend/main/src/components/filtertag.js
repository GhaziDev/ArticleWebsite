import {useState,useEffect, useContext} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import {themeContext} from '../App.js'
import Button from '../styling/button';
import { Dialog } from '@mui/material';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'


function ListAllArticles({ articles,theme}){
  
   
    if (articles.length !== 0) {
      return articles.map((article) => {
        return (
          <div
            className="articles" key={article._id.toString()+'1'}
            style={{ backgroundColor: theme.setButtonColor}}
          >
            <Link key={article._id.toString()}
              to={{
                pathname: `/article/${article._id}/`,
              }}
            >
              <img key={article.title_img} src={article.title_img} className="image" />
                <button key={article.tag_id} style={{ backgroundColor:theme.setBg,color: theme.setColor }} className='tag-sec'>{article.tag}</button>
  
              <h4 key={article.title} className="title" style={{color:theme.setColor}} >
                {article.title.length>40?article.title.replace(article.title.slice(27),'...'):article.title}
              </h4>
              <div style={{border:'0.5px solid',color:'GrayText'}} ></div>
              <div className='separator'>
                <div className='userinfo'>
              <h4 key={article.user_id} className="user"  style={{color:theme.setColor}}>
                {" "}
                <img key={article.user_profile.toString()} src={article.user_profile}/> {article.user}
              </h4>
              </div>
              <h4 key={article.date.toString()} className="date"  style={{color:theme.setColor}}>
                <FontAwesomeIcon  key={article.date.toString()} icon="fa-solid fa-calendar" /> {article.date}
              </h4>
              </div>
            </Link>
          </div>
        );
      });
    } 
    else {
        return (
          <div>
            <h1>NO RESULTS FOUND</h1>
          </div>
        );
    }
  };
  
  


function Filter({isHiddenInput,setArticleList,user}){
    let [filter, setFilter] = useState({'tag':['All'],user:user,value:0,title:''});
    let [focus,setFocus] = useState(false)
    let [open,setOpen] = useState(false)
    let {theme} = useContext(themeContext)






    useEffect(()=>{
      const filterData = setTimeout(()=>{
        axios.post(`https://www.backend.globeofarticles.com/filter/`,filter).then((res)=>{
          setArticleList(res.data)
        })
      },600) //debouncing/ limit rating

      return ()=>clearTimeout(filterData)
      },[filter.value])
    


      let handleUserChange = (e)=>{
        setFilter({
          ...filter,'user':e.target.value,value:filter.value+1
        })
      }
      let handleTagChange = (e,name) => {
        if(name==='cancel'){
          setFilter({...filter,'tag':['All'],'value':filter.value+1})
        }
        else if(filter.tag.includes(name)){
    
          setFilter({...filter,
            'tag':filter.tag.filter((t)=>t!==name),'value':filter.value+1})
        }
        else{
    
          setFilter({...filter,'tag':[
            ...filter.tag,name
          ],value:filter.value+1})
    
        }
    
      };
      let handleTitleChange = (e)=>{
        setFilter({...filter,'title':e.target.value,value:filter.value+1})
      }


      return(
        <div className='container-div'>
        <div className='sort-container' style={{backgroundColor:theme.setButtonColor}}  >

<div className="sortby" >
  <button onClick={(e)=>setOpen(true)} className='search-input' style={{backgroundColor:'white'}}>Filter by Tag</button>
  <Dialog open={open} onClose={(e)=>setOpen(false)} minWidth='xl'>
    <div className='filter-dialog'>
 
      <div className='filter-input'>

    <h1>Filter By Tag</h1>
  </div>
  <div className='selection-btns'  >
   <Button theme={theme} name={'programming'} filter={filter} onClick={(e)=>handleTagChange(e,'programming')}    value='programming' className='tag-btn'>
     Programming
   </Button>
   <Button theme={theme} name={'science'} filter={filter} onClick={(e)=>handleTagChange(e,'science')}    value='programming' className='tag-btn'>
     Science
   </Button>
   <button  onClick={(e)=>handleTagChange(e,'cancel')}  className='cancel-button'>Clear All</button> 
   </div>
   </div>
   </Dialog>
 </div>
 <input type='text' hidden={isHiddenInput} placeholder='Search by username' value={filter.user} className='search-input' onChange={(e)=>handleUserChange(e)}></input>
 <input type='text' placeholder='Search by title' value={filter.title} className='search-input' onChange={(e)=>handleTitleChange(e)}></input>
</div>
</div>
      )
    
    


}

export {Filter,ListAllArticles};