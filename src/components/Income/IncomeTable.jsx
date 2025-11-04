import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit, Search, Trash2, X, ChevronLeft, ChevronRight, UserPlus,Printer } from 'lucide-react';
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint,faCoffee,faUser,faLanguage,faFileExcel,faFilePdf,faFileText} from '@fortawesome/free-solid-svg-icons';
import ReactModal from "react-modal";


const Product_Data = [
    { id: 1,  name: "School Building Maintenance", invoiceno: "INV-001", paymentMode: "Bank Transfer", bankName: "ABC Bank", description: "Maintenance of school infrastructure", payor: "John Doe", amount: 12000, date: "2024-09-05", approvedby: "Principal" },
    { id: 2,  name: "Library Books Purchase", invoiceno: "INV-002", paymentMode: "Credit Card", bankName: "XYZ Bank", description: "Purchase of new books for the library", payor: "Jane Smith", amount: 8000, date: "2024-10-15", approvedby: "Vice Principal" },
    { id: 3,  name: "Science Lab Equipment", invoiceno: "INV-003", paymentMode: "Cheque", bankName: "PQR Bank", description: "Procurement of lab equipment", payor: "Alice Johnson", amount: 15000, date: "2024-11-20", approvedby: "Head of Department" },
    { id: 4,  name: "Sports Equipment", invoiceno: "INV-004", paymentMode: "Cash", bankName: "-", description: "Purchase of new sports gear", payor: "Bob Brown", amount: 10000, date: "2024-12-01", approvedby: "Sports Coordinator" },
    { id: 5,  name: "Computer Lab Setup", invoiceno: "INV-005", paymentMode: "Bank Transfer", bankName: "LMN Bank", description: "Setup of new computers", payor: "Charlie Davis", amount: 25000, date: "2024-08-25", approvedby: "IT Administrator" },
    { id: 6,  name: "School Bus Maintenance", invoiceno: "INV-006", paymentMode: "Cheque", bankName: "DEF Bank", description: "Repairs and maintenance of buses", payor: "Eva Green", amount: 18000, date: "2024-07-30", approvedby: "Transport Manager" },
    { id: 7,  name: "Cafeteria Renovation", invoiceno: "INV-007", paymentMode: "Cash", bankName: "-", description: "Renovation of school cafeteria", payor: "Frank White", amount: 22000, date: "2024-06-10", approvedby: "Cafeteria Manager" },
    { id: 8,  name: "Auditorium Sound System", invoiceno: "INV-008", paymentMode: "Credit Card", bankName: "GHI Bank", description: "Installation of a new sound system", payor: "Grace Lee", amount: 30000, date: "2024-05-05", approvedby: "Event Coordinator" },
    { id: 9,  name: "School Uniforms", invoiceno: "INV-009", paymentMode: "Bank Transfer", bankName: "JKL Bank", description: "Purchase of new uniforms", payor: "Henry Clark", amount: 9000, date: "2024-04-12", approvedby: "Uniform Incharge" },
    { id: 10,  name: "Computer Lab Setup", invoiceno: "INV-005", paymentMode: "Bank Transfer", bankName: "LMN Bank", description: "Setup of new computers", payor: "Charlie Davis", amount: 25000, date: "2024-08-25", approvedby: "IT Administrator" },
    { id: 11,  name: "School Bus Maintenance", invoiceno: "INV-006", paymentMode: "Cheque", bankName: "DEF Bank", description: "Repairs and maintenance of buses", payor: "Eva Green", amount: 18000, date: "2024-07-30", approvedby: "Transport Manager" },
    { id: 12,  name: "Cafeteria Renovation", invoiceno: "INV-007", paymentMode: "Cash", bankName: "-", description: "Renovation of school cafeteria", payor: "Frank White", amount: 22000, date: "2024-06-10", approvedby: "Cafeteria Manager" },
    { id: 13,  name: "Auditorium Sound System", invoiceno: "INV-008", paymentMode: "Credit Card", bankName: "GHI Bank", description: "Installation of a new sound system", payor: "Grace Lee", amount: 30000, date: "2024-05-05", approvedby: "Event Coordinator" },
    { id: 14,  name: "School Uniforms", invoiceno: "INV-009", paymentMode: "Bank Transfer", bankName: "JKL Bank", description: "Purchase of new uniforms", payor: "Henry Clark", amount: 9000, date: "2024-04-12", approvedby: "Uniform Incharge" },


];
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
            <h2 className="text-xl font-semibold">Enquiry Card</h2>
            <button className="text-white text-xl hover:text-gray-300 transition-colors duration-300">
              <span className="material-symbols-outlined" onClick={onClose}><X size={22} /></span>
            </button>
          </div>

          <div className="p-6 border border-gray-200 m-4 relative">
            <div className="absolute right-3 top-3">
              <button className="text-gray-600 hover:text-gray-900 transition-colors duration-300">
                <span className="material-symbols-outlined" onClick={printReceipt}><Printer /></span>
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
              <button className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-10 rounded-full transition-all duration-300 transform hover:scale-105">
                Enquiry Receipt
              </button>
            </div>

            <div className="flex justify-end mb-4">
              <p className="text-gray-700"><span className="font-medium">Date :</span> {receiptData.date}</p>
            </div>

            <div className="border border-gray-300">
              <div className="grid grid-cols-2">
                <div className="border-b border-r border-gray-300 p-3">
                  <p><span className="font-medium">Name :</span> {receiptData.name}</p>
                </div>
                <div className="border-b border-gray-300 p-3">
                  <p><span className="font-medium">Phone :</span> {receiptData.phone}</p>
                </div>
                <div className="border-b border-r border-gray-300 p-3">
                  <p><span className="font-medium">Email :</span> {receiptData.email}</p>
                </div>
                <div className="border-b border-gray-300 p-3">
                  <p><span className="font-medium">Class :</span> {receiptData.className}</p>
                </div>
                <div className="border-b border-r border-gray-300 p-3">
                  <p><span className="font-medium">Status :</span> {receiptData.status}</p>
                </div>
                <div className="border-b border-gray-300 p-3">
                  <p><span className="font-medium">Enquiry Date :</span> {receiptData.date}</p>
                </div>
                <div className="col-span-2 border-b border-gray-300 p-3">
                  <p><span className="font-medium">Address :</span> {receiptData.address}</p>
                </div>
                <div className="col-span-2 border-b border-gray-300 p-3">
                  <p><span className="font-medium">Description :</span> {receiptData.remarks}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ReactModal>
  );
};


