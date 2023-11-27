import React,{useRef,useState,} from "react";
import {HiOutlineSave} from "react-icons/hi"
import {AiOutlineBold,AiOutlineItalic,AiOutlineUnderline} from "react-icons/ai"
import {CiTextAlignCenter,CiTextAlignJustify,CiTextAlignLeft,CiTextAlignRight} from "react-icons/ci"
import {useLocation} from "react-router-dom";
import "./style/noteeditor.css";
import { useEffect } from 'react';

const EDITOR_MODE = {
    EDITING_MODE:"editing",
    NEW_MODE:"new"
};
const ALIGN_TYPE = {
    center:"center",
    justify:"justify",
    left:"left",
    right:"right"
};
type FetchBodyType = object|string|null;
const ORIGIN =  "https://noteeditorbackendpro.onrender.com";
export default function NoteEditor(){
    const title = useRef("");   
    const note = useRef(""); 
    const selectedText = useRef("");  
    const debouncetimeout = useRef<NodeJS.Timeout>();
    const titleInput = useRef<HTMLInputElement>(null);
    const textArea = useRef<HTMLTextAreaElement>(null);
    const fontInput = useRef<HTMLInputElement>(null);
    const fontSelect = useRef<HTMLSelectElement>(null);
    const [saving,setSaving] = useState(false);
    const [mode,setMode] = useState(EDITOR_MODE.NEW_MODE);
    const [notes,setNotes] = useState(""); 
    const [message,setMessage] = useState(""); 
    const [danger,setDanger] = useState(false)   
    const location = useLocation();
    const updateDebounce = debounce(updateNote);

    useEffect(()=>{
        setNotes(location.state.note);
        if(location.state.note !== ""){
            setMode(EDITOR_MODE.EDITING_MODE);
            title.current = location.state.title;
            titleInput.current!.value = location.state.title;            
            titleInput.current!.disabled = true;
            titleInput.current!.placeholder = "";
            note.current = location.state.note;
        }
    },[location]);
    
    useEffect(()=>{
        fontInput.current!.value = fontSelect.current!.value;
        const element = textArea.current!;
        const selectText = (e:Event)=>{
            const e_target = e.target! as HTMLTextAreaElement;
            selectedText.current = e_target.value.substring(e_target.selectionStart, e_target.selectionEnd);
        }
        element.addEventListener('select',selectText);
        return ()=>{
            element.removeEventListener("select",selectText);
        }
    },[]);    
    
    function handleNoteTitle(e:React.ChangeEvent<HTMLInputElement>){
        title.current = e.currentTarget.value;
    }
    function handleNotes(e:React.ChangeEvent<HTMLTextAreaElement>){
        note.current = e.currentTarget.value;        
        if(mode === EDITOR_MODE.EDITING_MODE){   
            updateDebounce(`${ORIGIN}/note/:${location.state.id}`);
        }
    }
    async function checkTitleAvailability(){
        const url = `${ORIGIN}/title/:${title.current}`
        const response = await sendRequest(url,"GET");
        return response;
    }
    async function saveNote(){
        let url:string;
        let method:string;
        let body:Object;
        const save = async ()=>{
            if(title.current.length !== 0){
                if( note.current.length !== 0){                                    
                    try{
                        setSaving(true);
                        const response = await sendRequest(url,method,body);
                        setMessage(response.message);
                        setDanger(false);
                    }catch(error){
                        throw error;
                    }finally{
                        setSaving(false);
                    } 
                    
                }else{
                    setMessage("Please write some notes");
                    setDanger(true);
                }
            }else{
                setMessage("Please provide a title");
                setDanger(true);
            }   
        }     
        if(mode === EDITOR_MODE.EDITING_MODE){
            url = `${ORIGIN}/note/:${location.state.id}`;
            method = "PUT";
            body = {note:note.current}
            save();
        }else{
            url = `${ORIGIN}/note`;
            method = "POST";
            body = {title:title.current,note:note.current};
            const titleinfo = await checkTitleAvailability();
            if(titleinfo.isTitleAvailable){  
                save();
            }else{
                setMessage(titleinfo.message);
                setDanger(true);
            }
        } 
        
              
    }
    async function updateNote(url:string){        
        try{
            const method = "PUT";
            const body = {note:note.current}  
            setSaving(true);
            const response = await sendRequest(url,method,body);
            setMessage(response.message);
        }catch(error){
            throw error;
        }finally{
            setSaving(false);
        } 
    }   
    async function sendRequest(url:string,method:string,body:FetchBodyType = null){
        if(body){
            body = JSON.stringify(body);   
        }           
        const serializedresponse = await fetch(url,{method,body,headers:{"Content-Type":"application/json","Accept":"application/json"}});    
        const response = await serializedresponse.json();
        return response;                       
    }    
    function debounce(cb:Function,delay=800){        
        return function(...args:any[]){ 
            clearTimeout(debouncetimeout.current);
            debouncetimeout.current = setTimeout(()=>{
                cb(...args);
            },delay);
        }
    }
    function handleSelectFontSizeChange(e:React.ChangeEvent<HTMLSelectElement>){
        fontInput.current!.value = e.target.value;
        changeFontSize(e.target.value);
    }
    function handleInputFontSizeChange(e:React.ChangeEvent<HTMLInputElement>){
        changeFontSize(e.target.value);
    }
    function changeFontSize(value:string){
        textArea.current!.style.fontSize = `${value}px`;
    }
    function boldenText(){
        textArea.current!.style.fontWeight = "bolder";
    }
    function italizeText(){
        textArea.current!.style.fontStyle="italic";
    }
    function underlineText(){
        textArea.current!.style.textDecoration = "underline";
    }
    function alignText(aligntype:string){
        textArea.current!.style.textAlign = aligntype;
    }
    return(
        <div className="note-editor flex flex-col">
            <header className="note-editor__header mi-auto">
                <h2>Note Editor</h2>                
            </header>
           <input ref={titleInput} type="text" className="note-editor__inputs note-editor__title mi-auto" onChange={handleNoteTitle} placeholder="Enter title..." />
           <div className="note-editor__styles flex jus-center align-center mi-auto">
                <div className="note-editor__styles-btn-ctn flex align-center">
                    <button onClick={boldenText} className="note-editor__styles-btn flex align-center"><AiOutlineBold color="rgb(99, 104, 104)" size={15} /></button>
                    <button onClick={italizeText} className="note-editor__styles-btn flex align-center"><AiOutlineItalic color="rgb(99, 104, 104)" size={15} /></button>
                    <button onClick={underlineText}className="note-editor__styles-btn flex align-center"><AiOutlineUnderline color="rgb(99, 104, 104)" size={15} /></button>
                </div>
                <div className="note-editor__font-size">
                    <select defaultValue="12" ref={fontSelect} onChange={handleSelectFontSizeChange}>
                        <option>10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                        <option value="14">14</option>
                        <option value="15">15</option>
                        <option value="16">16</option>
                        <option value="18">18</option>
                        <option value="20">20</option>
                        <option value="2">25</option>
                        <option value="30">30</option>
                        <option value="34">34</option>
                        <option value="40">40</option>
                        <option value="45">45</option>
                    </select>
                    <input ref={fontInput} type="text" onChange={handleInputFontSizeChange} name="font size" />
                </div>
                <div className="note-editor__align">
                    <button title="justify align" onClick={()=>alignText(ALIGN_TYPE.justify)} className="note-editor__align-btn"><CiTextAlignJustify size={20}/></button>
                    <button title="centre align" onClick={()=>alignText(ALIGN_TYPE.center)} className="note-editor__align-btn"><CiTextAlignCenter size={20} /></button>
                    <button title="left align" onClick={()=>alignText(ALIGN_TYPE.left)} className="note-editor__align-btn"><CiTextAlignLeft size={20}/></button>
                    <button title="right align" onClick={()=>alignText(ALIGN_TYPE.right)}className="note-editor__align-btn"><CiTextAlignRight size={20}/></button>
                </div>
           </div>
           <textarea ref={textArea} onChange={handleNotes} defaultValue={notes} className="note-editor__inputs note-editor__textarea mi-auto"/>
           <div className="note-editor__display mi-auto">
                <div className="note-editor__save-btn-ctn">
                    <button onClick={saveNote} disabled={saving} className="note-editor__save-btn flex jus-center align-center">
                        {
                            saving ?
                                (
                                    <div className="note-editor__saving-loader-ctn flex jus-center">
                                        <span className="note-editor__saving-loader-txt">saving </span><div className="note-editor__saving-loader"><HiOutlineSave size={20}/></div>                            
                                    </div>
                                )                            
                                :(
                                    <>
                                        <span> save note</span>
                                        <HiOutlineSave size={25}/>
                                    </>
                                )                            
                        }
                    </button>
                </div>
                <div className={danger ? "note-editor__message note-editor__message-danger": "note-editor__message note-editor__message-success"}>
                    {message}
                </div>
           </div>
        </div>
    )
}