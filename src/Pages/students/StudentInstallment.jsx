import React, { useEffect, useMemo, useState } from "react";
import StudentSidebar from "./StudentSidebar";
import Header from "../../components/comman_components/Header";
import { toast } from "react-toastify";
import {
  getStudentInvoicesList,
  getStudentInvoiceById,
  getStudentSelfUnpaidInvoices,
} from "../../helper/requests-method/feeV1Api";

const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const formatDate = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const StudentInstallment = () => {
  const [loading, setLoading] = useState(false);
  const [allInvoices, setAllInvoices] = useState([]);
  const [unpaidInvoices, setUnpaidInvoices] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const [listRes, unpaidRes] = await Promise.all([
        getStudentInvoicesList(),
        getStudentSelfUnpaidInvoices(),
      ]);

      setAllInvoices(Array.isArray(listRes?.data) ? listRes.data : []);
      setUnpaidInvoices(Array.isArray(unpaidRes?.data) ? unpaidRes.data : []);
    } catch (error) {
      console.error("Failed to fetch student invoices", error);
      toast.error(error?.response?.data?.message || "Failed to fetch invoices");
      setAllInvoices([]);
      setUnpaidInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const displayInvoices = useMemo(
    () => (activeFilter === "unpaid" ? unpaidInvoices : allInvoices),
    [activeFilter, unpaidInvoices, allInvoices]
  );

  const handleViewInvoice = async (invoiceId) => {
    if (!invoiceId) return;
    setViewLoading(true);
    try {
      const response = await getStudentInvoiceById(invoiceId);
      setSelectedInvoice(response?.data || null);
    } catch (error) {
      console.error("Failed to fetch invoice details", error);
      toast.error(error?.response?.data?.message || "Failed to fetch invoice details");
    } finally {
      setViewLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 flex AddStudent">
      <StudentSidebar />

      <div className="overflow-auto relative z-10 flex-1" style={{ height: "100vh" }}>
        <Header />

        <main className="p-6 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h1 className="text-2xl font-bold text-gray-900">Fee Installments</h1>
            <p className="text-sm text-gray-600 mt-1">Track your invoice installments and payable dues.</p>

            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                  activeFilter === "all" ? "bg-violet-600 text-white border-violet-600" : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                All Invoices
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("unpaid")}
                className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                  activeFilter === "unpaid" ? "bg-violet-600 text-white border-violet-600" : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                Unpaid Invoices
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">Invoice</th>
                  <th className="px-4 py-3 text-left">Installment</th>
                  <th className="px-4 py-3 text-left">Start Date</th>
                  <th className="px-4 py-3 text-left">Due Date</th>
                  <th className="px-4 py-3 text-left">Balance</th>
                  <th className="px-4 py-3 text-left">Payable</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-500">Loading invoices...</td></tr>
                ) : displayInvoices.length === 0 ? (
                  <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-500">No invoices found</td></tr>
                ) : (
                  displayInvoices.map((invoice) => (
                    <tr key={invoice.invoice_id} className="border-t border-gray-100">
                      <td className="px-4 py-3 font-medium text-gray-900">{invoice.invoice_number}</td>
                      <td className="px-4 py-3 text-gray-700">{invoice.installment_name || `Installment ${invoice.installment_number || ""}`}</td>
                      <td className="px-4 py-3 text-gray-700">{formatDate(invoice.start_date)}</td>
                      <td className="px-4 py-3 text-gray-700">{formatDate(invoice.due_date)}</td>
                      <td className="px-4 py-3 text-gray-900">{formatCurrency(invoice.balance_amount)}</td>
                      <td className="px-4 py-3 text-gray-900 font-semibold">{formatCurrency(invoice.payable_amount)}</td>
                      <td className="px-4 py-3">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-violet-100 text-violet-700 uppercase">
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => handleViewInvoice(invoice.invoice_id)}
                          className="px-3 py-1.5 text-xs rounded-md bg-blue-600 text-white hover:bg-blue-700"
                        >
                          View Invoice
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900">Invoice Details</h2>
            {viewLoading ? (
              <p className="text-sm text-gray-500 mt-2">Loading invoice details...</p>
            ) : !selectedInvoice ? (
              <p className="text-sm text-gray-500 mt-2">Select any invoice to view details.</p>
            ) : (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><span className="text-gray-500">Invoice:</span> <span className="font-medium">{selectedInvoice.invoice_number}</span></div>
                <div><span className="text-gray-500">Installment:</span> <span className="font-medium">{selectedInvoice.installment_name || "N/A"}</span></div>
                <div><span className="text-gray-500">Start Date:</span> <span className="font-medium">{formatDate(selectedInvoice.start_date)}</span></div>
                <div><span className="text-gray-500">Due Date:</span> <span className="font-medium">{formatDate(selectedInvoice.due_date)}</span></div>
                <div><span className="text-gray-500">Gross:</span> <span className="font-medium">{formatCurrency(selectedInvoice.gross_amount)}</span></div>
                <div><span className="text-gray-500">Concession:</span> <span className="font-medium">{formatCurrency(selectedInvoice.concession_amount)}</span></div>
                <div><span className="text-gray-500">Net:</span> <span className="font-medium">{formatCurrency(selectedInvoice.net_amount)}</span></div>
                <div><span className="text-gray-500">Paid:</span> <span className="font-medium">{formatCurrency(selectedInvoice.paid_amount)}</span></div>
                <div><span className="text-gray-500">Balance:</span> <span className="font-medium">{formatCurrency(selectedInvoice.balance_amount)}</span></div>
                <div><span className="text-gray-500">Fine Type:</span> <span className="font-medium">{selectedInvoice.fine_type || "N/A"}</span></div>
                <div><span className="text-gray-500">Calculated Fine:</span> <span className="font-medium">{formatCurrency(selectedInvoice.calculated_fine)}</span></div>
                <div><span className="text-gray-500">Payable:</span> <span className="font-semibold">{formatCurrency(selectedInvoice.payable_amount)}</span></div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentInstallment;
