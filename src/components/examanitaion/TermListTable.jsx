import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Edit, Search, Trash2, X, ChevronLeft, ChevronRight, UserPlus } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload,faEye,faPrint,faCoffee,faUser,faLanguage,faFileExcel,faFilePdf,faFileText} from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import ReactModal from "react-modal";
const Demand = ({ isOpen, onClose, receiptData }) => {
    return (
      <ReactModal
        
      isOpen={isOpen}
        onRequestClose={onClose}
        contentLabel="Receipt"
        

        style={{
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1000, // Ensure the overlay is on top
            },
            content: {
              width: "55vw",
              margin: "auto",
              padding: "20px",
              border: "1px solid #ccc",
              zIndex: 1001, // Ensure the modal content is on top of the overlay
            },
          }}
        
      >
         <div class="max-w-2xl mx-auto border border-gray-300 p-4">
   <div class="flex justify-between items-center mb-4">
    {/* <img alt="NLET Logo" class="h-12" height="50" src="https://storage.googleapis.com/a1aa/image/PRkiWC5Q_7P69363dcirpgjllKVLfH69pVsucWEdSdU.jpg" width="100"/> */}
    <button onClick={onClose} className='text-black px-4 py-2 rounded-md'>
                                    <X size={22} />
                                </button>
    <div class="text-right">
     <p class="text-sm">
      Date: 12-02-2025
     </p>

     <button         onClick={() => window.print()} className='text-black px-4 py-2 rounded-md'>
                                print
                            </button>

    </div>
   </div>
   <h1 class="text-center text-xl font-bold mb-2">
FIO Institute Management Software
   </h1>
   <p class="text-center text-sm mb-4">
    19-K-4, Jyoti Nagar Jaipur Rajasthan - 302005
   </p>
   <div class="bg-pink-200 text-center py-2 mb-4">
    <p class="font-bold">
     DEMAND NOTICE - 2024-25
    </p>
   </div>
   <div class="border border-gray-300 p-2 mb-4">
    <div class="grid grid-cols-2 gap-2 mb-2">
     <div>
      <p>
       <span class="font-bold">
        Name:
       </span>
       Test 1004-User
      </p>
     </div>
     <div>
      <p>
       <span class="font-bold">
        Father's Name:
       </span>
       Test4 Father
      </p>
     </div>
    </div>
    <div class="grid grid-cols-2 gap-2 mb-2">
     <div>
      <p>
       <span class="font-bold">
        Class / Roll No.:
       </span>
       2nd-A/
      </p>
     </div>
     <div>
      <p>
       <span class="font-bold">
        Adm. No.:
       </span>
       1004
      </p>
     </div>
    </div>
    <div>
     <p>
      <span class="font-bold">
       Address:
      </span>
      Surya Nagar
     </p>
    </div>
   </div>
   <table class="w-full border border-gray-300 mb-4">
    <thead>
     <tr class="bg-pink-200">
      <th class="border border-gray-300 p-2">
       Fee Details
      </th>
      <th class="border border-gray-300 p-2">
       Month
      </th>
      <th class="border border-gray-300 p-2">
       Amount
      </th>
     </tr>
    </thead>
    <tbody>
     <tr>
      <td class="border border-gray-300 p-2">
       Installment 1 (PREVIOUS DUE)
      </td>
      <td class="border border-gray-300 p-2">
      </td>
      <td class="border border-gray-300 p-2">
       2000
      </td>
     </tr>
     <tr>
      <td class="border border-gray-300 p-2">
       Late Fine
      </td>
      <td class="border border-gray-300 p-2">
      </td>
      <td class="border border-gray-300 p-2">
      </td>
     </tr>
     <tr>
      <td class="border border-gray-300 p-2 font-bold">
       Total Due
      </td>
      <td class="border border-gray-300 p-2">
      </td>
      <td class="border border-gray-300 p-2 font-bold">
       2000/-
      </td>
     </tr>
    </tbody>
   </table>
   <p class="mb-4">
    Dear Parents/Guardians
   </p>
   <p class="mb-4">
    You are requested to pay the following fees of your ward before the due date to avoid a late fine
   </p>
   <p class="mb-4">
    Date: 12-02-2025
   </p>
   <p class="text-right font-bold">
    Authorized Signatory
   </p>
  </div>








      </ReactModal>
    );
  };


