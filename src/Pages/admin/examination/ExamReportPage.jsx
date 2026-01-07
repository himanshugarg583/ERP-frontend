import React, { useState } from "react";
import Sidebar from "../Sidebar";
import Header from "../../../components/comman_components/Header";
import ReportHeading from "../../../components/comman_components/ReportHeading";
import ClassWiseReport from "../../../components/examanitaion/ClassWiseReport";
import SubjectWiseReport from "../../../components/examanitaion/SubjectWiseReport";
import SubjectWiseMarkRegister from "../../../components/examanitaion/SubjectWiseMarkRegister";import StudentWiseList from '../../../components/examanitaion/StudentWiseList';
const ExamReportPage = () => {
  const [selectedReport, setSelectedReport] = useState(null);

  const handleReportClick = (reportType) => {
    setSelectedReport(reportType);
  };

  const handleBackToMenu = () => {
    setSelectedReport(null);
  };

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
          {!selectedReport ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-5">
              <div onClick={() => handleReportClick('classwise')} className="cursor-pointer">
                <ReportHeading
                  mainheading="Class Wise Report"
                  subhading="class section wise"
                />
              </div>
              <div onClick={() => handleReportClick('subjectwise')} className="cursor-pointer">
                <ReportHeading
                  mainheading="Subject Wise Report"
                  subhading="class section wise"
                />
              </div>
              <div onClick={() => handleReportClick('subjectwiseregister')} className="cursor-pointer">
                <ReportHeading
                  mainheading="Subject Wise Mark Register"
                  subhading="class section wise"
                />
              </div>
              <div onClick={() => handleReportClick('studentwise')} className="cursor-pointer">
                <ReportHeading
                  mainheading="Student Wise List"
                  subhading="View all students by class"
                />
              </div>
            </div>
          ) : (
            <div className="px-5">
              <button
                onClick={handleBackToMenu}
                className="mb-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                ← Back to Reports Menu
              </button>
              
              {selectedReport === 'classwise' && <ClassWiseReport />}
              {selectedReport === 'subjectwise' && <SubjectWiseReport />}
              {selectedReport === 'subjectwiseregister' && <SubjectWiseMarkRegister />}
              {selectedReport === 'studentwise' && <StudentWiseList />}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ExamReportPage;
