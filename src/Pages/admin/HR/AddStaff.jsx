import React, { useState } from "react";
import Sidebar from "../Sidebar";
import Header from "../../../components/comman_components/Header";

const documentRows = [
  { id: 1, title: "Resume" },
  { id: 2, title: "Joining Letter" },
  { id: 3, title: "Other Documents" },
  { id: 4, title: "Signature" },
  { id: 5, title: "Previous Experience Letter" },
  { id: 6, title: "Salary Slip" },
];

const AddStaff = () => {
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importFileName, setImportFileName] = useState("");

  return (
    <div className="bg-slate-200 flex">
      <Sidebar />
      <div
        className="overflow-y-auto relative z-1 flex-col"
        style={{ height: "100vh", width: "100vw", gap: "10px", display: "flex", transition: "margin-left 0.3s ease" }}
      >
        <Header />
        <main className="w-full py-4 md:py-6 px-4 md:px-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h1 className="text-xl md:text-2xl font-semibold text-slate-800">Staff Directory</h1>
                <p className="text-sm text-slate-500">Human Resource / Add staff directory</p>
              </div>
              <button
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors"
                onClick={() => setIsImportOpen(true)}
              >
                Import Staff
              </button>
            </div>

            <div className="mt-5 space-y-6">
              <details className="border border-slate-200 rounded-lg" open>
                <summary className="cursor-pointer list-none flex items-center justify-between bg-slate-50 px-4 py-3 rounded-t-lg">
                  <span className="text-sm font-semibold text-slate-700">Basic Information</span>
                  <span className="text-slate-400 text-sm">v</span>
                </summary>
                <div className="p-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-600">Staff ID *</label>
                      <input className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" placeholder="Enter staff id" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600">Biometric ID</label>
                      <input className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" placeholder="Enter biometric id" />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600">Role *</label>
                      <select className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2">
                        <option value="">Select</option>
                        <option>Teacher</option>
                        <option>Staff</option>
                        <option>Accountant</option>
                        <option>Librarian</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600">Designation</label>
                      <select className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2">
                        <option value="">Select</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600">Department</label>
                      <select className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2">
                        <option value="">Select</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600">First Name *</label>
                      <input className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" placeholder="Enter first name" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600">Last Name</label>
                      <input className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" placeholder="Enter last name" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600">Date of Birth *</label>
                      <input type="date" className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600">Father Name</label>
                      <input className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" placeholder="Enter father name" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600">Mother Name</label>
                      <input className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" placeholder="Enter mother name" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600">Gender *</label>
                      <select className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2">
                        <option value="">Select</option>
                        <option>Male</option>
                        <option>Female</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600">Marital Status</label>
                      <select className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2">
                        <option value="">Select</option>
                        <option>Single</option>
                        <option>Married</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600">Date Of Joining</label>
                      <input type="date" className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600">Phone *</label>
                      <input className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" placeholder="Enter phone" />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600">Emergency Contact Number</label>
                      <input className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" placeholder="Enter emergency contact" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600">Date of Leaving</label>
                      <input type="date" className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600">Email *</label>
                      <input type="email" className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" placeholder="Enter email" />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-slate-600">Current Address</label>
                      <textarea rows={3} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-xs font-medium text-slate-600">Permanent Address</label>
                      <textarea rows={3} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600">Qualification</label>
                      <input className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" placeholder="Enter qualification" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600">Work Experience</label>
                      <input className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" placeholder="Enter experience" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600">Note</label>
                      <input className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" placeholder="Add note" />
                    </div>
                  </div>

                  <div className="lg:col-span-1">
                    <label className="block text-xs font-medium text-slate-600 mb-2">Staff Profile</label>
                    <div className="border border-dashed border-slate-300 rounded-lg p-4 text-center">
                      <div className="w-24 h-28 rounded-md bg-slate-100 mx-auto mb-3 flex items-center justify-center text-xs text-slate-500">
                        NO IMAGE
                      </div>
                      <label className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-amber-100 text-amber-800 rounded-md border border-amber-200 hover:bg-amber-200 cursor-pointer text-xs font-medium w-full">
                        Choose File
                        <input type="file" className="hidden" />
                      </label>
                    </div>
                  </div>
                </div>
              </details>

              <details className="border border-slate-200 rounded-lg" open>
                <summary className="cursor-pointer list-none flex items-center justify-between bg-slate-50 px-4 py-3">
                  <span className="text-sm font-semibold text-slate-700">Upload Documents</span>
                  <span className="text-slate-400 text-sm">v</span>
                </summary>
                <div className="p-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-slate-600 border-b border-slate-200">
                          <th className="py-2 px-2 w-12">#</th>
                          <th className="py-2 px-2">Title</th>
                          <th className="py-2 px-2">Documents</th>
                        </tr>
                      </thead>
                      <tbody>
                        {documentRows.map((row) => (
                          <tr key={row.id} className="border-b border-slate-100">
                            <td className="py-2 px-2">{row.id}</td>
                            <td className="py-2 px-2">{row.title}</td>
                            <td className="py-2 px-2">
                              <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-md border border-amber-200 hover:bg-amber-200 cursor-pointer text-xs font-medium">
                                Choose File
                                <input type="file" className="hidden" />
                              </label>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </details>

              <div className="flex justify-end">
                <button className="px-6 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors">
                  Save
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {isImportOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ backgroundColor: "rgba(15, 23, 42, 0.45)" }}
          onClick={(e) => e.target === e.currentTarget && setIsImportOpen(false)}
        >
          <div className="bg-white w-full max-w-xl rounded-xl shadow-xl border border-slate-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">Import Staff</h2>
                <p className="text-xs text-slate-500">Download the sample file, fill it, and upload to import staff records.</p>
              </div>
              <button
                className="text-slate-400 hover:text-slate-600 text-lg"
                onClick={() => setIsImportOpen(false)}
                aria-label="Close"
              >
                x
              </button>
            </div>
            <div className="p-5 space-y-5">
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <p className="text-xs text-amber-900 font-medium">Step 1: Download Sample</p>
                <p className="text-xs text-amber-800 mt-1">Use the sample file to keep the columns in the correct order.</p>
                <a
                  href="/samples/staff-import-template.csv"
                  download
                  className="mt-3 inline-flex items-center justify-center px-4 py-2 rounded-md border border-amber-300 bg-white text-amber-800 text-sm font-medium hover:bg-amber-100 transition-colors"
                >
                  Download Sample
                </a>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs text-slate-700 font-medium">Step 2: Upload File</p>
                <p className="text-xs text-slate-500 mt-1">Supported formats: .csv, .xlsx</p>
                <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-3">
                  <label className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-amber-100 text-amber-800 border border-amber-200 text-sm font-medium hover:bg-amber-200 cursor-pointer">
                    Choose File
                    <input
                      type="file"
                      accept=".csv,.xlsx"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files && e.target.files[0];
                        setImportFileName(file ? file.name : "");
                      }}
                    />
                  </label>
                  <span className="text-xs text-slate-500">
                    {importFileName ? importFileName : "No file selected"}
                  </span>
                  <button className="sm:ml-auto inline-flex items-center justify-center px-4 py-2 rounded-md bg-amber-700 text-white text-sm font-medium hover:bg-amber-800 transition-colors">
                    Import
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddStaff;