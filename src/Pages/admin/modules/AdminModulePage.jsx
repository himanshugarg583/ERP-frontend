import React from "react";
import { Link } from "react-router-dom";
import Sidebar from "../Sidebar";
import Header from "../../../components/comman_components/Header";
import Footer from "../../../components/comman_components/Footer";

const AdminModulePage = ({ title, description, links = [] }) => {
  return (
    <div className="bg-gray-100 flex h-screen overflow-hidden">
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

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800">{title}</h1>
              <p className="mt-2 text-slate-600">{description}</p>
            </div>

            {links.length > 0 && (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {links.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="rounded-xl bg-white border border-gray-100 p-5 shadow-sm hover:shadow-md transition"
                  >
                    <p className="text-lg font-semibold text-slate-800">{item.name}</p>
                    <p className="mt-1 text-sm text-slate-600">Open {item.name}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default AdminModulePage;
