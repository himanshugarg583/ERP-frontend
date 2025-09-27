import React, { useState,useRef,useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Edit, Search, Trash2, UserPlus, X} from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faPrint,faCoffee,faUser,faLanguage,faFileExcel,faFilePdf,faFileText} from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactModal from "react-modal";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EnquiryReceipt from '../comman_components/EnquiryReceipt';
import { User_Data } from '../../data';
import axios from 'axios';
import { fetchAllEnquiries, createEnquiry, updateEnquiry, deleteEnquiry } from '../../helper/requests-method/apiMethods';









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
              <span className="material-symbols-outlined" onClick={onClose}>close</span>
            </button>
          </div>

          <div className="p-6 border border-gray-200 m-4 relative">
            <div className="absolute right-3 top-3">
              <button className="text-gray-600 hover:text-gray-900 transition-colors duration-300">
                <span className="material-symbols-outlined" onClick={printReceipt}>print</span>
              </button>
            </div>

            <div className="flex items-center mb-6">
              <div className="mr-4">
                {/* <svg xmlns="http://www.w3.org/2000/svg" width="100" height="40" viewBox="0 0 100 40" className="h-16 w-32">
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
                </svg> */}
                <img src={''}/>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">GurukulSarthi Smart School Management Software</h1>
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
                  <p><span className="font-medium">Parent Name :</span> {receiptData.parentName}</p>
                </div>
                <div className="border-b border-gray-300 p-3">
                  <p><span className="font-medium">Status :</span> {receiptData.status}</p>
                </div>
                <div className="border-b border-r border-gray-300 p-3">
                  <p><span className="font-medium">Enquiry Date :</span> {receiptData.enquiry_date}</p>
                </div>
                <div className="border-b border-gray-300 p-3">
                  <p><span className="font-medium">Old School :</span> {receiptData.oldSchool}</p>
                </div>
                <div className="col-span-2 border-b border-gray-300 p-3">
                  <p><span className="font-medium">Address :</span> {receiptData.address}</p>
                </div>
                <div className="col-span-2 border-b border-gray-300 p-3">
                  <p><span className="font-medium">Description :</span> {receiptData.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ReactModal>
  );
};

