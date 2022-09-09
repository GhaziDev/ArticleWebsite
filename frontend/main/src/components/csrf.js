import Cookies from 'js-cookie';
import React from 'react';

const CsrfToken = ()=>{
    let csrfToken = ()=>{
        return Cookies.get('csrftoken')
    }
    return(
        <input type='hidden' value={csrfToken()} name='csrfmiddlewaretoken'></input>
    )
}

export default CsrfToken;