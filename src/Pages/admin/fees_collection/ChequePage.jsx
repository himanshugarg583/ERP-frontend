import React from "react";
import { CheQueForm } from "../../../components/fees/DiscountForm";
import Cheque from "../../../components/fees/Cheque";
import { Cheque_Data } from "../../../data";
import Sidebar from "../Sidebar";
import Header from "../../../components/comman_components/Header";
// import { Cheque_Data } from "../../../components/data";
const ChequePage=()=>{
    console.log("uytre")
    return(

             <div className='bg-slate-200 flex AddStudent'> 
             <Sidebar/>
             <div className='overflow-auto relative z-1 flex-col' style={{ height:'95vh', width:'100vw', gap:'10px', display:'flex', transition:'margin-left 0.3s ease' }}>
               <Header />
               <main className="w-full py-6 px-4 md:px-6">
                 <div className='grid grid-cols-12 gap-6'>
                   <div className='col-span-12 lg:col-span-4'>
                     <div className='bg-white shadow-sm border border-slate-200 rounded-xl p-4 h-full'>
                       <CheQueForm chequeheading=" Add / Edit Cheque"/>
                     </div>
                   </div>
                   <div className='col-span-12 lg:col-span-8'>
                     <div className='bg-white shadow-sm border border-slate-200 rounded-xl p-0 h-full'>
                       <Cheque tabletitle="Student Leave List" Product_Data={Cheque_Data} title1="Student Name" title2="Cheque No" title3="Bank Name" title4="Amount" title5="Status" title6="Actions" />
                     </div>
                   </div>
                 </div>
               </main>
             </div>
             </div>
    );

}

export default ChequePage;