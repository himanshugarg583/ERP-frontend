import React from "react";
import Header from "../../../components/comman_components/Header";
import Sidebar from "../Sidebar";
import AttendanceReport from "../../../components/attendance/AttendanceReport";

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

        <main className="p-6">
          <AttendanceReport/>
        </main>
      </div>
    </div>
  );
};

export default StudentReports;
