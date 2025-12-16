import React from "react";
import Sidebar from "../Sidebar";
import { FaDownload } from "react-icons/fa";
import CombinedForm from "../../../components/FormSection/Forms";
import Header from "../../../components/comman_components/Header";
import pdffile from "../../../assets/sample.pdf";

const AddStudent = () => {
  const downloadPdf = () => {
    const link = document.createElement("a");
    link.href = pdffile;
    link.download = "AdmissionForm.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-200 flex AddStudent">
      <Sidebar />
      <div className="overflow-auto relative z-1 flex-col" style={{ height: '95vh', width: '100vw', gap: '10px', display: 'flex', transition: 'margin-left 0.3s ease' }}>
        <Header />
        <main className="w-full py-4 md:py-6 px-4 md:px-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4 mb-6">
              <h1 className="text-xl md:text-2xl font-semibold text-slate-800 flex items-center gap-2">
                <i className="fas fa-file-alt"></i>
                <span>Student Admission Form</span>
              </h1>
              <button
                onClick={downloadPdf}
                className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm md:text-base"
              >
                <FaDownload size={16} />
                <span>Download Form</span>
              </button>
            </div>
            <CombinedForm />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddStudent;
