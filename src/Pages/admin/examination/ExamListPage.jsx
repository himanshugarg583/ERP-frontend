import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus } from 'lucide-react';
import Sidebar from '../Sidebar';
import Header from '../../../components/comman_components/Header';
import CommonTable from '../../../components/tables/CommonTable';
import ExamForm from '../../../components/examanitaion/ExamForm';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  getAllExams,
  updateExam,
  deleteExam
} from '../../../helper/requests-method/apiMethods';
import Modal from '../../../components/comman_components/Modal';

const ExamListPage = () => {
  const [exams, setExams] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [examToDelete, setExamToDelete] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [examToView, setExamToView] = useState(null);
  const itemsPerPage = 10;

  const fetchExams = useCallback(async () => {
    setTableLoading(true);
    try {
      const response = await getAllExams();
      // API response structure: { success: true, statusCode: 200, message: "...", data: [...] }
      const payload = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response?.exams)
          ? response.exams
          : Array.isArray(response)
            ? response
            : [];

      const normalizedExams = payload.map((exam) => ({
        id: exam.id,
        term_id: exam.term_id || null,
        exam_name: exam.exam_name || '',
        description: exam.description || '',
        start_date: exam.start_date || null,
        end_date: exam.end_date || null,
        status: exam.status || 'active',
        term_name: exam.term?.term_name || '',
        academic_year: exam.term?.academic_year || ''
      }));

      setExams(normalizedExams);
    } catch (error) {
      console.error('Error fetching exams:', error);
      toast.error(error?.response?.data?.message || 'Failed to load exams');
    } finally {
      setTableLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExams();

    // Listen for exam added event
    const handleExamAdded = () => {
      fetchExams();
    };

    window.addEventListener('examAdded', handleExamAdded);

    return () => {
      window.removeEventListener('examAdded', handleExamAdded);
    };
  }, [fetchExams]);

  const examColumns = useMemo(
    () => [
      {
        key: 'exam_name',
        header: 'Exam Name',
        type: 'text',
        required: true,
        placeholder: 'e.g. Mid-Term Exam'
      },
      {
        key: 'term_name',
        header: 'Term',
        type: 'text',
        render: (value, item) => {
          if (item.term_name && item.academic_year) {
            return `${item.term_name} (${item.academic_year})`;
          }
          return item.term_name || 'N/A';
        }
      },
      {
        key: 'description',
        header: 'Description',
        type: 'text',
        render: (value) => {
          if (!value) return 'N/A';
          return value.length > 50 ? `${value.substring(0, 50)}...` : value;
        }
      },
      {
        key: 'start_date',
        header: 'Start Date',
        type: 'date',
        required: true,
        render: (value) => {
          if (!value) return 'N/A';
          const date = new Date(value);
          return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
        }
      },
      {
        key: 'end_date',
        header: 'End Date',
        type: 'date',
        required: true,
        render: (value) => {
          if (!value) return 'N/A';
          const date = new Date(value);
          return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
        }
      },
      {
        key: 'status',
        header: 'Status',
        type: 'select',
        required: true,
        options: [
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
          { value: 'completed', label: 'Completed' }
        ],
        render: (value) => {
          const statusColors = {
            active: 'bg-green-100 text-green-800',
            inactive: 'bg-gray-100 text-gray-800',
            completed: 'bg-blue-100 text-blue-800'
          };
          const colorClass = statusColors[value] || 'bg-gray-100 text-gray-800';
          return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
              {value ? value.charAt(0).toUpperCase() + value.slice(1) : 'N/A'}
            </span>
          );
        }
      }
    ],
    []
  );

  const filterFields = useMemo(
    () => [
      { key: 'exam_name', label: 'Exam Name', type: 'text', placeholder: 'Search by exam name' },
      { key: 'term_name', label: 'Term', type: 'text', placeholder: 'Search by term name' },
      {
        key: 'status',
        label: 'Status',
        type: 'select',
        options: [
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
          { value: 'completed', label: 'Completed' }
        ]
      }
    ],
    []
  );

  const handleUpdateExam = useCallback(
    async (id, data) => {
      const payload = {
        term_id: data.term_id ? Number(data.term_id) : undefined,
        exam_name: data.exam_name?.trim(),
        description: data.description?.trim() || null,
        start_date: data.start_date || null,
        end_date: data.end_date || null,
        status: data.status
      };

      // Remove undefined fields
      Object.keys(payload).forEach(key => {
        if (payload[key] === undefined) {
          delete payload[key];
        }
      });

      // Validate dates
      if (payload.start_date && payload.end_date) {
        if (new Date(payload.start_date) > new Date(payload.end_date)) {
          toast.error('End date must be after start date');
          return { success: false, message: 'End date must be after start date' };
        }
      }

      try {
        const response = await updateExam(id, payload);
        if (response?.success) {
          toast.success(response.message || 'Exam updated successfully');
          await fetchExams();
        } else {
          toast.error(response?.message || 'Failed to update exam');
        }
        return response;
      } catch (error) {
        console.error('Error updating exam:', error);
        toast.error(error?.response?.data?.message || 'Failed to update exam');
        throw error;
      }
    },
    [fetchExams]
  );

  const handleDeleteClick = useCallback(async (exam) => {
    setExamToDelete(exam);
    setDeleteModalOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!examToDelete) return;

    try {
      const response = await deleteExam(examToDelete.id);
      if (response?.success) {
        toast.success(response.message || 'Exam deleted successfully');
        setExams((prev) => prev.filter((exam) => exam.id !== examToDelete.id));
        setDeleteModalOpen(false);
        setExamToDelete(null);
      } else {
        toast.error(response?.message || 'Failed to delete exam');
      }
    } catch (error) {
      console.error('Error deleting exam:', error);
      toast.error(error?.response?.data?.message || 'Failed to delete exam');
    }
  }, [examToDelete]);

  const handleViewClick = useCallback(async (exam) => {
    setExamToView(exam);
    setViewModalOpen(true);
  }, []);

  // Handle exam addition from form component
  const handleExamAdded = () => {
    fetchExams();
    setAddModalOpen(false);
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

        <div className="flex-1 p-4 md:p-6">
          {/* Page Header */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl md:text-2xl font-semibold text-slate-800 mb-2">Exam Management</h1>
                <p className="text-sm text-slate-600">Manage exams, schedules, and term mapping</p>
              </div>
              <button
                onClick={() => setAddModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors shadow-sm w-full sm:w-auto justify-center"
              >
                <Plus size={20} />
                <span>Add Exam</span>
              </button>
            </div>
          </div>

          {/* Table Component */}
          <CommonTable
            title="Exam Management"
            columns={examColumns}
            data={exams}
            createApi={null}
            updateApi={handleUpdateExam}
            deleteApi={null}
            searchPlaceholder="Search exams..."
            addButtonText="Add Exam"
            exportFileName="exams"
            itemsPerPage={itemsPerPage}
            enableSearch={true}
            enablePagination={true}
            enableAdd={false}
            enableEdit={true}
            enableDelete={true}
            enableView={true}
            loading={tableLoading}
            onDelete={handleDeleteClick}
            onView={handleViewClick}
          />
        </div>
      </div>

      {/* Add Exam Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add New Exam"
        subtitle="Define exam details and link to an academic term"
        size="lg"
      >
        <ExamForm onExamAdded={handleExamAdded} inModal={true} onCancel={() => setAddModalOpen(false)} />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setExamToDelete(null);
        }}
        title="Delete Exam"
      >
        {examToDelete && (
          <div className="p-4">
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete the exam <strong>"{examToDelete.exam_name}"</strong>?
            </p>
            <div className="bg-gray-50 p-3 rounded-md mb-4">
              <p className="text-sm text-gray-600"><strong>Term:</strong> {examToDelete.term_name || 'N/A'}</p>
              <p className="text-sm text-gray-600"><strong>Start Date:</strong> {examToDelete.start_date ? new Date(examToDelete.start_date).toLocaleDateString('en-GB') : 'N/A'}</p>
              <p className="text-sm text-gray-600"><strong>End Date:</strong> {examToDelete.end_date ? new Date(examToDelete.end_date).toLocaleDateString('en-GB') : 'N/A'}</p>
            </div>
            <p className="text-red-600 text-sm mb-4">This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  setExamToDelete(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* View Exam Details Modal */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setExamToView(null);
        }}
        title="Exam Details"
        size="lg"
      >
        {examToView ? (
          <div className="p-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Exam Name</label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded-md">{examToView.exam_name || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Term</label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded-md">
                  {examToView.term_name && examToView.academic_year
                    ? `${examToView.term_name} (${examToView.academic_year})`
                    : examToView.term_name || 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded-md">{examToView.description || 'N/A'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <p className="text-gray-900 bg-gray-50 p-2 rounded-md">
                    {examToView.start_date ? new Date(examToView.start_date).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    }) : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <p className="text-gray-900 bg-gray-50 p-2 rounded-md">
                    {examToView.end_date ? new Date(examToView.end_date).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    }) : 'N/A'}
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded-md">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${examToView.status === 'active' ? 'bg-green-100 text-green-800' :
                    amToView.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      'bgray-100 text-gray-800'
                    }`}>
                    {examToView.status ? examToView.status.charAt(0).toUpperCase() + examToView.status.slice(1) : 'N/A'}
                  </span>
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setViewModalOpen(false);
                  setExamToView(null);
                }}
                className="px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        ) : null}
      </Modal>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ExamListPage;

