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
import CommonFilter from "../../../components/tables/CommonFilter";
import {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from "../../../helper/requests-method/apiMethods";

const TeacherManagement = () => {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    qualification: "",
    dob: "",
    gender: "",
    salary: "",
    joining_date: "",
    permenantaddress: "", // Note: API uses typo "permenantaddress"
    mobile: "",
    currentaddress: "",
    image: null,
    role: "teacher", // Default role
  });
  const [formErrors, setFormErrors] = useState({});
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
          teacher_id: teacher.id?.toString() || "N/A",
          name: teacher.name || "N/A",
          email: teacher.email || "N/A",
          phone: teacher.teacherDetails?.mobile || teacher.teacherDetails?.phone || "N/A",
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
        setFilteredTeachers(mappedTeachers);
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

  // Handle add teacher - open modal
  const handleAddTeacher = () => {
    setIsAddModalOpen(true);
    // Reset form when opening
    setFormData({
      name: "",
      email: "",
      password: "",
      qualification: "",
      dob: "",
      gender: "",
      salary: "",
      joining_date: "",
      permenantaddress: "",
      mobile: "",
      currentaddress: "",
      image: null,
      role: "teacher",
    });
    setFormErrors({});
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prev) => ({ ...prev, [name]: files[0] || null }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = "Invalid email format";
    if (!formData.password.trim()) errors.password = "Password is required";
    else if (formData.password.length < 6) errors.password = "Password must be at least 6 characters";
    if (!formData.qualification.trim()) errors.qualification = "Qualification is required";
    if (!formData.dob) errors.dob = "Date of birth is required";
    if (!formData.gender) errors.gender = "Gender is required";
    if (!formData.salary.trim()) errors.salary = "Salary is required";
    if (!formData.joining_date) errors.joining_date = "Joining date is required";
    if (!formData.permenantaddress.trim()) errors.permenantaddress = "Permanent address is required";
    if (!formData.mobile.trim()) errors.mobile = "Mobile number is required";
    else if (!/^[0-9]{10}$/.test(formData.mobile)) errors.mobile = "Mobile must be 10 digits";
    if (!formData.currentaddress.trim()) errors.currentaddress = "Current address is required";
    if (!formData.role) errors.role = "Role is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        qualification: formData.qualification.trim(),
        dob: formData.dob,
        gender: formData.gender,
        salary: formData.salary.trim(),
        joining_date: formData.joining_date,
        permenantaddress: formData.permenantaddress.trim(), // API uses typo "permenantaddress"
        mobile: formData.mobile.trim(),
        currentaddress: formData.currentaddress.trim(),
        role: formData.role || "teacher",
      };

      const response = await createTeacher(payload, formData.image);
      if (response.success) {
        toast.success(response.message || "Teacher added successfully");
        setIsAddModalOpen(false); // Hide form after successful submission
        setFormData({
          name: "",
          email: "",
          password: "",
          qualification: "",
          dob: "",
          gender: "",
          salary: "",
          joining_date: "",
          permenantaddress: "",
          mobile: "",
          currentaddress: "",
          image: null,
          role: "teacher",
        });
        setFormErrors({});
        fetchTeachers(); // Refresh the list
        // Dispatch event for other components
        window.dispatchEvent(new Event('teacherAdded'));
      } else {
        toast.error(response.message || "Failed to add teacher");
      }
    } catch (error) {
      console.error("Failed to add teacher:", error);
      toast.error(error.response?.data?.message || "Failed to add teacher");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle view teacher - fetch full details
  const handleViewTeacher = async (teacher) => {
    try {
      const response = await getTeacherById(teacher.id);
      if (response.success && response.data) {
        const fullTeacher = {
          ...teacher,
          ...response.data,
          teacherDetails: response.data.teacherDetails || {},
        };
        setSelectedTeacher(fullTeacher);
        setIsViewModalOpen(true);
      } else {
        setSelectedTeacher(teacher);
        setIsViewModalOpen(true);
      }
    } catch (error) {
      console.error("Failed to fetch teacher details:", error);
      toast.error("Failed to fetch teacher details");
      // Still show the modal with available data
      setSelectedTeacher(teacher);
      setIsViewModalOpen(true);
    }
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
              <span class="value">${teacher.teacher_id || teacher.id?.toString() || "N/A"}</span>
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

        <div className="flex-1 p-6">
          {/* Page Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Teacher Management
              </h1>
              <p className="text-gray-600">
                Manage teacher information, view details, and track performance
              </p>
            </div>
            {/* Add Teacher Button */}
            <button
              onClick={handleAddTeacher}
              className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors shadow-sm"
            >
              <Plus size={20} />
              <span>Add Teacher</span>
            </button>
          </div>

          {/* Add Teacher Modal */}
          {isAddModalOpen && (
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
                e.target === e.currentTarget && !isSubmitting && setIsAddModalOpen(false)
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
                <div className="bg-violet-600 text-white p-6 rounded-t-lg sticky top-0 z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">Add New Teacher</h2>
                      <p className="text-violet-100 mt-1">
                        Fill in the details to add a new teacher
                      </p>
                    </div>
                    <button
                      onClick={() => !isSubmitting && setIsAddModalOpen(false)}
                      disabled={isSubmitting}
                      className="text-white hover:text-gray-200 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>

                {/* Form */}

              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 ${
                        formErrors.name ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter teacher name"
                    />
                    {formErrors.name && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 ${
                        formErrors.email ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter email address"
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 ${
                        formErrors.password ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter password (min 6 characters)"
                    />
                    {formErrors.password && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
                    )}
                  </div>

                  {/* Mobile */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      maxLength={10}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 ${
                        formErrors.mobile ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter 10-digit mobile number"
                    />
                    {formErrors.mobile && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.mobile}</p>
                    )}
                  </div>

                  {/* Qualification */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Qualification <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 ${
                        formErrors.qualification ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="e.g. M.Sc, B.Ed"
                    />
                    {formErrors.qualification && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.qualification}</p>
                    )}
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 ${
                        formErrors.dob ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {formErrors.dob && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.dob}</p>
                    )}
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-6 mt-2">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value="Male"
                          checked={formData.gender === "Male"}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-violet-600 border-gray-300 focus:ring-violet-600"
                        />
                        <span className="ml-2 text-gray-700">Male</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value="Female"
                          checked={formData.gender === "Female"}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-violet-600 border-gray-300 focus:ring-violet-600"
                        />
                        <span className="ml-2 text-gray-700">Female</span>
                      </label>
                    </div>
                    {formErrors.gender && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.gender}</p>
                    )}
                  </div>

                  {/* Salary */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Salary <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="salary"
                      value={formData.salary}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 ${
                        formErrors.salary ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter salary"
                    />
                    {formErrors.salary && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.salary}</p>
                    )}
                  </div>

                  {/* Joining Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Joining Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="joining_date"
                      value={formData.joining_date}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 ${
                        formErrors.joining_date ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {formErrors.joining_date && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.joining_date}</p>
                    )}
                  </div>

                  {/* Permanent Address */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Permanent Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="permenantaddress"
                      value={formData.permenantaddress}
                      onChange={handleInputChange}
                      rows={3}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 ${
                        formErrors.permenantaddress ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter permanent address"
                    />
                    {formErrors.permenantaddress && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.permenantaddress}</p>
                    )}
                  </div>

                  {/* Current Address */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="currentaddress"
                      value={formData.currentaddress}
                      onChange={handleInputChange}
                      rows={3}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 ${
                        formErrors.currentaddress ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter current address"
                    />
                    {formErrors.currentaddress && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.currentaddress}</p>
                    )}
                  </div>

                  {/* Role */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 ${
                        formErrors.role ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="teacher">Teacher</option>
                      <option value="staff">Staff</option>
                      <option value="librarian">Librarian</option>
                      <option value="accountant">Accountant</option>
                    </select>
                    {formErrors.role && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.role}</p>
                    )}
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profile Image
                    </label>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                    />
                    {formData.image && (
                      <p className="text-sm text-gray-600 mt-2">
                        Selected: {formData.image.name}
                      </p>
                    )}
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200 p-6">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    disabled={isSubmitting}
                    className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Adding..." : "Add Teacher"}
                  </button>
                </div>
              </form>
              </motion.div>
            </motion.div>
          )}

          {/* Filter Component */}
          <CommonFilter
            filterFields={filterFields}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            title="Teacher Filters"
          />

          {/* Table Component */}
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-gray-600">Loading teachers...</div>
            </div>
          ) : (
            <CommonTable
              title="Teacher Information"
              columns={teacherColumns}
              data={filteredTeachers}
              createApi={null}
              updateApi={handleUpdateTeacher}
              deleteApi={null}
              searchPlaceholder="Search teachers..."
              addButtonText="Add Teacher"
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
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
};

export default TeacherManagement;
