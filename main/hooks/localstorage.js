import React,{useState,useEffect} from 'react'

function useLocalStorage(key,fallbackValue){
    const [value,setValue] = useState(fallbackValue)
    useEffect(()=>{
        const stored = localStorage.getItem(key)
        setValue(stored?JSON.parse(stored):fallbackValue)

    },[])
    useEffect(()=>{
        localStorage.setItem(key,JSON.stringify(value))

    },[key,value])

    return [value,setValue]
}

export default useLocalStorage
