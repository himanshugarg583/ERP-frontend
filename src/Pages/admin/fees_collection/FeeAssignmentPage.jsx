import React, { memo } from "react";
import Sidebar from "../Sidebar";
import Header from "../../../components/comman_components/Header";
import Footer from "../../../components/comman_components/Footer";
import PageHeader from "../../../components/comman_components/PageHeader";
import { AlertCircle } from "lucide-react";

const FeeAssignment = () => {
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
              <PageHeader pageheading="Fee Management" Subheading="Fee Assignment" />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-violet-100 rounded-full mb-4">
                  <AlertCircle className="w-8 h-8 text-violet-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Fee Assignment</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Fee assignment functionality will be implemented here. This section allows you to assign fee structures to students.
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

const FeeAssignmentPage = memo(FeeAssignment);

export default FeeAssignmentPage;
