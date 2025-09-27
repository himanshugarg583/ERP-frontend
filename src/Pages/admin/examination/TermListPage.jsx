import React from "react";
import Sidebar from "../Sidebar";
import Header from "../../../components/comman_components/Header";
import CreateExamForm from "../../../components/examanitaion/CreateExamForm";
import TermListTable from "../../../components/examanitaion/TermListTable";
import { Product_Data } from "../../../data";

const TermListPage=()=>
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
     
    
    <CreateExamForm/>
    <TermListTable Product_Data={Product_Data}/>
      </main>
    </div>
    
    </div>
    );
}

export default TermListPage;