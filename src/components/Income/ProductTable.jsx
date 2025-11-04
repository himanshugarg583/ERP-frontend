import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit, Search, Trash2, X, ChevronLeft, ChevronRight, UserPlus } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint,faCoffee,faUser,faLanguage,faFileExcel,faFilePdf,faFileText} from '@fortawesome/free-solid-svg-icons';


// const Product_Data = [
//     { id: 1,  name: "School Building Maintenance", payor: "John Doe", amount: 12000, date: "2024-09-05", approvedby: "Principal" },
//     { id: 2,  name: "Library Books Purchase", payor: "Jane Smith", amount: 8000, date: "2024-10-15", approvedby: "Vice Principal" },
//     { id: 3,  name: "Science Lab Equipment", payor: "Alice Johnson", amount: 15000, date: "2024-11-20", approvedby: "Head of Department" },
//     { id: 4,  name: "Sports Equipment", payor: "Bob Brown", amount: 10000, date: "2024-12-01", approvedby: "Sports Coordinator" },
//     { id: 5,  name: "Computer Lab Setup", payor: "Charlie Davis", amount: 25000, date: "2024-08-25", approvedby: "IT Administrator" },
//     { id: 6,  name: "School Bus Maintenance", payor: "Eva Green", amount: 18000, date: "2024-07-30", approvedby: "Transport Manager" },
//     { id: 7,  name: "Cafeteria Renovation", payor: "Frank White", amount: 22000, date: "2024-06-10", approvedby: "Cafeteria Manager" },
//     { id: 8,  name: "Auditorium Sound System", payor: "Grace Lee", amount: 30000, date: "2024-05-05", approvedby: "Event Coordinator" },
//     { id: 9,  name: "School Uniforms", payor: "Henry Clark", amount: 9000, date: "2024-04-12", approvedby: "Uniform Incharge" },
//     { id: 10, name: "Smart Classroom Setup", payor: "Ivy Adams", amount: 35000, date: "2024-03-18", approvedby: "Academic Head" },
//     { id: 11, name: "School Playground Upgrade", payor: "Jack Wilson", amount: 20000, date: "2024-02-22", approvedby: "Sports Head" },
//     { id: 12, name: "Art Supplies", payor: "Karen Hall", amount: 7000, date: "2024-01-14", approvedby: "Art Teacher" },
//     { id: 13, name: "School Annual Function", payor: "Leo King", amount: 12000, date: "2024-09-30", approvedby: "Cultural Head" },
//     { id: 14, name: "Teacher Training Program", payor: "Mia Scott", amount: 15000, date: "2024-10-10", approvedby: "Training Coordinator" },
//     { id: 15, name: "School Security System", payor: "Noah Young", amount: 28000, date: "2024-11-25", approvedby: "Security Head" },
// ];



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
];
    
  











const ProductTable = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredProducts, setFilteredProducts] = useState(Product_Data);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [newProduct, setNewProduct] = useState({ name: "", payor: "", amount: "", date: "", approvedby: "" });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

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


    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const getCurrentPageProducts = () => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredProducts.slice(start, start + itemsPerPage);
    };

    return (
        <motion.div
            className='bg-white  shadow-lg backdrop-blur-md rounded-xl p-5   mb-6 relative z-10'
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.2 }}
        >


            {/* Income List */}
    <div style={{width:"100%"}} className=''>        

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

            <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-400'>
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
                                    {/* <img src="https://images.unsplash.com/photo-1627989580309-bfaf3e58af6f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8d2lyZWxlc3MlMjBlYXJidWRzfGVufDB8fDB8fHww" alt="Product_Image"
                                        className='rounded-full size-10'
                                    /> */}
                                    {product.name}
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-black'>{product.payor}</td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-black'>{product.amount.toFixed(2)}</td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-black'>{product.date}</td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-black'>{product.approvedby}</td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium h-full'>
                                    <div className='flex items-center gap-4 h-full'>
                                        {/* <button onClick={() => setAddModalOpen(true)} className='text-green-500 hover:text-green-700'>
                                            <UserPlus size={20} />
                                        </button> */}
                                        <button onClick={() => handleEdit(product)} className='text-blue-500 hover:text-blue-700'>
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
            {/* Edit model pop up */}


            {isEditModalOpen && (
                <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
                    <motion.div
                        className='bg-gray-800 rounded-lg shadow-lg p-6 max-w-xl w-full'
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                    >

                        <h1 className='text-2xl font-semibold text-gray-100 mb-3 underline tracking-wider'>Edit Product</h1>

                        {/* Responsive grid layout for fields */}
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div className='flex flex-col space-y-1'>
                                <label className='text-sm text-gray-300'>Product Name</label>
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
                            <button onClick={handleAdd} className='bg-blue-600 hover:bg-blue-800 text-white text-md px-4 py-3 rounded-md w-32'>
                                Add Product
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
};

export default ProductTable;
