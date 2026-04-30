import React, { useEffect, useState } from "react";
import StudentSidebar from "./StudentSidebar";
import Header from "../../components/comman_components/Header";
import { toast } from "react-toastify";
import { getStudentSelfFeeAssignment } from "../../helper/requests-method/feeV1Api";

const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const formatDate = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const StudentFeeAssign = () => {
  const [loading, setLoading] = useState(false);
  const [feeStructure, setFeeStructure] = useState(null);
  const [installments, setInstallments] = useState([]);

  const fetchAssignmentData = async () => {
    setLoading(true);
    try {
      const response = await getStudentSelfFeeAssignment();
      const data = response?.data || {};
      setFeeStructure(data?.fee_structure || null);
      setInstallments(Array.isArray(data?.installments) ? data.installments : []);
    } catch (error) {
      console.error("Failed to fetch fee assignment", error);
      toast.error(error?.response?.data?.message || "Failed to fetch fee assignment");
      setFeeStructure(null);
      setInstallments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignmentData();
  }, []);

  return (
    <div className="bg-gray-100 flex AddStudent">
      <StudentSidebar />

      <div className="overflow-auto relative z-10 flex-1" style={{ height: "100vh" }}>
        <Header />

        <main className="p-6 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h1 className="text-2xl font-bold text-gray-900">Fee Assign</h1>
            <p className="text-sm text-gray-600 mt-1">Fee structure and installment schedule assigned to your account.</p>
          </div>

          {loading ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-gray-500">Loading fee assignment...</div>
          ) : (
            <>
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Fee Structure</h2>
                {!feeStructure ? (
                  <p className="text-sm text-gray-500">No fee structure found.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div><span className="text-gray-500">Name:</span> <span className="font-medium">{feeStructure.name || "N/A"}</span></div>
                    <div><span className="text-gray-500">Type:</span> <span className="font-medium capitalize">{feeStructure.structure_type || "N/A"}</span></div>
                    <div className="md:col-span-2"><span className="text-gray-500">Description:</span> <span className="font-medium">{feeStructure.description || "N/A"}</span></div>
                    <div><span className="text-gray-500">Total Amount:</span> <span className="font-semibold">{formatCurrency(feeStructure.total_amount)}</span></div>
                    <div><span className="text-gray-500">Status:</span> <span className="font-medium">{feeStructure.is_active ? "Active" : "Inactive"}</span></div>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900">Installments</h2>
                </div>
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left">#</th>
                      <th className="px-4 py-3 text-left">Installment</th>
                      <th className="px-4 py-3 text-left">Start Date</th>
                      <th className="px-4 py-3 text-left">Due Date</th>
                      <th className="px-4 py-3 text-left">%</th>
                      <th className="px-4 py-3 text-left">Fixed Amount</th>
                      <th className="px-4 py-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {installments.length === 0 ? (
                      <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500">No installments found</td></tr>
                    ) : (
                      installments.map((item, index) => (
                        <tr key={item.installment_id || item.id || index} className="border-t border-gray-100">
                          <td className="px-4 py-3 text-gray-700">{item.installment_number || index + 1}</td>
                          <td className="px-4 py-3 font-medium text-gray-900">{item.installment_name || item.name || "N/A"}</td>
                          <td className="px-4 py-3 text-gray-700">{formatDate(item.start_date)}</td>
                          <td className="px-4 py-3 text-gray-700">{formatDate(item.due_date)}</td>
                          <td className="px-4 py-3 text-gray-700">{item.percentage ?? "-"}</td>
                          <td className="px-4 py-3 text-gray-700">
                            {item.fixed_amount === null || item.fixed_amount === undefined ? "-" : formatCurrency(item.fixed_amount)}
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-violet-100 text-violet-700 uppercase">
                              {item.invoice?.status || item.status || "pending"}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default StudentFeeAssign;
