import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Edit, Search, Trash2, X, ChevronLeft, ChevronRight, UserPlus, Printer, AlertTriangle } from 'lucide-react';
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint,faCoffee,faUser,faLanguage,faFileExcel,faFilePdf,faFileText} from '@fortawesome/free-solid-svg-icons';
import ReactModal from "react-modal";
import { getAllExpense, updateExpense, deleteExpense } from '../../helper/requests-method/apiMethods';
import { toast } from 'react-toastify';

const Receipt = ({ isOpen, onClose, receiptData }) => {
  const printReceipt = () => {
    const printContent = document.getElementById("receipt-print").innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent; 
    window.print(); // Open print dialog
    document.body.innerHTML = originalContent; // Restore original content
    window.location.reload(); // Reload to prevent broken UI
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Receipt"
      appElement={document.getElementById("root")}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1000,
        },
        content: {
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          margin: "0 auto",
          padding: "10px",
          position: "absolute",
          top: "0",
        },
      }}
    >
      {/* This div contains only the receipt for printing */}
      <div id="receipt-print">
        <div className="w-[768px] bg-white rounded-md shadow-lg overflow-hidden m-auto">
          <div className="bg-purple-900 text-white p-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Expense Receipt</h2>
            <button className="text-white text-xl hover:text-gray-300 transition-colors duration-300" onClick={onClose}>
              <X size={22} />
            </button>
          </div>

          <div className="p-6 border border-gray-200 m-4 relative">
            <div className="absolute right-3 top-3">
              <button className="text-gray-600 hover:text-gray-900 transition-colors duration-300" onClick={printReceipt}>
                <Printer size={20} />
              </button>
            </div>

            <div className="flex items-center mb-6">
              <div className="mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="100" height="40" viewBox="0 0 100 40" className="h-16 w-32">
                  <g>
                    <path d="M30,20 Q40,10 30,5 Q20,0 30,10 Q40,20 30,25 Q20,30 30,20" fill="#e91e63" />
                    <text x="40" y="25" fontWeight="bold" fontSize="18">
                      <tspan fill="#e91e63">E</tspan>
                      <tspan fill="#3f51b5">D</tspan>
                      <tspan fill="#4caf50">U</tspan>
                      <tspan fill="#ff9800">V</tspan>
                      <tspan fill="#e91e63">E</tspan>
                      <tspan fill="#3f51b5">R</tspan>
                      <tspan fill="#4caf50">C</tspan>
                      <tspan fill="#ff9800">E</tspan>
                    </text>
                  </g>
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Eduverse Smart School Management Software</h1>
                <p className="text-gray-600">19-K-4, Jyoti Nagar, Jaipur</p>
                <p className="text-gray-600">7073873731</p>
              </div>
            </div>

            <div className="flex justify-center mb-6">
              <button className="py-2 px-10 rounded-full transition-all duration-300 transform hover:scale-105 bg-red-500 hover:bg-red-600 text-white">
                Expense Receipt
              </button>
            </div>

            <div className="flex justify-end mb-4">
              <p className="text-gray-700"><span className="font-medium">Entry Date :</span> {receiptData?.entry_date ? new Date(receiptData.entry_date).toLocaleDateString() : '-'}</p>
            </div>

            <div className="border border-gray-300">
              <div className="grid grid-cols-2">
                <div className="border-b border-r border-gray-300 p-3">
                  <p><span className="font-medium">Category :</span> {receiptData?.category || '-'}</p>
                </div>
                <div className="border-b border-gray-300 p-3">
                  <p><span className="font-medium">Sub Category :</span> {receiptData?.sub_category || '-'}</p>
                </div>
                <div className="border-b border-r border-gray-300 p-3">
                  <p><span className="font-medium">Amount :</span> ₹{receiptData?.amount ? parseFloat(receiptData.amount).toFixed(2) : '0.00'}</p>
                </div>
                <div className="border-b border-gray-300 p-3">
                  <p><span className="font-medium">Payment Mode :</span> {receiptData?.payment_mode ? receiptData.payment_mode.charAt(0).toUpperCase() + receiptData.payment_mode.slice(1) : '-'}</p>
                </div>
                <div className="border-b border-r border-gray-300 p-3">
                  <p><span className="font-medium">Transaction Reference :</span> {receiptData?.transaction_ref || '-'}</p>
                </div>
                <div className="border-b border-gray-300 p-3">
                  <p><span className="font-medium">Recorded By :</span> {receiptData?.recorded_by || '-'}</p>
                </div>
                {receiptData?.created_at && (
                  <div className="border-b border-r border-gray-300 p-3">
                    <p><span className="font-medium">Created At :</span> {new Date(receiptData.created_at).toLocaleString()}</p>
                  </div>
                )}
                {receiptData?.description && (
                  <div className="col-span-2 border-b border-gray-300 p-3">
                    <p><span className="font-medium">Description :</span> {receiptData.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ReactModal>
  );
};


const ExpenseTable = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [expenseData, setExpenseData] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedReceipt, setSelectedReceipt] = useState(null);
    const [editProduct, setEditProduct] = useState(null);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    

    const fetchExpenseData = async () => {
      try {
        setIsLoading(true);
        const response = await getAllExpense();
        if (response.success && response.data && response.data.expenses) {
          setExpenseData(response.data.expenses);
          setFilteredProducts(response.data.expenses);
        } else {
          toast.error('Failed to fetch expense data');
          setExpenseData([]);
          setFilteredProducts([]);
        }
      } catch (error) {
        console.error('Error fetching expense data:', error);
        toast.error(error.response?.data?.message || 'Error fetching expense data');
        setExpenseData([]);
        setFilteredProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    useEffect(() => {
      fetchExpenseData();
      // Listen for refresh event from ExpenseForm
      const handleExpenseAdded = () => {
        fetchExpenseData();
      };
      window.addEventListener('expenseAdded', handleExpenseAdded);
      return () => {
        window.removeEventListener('expenseAdded', handleExpenseAdded);
      };
    }, []);

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const SearchHandler = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = expenseData.filter(item =>
            item.category?.toLowerCase().includes(term) ||
            item.sub_category?.toLowerCase().includes(term) ||
            item.recorded_by?.toLowerCase().includes(term) ||
            item.transaction_ref?.toLowerCase().includes(term) ||
            item.description?.toLowerCase().includes(term)
        );
        setFilteredProducts(filtered);
        setCurrentPage(1);
    };

    const handleEdit = (item) => {
        setEditProduct({ ...item });
        setEditModalOpen(true);
    };

    const handleDeleteClick = (item) => {
        setItemToDelete(item);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!itemToDelete) return;
        
        try {
            const response = await deleteExpense(itemToDelete.id);
            if (response.success || response.message) {
                toast.success(response.message || 'Expense deleted successfully');
                setIsDeleteModalOpen(false);
                setItemToDelete(null);
                fetchExpenseData(); // Refresh data
            } else {
                toast.error('Failed to delete expense');
            }
        } catch (error) {
            console.error('Error deleting expense:', error);
            toast.error(error.response?.data?.message || 'Error deleting expense');
        }
    };

    const handleDeleteCancel = () => {
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
    };

    const handleSave = async () => {
        try {
            const payload = {
                category: editProduct.category,
                sub_category: editProduct.sub_category,
                amount: parseFloat(editProduct.amount),
                payment_mode: editProduct.payment_mode,
                transaction_ref: editProduct.transaction_ref || '',
                description: editProduct.description || '',
                entry_date: editProduct.entry_date,
                recorded_by: editProduct.recorded_by,
            };

            const response = await updateExpense(editProduct.id, payload);
            
            if (response.success || response.message) {
                toast.success(response.message || 'Expense updated successfully');
                setEditModalOpen(false);
                fetchExpenseData(); // Refresh data
            } else {
                toast.error('Failed to update expense');
            }
        } catch (error) {
            console.error('Error updating expense:', error);
            toast.error(error.response?.data?.message || 'Error updating expense');
        }
    };

      // view handle click
      const handleViewClick = (data) => {
        setSelectedReceipt(data);
        setIsModalOpen(true);
      };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const getCurrentPageProducts = () => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredProducts.slice(start, start + itemsPerPage);
    };

    return (
        <motion.div
            className='bg-white shadow-sm border border-slate-200 rounded-xl p-5 mb-6 relative z-1'
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.2 }}
        >
    <div className=''>        

            <div className='flex justify-between items-center mb-6'>
                <div className='flex items-center gap-6'>
                <h2 className='text-xl font-semibold text-black'>Expense List</h2>
                  <div class="row text-black">
                        <div class="dt-buttons btn-group flex gap-2">
                            <button class="btn btn-primary buttons-copy buttons-html5" tabindex="0" aria-controls="main_datatable" type="button" title="Copy">
                            <FontAwesomeIcon icon={faPrint} />
                               </button>
                            <button class="btn btn-primary buttons-excel buttons-html5" tabindex="0" aria-controls="main_datatable" type="button" title="Excel">
                             <FontAwesomeIcon icon={faFileExcel} />
                                </button>
                            <button class="btn btn-primary buttons-csv buttons-html5" tabindex="0" aria-controls="main_datatable" type="button" title="CSV">
                             <FontAwesomeIcon icon={faFileText} />
                             </button>
                            <button class="btn btn-primary buttons-pdf buttons-html5" tabindex="0" aria-controls="main_datatable" type="button" title="PDF">
                             <FontAwesomeIcon icon={faFilePdf} />
                             </button>
                             <button class="btn btn-primary buttons-collection dropdown-toggle buttons-colvis" tabindex="0" aria-controls="main_datatable" type="button" aria-haspopup="true">
                                <span>downloads</span>
                            </button> 
                            </div>
                </div>
                </div>
                
                <div className='relative flex items-center'>
                    <Search className='absolute left-3 text-black sm:left-2.5 top-2.5' size={20} />
                    <input
                        type="text"
                        placeholder='Search by category, sub category, transaction ref...'
                        className=' text-black placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-violet-600'
                        onChange={SearchHandler}
                        value={searchTerm}
                    />
                </div>
            </div>

            <div className='overflow-x-auto' style={{height:"100vh"}}>
                {isLoading ? (
                    <div className='flex justify-center items-center py-10'>
                        <p className='text-gray-600'>Loading...</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className='flex justify-center items-center py-10'>
                        <p className='text-gray-600'>No expense entries found</p>
                    </div>
                ) : (
                    <table className='min-w-full divide-y divide-gray-400' >
                        <thead>
                            <tr>
                                <th className='px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider'>Category</th>
                                <th className='px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider'>Sub Category</th>
                                <th className='px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider'>Amount</th>
                                <th className='px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider'>Payment Mode</th>
                                <th className='px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider'>Transaction Ref</th>
                                <th className='px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider'>Date</th>
                                <th className='px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider'>Recorded By</th>
                                <th className='px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider'>Actions</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-500'>
                            {getCurrentPageProducts().map((item) => (
                                <motion.tr
                                    key={item.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 1.1, delay: 0.2 }}
                                >
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-black font-medium'>{item.category || '-'}</td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-black'>{item.sub_category || '-'}</td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-black font-semibold'>
                                        ₹{parseFloat(item.amount || 0).toFixed(2)}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-black'>
                                        {item.payment_mode ? item.payment_mode.charAt(0).toUpperCase() + item.payment_mode.slice(1) : '-'}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-black'>{item.transaction_ref || '-'}</td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-black'>
                                        {item.entry_date ? new Date(item.entry_date).toLocaleDateString() : '-'}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-black'>{item.recorded_by || '-'}</td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium h-full'>
                                        <div className='flex items-center gap-4 h-full'>
                                            <button onClick={() => handleViewClick(item)} className='text-green-500 hover:text-green-600'>
                                                <FontAwesomeIcon icon={faEye} />
                                            </button>
                                            <button onClick={() => handleEdit(item)} className='text-violet-600 hover:text-violet-700'>
                                                <Edit size={18} />
                                            </button>
                                            <button onClick={() => handleDeleteClick(item)} className='text-red-500 hover:text-red-700'>
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Enhanced Pagination Controls */}
            <div className='flex flex-col md:flex-row justify-between mt-4 space-x-2 items-center'>
                <div className='flex items-center'>
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`text-sm px-3 py-1 border rounded-md ${currentPage === 1 ? 'text-black border-gray-600' : 'text-gray-100 border-gray-300 hover:bg-gray-300 hover:text-black'}`}
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <span className='mx-2 text-sm font-medium text-black'>Page {currentPage} of {totalPages}</span>
                    <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`text-sm px-3 py-1 border rounded-md ${currentPage === totalPages ? 'text-black border-gray-600' : 'text-gray-100 border-gray-300 hover:bg-gray-300 hover:text-black'}`}
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>

                <div className='text-sm font-medium text-black tracking-wider mt-5 md:mt-0'>Total Entries: {filteredProducts.length}</div>
            </div>
            
            </div>

            <Receipt
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        receiptData={selectedReceipt || {}}
                    />
  
            {/* Edit model pop up */}
            {isEditModalOpen && editProduct && (
                <div className='fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-10'>
                    <motion.div
                        className='bg-gray-800 rounded-lg shadow-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto'
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h1 className='text-2xl font-semibold text-gray-100 mb-3 underline tracking-wider'>Edit Expense</h1>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div className='flex flex-col space-y-1'>
                                <label className='text-sm text-gray-300'>Category *</label>
                                <input
                                    type='text'
                                    value={editProduct.category || ''}
                                    onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })}
                                    className='w-full px-4 py-2 bg-gray-700 text-white rounded-md'
                                />
                            </div>

                            <div className='flex flex-col space-y-1'>
                                <label className='text-sm text-gray-300'>Sub Category *</label>
                                <input
                                    type='text'
                                    value={editProduct.sub_category || ''}
                                    onChange={(e) => setEditProduct({ ...editProduct, sub_category: e.target.value })}
                                    className='w-full px-4 py-2 bg-gray-700 text-white rounded-md'
                                />
                            </div>

                            <div className='flex flex-col space-y-1'>
                                <label className='text-sm text-gray-300'>Amount *</label>
                                <input
                                    type='number'
                                    step="0.01"
                                    value={editProduct.amount || ''}
                                    onChange={(e) => setEditProduct({ ...editProduct, amount: e.target.value })}
                                    className='w-full px-4 py-2 bg-gray-700 text-white rounded-md'
                                />
                            </div>

                            <div className='flex flex-col space-y-1'>
                                <label className='text-sm text-gray-300'>Payment Mode *</label>
                                <select
                                    value={editProduct.payment_mode || ''}
                                    onChange={(e) => setEditProduct({ ...editProduct, payment_mode: e.target.value })}
                                    className='w-full px-4 py-2 bg-gray-700 text-white rounded-md'
                                >
                                    <option value="">Select</option>
                                    <option value="cash">Cash</option>
                                    <option value="online">Online</option>
                                    <option value="cheque">Cheque</option>
                                    <option value="bank_transfer">Bank Transfer</option>
                                </select>
                            </div>

                            <div className='flex flex-col space-y-1'>
                                <label className='text-sm text-gray-300'>Transaction Reference</label>
                                <input
                                    type='text'
                                    value={editProduct.transaction_ref || ''}
                                    onChange={(e) => setEditProduct({ ...editProduct, transaction_ref: e.target.value })}
                                    className='w-full px-4 py-2 bg-gray-700 text-white rounded-md'
                                />
                            </div>

                            <div className='flex flex-col space-y-1'>
                                <label className='text-sm text-gray-300'>Entry Date *</label>
                                <input
                                    type='date'
                                    value={editProduct.entry_date || ''}
                                    onChange={(e) => setEditProduct({ ...editProduct, entry_date: e.target.value })}
                                    className='w-full px-4 py-2 bg-gray-700 text-white rounded-md'
                                />
                            </div>

                            <div className='flex flex-col space-y-1'>
                                <label className='text-sm text-gray-300'>Recorded By *</label>
                                <input
                                    type='text'
                                    value={editProduct.recorded_by || ''}
                                    onChange={(e) => setEditProduct({ ...editProduct, recorded_by: e.target.value })}
                                    className='w-full px-4 py-2 bg-gray-700 text-white rounded-md'
                                />
                            </div>

                            <div className='flex flex-col space-y-1 md:col-span-2'>
                                <label className='text-sm text-gray-300'>Description</label>
                                <textarea
                                    rows="3"
                                    value={editProduct.description || ''}
                                    onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                                    className='w-full px-4 py-2 bg-gray-700 text-white rounded-md'
                                />
                            </div>
                        </div>

                        <div className='flex justify-end mt-5 space-x-2'>
                            <button
                                onClick={() => setEditModalOpen(false)}
                                className='bg-gray-600 hover:bg-red-500 text-gray-100 px-4 py-2 rounded-md'
                            >
                                <X size={22} />
                            </button>
                            <button
                                onClick={handleSave}
                                className='bg-violet-600 hover:bg-violet-700 text-white text-md px-4 py-2 rounded-md w-24'
                            >
                                Save
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && itemToDelete && (
                <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
                    <motion.div
                        className='bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4'
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className='flex items-center mb-4'>
                            <div className='flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4'>
                                <AlertTriangle className='text-red-600' size={24} />
                            </div>
                            <div>
                                <h3 className='text-lg font-semibold text-gray-900'>Delete Expense</h3>
                                <p className='text-sm text-gray-500'>This action cannot be undone</p>
                            </div>
                        </div>

                        <div className='mb-6'>
                            <p className='text-gray-700 mb-2'>
                                Are you sure you want to delete this expense entry?
                            </p>
                            <div className='bg-gray-50 rounded-lg p-3 border border-gray-200'>
                                <p className='text-sm text-gray-600'>
                                    <span className='font-medium'>Category:</span> {itemToDelete.category || '-'}
                                </p>
                                <p className='text-sm text-gray-600'>
                                    <span className='font-medium'>Sub Category:</span> {itemToDelete.sub_category || '-'}
                                </p>
                                <p className='text-sm text-gray-600'>
                                    <span className='font-medium'>Amount:</span> ₹{parseFloat(itemToDelete.amount || 0).toFixed(2)}
                                </p>
                            </div>
                        </div>

                        <div className='flex justify-end space-x-3'>
                            <button
                                onClick={handleDeleteCancel}
                                className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors'
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                className='px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors'
                            >
                                Delete
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

        </motion.div>
    );
};

export default ExpenseTable;

