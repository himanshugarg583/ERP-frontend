import React from "react";
import { FeeDiscountForm } from "../../../components/fees/DiscountForm";
import { Product_Data } from "../../../data";
import Table from "../../../components/comman_components/Table";
import PageHeader from "../../../components/comman_components/PageHeader";
import Sidebar from "../Sidebar";
import Header from "../../../components/comman_components/Header";
const FeeDiscountPage=()=>{
    return(

        <div className='bg-slate-200 flex AddStudent'> 
        <Sidebar/>
        <div className='overflow-auto relative z-1 flex-col' style={{ height:'95vh', width:'100vw', gap:'10px', display:'flex', transition:'margin-left 0.3s ease' }}>
          <Header />
          <main className="w-full py-6 px-4 md:px-6">
            <PageHeader pageheading ="Fees Collection" Subheading="Fee Discount"/> 
            <div className="grid grid-cols-12 gap-6 mt-4">
              <div className='col-span-12 lg:col-span-4'>
                <div className='bg-white shadow-sm border border-slate-200 rounded-xl p-4 h-full'>
                  <FeeDiscountForm formheading="Add / Edit Fee Discount" />
                </div>
              </div>
              <div className='col-span-12 lg:col-span-8'>
                <div className='bg-white shadow-sm border border-slate-200 rounded-xl p-0 h-full'>
                  <Table tabletitle="Student Leave List" Product_Data={Product_Data} title1="Name" title2="Class" title3="Apply Date" title4="Leave Date" title5="Status" title6="Actions" />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
}

export default FeeDiscountPage;