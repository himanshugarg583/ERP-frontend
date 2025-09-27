import react from 'react';
import PageHeader from '../../../components/comman_components/PageHeader';
import { Payment_Data } from '../../../data';
import Sidebar from '../Sidebar';

import Payment from '../../../components/fees/Payment';
import { div } from 'framer-motion/client';

const PaymentRecipt=()=>{
return(

 <div className='bg-gray-100 flex AddStudent gap-2'> 
    <Sidebar/>
    
    <div className='bg-white-200 overflow-auto  z-1 flex flex-col' style={{ height: '95vh',width:'85vw'}}>
       
        <PageHeader pageheading ="Fees Collection" Subheading="Payment Receipt"/> 

 
        {/* CreateAdmitCard */}
        <Payment tabletitle="Student Leave List TableWithSearch" Product_Data={Payment_Data} title1="Name" title2="Class" title3="Date" title4="Amount" title5="Actions">
          </Payment>

    </div>

    </div>
);

}

export default PaymentRecipt;

