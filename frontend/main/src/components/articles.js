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

library.add(fas);




const articleContext = createContext()
const articleVals = createContext()

let ListAllArticles = ({ articles,articleList,theme}) => {
 
  const bc = theme === cyanDark.cyan1 ? cyanDark.cyan6 : "white"
  const tagColor = theme === cyanDark.cyan1 ? cyanDark.cyan11 : cyanDark.cyan12

 
  if (articles.length !== 0) {
    return articles.map((article) => {
      return (
        <div
          className="articles" key='0'
          style={{ backgroundColor: theme.setButtonColor, borderColor: bc}}
        >
          <Link key={article._id.toString()}
            to={{
              pathname: `/article/${article._id}/`,
            }}
          >
            <img key={article.title_img.toString()} src={article.title_img} className="image" />
            <h4 key={article.title} className="title" style={{color:theme.setColor}} >
              {article.title}
            </h4>
            <h4 key={article.user} className="user"  style={{color:theme.setColor}}>
              {" "}
              <FontAwesomeIcon key={article.user} icon="fa-solid fa-user" /> {article.user}
            </h4>
            <h4 key={article.date.toString()} className="date"  style={{color:theme.setColor}}>
              <FontAwesomeIcon  key={article.date.toString()} icon="fa-solid fa-calendar" /> {article.date}
            </h4>
            <button key={article.tag} className="tag-sec" disabled>
              <h4 key={article.tag} style={{ color: tagColor }}>{article.tag}</h4>
            </button>
          </Link>
        </div>
      );
    });
  } else {
    return articleList.map((article) => {
      return (
        <div key={article._id.toString()+"1"}
          className="articles" 
          style={{ backgroundColor: theme.setButtonColor, borderColor: bc, color: theme.setColor}}
        >
          <Link
            to={{
              pathname: `/article/${article._id}/`,
            }} key={article._id.toString()}
          >
            <img  key={article.title_img.toString()} src={article.title_img} className="image" />
            <h4 key={article.title} className="title"  style={{color:theme.setColor}}>
              {article.title}
            </h4>
            <h4 key={article.user} className="user" style={{color:theme.setColor}} >
              {" "}
              <FontAwesomeIcon key={article.user} icon="fa-solid fa-user" /> {article.user}
            </h4>
            <h4 key= {article.date.toString()} className="date" style={{ color: theme.setColor }}>
              <FontAwesomeIcon key={article.date.toString()} icon="fa-solid fa-calendar" /> {article.date}
            </h4>
            <button key={article.tag.toString()} className="tag-sec" disabled>
              <h4 key={article.tag.toString()} style={{ color: tagColor }}>{article.tag}</h4>
            </button>
          </Link>
        </div>
      );
    });
  }
};




const Articles = () => {

  let [articleList, setArticleList] = useState([]);
  
  let [tagn, setTag] = useState("");
  let {theme,setTheme} = useContext(themeContext)
 
  const articles = articleList.filter((article) => article.tag === tagn);



  let handleTagChange = (e) => {
    setTag(e.target.value);
  };

  useEffect(() => {
    axios.get("https://backend.globeofarticles.com/articles/").then((res) => {
      setArticleList(res.data);
    });
  }, []);
  useEffect(() => {
    axios
      .get("https://backend.globeofarticles.com/csrf/", {
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


       <div className="sortby">
        <select
          style={{ backgroundColor: theme.setButtonColor, color: theme.setColor}}
          onChange={(e) => handleTagChange(e)}
        >
          <option>Sort By...</option>
          <option name="name" value='programming' className="programming">
            programming
          </option>
          <option value='science' name="name" className="programming">
            science
          </option>
        </select>
      </div>
      <div className="parent-grid">
        
        <ListAllArticles
          articleList={articleList}
          articles={articles}
          theme={theme}
  
        />
      </div>
      </articleContext.Provider>
      <Footer ></Footer>
    </div>
  );
};

export default Articles;
export {articleContext,articleVals,ListAllArticles}