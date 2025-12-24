import React, { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import ReportHeading from "../../../components/comman_components/ReportHeading";
import CommonTable from "../../../components/tables/CommonTable";
import ReportFilter from "../../../components/tables/ReportFilter";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from "../Sidebar";
import Header from "../../../components/comman_components/Header";
import "../Admin.css";
import { 
  teacherCredentialsReportData,
  teacherAttendanceReportData,
  teacherPerformanceReportData,
  teacherQualificationReportData,
  teacherSalaryReportData
} from "../../../data.js";

const HRReports = () => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock departments and subjects data
  const departments = [
    { value: "Primary", label: "Primary" },
    { value: "Secondary", label: "Secondary" },
    { value: "Senior Secondary", label: "Senior Secondary" },
    { value: "Administration", label: "Administration" }
  ];

  const subjects = [
    { value: "Mathematics", label: "Mathematics" },
    { value: "English", label: "English" },
    { value: "Science", label: "Science" },
    { value: "Hindi", label: "Hindi" },
    { value: "Social Studies", label: "Social Studies" },
    { value: "Physics", label: "Physics" },
    { value: "Chemistry", label: "Chemistry" }
  ];

  const statuses = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "on_leave", label: "On Leave" }
  ];

  const attendanceStatuses = [
    { value: "Excellent", label: "Excellent" },
    { value: "Good", label: "Good" },
    { value: "Average", label: "Average" },
    { value: "Poor", label: "Poor" }
  ];

  const performanceRatings = [
    { value: "Excellent", label: "Excellent" },
    { value: "Good", label: "Good" },
    { value: "Average", label: "Average" },
    { value: "Poor", label: "Poor" }
  ];

  const certificationStatuses = [
    { value: "Certified", label: "Certified" },
    { value: "Renewal Required", label: "Renewal Required" },
    { value: "Expired", label: "Expired" }
  ];

  const paymentStatuses = [
    { value: "Paid", label: "Paid" },
    { value: "Pending", label: "Pending" },
    { value: "Overdue", label: "Overdue" }
  ];

  // Report configurations
  const reportConfigs = {
    'teacher-credentials': {
      title: "Teacher Credentials Report",
      data: teacherCredentialsReportData,
      columns: [
        {
          key: 'count',
          header: 'S.No',
          type: 'text',
          render: (value, item, index) => {
            const startIndex = (currentPage - 1) * itemsPerPage;
            return startIndex + index + 1;
          },
          required: false
        },
        {
          key: 'teacher_id',
          header: 'Teacher ID',
          type: 'text',
          required: true,
          placeholder: 'Enter teacher ID'
        },
        {
          key: 'name',
          header: 'Teacher Name',
          type: 'text',
          required: true,
          placeholder: 'Enter teacher name'
        },
        {
          key: 'email',
          header: 'Email',
          type: 'email',
          required: true,
          placeholder: 'Enter email address'
        },
        {
          key: 'phone',
          header: 'Phone',
          type: 'text',
          required: true,
          placeholder: 'Enter phone number'
        },
        {
          key: 'subject',
          header: 'Subject',
          type: 'select',
          required: true,
          options: subjects
        },
        {
          key: 'department',
          header: 'Department',
          type: 'select',
          required: true,
          options: departments
        },
        {
          key: 'lastLogin',
          header: 'Last Login',
          type: 'date',
          required: true
        }
      ],
      filterFields: [
        { key: 'subject', label: 'Subject', type: 'select', options: subjects },
        { key: 'department', label: 'Department', type: 'select', options: departments },
        { key: 'status', label: 'Status', type: 'select', options: statuses }
      ]
    },
    'teacher-attendance': {
      title: "Teacher Attendance Report",
      data: teacherAttendanceReportData,
      columns: [
        {
          key: 'count',
          header: 'S.No',
          type: 'text',
          render: (value, item, index) => {
            const startIndex = (currentPage - 1) * itemsPerPage;
            return startIndex + index + 1;
          },
          required: false
        },
        {
          key: 'teacher_id',
          header: 'Teacher ID',
          type: 'text',
          required: true
        },
        {
          key: 'name',
          header: 'Teacher Name',
          type: 'text',
          required: true
        },
        {
          key: 'department',
          header: 'Department',
          type: 'select',
          required: true,
          options: departments
        },
        {
          key: 'attendance',
          header: 'Attendance %',
          type: 'text',
          required: true
        },
        {
          key: 'presentDays',
          header: 'Present Days',
          type: 'number',
          required: true
        },
        {
          key: 'absentDays',
          header: 'Absent Days',
          type: 'number',
          required: true
        },
        {
          key: 'lateArrivals',
          header: 'Late Arrivals',
          type: 'number',
          required: true
        },
        {
          key: 'month',
          header: 'Month',
          type: 'text',
          required: true
        }
      ],
      filterFields: [
        { key: 'department', label: 'Department', type: 'select', options: departments },
        { key: 'status', label: 'Performance', type: 'select', options: attendanceStatuses },
        { key: 'month', label: 'Month', type: 'text', placeholder: 'Search by month' }
      ]
    },
    'teacher-performance': {
      title: "Teacher Performance Report",
      data: teacherPerformanceReportData,
      columns: [
        {
          key: 'count',
          header: 'S.No',
          type: 'text',
          render: (value, item, index) => {
            const startIndex = (currentPage - 1) * itemsPerPage;
            return startIndex + index + 1;
          },
          required: false
        },
        {
          key: 'teacher_id',
          header: 'Teacher ID',
          type: 'text',
          required: true
        },
        {
          key: 'name',
          header: 'Teacher Name',
          type: 'text',
          required: true
        },
        {
          key: 'subject',
          header: 'Subject',
          type: 'select',
          required: true,
          options: subjects
        },
        {
          key: 'classesAssigned',
          header: 'Classes',
          type: 'number',
          required: true
        },
        {
          key: 'studentsCount',
          header: 'Students',
          type: 'number',
          required: true
        },
        {
          key: 'avgStudentScore',
          header: 'Avg Score',
          type: 'number',
          required: true
        },
        {
          key: 'parentFeedback',
          header: 'Parent Rating',
          type: 'number',
          required: true
        },
        {
          key: 'overallRating',
          header: 'Overall Rating',
          type: 'select',
          required: true,
          options: performanceRatings
        },
        {
          key: 'lastEvaluation',
          header: 'Last Evaluation',
          type: 'date',
          required: true
        }
      ],
      filterFields: [
        { key: 'subject', label: 'Subject', type: 'select', options: subjects },
        { key: 'department', label: 'Department', type: 'select', options: departments },
        { key: 'overallRating', label: 'Rating', type: 'select', options: performanceRatings }
      ]
    },
    'teacher-qualification': {
      title: "Teacher Qualification Report",
      data: teacherQualificationReportData,
      columns: [
        {
          key: 'count',
          header: 'S.No',
          type: 'text',
          render: (value, item, index) => {
            const startIndex = (currentPage - 1) * itemsPerPage;
            return startIndex + index + 1;
          },
          required: false
        },
        {
          key: 'teacher_id',
          header: 'Teacher ID',
          type: 'text',
          required: true
        },
        {
          key: 'name',
          header: 'Teacher Name',
          type: 'text',
          required: true
        },
        {
          key: 'highestQualification',
          header: 'Highest Qualification',
          type: 'text',
          required: true
        },
        {
          key: 'teachingQualification',
          header: 'Teaching Qualification',
          type: 'text',
          required: true
        },
        {
          key: 'experience',
          header: 'Experience',
          type: 'text',
          required: true
        },
        {
          key: 'certifications',
          header: 'Certifications',
          type: 'text',
          required: true
        },
        {
          key: 'lastTraining',
          header: 'Last Training',
          type: 'date',
          required: true
        },
        {
          key: 'renewalDue',
          header: 'Renewal Due',
          type: 'date',
          required: true
        },
        {
          key: 'status',
          header: 'Status',
          type: 'select',
          required: true,
          options: certificationStatuses
        }
      ],
      filterFields: [
        { key: 'status', label: 'Certification Status', type: 'select', options: certificationStatuses },
        { key: 'trainingCompleted', label: 'Training Status', type: 'select', options: [
          { value: 'Yes', label: 'Completed' },
          { value: 'No', label: 'Pending' }
        ]},
        { key: 'experience', label: 'Experience', type: 'text', placeholder: 'Search by experience' }
      ]
    },
    'teacher-salary': {
      title: "Teacher Salary Report",
      data: teacherSalaryReportData,
      columns: [
        {
          key: 'count',
          header: 'S.No',
          type: 'text',
          render: (value, item, index) => {
            const startIndex = (currentPage - 1) * itemsPerPage;
            return startIndex + index + 1;
          },
          required: false
        },
        {
          key: 'teacher_id',
          header: 'Teacher ID',
          type: 'text',
          required: true
        },
        {
          key: 'name',
          header: 'Teacher Name',
          type: 'text',
          required: true
        },
        {
          key: 'department',
          header: 'Department',
          type: 'select',
          required: true,
          options: departments
        },
        {
          key: 'basicSalary',
          header: 'Basic Salary',
          type: 'number',
          required: true,
          render: (value) => `₹${value?.toLocaleString()}`
        },
        {
          key: 'allowances',
          header: 'Allowances',
          type: 'number',
          required: true,
          render: (value) => `₹${value?.toLocaleString()}`
        },
        {
          key: 'deductions',
          header: 'Deductions',
          type: 'number',
          required: true,
          render: (value) => `₹${value?.toLocaleString()}`
        },
        {
          key: 'netSalary',
          header: 'Net Salary',
          type: 'number',
          required: true,
          render: (value) => `₹${value?.toLocaleString()}`
        },
        {
          key: 'month',
          header: 'Month',
          type: 'text',
          required: true
        },
        {
          key: 'status',
          header: 'Payment Status',
          type: 'select',
          required: true,
          options: paymentStatuses
        }
      ],
      filterFields: [
        { key: 'department', label: 'Department', type: 'select', options: departments },
        { key: 'status', label: 'Payment Status', type: 'select', options: paymentStatuses },
        { key: 'month', label: 'Month', type: 'text', placeholder: 'Search by month' }
      ]
    }
  };

  // Handle report selection
  const handleReportClick = (reportKey) => {
    setSelectedReport(reportKey);
    setFilteredData(reportConfigs[reportKey].data);
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle filter changes
  const handleFilterChange = (filters) => {
    if (!selectedReport) return;

    const config = reportConfigs[selectedReport];
    let filtered = [...config.data];

    // Apply filters based on selected report
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        filtered = filtered.filter(item => {
          if (key === 'department' || key === 'subject' || key === 'status') {
            return item[key] === filters[key];
          }
          if (key === 'month' || key === 'experience') {
            return item[key] && item[key].toLowerCase().includes(filters[key].toLowerCase());
          }
          return item[key] === filters[key];
        });
      }
    });

    setFilteredData(filtered);
    setCurrentPage(1);
  };

  // Handle clear filters
  const handleClearFilters = () => {
    if (!selectedReport) return;
    setFilteredData(reportConfigs[selectedReport].data);
    setCurrentPage(1);
  };

  return (
    <div className='bg-slate-200 flex AddStudent'>
      <Sidebar />

      <div className='overflow-auto relative z-1 flex-col' style={{
        height: '95vh',
        width: '100vw',
        gap: '10px',
        display: 'flex',
        transition: 'margin-left 0.3s ease'
      }}>
        <Header />

        <main className="w-full py-6 px-4 md:px-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 w-full p-6 text-black">
          <ToastContainer />

          {/* Page Header */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-gray-800 mb-2">HR Reports</h1>
            <p className="text-gray-600">Generate and view various teacher and HR reports</p>
          </motion.div>

          {/* Report Headings Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <div onClick={() => handleReportClick('teacher-credentials')} className="cursor-pointer">
              <ReportHeading mainheading="Teacher Credentials" subheading="login and access report" />
            </div>
            <div onClick={() => handleReportClick('teacher-attendance')} className="cursor-pointer">
              <ReportHeading mainheading="Teacher Attendance" subheading="monthly attendance report" />
            </div>
            <div onClick={() => handleReportClick('teacher-performance')} className="cursor-pointer">
              <ReportHeading mainheading="Teacher Performance" subheading="evaluation and rating" />
            </div>
            <div onClick={() => handleReportClick('teacher-qualification')} className="cursor-pointer">
              <ReportHeading mainheading="Teacher Qualification" subheading="certification and training" />
            </div>
            <div onClick={() => handleReportClick('teacher-salary')} className="cursor-pointer">
              <ReportHeading mainheading="Teacher Salary" subheading="payroll and compensation" />
            </div>
          </div>

          {/* Filter Component */}
          {selectedReport && (
            <ReportFilter
              filterFields={reportConfigs[selectedReport].filterFields}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              title={`${reportConfigs[selectedReport].title} Filters`}
            />
          )}

          {/* Table Component */}
          {selectedReport && (
            <CommonTable
              title={reportConfigs[selectedReport].title}
              columns={reportConfigs[selectedReport].columns}
              data={filteredData}
              createApi={null}
              updateApi={null}
              deleteApi={null}
              searchPlaceholder={`Search ${reportConfigs[selectedReport].title.toLowerCase()}...`}
              addButtonText={`Add ${reportConfigs[selectedReport].title.split(' ')[0]}`}
              exportFileName={selectedReport.replace('-', '_')}
              itemsPerPage={itemsPerPage}
              loading={loading}
              enableSearch={true}
              enablePagination={true}
              enableAdd={false}
              enableEdit={false}
              enableDelete={false}
              enableView={true}
              onPageChange={handlePageChange}
              statusConfig={{
                enable: false
              }}
            />
          )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default HRReports;