const EnquiryTable = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredUsers, setFilteredUsers] = useState(User_Data);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
       const [newUser, setNewUser] = useState({
        name: "",
        phone: "",
        email: "",
        className: "",
        date: "",
        address: "",
        description: "",
        parentName: "",
        oldSchool: "",
        status: "",
      });
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [selectedDate, setSelectedDate] = useState(new Date("2025-02-01"));
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedReceipt, setSelectedReceipt] = useState(null);
    const [users, setUsers] = useState([]);  // State to store fetched users
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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



    
    // Fetch data from backend
  useEffect(() => {
        const getEnquiries = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchAllEnquiries();
                if (data && data.success && Array.isArray(data.data)) {
                    setUsers(data.data);
                    setFilteredUsers(data.data);
                    showToast(data, "Enquiries fetched successfully");
                } else {
                    setUsers([]);
                    setFilteredUsers([]);
                    showToast(data, "Failed to fetch enquiries");
                }
            } catch (err) {
                setError(err.message || 'Failed to fetch enquiries');
                setUsers([]);
                setFilteredUsers([]);
                toast.error(err.message || 'Failed to fetch enquiries', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            } finally {
                setLoading(false);
            }
        };
        getEnquiries();
    }, []);

    // Show loading or error message
    if (loading) return <p>Loading users...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;




    // Calculate total pages
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    // view handle click
    const handleViewClick = (data) => {
        setSelectedReceipt(data);
        setIsModalOpen(true);
        // console.log(data)
      };

    // Handle Search
    const SearchHandler = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = users.filter(user =>
            user.name.toLowerCase().includes(term) ||
            user.phone.toLowerCase().includes(term) ||
            user.parentName.toLowerCase().includes(term) ||
            user.className.toLowerCase().includes(term)
        );
        setFilteredUsers(filtered);
        setCurrentPage(1);
    };

  
    // Helper to build payload for API
    const buildEnquiryPayload = (data) => ({
        name: data.name || "",
        phone: data.phone || "",
        email: data.email || "",
        className: data.className || "",
        address: data.address || "",
        parentName: data.parentName || "",
        oldSchool: data.oldSchool || "",
        description: data.description || "",
        status: data.status || "",
        date: data.date || "",
    });

    // Add Enquiry
    const handleAdd = async (e) => {
        e.preventDefault();
        const payload = buildEnquiryPayload({
          ...newUser, 
            date: selectedDate ? selectedDate.toISOString().split('T')[0] : ""
        });
        try {
            const data = await createEnquiry(payload);
            if (data && data.success) {
                // Refetch or update UI
                const refreshed = await fetchAllEnquiries();
                setUsers(refreshed.data);
                setFilteredUsers(refreshed.data);
                setAddModalOpen(false);
                setNewUser({ name: "", phone: "", email: "", className: "", date: "", address: "", description: "", parentName: "", oldSchool: "", status: "" });
                showToast(data, "Enquiry added successfully!");
            } else {
                showToast(data, "Failed to add enquiry");
            }
        } catch (error) {
            console.error("Error adding enquiry:", error);
            toast.error("Failed to add enquiry. Try again.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    // Update Enquiry
    const handleSave = async (e) => {
        e.preventDefault();
        if (!editUser || !editUser.id) return;
        const payload = buildEnquiryPayload({
            ...editUser,
            date: selectedDate ? selectedDate.toISOString().split('T')[0] : ""
        });
        try {
            const data = await updateEnquiry(editUser.id, payload);
            if (data && data.success) {
                // Refetch or update UI
                const refreshed = await fetchAllEnquiries();
                setUsers(refreshed.data);
                setFilteredUsers(refreshed.data);
                setEditModalOpen(false);
                showToast(data, "Enquiry updated successfully!");
            } else {
                showToast(data, "Failed to update enquiry");
            }
      } catch (error) {
            console.error("Error updating enquiry:", error);
            toast.error("Failed to update enquiry.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    // Delete Enquiry
    const handleDelete = async (id) => {
      if (!window.confirm("Are you sure you want to delete this enquiry?")) {
          return;
      }
        try {
            const data = await deleteEnquiry(id);
            if (data && data.success) {
                // Refetch or update UI
                const refreshed = await fetchAllEnquiries();
                setUsers(refreshed.data);
                setFilteredUsers(refreshed.data);
                showToast(data, "Enquiry deleted successfully!");
          } else {
              showToast(data, "Failed to delete enquiry");
          }
      } catch (error) {
          console.error("Error deleting enquiry:", error);
          toast.error("An error occurred while deleting. Try again.", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
          });
      }
  };
  
    
    
    
    
 

    // Edit user function
    const handleEdit = (user) => {
        setEditUser(user);
        setEditModalOpen(true);
    };

  
  

    // Delete user function
 
    // const showDeleteConfirm = () => {
    //     // setSelectedRow(record);
    //     setIsModalVisible(true);
    //   };



    // Save function after editing user details




    // Pagination
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const getCurrentPageUsers = () => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredUsers.slice(start, start + itemsPerPage);
    };

    //   generatePDF
    const generatePDF = () => {
        console.log("pdf clicked");
        const doc = new jsPDF();
    
        doc.text('Enquiry Information Table', 14, 10); // Title
    
        // AutoTable options
        const tableColumn = ['Name', 'Phone', 'Parent Name', 'Class', 'Status'];
        const tableRows = users.map(item => [item.name, item.phone, item.parentName, item.className, item.status]);
    
        // Add table
        doc.autoTable({
          head: [tableColumn],
          body: tableRows,
        });
    
        doc.save('enquiries.pdf'); // Save the PDF
      };


          //   download excel file
      const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(users); // Convert JSON data to a worksheet
        const workbook = XLSX.utils.book_new(); // Create a new workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1'); // Add the worksheet to the workbook
    
        const excelBuffer = XLSX.write(workbook, {
          bookType: 'xlsx',
          type: 'array',
        });
    
        const blob = new Blob([excelBuffer], {
          type: 'application/octet-stream',
        });
        saveAs(blob, 'enquiries.xlsx'); // Save the file
      };

    //   csv file
    const downloadCSV = () => {
        const headers = ['Name', 'Phone', 'Parent Name', 'Class', 'Status'];
        const rows = users.map(row => [row.name, row.phone, row.parentName, row.className, row.status]);
        
        const csvContent = [
          headers.join(','), // Add the headers
          ...rows.map(row => row.join(',')) // Add each row as a CSV string
        ].join('\n');
    
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'enquiries.csv'); // Set the file name
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };

   
    


    return (
        <>
            <ToastContainer />
            <motion.div
                className='bg-white  shadow-lg backdrop-blur-md rounded-xl p-5   mb-6 relative z-1'
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
            >
            {/* Header and Search */}
            <div className='flex justify-between items-center mb-6'>
                <div className='flex items-center gap-6'>
                <h2 className='text-xl font-semibold text-black'>Enquiry List</h2>

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

                {/* end code */}

                </div>
              

                <div className='relative flex justify-between items-center ' style={{width:'30%'}}>
                <button onClick={() => setAddModalOpen(true)} className='text-green-500 hover:text-green-600'>
                                        <UserPlus size={20} />

                                    </button> 
                    
                
                <div>
                    <Search className='absolute left-3 text-gray-400 sm:left-32 top-2.5' size={20} />
                    <input
                        type="text"
                        placeholder='Search Product...'
                        className='bg-slate-300 text-black placeholder-slate-800 rounded-lg pl-10 pr-4 py-2 max-w-full  focus:outline-none focus:ring-2 focus:ring-blue-500'
                        onChange={SearchHandler}
                        value={searchTerm}
                    />
                    </div>
                </div>

            </div>

            {/* Table */}
            <div className='overflow-x-auto' style={{ minHeight: '400px' }}>
                <table className='min-w-full divide-y divide-gray-400'>
                    <thead>
                        <tr>
                        {/* <th className='px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider'>#</th> */}
                            <th className='px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider'>Name</th>
                            <th className='px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider'>Phone</th>
                            <th className='px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider'>Parent Name</th>
                            <th className='px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider'>Class</th>
                            <th className='px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider'>Status</th>
                            <th className='px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider'>Action</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-500'>
                        {users.map((user,index) => (
                            <motion.tr
                                key={user.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1.1, delay: 0.2 }}
                            >
                                
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='flex items-center'>
                                        <div className='flex-shrink-0 h-10 w-10'>
                                            <div className='h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold'>
                                                {user.name.charAt(0)}
                                            </div>
                                        </div>
                                        <div className='ml-4'>
                                             <div className='text-sm font-semibold text-black tracking-wider'>{user.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='text-sm text-black'>{user.phone}</div>
                                </td>

                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='text-sm text-black'>{user.parentName}</div>
                                </td>
                                
                                <td className='px-6 py-4 whitespace-nowrap'>
                                <div className='text-sm text-black'>{user.className}</div>
                                    {/* </span> */}
                                </td>


                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <span className={`px-4 inline-flex rounded-full text-xs leading-5 font-semibold 
                                        ${user.status === "active" ? "bg-green-700 text-green-100"
                                            : "bg-red-700 text-red-100"}`}>
                                        {user.status}
                                    </span>
                                </td>


                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <button onClick={() => handleViewClick(user)} className='text-green-500 hover:text-green-600'>
                                    <FontAwesomeIcon icon={faEye} />
                                    </button>   
                                    <button className='text-indigo-400 hover:text-indigo-300 mr-3 ml-3' onClick={() => handleEdit(user)}>
                                        <Edit size={18} />
                                    </button>
                                    <button className='text-red-400 hover:text-red-300' onClick={() => handleDelete(user.id)}>
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>

               
            </div>

            {/* PAGINATION */}
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

                <div className='text-sm font-medium text-black tracking-wider mt-5 md:mt-0'>Total Users: {filteredUsers.length}</div>
            </div>

            
            <Receipt
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        receiptData={selectedReceipt || { name: "", class: "" }}
                    />
                    





{isEditModalOpen &&(
             
             
             <div className="fixed -inset-40 z-50 max-w-4xl mx-auto mt-2 p-1 " style={{height:"100vh"}}>
                   <motion.div
                //    
                className='w-full bg-white  rounded-lg shadow-md'
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}

            >
                   
                
                    <div class="bg-purple-900 text-white text-lg font-semibold p-4 rounded-t-lg flex justify-between items-center">
                        <span>Admission Enquiry</span>
                        <button onClick={() => setEditModalOpen(false)} className='text-gray-100 px-4 py-2 rounded-md'>
                                <X size={22} />
                            </button>
                        {/* <X size={22} /> */}
                        {/* <i class="fas fa-times cursor-pointer"></i> */}
                    </div>
                    <form class="p-4 space-y-4 text-black">
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label class="block text-gray-700">Name <span class="text-red-500">*</span></label>
                                <input 
                                type="text"
                                 class="w-full border border-gray-300 rounded p-2"
                                 value={editUser.name}
                                onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                                 />

                            </div>
                            <div>
                                <label class="block text-gray-700">Phone <span class="text-red-500">*</span></label>
                                <input 
                                type="text" 
                                value={editUser.phone}
                                    onChange={(e) => setEditUser({ ...editUser, phone: e.target.value })}
                                class="w-full border border-gray-300 rounded p-2"/>
                                <p class="text-red-500 text-sm">The contact must be 10 digits.</p>
                            </div>
                            <div>
                                <label class="block text-gray-700">Email</label>
                                <input 
                                    type="email" 
                                    class="w-full border border-gray-300 rounded p-2"
                                    value={editUser.email}
                                    onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                                />
                            </div>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* <div>
                                <label class="block text-gray-700">Reference</label>
                                <select class="w-full border border-gray-300 rounded p-2">
                                    <option>Select</option>
                                    <option>Teacher</option>
                                    <option>Parent</option>
                                    <option>Chairman sir</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-gray-700">Source <span class="text-red-500">*</span></label>
                                <select class="w-full border border-gray-300 rounded p-2"
                                >
                                    <option>Select</option>
                                    <option>Social Media</option>
                                    <option>Website</option>
                                    <option>Phone</option>
                                    <option>Physical Visit</option>
                                </select>
                            </div> */}
                            <div>
                                <label class="block text-gray-700">Class</label>
                                <select 
                                class="w-full border border-gray-300 rounded p-2"
                                value={editUser.className}
                                    onChange={(e) => setEditUser({ ...editUser, className: e.target.value })}
                                
                                >
                                    <option>Select</option>
                                    <option>1st</option>
                                    <option>2nd</option>
                                    <option>3rd</option>
                                    <option>4th</option>
                                    <option>5th</option>
                                    <option>6th</option>
                                    <option>7th</option>
                                    <option>8th</option>
                                    <option>9th</option>
                                    <option>10th</option>
                                    <option>11th</option>
                                    <option>12th</option>
                                </select>
                            </div>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label class="block text-gray-700">Date</label>
                                <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="dd-MM-yyyy"
                className="w-full border border-gray-300 rounded p-2"
               
            />
             {/* readOnly // If you want to prevent manual input */}
                            </div>
                            <div>
                                <label class="block text-gray-700">Status</label>
                                <select class="w-full border border-gray-300 rounded p-2"
                                value={editUser.status}
                                onChange={(e) => setEditUser({ ...editUser, status: e.target.value })}
                                >
                                    <option>Select</option>
                                    <option>Active Student</option>
                                    <option>Enroll Student</option>
                                    <option>InActive Student</option>
                                </select>
                            </div>
                            {/* <div>
                                <label class="block text-gray-700">No of Child</label>
                                <input type="text" class="w-full border border-gray-300 rounded p-2"/>
                            </div> */}
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label class="block text-gray-700">Address</label>
                                <textarea 
                                    class="w-full border border-gray-300 rounded p-2"
                                    value={editUser.address}
                                    onChange={(e) => setEditUser({ ...editUser, address: e.target.value })}
                                ></textarea>
                            </div>
                            <div>
                                <label class="block text-gray-700">Description</label>
                                <textarea 
                                    class="w-full border border-gray-300 rounded p-2"
                                    value={editUser.description}
                                    onChange={(e) => setEditUser({ ...editUser, description: e.target.value })}
                                ></textarea>
                            </div>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label class="block text-gray-700">Parent Name</label>
                                <input 
                                    type="text"
                                    class="w-full border border-gray-300 rounded p-2"
                                    value={editUser.parentName}
                                    onChange={(e) => setEditUser({ ...editUser, parentName: e.target.value })}
                                />
                            </div>
                            <div class="md:col-span-2">
                                <label class="block text-gray-700">Previous School Name</label>
                                <input 
                                    type="text"
                                    class="w-full border border-gray-300 rounded p-2"
                                    value={editUser.oldSchool}
                                    onChange={(e) => setEditUser({ ...editUser, oldSchool: e.target.value })}
                                />
                            </div>
                        </div>
                        <div class="flex justify-end">
                            <button class="bg-purple-900 text-white px-6 py-2 rounded" onClick={handleSave}>Save</button>
                        </div>
                    </form>
                    
                    </motion.div>
                </div>
               
                )}



           

            {/* new Add */}
            {isAddModalOpen &&(
             
             
             <div className="fixed -inset-40 z-50 max-w-4xl mx-auto mt-2 p-1 " style={{height:"100vh"}}>
                   <motion.div
                    
                className='w-full bg-white  rounded-lg shadow-md'
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}

            >
                   
                
                    <div className="bg-purple-900 text-white text-lg font-semibold p-4 rounded-t-lg flex justify-between items-center">
                        <span>Admission Enquiry</span>
                        <button onClick={() => setAddModalOpen(false)} className='text-gray-100 px-4 py-2 rounded-md'>
                                <X size={22} />
                            </button>
                        {/* <X size={22} /> */}
                        {/* <i class="fas fa-times cursor-pointer"></i> */}
                    </div>
                    <form className="p-4 space-y-4 text-black" onSubmit={handleAdd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-gray-700">Name  <sup>*</sup> </label>
          <input 
            type="text"
            className="w-full border border-gray-300 rounded p-2"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            required
          />
          
        </div>
        <div>
          <label className="block text-gray-700">Phone <sup>*</sup></label>
          <input 
            type="text"
            className="w-full border border-gray-300 rounded p-2"
            value={newUser.phone}
            onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
            required
          />
          <p className="text-red-500 text-sm">The contact must be 10 digits.</p>
        </div>
        <div>
          <label className="block text-gray-700">Email<sup>*</sup></label>
          <input 
            type="email"
            className="w-full border border-gray-300 rounded p-2"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-gray-700">Class<sup>*</sup></label>
          <select 
            className="w-full border border-gray-300 rounded p-2"
            value={newUser.className}
            onChange={(e) => setNewUser({ ...newUser, className: e.target.value })}
            required
          >
            <option>Select</option>
            <option>1st</option>
            <option>2nd</option>
            <option>3rd</option>
            <option>4th</option>
            <option>5th</option>
            <option>6th</option>
            <option>7th</option>
            <option>8th</option>
            <option>9th</option>
            <option>10th</option>
            <option>11th</option>
            <option>12th</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700">Status</label>
          <select 
            className="w-full border border-gray-300 rounded p-2"
            value={newUser.status}
            onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
          >
            <option>Select</option>
            <option>active</option>
            <option>inactive</option>
            <option>admitted</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700">Old School</label>
          <input 
            type="text"
            className="w-full border border-gray-300 rounded p-2"
            value={newUser.oldSchool}
            onChange={(e) => setNewUser({ ...newUser, oldSchool: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-gray-700">Date <sup>*</sup></label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="dd-MM-yyyy"
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>
        {/* <div>
          <label className="block text-gray-700">Status</label>
          <select 
            className="w-full border border-gray-300 rounded p-2"
            value={newUser.status}
            onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
          >
            <option>Select</option>
            <option>Active Student</option>
            <option>Enroll Student</option>
            <option>Inactive Student</option>
          </select>
        </div> */}
      
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-gray-700">Address<sup>*</sup></label>
          <textarea 
            className="w-full border border-gray-300 rounded p-2"
            value={newUser.address}
            onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
            required
          ></textarea>
        </div>
        <div>
          <label className="block text-gray-700">Description<sup>*</sup></label>
          <textarea 
            className="w-full border border-gray-300 rounded p-2"
            value={newUser.description}
            onChange={(e) => setNewUser({ ...newUser, description: e.target.value })}
            required
          ></textarea>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-gray-700">Father's Name<sup>*</sup></label>
          <input 
            type="text"
            className="w-full border border-gray-300 rounded p-2"
            value={newUser.parentName}
            onChange={(e) => setNewUser({ ...newUser, parentName: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button type='submit' className="bg-purple-900 text-white px-6 py-2 rounded" >
          Save
        </button>
      </div>
    </form>
                    
                    </motion.div>
                </div>
               
                )}

            </motion.div>
        </>
    );
};

export default EnquiryTable;
