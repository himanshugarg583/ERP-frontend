import React from "react";
import { motion } from "framer-motion";
import Sidebar from "../Sidebar";
import Header from "../../../components/comman_components/Header";
import Footer from "../../../components/comman_components/Footer";
import CombinedForm from "../../../components/FormSection/Forms";
import { Download, UserPlus, FileText } from "lucide-react";
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
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex AddStudent">
      <Sidebar />
      <div
        className="overflow-auto relative z-1 flex flex-col"
        style={{
          height: '100vh',
          width: '100vw',
          transition: 'margin-left 0.3s ease'
        }}
      >
        <Header />

        <main className="flex-1 overflow-auto w-full py-6 px-4 md:px-6">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <UserPlus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Student Admission
                </h1>
                <p className="text-sm text-slate-600 mt-1">
                  Add new student to the system
                </p>
              </div>
            </div>
          </motion.div>

          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden"
          >
            {/* Card Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3 text-white">
                  <FileText className="w-6 h-6" />
                  <div>
                    <h2 className="text-xl font-semibold">Admission Form</h2>
                    <p className="text-sm text-indigo-100 mt-1">
                      Fill in the student details below
                    </p>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={downloadPdf}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white text-indigo-600 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Form</span>
                </motion.button>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-6">
              <CombinedForm />
            </div>
          </motion.div>

          {/* Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-indigo-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Required Documents</p>
                  <p className="font-semibold text-slate-800">Birth Certificate, Photos</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-purple-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Admission Status</p>
                  <p className="font-semibold text-slate-800">Open for 2025-26</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Download className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Form Format</p>
                  <p className="font-semibold text-slate-800">PDF Available</p>
                </div>
              </div>
            </div>
          </motion.div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default AddStudent;
