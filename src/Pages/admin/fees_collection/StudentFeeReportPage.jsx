import React from 'react';
import Sidebar from '../Sidebar';
import Header from '../../../components/comman_components/Header';
import PageHeader from '../../../components/comman_components/PageHeader';
import StudentFeeReport from '../../../components/fees/StudentFeeReport';

const StudentFeeReportPage = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <PageHeader 
            title="Student Fee Reports" 
            breadcrumbs={[
              { label: 'Dashboard', href: '/admin' },
              { label: 'Fee Collection', href: '#' },
              { label: 'Student Fee Reports', href: '/admin/student-fee-reports' }
            ]}
          />
          <StudentFeeReport />
        </main>
      </div>
    </div>
  );
};

export default StudentFeeReportPage;
