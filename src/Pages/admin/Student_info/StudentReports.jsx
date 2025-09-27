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
  studentCredentialsData, 
  guardianReportData, 
  studentHistoryData, 
  ptmReportsData, 
  studentReportData 
} from "../../../data.js";

const StudentReports = () => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock classes and sections data
  const classes = [
    { value: "8th", label: "8th" },
    { value: "9th", label: "9th" },
    { value: "10th", label: "10th" },
    { value: "11th", label: "11th" },
    { value: "12th", label: "12th" }
  ];

  const sections = [
    { value: "A", label: "A" },
    { value: "B", label: "B" },
    { value: "C", label: "C" },
    { value: "D", label: "D" }
  ];

  const relations = [
    { value: "Father", label: "Father" },
    { value: "Mother", label: "Mother" },
    { value: "Guardian", label: "Guardian" }
  ];

  const statuses = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "pending", label: "Pending" }
  ];

  const performances = [
    { value: "Excellent", label: "Excellent" },
    { value: "Good", label: "Good" },
    { value: "Average", label: "Average" },
    { value: "Poor", label: "Poor" }
  ];

  const attendances = [
    { value: "Present", label: "Present" },
    { value: "Absent", label: "Absent" }
  ];

  // Report configurations
  const reportConfigs = {
    'student-credentials': {
      title: "Student Credentials Report",
      data: studentCredentialsData,
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
          key: 'name',
          header: 'Student Name',
          type: 'text',
          required: true,
          placeholder: 'Enter student name'
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
          key: 'password',
          header: 'Password',
          type: 'password',
          required: true,
          placeholder: 'Enter password'
        },
        {
          key: 'class',
          header: 'Class',
          type: 'select',
          required: true,
          options: classes
        }
      ],
      filterFields: [
        { key: 'class', label: 'Class', type: 'select', options: classes },
        { key: 'section', label: 'Section', type: 'select', options: sections },
        { key: 'status', label: 'Status', type: 'select', options: statuses }
      ]
    },
    'guardian-report': {
      title: "Guardian Report",
      data: guardianReportData,
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
          key: 'studentName',
          header: 'Student Name',
          type: 'text',
          required: true,
          placeholder: 'Enter student name'
        },
        {
          key: 'guardianName',
          header: 'Guardian Name',
          type: 'text',
          required: true,
          placeholder: 'Enter guardian name'
        },
        {
          key: 'relation',
          header: 'Relation',
          type: 'select',
          required: true,
          options: relations
        },
        {
          key: 'phone',
          header: 'Phone',
          type: 'text',
          required: true,
          placeholder: 'Enter phone number'
        },
        {
          key: 'email',
          header: 'Email',
          type: 'email',
          required: true,
          placeholder: 'Enter email address'
        },
        {
          key: 'occupation',
          header: 'Occupation',
          type: 'text',
          required: true,
          placeholder: 'Enter occupation'
        }
      ],
      filterFields: [
        { key: 'relation', label: 'Relation', type: 'select', options: relations },
        { key: 'occupation', label: 'Occupation', type: 'text', placeholder: 'Search by occupation' }
      ]
    },
    'student-history': {
      title: "Student History Report",
      data: studentHistoryData,
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
          key: 'name',
          header: 'Student Name',
          type: 'text',
          required: true,
          placeholder: 'Enter student name'
        },
        {
          key: 'class',
          header: 'Class',
          type: 'select',
          required: true,
          options: classes
        },
        {
          key: 'admissionDate',
          header: 'Admission Date',
          type: 'date',
          required: true
        },
        {
          key: 'previousSchool',
          header: 'Previous School',
          type: 'text',
          required: true,
          placeholder: 'Enter previous school'
        },
        {
          key: 'transferReason',
          header: 'Transfer Reason',
          type: 'text',
          required: true,
          placeholder: 'Enter transfer reason'
        },
        {
          key: 'performance',
          header: 'Performance',
          type: 'select',
          required: true,
          options: performances
        }
      ],
      filterFields: [
        { key: 'class', label: 'Class', type: 'select', options: classes },
        { key: 'performance', label: 'Performance', type: 'select', options: performances }
      ]
    },
    'ptm-reports': {
      title: "PTM Reports",
      data: ptmReportsData,
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
          key: 'studentName',
          header: 'Student Name',
          type: 'text',
          required: true,
          placeholder: 'Enter student name'
        },
        {
          key: 'class',
          header: 'Class',
          type: 'select',
          required: true,
          options: classes
        },
        {
          key: 'parentName',
          header: 'Parent Name',
          type: 'text',
          required: true,
          placeholder: 'Enter parent name'
        },
        {
          key: 'meetingDate',
          header: 'Meeting Date',
          type: 'date',
          required: true
        },
        {
          key: 'attendance',
          header: 'Attendance',
          type: 'select',
          required: true,
          options: attendances
        },
        {
          key: 'discussion',
          header: 'Discussion',
          type: 'text',
          required: true,
          placeholder: 'Enter discussion points'
        },
        {
          key: 'outcome',
          header: 'Outcome',
          type: 'text',
          required: true,
          placeholder: 'Enter meeting outcome'
        }
      ],
      filterFields: [
        { key: 'class', label: 'Class', type: 'select', options: classes },
        { key: 'attendance', label: 'Attendance', type: 'select', options: attendances }
      ]
    },
    'student-report': {
      title: "Student Report",
      data: studentReportData,
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
          key: 'name',
          header: 'Student Name',
          type: 'text',
          required: true,
          placeholder: 'Enter student name'
        },
        {
          key: 'class',
          header: 'Class',
          type: 'select',
          required: true,
          options: classes
        },
        {
          key: 'section',
          header: 'Section',
          type: 'select',
          required: true,
          options: sections
        },
        {
          key: 'rollNumber',
          header: 'Roll Number',
          type: 'text',
          required: true,
          placeholder: 'Enter roll number'
        },
        {
          key: 'attendance',
          header: 'Attendance',
          type: 'text',
          required: true,
          placeholder: 'Enter attendance percentage'
        },
        {
          key: 'performance',
          header: 'Performance',
          type: 'select',
          required: true,
          options: performances
        },
        {
          key: 'remarks',
          header: 'Remarks',
          type: 'text',
          required: true,
          placeholder: 'Enter remarks'
        }
      ],
      filterFields: [
        { key: 'class', label: 'Class', type: 'select', options: classes },
        { key: 'section', label: 'Section', type: 'select', options: sections },
        { key: 'performance', label: 'Performance', type: 'select', options: performances }
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
          if (key === 'class') {
            return item.class && item.class.includes(filters[key]);
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
    <div className='bg-gray-100 flex AddStudent'>
      <Sidebar />

      <div className='overflow-auto relative z-1 flex-col' style={{
        height: '95vh',
        width: '100vw',
        gap: '10px',
        display: 'flex',
        transition: 'margin-left 0.3s ease'
      }}>
        <Header />

        <div className="bg-white shadow-md rounded-lg w-full max-w-7xl p-6 flex-1 overflow-auto relative z-1 m-auto text-black">
          <ToastContainer />

          {/* Page Header */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Student Reports</h1>
            <p className="text-gray-600">Generate and view various student reports</p>
          </motion.div>

          {/* Report Headings Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <div onClick={() => handleReportClick('student-credentials')} className="cursor-pointer">
              <ReportHeading mainheading="Student Credentials" subheading="class wise" />
            </div>
            <div onClick={() => handleReportClick('guardian-report')} className="cursor-pointer">
              <ReportHeading mainheading="Guardian Report" subheading="guardian report" />
            </div>
            <div onClick={() => handleReportClick('student-history')} className="cursor-pointer">
              <ReportHeading mainheading="Student History" subheading="student history" />
            </div>
            <div onClick={() => handleReportClick('ptm-reports')} className="cursor-pointer">
              <ReportHeading mainheading="PTM Reports" subheading="student ptm" />
            </div>
            <div onClick={() => handleReportClick('student-report')} className="cursor-pointer">
              <ReportHeading mainheading="Student Report" subheading="class section wise" />
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
              onPageChange={handlePageChange}
              statusConfig={{
                enable: false
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentReports;