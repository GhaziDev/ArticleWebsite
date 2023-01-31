import '../styles/globals.css'
import { AuthProvider } from '../store/provider'
import React,{ createContext,useState ,useEffect} from 'react'
import CurrentUserProvider from '../store/currentprovider'

import 'highlight.js/styles/github-dark.css'






const themeContext = createContext()

function MyApp({ Component, pageProps }) {

  const [domLoaded,setDomLoaded] = useState(false)


  const [theme, setTheme] = useState({
    setBg:typeof window !== "undefined" ? localStorage.getItem('theme'):false,
    setButtonColor:typeof window !== "undefined" ? localStorage.getItem('buttonColor'):false,
    setColor:typeof window !== "undefined" ? localStorage.getItem('color'):false,
    setTextColor:typeof window !== "undefined" ? localStorage.getItem('textColor'):false,
    setIcon:typeof window !== "undefined" ? localStorage.getItem('icon'):false,
    setClassName:typeof window !== "undefined" ? localStorage.getItem('className'):false
}

)


useEffect(()=>{
  setDomLoaded(true)
})

if(typeof window!=='undefined' ){
   if(!localStorage.getItem('theme')){
  localStorage.setItem('theme','#1b1b1b')
  localStorage.setItem('checked',true)
  localStorage.setItem('color','#ffffff')
  localStorage.setItem('buttonColor','rgb(37,37,37)')
  localStorage.setItem('textColor','#ffffff')
  localStorage.setItem('icon', 'https://thenewfirstbucket.s3.ap-southeast-2.amazonaws.com/media/dark-mode-icon.svg')
  localStorage.setItem('className','dark')
  setTheme({
    setBg:localStorage.getItem('theme'),
            setButtonColor: localStorage.getItem('buttonColor'),
            setColor: localStorage.getItem('color'),
            setTextColor: localStorage.getItem('textColor'),
            setIcon: localStorage.getItem('icon'),
            setClassName: localStorage.getItem('className')

  })
}

}


  return domLoaded && <div><AuthProvider ><CurrentUserProvider><themeContext.Provider value={{theme,setTheme}}><Component {...pageProps} /></themeContext.Provider></CurrentUserProvider></AuthProvider></div>
}

export default MyApp

export {themeContext}
