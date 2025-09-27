import React from "react";
import Sidebar from '../Sidebar';
import Header from '../../../components/comman_components/Header';

const AssignSubjectPage=()=>{
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
                           <Header/>
                          
                               
                   {/* <CreateClass/> */}
                    
                           </div>   
              
                           </div> 
    );
}
export default AssignSubjectPage;