import React from 'react';
import Sidebar from '../Sidebar';
import Header from '../../../components/comman_components/Header';
import PageHeader from '../../../components/comman_components/PageHeader';
import FeeHeadManagement from '../../../components/fees/FeeHeadManagement';

const FeeHeadManagementPage = () => {
  return (
    <div className='bg-slate-200 flex AddStudent'> 
      <Sidebar/>
      <div className='overflow-auto relative z-1 flex-col' style={{ height: '95vh', width:'100vw', gap:'10px', display:'flex', transition:'margin-left 0.3s ease'}}>
        <Header />
        <main className="w-full py-6 px-4 md:px-6">
          <PageHeader pageheading="Fees Management" Subheading="Fee Head Management"/> 
          <div className='bg-white shadow-sm border border-slate-200 rounded-xl p-6 mt-4'>
            <FeeHeadManagement />
          </div>
        </main>
      </div>
    </div>
  );
};

export default FeeHeadManagementPage;
