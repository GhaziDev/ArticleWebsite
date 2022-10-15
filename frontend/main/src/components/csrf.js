import axios from 'axios';
import Cookies from 'js-cookie';
import React, {useEffect} from 'react';

const CsrfToken = ()=>{
    useEffect(()=>{
        axios.get('https://backend.globeofarticles/csrf/',{withCredentials:true}).then((res)=>{
            Cookies.set('csrftoken', res.data)
        })
    },[])
    return(
        <input type='hidden' value={Cookies.get('csrftoken')} name='csrfmiddlewaretoken'></input>
    )
}

export default CsrfToken;