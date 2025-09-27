import React from "react";
import { FeeDiscountForm } from "../../../components/fees/DiscountForm";
import { Product_Data } from "../../../data";
import Table from "../../../components/comman_components/Table";
import PageHeader from "../../../components/comman_components/PageHeader";
import Sidebar from "../Sidebar";
const FeeDiscountPage=()=>{
    return(

        <div className='bg-gray-100 flex AddStudent gap-2'> 
        <Sidebar/>

        <div className=' overflow-auto  z-1 flex flex-col  p-4' style={{height:'100%' }}>
       <PageHeader pageheading ="Fees Collection" Subheading="Fee Discount"/> 
       <div className="flex ">
       <FeeDiscountForm formheading="Add / Edit Fee Discount" />
       <Table tabletitle="Student Leave List" Product_Data={Product_Data} title1="Name" title2="Class" title3="Apply Date" title4="Leave Date" title5="Status" title6="Actions">
          </Table>
          </div>
       {/* <h1 className="text-black">hello</h1> */}

       </div>        </div>
    );
}

export default FeeDiscountPage;