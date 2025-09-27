import react from 'react';
import PageHeader from '../../../components/comman_components/PageHeader';
import SearchHeader from '../../../components/comman_components/Searchheader';
import Table from '../../../components/comman_components/Table';
import Notice from '../../../components/fees/Notice';
import { Student_Data } from '../../../data';
import Sidebar from '../Sidebar';



const DemandNotice =()=>{
    return(
        <div className='bg-gray-100 flex AddStudent gap-2'> 
        <Sidebar/>
    

<div className=' overflow-auto  z-1 flex flex-col gap-4 m-auto' style={{ height: '95vh',width:'85vw'}}>
     
       <PageHeader pageheading ="Fees Collection" Subheading="Demand Notice"/> 

       <SearchHeader search1="Class *" search2="Section *" search3="Notice Type *"/>

       <Notice tabletitle="Student List" Product_Data={Student_Data} title1="Admission No" title2="Name" title3="Class" title4="Actions">
         </Notice>

   </div>
   </div>
    );
}

export default DemandNotice;