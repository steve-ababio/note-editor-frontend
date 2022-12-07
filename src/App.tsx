import React from "react";
import {BrowserRouter,Routes,Route} from "react-router-dom";
import Home from "./pages/home/home";
import NoteEditor from "./pages/editor/noteeditor";
import "./App.css";
function App(){  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element = {<Home/>} />
        <Route path="/noteeditor" element={<NoteEditor/>} />
      </Routes>
    </BrowserRouter>
  )
}


export default App;
