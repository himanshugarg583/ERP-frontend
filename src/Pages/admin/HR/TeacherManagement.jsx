import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Download,
  Printer,
  X,
  User,
  Mail,
  Phone,
  BookOpen,
  GraduationCap,
  Award,
  Plus,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import jsPDF from "jspdf";
import Sidebar from "../Sidebar";
import Header from "../../../components/comman_components/Header";
import CommonTable from "../../../components/tables/CommonTable";
import {
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
} from "../../../helper/requests-method/apiMethods";

const TeacherManagement = () => {
  const [teachers, setTeachers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);
  const [filters, setFilters] = useState({ role: "all", status: "all" });
  const itemsPerPage = 10;
  const navigate = useNavigate();

  // Fetch all teachers
  const fetchTeachers = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getAllTeachers();
      if (response.success && response.data) {
        // Map API response to component format
        const mappedTeachers = response.data.map((teacher) => ({
          id: teacher.id,
          teacher_id: teacher.teacherDetails?.id?.toString() || teacher.id?.toString() || "N/A",
          name: teacher.name || "N/A",
          email: teacher.email || "N/A",
          phone: teacher.teacherDetails?.mobile_no || teacher.teacherDetails?.mobile || teacher.teacherDetails?.phone || "N/A",
          subject: teacher.teacherDetails?.subject || "N/A",
          qualification: teacher.teacherDetails?.qualification || "N/A",
          experience: teacher.teacherDetails?.experience || "N/A",
          dob: teacher.teacherDetails?.dob || null,
          gender: teacher.teacherDetails?.gender || "N/A",
          salary: teacher.teacherDetails?.salary || "N/A",
          joining_date: teacher.teacherDetails?.joining_date || null,
          permanentaddress: teacher.teacherDetails?.permanentaddress || "N/A",
          currentaddress: teacher.teacherDetails?.currentaddress || "N/A",
          image: teacher.teacherDetails?.image || null,
          status: teacher.status || "active",
          role: teacher.role || "teacher",
          created_at: teacher.created_at,
          updated_at: teacher.updated_at,
          // Store original API data for updates
          _originalData: teacher,
        }));
        setTeachers(mappedTeachers);
      }
    } catch (error) {
      console.error("Failed to fetch teachers:", error);
      toast.error(error.response?.data?.message || "Failed to fetch teachers");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch teachers on mount
  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  // Listen for teacher added/updated events to refresh data
  useEffect(() => {
    const handleTeacherAdded = () => {
      fetchTeachers();
    };
    const handleTeacherUpdated = () => {
      fetchTeachers();
    };

    window.addEventListener('teacherAdded', handleTeacherAdded);
    window.addEventListener('teacherUpdated', handleTeacherUpdated);

    return () => {
      window.removeEventListener('teacherAdded', handleTeacherAdded);
      window.removeEventListener('teacherUpdated', handleTeacherUpdated);
    };
  }, [fetchTeachers]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Handle add staff - open full page
  const handleAddTeacher = () => {
    navigate("/admin/staff-directory/add");
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterReset = () => {
    setFilters({ role: "all", status: "all" });
  };

  // Handle view teacher - navigate to full-page detail view
  const handleViewTeacher = (teacher) => {
    const id = teacher?.id || teacher?.teacher_id || teacher?._id;
    if (!id) {
      toast.error("Teacher id not available");
      return;
    }
    navigate(`/admin/teacher-details/${id}`);
  };

  // Handle close view modal
  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedTeacher(null);
  };

  // Download staff directory as PDF
  const downloadTeacherPDF = (teacher) => {
    const doc = new jsPDF();


    // Header
    doc.setFontSize(20);
    doc.setTextColor(75, 0, 130); // Purple color
    doc.text("Gurukulsarthi School Management", 105, 20, { align: "center" });

    doc.text("Gurukulsarthi School Management", 105, 20, { align: "center" });

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("Staff Directory", 105, 35, { align: "center" });

    // Line separator
    doc.setLineWidth(0.5);
    doc.line(20, 42, 190, 42);


    // Teacher details
    let yPosition = 60;
    doc.setFontSize(12);


    const details = [
      ["Teacher ID:", teacher.teacher_id || teacher.id?.toString() || "N/A"],
      ["Name:", teacher.name || "N/A"],
      ["Email:", teacher.email || "N/A"],
      ["Phone:", teacher.phone || teacher.teacherDetails?.mobile || teacher.teacherDetails?.phone || "N/A"],
      ["Subject:", teacher.subject || teacher.teacherDetails?.subject || "N/A"],
      ["Qualification:", teacher.qualification || teacher.teacherDetails?.qualification || "N/A"],
      ["Experience:", teacher.experience || teacher.teacherDetails?.experience || "N/A"],
    ];


    details.forEach(([label, value]) => {
      doc.setFont("helvetica", "bold");
      doc.setFont("helvetica", "bold");
      doc.text(label, 25, yPosition);
      doc.setFont("helvetica", "normal");
      doc.setFont("helvetica", "normal");
      doc.text(value, 80, yPosition);
      yPosition += 15;
    });


    // Footer
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 25, 250);
    doc.text("Gurukulsarthi School Management System", 105, 270, {
      align: "center",
    });

    doc.save(`${teacher.name || "teacher"}_profile.pdf`);
    doc.text("Gurukulsarthi School Management System", 105, 270, {
      align: "center",
    });

    doc.save(`${teacher.name || "teacher"}_profile.pdf`);
  };

  // Print staff directory
  const printTeacherInfo = (teacher) => {
    const printWindow = window.open("", "_blank");
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Teacher Profile - ${teacher.name}</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              margin: 0;
              padding: 20px;
              background: white;
            }
            .header {
              text-align: center;
              border-bottom: 3px solid #4B0082;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .school-name {
              font-size: 24px;
              font-weight: bold;
              color: #4B0082;
              margin-bottom: 5px;
            }
            .title {
              font-size: 18px;
              color: #333;
              margin-top: 10px;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin-top: 30px;
            }
            .info-item {
              background: #f8f9fa;
              padding: 15px;
              border-radius: 8px;
              border-left: 4px solid #4B0082;
            }
            .label {
              font-weight: bold;
              color: #4B0082;
              display: block;
              margin-bottom: 5px;
            }
            .value {
              color: #333;
              font-size: 16px;
            }
            .footer {
              margin-top: 50px;
              text-align: center;
              color: #666;
              font-size: 12px;
              border-top: 1px solid #ddd;
              padding-top: 20px;
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="school-name">Gurukulsarthi School Management</div>
            <div class="title">Staff Directory</div>
          </div>
          
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Teacher ID:</span>
              <span class="value">${teacher.teacher_id || teacher.id?.toString() || "N/A"}</span>
            </div>
            <div class="info-item">
              <span class="label">Name:</span>
              <span class="value">${teacher.name || "N/A"}</span>
              <span class="value">${teacher.name || "N/A"}</span>
            </div>
            <div class="info-item">
              <span class="label">Email:</span>
              <span class="value">${teacher.email || "N/A"}</span>
              <span class="value">${teacher.email || "N/A"}</span>
            </div>
            <div class="info-item">
              <span class="label">Phone:</span>
              <span class="value">${teacher.phone || teacher.teacherDetails?.mobile || teacher.teacherDetails?.phone || "N/A"}</span>
            </div>
            <div class="info-item">
              <span class="label">Subject:</span>
              <span class="value">${teacher.subject || teacher.teacherDetails?.subject || "N/A"}</span>
            </div>
            <div class="info-item">
              <span class="label">Qualification:</span>
              <span class="value">${teacher.qualification || teacher.teacherDetails?.qualification || "N/A"}</span>
            </div>
            <div class="info-item">
              <span class="label">Experience:</span>
              <span class="value">${teacher.experience || teacher.teacherDetails?.experience || "N/A"}</span>
            </div>
          </div>
          
          <div class="footer">
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
            <p>Gurukulsarthi School Management System</p>
          </div>
        </body>
      </html>
    `;


    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  // Define columns for teacher management
  const teacherColumns = [
    {
      key: "count",
      header: "S.No",
      type: "text",
      render: (value, item, index) => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return startIndex + index + 1;
      },
      required: false,
    },

    {
      key: "name",
      header: "Name",
      type: "text",
      required: true,
      placeholder: "e.g. Rajesh Kumar",
    },
    {
      key: "role",
      header: "Role",
      type: "text",
      required: true,
      placeholder: "e.g. Teacher",
      render: (value) => {
        if (!value) return "N/A";
        const text = value.toString();
        return text.charAt(0).toUpperCase() + text.slice(1);
      },
    },
    {
      key: "email",
      header: "Email",
      type: "email",
      required: true,
      placeholder: "e.g. teacher@school.com",
    },
    {
      key: "phone",
      header: "Phone",
      type: "text",
      required: true,
      placeholder: "e.g. 9876543210",
    },
    {
      key: "qualification",
      header: "Qualification",
      type: "text",
      required: true,
      placeholder: "e.g. M.Sc, B.Ed",
    },
  ];

  const filteredTeachers = teachers.filter((teacher) => {
    const roleValue = (teacher.role || "").toString().toLowerCase();
    const statusValue = (teacher.status || "").toString().toLowerCase();
    const roleMatch = filters.role === "all" || roleValue === filters.role;
    const statusMatch = filters.status === "all" || statusValue === filters.status;
    return roleMatch && statusMatch;
  });


  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle delete teacher
  const handleDeleteTeacher = (teacher) => {
    setTeacherToDelete(teacher);
    setIsDeleteModalOpen(true);
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!teacherToDelete) return;
    try {
      const response = await deleteTeacher(teacherToDelete.id);
      if (response.success) {
        toast.success(response.message || "Teacher deleted successfully");
        fetchTeachers(); // Refresh the list
        setIsDeleteModalOpen(false);
        setTeacherToDelete(null);
      }
    } catch (error) {
      console.error("Failed to delete teacher:", error);
      toast.error(error.response?.data?.message || "Failed to delete teacher");
    }
  };

  // Handle update teacher (via CommonTable)
  const handleUpdateTeacher = async (id, teacherData) => {
    try {
      // Extract image file if present
      const imageFile = teacherData.image instanceof File ? teacherData.image : null;
      const dataToSend = { ...teacherData };
      if (imageFile) {
        delete dataToSend.image; // Remove from JSON, will be sent as FormData
      }

      const response = await updateTeacher(id, dataToSend, imageFile);
      if (response.success) {
        toast.success(response.message || "Teacher updated successfully");
        fetchTeachers(); // Refresh the list
        return response; // Return the response object
      } else {
        toast.error(response.message || "Failed to update teacher");
        return response;
      }
    } catch (error) {
      console.error("Failed to update teacher:", error);
      toast.error(error.response?.data?.message || "Failed to update teacher");
      return { success: false, message: error.response?.data?.message || "Failed to update teacher" };
    }
  };

  return (
    <div className="bg-slate-200 flex TeacherManagement">
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

        <main className="w-full py-4 md:py-6 px-4 md:px-6">

          <div className="space-y-4 md:space-y-6">
            {/* Page Header */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl md:text-2xl font-semibold text-slate-800 mb-2">
                    Staff Directory
                  </h1>
                  <p className="text-sm text-slate-600">
                    Manage staff information, view details, and track performance
                  </p>
                </div>
                {/* Add Staff Button */}
                <button
                  onClick={handleAddTeacher}
                  className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors shadow-sm w-full sm:w-auto justify-center"
                >
                  <Plus size={20} />
                  <span>Add Staff</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
              <div className="flex flex-col lg:flex-row lg:items-end gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Role
                  </label>
                  <select
                    name="role"
                    value={filters.role}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                  >
                    <option value="all">All Roles</option>
                    <option value="teacher">Teacher</option>
                    <option value="staff">Staff</option>
                    <option value="librarian">Librarian</option>
                    <option value="accountant">Accountant</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={handleFilterReset}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Table Component */}
            {isLoading ? (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <div className="text-center py-8 text-slate-500">Loading teachers...</div>
              </div>
            ) : (
              <CommonTable
                title="Staff Directory"
                columns={teacherColumns}
                data={filteredTeachers}
                createApi={null}
                updateApi={handleUpdateTeacher}
                deleteApi={null}
                searchPlaceholder="Search staff..."
                addButtonText="Add Staff"
                exportFileName="teachers"
                itemsPerPage={itemsPerPage}
                enableSearch={true}
                enablePagination={true}
                enableAdd={false}
                enableEdit={true}
                enableDelete={true}
                enableView={true}
                onPageChange={handlePageChange}
                onAdd={handleAddTeacher}
                onView={handleViewTeacher}
                onDelete={handleDeleteTeacher}
              />
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && teacherToDelete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                backdropFilter: "blur(4px)",
              }}
              onClick={(e) =>
                e.target === e.currentTarget && setIsDeleteModalOpen(false)
              }
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg w-full max-w-md shadow-2xl mx-4 p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Confirm Delete
                </h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete teacher{" "}
                  <span className="font-semibold">{teacherToDelete.name}</span>?
                  This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setIsDeleteModalOpen(false);
                      setTeacherToDelete(null);
                    }}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
          </div>

          {/* Custom Teacher View Modal */}
          {isViewModalOpen && selectedTeacher && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                backdropFilter: "blur(4px)",
              }}
              onClick={(e) =>
                e.target === e.currentTarget && handleCloseViewModal()
              }
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="bg-violet-600 text-white p-6 rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">
                        Gurukulsarthi School Management
                      </h2>
                      <p className="text-violet-100 mt-1">
                        Teacher Profile Details
                      </p>
                    </div>
                    <button
                      onClick={handleCloseViewModal}
                      className="text-white hover:text-gray-200 transition-colors cursor-pointer"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Teacher Info Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div className="bg-violet-50 p-4 rounded-lg border border-violet-200">
                      <div className="flex items-center gap-3 mb-2">
                        <User className="w-5 h-5 text-violet-600" />
                        <span className="text-sm font-medium text-violet-800 uppercase tracking-wide">
                          Teacher ID
                        </span>
                      </div>
                      <span className="text-lg font-semibold text-violet-900">
                        {selectedTeacher.teacher_id || "N/A"}
                      </span>
                    </div>

                    <div className="bg-violet-50 p-4 rounded-lg border border-violet-200">
                      <div className="flex items-center gap-3 mb-2">
                        <User className="w-5 h-5 text-violet-600" />
                        <span className="text-sm font-medium text-violet-800 uppercase tracking-wide">
                          Full Name
                        </span>
                      </div>
                      <span className="text-lg font-semibold text-violet-900">
                        {selectedTeacher.name || "N/A"}
                      </span>
                    </div>

                    <div className="bg-violet-50 p-4 rounded-lg border border-violet-200">
                      <div className="flex items-center gap-3 mb-2">
                        <Mail className="w-5 h-5 text-violet-600" />
                        <span className="text-sm font-medium text-violet-800 uppercase tracking-wide">
                          Email
                        </span>
                      </div>
                      <span className="text-lg font-semibold text-violet-900">
                        {selectedTeacher.email || "N/A"}
                      </span>
                    </div>

                    <div className="bg-violet-50 p-4 rounded-lg border border-violet-200">
                      <div className="flex items-center gap-3 mb-2">
                        <Phone className="w-5 h-5 text-violet-600" />
                        <span className="text-sm font-medium text-violet-800 uppercase tracking-wide">
                          Phone
                        </span>
                      </div>
                      <span className="text-lg font-semibold text-violet-900">
                        {selectedTeacher.phone || selectedTeacher.teacherDetails?.mobile || selectedTeacher.teacherDetails?.phone || "N/A"}
                      </span>
                    </div>

                    <div className="bg-violet-50 p-4 rounded-lg border border-violet-200">
                      <div className="flex items-center gap-3 mb-2">
                        <BookOpen className="w-5 h-5 text-violet-600" />
                        <span className="text-sm font-medium text-violet-800 uppercase tracking-wide">
                          Subject
                        </span>
                      </div>
                      <span className="text-lg font-semibold text-violet-900">
                        {selectedTeacher.subject || selectedTeacher.teacherDetails?.subject || "N/A"}
                      </span>
                    </div>

                    <div className="bg-violet-50 p-4 rounded-lg border border-violet-200">
                      <div className="flex items-center gap-3 mb-2">
                        <GraduationCap className="w-5 h-5 text-violet-600" />
                        <span className="text-sm font-medium text-violet-800 uppercase tracking-wide">
                          Qualification
                        </span>
                      </div>
                      <span className="text-lg font-semibold text-violet-900">
                        {selectedTeacher.qualification || selectedTeacher.teacherDetails?.qualification || "N/A"}
                      </span>
                    </div>

                    <div className="bg-violet-50 p-4 rounded-lg border border-violet-200">
                      <div className="flex items-center gap-3 mb-2">
                        <Award className="w-5 h-5 text-violet-600" />
                        <span className="text-sm font-medium text-violet-800 uppercase tracking-wide">
                          Experience
                        </span>
                      </div>
                      <span className="text-lg font-semibold text-violet-900">
                        {selectedTeacher.experience || selectedTeacher.teacherDetails?.experience || "N/A"}
                      </span>
                    </div>

                    {selectedTeacher.teacherDetails && (
                      <>
                        {selectedTeacher.teacherDetails.dob && (
                          <div className="bg-violet-50 p-4 rounded-lg border border-violet-200">
                            <div className="flex items-center gap-3 mb-2">
                              <User className="w-5 h-5 text-violet-600" />
                              <span className="text-sm font-medium text-violet-800 uppercase tracking-wide">
                                Date of Birth
                              </span>
                            </div>
                            <span className="text-lg font-semibold text-violet-900">
                              {new Date(selectedTeacher.teacherDetails.dob).toLocaleDateString()}
                            </span>
                          </div>
                        )}

                        {selectedTeacher.teacherDetails.gender && (
                          <div className="bg-violet-50 p-4 rounded-lg border border-violet-200">
                            <div className="flex items-center gap-3 mb-2">
                              <User className="w-5 h-5 text-violet-600" />
                              <span className="text-sm font-medium text-violet-800 uppercase tracking-wide">
                                Gender
                              </span>
                            </div>
                            <span className="text-lg font-semibold text-violet-900">
                              {selectedTeacher.teacherDetails.gender}
                            </span>
                          </div>
                        )}

                        {selectedTeacher.teacherDetails.salary && (
                          <div className="bg-violet-50 p-4 rounded-lg border border-violet-200">
                            <div className="flex items-center gap-3 mb-2">
                              <Award className="w-5 h-5 text-violet-600" />
                              <span className="text-sm font-medium text-violet-800 uppercase tracking-wide">
                                Salary
                              </span>
                            </div>
                            <span className="text-lg font-semibold text-violet-900">
                              {selectedTeacher.teacherDetails.salary}
                            </span>
                          </div>
                        )}

                        {selectedTeacher.teacherDetails.joining_date && (
                          <div className="bg-violet-50 p-4 rounded-lg border border-violet-200">
                            <div className="flex items-center gap-3 mb-2">
                              <User className="w-5 h-5 text-violet-600" />
                              <span className="text-sm font-medium text-violet-800 uppercase tracking-wide">
                                Joining Date
                              </span>
                            </div>
                            <span className="text-lg font-semibold text-violet-900">
                              {new Date(selectedTeacher.teacherDetails.joining_date).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                      Profile viewed on: {new Date().toLocaleDateString()}
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => downloadTeacherPDF(selectedTeacher)}
                        className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors cursor-pointer"
                      >
                        <Download size={18} />
                        Download PDF
                      </button>
                      <button
                        onClick={() => printTeacherInfo(selectedTeacher)}
                        className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors cursor-pointer"
                      >
                        <Printer size={18} />
                        Print
                      </button>
                      <button
                        onClick={handleCloseViewModal}
                        className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </main>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
};

export default TeacherManagement;

