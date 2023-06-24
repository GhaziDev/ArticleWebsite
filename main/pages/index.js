import React,{ useState, createContext,useContext,useEffect } from "react";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { library} from "@fortawesome/fontawesome-svg-core";
//import Navigation from "../components/navig.js";

import {themeContext} from '../pages/_app'

import ListAllArticles, {Filter} from '../components/filtertag';

import {DisplayDialogOrLogin} from "../components/displayarticles.js";
import ReactPaginate from 'react-paginate';
/*
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
*/
import styles from '../styles/styling/articles.module.scss'
//import Head from "next/head";
import dynamic from "next/dynamic.js";

import {clsx} from 'clsx';




const ArrowBackIosIcon = dynamic(()=>import('@mui/icons-material/ArrowBackIos'))
const ArrowForwardIosIcon = dynamic(()=>import('@mui/icons-material/ArrowForwardIos'))
const Head = dynamic(()=>import('next/head'))
const Navigation = dynamic(()=>import('../components/navig.js'))






library.add(fas);


const articleContext = createContext()
const articleVals = createContext()

function PaginatedItems({ itemsPerPage,articleList,theme}) { //managing items by paginating them.
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = useState(0);

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
    <div className={`${styles["paginator"]} `}>
    <ReactPaginate
      breakLabel="..."
      nextLabel={<ArrowForwardIosIcon className={`${clsx({[styles.dark]:theme.setChecked,[styles.light]:!theme.setChecked})}  ${styles['btn']}`}></ArrowForwardIosIcon>}
      onPageChange={(e)=>handlePageClick(e)}
      pageRangeDisplayed={5}
      pageCount={pageCount}
      pageClassName={styles["page-item"]}
      pageLinkClassName={`${styles["page-link"]}`}
      previousClassName={`${styles["page-item"]}`}
      previousLinkClassName={`${styles["page-link"]}`
    }
      nextClassName={`${styles["page-item"]}`
    }
      nextLinkClassName={`${styles["page-link"]}`}
      breakClassName={styles["page-item"]}
      breakLinkClassName={styles["page-link"]}
      containerClassName={`${styles["pagination"]}
      ${clsx({[styles.dark]:theme.setChecked,[styles.light]:!theme.setChecked})} ${styles['btn']}`}
      activeClassName={`${styles["active"]}  ${clsx({[styles.dark]:theme.setChecked,[styles.light]:!theme.setChecked})}`}
      activeLinkClassName = {`${clsx({[styles.dark]:theme.setChecked,[styles.light]:!theme.setChecked})} ${styles['btn']}`}
      previousLabel={<ArrowBackIosIcon className={`${clsx({[styles.dark]:theme.setChecked,[styles.light]:!theme.setChecked})} ${styles['btn']}`}></ArrowBackIosIcon>}
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
  let [isLoading,setIsLoading] = useState(true) // will be used for skeleton loading

  useEffect(()=>{
    setTimeout(()=>{setIsLoading(false)},1500)
  },[])

  //map all the tags button, and make a condition based on filtering/searching the input.





  

  


  return (
    
<div  className={`${styles['main']} ${clsx({
  [styles.dark]:theme.setChecked,
  [styles.light]:!theme.setChecked
})}`}>

      <Head>
        <title>Globe of Articles</title>
        <meta key={'unique1'} name="robots" content="all" />
        <meta key={'unique2'} property="og:title" content='A World of Articles'></meta>
        <meta property="og:description" content="Share your experience anytime, anywhere"/>
        <meta property="og:site_name" content="globeofarticles"/>
        <meta property="og:url" content={`www.globeofarticles.com/`} />

        <meta key={'unique3'} name="google" content="notranslate" />

      </Head>

      <articleContext.Provider value={articleList}>
        <div className={styles['mainmain']}>
        
       <Navigation   ></Navigation>

      <div className={styles['main-containers-div']}>
        <div className={styles['website-header']}>
        <div className={styles['headerImg']}>
            <img height='300' width='1000'  src={!theme.setChecked?'https://thenewfirstbucket.s3.ap-southeast-2.amazonaws.com/logo_7.png':'https://thenewfirstbucket.s3.ap-southeast-2.amazonaws.com/logo_8.png'}/>

            </div>
          <div className={styles['website-header-div']}>
            
        <div className={styles['btns-wrapper']}>
        <DisplayDialogOrLogin></DisplayDialogOrLogin>
        <button onClick={(e)=>{
          window.open('https://www.markdownguide.org/cheat-sheet/')
        }}  className={`${styles['create-article-input']}
        ${clsx({[styles.dark]:theme.setChecked,[styles.light]:!theme.setChecked})} ${styles['btn']}`}>Markdown Guide</button>
        </div>
        </div>
        </div>
        </div>
      
   
        <Filter setArticleList={setArticleList}  isHiddenInput={false} user={''}/>
        </div>

<div className={`${styles["parent-grid"]} ${clsx({
  [styles.dark]:theme.setChecked,
  [styles.light]:!theme.setChecked
})}` } >
  <PaginatedItems articleList={articleList} theme={theme} itemsPerPage={4}/>

      </div>
     
      </articleContext.Provider>
    </div>
  );
  
};


export default Articles;
export {articleContext,articleVals}