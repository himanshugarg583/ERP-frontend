import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Sidebar from '../Sidebar';
import Header from '../../../components/comman_components/Header';
import CommonTable from '../../../components/tables/CommonTable';
import CommonFilter from '../../../components/tables/CommonFilter';
import ExamTermForm from '../../../components/examanitaion/ExamTermForm';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  getAllExamTerms,
  updateExamTerm,
  deleteExamTerm,
  getExamTermById
} from '../../../helper/requests-method/apiMethods';
import Modal from '../../../components/comman_components/Modal';

const TermListPage = () => {
  const [terms, setTerms] = useState([]);
  const [filteredTerms, setFilteredTerms] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [termToDelete, setTermToDelete] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [termToView, setTermToView] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const itemsPerPage = 10;

  const fetchTerms = useCallback(async () => {
    setTableLoading(true);
    try {
      const response = await getAllExamTerms();
      // API response structure: { success: true, statusCode: 200, message: "...", data: [...] }
      const payload = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response?.terms)
          ? response.terms
          : Array.isArray(response)
            ? response
            : [];
      
      const normalizedTerms = payload.map((term) => ({
        id: term.id,
        term_name: term.term_name || '',
        academic_year: term.academic_year || '',
        start_date: term.start_date || null,
        end_date: term.end_date || null,
        status: term.status || 'active'
      }));

      setTerms(normalizedTerms);
      setFilteredTerms(normalizedTerms);
    } catch (error) {
      console.error('Error fetching exam terms:', error);
      toast.error(error?.response?.data?.message || 'Failed to load exam terms');
    } finally {
      setTableLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTerms();
    
    // Listen for exam term added event
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
        placeholder: 'e.g. First Term'
      },
      {
        key: 'academic_year',
        header: 'Academic Year',
        type: 'text',
        required: true,
        placeholder: 'e.g. 2024-2025'
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
      { key: 'term_name', label: 'Term Name', type: 'text', placeholder: 'Search by term name' },
      { key: 'academic_year', label: 'Academic Year', type: 'text', placeholder: 'Search by academic year' },
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

  const handleUpdateTerm = useCallback(
    async (id, data) => {
      const payload = {
        term_name: data.term_name?.trim(),
        academic_year: data.academic_year?.trim(),
        start_date: data.start_date,
        end_date: data.end_date,
        status: data.status
      };

      // Validate dates
      if (payload.start_date && payload.end_date) {
        if (new Date(payload.start_date) > new Date(payload.end_date)) {
          toast.error('End date must be after start date');
          return { success: false, message: 'End date must be after start date' };
        }
      }

      try {
        const response = await updateExamTerm(id, payload);
        if (response?.success) {
          toast.success(response.message || 'Exam term updated successfully');
          await fetchTerms();
        } else {
          toast.error(response?.message || 'Failed to update exam term');
        }
        return response;
      } catch (error) {
        console.error('Error updating exam term:', error);
        toast.error(error?.response?.data?.message || 'Failed to update exam term');
        throw error;
      }
    },
    [fetchTerms]
  );

  const handleDeleteClick = useCallback(async (term) => {
    setTermToDelete(term);
    setDeleteModalOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!termToDelete) return;

    try {
      const response = await deleteExamTerm(termToDelete.id);
      if (response?.success) {
        toast.success(response.message || 'Exam term deleted successfully');
        setTerms((prev) => prev.filter((term) => term.id !== termToDelete.id));
        setFilteredTerms((prev) => prev.filter((term) => term.id !== termToDelete.id));
        setDeleteModalOpen(false);
        setTermToDelete(null);
      } else {
        toast.error(response?.message || 'Failed to delete exam term');
      }
    } catch (error) {
      console.error('Error deleting exam term:', error);
      toast.error(error?.response?.data?.message || 'Failed to delete exam term');
    }
  }, [termToDelete]);

  const handleViewClick = useCallback(async (term) => {
    setViewLoading(true);
    setViewModalOpen(true);
    try {
      const response = await getExamTermById(term.id);
      if (response?.success && response?.data) {
        setTermToView(response.data);
      } else {
        // Fallback to term data if API fails
        setTermToView(term);
      }
    } catch (error) {
      console.error('Error fetching term details:', error);
      // Fallback to term data if API fails
      setTermToView(term);
    } finally {
      setViewLoading(false);
    }
  }, []);

  // Handle filter changes
  const handleFilterChange = (filters) => {
    let filtered = [...terms];

    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        filtered = filtered.filter(item => {
          if (key === 'term_name' || key === 'academic_year') {
            return item[key] && item[key].toLowerCase().includes(filters[key].toLowerCase());
          }
          if (key === 'status') {
            return item[key]?.toString() === filters[key]?.toString();
          }
          return false;
        });
      }
    });

    setFilteredTerms(filtered);
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setFilteredTerms(terms);
  };

  // Handle term addition from form component
  const handleTermAdded = () => {
    fetchTerms();
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
          {/* Add Exam Term Form Component */}
          <ExamTermForm onTermAdded={handleTermAdded} />

          {/* Filter Component */}
          <CommonFilter
            filterFields={filterFields}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            title="Exam Term Filters"
          />

          {/* Table Component */}
          <CommonTable
            title="Exam Term Management"
            columns={termColumns}
            data={filteredTerms}
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
      </div>

      {/* Delete Confirmation Modal */}
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
              <p className="text-sm text-gray-600"><strong>Academic Year:</strong> {termToDelete.academic_year}</p>
              <p className="text-sm text-gray-600"><strong>Start Date:</strong> {termToDelete.start_date ? new Date(termToDelete.start_date).toLocaleDateString('en-GB') : 'N/A'}</p>
              <p className="text-sm text-gray-600"><strong>End Date:</strong> {termToDelete.end_date ? new Date(termToDelete.end_date).toLocaleDateString('en-GB') : 'N/A'}</p>
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

      {/* View Term Details Modal */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setTermToView(null);
        }}
        title="Exam Term Details"
      >
        {viewLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
            <p className="mt-2 text-gray-600">Loading term details...</p>
          </div>
        ) : termToView ? (
          <div className="p-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Term Name</label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded-md">{termToView.term_name || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded-md">{termToView.academic_year || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded-md">
                  {termToView.start_date ? new Date(termToView.start_date).toLocaleDateString('en-GB', { 
                    day: '2-digit', 
                    month: 'long', 
                    year: 'numeric' 
                  }) : 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded-md">
                  {termToView.end_date ? new Date(termToView.end_date).toLocaleDateString('en-GB', { 
                    day: '2-digit', 
                    month: 'long', 
                    year: 'numeric' 
                  }) : 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded-md">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    termToView.status === 'active' ? 'bg-green-100 text-green-800' :
                    termToView.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {termToView.status ? termToView.status.charAt(0).toUpperCase() + termToView.status.slice(1) : 'N/A'}
                  </span>
                </p>
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
