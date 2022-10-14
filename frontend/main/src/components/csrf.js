import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useEffect,useState } from 'react';

const CsrfToken = ()=>{

    return(
        <input type='hidden' value={Cookies.get('csrftoken')} name='csrfmiddlewaretoken'></input>
    )
}

export default CsrfToken;