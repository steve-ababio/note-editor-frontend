import React, { FunctionComponent } from "react";
import {IoIosInformationCircleOutline} from "react-icons/io";
import "./style/toast.css";

interface ToastProps{
    message:string,
    deleting:boolean
}
const Toast:FunctionComponent<ToastProps> = ({message,deleting})=>{     
   return(
        <div className={deleting ? "toast toast__show flex align-center":"toast flex align-center"} >
            <div className="toast__icon flex jus-center align-center"><IoIosInformationCircleOutline color="orange" size={30} /></div>
            <div className="toast__message-ctn">
                <div className="toast__message text-align-center">
                    {
                        deleting ?"deleting note": message                        
                    }
                </div>
            </div>
            <div className="toast__loader"></div>
        </div>
   )
}
export default Toast;