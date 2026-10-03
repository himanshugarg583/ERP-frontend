import React, { useState } from "react";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Edit,
  Search,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  UserPlus,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faPrint,
  faCoffee,
  faUser,
  faLanguage,
  faFileExcel,
  faFilePdf,
  faFileText,
} from "@fortawesome/free-solid-svg-icons";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import React, { useState } from "react";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Edit,
  Search,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  UserPlus,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faPrint,
  faCoffee,
  faUser,
  faLanguage,
  faFileExcel,
  faFilePdf,
  faFileText,
} from "@fortawesome/free-solid-svg-icons";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import ReactModal from "react-modal";
import AdmitCard from "./Admit";
import StudentReportCard from "./StudentReportCard";
import AdmitCard from "./Admit";
import StudentReportCard from "./StudentReportCard";

const Receipt = ({ isOpen, onClose, receiptData }) => {
  return (
    <ReactModal
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
          width: "75vw",
          height: "95vh",
          margin: "auto",
          padding: "20px",
          border: "1px solid #ccc",
          zIndex: 1001, // Ensure the modal content is on top of the overlay
        },
      }}
    >
      <StudentReportCard />
      {/* <AdmitCard
      onRequestClose={onClose}
      contentLabel="Receipt"
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1000, // Ensure the overlay is on top
        },
        content: {
          width: "75vw",
          height: "95vh",
          margin: "auto",
          padding: "20px",
          border: "1px solid #ccc",
          zIndex: 1001, // Ensure the modal content is on top of the overlay
        },
      }}
    >
      <StudentReportCard />
      {/* <AdmitCard

        studentName="John Smith"
        rollNumber="2025001"
        className="Grade X-A"
        examDate="March 15, 2025"
        examTime="09:00 AM - 12:00 PM"
        examVenue="Main Examination Hall, Block A"
        // examSchedule={examSchedule}
      /> */}
    </ReactModal>
  );
};
    </ReactModal>
  );
};

