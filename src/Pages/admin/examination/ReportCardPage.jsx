import React from "react";
import Sidebar from "../Sidebar";
import Header from "../../../components/comman_components/Header";
import ReportCardtable from "../../../components/examanitaion/ReportCardtable";
import { Payment_Data } from "../../../data";
const ReportCardPage=()=>
{
    return(
        <div className='bg-slate-200 flex AddStudent'>
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
                    
                   
                     <ReportCardtable
         tabletitle="Student Leave List TableWithSearch"
          Product_Data={Payment_Data} 
          title1="student name"
          title2="class" 
          title3="phone"
          title4="roll no"
          title5="Actions">
            </ReportCardtable>
                     </main>
                   </div>
                   
                   </div>
    );
}
export default ReportCardPage;

