import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import Header from "../../../components/comman_components/Header";
import { Key, DollarSign, ArrowLeft } from "lucide-react";

const HRReports = () => {
  const navigate = useNavigate();

  const handleReportClick = (reportType) => {
    if (reportType === 'teacher-credentials') {
      navigate('/admin/hr/teacher-credentials');
    } else if (reportType === 'teacher-salary') {
      navigate('/admin/hr/teacher-salary');
    }
  };

  return (
    <div className='bg-slate-200 flex AddStudent'>
      <Sidebar />
      <div className='overflow-auto relative z-1 flex-col' style={{
        height: '95vh',
        width: '100vw',
        gap: '10px',
        display: 'flex',
        transition: 'margin-left 0.3s ease'
      }}>
        <Header />
        <main className="w-full py-4 md:py-6 px-4 md:px-6">
          <div className="space-y-4 md:space-y-6">
            {/* Page Header */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
              <h1 className="text-xl md:text-2xl font-semibold text-slate-800 mb-2">HR Reports</h1>
              <p className="text-sm text-slate-600">Generate and view various teacher and HR reports</p>
            </div>

            {/* Report Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <button
                onClick={() => handleReportClick('teacher-credentials')}
                className="bg-white rounded-xl shadow-sm border-2 border-slate-200 hover:border-violet-400 p-6 md:p-8 transition-all cursor-pointer text-center group"
              >
                <Key className="w-12 h-12 mx-auto mb-4 text-slate-600 group-hover:text-violet-600" />
                <h3 className="text-lg md:text-xl font-semibold text-slate-800 group-hover:text-violet-700 mb-2">
                  Teacher Credentials
                </h3>
                <p className="text-sm text-slate-600">View teacher login credentials and access information</p>
              </button>

              <button
                onClick={() => handleReportClick('teacher-salary')}
                className="bg-white rounded-xl shadow-sm border-2 border-slate-200 hover:border-violet-400 p-6 md:p-8 transition-all cursor-pointer text-center group"
              >
                <DollarSign className="w-12 h-12 mx-auto mb-4 text-slate-600 group-hover:text-violet-600" />
                <h3 className="text-lg md:text-xl font-semibold text-slate-800 group-hover:text-violet-700 mb-2">
                  Teacher Salary
                </h3>
                <p className="text-sm text-slate-600">View teacher payroll and compensation details</p>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HRReports;