const ReportCardtable = ({
  tabletitle,
  Product_Data,
  title1,
  title2,
  title3,
  title4,
  title5,
  title6,
}) => {
  const [searchTerm1, setSearchTerm1] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(Product_Data);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [editDate, setEditDate] = useState(null);
const ReportCardtable = ({
  tabletitle,
  Product_Data,
  title1,
  title2,
  title3,
  title4,
  title5,
  title6,
}) => {
  const [searchTerm1, setSearchTerm1] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(Product_Data);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [editDate, setEditDate] = useState(null);

  const [newProduct, setNewProduct] = useState({
    name: "",
    class: "",
    date: "",
    amount: "",
    sales: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [newProduct, setNewProduct] = useState({
    name: "",
    class: "",
    date: "",
    amount: "",
    sales: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const [searchTerm2, setSearchTerm2] = useState("");
  const [searchTerm3, setSearchTerm3] = useState("");
  const [searchTerm4, setSearchTerm4] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [searchTerm2, setSearchTerm2] = useState("");
  const [searchTerm3, setSearchTerm3] = useState("");
  const [searchTerm4, setSearchTerm4] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const SearchHandler2 = (e) => {
    const term1 = e.target.value.toLowerCase();
    setSearchTerm2(term1);
  };
  const SearchHandler2 = (e) => {
    const term1 = e.target.value.toLowerCase();
    setSearchTerm2(term1);
  };

  const SearchHandler3 = (e) => {
    const term1 = e.target.value.toLowerCase();
    setSearchTerm3(term1);
  };
  const SearchHandler3 = (e) => {
    const term1 = e.target.value.toLowerCase();
    setSearchTerm3(term1);
  };

  const SearchHandler4 = (e) => {
    const term1 = e.target.value.toLowerCase();
    setSearchTerm4(term1);
  };
  const SearchHandler4 = (e) => {
    const term1 = e.target.value.toLowerCase();
    setSearchTerm4(term1);
  };

  const Search3 = ({ SearchHandler2, SearchHandler3, SearchHandler4 }) => {
    const term2 = searchTerm2;
    const term3 = searchTerm3;
    const term4 = searchTerm4;

    const filtered = Product_Data.filter(
      (product) =>
        product.name.toLowerCase().includes(term2) &&
        product.class.toLowerCase().includes(term3)
      // && product.sales.toLowerCase().includes(term4)
    );
  const Search3 = ({ SearchHandler2, SearchHandler3, SearchHandler4 }) => {
    const term2 = searchTerm2;
    const term3 = searchTerm3;
    const term4 = searchTerm4;

    const filtered = Product_Data.filter(
      (product) =>
        product.name.toLowerCase().includes(term2) &&
        product.class.toLowerCase().includes(term3)
      // && product.sales.toLowerCase().includes(term4)
    );

    setFilteredProducts(filtered);
    setCurrentPage(1);
  };
    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setEditModalOpen(true);
    console.log("i am edit");
  };
  const handleEdit = (product) => {
    setEditProduct(product);
    setEditModalOpen(true);
    console.log("i am edit");
  };

  const handleDelete = (productId) => {
    const updatedProducts = filteredProducts.filter(
      (product) => product.id !== productId
    );
    setFilteredProducts(updatedProducts);
  };
  const handleDelete = (productId) => {
    const updatedProducts = filteredProducts.filter(
      (product) => product.id !== productId
    );
    setFilteredProducts(updatedProducts);
  };

  const handleAdd = () => {
    const newId =
      filteredProducts.length > 0
        ? Math.max(...filteredProducts.map((product) => product.id)) + 1
        : 1;
    const productToAdd = {
      ...newProduct,
      id: newId,
      date: parseFloat(newProduct.date),
      amount: parseInt(newProduct.amount),
      sales: parseInt(newProduct.sales),
    };
    setFilteredProducts([productToAdd, ...filteredProducts]);
    setAddModalOpen(false);
    setNewProduct({ name: "", class: "", date: "", amount: "", sales: "" });
  };
  const handleAdd = () => {
    const newId =
      filteredProducts.length > 0
        ? Math.max(...filteredProducts.map((product) => product.id)) + 1
        : 1;
    const productToAdd = {
      ...newProduct,
      id: newId,
      date: parseFloat(newProduct.date),
      amount: parseInt(newProduct.amount),
      sales: parseInt(newProduct.sales),
    };
    setFilteredProducts([productToAdd, ...filteredProducts]);
    setAddModalOpen(false);
    setNewProduct({ name: "", class: "", date: "", amount: "", sales: "" });
  };

  const handleSave = () => {
    const updatedProducts = filteredProducts.map((product) =>
      product.id === editProduct.id ? editProduct : product
    );
    setFilteredProducts(updatedProducts);
    setEditModalOpen(false);
  };
  const handleSave = () => {
    const updatedProducts = filteredProducts.map((product) =>
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
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const getCurrentPageProducts = () => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("User Information Table", 14, 10);
    const tableColumn = ["Name", "Age", "Country"];
    const tableRows = Product_Data.map((item) => [
      item.name,
      item.email,
      item.role,
    ]);
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
    });
    doc.save("table.pdf");
  };
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("User Information Table", 14, 10);
    const tableColumn = ["Name", "Age", "Country"];
    const tableRows = Product_Data.map((item) => [
      item.name,
      item.email,
      item.role,
    ]);
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
    });
    doc.save("table.pdf");
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(Product_Data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(blob, "data.xlsx");
  };
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(Product_Data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(blob, "data.xlsx");
  };

  const downloadCSV = () => {
    const headers = ["Name", "Email", "Role", "Status"];
    const rows = Product_Data.map((row) => [
      row.name,
      row.email,
      row.role,
      row.status,
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const downloadCSV = () => {
    const headers = ["Name", "Email", "Role", "Status"];
    const rows = Product_Data.map((row) => [
      row.name,
      row.email,
      row.role,
      row.status,
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // view handle click
  const handleViewClick = (data) => {
    setSelectedReceipt(data);
    setIsModalOpen(true);
    console.log(data);
  };
  // view handle click
  const handleViewClick = (data) => {
    setSelectedReceipt(data);
    setIsModalOpen(true);
    console.log(data);
  };

  return (
   <div className="w-full p-4">
     <motion.div
      className="bg-white  shadow-lg backdrop-blur-md rounded-xl p-5   mb-6 relative z-1"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: 0.2 }}
    >
      <div class="bg-gray-100 flex items-center justify-center w-full">
        {/* max-w-4xl */}
        <div class="bg-white shadow-md rounded-lg p-6 w-full ">
          <div class="border-b pb-4 mb-4">
  return (
   <div className="w-full p-4">
     <motion.div
      className="bg-white  shadow-lg backdrop-blur-md rounded-xl p-5   mb-6 relative z-1"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: 0.2 }}
    >
      <div class="bg-gray-100 flex items-center justify-center w-full">
        {/* max-w-4xl */}
        <div class="bg-white shadow-md rounded-lg p-6 w-full ">
          <div class="border-b pb-4 mb-4">
            <h2 class="text-lg font-semibold text-gray-700 flex items-center">
              <i class="fas fa-search text-violet-600 mr-2"></i> Select Criteria
              <i class="fas fa-search text-violet-600 mr-2"></i> Select Criteria
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-gray-700">Exam Name</label>
              <input
                type="text"
                class="text-black mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent"
                placeholder="Enter Name"
                onChange={SearchHandler2}
              />
              <label class="block text-gray-700">Exam Name</label>
              <input
                type="text"
                class="text-black mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent"
                placeholder="Enter Name"
                onChange={SearchHandler2}
              />
            </div>
            <div>
              <label class="block text-gray-700">
                Class<i class="fas fa-calendar-alt text-violet-600"></i>
              </label>
              {/* <input type="text" class="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-100 text-gray-500" placeholder="Enter Start Date" onChange={SearchHandler3}/> */}
              <select
                class="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-100 text-gray-500"
                placeholder="Enter Start Date"
                onChange={SearchHandler3}
              >
              <label class="block text-gray-700">
                Class<i class="fas fa-calendar-alt text-violet-600"></i>
              </label>
              {/* <input type="text" class="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-100 text-gray-500" placeholder="Enter Start Date" onChange={SearchHandler3}/> */}
              <select
                class="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-100 text-gray-500"
                placeholder="Enter Start Date"
                onChange={SearchHandler3}
              >
                <option>select</option>
                <option>5th</option>
                <option>6th</option>
                <option>7th</option>
              </select>
                <option>5th</option>
                <option>6th</option>
                <option>7th</option>
              </select>
            </div>
            <div>
              <label class="block text-gray-700">
                Section<i class="fas fa-calendar-alt text-violet-600"></i>
              </label>

              <select
                class="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-100 text-gray-500"
                placeholder="Enter Start Date"
              >
              <label class="block text-gray-700">
                Section<i class="fas fa-calendar-alt text-violet-600"></i>
              </label>

              <select
                class="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-100 text-gray-500"
                placeholder="Enter Start Date"
              >
                <option>select</option>
                <option>5th</option>
                <option>6th</option>
                <option>7th</option>
              </select>
                <option>5th</option>
                <option>6th</option>
                <option>7th</option>
              </select>
            </div>
          </div>
          </div>

          <div class="mt-6 flex justify-end">
            <button
              class="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-md flex items-center"
              onClick={Search3}
            >
              <i class="fas fa-search mr-2"></i> Search
          <div class="mt-6 flex justify-end">
            <button
              class="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-md flex items-center"
              onClick={Search3}
            >
              <i class="fas fa-search mr-2"></i> Search
            </button>
          </div>
        </div>
      </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-400">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider">
                {title1}
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider">
                {title2}
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider">
                {title3}
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider">
                {title4}
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider">
                {title5}
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider">
                {title6}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-500">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-black">
                  NO Data Found
                </td>
              </tr>
            ) : (
              getCurrentPageProducts().map((product) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.1, delay: 0.2 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black flex gap-2 items-center">
                    {/* <img src={ASSET_URLS.unsplashEarbuds} alt="Product_Image"
                                            className='rounded-full size-10'
                                        /> */}
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                    {product.class}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                    {product.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                    {product.amount}
                  </td>
                  {/* <td className='px-6 py-4 whitespace-nowrap text-sm text-black'>{product.sales}</td> */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium h-full">
                    <div className="flex items-center gap-4 h-full">
                      <button
                        onClick={() => handleViewClick(product)}
                        className="text-green-500 hover:text-green-600"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      {/* <button onClick={() => handleEdit(product)} className='text-blue-500 hover:text-blue-700'>
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                    {product.class}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                    {product.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                    {product.amount}
                  </td>
                  {/* <td className='px-6 py-4 whitespace-nowrap text-sm text-black'>{product.sales}</td> */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium h-full">
                    <div className="flex items-center gap-4 h-full">
                      <button
                        onClick={() => handleViewClick(product)}
                        className="text-green-500 hover:text-green-600"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      {/* <button onClick={() => handleEdit(product)} className='text-blue-500 hover:text-blue-700'>
                                                <Edit size={18} />
                                            </button> */}
                      {/* <button onClick={() => handleDelete(product.id)} className='text-red-500 hover:text-red-700'>
                      {/* <button onClick={() => handleDelete(product.id)} className='text-red-500 hover:text-red-700'>
                                                <Trash2 size={18} />
                                            </button> */}
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Receipt
      <Receipt
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        receiptData={selectedReceipt || { name: "", class: "" }}
      />
    </motion.div>
   </div>
  );
      />
    </motion.div>
   </div>
  );
};

export default ReportCardtable;
