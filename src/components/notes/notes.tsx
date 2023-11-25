import React,{ useState,useEffect }  from "react";
import useFetch from "../../hooks/usefetch";
import NoteCard from '../notecard/notecard';
import "./style/notes.css";

import Toast from "../toast/toast";

interface INote{
    id:string,
    title:string,
    note:string,
    datecreated:string,
    lastmodified:string,
}
export default function Notes(){     
    const [loading,setLoading] = useState(true);
    const [message,setMessage] = useState("");
    const [noteid,setNoteId] = useState("");
    const [deleting,setDeleting] = useState(false);
    const [response,setReponse] = useFetch<INote[]>("https://noteeditorbackendpro.onrender.com/allnotes",setLoading,{method:"GET"});

    useEffect(()=>{
       const remainingNotes = response.filter(note=>(note.id !== noteid));
       setReponse(remainingNotes);
    },[deleting,noteid]);
    
    function render(){
        if(loading){
            return (
                <div className="notes__loader-ctn flex jus-center align-center">
                    <div className="notes__loader flex jus-center align-center">
                        <div className="notes__loader-bar"></div>
                        <div className="notes__loader-bar mi-10"></div>
                        <div className="notes__loader-bar"></div>
                    </div>
                </div>
            )
        }else{
            if(response!.length !== 0) {         
               return <div className="notes__wrapper">                       
                    {
                        response!.map((note:INote)=>(
                            <NoteCard setNoteId={setNoteId} key={note.id} {...note} setMsg={setMessage} setDeleting={setDeleting} />         
                        ))                        
                    }                
                </div>
            }else
                return <h2 className="notes__message flex jus-center align-center text-align-center">There are no saved notes</h2>
        }
    }
    return(
        <div className="notes flex flex-col">
            <header className="notes__header">
                <h1 className="notes__title text-align-center">All notes</h1>
                <div className="notes__count">{response?.length || 0} notes</div>
                <div className="notes__header-divider"></div>
            </header> 
            { 
                render()
            }
            <Toast deleting={deleting} message={message} />
        </div>
    )
}