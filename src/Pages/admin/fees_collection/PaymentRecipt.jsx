import react from 'react';
import PageHeader from '../../../components/comman_components/PageHeader';
import { Payment_Data } from '../../../data';
import Sidebar from '../Sidebar';

import Payment from '../../../components/fees/Payment';
import { div } from 'framer-motion/client';
import Header from '../../../components/comman_components/Header';

const PaymentRecipt=()=>{
return(

 <div className='bg-slate-200 flex AddStudent'> 
   <Sidebar/>
   <div className='overflow-auto relative z-1 flex-col' style={{ height: '95vh', width:'100vw', gap:'10px', display:'flex', transition:'margin-left 0.3s ease'}}>
     <Header />
     <main className="w-full py-6 px-4 md:px-6">
       <PageHeader pageheading ="Fees Collection" Subheading="Payment Receipt"/> 
       <div className='bg-white shadow-sm border border-slate-200 rounded-xl p-0 mt-4'>
         <Payment tabletitle="Student Leave List TableWithSearch" Product_Data={Payment_Data} title1="Name" title2="Class" title3="Date" title4="Amount" title5="Actions" />
       </div>
     </main>
   </div>
 </div>
);

}

export default PaymentRecipt;

