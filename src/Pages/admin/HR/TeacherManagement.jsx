import React, { useState } from "react";
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
} from "lucide-react";
import jsPDF from "jspdf";
import Sidebar from "../Sidebar";
import Header from "../../../components/comman_components/Header";
import CommonTable from "../../../components/tables/CommonTable";
import CommonFilter from "../../../components/tables/CommonFilter";
import { teacherData } from "../../../data.js";

const TeacherManagement = () => {
  const [teachers] = useState(teacherData);
  const [filteredTeachers, setFilteredTeachers] = useState(teacherData);
  const [currentPage, setCurrentPage] = useState(1);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  // Handle add teacher navigation
  const handleAddTeacher = () => {
    navigate("/AddStaff");
  };

  // Handle view teacher
  const handleViewTeacher = (teacher) => {
    setSelectedTeacher(teacher);
    setIsViewModalOpen(true);
  };

  // Handle close view modal
  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedTeacher(null);
  };

  // Download teacher information as PDF
  const downloadTeacherPDF = (teacher) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.setTextColor(75, 0, 130); // Purple color
    doc.text("Gurukulsarthi School Management", 105, 20, { align: "center" });

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("Teacher Information", 105, 35, { align: "center" });

    // Line separator
    doc.setLineWidth(0.5);
    doc.line(20, 42, 190, 42);

    // Teacher details
    let yPosition = 60;
    doc.setFontSize(12);

    const details = [
      ["Teacher ID:", teacher.teacher_id || "N/A"],
      ["Name:", teacher.name || "N/A"],
      ["Email:", teacher.email || "N/A"],
      ["Phone:", teacher.phone || "N/A"],
      ["Subject:", teacher.subject || "N/A"],
      ["Qualification:", teacher.qualification || "N/A"],
      ["Experience:", teacher.experience || "N/A"],
    ];

    details.forEach(([label, value]) => {
      doc.setFont("helvetica", "bold");
      doc.text(label, 25, yPosition);
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
  };

  // Print teacher information
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
            <div class="title">Teacher Information</div>
          </div>
          
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Teacher ID:</span>
              <span class="value">${teacher.teacher_id || "N/A"}</span>
            </div>
            <div class="info-item">
              <span class="label">Name:</span>
              <span class="value">${teacher.name || "N/A"}</span>
            </div>
            <div class="info-item">
              <span class="label">Email:</span>
              <span class="value">${teacher.email || "N/A"}</span>
            </div>
            <div class="info-item">
              <span class="label">Phone:</span>
              <span class="value">${teacher.phone || "N/A"}</span>
            </div>
            <div class="info-item">
              <span class="label">Subject:</span>
              <span class="value">${teacher.subject || "N/A"}</span>
            </div>
            <div class="info-item">
              <span class="label">Qualification:</span>
              <span class="value">${teacher.qualification || "N/A"}</span>
            </div>
            <div class="info-item">
              <span class="label">Experience:</span>
              <span class="value">${teacher.experience || "N/A"}</span>
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
      key: "teacher_id",
      header: "Teacher ID",
      type: "text",
      required: true,
      placeholder: "e.g. TCH001",
    },
    {
      key: "name",
      header: "Teacher Name",
      type: "text",
      required: true,
      placeholder: "e.g. Rajesh Kumar",
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
      key: "subject",
      header: "Subject",
      type: "text",
      required: true,
      placeholder: "e.g. Mathematics",
    },
    {
      key: "qualification",
      header: "Qualification",
      type: "text",
      required: true,
      placeholder: "e.g. M.Sc, B.Ed",
    },
    {
      key: "experience",
      header: "Experience",
      type: "text",
      required: true,
      placeholder: "e.g. 5 years",
    },
  ];

  // Filter fields for teachers
  const filterFields = [
    {
      key: "name",
      label: "Teacher Name",
      type: "text",
      placeholder: "Search by teacher name",
    },
    {
      key: "teacher_id",
      label: "Teacher ID",
      type: "text",
      placeholder: "Search by teacher ID",
    },
    {
      key: "subject",
      label: "Subject",
      type: "select",
      options: [
        { value: "Mathematics", label: "Mathematics" },
        { value: "English", label: "English" },
        { value: "Science", label: "Science" },
        { value: "Hindi", label: "Hindi" },
        { value: "Social Studies", label: "Social Studies" },
        { value: "Physics", label: "Physics" },
        { value: "Chemistry", label: "Chemistry" },
        { value: "Biology", label: "Biology" },
        { value: "History", label: "History" },
        { value: "Geography", label: "Geography" },
      ],
    },
    {
      key: "qualification",
      label: "Qualification",
      type: "select",
      options: [
        { value: "M.Sc, B.Ed", label: "M.Sc, B.Ed" },
        { value: "M.A, B.Ed", label: "M.A, B.Ed" },
        { value: "B.Sc, B.Ed", label: "B.Sc, B.Ed" },
        { value: "B.A, B.Ed", label: "B.A, B.Ed" },
        { value: "M.Tech", label: "M.Tech" },
        { value: "Ph.D", label: "Ph.D" },
      ],
    },
  ];

  // Handle filter changes
  const handleFilterChange = (filters) => {
    let filtered = [...teachers];

    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        filtered = filtered.filter((item) => {
          if (key === "name" || key === "teacher_id") {
            return (
              item[key] &&
              item[key].toLowerCase().includes(filters[key].toLowerCase())
            );
          }
          return item[key] === filters[key];
        });
      }
    });

    setFilteredTeachers(filtered);
    setCurrentPage(1);
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setFilteredTeachers(teachers);
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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

        <div className="flex-1 p-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Teacher Management
            </h1>
            <p className="text-gray-600">
              Manage teacher information, view details, and track performance
            </p>
          </div>

          {/* Filter Component */}
          <CommonFilter
            filterFields={filterFields}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            title="Teacher Filters"
          />

          {/* Table Component */}
          <CommonTable
            title="Teacher Information"
            columns={teacherColumns}
            data={filteredTeachers}
            createApi={null}
            updateApi={null}
            deleteApi={null}
            searchPlaceholder="Search teachers..."
            addButtonText="Add Teacher"
            exportFileName="teachers"
            itemsPerPage={itemsPerPage}
            enableSearch={true}
            enablePagination={true}
            enableAdd={true}
            enableEdit={true}
            enableDelete={true}
            enableView={true}
            onPageChange={handlePageChange}
            onAdd={handleAddTeacher}
            onView={handleViewTeacher}
          />

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
                        {selectedTeacher.phone || "N/A"}
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
                        {selectedTeacher.subject || "N/A"}
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
                        {selectedTeacher.qualification || "N/A"}
                      </span>
                    </div>

                    <div className="bg-violet-50 p-4 rounded-lg border border-violet-200 md:col-span-2 lg:col-span-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Award className="w-5 h-5 text-violet-600" />
                        <span className="text-sm font-medium text-violet-800 uppercase tracking-wide">
                          Experience
                        </span>
                      </div>
                      <span className="text-lg font-semibold text-violet-900">
                        {selectedTeacher.experience || "N/A"}
                      </span>
                    </div>
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
        </div>
      </div>
    </div>
  );
};

export default TeacherManagement;
