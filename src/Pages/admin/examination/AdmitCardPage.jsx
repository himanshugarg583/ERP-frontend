import React from "react";
import Sidebar from "../Sidebar";
import Header from "../../../components/comman_components/Header";
import CreateAdmitCard from "../../../components/examanitaion/CreateAdmitCard";

const AdmitCardPage = () => {
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

        <main className="">
          <CreateAdmitCard
            tabletitle="Admit Card Management"
            title1="Student Name"
            title2="Admission #"
            title3="Roll No"
            title4="Class"
            title5="Actions"
          />
        </main>
      </div>
    </div>
  );
};

export default AdmitCardPage;

