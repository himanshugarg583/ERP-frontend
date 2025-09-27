import React, { useState } from 'react';
import Question from './Question';
// import Question from "./Question";
// import { Form1,Form2 ,Form3,Form4,Form5 } from './Forms';

const Formsec = () => {
    const [openQuestions, setOpenQuestions] = useState({});
    // const [isOpen, setIsOpen] = useState(false);

    const toggleFAQ = (index) => {
      setOpenQuestions((prevState) => ({
        ...prevState,
        [index]: !prevState[index],
    
        // Toggle the state of the clicked question
      }));
    };
    return(
  


<div className="faq-container  space-y-4">


      <div className="faq-item">
  <div onClick={() => {toggleFAQ(0); }}>
    <Question formHeading="Student details"    />
  </div>

  <div
    className={`transition-all duration-1000 ease-in-out overflow-hidden ${
      openQuestions[0] ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
    }`}
  >
    {/* {openQuestions[0] && <Form1 />} */}
  </div>

</div>

      <div className="faq-item">
      <div onClick={() => {toggleFAQ(1); }}>
        <Question formHeading="Custom Field" />
        </div>
   
   
        <div
    className={`transition-all duration-1000 ease-in-out overflow-hidden ${
      openQuestions[1] ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
    }`}
  >

        {/* {openQuestions[1] && (<Form2 />)} */}
</div>
      </div>

      <div className="faq-item">
      <div onClick={() => toggleFAQ(2)}>
        <Question formHeading="Parent / Guardian Details"/>
        </div>


        <div
    className={`transition-all duration-1000 ease-in-out overflow-hidden ${
      openQuestions[2] ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
    }`}
  >
        {/* {openQuestions[2] && (<Form3 />)} */}
        </div>
      </div>

      <div className="faq-item">
      <div onClick={() => toggleFAQ(3)}>
        <Question formHeading="Other Details"/>
        </div>


        <div
    className={`transition-all duration-1000 ease-in-out overflow-hidden ${
      openQuestions[3] ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
    }`}
  >
    {/* {openQuestions[3] && (<Form4 />)} */}
  </div>
    
      </div>

      <div className="faq-item">
      <div onClick={() => toggleFAQ(4)}>
        <Question formHeading="Upload Documents"/>
        </div>


        <div
    className={`transition-all duration-1000 ease-in-out overflow-hidden ${
      openQuestions[3] ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
    }`}
  >
    {/* {openQuestions[4] && (<Form5 />)} */}
  </div>
        
      </div>

    </div>
    );
}

export default Formsec;