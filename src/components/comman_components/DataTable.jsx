import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronDown, Edit, Search, Trash2, UserPlus, X, Eye, Download, Printer } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from "@fortawesome/free-solid-svg-icons";
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
  allColumns, // All columns for view modal (including hidden ones)
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
  const itemsPerPage = 5;
  const printRef = useRef();

  useEffect(() => {
    if (data) {
      setFilteredData(data);
    }
  }, [data]);

  // Close dropdown when clicking outside - handled by backdrop in JSX

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
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const getCurrentPageData = () => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  };

  // Handle view click
  const handleViewClick = (item) => {
    setSelectedItem(item);
    setViewModalOpen(true);
    if (onView) onView(item);
  };

  // Handle edit click
  const handleEditClick = (item) => {
    setEditItem(item);
    setEditModalOpen(true);
  };

  // Handle delete click
  const handleDeleteClick = (item) => {
    setDeleteItem(item);
    setDeleteModalOpen(true);
  };

  // Confirm delete
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

  // Print view form
  const handlePrintView = () => {
    const printContent = printRef.current;
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  // Download view form as PDF
  const handleDownloadViewPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(`${title} Details`, pageWidth / 2, 20, { align: 'center' });
    
    // Line separator
    doc.setLineWidth(0.5);
    doc.line(20, 25, pageWidth - 20, 25);
    
    let yPosition = 40;
    
    // Add item details - use allColumns if available
    const columnsToUse = allColumns || columns;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    columnsToUse.forEach((column) => {
      if (yPosition > 270) { // Start new page if needed
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
    
    // Footer
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, doc.internal.pageSize.height - 10);
    
    doc.save(`${title}_${selectedItem.id || 'details'}.pdf`);
  };

  // Export functions
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(`${title} Report`, 14, 15);
    
    // Use allColumns if available, otherwise fallback to columns
    const columnsToUse = allColumns || columns;
    
    // Add generation info
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 25);
    doc.text(`Total Records: ${filteredData.length}`, 14, 32);

    const tableColumn = columnsToUse.map(col => col.header);
    const tableRows = filteredData.map(item => 
      columnsToUse.map(col => {
        const value = item[col.key];
        // Handle different data types
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
    // Use allColumns if available, otherwise fallback to columns
    const columnsToUse = allColumns || columns;
    
    // Create data with formatted values
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
    // Use allColumns if available, otherwise fallback to columns
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

  // Handle export with selected format
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
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      <style jsx>{`
        @media print {
          .print-content {
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 20px !important;
            font-size: 12pt !important;
            line-height: 1.5 !important;
          }
          
          .print-content * {
            background: white !important;
            color: black !important;
            box-shadow: none !important;
            border-color: black !important;
          }
          
          .print-content .bg-gradient-to-r,
          .print-content .bg-gradient-to-br {
            background: white !important;
            border: 2px solid black !important;
          }
          
          .print-content .text-indigo-500 {
            color: black !important;
          }
          
          @page {
            margin: 1in;
            size: A4;
          }
        }
      `}</style>
      <ToastContainer />
      <motion.div
        className='bg-white shadow-lg backdrop-blur-md rounded-xl p-5 mb-6 relative z-1'
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        {/* Header and Search - Responsive Layout */}
        <div className='flex flex-col lg:flex-row gap-4 mb-6'>
          {/* Left Side: Title and Export */}
          <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1'>
            <h2 className='text-xl font-semibold text-black whitespace-nowrap'>{title}</h2>

            <div className="relative w-full sm:w-auto">
              <button 
                className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors duration-200 cursor-pointer w-full sm:w-auto justify-center"
                onClick={() => setExportDropdownOpen(!isExportDropdownOpen)}
                title="Export Data"
              >
                <Download size={16} />
                <span className="hidden sm:inline">Export</span>
                <ChevronDown size={16} className={`transition-transform duration-200 ${isExportDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isExportDropdownOpen && (
                <>
                  {/* Backdrop to close on outside click */}
                  <div 
                    className="fixed inset-0 z-[9998]" 
                    onClick={() => setExportDropdownOpen(false)}
                  />
                  <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-[9999] min-w-[150px]">
                    <button 
                      onClick={() => handleExport('pdf')}
                      className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 cursor-pointer border-b border-gray-100"
                    >
                      <FontAwesomeIcon icon={faFilePdf} className="text-red-500" />
                      <span className="text-gray-700">PDF</span>
                    </button>
                    
                    <button 
                      onClick={() => handleExport('excel')}
                      className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 cursor-pointer border-b border-gray-100"
                    >
                      <FontAwesomeIcon icon={faFileExcel} className="text-green-500" />
                      <span className="text-gray-700">Excel</span>
                    </button>
                    
                    <button 
                      onClick={() => handleExport('csv')}
                      className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 cursor-pointer rounded-b-lg"
                    >
                      <FontAwesomeIcon icon={faFileText} className="text-violet-600" />
                      <span className="text-gray-700">CSV</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Side: Search Bar and Add Button */}
          <div className='flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full lg:w-auto lg:flex-1 lg:max-w-2xl'>
            {/* Search Bar - First */}
            <div className="relative group flex-1">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-violet-600 rounded-xl opacity-0 group-focus-within:opacity-20 transition-opacity duration-300 blur-sm"></div>
              <div className="relative bg-white rounded-xl shadow-lg border border-gray-200 group-focus-within:border-violet-400 transition-all duration-300 group-focus-within:shadow-xl">
                <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-violet-600 transition-colors duration-300' size={20} />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  className='w-full bg-transparent text-gray-700 placeholder-gray-400 rounded-xl pl-12 pr-10 py-3 focus:outline-none font-medium'
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
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors duration-200 p-1 rounded-full hover:bg-red-50"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              {searchTerm && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-10">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium text-violet-600">{filteredData.length}</span> results found for 
                    <span className="font-medium text-gray-800 ml-1">"{searchTerm}"</span>
                  </div>
                </div>
              )}
            </div>

            {/* Add Button - Second with name and icon */}
            {onAdd && (
              <button 
                onClick={() => setAddModalOpen(true)} 
                className='group flex items-center justify-center gap-2 px-4 py-3 text-violet-600 hover:text-violet-700 cursor-pointer rounded-lg bg-violet-50 hover:bg-violet-100 transition-all duration-300 shadow-sm hover:shadow-md whitespace-nowrap'
                title={addButtonText}
              >
                <UserPlus size={20} className="transition-transform duration-200 group-hover:scale-110" />
                <span className="font-medium hidden sm:inline">{addButtonText}</span>
                <span className="font-medium sm:hidden">Add</span>
              </button>
            )}
          </div>
        </div>

        {/* Table - Responsive */}
        <div className='overflow-x-auto' style={{ minHeight: '400px' }}>
          <div className="inline-block min-w-full align-middle">
            <table className='min-w-full divide-y divide-gray-400'>
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((column, index) => (
                    <th key={index} className='px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-black uppercase tracking-wider'>
                      {column.header}
                    </th>
                  ))}
                  <th className='px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-black uppercase tracking-wider'>Action</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-500 bg-white'>
                {getCurrentPageData().map((item, index) => (
                  <motion.tr
                    key={item.id || index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.1, delay: 0.2 }}
                    className="hover:bg-gray-50"
                  >
                    {columns.map((column, colIndex) => (
                      <td key={colIndex} className='px-3 sm:px-6 py-4 whitespace-nowrap'>
                        {column.render ? column.render(item[column.key], item) : (
                          <div className='text-xs sm:text-sm text-black'>{item[column.key] || 'N/A'}</div>
                        )}
                      </td>
                    ))}
                    <td className='px-3 sm:px-6 py-4 whitespace-nowrap'>
                      <div className="flex items-center gap-2">
                        {onView && (
                          <button onClick={() => handleViewClick(item)} className='text-violet-600 hover:text-violet-700 cursor-pointer p-1 rounded hover:bg-violet-50 transition-colors' title="View">
                            <FontAwesomeIcon icon={faEye} />
                          </button>
                        )}
                        {onEdit && (
                          <button className='text-violet-600 hover:text-violet-700 cursor-pointer p-1 rounded hover:bg-violet-50 transition-colors' onClick={() => handleEditClick(item)} title="Edit">
                            <Edit size={18} />
                          </button>
                        )}
                        {onDelete && (
                          <button className='text-red-400 hover:text-red-500 cursor-pointer p-1 rounded hover:bg-red-50 transition-colors' onClick={() => handleDeleteClick(item)} title="Delete">
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* PAGINATION */}
        <div className='flex flex-col md:flex-row justify-between mt-4 space-x-2 items-center'>
          <div className='flex items-center'>
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`text-sm px-3 py-1 border rounded-md cursor-pointer ${currentPage === 1 ? 'text-black border-gray-600' : 'text-slate-900 border-gray-300 hover:bg-gray-300 hover:text-gray-800'}`}
            >
              <ChevronLeft size={18} />
            </button>
            <span className='mx-2 text-sm font-medium text-black'>Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`text-sm px-3 py-1 border rounded-md cursor-pointer ${currentPage === totalPages ? 'text-black border-gray-600' : 'text-black border-gray-300 hover:bg-gray-300 hover:text-gray-800'}`}
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className='text-sm font-medium text-black tracking-wider mt-5 md:mt-0'>
            Total Items: {filteredData.length}
          </div>
        </div>

        {/* Add Modal */}
        {isAddModalOpen && onAdd && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => setAddModalOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl p-6 w-full max-w-3xl shadow-2xl border border-slate-200 max-h-[85vh] overflow-hidden mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center">
                    <UserPlus className="w-5 h-5 text-violet-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Add New {title}</h3>
                </div>
                <button 
                  onClick={() => setAddModalOpen(false)} 
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors duration-200 cursor-pointer"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 overflow-y-auto max-h-[calc(85vh-120px)]">
                {onAdd({ onClose: () => setAddModalOpen(false) })}
              </div>
            </motion.div>
          </div>
        )}

        {/* Edit Modal */}
        {isEditModalOpen && editItem && onEdit && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => setEditModalOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl p-6 w-full max-w-3xl shadow-2xl border border-violet-200 max-h-[85vh] overflow-hidden mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center">
                    <Edit className="w-5 h-5 text-violet-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Edit {title}</h3>
                </div>
                <button 
                  onClick={() => setEditModalOpen(false)} 
                  className="p-2 hover:bg-violet-100 rounded-full transition-colors duration-200 cursor-pointer"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 overflow-y-auto max-h-[calc(85vh-120px)]">
                {onEdit({ item: editItem, onClose: () => setEditModalOpen(false) })}
              </div>
            </motion.div>
          </div>
        )}

        {/* View Modal */}
        {isViewModalOpen && selectedItem && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => setViewModalOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl border border-gray-200 max-h-[90vh] overflow-hidden mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-violet-600 to-violet-500 p-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <Eye className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{title} Details</h3>
                      <p className="text-violet-100">ID: {selectedItem.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={handleDownloadViewPDF}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors duration-200 text-white cursor-pointer"
                      title="Download PDF"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={handlePrintView}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors duration-200 text-white cursor-pointer"
                      title="Print"
                    >
                      <Printer className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => setViewModalOpen(false)} 
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors duration-200 cursor-pointer"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div ref={printRef} className="print-content">
                  {/* Template Header for Print */}
                  <div className="hidden print:block mb-8">
                    <div className="text-center border-b-2 border-gray-300 pb-4">
                      <h1 className="text-3xl font-bold text-gray-800">{title} Details</h1>
                      <p className="text-gray-600 mt-2">Generated on {new Date().toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Professional Template Layout */}
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-gray-100 to-gray-50 p-6 border-b border-gray-200">
                      <h4 className="text-xl font-bold text-gray-800 mb-2">{title} Information</h4>
                      <div className="w-20 h-1 bg-violet-500 rounded"></div>
                    </div>

                    {/* Details Grid */}
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {(allColumns || columns).map((column, index) => (
                          <div key={index} className="group">
                            <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-indigo-300 transition-colors duration-200 hover:shadow-md">
                              <label className="block text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wider">
                                {column.header}
                              </label>
                              <div className="text-gray-800 font-medium">
                                {column.render && selectedItem[column.key] ? 
                                  <div dangerouslySetInnerHTML={{
                                    __html: typeof column.render(selectedItem[column.key], selectedItem) === 'object' ? 
                                      selectedItem[column.key] : column.render(selectedItem[column.key], selectedItem)
                                  }} />
                                  : (selectedItem[column.key] || 'N/A')
                                }
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Footer Section */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-t border-gray-200">
                      <div className="flex justify-between items-center text-sm text-gray-600">
                        <div>
                          <p className="font-medium">Created: {selectedItem.createdAt ? new Date(selectedItem.createdAt).toLocaleDateString() : 'N/A'}</p>
                        </div>
                        <div>
                          <p className="font-medium">Last Updated: {selectedItem.updatedAt ? new Date(selectedItem.updatedAt).toLocaleDateString() : 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && deleteItem && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setDeleteModalOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Delete {title}</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this {title.toLowerCase()}? This action cannot be undone.
                </p>
                <div className="flex justify-center space-x-3">
                  <button
                    onClick={() => setDeleteModalOpen(false)}
                    className="px-6 py-2 border-2 border-violet-300 rounded-lg text-violet-700 hover:bg-violet-50 transition-colors duration-200 font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-colors duration-200 cursor-pointer"
                  >
                    Delete
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

export default DataTable; 