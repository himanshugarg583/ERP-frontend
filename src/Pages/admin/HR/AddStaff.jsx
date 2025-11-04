import React from 'react'
import Sidebar from "../Sidebar";
import { AddTeacherForm } from "../../../components/fees/DiscountForm";
import CreateTeacher from "../../../components/comman_components/CreateTeacher";
import Header from "../../../components/comman_components/Header";
const AddStaff = () => {
  return (
    <div className='bg-slate-200 flex AddStudent'>
      <Sidebar/>
      <div className=' overflow-auto relative z-1 flex-col' style={{ height: 'auto', width:'100vw', gap:'10px', display:'flex', transition:'margin-left 0.3s ease' }}>
        <Header/>
        <main className="w-full py-6 px-4 md:px-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-full">
            <CreateTeacher formtitle="Add Staff"/>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AddStaff