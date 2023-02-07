import '../styles/globals.css'
import { AuthProvider } from '../store/provider'
import React,{ createContext,useState ,useEffect} from 'react'
import CurrentUserProvider from '../store/currentprovider'

import 'highlight.js/styles/github-dark.css'


export async function getInitialProps({ Component, ctx }) {
  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }
  const theme = {
    setBg:window.localStorage.getItem('theme') || 'light',
    setButtonColor:localStorage.getItem('buttonColor')||'#F5F5F6',
    setColor:localStorage.getItem('color')||'black',
    setTextColor:localStorage.getItem('textColor')||'black',
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
  if(typeof window !== 'undefined') {
    if(!localStorage.getItem('theme')){
      localStorage.setItem('theme','light');
      localStorage.setItem('buttonColor','#F5F5F6');
      localStorage.setItem('color','black');
      localStorage.setItem('textColor','black');
      localStorage.setItem('icon','https://thenewfirstbucket.s3.ap-southeast-2.amazonaws.com/media/sun-color-icon.svg');
      localStorage.setItem('checked','false');
      setTheme({
        setBg: localStorage.getItem('theme'),
        setButtonColor: localStorage.getItem('buttonColor'),
        setColor: localStorage.getItem('color'),
        setTextColor: localStorage.getItem('textColor'),
        setIcon: localStorage.getItem('icon'),
        setChecked: localStorage.getItem('checked')
      });

    }

    else{
      setTheme({
        setBg: localStorage.getItem('theme'),
        setButtonColor: localStorage.getItem('buttonColor'),
        setColor: localStorage.getItem('color'),
        setTextColor: localStorage.getItem('textColor'),
        setIcon: localStorage.getItem('icon'),
        setChecked: localStorage.getItem('checked')
      });

    }
  }
},[])



  return <div><AuthProvider ><CurrentUserProvider><themeContext.Provider value={{theme,setTheme}}><Component {...pageProps} /></themeContext.Provider></CurrentUserProvider></AuthProvider></div>
}

export default MyApp

export {themeContext}
