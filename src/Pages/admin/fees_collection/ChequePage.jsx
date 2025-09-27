import React from "react";
import { CheQueForm } from "../../../components/fees/DiscountForm";
import Cheque from "../../../components/fees/Cheque";
import { Cheque_Data } from "../../../data";
import Sidebar from "../Sidebar";
// import { Cheque_Data } from "../../../components/data";
const ChequePage=()=>{
    console.log("uytre")
    return(

              <div className='bg-gray-100 flex AddStudent gap-2'> 
              <Sidebar/>
      
      <div className=' overflow-auto  z-1 flex  p-4 m-auto' style={{height:'100%' }}>
        <CheQueForm chequeheading=" Add / Edit Cheque"/>
       
        <Cheque tabletitle="Student Leave List" Product_Data={Cheque_Data} title1="Student Name" title2="Cheque No" title3="Bank Name" title4="Amount" title5="Status" title6="Actions">

        </Cheque>
      </div>
      </div>
    );

}

export default ChequePage;