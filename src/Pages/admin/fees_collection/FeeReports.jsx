import React, { memo, useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import Header from "../../../components/comman_components/Header";
import Footer from "../../../components/comman_components/Footer";
import PageHeader from "../../../components/comman_components/PageHeader";
import ReusableTable from "../../../components/comman_components/ReusableTable";
import ReportHeading from "../../../components/comman_components/ReportHeading";
import { Search } from "lucide-react";
import {
  getAllClassesDropdown,
  getClassWiseDues,
} from "../../../helper/requests-method/feeV1Api";
import { toast } from "react-toastify";

const FeeReportsComponent = () => {
  const [classSections, setClassSections] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [classDuesData, setClassDuesData] = useState(null);
  const [classDuesLoading, setClassDuesLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    fetchClassSections();
  }, []);

  const fetchClassSections = async () => {
    try {
      const response = await getAllClassesDropdown();
      const classes =
        response?.data?.data ||
        response?.data?.classSections ||
        response?.data ||
        response ||
        [];
      setClassSections(Array.isArray(classes) ? classes : []);
    } catch (error) {
      console.error("Failed to fetch class sections:", error);
      toast.error("Failed to load class sections");
    }
  };

  const handleSearchClassDues = async () => {
    if (!selectedClassId) {
      toast.error("Please select class/section");
      return;
    }

    setClassDuesLoading(true);
    try {
      const response = await getClassWiseDues(selectedClassId);
      if (response?.success && response?.data) {
        setClassDuesData(response.data);
      } else {
        setClassDuesData(null);
        toast.error(response?.message || "Failed to fetch class dues");
      }
    } catch (error) {
      console.error("Failed to fetch class dues:", error);
      toast.error(error?.response?.data?.message || "Failed to fetch class dues");
      setClassDuesData(null);
    } finally {
      setClassDuesLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const studentsData = Array.isArray(classDuesData)
    ? classDuesData
    : classDuesData?.students || classDuesData?.data || [];

  const tableRows = studentsData.map((student, index) => {
    const invoices = Array.isArray(student?.invoices) ? student.invoices : [];
    const invoiceLabels = invoices.map((invoice) => invoice.invoice_number || invoice.invoice_no || invoice.id);
    const primaryInvoice = invoiceLabels[0] || "N/A";
    const dueAmount = invoices.reduce((sum, invoice) => sum + Number(invoice.balance_amount || 0), 0);
    const invoiceDetails = invoices.length
      ? invoices
          .map(
            (invoice) =>
              `${invoice.invoice_number || invoice.invoice_no || invoice.id} | Due: ${formatDate(
                invoice.due_date
              )} | Balance: ${formatCurrency(invoice.balance_amount)} | Status: ${invoice.status || "pending"}`
          )
          .join("\n")
      : "N/A";

    return {
      id: student.id || `student-${index + 1}`,
      serial_no: index + 1,
      student_name: student.name || "N/A",
      roll_number: student.roll_number || "N/A",
      invoice_id: primaryInvoice,
      due_amount: formatCurrency(dueAmount),
      invoice_count: student.invoice_count || 0,
      phone_no: student.phone_no || "N/A",
      email: student.email || "N/A",
      all_invoices: invoiceLabels.length ? invoiceLabels.join(", ") : "N/A",
      invoice_details: invoiceDetails,
      invoices,
    };
  });

  const tableColumns = [
    { key: "serial_no", header: "S.No" },
    { key: "student_name", header: "Student Name" },
    { key: "roll_number", header: "Roll Number" },
    { key: "invoice_id", header: "Invoice ID" },
    { key: "due_amount", header: "Due Amount" },
    { key: "invoice_count", header: "Invoices" },
    { key: "phone_no", header: "Phone" },
    { key: "email", header: "Email" },
    { key: "all_invoices", header: "All Invoice IDs" },
    { key: "invoice_details", header: "Invoice Details" },
  ];

  const displayColumns = tableColumns.filter(
    (column) => !["email", "all_invoices", "invoice_details"].includes(column.key)
  );

  return (
    <div className="bg-gray-100 flex">
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

        <main className="flex-1 overflow-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <PageHeader pageheading="Fee Management" Subheading="Fee Reports" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <button
                type="button"
                onClick={() => setActiveTab("due-installment")}
                className={`text-left ${
                  activeTab === "due-installment" ? "rounded-lg ring-2 ring-violet-300" : ""
                }`}
              >
                <ReportHeading mainheading="DUE INSTALLMENT" subhading="class section wise" />
              </button>
            </div>
            <div className="space-y-6">
              {activeTab !== "due-installment" && (
                <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
                  Select a report to continue.
                </div>
              )}

              {activeTab === "due-installment" && (
                <>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Class/Section <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedClassId}
                      onChange={(e) => setSelectedClassId(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    >
                      <option value="">-- Select Class --</option>
                      {classSections.map((cs) => (
                        <option key={cs.id} value={cs.id}>
                          {cs.class_name} - {cs.section_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <button
                      onClick={handleSearchClassDues}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 font-medium transition-colors cursor-pointer"
                    >
                      <Search className="w-4 h-4" />
                      Search
                    </button>
                  </div>
                </div>
              </div>

              <ReusableTable
                title="Class Dues Report"
                columns={tableColumns}
                displayColumns={displayColumns}
                apiFunction={async () => ({ success: true })}
                initialData={tableRows}
                viewApiFunction={async (item) => item}
                searchPlaceholder="Search by student name, roll number or invoice..."
                exportFileName="class-dues-report"
                showActions={{ add: false, edit: false, delete: false, view: true }}
              />

              {classDuesLoading && (
                <div className="text-center text-gray-600 py-2">Loading class dues...</div>
              )}
                </>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

const FeeReports = memo(FeeReportsComponent);

export default FeeReports;

