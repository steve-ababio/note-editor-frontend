import React from "react";
import {IoCreateOutline} from "react-icons/io5";
import {NavLink} from "react-router-dom"
import Notes from "../../components/notes/notes";
import "./style/home.css";

export default function Home(){   
    return(
        <div className="home mi-auto">
          <Notes/>
          <NavLink to="/noteeditor" state={{note:""}} style={{textDecoration:"none"}}> 
            <div className="createnote-btn-wrapper">
                <button title="create a new note" className="createnote-btn flex jus-center align-center">
                    <IoCreateOutline
                        style={{position:"absolute",top:10,left:14}}
                        size={27}
                    />
                </button>
            </div>
          </NavLink> 
        </div>
    )
}