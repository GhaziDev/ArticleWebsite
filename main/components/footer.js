import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faTwitter,faFacebook,faDiscord } from "@fortawesome/free-brands-svg-icons";
import { themeContext } from '../pages/_app';
import {useState,useContext} from 'react'
import AboutUs from './About.js';
import {Dialog} from '@mui/material'
import HOST from '../config.js';




//add links to each section in the footer, and add social media buttons.
function Footer(){
    let [open,setOpen] = useState(false)
    let {theme} = useContext(themeContext)
    return <div  className='footer' style={{backgroundColor:theme.setButtonColor}}>
        <div onClick={(e)=>setOpen(true)} style={{cursor:'pointer'}}>About Us
              
                <Dialog open={open} onClose = {(e)=>setOpen(false)}  >
                <form className='about-form' method='dialog' onSubmit={(e)=>setOpen(false)} style={{height:'100px',backgroundColor:theme.setBg, color:theme.setTextColor}}>
                <button type='submit' style={{border:'none',fontWeight:'800',backgroundColor:theme.setTextColor,color:'white'}}>x</button>
                    <AboutUs></AboutUs>
                    </form>
                </Dialog>
      
        </div>
        <div>Privacy and Policy</div>
        <div className='social-media' style={{color:theme.setColor}}>
        <div  className='fs' onClick={()=>window.location.href='https://www.twitter.com/'}><FontAwesomeIcon icon={faTwitter} size='2x'/></div>
        <div  className='fs' onClick={()=>window.location.href='https://www.facebook.com/'}><FontAwesomeIcon icon={faFacebook} size='2x' /> </div>
        <div  className='fs' onClick={()=>window.location.href='https://www.discord.com/'}><FontAwesomeIcon icon={faDiscord} size='2x' /> </div>
        </div>

    </div>
}

export default Footer;