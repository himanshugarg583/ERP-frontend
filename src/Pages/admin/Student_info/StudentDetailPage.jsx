import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Mail, Phone, MapPin, User } from "lucide-react";
import ProfileDetail from "../../../components/profile/ProfileDetail";
import { getStudentCompleteFeeDetails } from "../../../helper/requests-method/apiMethods";

const valueOrNA = (value) => {
  if (value === null || value === undefined || value === "") return "N/A";
  return String(value);
};

const formatDate = (value) => {
  if (!value) return "N/A";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return valueOrNA(value);
  return parsed.toLocaleDateString("en-GB");
};

const formatCurrency = (value) => {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return valueOrNA(value);
  return `INR ${amount.toLocaleString("en-IN")}`;
};

const formatYesNo = (value) => {
  if (value === null || value === undefined || value === "") return "N/A";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (String(value).toLowerCase() === "true") return "Yes";
  if (String(value).toLowerCase() === "false") return "No";
  return valueOrNA(value);
};

const StudentDetailPage = () => {
  const { studentId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const studentState = location.state?.student || {};
  const studentRaw = studentState?.raw || studentState || {};
  const studentUser = studentRaw.User || studentRaw.user || {};
  const classSection = studentRaw.ClassSection || studentRaw.class_section || {};

  const resolvedStudentId =
    studentState?.student_id ||
    studentState?.id ||
    studentRaw?.student_id ||
    studentRaw?.id ||
    studentId;

  const [activeTab, setActiveTab] = useState("profile");
  const [feeDetails, setFeeDetails] = useState(null);
  const [feeLoading, setFeeLoading] = useState(false);
  const [feeError, setFeeError] = useState("");

  useEffect(() => {
    const fetchFeeDetails = async () => {
      if (!resolvedStudentId) return;
      setFeeLoading(true);
      setFeeError("");
      try {
        const response = await getStudentCompleteFeeDetails(resolvedStudentId);
        setFeeDetails(response?.data || response);
      } catch (error) {
        setFeeError(error?.response?.data?.message || "Failed to load fee details");
      } finally {
        setFeeLoading(false);
      }
    };

    fetchFeeDetails();
  }, [resolvedStudentId]);

  const studentName =
    studentState?.name ||
    studentUser?.name ||
    studentRaw?.student_name ||
    "Student";

  const className =
    studentState?.class_name ||
    classSection?.class_name ||
    studentRaw?.class_name ||
    "N/A";

  const sectionName =
    studentState?.section_name ||
    classSection?.section_name ||
    studentRaw?.section_name ||
    "";

  const classLabel = [className, sectionName].filter(Boolean).join(" ");

  const summaryFields = useMemo(() => {
    return [
      { label: "Admission No.", value: studentRaw?.admission_number || studentRaw?.admission_no },
      { label: "Biometric Id", value: studentRaw?.biometric_id || studentRaw?.biometricId },
      { label: "Roll Number", value: studentRaw?.roll_number || studentState?.roll_number },
      { label: "Class", value: classLabel || "N/A" },
      { label: "Section", value: sectionName || "N/A" },
      { label: "RTE", value: formatYesNo(studentRaw?.rte || studentRaw?.is_rte) },
      { label: "Gender", value: studentRaw?.gender || studentState?.gender },
      { label: "National ID Number", value: studentRaw?.national_id || studentRaw?.national_id_number },
      { label: "PEN", value: studentRaw?.pen_number || studentRaw?.pen },
      { label: "SR No", value: studentRaw?.sr_no || studentRaw?.sr_number },
      { label: "Student Behaviour", value: studentRaw?.student_behaviour || studentRaw?.behavior },
    ];
  }, [classLabel, sectionName, studentRaw, studentState]);

  const studentInfoFields = [
    { label: "Admission Date", value: formatDate(studentRaw?.admission_date || studentRaw?.admissionDate) },
    { label: "Admitted in Class", value: classLabel || "N/A" },
    { label: "Date of Birth", value: formatDate(studentRaw?.dob || studentRaw?.date_of_birth) },
    { label: "Category", value: studentRaw?.category || studentRaw?.category_name },
    { label: "Mobile Number", value: studentRaw?.phone_no || studentRaw?.mobile_no || studentUser?.phone },
    { label: "Caste", value: studentRaw?.caste || studentRaw?.caste_name },
    { label: "Religion", value: studentRaw?.religion || studentRaw?.religion_name },
    { label: "Email", value: studentUser?.email || studentRaw?.email },
  ];

  const addressFields = [
    { label: "Current Address", value: studentRaw?.current_address || studentRaw?.address },
    { label: "Permanent Address", value: studentRaw?.permanent_address || studentRaw?.permanentAddress },
  ];

  const transportFields = [
    { label: "Route Name", value: studentRaw?.transport_route || studentRaw?.route_name },
    { label: "Bus Stop Name", value: studentRaw?.bus_stop_name || studentRaw?.bus_stop },
  ];

  const guardianFields = [
    { label: "Father Name", value: studentRaw?.father_name || studentRaw?.fatherName },
    { label: "Father Phone", value: studentRaw?.father_phone || studentRaw?.father_mobile },
    { label: "Father Dob", value: formatDate(studentRaw?.father_dob || studentRaw?.fatherDob) },
    { label: "Marriage Anniversary Date", value: formatDate(studentRaw?.marriage_anniversary_date) },
    { label: "Father Occupation", value: studentRaw?.father_occupation || studentRaw?.fatherOccupation },
    { label: "Mother Name", value: studentRaw?.mother_name || studentRaw?.motherName },
    { label: "Mother Phone", value: studentRaw?.mother_phone || studentRaw?.mother_mobile },
    { label: "Mother Dob", value: formatDate(studentRaw?.mother_dob || studentRaw?.motherDob) },
    { label: "Mother Occupation", value: studentRaw?.mother_occupation || studentRaw?.motherOccupation },
    { label: "Guardian Name", value: studentRaw?.guardian_name || studentRaw?.guardianName },
    { label: "Guardian Email", value: studentRaw?.guardian_email || studentRaw?.guardianEmail },
    { label: "Guardian Relation", value: studentRaw?.guardian_relation || studentRaw?.guardianRelation },
    { label: "Guardian Phone", value: studentRaw?.guardian_phone || studentRaw?.guardian_mobile },
    { label: "Guardian Occupation", value: studentRaw?.guardian_occupation || studentRaw?.guardianOccupation },
    { label: "Guardian Address", value: studentRaw?.guardian_address || studentRaw?.guardianAddress },
  ];

  const miscFields = [
    { label: "Blood Group", value: studentRaw?.blood_group || studentRaw?.bloodGroup },
    { label: "House", value: studentRaw?.house || studentRaw?.house_name },
    { label: "Height", value: studentRaw?.height },
    { label: "Weight", value: studentRaw?.weight },
    { label: "Date of Leaving", value: formatDate(studentRaw?.date_of_leaving || studentRaw?.leaving_date) },
    { label: "Previous School Details", value: studentRaw?.previous_school_details || studentRaw?.previous_school },
    { label: "Bank Account Number", value: studentRaw?.bank_account_number || studentRaw?.bank_account_no },
    { label: "Bank Name", value: studentRaw?.bank_name },
    { label: "Branch Code", value: studentRaw?.branch_code || studentRaw?.ifsc_code },
    { label: "Note", value: studentRaw?.note || studentRaw?.remarks },
  ];

  const documents = Array.isArray(studentRaw?.documents)
    ? studentRaw.documents
    : Array.isArray(studentRaw?.student_documents)
    ? studentRaw.student_documents
    : [];

  const examHistory = Array.isArray(studentRaw?.exam_history)
    ? studentRaw.exam_history
    : Array.isArray(studentRaw?.exams)
    ? studentRaw.exams
    : [];

  const issuedItems = Array.isArray(studentRaw?.issued_items)
    ? studentRaw.issued_items
    : [];

  const soldItems = Array.isArray(studentRaw?.sold_items)
    ? studentRaw.sold_items
    : [];

  const achievements = Array.isArray(studentRaw?.achievements)
    ? studentRaw.achievements
    : [];

  const complaints = Array.isArray(studentRaw?.complaints)
    ? studentRaw.complaints
    : [];

  const attendanceSummary = studentRaw?.attendance_summary || studentRaw?.attendance || {};
  const disciplineSummary = studentRaw?.discipline || {};
  const walletSummary = studentRaw?.wallet || {};
  const healthcareSummary = studentRaw?.healthcare || {};
  const ptmSummary = studentRaw?.ptm || {};

  const feePayload = feeDetails?.data || feeDetails || {};
  const feeSummary =
    feePayload?.summary || feePayload?.fee_summary || feePayload?.student_fee_summary || feePayload?.feeSummary || {};
  const feeInstallments =
    feePayload?.installments || feePayload?.fee_installments || feePayload?.installment_details || [];
  const feeTransactions =
    feePayload?.transactions || feePayload?.payment_history || feePayload?.paymentHistory || [];

  const tabs = [
    { key: "profile", label: "Profile" },
    { key: "fees", label: "Fees" },
    { key: "exam", label: "Exam" },
    { key: "documents", label: "Documents" },
    { key: "ptm", label: "PTM" },
    { key: "issued", label: "Issued Item" },
    { key: "sold", label: "Sold Item" },
    { key: "healthcare", label: "Healthcare" },
    { key: "complain", label: "Complain" },
    { key: "discipline", label: "Discipline" },
    { key: "attendance", label: "Attendance" },
    { key: "achievements", label: "Achievements" },
    { key: "wallet", label: "Wallet" },
  ];

  const renderInfoSection = (title, items) => (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 rounded-t-xl">
        <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-4 py-4">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col">
            <span className="text-xs text-slate-500 font-medium">{item.label}</span>
            <span className="text-sm text-slate-900 font-semibold">{valueOrNA(item.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEmptyState = (message) => (
    <div className="bg-white rounded-xl border border-dashed border-slate-200 p-8 text-center text-slate-500 text-sm">
      {message}
    </div>
  );

  const renderProfileTab = () => (
    <div className="space-y-5">
      {renderInfoSection("Student Info", studentInfoFields)}
      {renderInfoSection("Address Details", addressFields)}
      {renderInfoSection("Transport Details", transportFields)}
      {renderInfoSection("Parent / Guardian Details", guardianFields)}
      {renderInfoSection("Miscellaneous Details", miscFields)}
    </div>
  );

  const renderFeeTab = () => (
    <div className="space-y-5">
      {feeLoading && (
        <div className="bg-white rounded-xl border border-slate-100 p-6 text-sm text-slate-600">
          Loading fee details...
        </div>
      )}
      {feeError && !feeLoading && renderEmptyState(feeError)}
      {!feeLoading && !feeError && (
        <>
          {renderInfoSection("Fee Summary", [
            { label: "Total Fee", value: formatCurrency(feeSummary?.total_fee || feePayload?.total_fee) },
            { label: "Paid Amount", value: formatCurrency(feeSummary?.paid_amount || feePayload?.paid_amount) },
            { label: "Pending Amount", value: formatCurrency(feeSummary?.pending_amount || feePayload?.pending_amount) },
            { label: "Due Amount", value: formatCurrency(feeSummary?.due_amount || feePayload?.due_amount) },
          ])}

          <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 rounded-t-xl">
              <h3 className="text-sm font-semibold text-slate-700">Installments</h3>
            </div>
            {feeInstallments.length === 0 ? (
              <div className="px-4 py-5 text-sm text-slate-500">No installment records available.</div>
            ) : (
              <div className="overflow-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold">Installment</th>
                      <th className="text-left px-4 py-3 font-semibold">Due Date</th>
                      <th className="text-left px-4 py-3 font-semibold">Amount</th>
                      <th className="text-left px-4 py-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {feeInstallments.map((item, index) => (
                      <tr key={item?.id || index}>
                        <td className="px-4 py-3">{valueOrNA(item?.name || item?.installment_name || `Installment ${index + 1}`)}</td>
                        <td className="px-4 py-3">{formatDate(item?.due_date || item?.dueDate)}</td>
                        <td className="px-4 py-3">{formatCurrency(item?.amount || item?.fee_amount)}</td>
                        <td className="px-4 py-3">{valueOrNA(item?.status || item?.payment_status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 rounded-t-xl">
              <h3 className="text-sm font-semibold text-slate-700">Payment History</h3>
            </div>
            {feeTransactions.length === 0 ? (
              <div className="px-4 py-5 text-sm text-slate-500">No payments recorded.</div>
            ) : (
              <div className="overflow-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold">Date</th>
                      <th className="text-left px-4 py-3 font-semibold">Mode</th>
                      <th className="text-left px-4 py-3 font-semibold">Amount</th>
                      <th className="text-left px-4 py-3 font-semibold">Reference</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {feeTransactions.map((item, index) => (
                      <tr key={item?.id || index}>
                        <td className="px-4 py-3">{formatDate(item?.paid_on || item?.date)}</td>
                        <td className="px-4 py-3">{valueOrNA(item?.payment_mode || item?.mode)}</td>
                        <td className="px-4 py-3">{formatCurrency(item?.amount || item?.paid_amount)}</td>
                        <td className="px-4 py-3">{valueOrNA(item?.reference_no || item?.transaction_id)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );

  const renderDocumentsTab = () => (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 rounded-t-xl">
        <h3 className="text-sm font-semibold text-slate-700">Documents</h3>
      </div>
      {documents.length === 0 ? (
        <div className="px-4 py-5 text-sm text-slate-500">No documents uploaded.</div>
      ) : (
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Document</th>
                <th className="text-left px-4 py-3 font-semibold">Type</th>
                <th className="text-left px-4 py-3 font-semibold">Status</th>
                <th className="text-left px-4 py-3 font-semibold">Uploaded</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {documents.map((doc, index) => (
                <tr key={doc?.id || index}>
                  <td className="px-4 py-3">{valueOrNA(doc?.name || doc?.title)}</td>
                  <td className="px-4 py-3">{valueOrNA(doc?.type || doc?.document_type)}</td>
                  <td className="px-4 py-3">{valueOrNA(doc?.status || doc?.verification_status)}</td>
                  <td className="px-4 py-3">{formatDate(doc?.uploaded_at || doc?.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderExamTab = () => (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 rounded-t-xl">
        <h3 className="text-sm font-semibold text-slate-700">Exam Summary</h3>
      </div>
      {examHistory.length === 0 ? (
        <div className="px-4 py-5 text-sm text-slate-500">No exam history available.</div>
      ) : (
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Exam</th>
                <th className="text-left px-4 py-3 font-semibold">Score</th>
                <th className="text-left px-4 py-3 font-semibold">Grade</th>
                <th className="text-left px-4 py-3 font-semibold">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {examHistory.map((exam, index) => (
                <tr key={exam?.id || index}>
                  <td className="px-4 py-3">{valueOrNA(exam?.name || exam?.exam_name)}</td>
                  <td className="px-4 py-3">{valueOrNA(exam?.score || exam?.total_marks)}</td>
                  <td className="px-4 py-3">{valueOrNA(exam?.grade)}</td>
                  <td className="px-4 py-3">{valueOrNA(exam?.remarks)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderSimpleGrid = (title, items) => (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 rounded-t-xl">
        <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-4 py-4">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col">
            <span className="text-xs text-slate-500 font-medium">{item.label}</span>
            <span className="text-sm text-slate-900 font-semibold">{valueOrNA(item.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderListTable = (title, rows, columns) => (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 rounded-t-xl">
        <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
      </div>
      {rows.length === 0 ? (
        <div className="px-4 py-5 text-sm text-slate-500">No records available.</div>
      ) : (
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                {columns.map((column) => (
                  <th key={column.key} className="text-left px-4 py-3 font-semibold">{column.label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row, index) => (
                <tr key={row?.id || index}>
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-3">
                      {column.format ? column.format(row?.[column.key]) : valueOrNA(row?.[column.key])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return renderProfileTab();
      case "fees":
        return renderFeeTab();
      case "documents":
        return renderDocumentsTab();
      case "exam":
        return renderExamTab();
      case "ptm":
        return renderSimpleGrid("Parent Teacher Meeting", [
          { label: "Last Meeting Date", value: formatDate(ptmSummary?.last_meeting_date || ptmSummary?.lastMeetingDate) },
          { label: "Counselor", value: ptmSummary?.counselor || ptmSummary?.teacher_name },
          { label: "Notes", value: ptmSummary?.notes || ptmSummary?.remarks },
        ]);
      case "issued":
        return renderListTable(
          "Issued Items",
          issuedItems,
          [
            { key: "item_name", label: "Item" },
            { key: "issued_on", label: "Issued On", format: formatDate },
            { key: "status", label: "Status" },
          ]
        );
      case "sold":
        return renderListTable(
          "Sold Items",
          soldItems,
          [
            { key: "item_name", label: "Item" },
            { key: "sold_on", label: "Sold On", format: formatDate },
            { key: "amount", label: "Amount", format: formatCurrency },
          ]
        );
      case "healthcare":
        return renderSimpleGrid("Healthcare", [
          { label: "Blood Group", value: healthcareSummary?.blood_group || studentRaw?.blood_group },
          { label: "Allergies", value: healthcareSummary?.allergies },
          { label: "Medical Notes", value: healthcareSummary?.notes },
          { label: "Insurance", value: healthcareSummary?.insurance_provider },
        ]);
      case "complain":
        return renderListTable(
          "Complaints",
          complaints,
          [
            { key: "subject", label: "Subject" },
            { key: "created_at", label: "Date", format: formatDate },
            { key: "status", label: "Status" },
          ]
        );
      case "discipline":
        return renderSimpleGrid("Discipline", [
          { label: "Warnings", value: disciplineSummary?.warning_count },
          { label: "Last Incident", value: disciplineSummary?.last_incident },
          { label: "Remarks", value: disciplineSummary?.remarks },
        ]);
      case "attendance":
        return renderSimpleGrid("Attendance", [
          { label: "Total Days", value: attendanceSummary?.total_days },
          { label: "Present", value: attendanceSummary?.present_days },
          { label: "Absent", value: attendanceSummary?.absent_days },
          { label: "Attendance %", value: attendanceSummary?.attendance_percentage },
        ]);
      case "achievements":
        return renderListTable(
          "Achievements",
          achievements,
          [
            { key: "title", label: "Title" },
            { key: "date", label: "Date", format: formatDate },
            { key: "remarks", label: "Remarks" },
          ]
        );
      case "wallet":
        return renderSimpleGrid("Wallet", [
          { label: "Balance", value: formatCurrency(walletSummary?.balance) },
          { label: "Last Transaction", value: formatDate(walletSummary?.last_transaction_date) },
          { label: "Status", value: walletSummary?.status },
        ]);
      default:
        return renderEmptyState("No data available.");
    }
  };

  return (
    <ProfileDetail
      breadcrumb="Student Info / Student Details"
      title="Student Admission"
      name={studentName}
      subtitle={classLabel}
      imageUrl={studentRaw?.photo_url || studentRaw?.student_photo || studentRaw?.profile_photo}
      summaryFields={summaryFields}
      contactFields={[
        { label: "Email", value: studentUser?.email || studentRaw?.email },
        { label: "Phone", value: studentRaw?.phone_no || studentRaw?.mobile_no },
        { label: "Address", value: studentRaw?.current_address || studentRaw?.address },
      ]}
      tabs={tabs}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      renderTabContent={renderTabContent}
    />
  );
};

export default StudentDetailPage;
