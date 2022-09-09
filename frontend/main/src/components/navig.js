import React, { useEffect } from 'react'
import {useState,useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import { cyanDark} from '@radix-ui/colors';
import {themeContext} from '../App.js'
import Search from './search.js'
import DisplayDialogOrAuth from './displayarticles.js';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Rules from './rules.js';

function ThemeSwitch(){
    const {theme,setTheme} = useContext(themeContext)
    const [checked,setChecked] = useState(localStorage.getItem('checked'))
   
    let handleChange = (e)=>{
        if(e.target.checked){
            localStorage.setItem('theme',cyanDark.cyan1)
            localStorage.setItem('checked',e.target.checked)
            localStorage.setItem('color','white')
            localStorage.setItem('buttonColor',cyanDark.cyan3)
            localStorage.setItem('textColor',cyanDark.cyan11)

            setTheme({

            setBg:localStorage.getItem('theme'),
            setButtonColor:localStorage.getItem('buttonColor'),
            setColor:localStorage.getItem('color'),
            setTextColor:localStorage.getItem('textColor'),
            }
            )

            setChecked(
                true
            )
            
            

        }
        else{
            localStorage.setItem('theme',cyanDark.cyan10)
            localStorage.setItem('checked',e.target.checked)
            localStorage.setItem('color','black')
            localStorage.setItem('buttonColor',cyanDark.cyan9)
            localStorage.setItem('textColor',cyanDark.cyan12)

            setTheme({
            setBg:localStorage.getItem('theme'),
            setButtonColor:localStorage.getItem('buttonColor'),
            setColor:localStorage.getItem('color'),
            setTextColor:localStorage.getItem('textColor'),
            }
                )
            setChecked(
                    false
                )


        }


    }

    return(
    <label class="switch"  >
    <input type="checkbox" defaultChecked={checked==='true'?true:false} onChange={(e)=>handleChange(e)} name='theme'/>
    <span class="slider" style={{backgroundColor:theme.setButtonColor}}></span>
    </label>
    )

}



function Navigation(){
    let {theme} = useContext(themeContext)
    let redirect = useNavigate('/')
    return(
        <div className='nav-div' >
            <div className='nav-div-left'>
            <button style = {{backgroundColor:theme.setButtonColor,color:theme.setTextColor}} className='l-div'  onClick={()=>redirect('/')}><FontAwesomeIcon icon={faHome}></FontAwesomeIcon></button>
            <Rules></Rules>
            <ThemeSwitch ></ThemeSwitch>

            </div>
            <Search></Search>
           
            <DisplayDialogOrAuth ></DisplayDialogOrAuth>

        </div>
    )
}

// i can create a component based on conditional rendering i would put it inside the jsx in this component Navigation

export default Navigation;
export {ThemeSwitch};