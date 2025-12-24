import React, { memo } from "react";
import Sidebar from "./Sidebar";
import Header from "../../components/comman_components/Header";
import Footer from "../../components/comman_components/Footer";
import AdminDashboard from "../../components/AdminDash/AdminDashboard";

const AdminDashboardPage = () => {
  return (
    <div className="bg-gray-100 flex AddStudent">
      <Sidebar />

      <div
        className="overflow-auto relative z-1 flex flex-col"
        style={{
          height: "100vh",
          width: "100vw",
          transition: "margin-left 0.3s ease",
        }}
      >
        <Header />

        <main className="flex-1 overflow-auto">
          <AdminDashboard />
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default memo(AdminDashboardPage);
