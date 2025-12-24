import React from 'react';
import Sidebar from '../Sidebar';
import Header from '../../../components/comman_components/Header';
import PageHeader from '../../../components/comman_components/PageHeader';
import FeeAssignment from '../../../components/fees/FeeAssignment';

const FeeAssignmentPage = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <PageHeader 
            title="Fee Assignment" 
            breadcrumbs={[
              { label: 'Dashboard', href: '/admin' },
              { label: 'Fee Collection', href: '#' },
              { label: 'Fee Assignment', href: '/admin/fee-assignment' }
            ]}
          />
          <FeeAssignment />
        </main>
      </div>
    </div>
  );
};

export default FeeAssignmentPage;
