import React from 'react'
import Sidebar from "../Sidebar";
import { AddTeacherForm } from "../../../components/fees/DiscountForm";
import CreateTeacher from "../../../components/comman_components/CreateTeacher";
import Header from "../../../components/comman_components/Header";

const AddLibrarian = () => {
  return (
    <div className='bg-gray-100 flex AddStudent'>
                  
                    <Sidebar/>
                
                
                <div className=' overflow-auto relative z-1 flex-col justify-center  m-auto gap-4' style={{ height: '100vh',width:'90vw'}}>
                    <Header/>
                    <CreateTeacher formtitle="Add Librarian"/>
               
        </div>
                </div>
  )
}

export default AddLibrarian