const TermListTable = ({Product_Data}) => {
    
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredProducts, setFilteredProducts] = useState(Product_Data);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [editDate, setEditDate] = useState(null);

    const [newProduct, setNewProduct] = useState({name: "", category: "", price: "", stock: "", sales: "" });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
      const [isModalOpen, setIsModalOpen] = useState(false);
            const [selectedReceipt, setSelectedReceipt] = useState(null);
    
    const SearchHandler = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = Product_Data.filter(product =>
            product.name.toLowerCase().includes(term) ||
            product.category.toLowerCase().includes(term)
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
        const productToAdd = { ...newProduct, id: newId, price: parseFloat(newProduct.price), stock: parseInt(newProduct.stock), sales: parseInt(newProduct.sales) };
        setFilteredProducts([productToAdd, ...filteredProducts]);
        setAddModalOpen(false);
        setNewProduct({ name: "", category: "", price: "", stock: "", sales: "" }); // Reset new product state
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
    console.log(data)
  };

   

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const getCurrentPageProducts = () => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredProducts.slice(start, start + itemsPerPage);
    };




    //   generatePDF
        const generatePDF = () => {
            const doc = new jsPDF();
        
            doc.text('User Information Table', 14, 10); // Title
        
            // AutoTable options
            const tableColumn = ['Name', 'Age', 'Country'];
            const tableRows = Product_Data.map(item => [item.name, item.email, item.role]);
        
            // Add table
            doc.autoTable({
              head: [tableColumn],
              body: tableRows,
            });
        
            doc.save('table.pdf'); // Save the PDF
          };
    
    
        //   download excel file
          const exportToExcel = () => {
            const worksheet = XLSX.utils.json_to_sheet(Product_Data); // Convert JSON data to a worksheet
            const workbook = XLSX.utils.book_new(); // Create a new workbook
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1'); // Add the worksheet to the workbook
        
            const excelBuffer = XLSX.write(workbook, {
              bookType: 'xlsx',
              type: 'array',
            });
        
            const blob = new Blob([excelBuffer], {
              type: 'application/octet-stream',
            });
            saveAs(blob, 'data.xlsx'); // Save the file
          };
    
        //   csv file
        const downloadCSV = () => {
            const headers = ['Name', 'Email', 'Role','Status'];
            const rows = Product_Data.map(row => [row.name, row.email, row.role, row.status]);
            
            const csvContent = [
              headers.join(','), // Add the headers
              ...rows.map(row => row.join(',')) // Add each row as a CSV string
            ].join('\n');
        
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'data.csv'); // Set the file name
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          };
    



    return (
      <div className='w-full p-4'>
          <motion.div
            className='bg-white  shadow-lg backdrop-blur-md rounded-xl p-5 mb-6 relative z-1'
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.2 }}
        >


            
            <div className='flex justify-between items-center mb-6'>
                <div className='flex items-center gap-6'>

                
                <h2 className='text-xl font-semibold text-black'>ExamList</h2>
                  <div class="row text-black">
                    
                        <div class="dt-buttons btn-group flex gap-2">
                                                 
                                                                                            
                                                    <button class="btn btn-primary buttons-excel buttons-html5" tabindex="0" aria-controls="main_datatable" type="button" title="CSV" onClick={downloadCSV}>
                                                    <FontAwesomeIcon icon={faFileText} />
                                                       </button>
                                                   
                                                    <button class="btn btn-primary buttons-csv buttons-html5" tabindex="0" aria-controls="main_datatable" type="button" title="Excel"  onClick={exportToExcel}>
                                                    <FontAwesomeIcon icon={faFileExcel} />
                                                    </button>
                                                       
                                                    <button class="btn btn-primary buttons-pdf buttons-html5" tabindex="0" aria-controls="main_datatable" type="button" title="PDF" onClick={generatePDF}>
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

            <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-400'>
                    <thead>
                        <tr>
                            <th className='px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider'>Exam Name</th>
                            <th className='px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider'>start date</th>
                            <th className='px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider'>end date</th>
                            <th className='px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider'>result public date</th>
                            <th className='px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider'>action</th>
                            {/* <th className='px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider'>{title6}</th> */}
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
                                    {/* <img src={ASSET_URLS.unsplashEarbuds} alt="Product_Image"
                                        className='rounded-full size-10'
                                    /> */}
                                    {/* {index+1} */}{product.name}
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-black'></td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-black'>{product.class}</td>
                                {/* <td className='px-6 py-4 whitespace-nowrap text-sm text-black'>{product.stock}</td> */}
                                {/* <td className='px-6 py-4 whitespace-nowrap text-sm text-black'>{product.sales}</td> */}
                                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium h-full'>
                                    <div className='flex items-center gap-4 h-full'>
                                        {/* <button onClick={() => setAddModalOpen(true)} className='text-green-500 hover:text-green-700'>
                                            <UserPlus size={20} />
                                        </button> */}
                                        <button onClick={() => handleViewClick(product)} className='text-violet-600 hover:text-violet-800'>
                                            <FontAwesomeIcon icon={faEye} />
                                        </button>
                                        <button onClick={() => handleDelete(product.id)} className='text-red-500 hover:text-red-700'>
                                        <FontAwesomeIcon icon={faDownload} />
                                            {/* <Trash2 size={18} /> */}
                                            {/* <FaDownload size={20} /> */}
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
            


            {/* Edit model pop up */}

            {isEditModalOpen && (
                <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
                    <motion.div
                        className='bg-gray-800 rounded-lg shadow-lg p-6 max-w-xl w-full'
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                    >

                        <h1 className='text-2xl font-semibold text-gray-100 mb-3 underline tracking-wider'>Edit Leave Request</h1>

                        {/* Responsive grid layout for fields */}
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div className='flex flex-col space-y-1'>
                                <label className='text-sm text-gray-300'>Student Name</label>
                                <input
                                    type='text'
                                    value={editProduct.name}
                                    onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                                    className='w-full px-4 py-2 bg-gray-700 text-white rounded-md'
                                />
                            </div>

                            <div className='flex flex-col space-y-1'>
                                <label className='text-sm text-gray-300'>Class</label>
                               
                                <select type='number'
                                    value={editProduct.category}

                                    onChange={(e) => setEditProduct({ ...editProduct, category: (e.target.value) })}
                                    className='w-full px-4 py-2 bg-gray-700 text-white rounded-md'>
                                     <option>        Select
                                      </option>
                                      <option>    1st
                                      </option>
                                      <option>    2nd
                                      </option>
                                      <option>    3rd
                                      </option>

                                      <option>    4st
                                      </option>
                                      <option>    5th
                                      </option>
                                      <option>    6th
                                      </option>

                                      <option>    7th
                                      </option>
                                      <option>    8th
                                      </option>
                                      <option>    9th
                                      </option>
                                       </select>
                                {/* <input
                                    type='text'
                                    value={editProduct.category}
                                    onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })}
                                    className='w-full px-4 py-2 bg-gray-700 text-white rounded-md'
                                /> */}
                            </div>

                            <div className='flex flex-col space-y-1'>
                                <label className='text-sm text-gray-300'>Apply Date</label>
                                <DatePicker
                                    // type='number'
                                    selected={editProduct.price}
                                    id="datePicker"
                                    // value={editProduct.price}
                                    onChange={(e) => setEditProduct({ ...editProduct, price: (e.target.selected) })}
                                    className='w-full px-4 py-2 bg-gray-700 text-white rounded-md'
                                    //  dateFormat="yyyy/MM/dd h:mm aa"
                                    placeholderText="Choose date and time"                               />
                            </div>

                            <div className='flex flex-col space-y-1'>
                                <label className='text-sm text-gray-300'>Leave Date</label>
                                <input
                                    type='number'
                                    value={editProduct.stock}
                                    onChange={(e) => setEditProduct({ ...editProduct, stock: parseInt(e.target.value, 10) })}
                                    className='w-full px-4 py-2 bg-gray-700 text-white rounded-md'
                                />
                            </div>

                            <div className='flex flex-col space-y-1 md:col-span-2'>
                                <label className='text-sm text-gray-300'>Status</label>
                                <select type='number'
                                    value={editProduct.sales}

                                    onChange={(e) => setEditProduct({ ...editProduct, sales: (e.target.value) })}
                                    className='w-full px-4 py-2 bg-gray-700 text-white rounded-md'>
                                     <option>        Select
                                      </option>
                                      <option>    Approved
                                      </option>
                                      <option>    Rejected
                                      </option>
                                      <option>    Pending
                                      </option>
                                       </select>
                                {/* <input
                                    type='number'
                                    value={editProduct.sales}
                                    onChange={(e) => setEditProduct({ ...editProduct, sales: parseInt(e.target.value, 10) })}
                                    className='w-full px-4 py-2 bg-gray-700 text-white rounded-md'
                                /> */}
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
                                className='bg-blue-600 hover:bg-blue-800 text-white text-md px-4 py-2 rounded-md w-24'
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
                                <label className='text-sm text-gray-300'>Product Category</label>
                                <input
                                    type="text"
                                    value={newProduct.category}
                                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                    placeholder='Category'
                                    className='w-full px-4 py-2 bg-gray-700 text-white rounded-md'
                                />
                            </div>

                            <div className='flex flex-col space-y-1'>
                                <label className='text-sm text-gray-300'>Product Price</label>
                                <input
                                    type="number"
                                    value={newProduct.price}
                                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                    placeholder='Price'
                                    className='w-full px-4 py-2 bg-gray-700 text-white rounded-md'
                                />
                            </div>

                            <div className='flex flex-col space-y-1'>
                                <label className='text-sm text-gray-300'>Product Stock</label>
                                <input
                                    type="number"
                                    value={newProduct.stock}
                                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                                    placeholder='Stock'
                                    className='w-full px-4 py-2 bg-gray-700 text-white rounded-md'
                                />
                            </div>

                            <div className='flex flex-col space-y-1'>
                                <label className='text-sm text-gray-300'>Product Sales</label>
                                <input
                                    type="number"
                                    value={newProduct.sales}
                                    onChange={(e) => setNewProduct({ ...newProduct, sales: e.target.value })}
                                    placeholder='Sales'
                                    className='w-full px-4 py-2 bg-gray-700 text-white rounded-md'
                                />
                            </div>
                        </div>

                        <div className='flex justify-end mt-5 space-x-2'>
                            <button onClick={() => setAddModalOpen(false)} className='bg-gray-600 hover:bg-red-500 text-gray-100 px-4 py-2 rounded-md'>
                                <X size={22} />
                            </button>
                            <button onClick={handleAdd} className='bg-blue-600 hover:bg-blue-800 text-white text-md px-4 py-3 rounded-md w-32'>
                                Add Product
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}


<Demand
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        receiptData={selectedReceipt || { name: "", class: "" }}
                    />
        </motion.div>
      </div>
    );
};

export default TermListTable;
