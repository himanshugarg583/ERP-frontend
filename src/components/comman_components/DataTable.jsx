import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, ChevronDown, Edit, Search, Trash2, UserPlus, X, Eye, Download, Printer } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel, faFilePdf, faFileText } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DataTable = ({
  title,
  data,
  columns,
  allColumns,
  onAdd,
  onEdit,
  onDelete,
  onView,
  loading = false,
  searchPlaceholder = "Search...",
  exportFileName = "data",
  addButtonText = "Add New"
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(data || []);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isExportDropdownOpen, setExportDropdownOpen] = useState(false);
  const itemsPerPage = 10;
  const printRef = useRef();
  const exportDropdownRef = useRef(null);

  useEffect(() => {
    if (data) {
      setFilteredData(data);
    }
  }, [data]);

  // Close export dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(event.target)) {
        setExportDropdownOpen(false);
      }
    };

    if (isExportDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isExportDropdownOpen]);

  // Handle body overflow for modals
  useEffect(() => {
    if (isAddModalOpen || isEditModalOpen || isViewModalOpen || isDeleteModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isAddModalOpen, isEditModalOpen, isViewModalOpen, isDeleteModalOpen]);

  // Handle Escape key to close modals
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        if (isViewModalOpen) setViewModalOpen(false);
        if (isEditModalOpen) setEditModalOpen(false);
        if (isAddModalOpen) setAddModalOpen(false);
        if (isDeleteModalOpen) setDeleteModalOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isViewModalOpen, isEditModalOpen, isAddModalOpen, isDeleteModalOpen]);

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

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const getCurrentPageData = () => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  };

  const handleViewClick = (item) => {
    setSelectedItem(item);
    setViewModalOpen(true);
    if (onView) onView(item);
  };

  const handleEditClick = (item) => {
    setEditItem(item);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (item) => {
    setDeleteItem(item);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteItem || !onDelete) return;
    try {
      await onDelete(deleteItem);
      setDeleteModalOpen(false);
      setDeleteItem(null);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error("Failed to delete item");
    }
  };

  const handlePrintView = () => {
    const printContent = printRef.current;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  const handleDownloadViewPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(`${title} Details`, pageWidth / 2, 20, { align: 'center' });
    doc.setLineWidth(0.5);
    doc.line(20, 25, pageWidth - 20, 25);

    let yPosition = 40;
    const columnsToUse = allColumns || columns;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');

    columnsToUse.forEach((column) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      const value = selectedItem[column.key];
      let displayValue = 'N/A';
      if (value) {
        if (column.type === 'date') {
          try {
            displayValue = new Date(value).toLocaleDateString('en-GB');
          } catch {
            displayValue = value;
          }
        } else {
          displayValue = String(value);
        }
      }
      doc.setFont('helvetica', 'bold');
      doc.text(`${column.header}:`, 20, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text(displayValue, 80, yPosition);
      yPosition += 15;
    });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, doc.internal.pageSize.height - 10);
    doc.save(`${title}_${selectedItem.id || 'details'}.pdf`);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(`${title} Report`, 14, 15);
    const columnsToUse = allColumns || columns;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 25);
    doc.text(`Total Records: ${filteredData.length}`, 14, 32);

    const tableColumn = columnsToUse.map(col => col.header);
    const tableRows = filteredData.map(item =>
      columnsToUse.map(col => {
        const value = item[col.key];
        if (col.type === 'date' && value) {
          try {
            return new Date(value).toLocaleDateString('en-GB');
          } catch {
            return value || '';
          }
        }
        return value || '';
      })
    );

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [124, 58, 237] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    doc.save(`${exportFileName}.pdf`);
  };

  const exportToExcel = () => {
    const columnsToUse = allColumns || columns;
    const excelData = filteredData.map(item => {
      const row = {};
      columnsToUse.forEach(col => {
        const value = item[col.key];
        if (col.type === 'date' && value) {
          try {
            row[col.header] = new Date(value).toLocaleDateString('en-GB');
          } catch {
            row[col.header] = value || '';
          }
        } else {
          row[col.header] = value || '';
        }
      });
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `${exportFileName}.xlsx`);
  };

  const downloadCSV = () => {
    const columnsToUse = allColumns || columns;
    const headers = columnsToUse.map(col => col.header);
    const rows = filteredData.map(item =>
      columnsToUse.map(col => {
        const value = item[col.key];
        if (col.type === 'date' && value) {
          try {
            return new Date(value).toLocaleDateString('en-GB');
          } catch {
            return value || '';
          }
        }
        return value || '';
      })
    );

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${exportFileName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExport = (format) => {
    setExportDropdownOpen(false);
    switch (format) {
      case 'pdf':
        generatePDF();
        break;
      case 'excel':
        exportToExcel();
        break;
      case 'csv':
        downloadCSV();
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      <div className='bg-white shadow-md rounded-lg border border-gray-200 p-4 sm:p-6'>
        {/* Header and Search - Responsive Layout */}
        <div className='flex flex-col lg:flex-row gap-4 mb-6'>
          {/* Left Side: Title and Export */}
          <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1'>
            <h2 className='text-lg sm:text-xl font-semibold text-gray-900 whitespace-nowrap'>{title}</h2>

            <div className="relative w-full sm:w-auto" ref={exportDropdownRef}>
              <button
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors duration-200 cursor-pointer w-full sm:w-auto justify-center text-sm sm:text-base"
                onClick={() => setExportDropdownOpen(!isExportDropdownOpen)}
                title="Export Data"
              >
                <Download size={16} />
                <span className="hidden sm:inline">Export</span>
                <ChevronDown size={16} className={`transition-transform duration-200 ${isExportDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isExportDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] min-w-[150px]">
                  <button
                    onClick={() => handleExport('pdf')}
                    className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 cursor-pointer border-b border-gray-100 first:rounded-t-lg"
                  >
                    <FontAwesomeIcon icon={faFilePdf} className="text-red-500" />
                    <span className="text-gray-700 text-sm">PDF</span>
                  </button>

                  <button
                    onClick={() => handleExport('excel')}
                    className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 cursor-pointer border-b border-gray-100"
                  >
                    <FontAwesomeIcon icon={faFileExcel} className="text-green-500" />
                    <span className="text-gray-700 text-sm">Excel</span>
                  </button>

                  <button
                    onClick={() => handleExport('csv')}
                    className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 cursor-pointer rounded-b-lg"
                  >
                    <FontAwesomeIcon icon={faFileText} className="text-violet-600" />
                    <span className="text-gray-700 text-sm">CSV</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Search Bar and Add Button */}
          <div className='flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full lg:w-auto lg:flex-1 lg:max-w-2xl'>
            {/* Search Bar - First */}
            <div className="relative group flex-1">
              <div className="relative bg-white rounded-lg border border-gray-300 group-focus-within:border-violet-500 transition-all duration-200">
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-violet-600 transition-colors duration-200' size={18} />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  className='w-full bg-transparent text-gray-700 placeholder-gray-400 rounded-lg pl-10 pr-8 py-2.5 text-sm focus:outline-none'
                  onChange={handleSearch}
                  value={searchTerm}
                />
                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setFilteredData(data);
                      setCurrentPage(1);
                    }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors duration-200 p-1 rounded hover:bg-red-50"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Add Button - Second with name and icon */}
            {onAdd && (
              <button
                onClick={() => setAddModalOpen(true)}
                className='flex items-center justify-center gap-2 px-4 py-2.5 text-white bg-violet-600 hover:bg-violet-700 cursor-pointer rounded-lg transition-all duration-200 shadow-sm hover:shadow-md whitespace-nowrap text-sm sm:text-base'
                title={addButtonText}
              >
                <UserPlus size={18} />
                <span className="font-medium hidden sm:inline">{addButtonText}</span>
                <span className="font-medium sm:hidden">Add</span>
              </button>
            )}
          </div>
        </div>

        {/* Table - Responsive */}
        <div className='overflow-x-auto -mx-4 sm:mx-0'>
          <div className="inline-block min-w-full align-middle">
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((column, index) => (
                    <th key={index} className='px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wider'>
                      {column.header}
                    </th>
                  ))}
                  {(onView || onEdit || onDelete) && (
                    <th className='px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wider'>Action</th>
                  )}
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {getCurrentPageData().length > 0 ? (
                  getCurrentPageData().map((item, index) => (
                    <tr key={item.id || index} className="hover:bg-gray-50 transition-colors">
                      {columns.map((column, colIndex) => (
                        <td key={colIndex} className='px-3 sm:px-6 py-4 whitespace-nowrap'>
                          {column.render ? column.render(item[column.key], item) : (
                            <div className='text-xs sm:text-sm text-gray-900'>{item[column.key] || 'N/A'}</div>
                          )}
                        </td>
                      ))}
                      {(onView || onEdit || onDelete) && (
                        <td className='px-3 sm:px-6 py-4 whitespace-nowrap'>
                          <div className="flex items-center gap-2">
                            {onView && (
                              <button onClick={() => handleViewClick(item)} className='text-violet-600 hover:text-violet-700 cursor-pointer p-1.5 rounded hover:bg-violet-50 transition-colors' title="View">
                                <Eye size={16} />
                              </button>
                            )}
                            {onEdit && (
                              <button className='text-violet-600 hover:text-violet-700 cursor-pointer p-1.5 rounded hover:bg-violet-50 transition-colors' onClick={() => handleEditClick(item)} title="Edit">
                                <Edit size={16} />
                              </button>
                            )}
                            {onDelete && (
                              <button className='text-red-500 hover:text-red-600 cursor-pointer p-1.5 rounded hover:bg-red-50 transition-colors' onClick={() => handleDeleteClick(item)} title="Delete">
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length + ((onView || onEdit || onDelete) ? 1 : 0)} className="px-6 py-8 text-center text-gray-500">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PAGINATION */}
        <div className='flex flex-col sm:flex-row justify-between items-center mt-6 gap-4'>
          <div className='flex items-center gap-2'>
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1.5 text-sm border rounded-md transition-colors ${currentPage === 1
                  ? 'text-gray-400 border-gray-300 cursor-not-allowed'
                  : 'text-gray-700 border-gray-300 hover:bg-gray-100 cursor-pointer'
                }`}
            >
              <ChevronLeft size={18} />
            </button>
            <span className='mx-2 text-sm font-medium text-gray-700'>
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1.5 text-sm border rounded-md transition-colors ${currentPage === totalPages
                  ? 'text-gray-400 border-gray-300 cursor-not-allowed'
                  : 'text-gray-700 border-gray-300 hover:bg-gray-100 cursor-pointer'
                }`}
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className='text-sm font-medium text-gray-700'>
            Total Items: {filteredData.length}
          </div>
        </div>
      </div>

      {/* Full Page Modals */}
      {/* Add Modal */}
      {isAddModalOpen && onAdd && createPortal(
        <div className="fixed inset-0 z-[9998] bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex-shrink-0 border-b border-gray-200 bg-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-violet-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">Add New {title}</h3>
              </div>
              <button
                onClick={() => setAddModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {onAdd({ onClose: () => setAddModalOpen(false) })}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editItem && onEdit && createPortal(
        <div className="fixed inset-0 z-[9998] bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex-shrink-0 border-b border-gray-200 bg-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center">
                  <Edit className="w-5 h-5 text-violet-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">Edit {title}</h3>
              </div>
              <button
                onClick={() => setEditModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {onEdit({ item: editItem, onClose: () => setEditModalOpen(false) })}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* View Modal */}
      {isViewModalOpen && selectedItem && createPortal(
        <div className="fixed inset-0 z-[9998] bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden" ref={printRef}>
            {/* Modal Header */}
            <div className="flex-shrink-0 bg-gradient-to-r from-violet-600 to-violet-700 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">{title} Details</h3>
                  <p className="text-violet-100 text-xs sm:text-sm">ID: {selectedItem.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadViewPDF}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors duration-200 text-white cursor-pointer"
                  title="Download PDF"
                >
                  <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={handlePrintView}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors duration-200 text-white cursor-pointer"
                  title="Print"
                >
                  <Printer className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={() => setViewModalOpen(false)}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors duration-200 cursor-pointer"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </button>
              </div>
            </div>
            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 bg-white">
              <div className="space-y-4">
                {(allColumns || columns).map((column, index) => (
                  <div key={index} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-1">
                        <label className="block text-sm font-semibold text-gray-700">
                          {column.header}
                        </label>
                      </div>
                      <div className="md:col-span-2">
                        <div className="text-sm text-gray-900">
                          {column.render && selectedItem[column.key] ?
                            (typeof column.render(selectedItem[column.key], selectedItem) === 'string' ?
                              column.render(selectedItem[column.key], selectedItem) :
                              String(selectedItem[column.key])
                            ) :
                            (selectedItem[column.key] || 'N/A')
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && deleteItem && createPortal(
        <div className="fixed inset-0 z-[9998] bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6 sm:p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete {title}</h3>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">
                Are you sure you want to delete this {title.toLowerCase()}? This action cannot be undone.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="px-6 py-2.5 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium cursor-pointer text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-6 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors duration-200 cursor-pointer text-sm sm:text-base"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default DataTable;
