import React, { useState } from 'react';
import html2pdf from 'html2pdf.js';
import { FaDownload } from 'react-icons/fa'; // Import the download icon

// Convert number to words (handles up to 99999)
const numberToWords = (num) => {
    const ones = [
        "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
        "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen",
        "Eighteen", "Nineteen"
    ];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    if (num === 0) return "Zero";
    if (num < 20) return ones[num];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? " " + ones[num % 10] : "");
    if (num < 1000) {
        return ones[Math.floor(num / 100)] + " Hundred" + (num % 100 !== 0 ? " and " + numberToWords(num % 100) : "");
    }
    if (num < 100000) {
        return (
            numberToWords(Math.floor(num / 1000)) +
            " Thousand" +
            (num % 1000 !== 0 ? " " + numberToWords(num % 1000) : "")
        );
    }
    return "Number too large";
};

const ParentReceipt = () => {
    const [formData] = useState({
        studentName: 'Rahul Sharma',
        studentClass: 'IX-A',
        receiptNo: 'O/TF/2025-2026/1001',
        admissionFee: '15,000',
        tuitionFee: '40,000',
        examinationFee: '8,000',
        libraryFee: '5,000',
        transportFee: '7,500',
        sportsFee: '4,000',
        miscellaneousFee: '3,000',
        date: new Date().toLocaleDateString(),
    });

    const handleDownloadReceipt = () => {
        // Calculate total amount
        const total = parseFloat(formData.admissionFee.replace(/,/g, '')) +
            parseFloat(formData.tuitionFee.replace(/,/g, '')) +
            parseFloat(formData.examinationFee.replace(/,/g, '')) +
            parseFloat(formData.libraryFee.replace(/,/g, '')) +
            parseFloat(formData.transportFee.replace(/,/g, '')) +
            parseFloat(formData.sportsFee.replace(/,/g, '')) +
            parseFloat(formData.miscellaneousFee.replace(/,/g, ''));

        // Convert total amount to words
        const amountInWords = numberToWords(total) + " Rupees Only";

        // Generate Receipt and PDF
        const studentReceipt = `
      <div style="font-family: Arial, sans-serif; margin: 0 auto; width: 100%; max-width: 600px; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h1 style="text-align: center; font-size: 24px; margin-bottom: 10px;">Maheshwari Public School</h1>
        <p style="text-align: center; font-size: 14px;">Affiliated to CBSE, Delhi</p>
        <p style="text-align: center; font-size: 14px;">Contact: +91 9876543210</p>
        <hr style="margin: 20px 0;">
        <h2 style="text-align: center; font-size: 18px; margin-bottom: 20px;">Thank you for your payment!</h2>
        <h3 style="text-align: center; font-size: 16px; margin-bottom: 20px;">Student Copy</h3>
        <table style="width: 100%; margin-bottom: 20px; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; font-weight: bold;">Student Name:</td>
            <td style="padding: 8px;">${formData.studentName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Class:</td>
            <td style="padding: 8px;">${formData.studentClass}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Receipt Number:</td>
            <td style="padding: 8px;">${formData.receiptNo}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Date:</td>
            <td style="padding: 8px;">${formData.date}</td>
          </tr>
        </table>
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
          <thead>
            <tr style="background-color: #f5f5f5;">
              <th style="padding: 8px; border: 1px solid #ddd;">Sr. No.</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Payment Details</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">1</td>
              <td style="padding: 8px; border: 1px solid #ddd;">Admission Fee</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${formData.admissionFee}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">2</td>
              <td style="padding: 8px; border: 1px solid #ddd;">Tuition Fee</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${formData.tuitionFee}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">3</td>
              <td style="padding: 8px; border: 1px solid #ddd;">Examination Fee</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${formData.examinationFee}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">4</td>
              <td style="padding: 8px; border: 1px solid #ddd;">Library Fee</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${formData.libraryFee}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">5</td>
              <td style="padding: 8px; border: 1px solid #ddd;">Transport Fee</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${formData.transportFee}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">6</td>
              <td style="padding: 8px; border: 1px solid #ddd;">Sports / Extracurricular Fees</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${formData.sportsFee}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">7</td>
              <td style="padding: 8px; border: 1px solid #ddd;">Miscellaneous Charges</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${formData.miscellaneousFee}</td>
            </tr>
            <tr>
              <td colspan="2" style="padding: 8px; border: 1px solid #ddd; text-align: right; font-weight: bold;">Total</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${total}</td>
            </tr>
          </tbody>
        </table>
        <p style="margin-top: 20px; font-weight: bold;">Amount in Words: ${amountInWords}</p>
        <hr style="margin: 20px 0;">
      </div>
    `;

        const officeReceipt = `
      <div style="font-family: Arial, sans-serif; margin: 0 auto; width: 100%; max-width: 600px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; page-break-before: always;">
        <h1 style="text-align: center; font-size: 24px; margin-bottom: 10px;">Maheshwari Public School</h1>
        <p style="text-align: center; font-size: 14px;">Affiliated to CBSE, Delhi</p>
        <p style="text-align: center; font-size: 14px;">Contact: +91 9876543210</p>
        <hr style="margin: 20px 0;">
        <h2 style="text-align: center; font-size: 18px; margin-bottom: 20px;">Office Copy</h2>
        <h3 style="text-align: center; font-size: 16px; margin-bottom: 20px;">Thank you for your payment!</h3>
        <table style="width: 100%; margin-bottom: 20px; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; font-weight: bold;">Student Name:</td>
            <td style="padding: 8px;">${formData.studentName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Class:</td>
            <td style="padding: 8px;">${formData.studentClass}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Receipt Number:</td>
            <td style="padding: 8px;">${formData.receiptNo}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Date:</td>
            <td style="padding: 8px;">${formData.date}</td>
          </tr>
        </table>
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
          <thead>
            <tr style="background-color: #f5f5f5;">
              <th style="padding: 8px; border: 1px solid #ddd;">Sr. No.</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Payment Details</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">1</td>
              <td style="padding: 8px; border: 1px solid #ddd;">Tuition Fee</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${formData.tuitionFee}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">2</td>
              <td style="padding: 8px; border: 1px solid #ddd;">Examination Fee</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${formData.examinationFee}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">3</td>
              <td style="padding: 8px; border: 1px solid #ddd;">Library Fee</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${formData.libraryFee}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">4</td>
              <td style="padding: 8px; border: 1px solid #ddd;">Transport Fee</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${formData.transportFee}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">5</td>
              <td style="padding: 8px; border: 1px solid #ddd;">Sports / Extracurricular Fees</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${formData.sportsFee}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">6</td>
              <td style="padding: 8px; border: 1px solid #ddd;">Miscellaneous Charges</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${formData.miscellaneousFee}</td>
            </tr>
            <tr>
              <td colspan="2" style="padding: 8px; border: 1px solid #ddd; text-align: right; font-weight: bold;">Total</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${total}</td>
            </tr>
          </tbody>
        </table>
        <p style="margin-top: 20px; font-weight: bold;">Amount in Words: ${amountInWords}</p>
        <hr style="margin: 20px 0;">
      </div>
    `;

        // Create PDF
        const options = {
            margin: 0.5,
            filename: 'school_receipt.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        // Generate PDF with both sections
        html2pdf().from(studentReceipt + officeReceipt).set(options).save();
    };

    return (
        <button
            onClick={handleDownloadReceipt}
            className="text-indigo-600 hover:text-indigo-900 flex items-center"
        >
            <FaDownload className="text-sm mr-1" /> Receipt
        </button>
    );
};

export default ParentReceipt;