import React from 'react';
import Sidebar from "../Sidebar";
import Header from "../../../components/comman_components/Header";

const StaffCertificate = () => {
  return (
    <div className='bg-slate-200 flex AddStudent'>
      <Sidebar/>
      <div className=' overflow-auto relative z-1 flex-col' style={{ height: '95vh', width:'100vw', gap:'10px', display:'flex', transition:'margin-left 0.3s ease' }}>
        <Header/>
        <main className="w-full py-6 px-4 md:px-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-full">
            <h2 className="text-2xl font-bold text-violet-700 mb-4">Staff Certificate</h2>
            <p className="text-slate-700">Placeholder for issuing staff certificates. Add forms, lists, and print/export here.</p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default StaffCertificate;


