import {useEffect,useState} from "react";

interface IFetchOptions{
    method?:string,
    header?:HeadersInit,
    body?:BodyInit,
    credentials?:RequestCredentials,
    integrity?:string,
    keepalive?:boolean,
    mode?:RequestMode,
    redirect?:RequestRedirect
}
export default function useFetch<T>(url:string,setAction:Function,options:IFetchOptions):[T,React.Dispatch<React.SetStateAction<T>>]{
    const[response,setResponse] = useState<T>([] as T);

    useEffect(()=>{
        const abortcontroller = new AbortController();
        async function fetchNotes(){           
            try{
                const serializedresponse = await fetch(url,{...options,signal:abortcontroller.signal});
                const response = await serializedresponse.json();
                setResponse(response);
                setAction(false);
            }catch(error){
                throw error;
            }
        }
        fetchNotes();
        return ()=>{
            abortcontroller.abort();
        }
    },[url]); 
    return [response,setResponse];
}