import React, { memo } from "react";
import Sidebar from "../Sidebar";
import Header from "../../../components/comman_components/Header";
import Footer from "../../../components/comman_components/Footer";
import PageHeader from "../../../components/comman_components/PageHeader";
import { DollarSign } from "lucide-react";

const PaymentReceived = () => {
  return (
    <div className="bg-gray-100 flex">
      <Sidebar />

      <div
        className="overflow-auto relative z-1 flex flex-col"
        style={{
          height: "100vh",
          width: "100vw",
          transition: "margin-left 0.3s ease",
        }}
      >
        <Header />

        <main className="flex-1 overflow-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <PageHeader pageheading="Fee Management" Subheading="Payment Received" />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Payment Received</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Payment received functionality will be implemented here. This section allows you to record and manage fee payments from students.
                </p>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

const PaymentReceivedPage = memo(PaymentReceived);

export default PaymentReceivedPage;
