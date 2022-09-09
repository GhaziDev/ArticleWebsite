import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faTwitter,faFacebook,faDiscord } from "@fortawesome/free-brands-svg-icons";
import { themeContext } from '../App.js';
import {useContext} from 'react'

//add links to each section in the footer, and add social media buttons.
function Footer(){
    let {theme} = useContext(themeContext)
    return <div  className='footer' style={{backgroundColor:theme.setButtonColor}}>
        <div>About us</div>
        <div>Privacy and Policy</div>
        <div className='social-media' style={{color:theme.setColor}}>
        <div  className='fs' onClick={()=>window.location.href='https://www.twitter.com/'}><FontAwesomeIcon icon={faTwitter} size='2x'/></div>
        <div  className='fs' onClick={()=>window.location.href='https://www.facebook.com/'}><FontAwesomeIcon icon={faFacebook} size='2x' /> </div>
        <div  className='fs' onClick={()=>window.location.href='https://www.discord.com/'}><FontAwesomeIcon icon={faDiscord} size='2x' /> </div>
        </div>

    </div>
}

export default Footer;