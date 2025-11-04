import react from 'react';
import PageHeader from '../../../components/comman_components/PageHeader';
import SearchHeader from '../../../components/comman_components/Searchheader';
import Table from '../../../components/comman_components/Table';
import Notice from '../../../components/fees/Notice';
import { Student_Data } from '../../../data';
import Sidebar from '../Sidebar';
import Header from '../../../components/comman_components/Header';



const DemandNotice =()=>{
    return(
        <div className='bg-slate-200 flex AddStudent'> 
        <Sidebar/>
        <div className='overflow-auto relative z-1 flex-col' style={{ height: '95vh', width:'100vw', gap:'10px', display:'flex', transition:'margin-left 0.3s ease'}}>
          <Header />
          <main className="w-full py-6 px-4 md:px-6">
            <PageHeader pageheading ="Fees Collection" Subheading="Demand Notice"/> 
            <div className='bg-white shadow-sm border border-slate-200 rounded-xl p-4 mt-4'>
              <SearchHeader search1="Class *" search2="Section *" search3="Notice Type *"/>
            </div>
            <div className='bg-white shadow-sm border border-slate-200 rounded-xl p-0 mt-4'>
              <Notice tabletitle="Student List" Product_Data={Student_Data} title1="Admission No" title2="Name" title3="Class" title4="Actions" />
            </div>
          </main>
        </div>
      </div>
    );
}

export default DemandNotice;