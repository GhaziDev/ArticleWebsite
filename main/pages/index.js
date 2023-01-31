import axios from "axios";
import React,{ useState, useEffect, createContext,useContext } from "react";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { library} from "@fortawesome/fontawesome-svg-core";
import Navigation from "../components/navig.js";

import {themeContext} from '../pages/_app'

import ListAllArticles, {Filter} from '../components/filtertag';
import {DisplayDialogOrLogin} from "../components/displayarticles.js";
import ReactPaginate from 'react-paginate';
import HOST from '../config';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import styles from '../styles/styling/articles.module.css'
import Head from "next/head.js";


library.add(fas);


const host = HOST

const articleContext = createContext()
const articleVals = createContext()

function PaginatedItems({ itemsPerPage,articleList,theme}) { //managing items by paginating them.
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = useState(0);
  const [selectedPage,setSelectedPage] = useState();

  // Simulate fetching items from another resources.
  // (This could be items from props; or items loaded in a local state
  // from an API endpoint with useEffect and useState)
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = articleList.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(articleList.length / itemsPerPage);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % articleList.length;
    setItemOffset(newOffset);
  };
  return(
    <>
    <ListAllArticles articles={currentItems} theme={theme} />
    <div className={styles["paginator"]} >
    <ReactPaginate
      breakLabel="..."
      nextLabel={<ArrowForwardIosIcon></ArrowForwardIosIcon>}
      onPageChange={(e)=>handlePageClick(e)}
      pageRangeDisplayed={5}
      pageCount={pageCount}
      pageClassName={styles["page-item"]}
      pageLinkClassName={styles["page-link"]}
      previousClassName={styles["page-item"]}
      previousLinkClassName={styles["page-link"]}
      nextClassName={styles["page-item"]}
      nextLinkClassName={styles["page-link"]}
      breakClassName={styles["page-item"]}
      breakLinkClassName={styles["page-link"]}
      containerClassName={styles["pagination"]}
      activeClassName={styles["active"]}
      previousLabel={<ArrowBackIosIcon></ArrowBackIosIcon>}
      renderOnZeroPageCount={null}
      marginPagesDisplayed={2}
    />
    </div>
  </>
  )
  

}




const Articles = () => {

  let [articleList, setArticleList] = useState([]);
  let {theme} = useContext(themeContext)


  //map all the tags button, and make a condition based on filtering/searching the input.




  

  


  return (
    <div style={{ backgroundColor: theme.setBg, color: theme.setTextColor}} className={styles['main']}>

      <Head>
        <title>Globe of Articles</title>
        <meta name="robots" content="all" />
        <meta property="og:title" content='Globe of articles'></meta>
        <meta name="google" content="notranslate" />

      </Head>

      <articleContext.Provider value={articleList}>
        <div className={styles['mainmain']}>
        
      <Navigation   ></Navigation>

      <div className={styles['main-containers-div']}>
        <div className={styles['website-header']}>
          <div className={styles['website-header-div']}>
        <h1>A World of <span style={{color:theme.setBg=='#1b1b1b'?'rgb(60, 207, 78)':'#3CCF4E'}}>Articles</span></h1>
        <h2>Globeofarticles is a website that give you the space to express your opinion and to share you experience
          across different topics.
        </h2>
        <div className={styles['btns-wrapper']}>
        <DisplayDialogOrLogin></DisplayDialogOrLogin>
        <button onClick={(e)=>{
          window.open('https://www.markdownguide.org/cheat-sheet/')
        }} style={{backgroundColor:theme.setButtonColor,color:theme.setTextColor}} className={styles['create-article-input']}>Markdown Guide</button>
        </div>
        </div>
        </div>
        </div>
      
   
        <Filter setArticleList={setArticleList}  isHiddenInput={false} user={''}/>
        </div>

<div className={styles["parent-grid"]} >
  <PaginatedItems articleList={articleList} theme={theme} itemsPerPage={4}/>

      </div>
     
      </articleContext.Provider>
    </div>
  );
  
};


export default Articles;
export {articleContext,articleVals}