import React from "react";
import Sidebar from "../Sidebar";
import Header from "../../../components/comman_components/Header";

const StudyMaterial = () => {
  return (
    <div className="bg-slate-200 flex AddStudent">
      <Sidebar />
      <div
        className=" overflow-auto relative z-1 flex-col"
        style={{ height: "95vh", width: "100vw", gap: "10px", display: "flex", transition: "margin-left 0.3s ease" }}
      >
        <Header />
        <main className="w-full py-6 px-4 md:px-6">
          <div className="bg-white shadow-sm border border-slate-200 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-violet-700 mb-4">Study Material</h2>
            <p className="text-slate-600">No materials uploaded yet.</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudyMaterial;


