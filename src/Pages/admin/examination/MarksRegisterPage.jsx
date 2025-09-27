import React from "react";
import Sidebar from "../Sidebar";
import Header from "../../../components/comman_components/Header";
import MarkRegister from "../../../components/examanitaion/MarksRegister";

const MarksRegisterPage=()=>
{
    return(
        <div className='bg-gray-100 flex AddStudent'>
        <Sidebar/>
    
    <div className=' overflow-auto relative z-1 flex-col' style={{
    height: '95vh',
    width: '100vw',
    gap:'10px',
    display: 'flex',
    transition: 'margin-left 0.3s ease'
    }}>
      <Header />
    
      
    
    
      <main className="">
     
    <MarkRegister/>
    
      </main>
    </div>
    
    </div>
    );
}

export default MarksRegisterPage;