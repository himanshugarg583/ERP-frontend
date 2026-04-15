import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { useDispatch } from 'react-redux';
import Sidebar from '../Sidebar';
import Header from '../../../components/comman_components/Header';
import CommonTable from '../../../components/tables/CommonTable';
import ExamTermForm from '../../../components/examanitaion/ExamTermForm';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  listExamTypesV2Thunk,
  updateExamTypeV2Thunk,
  deleteExamTypeV2Thunk,
} from '../../../store/slices/examSlice';
import Modal from '../../../components/comman_components/Modal';

const TermListPage = () => {
  const dispatch = useDispatch();
  const [terms, setTerms] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [termToDelete, setTermToDelete] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [termToView, setTermToView] = useState(null);
  const itemsPerPage = 10;

  const fetchTerms = useCallback(async () => {
    setTableLoading(true);
    try {
      const response = await dispatch(listExamTypesV2Thunk()).unwrap();
      const payload = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response)
          ? response
          : [];

      const normalizedTerms = payload.map((term) => ({
        id: term.id || term.uuid,
        term_name: term.name || term.term_name || '',
        description: term.description || '',
        grading_config: term.grading_config || {},
        grading_config_text: term.grading_config ? JSON.stringify(term.grading_config) : '{}',
        status: term.is_active === false ? 'inactive' : 'active',
      }));

      setTerms(normalizedTerms);
    } catch (error) {
      console.error('Error fetching exam terms:', error);
      toast.error(error?.response?.data?.message || 'Failed to load exam terms');
    } finally {
      setTableLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchTerms();

    const handleTermAdded = () => {
      fetchTerms();
    };

    window.addEventListener('examTermAdded', handleTermAdded);

    return () => {
      window.removeEventListener('examTermAdded', handleTermAdded);
    };
  }, [fetchTerms]);

  const termColumns = useMemo(
    () => [
      {
        key: 'term_name',
        header: 'Term Name',
        type: 'text',
        required: true,
        placeholder: 'e.g. Mid Term',
      },
      {
        key: 'description',
        header: 'Description',
        type: 'text',
        placeholder: 'Term description',
        render: (value) => value || 'N/A',
      },
      {
        key: 'grading_config_text',
        header: 'Grading Config (JSON)',
        type: 'text',
        placeholder: '{"A+":90,"A":80}',
        render: (value) => {
          if (!value) return '{}';
          return value.length > 45 ? `${value.substring(0, 45)}...` : value;
        },
      },
      {
        key: 'status',
        header: 'Status',
        type: 'select',
        options: [
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
        ],
        render: (value) => (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${value === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {value === 'active' ? 'Active' : 'Inactive'}
          </span>
        ),
      },
    ],
    []
  );

  const handleUpdateTerm = useCallback(
    async (id, data) => {
      let gradingConfig;
      const gradingText = data.grading_config_text?.trim();
      if (gradingText) {
        try {
          gradingConfig = JSON.parse(gradingText);
        } catch {
          toast.error('Grading config must be valid JSON');
          return { success: false, message: 'Invalid grading config JSON' };
        }
      }

      const payload = {
        name: data.term_name?.trim(),
        description: data.description?.trim() || '',
        is_active: data.status !== 'inactive',
      };

      if (gradingConfig !== undefined) {
        payload.grading_config = gradingConfig;
      }

      try {
        const response = await dispatch(
          updateExamTypeV2Thunk({ examTypeUuid: id, payload })
        ).unwrap();
        toast.success(response?.message || 'Exam term updated successfully');
        await fetchTerms();
        return response;
      } catch (error) {
        console.error('Error updating exam term:', error);
        toast.error(error?.response?.data?.message || 'Failed to update exam term');
        throw error;
      }
    },
    [dispatch, fetchTerms]
  );

  const handleDeleteClick = useCallback((term) => {
    setTermToDelete(term);
    setDeleteModalOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!termToDelete) return;

    try {
      const response = await dispatch(
        deleteExamTypeV2Thunk({ examTypeUuid: termToDelete.id })
      ).unwrap();
      toast.success(response?.message || 'Exam term deleted successfully');
      setTerms((prev) => prev.filter((term) => term.id !== termToDelete.id));
      setDeleteModalOpen(false);
      setTermToDelete(null);
    } catch (error) {
      console.error('Error deleting exam term:', error);
      toast.error(error?.response?.data?.message || 'Failed to delete exam term');
    }
  }, [dispatch, termToDelete]);

  const handleViewClick = useCallback((term) => {
    setTermToView(term);
    setViewModalOpen(true);
  }, []);

  const handleTermAdded = () => {
    fetchTerms();
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
        transition: 'margin-left 0.3s ease',
      }}>
        <Header />
        <main className="w-full py-4 md:py-6 px-4 md:px-6">
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl md:text-2xl font-semibold text-slate-800 mb-2">Exam Term Management</h1>
                  <p className="text-sm text-slate-600">Manage exam terms, descriptions, grading config, and status</p>
                </div>
                <button
                  onClick={() => setAddModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors shadow-sm w-full sm:w-auto justify-center"
                >
                  <Plus size={20} />
                  <span>Add Exam Term</span>
                </button>
              </div>
            </div>

            <CommonTable
              title="Exam Terms"
              columns={termColumns}
              data={terms}
              createApi={null}
              updateApi={handleUpdateTerm}
              deleteApi={null}
              searchPlaceholder="Search exam terms..."
              addButtonText="Add Exam Term"
              exportFileName="exam_terms"
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
        </main>
      </div>

      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add New Exam Term"
      >
        <ExamTermForm onTermAdded={handleTermAdded} inModal={true} onCancel={() => setAddModalOpen(false)} />
      </Modal>

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setTermToDelete(null);
        }}
        title="Delete Exam Term"
      >
        {termToDelete && (
          <div className="p-4">
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete the exam term <strong>"{termToDelete.term_name}"</strong>?
            </p>
            <div className="bg-gray-50 p-3 rounded-md mb-4">
              <p className="text-sm text-gray-600"><strong>Status:</strong> {termToDelete.status}</p>
            </div>
            <p className="text-red-600 text-sm mb-4">This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  setTermToDelete(null);
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

      <Modal
        isOpen={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setTermToView(null);
        }}
        title="Exam Term Details"
      >
        {termToView ? (
          <div className="p-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Term Name</label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded-md">{termToView.term_name || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded-md">{termToView.description || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grading Config</label>
                <pre className="text-gray-900 bg-gray-50 p-2 rounded-md text-xs overflow-auto">
                  {JSON.stringify(termToView.grading_config || {}, null, 2)}
                </pre>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded-md">{termToView.status || 'active'}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setViewModalOpen(false);
                  setTermToView(null);
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

export default TermListPage;
