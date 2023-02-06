import axios from "axios";
import React,{ useState, useEffect, createContext,useContext } from "react";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { library} from "@fortawesome/fontawesome-svg-core";
import Navigation from "./navig.js";

import {themeContext} from '../pages/_app'

import ListAllArticles, {Filter} from './filtertag';
import {DisplayDialogOrLogin} from "./displayarticles.js";
import ReactPaginate from 'react-paginate';
import HOST from '../config';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

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
    <div>
    <ListAllArticles articles={currentItems} theme={theme} />
    <div className="paginator" >
    <ReactPaginate
      breakLabel="..."
      nextLabel={<ArrowForwardIosIcon></ArrowForwardIosIcon>}
      onPageChange={(e)=>handlePageClick(e)}
      pageRangeDisplayed={5}
      pageCount={pageCount}
      pageClassName="page-item"
      pageLinkClassName="page-link"
      previousClassName="page-item"
      previousLinkClassName="page-link"
      nextClassName="page-item"
      nextLinkClassName="page-link"
      breakClassName="page-item"
      breakLinkClassName="page-link"
      containerClassName="pagination"
      activeClassName="active"
      previousLabel={<ArrowBackIosIcon></ArrowBackIosIcon>}
      renderOnZeroPageCount={null}
      marginPagesDisplayed={2}
    />
    </div>
  </div>
  )
}




const Articles = () => {

  let [articleList, setArticleList] = useState([]);
  let {theme} = useContext(themeContext)


  //map all the tags button, and make a condition based on filtering/searching the input.




  
 
  useEffect(() => {
    axios
      .get(`${host}csrf/`, {
        headers: { Authorization: null },
        withCredentials: true,
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  


  return (
    <div style={{ backgroundColor: theme.setBg, color: theme.setTextColor}} className="main">
      <articleContext.Provider value={articleList}>
        <div className="mainmain">
      <Navigation   ></Navigation>

      <div className='main-containers-div'>
        <div className='website-header'>
          <div className='website-header-div'>
        <h1>A World of <span style={{color:theme.setBg=='#1b1b1b'?'rgb(60, 207, 78)':'#3CCF4E'}}>Articles</span></h1>
        <h2>Globeofarticles is a website that give you the space to express your opinion and to share you experience
          across different topics.
        </h2>
        <div className='btns-wrapper'>
        <DisplayDialogOrLogin></DisplayDialogOrLogin>
        <button onClick={(e)=>{
          window.open('https://www.markdownguide.org/cheat-sheet/')
        }} style={{backgroundColor:theme.setButtonColor,color:theme.setTextColor}} className='create-article-input'>Markdown Guide</button>
        </div>
        </div>
        </div>
        </div>
      
   
        <Filter setArticleList={setArticleList}  isHiddenInput={false} user={''}/>
        </div>
<div className="parent-grid" >
  <PaginatedItems articleList={articleList} theme={theme} itemsPerPage={4}/>
      </div>
     
      </articleContext.Provider>
    </div>
  );
};


export default Articles;
export {articleContext,articleVals}