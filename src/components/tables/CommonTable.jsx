import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Edit, Search, Trash2, UserPlus, X, Eye, Plus } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faFileExcel, faFilePdf, faFileText } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CommonTable = ({
  // Table Configuration
  title = "Data Table",
  columns = [],
  data = [],
  
  // API Configuration
  apiFunction = null,
  createApi = null,
  updateApi = null,
  deleteApi = null,
  
  // UI Configuration
  searchPlaceholder = "Search...",
  addButtonText = "Add New",
  exportFileName = "data",
  itemsPerPage = 10,
  
  // Features Configuration
  enableSearch = true,
  enablePagination = true,
  enableExport = true,
  enableAdd = true,
  enableEdit = true,
  enableDelete = true,
  enableView = true,
  
  // Custom Handlers
  onAdd = null,
  onEdit = null,
  onDelete = null,
  onView = null,
  onPageChange = null,
  
  // Loading State
  loading = false,
  
  // Custom Styling
  className = "",
  tableClassName = "",
  
  // Status Configuration
  statusConfig = {
    enable: false,
    field: 'status',
    colors: {
      'active': 'bg-green-100 text-green-800',
      'inactive': 'bg-red-100 text-red-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-violet-100 text-violet-800'
    },
    // Legacy support
    activeValue: 'active',
    inactiveValue: 'inactive',
    activeColor: 'green',
    inactiveColor: 'red'
  }
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(data || []);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [formLoading, setFormLoading] = useState(false);
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
  const exportDropdownRef = useRef(null);

  // Initialize form data when columns change
  useEffect(() => {
    const initialFormData = columns.reduce((acc, col) => {
      acc[col.key] = '';
      return acc;
    }, {});
    setFormData(initialFormData);
  }, [columns]);

  // Update filtered data when data changes
  useEffect(() => {
    setFilteredData(data || []);
  }, [data]);

  // Handle click outside to close export dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(event.target)) {
        setIsExportDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Helper function to show toast notifications
  const showToast = (response, defaultMessage) => {
    if (response && response.success) {
      toast.success(response.message || defaultMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      toast.error(response?.message || defaultMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  // Handle Search
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = data.filter(item =>
      Object.values(item).some(value =>
        value && value.toString().toLowerCase().includes(term)
      )
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  // Calculate total pages
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Pagination
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    if (onPageChange) {
      onPageChange(pageNumber);
    }
  };
  const getCurrentPageData = () => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  };

  // Handle input change for forms
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value) || '' : value)
    });
  };

  // Reset form
  const resetForm = () => {
    const initialFormData = columns.reduce((acc, col) => {
      acc[col.key] = '';
      return acc;
    }, {});
    setFormData(initialFormData);
  };

  // Handle view click
  const handleViewClick = (item) => {
    if (onView) {
      // If custom onView handler is provided, use it instead of opening internal modal
      onView(item);
    } else {
      // Otherwise, use internal modal
      setSelectedItem(item);
      setViewModalOpen(true);
    }
  };

  // Handle edit click
  const handleEditClick = (item) => {
    setEditItem(item);
    setFormData(item);
    setEditModalOpen(true);
  };

  // Handle delete click
  const handleDeleteClick = async (item) => {
    // If onDelete is provided, use custom handler (which should show custom modal)
    // Otherwise, use browser confirm for deleteApi
    if (onDelete) {
      await onDelete(item);
      return;
    }
    
    // Only show browser confirm if using deleteApi directly
    if (deleteApi) {
      if (!window.confirm("Are you sure you want to delete this item?")) {
        return;
      }
      
      try {
        const response = await deleteApi(item.id);
        if (response && response.success) {
          showToast(response, "Item deleted successfully!");
          // Update local data
          setFilteredData(prev => prev.filter(dataItem => dataItem.id !== item.id));
        } else {
          showToast(response, "Failed to delete item");
        }
      } catch (error) {
        console.error("Error deleting item:", error);
        toast.error("Failed to delete item");
      }
    }
  };

  // Handle form submission for add
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    
    // Validation
    const requiredFields = columns.filter(col => col.required).map(col => col.key);
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      toast.error('Please fill all required fields');
      setFormLoading(false);
      return;
    }
    
    try {
      let response;
      if (createApi) {
        response = await createApi(formData);
      } else if (onAdd) {
        response = await onAdd(formData);
      }
      
      if (response && response.success) {
        showToast(response, "Item added successfully!");
        // Add to local data
        const newItem = { id: Date.now(), ...formData };
        setFilteredData(prev => [...prev, newItem]);
        resetForm();
        setAddModalOpen(false);
      } else {
        showToast(response, "Failed to add item");
      }
    } catch (error) {
      console.error("Error adding item:", error);
      toast.error("Failed to add item. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  // Handle form submission for edit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    
    try {
      let response;
      if (updateApi) {
        response = await updateApi(editItem.id, formData);
      } else if (onEdit) {
        response = await onEdit(editItem, formData);
      }
      
      if (response && response.success) {
        showToast(response, "Item updated successfully!");
        // Update local data
        setFilteredData(prev => prev.map(dataItem => 
          dataItem.id === editItem.id ? { ...dataItem, ...formData } : dataItem
        ));
        setEditModalOpen(false);
      } else {
        showToast(response, "Failed to update item");
      }
    } catch (error) {
      console.error("Error updating item:", error);
      toast.error("Failed to update item. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  // Export functions
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text(`${title} Table`, 14, 10);

    const tableColumn = columns.map(col => col.header);
    const tableRows = filteredData.map(item => 
      columns.map(col => item[col.key] || '')
    );

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
    });

    doc.save(`${exportFileName}.pdf`);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const blob = new Blob([excelBuffer], {
      type: 'application/octet-stream',
    });
    saveAs(blob, `${exportFileName}.xlsx`);
  };

  const downloadCSV = () => {
    const headers = columns.map(col => col.header);
    const rows = filteredData.map(item => 
      columns.map(col => item[col.key] || '')
    );
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${exportFileName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Render status with view button
  const renderStatusWithView = (value) => {
    if (!statusConfig || !statusConfig.enable) return value;

    // Handle both old and new statusConfig formats
    let colorClass = 'bg-gray-100 text-gray-800';
    
    if (statusConfig.colors && statusConfig.colors[value]) {
      // New format with colors object
      colorClass = statusConfig.colors[value];
    } else if (statusConfig.activeColor && statusConfig.inactiveColor) {
      // Old format with activeColor/inactiveColor
      if (value === statusConfig.activeValue) {
        colorClass = `bg-${statusConfig.activeColor}-100 text-${statusConfig.activeColor}-800`;
      } else if (value === statusConfig.inactiveValue) {
        colorClass = `bg-${statusConfig.inactiveColor}-100 text-${statusConfig.inactiveColor}-800`;
      }
    }

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorClass}`}>
        {value}
      </span>
    );
  };

  // Render form field
  const renderFormField = (column) => {
    const { key, header, type = 'text', required = false, placeholder, options = [], min, max } = column;

    return (
      <div key={key} className="mb-4">
        <label className="block text-gray-700 mb-2 font-medium">
          {header} {required && <span className="text-red-500">*</span>}
        </label>
        
        {type === 'select' ? (
          <select
            name={key}
            value={formData[key] || ''}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent transition-all duration-200"
            required={required}
          >
            <option value="">Select {header}</option>
            {options.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : type === 'textarea' ? (
          <textarea
            name={key}
            value={formData[key] || ''}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent transition-all duration-200 resize-vertical"
            placeholder={placeholder || `Enter ${header}`}
            required={required}
            rows={3}
          />
        ) : type === 'checkbox' ? (
          <div className="flex items-center">
            <input
              type="checkbox"
              name={key}
              checked={formData[key] || false}
              onChange={handleInputChange}
              className="h-4 w-4 text-violet-600 focus:ring-violet-600 border-gray-300 rounded"
              required={required}
            />
            <label className="ml-2 block text-sm text-gray-900">
              {placeholder || `Enable ${header}`}
            </label>
          </div>
        ) : (
          <input
            type={type}
            name={key}
            value={formData[key] || ''}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent transition-all duration-200"
            placeholder={placeholder || `Enter ${header}`}
            required={required}
            min={min}
            max={max}
          />
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      <motion.div
        className={`bg-white shadow-lg backdrop-blur-md rounded-xl p-5 mb-6 relative z-1 ${className}`}
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        {/* Header and Search */}
        <div className='flex justify-between items-center mb-6'>
          <div className='flex items-center gap-6'>
            <h2 className='text-xl font-semibold text-black'>{title}</h2>

            {enableExport && (
              <div className="relative" ref={exportDropdownRef}>
                <button 
                  onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors cursor-pointer"
                >
                  <FontAwesomeIcon icon={faFilePdf} className="w-4 h-4" />
                  Export
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isExportDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[150px]">
                    <button 
                      onClick={() => {
                        downloadCSV();
                        setIsExportDropdownOpen(false);
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-gray-50 text-gray-700 rounded-t-lg cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faFileText} className="w-4 h-4 text-green-600" />
                      CSV
                    </button>
                    
                    <button 
                      onClick={() => {
                        exportToExcel();
                        setIsExportDropdownOpen(false);
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-gray-50 text-gray-700 cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faFileExcel} className="w-4 h-4 text-green-600" />
                      Excel
                    </button>
                    
                    <button 
                      onClick={() => {
                        generatePDF();
                        setIsExportDropdownOpen(false);
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-gray-50 text-gray-700 rounded-b-lg cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faFilePdf} className="w-4 h-4 text-red-600" />
                      PDF
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className='relative flex justify-between items-center gap-4' style={{width:'40%'}}>
            {enableAdd && (
              <button 
                onClick={() => {
                  if (onAdd) {
                    onAdd();
                  } else {
                    setAddModalOpen(true);
                  }
                }} 
                  className='text-violet-600 hover:text-violet-700 flex-shrink-0 cursor-pointer'
              >
                <Plus size={20} />
              </button> 
            )}
            
            {enableSearch && (
              <div className="relative flex-1 max-w-md">
                <Search className='absolute left-3 top-2.5 text-gray-400' size={20} />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  className='w-full bg-slate-100 text-black placeholder-slate-800 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-600'
                  onChange={handleSearch}
                  value={searchTerm}
                />
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className='overflow-x-auto' style={{ minHeight: '400px' }}>
          <table className={`min-w-full divide-y divide-gray-400 ${tableClassName}`}>
            <thead>
              <tr>
                {columns.map((column, index) => (
                  <th key={index} className='px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider'>
                    {column.header}
                  </th>
                ))}
                {(enableEdit || enableDelete || enableView) && (
                  <th className='px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider'>Action</th>
                )}
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-500'>
              {getCurrentPageData().map((item, index) => (
                <motion.tr
                  key={item.id || index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.1, delay: 0.2 }}
                >
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className='px-6 py-4 whitespace-nowrap'>
                      {statusConfig && column.key === statusConfig.field && statusConfig.enable ? 
                        renderStatusWithView(item[column.key]) : 
                        (column.render ? column.render(item[column.key], item, index) : (
                          <div className='text-sm text-black'>{item[column.key]}</div>
                        ))
                      }
                    </td>
                  ))}
                  {(enableEdit || enableDelete || enableView) && (
                    <td className='px-6 py-4 whitespace-nowrap'>
                      {enableView && (
                        <button onClick={() => handleViewClick(item)} className='text-green-500 hover:text-green-600 mr-3 cursor-pointer'>
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                      )}
                      {enableEdit && (
                        <button className='text-violet-600 hover:text-violet-700 mr-3 cursor-pointer' onClick={() => handleEditClick(item)}>
                          <Edit size={18} />
                        </button>
                      )}
                      {enableDelete && (
                        <button className='text-red-400 hover:text-red-300 cursor-pointer' onClick={() => handleDeleteClick(item)}>
                          <Trash2 size={18} />
                        </button>
                      )}
                    </td>
                  )}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {enablePagination && (
          <div className='flex flex-col md:flex-row justify-between mt-4 space-x-2 items-center'>
            <div className='flex items-center'>
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`text-sm px-3 py-1 border rounded-md ${currentPage === 1 ? 'text-black border-gray-600' : 'text-slate-900 border-gray-300 hover:bg-gray-300 hover:text-gray-800'}`}
              >
                <ChevronLeft size={18} />
              </button>
              <span className='mx-2 text-sm font-medium text-black'>Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`text-sm px-3 py-1 border rounded-md ${currentPage === totalPages ? 'text-black border-gray-600' : 'text-black border-gray-300 hover:bg-gray-300 hover:text-gray-800'}`}
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <div className='text-sm font-medium text-black tracking-wider mt-5 md:mt-0'>
              Total Items: {filteredData.length} | Items per page: {itemsPerPage}
            </div>
          </div>
        )}

        {/* Add Modal */}
        {isAddModalOpen && (
          <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(4px)',
            }}
          >
            <motion.div
              className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-purple-900 text-white text-lg font-semibold p-4 rounded-t-lg flex justify-between items-center">
                <span>Add New {title}</span>
                <button onClick={() => setAddModalOpen(false)} className="text-white hover:text-gray-200 transition-colors">
                  <X size={24} />
                </button>
              </div>
              <div className="p-6">
                <form onSubmit={handleAddSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {columns.map(renderFormField)}
                  </div>
                  <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setAddModalOpen(false)}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={formLoading}
                      className={`px-6 py-2 text-white rounded-lg transition-colors ${
                        formLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-900 hover:bg-purple-800'
                      }`}
                    >
                      {formLoading ? 'Adding...' : `Save`}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}

        {/* Edit Modal */}
        {isEditModalOpen && editItem && (
          <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(4px)',
            }}
          >
            <motion.div
              className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-purple-900 text-white text-lg font-semibold p-4 rounded-t-lg flex justify-between items-center">
                <span>Edit {title}</span>
                <button onClick={() => setEditModalOpen(false)} className="text-white hover:text-gray-200 transition-colors">
                  <X size={24} />
                </button>
              </div>
              <div className="p-6">
                <form onSubmit={handleEditSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {columns.map(renderFormField)}
                  </div>
                  <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setEditModalOpen(false)}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={formLoading}
                      className={`px-6 py-2 text-white rounded-lg transition-colors ${
                        formLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-900 hover:bg-purple-800'
                      }`}
                    >
                      {formLoading ? 'Updating...' : `Save`}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}

        {/* View Modal - Only show if no custom onView handler */}
        {isViewModalOpen && selectedItem && !onView && (
          <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(4px)',
            }}
          >
            <motion.div
              className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-purple-900 text-white text-lg font-semibold p-4 rounded-t-lg flex justify-between items-center">
                <span>View {title} Details</span>
                <button onClick={() => setViewModalOpen(false)} className="text-white hover:text-gray-200 transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {columns.map((column, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-1">
                          {column.header}
                        </span>
                        <span className="text-lg font-semibold text-gray-900">
                          {selectedItem[column.key] || 'N/A'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    Record ID: {selectedItem.id || 'N/A'}
                  </div>
                  <button
                    onClick={() => setViewModalOpen(false)}
                    className="px-6 py-2 bg-purple-900 text-white rounded-lg hover:bg-purple-800 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default CommonTable; 