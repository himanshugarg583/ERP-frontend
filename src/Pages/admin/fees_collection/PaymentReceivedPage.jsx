import React from 'react';
import Sidebar from '../Sidebar';
import Header from '../../../components/comman_components/Header';
import PageHeader from '../../../components/comman_components/PageHeader';
import PaymentReceivedList from '../../../components/fees/PaymentReceivedList';

const PaymentReceivedPage = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <PageHeader 
            title="Payment Received" 
            breadcrumbs={[
              { label: 'Dashboard', href: '/admin' },
              { label: 'Fee Collection', href: '#' },
              { label: 'Payment Received', href: '/admin/payment-received' }
            ]}
          />
          <PaymentReceivedList />
        </main>
      </div>
    </div>
  );
};

export default PaymentReceivedPage;
