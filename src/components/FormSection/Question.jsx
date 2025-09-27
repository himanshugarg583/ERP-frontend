import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';


const Question = ({formHeading,isopen})=>{
    return(
        <div className="faq-question bg-purple-100 p-4 rounded-md flex justify-between items-center text-black"  >
        
        <span class="font-semibold">{formHeading}</span>
        <FontAwesomeIcon icon={faChevronDown} 
        className={`transition-transform duration-300 ${isopen ? "rotate-180" : "rotate-0"}`}
        />
   
            </div>
          );
}

export default Question;