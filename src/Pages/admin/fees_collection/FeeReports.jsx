import React from "react";
import { Fee } from "../../../components/comman_components/Reports";
import PageHeader from "../../../components/comman_components/PageHeader";
import Sidebar from "../Sidebar";
import Header from "../../../components/comman_components/Header";

const FeeReports = () => {
  return (
    <div className="bg-slate-200 flex AddStudent">
      <Sidebar />
      <div
        className="overflow-auto relative z-1 flex-col"
        style={{
          height: "95vh",
          width: "100vw",
          gap: "10px",
          display: "flex",
          transition: "margin-left 0.3s ease",
        }}
      >
        <Header />
        <main className="w-full py-6 px-4 md:px-6">
          <PageHeader pageheading="Fees Collection" Subheading="Fees Reports" />
          <div className="bg-white shadow-sm border border-slate-200 rounded-xl p-0 mt-4">
            <Fee />
          </div>
        </main>
      </div>
    </div>
  );
};

export default FeeReports;
