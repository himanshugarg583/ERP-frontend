import React, { memo, useEffect, useMemo, useState } from "react";
import Sidebar from "../Sidebar";
import Header from "../../../components/comman_components/Header";
import Footer from "../../../components/comman_components/Footer";
import PageHeader from "../../../components/comman_components/PageHeader";
import Modal from "../../../components/comman_components/Modal";
import ReusableTable from "../../../components/comman_components/ReusableTable";
import { AlertCircle, CheckCircle } from "lucide-react";
import {
  assignFeeWithInstallments,
  deleteClassFeeAssignment,
  getAcademicYearsDropdown,
  getAllClassesDropdown,
  getClassFeeAssignment,
  getFeeStructuresDropdown,
  viewClassFeeAssignmentStudents,
} from "../../../helper/requests-method/feeV1Api";
import { toast } from "react-toastify";

const getInitialForm = () => ({
  class_section_id: "",
  fee_structure_id: "",
  academic_year_id: "",
  custom_items: null,
  excluded_heads: null,
  override_json: null,
});

const FeeAssignment = () => {
  const [feeStructures, setFeeStructures] = useState([]);
  const [classSections, setClassSections] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState(getInitialForm());

  const [assignments, setAssignments] = useState([]);
  const [loadingAssignments, setLoadingAssignments] = useState(false);

  const [viewAssignment, setViewAssignment] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewStudentsData, setViewStudentsData] = useState(null);
  const [loadingViewData, setLoadingViewData] = useState(false);

  const selectedStructure = useMemo(
    () => feeStructures.find((item) => String(item.id) === String(form.fee_structure_id)),
    [feeStructures, form.fee_structure_id]
  );

  const academicYearMap = useMemo(() => {
    const map = new Map();
    academicYears.forEach((year) => map.set(String(year.id), year.name || "-"));
    return map;
  }, [academicYears]);

  useEffect(() => {
    fetchDropdowns();
    fetchAssignments();
  }, []);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess("");
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [success, error]);

  useEffect(() => {
    if (selectedStructure?.academic_year_id) {
      setForm((prev) => ({
        ...prev,
        academic_year_id: String(selectedStructure.academic_year_id),
      }));
    }
  }, [selectedStructure]);

  const fetchDropdowns = async () => {
    try {
      const [classSectionsResponse, structuresResponse, academicYearsResponse] = await Promise.all([
        getAllClassesDropdown(),
        getFeeStructuresDropdown(),
        getAcademicYearsDropdown(),
      ]);

      setClassSections(classSectionsResponse?.data || []);
      setFeeStructures(structuresResponse?.data || []);
      setAcademicYears(academicYearsResponse?.data || []);

      const currentYear = (academicYearsResponse?.data || []).find((year) => year.is_current);
      if (currentYear?.id) {
        setForm((prev) => ({
          ...prev,
          academic_year_id: String(currentYear.id),
        }));
      }
    } catch (err) {
      const errorMessage = err?.response?.data?.message || "Failed to fetch fee assignment dropdowns";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const fetchAssignments = async () => {
    setLoadingAssignments(true);
    try {
      const response = await getClassFeeAssignment();
      if (response?.data?.assignments) {
        setAssignments(response.data.assignments);
      } else if (response?.assignments) {
        setAssignments(response.assignments);
      } else {
        setAssignments([]);
      }
    } catch (err) {
      const errorMessage = err?.response?.data?.message || "Failed to fetch assignments";
      toast.error(errorMessage);
      setAssignments([]);
    } finally {
      setLoadingAssignments(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!form.class_section_id || !form.fee_structure_id || !form.academic_year_id) {
      const message = "Please select class/section, fee structure and academic year";
      setError(message);
      toast.error(message);
      setLoading(false);
      return;
    }

    const payload = {
      class_section_id: Number(form.class_section_id),
      fee_structure_id: Number(form.fee_structure_id),
      class_ids: [Number(form.class_section_id)],
      student_ids: [],
      academic_year_id: Number(form.academic_year_id),
      custom_items: form.custom_items,
      excluded_heads: form.excluded_heads,
      override_json: form.override_json,
      class_name:
        classSections.find((item) => String(item.id || item._id) === String(form.class_section_id))
          ?.class_name || "",
      section_name:
        classSections.find((item) => String(item.id || item._id) === String(form.class_section_id))
          ?.section_name || "",
      fee_structure_name: selectedStructure?.label || selectedStructure?.name || "",
      fee_structure_total_amount: selectedStructure?.total_amount || 0,
    };

    try {
      const response = await assignFeeWithInstallments(payload);

      const backendMessage =
        response?.message ||
        response?.error?.message ||
        response?.error ||
        "Fee assignment created";

      if (response?.success === false) {
        setError(String(backendMessage));
        toast.error(String(backendMessage));
        return;
      }

      setSuccess(String(backendMessage));
      toast.success(String(backendMessage));

      setForm((prev) => ({
        ...getInitialForm(),
        academic_year_id: prev.academic_year_id,
      }));
      fetchAssignments();
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error?.message ||
        err?.response?.data?.error ||
        "Failed to create fee assignment";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleViewAssignment = async (assignment) => {
    setViewAssignment(assignment);
    setIsViewModalOpen(true);
    setLoadingViewData(true);

    try {
      const assignmentId = assignment.assignment_id || assignment.id;
      const detailsResponse = await getClassFeeAssignment(assignmentId);
      const details = detailsResponse?.data?.assignment || detailsResponse?.assignment || detailsResponse?.data || null;

      if (details) {
        setViewAssignment({
          ...assignment,
          raw: details,
          fee_structure: details.feeStructure
            ? {
                id: details.feeStructure.id,
                name: details.feeStructure.name || assignment.fee_structure?.name || "-",
                structure_type: details.feeStructure.structure_type || assignment.fee_structure?.structure_type || "recurring",
                is_active: details.feeStructure.is_active !== undefined ? Boolean(details.feeStructure.is_active) : true,
              }
            : assignment.fee_structure,
          effective_from: details.effective_from || null,
          effective_to: details.effective_to || null,
        });
      }

      const response = await viewClassFeeAssignmentStudents(
        details?.feeStructure?.class_id || assignment.class_section?.id || assignment.raw?.feeStructure?.class_id,
        details?.fee_structure_id || assignment.fee_structure?.id || assignment.fee_structure_id
      );

      if (response?.data) {
        setViewStudentsData(response.data);
      } else {
        setViewStudentsData(response);
      }
    } catch {
      setViewStudentsData(null);
      toast.error("Failed to fetch students data");
    } finally {
      setLoadingViewData(false);
    }
  };

  const handleDeleteAssignment = async (assignment) => {
    if (
      !window.confirm(
        `Are you sure you want to cancel the assignment for ${assignment.fee_structure?.name || "this fee structure"}?`
      )
    ) {
      return;
    }

    try {
      const response = await deleteClassFeeAssignment(assignment.assignment_id || assignment.id);
      const message = response?.message || response?.error?.message || response?.error || "Fee assignment cancelled successfully";
      toast.success(String(message));
      fetchAssignments();
    } catch (err) {
      const errorMessage = err?.response?.data?.message || "Failed to delete assignment";
      toast.error(errorMessage);
    }
  };

  const formatCurrency = (value) => {
    const num = Number(value);
    return Number.isNaN(num)
      ? "0.00"
      : num.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const assignmentTableRows = useMemo(
    () =>
      assignments.map((assignment, index) => ({
        id: assignment.id || assignment.assignment_id || `${assignment.fee_structure_id || "fs"}-${assignment.class_section_id || "cs"}-${index}`,
        fee_structure_name:
          assignment.fee_structure_name || assignment.fee_structure?.name || "-",
        class_section_name:
          assignment.class_section_name ||
          assignment.class_section?.name ||
          assignment.class_section?.class_name ||
          "-",
        academic_year_name:
          assignment.academic_year_name ||
          academicYearMap.get(String(assignment.academic_year_id || "")) ||
          "-",
        fee_type: assignment.fee_type || assignment.assignment_type || "recurring",
        total_amount:
          assignment.total_amount !== undefined
            ? assignment.total_amount
            : assignment.fee_structure?.total_amount || 0,
        total_assigned_students: assignment.total_assigned_students ?? "-",
      })),
    [academicYearMap, assignments]
  );

  const assignmentTableColumns = useMemo(
    () => [
      { key: "fee_structure_name", header: "Structure Name" },
      { key: "class_section_name", header: "Class/Section" },
      { key: "academic_year_name", header: "Academic Year" },
      {
        key: "fee_type",
        header: "Fee Type",
        render: (value) => String(value || "-").replace(/_/g, " "),
      },
      {
        key: "total_amount",
        header: "Total Amount",
        render: (value) => `Rs. ${formatCurrency(value)}`,
      },
      { key: "total_assigned_students", header: "Assigned Students" },
    ],
    []
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
              <PageHeader pageheading="Fee Management" Subheading="Assign Fee to Student" />
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-700">
                <CheckCircle className="w-5 h-5 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Assign Fee to Student</h2>
                  <p className="text-sm text-gray-600 mt-1">Create recurring fee assignments using structure and students</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Class/Section <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="class_section_id"
                      value={form.class_section_id}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    >
                      <option value="">Select Class/Section</option>
                      {classSections.map((section) => (
                        <option key={section.id || section._id} value={section.id || section._id}>
                          {section.label || `${section.class_name}-${section.section_name}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fee Structure <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="fee_structure_id"
                      value={form.fee_structure_id}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    >
                      <option value="">Select Fee Structure</option>
                      {feeStructures.map((structure) => (
                        <option key={structure.id} value={structure.id}>
                          {structure.label || structure.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Academic Year <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="academic_year_id"
                      value={form.academic_year_id}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    >
                      <option value="">Select Academic Year</option>
                      {academicYears.map((year) => (
                        <option key={year.id} value={year.id}>
                          {year.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium cursor-pointer"
                  >
                    {loading ? "Assigning..." : "Assign Fee"}
                  </button>
                </div>
              </form>
            </div>

            <div className="mt-6">
              <ReusableTable
                title="Assigned Fees"
                columns={assignmentTableColumns}
                displayColumns={assignmentTableColumns}
                apiFunction={async () => ({ success: true })}
                initialData={assignmentTableRows}
                searchPlaceholder="Search by structure, class or academic year..."
                exportFileName="assigned-fees"
                showActions={{ add: false, edit: false, delete: false, view: false }}
              />
            </div>

            {loadingAssignments && (
              <div className="text-center text-gray-600 py-2">Loading assignments...</div>
            )}
          </div>
        </main>

        <Modal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setViewAssignment(null);
            setViewStudentsData(null);
          }}
          size="xl"
        >
          {viewAssignment && (
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Assign Fee to Student - Details</h2>
                <p className="text-gray-600">
                  Assignment ID: {viewAssignment.assignment_id || viewAssignment.id}
                </p>
              </div>

              {loadingViewData ? (
                <div className="flex items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
                </div>
              ) : viewStudentsData ? (
                <div className="space-y-6">
                  {viewStudentsData.summary && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <p className="text-blue-600 text-sm mb-1">Total Students</p>
                        <p className="text-2xl font-bold text-blue-900">
                          {viewStudentsData.summary.total_students}
                        </p>
                      </div>
                      <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                        <p className="text-indigo-600 text-sm mb-1">Original Amount</p>
                        <p className="text-2xl font-bold text-indigo-900">
                          Rs. {formatCurrency(viewStudentsData.summary.total_original_amount)}
                        </p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                        <p className="text-purple-600 text-sm mb-1">Total Discount</p>
                        <p className="text-2xl font-bold text-purple-900">
                          Rs. {formatCurrency(viewStudentsData.summary.total_discount)}
                        </p>
                      </div>
                      <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
                        <p className="text-cyan-600 text-sm mb-1">Final Amount</p>
                        <p className="text-2xl font-bold text-cyan-900">
                          Rs. {formatCurrency(viewStudentsData.summary.total_final_amount)}
                        </p>
                      </div>
                    </div>
                  )}

                  {viewStudentsData.students && viewStudentsData.students.length > 0 ? (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Students List</h3>
                      <div className="overflow-x-auto border border-gray-200 rounded-lg">
                        <table className="min-w-full text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Roll No.</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Student Name</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Original Amount</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Discount</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Final Amount</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-100">
                            {viewStudentsData.students.map((student, idx) => (
                              <tr key={student.student_fee_id || idx} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-gray-900 font-medium">{student.roll_number || "-"}</td>
                                <td className="px-4 py-3 text-gray-900 font-medium">{student.student_name || "-"}</td>
                                <td className="px-4 py-3 text-gray-900">Rs. {formatCurrency(student.original_amount)}</td>
                                <td className="px-4 py-3 text-purple-600 font-medium">Rs. {formatCurrency(student.discount_amount)}</td>
                                <td className="px-4 py-3 text-blue-600 font-semibold">Rs. {formatCurrency(student.final_amount)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">No students found</div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">Failed to load student data</div>
              )}

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    setViewAssignment(null);
                    setViewStudentsData(null);
                  }}
                  className="px-6 py-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors font-medium cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </Modal>

        <Footer />
      </div>
    </div>
  );
};

const FeeAssignmentPage = memo(FeeAssignment);

export default FeeAssignmentPage;
