import React, { useState } from 'react';
import { FaUser, FaBus, FaMoneyBillWave, FaMapMarkedAlt, FaDownload } from 'react-icons/fa';
import { MdCheckCircle } from 'react-icons/md';
import { jsPDF } from 'jspdf';
import StudentSidebar from './StudentSidebar';
import StudentNavbar from './StudentNavbar';

const StudentTransport = () => {
  const [studentData, setStudentData] = useState(() => {
    return JSON.parse(localStorage.getItem('studentTransportData')) || {
      name: 'Riya Sharma', id: 'STU2023001', class: 'Class 3',
      address: '123, Green Avenue, Sector 15, Delhi - 110015',
      fatherName: 'Rahul Sharma', fatherContact: '9876543210',
      motherName: 'Priya Sharma', motherContact: '8765432109',
      guardianName: 'Priya Sharma', guardianContact: '9876543210',
      pickupLocation: '', dropoffLocation: '', pickupTime: '', dropoffTime: ''
    };
  });

  const [selectedYear, setSelectedYear] = useState('2023');

  const feeData = {
    2023: [
      { period: 'Jan-Jun', amount: '₹6,000', status: 'Paid', date: '15 July, 2023', paymentMethod: 'Cash', receiptNo: 'REC2023001' },
      { period: 'Jul-Dec', amount: '₹6,000', status: 'Unpaid', date: 'N/A', paymentMethod: 'N/A', receiptNo: 'N/A' }
    ],
    2022: [
      { period: 'Jan-Jun', amount: '₹5,750', status: 'Paid', date: '20 Jan, 2022', paymentMethod: 'Cheque', receiptNo: 'REC2022001' },
      { period: 'Jul-Dec', amount: '₹5,750', status: 'Paid', date: '20 June, 2022', paymentMethod: 'Cash', receiptNo: 'REC2022002' }
    ],
    2021: [
      { period: 'Jan-Jun', amount: '₹5,500', status: 'Paid', date: '15 Jan, 2021', paymentMethod: 'Cash', receiptNo: 'REC2021001' },
      { period: 'Jul-Dec', amount: '₹5,500', status: 'Paid', date: '15 July, 2021', paymentMethod: 'Cheque', receiptNo: 'REC2021002' }
    ]
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudentData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = () => {
    localStorage.setItem('studentTransportData', JSON.stringify(studentData));
    alert('Changes saved successfully!');
  };

  const handleCancel = () => {
    setStudentData(JSON.parse(localStorage.getItem('studentTransportData')) || studentData);
  };

  const numberToWords = (num) => {
    const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    num = parseInt(num.replace('₹', '').replace(',', ''));
    if (!num) return 'Zero';
    
    let words = '';
    if (num >= 1000) words += `${units[Math.floor(num / 1000)]} Thousand `;
    if (num % 1000 >= 100) words += `${units[Math.floor((num % 1000) / 100)]} Hundred `;
    num %= 100;
    if (num >= 20) words += `${tens[Math.floor(num / 10)]} `;
    num %= 10;
    if (num >= 10) words += teens[num - 10];
    else if (num > 0) words += units[num];
    return `${words.trim()} Rupees Only`;
  };

  const generateReceiptContent = (doc, fee, copyFor) => {
    const config = { schoolName: "Global International School", margin: 15, pageWidth: 210, pageHeight: 297 };
    let y = config.margin;

    doc.setLineWidth(0.5);
    doc.rect(10, 10, config.pageWidth - 20, config.pageHeight - 20);
    
    doc.setFontSize(8).text(copyFor, config.pageWidth - config.margin - 5, y - 5, { align: "right" });
    doc.setFontSize(14).setFont("helvetica", "bold").text(config.schoolName, config.pageWidth / 2, y, { align: "center" });
    doc.addImage('images/stulogo.jpeg', 'JPEG', config.pageWidth / 2 - 15, y += 10, 30, 15);
    doc.setLineWidth(0.3).line(config.margin, y += 20, config.pageWidth - config.margin, y);

    const details = [
      [`Name: ${studentData.name}`, `Class: ${studentData.class}`],
      [`Receipt No: ${fee.receiptNo}`, `Date: ${fee.date}`],
      [`Session: ${selectedYear}`, `Installment: ${fee.period}`]
    ];
    
    doc.setFontSize(11).setFont("helvetica", "bold").text("Student Details", config.margin, y += 10);
    doc.setFont("helvetica", "normal");
    details.forEach(([left, right]) => {
      y += 8;
      doc.text(left, config.margin + 5, y);
      doc.text(right, config.pageWidth / 2 + 10, y);
    });

    doc.setFontSize(11).setFont("helvetica", "bold").text("Fee Details", config.margin, y += 10);
    const tableData = [["S.No", "Bus Fee", "Due", "Concession", "Paid"], ["1", fee.amount, "₹0", "₹0", fee.status === "Paid" ? fee.amount : "₹0"]];
    const colWidths = [15, 45, 45, 45, 40];
    const colPositions = colWidths.map((_, i) => config.margin + 5 + colWidths.slice(0, i).reduce((a, b) => a + b, 0));

    y += 5;
    doc.setFillColor(230, 230, 230).rect(config.margin, y, config.pageWidth - 30, 8, "F");
    tableData.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        doc.setFont("helvetica", rowIndex === 0 ? "bold" : "normal")
          .text(cell, colPositions[colIndex], y + 6, { maxWidth: colWidths[colIndex] });
      });
      doc.rect(config.margin, y, config.pageWidth - 30, 8);
      colPositions.slice(0, -1).forEach(pos => doc.line(pos + colWidths[colPositions.indexOf(pos)], y, pos + colWidths[colPositions.indexOf(pos)], y + 8));
      y += 8;
    });

    doc.setFontSize(11).setFont("helvetica", "bold").text("Payment Details", config.margin, y += 15);
    const paymentDetails = [`Payment Mode: ${fee.paymentMethod}`, ...(fee.paymentMethod === "Cheque" ? ["Bank: Sample Bank", "Cheque No: CHQ123456"] : []), `Date: ${fee.date}`];
    paymentDetails.forEach(detail => doc.setFont("helvetica", "normal").text(detail, config.margin + 5, y += 8));

    const totalAmount = fee.status === "Paid" ? fee.amount : "₹0";
    doc.line(config.margin, y += 15, config.pageWidth - config.margin, y);
    doc.setFont("helvetica", "bold").text("Total Amount", config.margin, y += 5);
    doc.setFont("helvetica", "normal").text(`In Words: ${numberToWords(totalAmount)}`, config.margin + 5, y += 8, { maxWidth: config.pageWidth - 30 });
    doc.text(`In Figures: ${totalAmount}`, config.pageWidth - config.margin - 5, y += 10, { align: "right" });

    doc.line(config.margin, config.pageHeight - 25, config.pageWidth - config.margin, config.pageHeight - 25);
    doc.setFontSize(8).text(`Generated on: ${new Date().toLocaleDateString()}`, config.margin + 5, config.pageHeight - 15)
      .text("Authorized Signatory", config.pageWidth - config.margin - 5, config.pageHeight - 15, { align: "right" });
  };

  const downloadPDF = (fee) => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    generateReceiptContent(doc, fee, "Student Copy");
    doc.addPage();
    generateReceiptContent(doc, fee, "Office Copy");
    doc.save(`transport_receipt_${selectedYear}_${fee.period}.pdf`);
  };

  const InputField = ({ label, name, value, type = "text", disabled = false, isTextarea = false }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {isTextarea ? (
        <textarea name={name} value={value} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" rows="3" placeholder={`Enter ${label.toLowerCase()}`} />
      ) : (
        <input type={type} name={name} value={value} onChange={handleInputChange} className={`w-full h-10 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${disabled ? 'bg-gray-100' : ''}`} disabled={disabled} />
      )}
    </div>
  );

  const StaticField = ({ label, value }) => (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-700">{label}</p>
      <p className="text-gray-900 bg-gray-100 p-2 rounded-md">{value}</p>
    </div>
  );

  return (
    <div className="bg-gray-100 font-[PT Sans] min-h-screen flex">
      <StudentSidebar className="fixed top-0 bottom-0 w-64 hidden md:block z-30 bg-white shadow-lg" />
      <div className="flex-1 md:ml-64">
        <StudentNavbar className="fixed top-0 left-0 right-0 md:left-64 z-20 bg-white shadow-md" />
        <main className="p-4 sm:p-6 lg:p-8">
          
          <div className="space-y-8">
            <section className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <header className="flex items-center mb-6 border-b border-gray-200 pb-4">
                <div className="bg-indigo-100 p-2 rounded-full mr-3"><FaUser className="text-indigo-600" /></div>
                <h2 className="text-xl font-semibold text-gray-800">Student Information</h2>
              </header>

              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center"><FaUser className="mr-2 text-indigo-600" /> Student Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField label="Student Name" name="name" value={studentData.name} disabled />
                  <InputField label="Student ID" name="id" value={studentData.id} disabled />
                  <InputField label="Class" name="class" value={studentData.class} disabled />
                  <InputField label="Address" name="address" value={studentData.address} disabled />
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center"><FaUser className="mr-2 text-indigo-600" /> Parents Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField label="Father's Name" name="fatherName" value={studentData.fatherName} disabled />
                  <InputField label="Father's Contact" name="fatherContact" value={studentData.fatherContact} disabled />
                  <InputField label="Mother's Name" name="motherName" value={studentData.motherName} disabled />
                  <InputField label="Mother's Contact" name="motherContact" value={studentData.motherContact} disabled />
                  <InputField label="Guardian Name" name="guardianName" value={studentData.guardianName} disabled />
                  <InputField label="Guardian Contact" name="guardianContact" value={studentData.guardianContact} disabled />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center"><FaBus className="mr-2 text-indigo-600" /> Bus Route Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StaticField label="Bus Route ID" value="RT-2023-456" />
                  <StaticField label="Route Number" value="Route 15A" />
                  <StaticField label="Starting Point" value="Global International School" />
                  <StaticField label="Destination" value="City Center" />
                  <StaticField label="Bus Driver" value="Rajesh Kumar" />
                </div>
              </div>
            </section>

            <section className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <header className="flex items-center mb-4">
                <div className="bg-indigo-100 p-2 rounded-full mr-3"><FaMoneyBillWave className="text-indigo-600" /></div>
                <h2 className="text-xl font-semibold">Transport Fees</h2>
              </header>
              <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)} className="w-full md:w-40 h-10 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 mb-4">
                {Object.keys(feeData).map(year => <option key={year} value={year}>{year}</option>)}
              </select>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse border border-gray-300">
                  <thead className="bg-indigo-50">
                    <tr>{["Period", "Fee Amount", "Payment Status", "Payment Date", "Action"].map((header, i) => (
                      <th key={i} className="p-3 text-sm font-semibold text-gray-700 border border-gray-300">{header}</th>
                    ))}</tr>
                  </thead>
                  <tbody>
                    {feeData[selectedYear].map((fee, index) => (
                      <tr key={index}>
                        <td className="p-3 border border-gray-300">{fee.period}</td>
                        <td className="p-3 border border-gray-300">{fee.amount}</td>
                        <td className="p-3 border border-gray-300">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${fee.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            <MdCheckCircle className="text-sm mr-1" /> {fee.status}
                          </span>
                        </td>
                        <td className="p-3 border border-gray-300">{fee.date}</td>
                        <td className="p-3 border border-gray-300">
                          <button onClick={() => downloadPDF(fee)} className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-1 px-2 rounded transition-colors">
                            <FaDownload className="mr-1" /> Download
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <header className="flex items-center mb-4">
                <div className="bg-indigo-100 p-2 rounded-full mr-3"><FaMapMarkedAlt className="text-indigo-600" /></div>
                <h2 className="text-xl font-semibold">Pickup & Drop-off Details</h2>
              </header>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Pickup Location" name="pickupLocation" value={studentData.pickupLocation} isTextarea />
                <InputField label="Drop-off Location" name="dropoffLocation" value={studentData.dropoffLocation} isTextarea />
                <InputField label="Pickup Time" name="pickupTime" value={studentData.pickupTime} type="time" />
                <InputField label="Drop-off Time" name="dropoffTime" value={studentData.dropoffTime} type="time" />
              </div>
            </section>

            <div className="flex justify-end space-x-4 mt-6">
              <button onClick={handleCancel} className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Cancel</button>
              <button onClick={handleSaveChanges} className="px-6 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Save Changes</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentTransport;