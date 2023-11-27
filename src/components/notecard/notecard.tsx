import React, { FunctionComponent } from "react";
import {FiEdit2} from "react-icons/fi";
import {AiOutlineDelete} from "react-icons/ai";
import {useNavigate} from "react-router-dom";
import "./style/notecard.css";
import { ORIGIN } from "../../config/config";

type ReactStringStateAction = React.Dispatch<React.SetStateAction<string>>;
interface INoteCardProp{
    id:string,
    title:string,
    note:string,
    datecreated:string,
    lastmodified:string,
    setMsg:ReactStringStateAction,
    setDeleting:React.Dispatch<React.SetStateAction<boolean>>,
    setNoteId:ReactStringStateAction
}
const NoteCard:FunctionComponent<INoteCardProp> = ({id,title,note,lastmodified,datecreated,setMsg,setDeleting,setNoteId})=> {
    const navigate = useNavigate();
    function editNote(){
        navigate("/noteeditor",{
            state:{
                id,
                note,
                title
            },
        });
    }   
    async function deleteNote(){
        let message:string = "";
        try{
            setDeleting(true)
            let response = await fetch(`${ORIGIN}/:${id}`,{method:"DELETE"});
            let messageobj = await response.json();
            message = messageobj.message;
        }catch(error){
            throw error;
        }
        finally{
            setNoteId(id);
            setMsg(message)
            setDeleting(false);
        }
    }
    return(
        <div className="note-card">
            <div className="note-card__card">                
                <div className="note-card__snippet mi-auto">{note}</div>
                <div className="note-card__actions-ctn flex">
                    <button title="delete note" className="note-card__actions note-card__del" onClick={deleteNote}>
                        <AiOutlineDelete color="rgb(99, 104, 108)" size={23} />
                    </button>
                    <button title="edit note" className="note-card__actions note-card__edit" onClick={editNote}>
                        <FiEdit2 color="rgb(99, 104, 108)" size={22} />
                    </button>
                </div>
            </div>
            <div className="note__title">{title}</div>
            <div className="note__date">
                <div className="note__created-date">created: {datecreated}</div>
                <div className="note__last-modified-date">last modified: {lastmodified}</div>
            </div>
        </div>
    )
}

export default NoteCard;