import React from "react";
import Sidebar from "../Sidebar";
import Header from "../../../components/comman_components/Header";
import ReportHeading from "../../../components/comman_components/ReportHeading";


const ExamReportPage=()=>
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
                      <div className="flex gap-4 justify-center">
                      <ReportHeading mainheading="Class Wise Report" subhading="class section wise"/>
                     <ReportHeading mainheading="Subject Wise Report" subhading="class section wise"/>
                     <ReportHeading mainheading="Teacher Wise" subhading="class section wise"/>
                     <ReportHeading mainheading="Fail Student" subhading="class section wise"/>

                      </div>
                     
                   
                   
                     </main>
                   </div>
                   
                   </div>
    );
}

export default ExamReportPage;
