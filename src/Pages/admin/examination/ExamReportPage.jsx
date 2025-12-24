import React from "react";
import Sidebar from "../Sidebar";
import Header from "../../../components/comman_components/Header";
import ReportHeading from "../../../components/comman_components/ReportHeading";

const ExamReportPage = () => {
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

        <main className="w-full p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-5">
            <ReportHeading
              mainheading="Class Wise Report"
              subhading="class section wise"
            />
            <ReportHeading
              mainheading="Subject Wise Report"
              subhading="class section wise"
            />
            <ReportHeading
              mainheading="Teacher Wise"
              subhading="class section wise"
            />
            <ReportHeading
              mainheading="Fail Student"
              subhading="class section wise"
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ExamReportPage;
