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
    console.log(articles);
    return articles.map((article) => {
      return (
        <div
          className="articles"
          style={{ backgroundColor: theme.setButtonColor, borderColor: bc}}
        >
          <Link
            to={{
              pathname: `/article/${article.id}/`,
            }}
          >
            <img src={article.title_img} className="image" />
            <h4 className="title" style={{color:theme.setColor}} >
              {article.title}
            </h4>
            <h4 className="user"  style={{color:theme.setColor}}>
              {" "}
              <FontAwesomeIcon icon="fa-solid fa-user" /> {article.user}
            </h4>
            <h4 className="date"  style={{color:theme.setColor}}>
              <FontAwesomeIcon icon="fa-solid fa-calendar" /> {article.date}
            </h4>
            <button className="tag-sec" disabled>
              <h4 style={{ color: tagColor }}>{article.tag}</h4>
            </button>
          </Link>
        </div>
      );
    });
  } else {
    return articleList.map((article) => {
      return (
        <div
          className="articles"
          style={{ backgroundColor: theme.setButtonColor, borderColor: bc, color: theme.setColor}}
        >
          <Link
            to={{
              pathname: `/article/${article.id}/`,
            }}
          >
            <img src={article.title_img} className="image" />
            <h4 className="title"  style={{color:theme.setColor}}>
              {article.title}
            </h4>
            <h4 className="user" style={{color:theme.setColor}} >
              {" "}
              <FontAwesomeIcon icon="fa-solid fa-user" /> {article.user}
            </h4>
            <h4 className="date" style={{ color: theme.setColor }}>
              <FontAwesomeIcon icon="fa-solid fa-calendar" /> {article.date}
            </h4>
            <button className="tag-sec" disabled>
              <h4 style={{ color: tagColor }}>{article.tag}</h4>
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
    axios.get("http://127.0.0.1:8000/articles/").then((res) => {
      setArticleList(res.data);
    });
  }, []);
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
      <head>
        <script
          src="https://kit.fontawesome.com/fa2d825a51.js"
          crossorigin="anonymous"
        ></script>
      </head>
      <articleContext.Provider value={articleList}>
        
      <Navigation   ></Navigation>


       <div className="sortby">
        <select
          style={{ backgroundColor: theme.setButtonColor, color: theme.setColor}}
          onChange={(e) => handleTagChange(e)}
        >
          <option>Sort By...</option>
          <option name="name" className="programming">
            programming
          </option>
          <option name="name" className="programming">
            another tag
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