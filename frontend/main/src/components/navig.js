import React, { useEffect } from 'react'
import {useState,useContext} from 'react';
import {useNavigate,Link} from 'react-router-dom';
import { cyanDark} from '@radix-ui/colors';
import {themeContext} from '../App.js'
import Search from './search.js'
import DisplayDialogOrAuth,{LoginOrLogout} from './displayarticles.js';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Rules from './rules.js';
import {Switch,Input,Slider} from '../styling/theme' 





function ThemeSwitch(){
    const {theme,setTheme} = useContext(themeContext)
    const [checked,setChecked] = useState(localStorage.getItem('checked'))
   
    let handleChange = (e)=>{
        if(e.target.checked){
            localStorage.setItem('theme','#1b1b1b')
            localStorage.setItem('checked',e.target.checked)
            localStorage.setItem('color','#ffffff')
            localStorage.setItem('buttonColor','#323232')
            localStorage.setItem('textColor','#ffffff')
            localStorage.setItem('icon', 'https://thenewfirstbucket.s3.ap-southeast-2.amazonaws.com/media/dark-mode-icon.svg')
            setTheme({

            setBg:localStorage.getItem('theme'),
            setButtonColor:localStorage.getItem('buttonColor'),
            setColor:localStorage.getItem('color'),
            setTextColor:localStorage.getItem('textColor'),
            setIcon:localStorage.getItem('icon'),
            }
            )

            setChecked(
                true
            )
            
            

        }
        else{
            localStorage.setItem('theme','#E1E2E1')
            localStorage.setItem('checked',e.target.checked)
            localStorage.setItem('color','black')
            localStorage.setItem('buttonColor','#F5F5F6')
            localStorage.setItem('textColor','black')
            localStorage.setItem('icon','https://thenewfirstbucket.s3.ap-southeast-2.amazonaws.com/media/sun-color-icon.svg')

            setTheme({
            setBg:localStorage.getItem('theme'),
            setButtonColor:localStorage.getItem('buttonColor'),
            setColor:localStorage.getItem('color'),
            setTextColor:localStorage.getItem('textColor'),
            setIcon:localStorage.getItem('icon')
            }
                )
            setChecked(
                    false
                )


        }


    }

    return(
        <Switch>
        <Input defaultChecked={checked==='true'?true:false} onChange={(e)=>handleChange(e)}  theme={theme} name='theme'/>
        <Slider theme={theme} ></Slider>
        </Switch>
    )

}



function Navigation(){
    let {theme} = useContext(themeContext)
    let redirect = useNavigate('')
    return(

        <div className='nav-div' >
               <div className='nav-div-left'>
            <button style = {{backgroundColor:theme.setButtonColor,color:theme.setTextColor}} className='l-div'  onClick={()=>redirect('/')}><FontAwesomeIcon icon={faHome}></FontAwesomeIcon></button>
            <Rules></Rules>
            <LoginOrLogout></LoginOrLogout>
            <ThemeSwitch ></ThemeSwitch>

            </div>
         


        </div>
    )
}

// i can create a component based on conditional rendering i would put it inside the jsx in this component Navigation

export default Navigation;
export {ThemeSwitch};