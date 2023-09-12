import '../styles/globals.css'
import { AuthProvider } from '../store/provider'
import React,{ createContext,useState ,useEffect} from 'react'
import CurrentUserProvider from '../store/currentprovider'

import 'highlight.js/styles/github-dark.css'

import Head from 'next/head'


export async function getInitialProps({ Component, ctx }) {
  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }
  const theme = {
    setIcon:localStorage.getItem('icon')||'https://thenewfirstbucket.s3.ap-southeast-2.amazonaws.com/media/sun-color-icon.svg',
    setChecked:localStorage.getItem('checked')||'false',

  }

  return { ...pageProps, theme };
}


const themeContext = createContext()

function MyApp({ Component, pageProps }) {

  const [domLoaded,setDomLoaded] = useState(false)


  const [theme, setTheme] = useState({
}

)


useEffect(()=>{
    setDomLoaded(true)
    /*
    if(!localStorage.getItem('theme')){
      localStorage.setItem('icon','https://thenewfirstbucket.s3.ap-southeast-2.amazonaws.com/media/sun-color-icon.svg');
      localStorage.setItem('checked','false');
      setTheme({
        setIcon: localStorage.getItem('icon'),
        setChecked: localStorage.getItem('checked'),
      });

    }
    */


      setTheme({
        setIcon: localStorage.getItem('icon'),
        setChecked: JSON.parse(localStorage.getItem('checked')),
      });

},[])



  return <div className='test'><Head><link rel="shortcut icon" href="https://thenewfirstbucket.s3.ap-southeast-2.amazonaws.com/logo_favicon.png" /></Head><AuthProvider ><CurrentUserProvider><themeContext.Provider value={{theme,setTheme}}><Component {...pageProps} /></themeContext.Provider></CurrentUserProvider></AuthProvider></div>
}

export default MyApp

export {themeContext}