const IncomeTable = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredProducts, setFilteredProducts] = useState(Product_Data);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedReceipt, setSelectedReceipt] = useState(null);
    const [editProduct, setEditProduct] = useState(null);
    const [newProduct, setNewProduct] = useState({ name: "", payor: "", amount: "", date: "", approvedby: "" });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const SearchHandler = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = Product_Data.filter(product =>
            product.name.toLowerCase().includes(term) ||
            product.payor.toLowerCase().includes(term)
        );
        setFilteredProducts(filtered);
        setCurrentPage(1);
    };

    const handleEdit = (product) => {
        setEditProduct(product);
        setEditModalOpen(true);
    };

    const handleDelete = (productId) => {
        const updatedProducts = filteredProducts.filter(product => product.id !== productId);
        setFilteredProducts(updatedProducts);
    };
    const handleAdd = () => {
        const newId = filteredProducts.length > 0 ? Math.max(...filteredProducts.map(product => product.id)) + 1 : 1;
        const productToAdd = { ...newProduct, id: newId, amount: parseFloat(newProduct.amount), date: parseInt(newProduct.date), approvedby: parseInt(newProduct.approvedby) };
        setFilteredProducts([productToAdd, ...filteredProducts]);
        setAddModalOpen(false);
        setNewProduct({ name: "", payor: "", amount: "", date: "", approvedby: "" }); // Reset new product state
    };


    const handleSave = () => {
        const updatedProducts = filteredProducts.map(product =>
            product.id === editProduct.id ? editProduct : product
        );
        setFilteredProducts(updatedProducts);
        setEditModalOpen(false);
    };

      // view handle click
      const handleViewClick = (data) => {
        setSelectedReceipt(data);
        setIsModalOpen(true);
        // console.log(data)
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


            {/* add income */}
        

    <div className=''>        

            <div className='flex justify-between items-center mb-6'>
                <div className='flex items-center gap-6'>

                
                <h2 className='text-xl font-semibold text-black'>Income List</h2>
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
                        placeholder='Search Product...'
                        className=' text-black placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-violet-600'
                        onChange={SearchHandler}
                        value={searchTerm}
                    />
                </div>
            </div>

            <div className='overflow-x-auto' style={{height:"100vh"}}>
                <table className='min-w-full divide-y divide-gray-400' >
                    <thead>
                        <tr>
                            <th className='px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider'>Income Head</th>
                            <th className='px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider'>Payor</th>
                            <th className='px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider'>Amount</th>
                            <th className='px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider'>Date</th>
                            <th className='px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider'>Approved By</th>
                            <th className='px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider'>Actions</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-500'>
                        {getCurrentPageProducts().map((product) => (
                            <motion.tr
                                key={product.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1.1, delay: 0.2 }}
                            >
                                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-black flex gap-2 items-center'>
                                   
                                    {product.name}
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-black'>{product.payor}</td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-black'>{product.amount.toFixed(2)}</td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-black'>{product.date}</td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-black'>{product.approvedby}</td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium h-full'>
                                    <div className='flex items-center gap-4 h-full'>
                                        <button onClick={() => handleViewClick(product)} className='text-green-500 hover:text-green-600'>
                                                <FontAwesomeIcon icon={faEye} />
                                                </button>
                                        <button onClick={() => handleEdit(product)} className='text-violet-600 hover:text-violet-700'>
                                            <Edit size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(product.id)} className='text-red-500 hover:text-red-700'>
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </motion.tr>

                        ))}
                    </tbody>
                </table>
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

                <div className='text-sm font-medium text-black tracking-wider mt-5 md:mt-0'>Total Products: {filteredProducts.length}</div>
            </div>
            

            </div>

          
            <Receipt
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        receiptData={selectedReceipt || { name: "", class: "" }}
                    />
  
        
            {/* Edit model pop up */}


            {isEditModalOpen && (
                <div className='fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-10'>
                    <motion.div
                        className='bg-gray-800 rounded-lg shadow-lg p-6 max-w-xl w-full'
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                    >

                        <h1 className='text-2xl font-semibold text-gray-100 mb-3 underline tracking-wider'>Edit Income</h1>

                        {/* Responsive grid layout for fields */}
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div className='flex flex-col space-y-1'>
                                <label className='text-sm text-gray-300'>Income Name</label>
                                <input
                                    type='text'
                                    value={editProduct.name}
                                    onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                                    className='w-full px-4 py-2 bg-gray-700 text-white rounded-md'
                                />
                            </div>

                            <div className='flex flex-col space-y-1'>
                                <label className='text-sm text-gray-300'>payor</label>
                                <input
                                    type='text'
                                    value={editProduct.payor}
                                    onChange={(e) => setEditProduct({ ...editProduct, payor: e.target.value })}
                                    className='w-full px-4 py-2 bg-gray-700 text-white rounded-md'
                                />
                            </div>

                            <div className='flex flex-col space-y-1'>
                                <label className='text-sm text-gray-300'>amount</label>
                                <input
                                    type='number'
                                    value={editProduct.amount}
                                    onChange={(e) => setEditProduct({ ...editProduct, amount: parseFloat(e.target.value) })}
                                    className='w-full px-4 py-2 bg-gray-700 text-white rounded-md'
                                />
                            </div>

                            <div className='flex flex-col space-y-1'>
                                <label className='text-sm text-gray-300'>date</label>
                                <input
                                    type='number'
                                    value={editProduct.date}
                                    onChange={(e) => setEditProduct({ ...editProduct, date: parseInt(e.target.value, 10) })}
                                    className='w-full px-4 py-2 bg-gray-700 text-white rounded-md'
                                />
                            </div>

                            <div className='flex flex-col space-y-1 md:col-span-2'>
                                <label className='text-sm text-gray-300'>approvedby</label>
                                <input
                                    type='number'
                                    value={editProduct.approvedby}
                                    onChange={(e) => setEditProduct({ ...editProduct, approvedby: parseInt(e.target.value, 10) })}
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


            {/* Add Product Modal */}
            {isAddModalOpen && (
                <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
                    <motion.div
                        className='bg-gray-800 rounded-lg shadow-lg p-6 max-w-xl w-full'
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h1 className='text-2xl font-semibold text-gray-100 mb-4 underline tracking-wider'>Add New Product</h1>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>

                            <div className='flex flex-col space-y-1'>
                                <label className='text-sm text-gray-300'>Product Name</label>
                                <input
                                    type="text"
                                    value={newProduct.name}
                                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                    placeholder='Product Name'
                                    className='w-full px-4 py-2 bg-gray-700 text-white rounded-md'
                                />
                            </div>

                            <div className='flex flex-col space-y-1'>
                                <label className='text-sm text-gray-300'>Product payor</label>
                                <input
                                    type="text"
                                    value={newProduct.payor}
                                    onChange={(e) => setNewProduct({ ...newProduct, payor: e.target.value })}
                                    placeholder='payor'
                                    className='w-full px-4 py-2 bg-gray-700 text-white rounded-md'
                                />
                            </div>

                            <div className='flex flex-col space-y-1'>
                                <label className='text-sm text-gray-300'>Product amount</label>
                                <input
                                    type="number"
                                    value={newProduct.amount}
                                    onChange={(e) => setNewProduct({ ...newProduct, amount: e.target.value })}
                                    placeholder='amount'
                                    className='w-full px-4 py-2 bg-gray-700 text-white rounded-md'
                                />
                            </div>

                            <div className='flex flex-col space-y-1'>
                                <label className='text-sm text-gray-300'>Product date</label>
                                <input
                                    type="number"
                                    value={newProduct.date}
                                    onChange={(e) => setNewProduct({ ...newProduct, date: e.target.value })}
                                    placeholder='date'
                                    className='w-full px-4 py-2 bg-gray-700 text-white rounded-md'
                                />
                            </div>

                            <div className='flex flex-col space-y-1'>
                                <label className='text-sm text-gray-300'>Product approvedby</label>
                                <input
                                    type="number"
                                    value={newProduct.approvedby}
                                    onChange={(e) => setNewProduct({ ...newProduct, approvedby: e.target.value })}
                                    placeholder='approvedby'
                                    className='w-full px-4 py-2 bg-gray-700 text-white rounded-md'
                                />
                            </div>
                        </div>

                        <div className='flex justify-end mt-5 space-x-2'>
                            <button onClick={() => setAddModalOpen(false)} className='bg-gray-600 hover:bg-red-500 text-gray-100 px-4 py-2 rounded-md'>
                                <X size={22} />
                            </button>
                            <button onClick={handleAdd} className='bg-violet-600 hover:bg-violet-700 text-white text-md px-4 py-3 rounded-md w-32'>
                                Add Product
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
};

export default IncomeTable;
