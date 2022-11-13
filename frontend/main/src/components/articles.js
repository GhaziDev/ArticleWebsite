import axios from "axios";
import { React, useState, useEffect, createContext,useContext } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { library} from "@fortawesome/fontawesome-svg-core";
import Navigation from "./navig.js";
import { cyanDark} from "@radix-ui/colors";
import Footer from "./footer.js";
import {themeContext} from '../App.js'
import Search from './search.js'
import DateRangeIcon from '@mui/icons-material/DateRange';
import {Dialog} from '@mui/material';
import Button from '../styling/button';
import {Filter,ListAllArticles} from './filtertag';
import {DisplayDialogOrLogin} from "./displayarticles.js";
import ReactPaginate from 'react-paginate';
import ReactDOM from 'react-dom';

library.add(fas);




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
    <div className="paginator">
    <ReactPaginate
      breakLabel="..."
      nextLabel="next >"
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
      previousLabel="< previous"
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




  
 
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/csrf/", {
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
      <Navigation   ></Navigation>

      <div className='main-containers-div'>
      <DisplayDialogOrLogin></DisplayDialogOrLogin>
   
        <Filter setArticleList={setArticleList}  isHiddenInput={false} user={''}/>
        </div>

<div className="parent-grid" >
  <PaginatedItems articleList={articleList} theme={theme} itemsPerPage={4}/>

      </div>
     
      </articleContext.Provider>
      <div className='footer-container'>
      <Footer ></Footer>
      </div>
    </div>
  );
};


export default Articles;
export {articleContext,articleVals,ListAllArticles}