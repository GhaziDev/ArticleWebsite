import React,{useState,createContext} from 'react';
import Login from './components/login.js';
import Signup from './components/signup.js';
import Articles from './components/articles.js';
import SpecificArticle from './components/specificarticle.js';
import {Routes,Route,BrowserRouter as Router} from 'react-router-dom';
import UserProfile from './components/userprofile.js';
import './App.css'
import PasswordResetAsk, { PasswordResetPage } from './components/reset.js';
import 'draft-js/dist/Draft.css';
import { EditProfile } from './components/userprofile.js';
import Verify from './components/verify.js';


const themeContext = createContext()


function App() {
  const [theme, setTheme] = useState({
    setBg:localStorage.getItem('theme'),
    setButtonColor:localStorage.getItem('buttonColor'),
    setColor:localStorage.getItem('color'),
    setTextColor:localStorage.getItem('textColor'),
    setIcon:localStorage.getItem('icon'),
}


)

if(!localStorage.getItem('theme')){
  localStorage.setItem('theme','#E1E2E1')
  localStorage.setItem('color','black')
  localStorage.setItem('buttonColor','#F5F5F6')
  localStorage.setItem('textColor','black')
  localStorage.setItem('icon','https://thenewfirstbucket.s3.ap-southeast-2.amazonaws.com/media/sun-color-icon.svg')

}


  return(
    <themeContext.Provider value={{theme,setTheme}}>

    <Router>
    <Routes>
        <Route path='login' element={<Login/>}></Route>
        <Route path='signup' element={<Signup/>}></Route>
        <Route path='' element={<Articles theme={theme} setTheme={setTheme}/>}></Route>
        <Route path='article/:id' element = {<SpecificArticle />}></Route>
        <Route path='userprofile/:user' element={<UserProfile theme={theme} />}></Route>
        <Route path='reset/' element={<PasswordResetAsk></PasswordResetAsk>}></Route>
        <Route path='reset-page/:token/' element={<PasswordResetPage/>}></Route>
        <Route path='userprofile/:user/edit/' element={<EditProfile/>}></Route>
        <Route path='verify/:token/:user' element={<Verify/>}></Route>
        
    </Routes>
    </Router>
    </themeContext.Provider>
  )

}



export default App;
export {themeContext};