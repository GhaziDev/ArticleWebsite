import React, { useEffect } from 'react'
import {useState,useContext} from 'react';
import {useNavigate,useLocation} from 'react-router-dom';
import {themeContext} from '../pages/_app'
import DisplayDialogOrAuth,{LoginOrLogout} from './displayarticles.js';
import Rules from './rules.js';
import {Switch,Input,Slider} from '../styles/styling/theme' 
import { AuthContext } from '../store/provider.js';
import { useRouter } from 'next/router';
import styles from '../styles/styling/navig.module.css'



function ThemeSwitch(){
    const {theme,setTheme} = useContext(themeContext)
    const [checked,setChecked] = useState(typeof window !== "undefined" ? localStorage.getItem('checked'):false)

    const [domLoaded,setDomLoaded] = useState(false)
   
    let handleChange = (e)=>{
        if(e.target.checked){
            typeof window !== "undefined" ? localStorage.setItem('theme','#1b1b1b'):false
            typeof window !== "undefined" ? localStorage.setItem('checked',e.target.checked):false
            typeof window !== "undefined" ? localStorage.setItem('color','#ffffff'):false
            typeof window !== "undefined" ? localStorage.setItem('buttonColor','rgb(37,37,37)'):false
            typeof window !== "undefined" ? localStorage.setItem('textColor','#ffffff'):false
            typeof window !== "undefined" ? localStorage.setItem('icon', 'https://thenewfirstbucket.s3.ap-southeast-2.amazonaws.com/media/dark-mode-icon.svg'):false
            typeof window !== "undefined" ? localStorage.setItem('className','dark'):false
            setTheme({

            setBg:typeof window !== "undefined" ? localStorage.getItem('theme'):false,
            setButtonColor:typeof window !== "undefined" ? localStorage.getItem('buttonColor'):false,
            setColor:typeof window !== "undefined" ? localStorage.getItem('color'):false,
            setTextColor:typeof window !== "undefined" ? localStorage.getItem('textColor'):false,
            setIcon:typeof window !== "undefined" ? localStorage.getItem('icon'):false,
            setClassName:typeof window !== "undefined" ? localStorage.getItem('className'):false
            }
            )

            setChecked(
                true
            )
            
            

        }
        else{
            typeof window !== "undefined" ? localStorage.setItem('theme','white'):false
            typeof window !== "undefined" ? localStorage.setItem('checked',e.target.checked):false
            typeof window !== "undefined" ? localStorage.setItem('color','black'):false
            typeof window !== "undefined" ? localStorage.setItem('buttonColor','#F5F5F6'):false
            typeof window !== "undefined" ? localStorage.setItem('textColor','black'):false
            typeof window !== "undefined" ? localStorage.setItem('icon','https://thenewfirstbucket.s3.ap-southeast-2.amazonaws.com/media/sun-color-icon.svg'):false
            typeof window !== "undefined" ? localStorage.setItem('className','light'):false

            setTheme({
            setBg:typeof window !== "undefined" ? localStorage.getItem('theme'):false,
            setButtonColor:typeof window !== "undefined" ? localStorage.getItem('buttonColor'):false,
            setColor:typeof window !== "undefined" ? localStorage.getItem('color'):false,
            setTextColor:typeof window !== "undefined" ? localStorage.getItem('textColor'):false,
            setIcon:typeof window !== "undefined" ? localStorage.getItem('icon'):false,
            setClassName:typeof window !== "undefined" ? localStorage.getItem('className'):false
            }
                )
            setChecked(
                    false
                )


        }


    }
    useEffect(()=>{
        setDomLoaded(true)
    },[])

    return(
        domLoaded&&
        <Switch>
        <Input defaultChecked={checked==='true'?true:false} onChange={(e)=>handleChange(e)}  theme={theme} name='theme'/>
        <Slider theme={theme} ></Slider>
        </Switch>
    )

}



function Navigation(){
    let {theme} = useContext(themeContext)
    let redirect = useRouter()
    let {isAuth} = useContext(AuthContext)
    return(

        <div className={styles['nav-div']} >
            <link href='../styles/styling/navig.css'/>
               <div className={styles['nav-div-left']}>
            <div style = {{color:theme.setTextColor}} className={styles['l-div']}  onClick={(e)=>redirect.replace('/')}>Home</div>
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