import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from "../Sidebar";
import Header from "../../../components/comman_components/Header";
import { DollarSign, ArrowLeft } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getTeacherSalary } from "../../../helper/requests-method/apiMethods";
import ReusableTable from '../../../components/comman_components/ReusableTable';

const TeacherSalaryPage = () => {
  const navigate = useNavigate();
  const [salaryData, setSalaryData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch teacher salary
  const fetchSalary = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getTeacherSalary();
      if (response.success && response.data) {
        const mappedData = response.data.map((item, index) => ({
          id: item.teacherDetails?.id || item.id || item.teacher_id || index,
          teacher_id: item.teacherDetails?.id || item.id || item.teacher_id || item.user_id || "N/A",
          name: item.name || "N/A",
          email: item.email || "N/A",
          salary: item.teacherDetails?.salary || item.salary || "0.00",
          role: item.role || "N/A",
        }));
        setSalaryData(mappedData);
      } else {
        toast.error(response.message || "Failed to fetch teacher salary");
        setSalaryData([]);
      }
    } catch (error) {
      console.error("Failed to fetch teacher salary:", error);
      toast.error(error.response?.data?.message || "Failed to fetch teacher salary");
      setSalaryData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSalary();
  }, [fetchSalary]);

  // Define columns for salary table
  const salaryColumns = [
    {
      key: 'teacher_id',
      header: 'Teacher ID',
      type: 'text',
      required: false
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
      key: 'salary',
      header: 'Salary',
      type: 'text',
      required: true,
      placeholder: 'Enter salary',
      render: (value) => {
        const salaryValue = parseFloat(value || 0);
        return `₹${salaryValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      }
    },
    {
      key: 'role',
      header: 'Role',
      type: 'text',
      required: false
    }
  ];

  // Display columns (columns to show in table)
  const displayColumns = salaryColumns;

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
        <main className="w-full py-4 md:py-6 px-4 md:px-6">
          <ToastContainer />
          <div className="space-y-4 md:space-y-6">
            {/* Back Button and Header */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/admin/hr-reports')}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Reports
                </button>
                <div>
                  <h1 className="text-lg md:text-xl font-semibold text-slate-800">Teacher Salary</h1>
                  <p className="text-sm text-slate-600">View teacher payroll and compensation details</p>
                </div>
              </div>
            </div>

            {/* Salary Table */}
            {loading && salaryData.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <div className="text-center py-8 text-slate-500">Loading salary data...</div>
              </div>
            ) : (
              <ReusableTable
                title="Teacher Salary"
                columns={salaryColumns}
                displayColumns={displayColumns}
                apiFunction={null}
                initialData={salaryData}
                searchPlaceholder="Search by name, email, or role..."
                addButtonText="Add Teacher"
                exportFileName="teacher_salary"
                showActions={{ add: false, edit: false, delete: false, view: false }}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherSalaryPage;

