import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../Pages/admin/Sidebar";
import Header from "../comman_components/Header";
import Footer from "../comman_components/Footer";

const valueOrNA = (v) => {
  if (v === null || v === undefined || v === "") return "N/A";
  return String(v);
};

export default function ProfileDetail({
  breadcrumb = "",
  title = "",
  name = "",
  subtitle = "",
  imageUrl = null,
  summaryFields = [],
  contactFields = [],
  tabs = [],
  activeTab,
  setActiveTab,
  renderTabContent,
  SidebarComponent,
  sidebarProps,
}) {
  const navigate = useNavigate();
  const Sidebar = SidebarComponent || AdminSidebar;

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">
      <Sidebar {...(sidebarProps || {})} />
      <div className="overflow-auto relative z-1 flex flex-col" style={{ height: "100vh", width: "100vw" }}>
        <Header />
        <main className="flex-1 overflow-auto w-full py-6 px-4 md:px-6">
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <p className="text-xs text-slate-500">{breadcrumb}</p>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800">{title || name}</h1>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-6">
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-4">
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="h-24 w-24 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                    {imageUrl ? (
                      <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-slate-200" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-800">{name}</h2>
                    <p className="text-sm text-slate-500">{subtitle}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  {summaryFields.map((item) => (
                    <div key={item.label} className="grid grid-cols-[130px_1fr] gap-2 text-sm">
                      <span className="text-slate-500">{item.label}</span>
                      <span className="text-slate-900 font-semibold">{valueOrNA(item.value)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Contact</h3>
                <div className="space-y-3 text-sm">
                  {contactFields.map((c) => (
                    <div key={c.label} className="flex items-center gap-2 text-slate-600">
                      <span className="font-medium text-slate-500 w-28">{c.label}</span>
                      <span>{valueOrNA(c.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-4">
                <div className="flex flex-wrap gap-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab && setActiveTab(tab.key)}
                      className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        activeTab === tab.key
                          ? "bg-indigo-600 text-white shadow"
                          : "bg-slate-50 text-slate-600 hover:text-indigo-600"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {renderTabContent ? renderTabContent() : <div className="bg-white rounded-xl p-6">No content</div>}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
