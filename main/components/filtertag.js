import React,{useState,useEffect, useContext} from 'react';
import axios from 'axios';
import {themeContext} from '../pages/_app'
import Button from '../styles/styling/button';

import  Dialog  from '@mui/material/Dialog';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import HOST from '../config.js'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { useRouter } from 'next/router';
import Link from 'next/link'
import styles from '../styles/styling/filtertag.module.css'





function ListAllArticles({ articles,theme}){
  
   
    if (articles.length !== 0) {
      return articles.map((article) => {
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
              <div key={article.thumb_img.toString()+"1"} className={styles['image-div']}>
              <img key={article.thumb_img} src={article.thumb_img} className={styles["image"]} />
              </div>
              <div key={article.tag_id+"1"} className={styles['article-tag-like']}>
                <button key={article.tag_id} style={{ backgroundColor:theme.setBg,color: theme.setColor }} className={styles['tag-sec']}>{article.tag}</button>
                <div key={article.likes} className={styles['article-like-div']} style={{color:theme.setTextColor}}>
                <FavoriteIcon key={article.likes+1} style={{color:'red'}} />
                {article.likes}</div>
                </div>
      <div  key={article.title+"1"} className={styles['title-card']}>
              <h4 key={article.title} className={styles["title"]} style={{color:theme.setColor}} >
                {article.title}
              </h4>
              </div>
    
              
              <div key={article.user_id+1} className={styles['separator']}>
                <div key={article.user_id+2} className={styles['userinfo']}>
              <h4 key={article.user_id} className={styles["user"]}  style={{color:theme.setColor}}>
                {" "}
                <img key={article.user_profile.toString()} src={article.user_profile}/> {article.user}
              </h4>
              </div>
              <h4 key={article.date.toString()} className={styles["date"]}  style={{color:theme.setColor}}>
                <FontAwesomeIcon  key={article.date.toString()+"1"} icon="fa-solid fa-calendar" /> {article.date}
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
    let [tagList,setTagList] = useState([])
    let [open,setOpen] = useState(false)
    let [isSelected,setIsSelected] = useState([])
    let {theme} = useContext(themeContext)
    
    let redirect= useRouter()







    useEffect(()=>{
      const filterData = setTimeout(()=>{
        axios.post(`${HOST}filter/`,filter).then((res)=>{
          setArticleList(res.data)
    
        }).catch((e)=>{})
      },600) //debouncing/ limit rating

      return ()=>clearTimeout(filterData) //unmounting in case the user stopped interacting with an input
      },[filter.value])

    useEffect(()=>{
      axios.get(`${HOST}tags/`).then((res)=>{
        setTagList(res.data)
      })
    },[])

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

        //TODO: proper tag redirect.replace.replaceion using html attribute: id
        //TODO: create a context in specific article and pass it the tag value, consume the context in this file so that 
        // the tag is selected.
        
    
      };
      let handleTitleChange = (e)=>{
        setFilter({...filter,'title':e.target.value,value:filter.value+1})
      }


      return(
        <div className={styles['container-div']}>
        <div className={styles['sort-container']} style={{backgroundColor:theme.setButtonColor}}  >

<div className="sortby" >
  <button onClick={(e)=>setOpen(true)} className={styles['search-input']} style={{backgroundColor:'white'}}>Filter by Tag</button>
  <Dialog open={open} onClose={(e)=>setOpen(false)} minWidth='xl'>
    <div className={styles['filter-dialog']}>
 
      <div className={styles['filter-input']}>

    <h1>Filter By Tag</h1>
  </div>
  <div className={styles['selection-btns']}  >
    {tagList.map((tag)=>{
      return <div key={tag+"1"} className={styles['tag-btns']}>
         <Button id={tag} key={tag} theme={theme} name={tag} filter={filter} onClick={(e)=>handleTagChange(e,tag)}    value={tag} className={styles['tag-btn']}>
     {tag}
   </Button>
        </div>
    })}
  
   <button  onClick={(e)=>handleTagChange(e,'cancel')}  className={styles['cancel-button']}>Clear All</button> 
   </div>
   </div>
   </Dialog>

 </div>
 <input type='text' hidden={isHiddenInput} placeholder='Search by username' value={filter.user} className={styles['search-input']} onChange={(e)=>handleUserChange(e)}></input>
 <input type='text' placeholder='Search by title' value={filter.title} className={styles['search-input']} onChange={(e)=>handleTitleChange(e)}></input>

</div>
</div>
      )
    
    


}

export {Filter}
export default ListAllArticles;