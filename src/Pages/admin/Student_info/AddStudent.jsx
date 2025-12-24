import React, { useState } from "react";
// import Formsec from '../../../components/FormSection/Formsec';
import PageHeader from "../../../components/comman_components/PageHeader";
// import Question from '../../../components/FormSection/Question';
import Sidebar from "../Sidebar";
import { div } from "framer-motion/client";
import { FaDownload } from "react-icons/fa";
import "../Admin.css";
import pdffile from "../../../assets/sample.pdf";
import CombinedForm from "../../../components/FormSection/Forms";
import Header from "../../../components/comman_components/Header";

const AddStudent = () => {
  function downloadPdf() {
    const link = document.createElement("a");
    link.href = pdffile; // Path to your PDF in the `public` folder
    link.download = "AdmissionForm.pdf"; // Name of the downloaded file
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // C:\Users\dell\Desktop\School_fronend\src\assets\sample.pdf
  }

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

        <div class="bg-whitse shadow-sm border border-slate-200 rounded-xl w-full p-6 md:p-8 flex-1 overflow-auto relative z-1 text-black">
          {/* <PageHeader pageheading ="Student Info" Subheading="Student Admission" className="m-auto "/>  */}

          <div class="flex justify-between items-center border-b border-slate-200 pb-4 mb-4">
            <h1 class="text-2xl font-semibold flex items-center">
              <i class="fas fa-file-alt mr-2"></i> Student Admission Form
            </h1>

            <button
              class="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-md mr-2 flex justify-center gap-1"
              style={{ alignItems: "center" }}
              onClick={downloadPdf}
            >
              <FaDownload size={15} color="white" />
              <p>Download Form </p>
            </button>
          </div>

          <CombinedForm />
        </div>
      </div>
    </div>
  );
};

export default AddStudent;
