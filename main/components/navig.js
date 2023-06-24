import React, { useEffect } from 'react'
import {useState,useContext} from 'react';
import {themeContext} from '../pages/_app'
import {LoginOrLogout} from './displayarticles.js';
import Rules from './rules.js';
import {Switch,Input,Slider} from '../styles/styling/theme' 
import { AuthContext } from '../store/provider.js';
import { useRouter } from 'next/router';
import styles from '../styles/styling/navig.module.css'




function ThemeSwitch(){
    const {theme,setTheme} = useContext(themeContext)

    const [domLoaded,setDomLoaded] = useState(false)
   
    let handleChange = (e)=>{
        if(e.target.checked){
            typeof window !== "undefined" ? localStorage.setItem('checked',e.target.checked):false
            typeof window !== "undefined" ? localStorage.setItem('icon', 'https://thenewfirstbucket.s3.ap-southeast-2.amazonaws.com/media/dark-mode-icon.svg'):false
            setTheme({

            setIcon:typeof window !== "undefined" ? localStorage.getItem('icon'):false,
            setChecked: e.target.checked,
            }
            )
            console.log(theme.setChecked)
            

        }
        else{
            typeof window !== "undefined" ? localStorage.setItem('checked',e.target.checked):false
            typeof window !== "undefined" ? localStorage.setItem('icon','https://thenewfirstbucket.s3.ap-southeast-2.amazonaws.com/media/sun-color-icon.svg'):false
            setTheme({
            setIcon:typeof window !== "undefined" ? localStorage.getItem('icon'):false,
            setChecked:e.target.checked
            }
                )


        }


    }
    useEffect(()=>{
        setDomLoaded(true)
    },[domLoaded===true])

    return(
        <Switch hidden={domLoaded}>
        <Input  defaultChecked={theme.setChecked} onChange={(e)=>handleChange(e)}  theme={theme} name='theme'/>
        <Slider theme={theme} ></Slider>
        </Switch>
    )
    

}



function Navigation(){
    let {theme} = useContext(themeContext)
    let redirect = useRouter()
    let {isAuth} = useContext(AuthContext)
    const [loading,setLoading] = useState(true)
    useEffect(()=>{
        setTimeout(()=>{setLoading(false)},1000)

    },[])
    return(


        <div className={styles['nav-div']} >
               <div className={styles['nav-div-left']}>
            <div style = {{color:theme.setTextColor}} className={styles['l-div']}  onClick={(e)=>redirect.replace('/')}><img width='60' height='60' src='/static/logo_favicon.png'></img></div>
            <Rules></Rules>
            <LoginOrLogout></LoginOrLogout>
            {(redirect.pathname.startsWith('/userprofile')||redirect.pathname.startsWith('/article'))?<button
          style={{ color: theme.setTextColor }}
          className={styles["create-article-btn"]}
          onClick={
            isAuth
              ? (e) => {
                  redirect.replace("/create");
                }
              : (e) => {
                  redirect.replace("/login");
                }
          }
        >
          Create Article
        </button>:null}
            <ThemeSwitch ></ThemeSwitch>

            </div>


        </div>
    )
}

// i can create a component based on conditional rendering i would put it inside the jsx in this component Navigation

export default Navigation;
export {ThemeSwitch};