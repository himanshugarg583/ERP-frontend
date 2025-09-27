import React from "react";
import { Fee } from "../../../components/comman_components/Reports";
import PageHeader from "../../../components/comman_components/PageHeader";
import Sidebar from "../Sidebar";

const FeeReports=()=>{

    return(
           <div className='bg-gray-100 flex AddStudent gap-2'> 
                      <Sidebar/>
                      
       
       <div className=' overflow-auto relative z-1 flex-col justify-center  m-auto ' style={{ height: '95vh',width:'80vw'}}>
        <PageHeader pageheading ="Fees Collection" Subheading="Fees Reports"/> 
            <Fee></Fee>
            </div>
            

 
        </div>   
        
    
    );
}

export default FeeReports;