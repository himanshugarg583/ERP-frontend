import React from "react";
import PageHeader from "../../../components/comman_components/PageHeader";
import { Product_Data } from "../../../data";
import LeaveTable from "../../../components/attendance/LeaveTable";
import { Leave_Data } from "../../../data";
import Sidebar from "../Sidebar";
import Header from "../../../components/comman_components/Header";
import LeaveComponent from "../../../components/attendance/LeaveComponent";

const Leave=()=>{
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
     
        <LeaveComponent/>
    
           
            
    
         
    
    
      </main>
    </div>
    
    </div>
    )
}

export default Leave;