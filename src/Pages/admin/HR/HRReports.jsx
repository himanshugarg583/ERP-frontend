import React, { useState, useEffect, useCallback } from "react";
import { motion } from 'framer-motion';
import ReportHeading from "../../../components/comman_components/ReportHeading";
import CommonTable from "../../../components/tables/CommonTable";
import ReportFilter from "../../../components/tables/ReportFilter";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from "../Sidebar";
import Header from "../../../components/comman_components/Header";
import "../Admin.css";
import { getTeacherCredentials, getTeacherSalary } from "../../../helper/requests-method/apiMethods";

const HRReports = () => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [credentialsData, setCredentialsData] = useState([]);
  const [salaryData, setSalaryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch teacher credentials
  const fetchTeacherCredentials = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getTeacherCredentials();
      if (response.success && response.data) {
        const mappedData = response.data.map((item) => ({
          teacher_id: item.teacher_id || item.id || "N/A",
          name: item.name || "N/A",
          email: item.email || "N/A",
          password: item.password || "N/A",
          role: item.role || "N/A",
        }));
        setCredentialsData(mappedData);
        setFilteredData(mappedData);
      } else {
        toast.error(response.message || "Failed to fetch teacher credentials");
      }
    } catch (error) {
      console.error("Failed to fetch teacher credentials:", error);
      toast.error(error.response?.data?.message || "Failed to fetch teacher credentials");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch teacher salary
  const fetchTeacherSalary = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getTeacherSalary();
      if (response.success && response.data) {
        const mappedData = response.data.map((item) => ({
          teacher_id: item.teacher_id || item.id || "N/A",
          name: item.name || "N/A",
          email: item.email || "N/A",
          salary: item.salary || "0.00",
          role: item.role || "N/A",
        }));
        setSalaryData(mappedData);
        setFilteredData(mappedData);
      } else {
        toast.error(response.message || "Failed to fetch teacher salary");
      }
    } catch (error) {
      console.error("Failed to fetch teacher salary:", error);
      toast.error(error.response?.data?.message || "Failed to fetch teacher salary");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch data when report is selected
  useEffect(() => {
    if (selectedReport === 'teacher-credentials') {
      if (credentialsData.length === 0) {
        fetchTeacherCredentials();
      } else {
        setFilteredData(credentialsData);
      }
    } else if (selectedReport === 'teacher-salary') {
      if (salaryData.length === 0) {
        fetchTeacherSalary();
      } else {
        setFilteredData(salaryData);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedReport]);

  // Report configurations
  const reportConfigs = {
    'teacher-credentials': {
      title: "Teacher Credentials Report",
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
          key: 'email',
          header: 'Email',
          type: 'email',
          required: true
        },
        {
          key: 'password',
          header: 'Password',
          type: 'text',
          required: true
        },
        {
          key: 'role',
          header: 'Role',
          type: 'text',
          required: true
        }
      ],
      filterFields: [
        { key: 'name', label: 'Teacher Name', type: 'text', placeholder: 'Search by name' },
        { key: 'email', label: 'Email', type: 'text', placeholder: 'Search by email' },
        { key: 'role', label: 'Role', type: 'text', placeholder: 'Search by role' }
      ]
    },
    'teacher-salary': {
      title: "Teacher Salary Report",
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
          key: 'email',
          header: 'Email',
          type: 'email',
          required: true
        },
        {
          key: 'salary',
          header: 'Salary',
          type: 'text',
          required: true,
          render: (value) => `₹${parseFloat(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        },
        {
          key: 'role',
          header: 'Role',
          type: 'text',
          required: true
        }
      ],
      filterFields: [
        { key: 'name', label: 'Teacher Name', type: 'text', placeholder: 'Search by name' },
        { key: 'email', label: 'Email', type: 'text', placeholder: 'Search by email' },
        { key: 'role', label: 'Role', type: 'text', placeholder: 'Search by role' }
      ]
    }
  };

  // Handle report selection
  const handleReportClick = (reportKey) => {
    setSelectedReport(reportKey);
    setCurrentPage(1);
    // Data will be set by useEffect when report is selected
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle filter changes
  const handleFilterChange = (filters) => {
    if (!selectedReport) return;

    let dataToFilter = [];
    if (selectedReport === 'teacher-credentials') {
      dataToFilter = [...credentialsData];
    } else if (selectedReport === 'teacher-salary') {
      dataToFilter = [...salaryData];
    }

    // Apply filters
    let filtered = dataToFilter;
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        filtered = filtered.filter(item => {
          const itemValue = item[key];
          if (!itemValue) return false;
          return itemValue.toString().toLowerCase().includes(filters[key].toLowerCase());
        });
      }
    });

    setFilteredData(filtered);
    setCurrentPage(1);
  };

  // Handle clear filters
  const handleClearFilters = () => {
    if (!selectedReport) return;
    if (selectedReport === 'teacher-credentials') {
      setFilteredData(credentialsData);
    } else if (selectedReport === 'teacher-salary') {
      setFilteredData(salaryData);
    }
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div onClick={() => handleReportClick('teacher-credentials')} className="cursor-pointer">
              <ReportHeading mainheading="Teacher Credentials" subheading="login and access report" />
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
