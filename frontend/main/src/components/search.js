import React,{useState,useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {themeContext} from '../App.js'
import {articleContext} from './articles'
import SearchBar from '../styling/searchbar.js';
import CloseIcon from '@mui/icons-material/Close';



function ListSearchResults({input,results,handleRedirect}){
    const {theme} = useContext(themeContext)
    if(!input){
        return null
    }
        return(
            <div>
                {results.map((result)=>{
                    return(
                        <div className='result-div' style={{color:theme.setColor}}>
                        <button className='result-button' onClick={()=>handleRedirect(result)} style={{color:theme.setColor,backgroundColor:theme.setButtonColor,border:`1px ${theme.setTextColor} solid`}}>
                        <div className='result-title'>
                            {result.title}
                        </div>
                        <div className='result-user'>
                            {result.user}
                        </div>
                        <div className='result-date'>
                            {result.date}
                        </div>
                        </button>
                  
                    </div>
                        
                    )

                })}
            </div>
        )

}

function Search(){
    let [input,setInput] = useState('')
    let articleList = useContext(articleContext)
    const {theme} = useContext(themeContext)
    const [expand,setExpand] = useState({width:1,hideBtn:false,height:'0px',active:false})
   
    // every 5 indexes of articleList is 1 page
    let results = articleList?.slice(articleList).filter((article)=>article?.title.toLowerCase().trim().includes(input.toLowerCase().trim()))

    let redirect = useNavigate()
    let handleInput = (e)=>{
        setInput(
            e.target.value
        )

    }
    let handleRedirect = (result)=>{
        redirect(`/article/${result?._id}`)

    }

    let handleSearchBarWidth = (e,set)=>{
        setExpand({width:'0px',hideBtn:set,active:set})
    }
    


    return(
        <div className='searchp-div'>
            
            <SearchBar placeholder='Search for a title...' active={expand.active}  value={input}   style={{backgroundColor:'white',color:'black',borderColor:'white'}} className='inpinp' onChange={(e)=>handleInput(e)}></SearchBar>
            <div className='results-div'><ListSearchResults handleRedirect={handleRedirect}  results={results} input={input} ></ListSearchResults></div>
            
        </div>
    )


}

export default Search;