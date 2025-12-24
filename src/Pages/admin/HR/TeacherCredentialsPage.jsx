import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from "../Sidebar";
import Header from "../../../components/comman_components/Header";
import { Key, ArrowLeft } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getTeacherCredentials } from "../../../helper/requests-method/apiMethods";
import ReusableTable from '../../../components/comman_components/ReusableTable';

const TeacherCredentialsPage = () => {
  const navigate = useNavigate();
  const [credentialsData, setCredentialsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch teacher credentials
  const fetchCredentials = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getTeacherCredentials();
      if (response.success && response.data) {
        const mappedData = response.data.map((item, index) => ({
          id: item.teacher_id || item.id || index,
          teacher_id: item.teacher_id || item.id || "N/A",
          name: item.name || "N/A",
          email: item.email || "N/A",
          password: item.password || "N/A",
          role: item.role || "N/A",
        }));
        setCredentialsData(mappedData);
      } else {
        toast.error(response.message || "Failed to fetch teacher credentials");
        setCredentialsData([]);
      }
    } catch (error) {
      console.error("Failed to fetch teacher credentials:", error);
      toast.error(error.response?.data?.message || "Failed to fetch teacher credentials");
      setCredentialsData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCredentials();
  }, [fetchCredentials]);

  // Define columns for credentials table
  const credentialsColumns = [
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
      key: 'password',
      header: 'Password',
      type: 'password',
      required: true,
      placeholder: 'Enter password',
      render: (value) => value ? '••••••••' : 'N/A'
    },
    {
      key: 'role',
      header: 'Role',
      type: 'text',
      required: false
    }
  ];

  // Display columns (columns to show in table)
  const displayColumns = credentialsColumns;

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
                  <h1 className="text-lg md:text-xl font-semibold text-slate-800">Teacher Credentials</h1>
                  <p className="text-sm text-slate-600">View teacher login credentials and access information</p>
                </div>
              </div>
            </div>

            {/* Credentials Table */}
            {loading && credentialsData.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <div className="text-center py-8 text-slate-500">Loading credentials...</div>
              </div>
            ) : (
              <ReusableTable
                title="Teacher Credentials"
                columns={credentialsColumns}
                displayColumns={displayColumns}
                apiFunction={null}
                initialData={credentialsData}
                searchPlaceholder="Search by name, email, or role..."
                addButtonText="Add Teacher"
                exportFileName="teacher_credentials"
                showActions={{ add: false, edit: false, delete: false, view: false }}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherCredentialsPage;

