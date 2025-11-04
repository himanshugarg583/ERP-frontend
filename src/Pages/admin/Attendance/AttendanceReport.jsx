import React from "react";
import PageHeader from "../../../components/comman_components/PageHeader";
import { Attendance } from "../../../components/comman_components/Reports";
import Header from "../../../components/comman_components/Header";
import Sidebar from "../Sidebar";

const StudentReports = () => {
  return (
    <div className="bg-slate-200 flex AddStudent">
      <Sidebar />

      <div
        className=" overflow-auto relative z-1 flex-col"
        style={{
          height: "95vh",
          width: "100vw",
          gap: "10px",
          display: "flex",
          transition: "margin-left 0.3s ease",
        }}
      >
        <Header />

        <main className="">
          <Attendance></Attendance>
        </main>
      </div>
    </div>
  );
};

export default StudentReports;
