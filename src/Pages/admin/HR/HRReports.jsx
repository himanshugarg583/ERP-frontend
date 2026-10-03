import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import Header from "../../../components/comman_components/Header";
import ReportHeading from "../../../components/comman_components/ReportHeading";

const HRReports = () => {
  const navigate = useNavigate();

  const reportCards = [
    {
      id: "staff-attendance",
      title: "STAFF ATTENDANCE REPORT",
      subtitle: "Staff Attendance Report",
      route: "/admin/hr/staff-attendance",
    },
    {
      id: "staff-custom-attendance",
      title: "STAFF CUSTOM ATTENDANCE REPORT",
      subtitle: "Staff Custom Attendance Report",
    },
    {
      id: "staff-leave",
      title: "STAFF LEAVE REPORT",
      subtitle: "Staff Leave Report",
    },
    {
      id: "payroll-report",
      title: "PAYROLL REPORT",
      subtitle: "Payroll Report",
      route: "/admin/hr/teacher-salary",
    },
    {
      id: "teacher-credentials",
      title: "TEACHER CREDENTIALS",
      subtitle: "View teacher login credentials",
      route: "/admin/hr/teacher-credentials",
    },
  ];

  const handleReportClick = (reportType) => {
    if (reportType) navigate(reportType);
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

        <div className="bg-white shadow-md rounded-lg w-full max-w-7xl p-6 flex-1 overflow-auto relative z-1 m-auto text-black">
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
      </div>
    </div>
  );
};

export default HRReports;
