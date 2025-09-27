import React from 'react';
// import StudentNavbar from './StudentNavbar';
// import StudentSidebar from './StudentSidebar';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const StudentReportCard = () => {
  const studentData = {
    name: "Ms. Riya Sharma",
    class: "10",
    rollNo: "23",
    yearOfStudy: "2022-23",
    registrationNumber: "2022-123",
    enrollmentNumber: "2022-456",
    schoolName: " School",
    examMonthYear: "May 2023",
    fatherName: "Mr. Ram Sharma",
    motherName: "Mrs. Mina Sharma",
    guardianContact: "+91 9874563210",
    results: [
      { subjectCode: "101", subject: "Mathematics", maxMarks: 100, unitTest: { theory: 85 }, halfYearly: { theory: 90 }, finalExam: { theory: 95 } },
      { subjectCode: "102", subject: "Science", maxMarks: 100, unitTest: { theory: 90 }, halfYearly: { theory: 85 }, finalExam: { theory: 80 } },
      { subjectCode: "103", subject: "English", maxMarks: 100, unitTest: { theory: 75 }, halfYearly: { theory: 80 }, finalExam: { theory: 70 } },
      { subjectCode: "104", subject: "Social Studies", maxMarks: 100, unitTest: { theory: 80 }, halfYearly: { theory: 85 }, finalExam: { theory: 90 } },
      { subjectCode: "105", subject: "Physical Education", maxMarks: 100, unitTest: { theory: 95 }, halfYearly: { theory: 90 }, finalExam: { theory: 100 } },
      { subjectCode: "106", subject: "Hindi", maxMarks: 100, unitTest: { theory: 88 }, halfYearly: { theory: 92 }, finalExam: { theory: 85 } },
      { subjectCode: "107", subject: "Computer Science", maxMarks: 100, unitTest: { theory: 90 }, halfYearly: { theory: 87 }, finalExam: { theory: 93 } },
      { subjectCode: "108", subject: "Art", maxMarks: 100, unitTest: { theory: 82 }, halfYearly: { theory: 88 }, finalExam: { theory: 90 } },
    ],
  };

  const calculateTotalMarks = (subject) => subject.unitTest.theory + subject.halfYearly.theory + subject.finalExam.theory;
  const calculateMaxTotalMarks = (subject) => subject.maxMarks * 3;
  const grandTotal = studentData.results.reduce((acc, subject) => acc + calculateTotalMarks(subject), 0);
  const maxTotal = studentData.results.length * 300; // 8 subjects * 300 max marks
  const percentage = ((grandTotal / maxTotal) * 100).toFixed(2);
  const grade = percentage >= 90 ? "A+" : percentage >= 80 ? "A" : percentage >= 70 ? "B" : percentage >= 60 ? "C" : percentage >= 50 ? "D" : "F";
  const result = percentage >= 50 ? "Passed" : "Failed";

  const downloadReportCard = () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;
    let y = margin;

    // Header
    doc.setFontSize(16).setTextColor(0, 0, 255).text(studentData.schoolName, margin, y);
    doc.setFontSize(14).text("Annual Examination Results", margin, (y += 7));
    doc.setFontSize(10).setTextColor(100).text("Affiliated with ABC Education Board", margin, (y += 5));
    doc.text("An Institution Committed to Excellence", margin, (y += 5));

    // Student & Parent Info
    doc.setFontSize(12).setTextColor(0).text("Parent/Guardian Information", margin, (y += 10));
    doc.setFontSize(10).text(`Father's Name: ${studentData.fatherName}`, margin, (y += 5));
    doc.text(`Mother's Name: ${studentData.motherName}`, margin, (y += 5));
    doc.text(`Contact: ${studentData.guardianContact}`, margin, (y += 5));
    doc.setFontSize(12).text(studentData.name, pageWidth - margin, y - 15, { align: "right" });
    doc.setFontSize(10).text(`Class: ${studentData.class}`, pageWidth - margin, y - 5, { align: "right" });
    doc.text(`Roll No: ${studentData.rollNo}`, pageWidth - margin, y, { align: "right" });

    // Additional Info
    doc.text(`Year of Study: ${studentData.yearOfStudy}`, margin, (y += 10));
    doc.text(`Registration No: ${studentData.registrationNumber}`, pageWidth / 3, y);
    doc.text(`Enrollment No: ${studentData.enrollmentNumber}`, (2 * pageWidth) / 3, y);

    // Marks Table
    doc.setFontSize(12).text("Marks Details", margin, (y += 10));
    doc.autoTable({
      startY: (y += 5),
      head: [["S.No", "Subject Code", "Subject Name", "Max. Marks", "Unit Test", "Half Yearly", "Final Exam", "Total"]],
      body: studentData.results.map((subject, index) => [
        index + 1,
        subject.subjectCode,
        subject.subject,
        subject.maxMarks,
        subject.unitTest.theory,
        subject.halfYearly.theory,
        subject.finalExam.theory,
        calculateTotalMarks(subject),
      ]),
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [173, 216, 230] },
    });

    // Summary
    y = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(10);
    doc.text(`Grand Total: ${grandTotal} / ${maxTotal}`, margin, y);
    doc.text(`Percentage: ${percentage}%`, margin, (y += 5));
    doc.text(`Result: ${result}`, margin, (y += 5));
    doc.text(`Exam Date: ${studentData.examMonthYear}`, margin, (y += 5));
    doc.text(`Grade: ${grade}`, pageWidth - margin, y - 10, { align: "right" });

    // Signatures
    doc.text(`Date of Result: ${studentData.dateOfResult}`, margin, (y += 10));
    doc.setFont("times", "italic").setTextColor(0, 0, 255).text("Mr. Robert Smith", pageWidth - 60, y, { align: "right" });
    doc.setFont("helvetica", "normal").setTextColor(0).text("(Principal)", pageWidth - 60, y + 5, { align: "right" });
    doc.setFont("times", "italic").setTextColor(0, 0, 255).text("Ms. Jane Doe", pageWidth - 20, y, { align: "right" });
    doc.setFont("helvetica", "normal").setTextColor(0).text("(Class Teacher)", pageWidth - 20, y + 5, { align: "right" });

    // Grading System
    doc.setFontSize(12).text("GRADING SYSTEM", pageWidth / 2, (y += 15), { align: "center" });
    doc.autoTable({
      startY: (y += 5),
      head: [["Percentage", "Grade"]],
      body: [["90% and above", "A+"], ["80% - 89%", "A"], ["70% - 79%", "B"], ["60% - 69%", "C"], ["50% - 59%", "D"], ["Below 50%", "F"]],
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [173, 216, 230] },
    });

    doc.save(`${studentData.name}_ReportCard.pdf`);
  };

  const gradingSystem = [
    { range: "90% and above", grade: "A+" },
    { range: "80% - 89%", grade: "A" },
    { range: "70% - 79%", grade: "B" },
    { range: "60% - 69%", grade: "C" },
    { range: "50% - 59%", grade: "D" },
    { range: "Below 50%", grade: "F" },
  ];

  // Function to handle printing
  const printReportCard = () => {
    const printContent = document.querySelector('.report-card-container').outerHTML;
    const originalBody = document.body.innerHTML;

    // Temporarily replace the body content with just the report card for printing
    document.body.innerHTML = `
      <html>
        <head>
          <title>Print Report Card</title>
          <style>
            /* Add your CSS styles here to ensure proper formatting */
            body { font-family: Arial, sans-serif; }
            .w-full { width: 100%; }
            .bg-white { background: white; }
            .shadow-lg { box-shadow: 0 10px 15px rgba(0,0,0,0.1); }
            .rounded-lg { border-radius: 0.5rem; }
            .p-6 { padding: 1.5rem; }
            /* Add more styles as needed */
          </style>
        </head>
        <body>${printContent}</body>
      </html>
    `;

    // Trigger the print dialog
    window.print();

    // Restore the original content after printing
    document.body.innerHTML = originalBody;
  };

  return (
    
        <div className="w-full mx-auto bg-white shadow-lg rounded-lg p-6">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-gray-300 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                  <div className="w-14 h-14 border-2 border-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white text-center leading-tight">SCHO<br />MARSHEET</span>
                  </div>
                </div>
                <div className="text-center">
                  <h1 className="text-blue-600 font-bold text-xl">{studentData.schoolName}</h1>
                  <h2 className="text-blue-600 font-semibold text-lg">Annual Examination Results</h2>
                  <p className="text-xs text-gray-700">Affiliated with ABC Education Board</p>
                  <p className="text-xs text-gray-700 italic">An Institution Committed to Excellence</p>
                </div>
              </div>
              <div className="w-24 h-24 border border-gray-300 rounded overflow-hidden">
                <img src="images/stu1.jpeg" alt="Student" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Student & Parent Info */}
            <div className="py-4 border-b border-gray-300 flex justify-between px-4">
              <div>
                <p className="text-sm font-semibold text-gray-600">Parent/Guardian Information</p>
                {[
                  `Father's Name: ${studentData.fatherName}`,
                  `Mother's Name: ${studentData.motherName}`,
                  `Contact: ${studentData.guardianContact}`,
                ].map((info, idx) => (
                  <p key={idx} className="text-xs text-gray-600">{info}</p>
                ))}
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">{studentData.name}</p>
                <p className="font-semibold text-sm mt-2">Class {studentData.class}</p>
                <p className="text-xs text-gray-600">Roll No: {studentData.rollNo}</p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="flex justify-between text-sm px-4 py-3 border-b border-gray-300">
              {[
                { label: "Year of Study", value: studentData.yearOfStudy },
                { label: "Registration No", value: studentData.registrationNumber },
                { label: "Enrollment No", value: studentData.enrollmentNumber },
                { label: "School", value: studentData.schoolName },
              ].map((item, idx) => (
                <div key={idx}><span className="font-semibold">{item.label}:</span> {item.value}</div>
              ))}
            </div>

            {/* Results Table */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-800">Marks Details</h3>
              <table className="w-full border-collapse text-sm mb-4">
                <thead>
                  <tr className="bg-blue-100 text-gray-800">
                    {["S.No", "Subject Code", "Subject Name", "Max. Marks", "Unit Test", "Half Yearly", "Final Exam", "Total Marks"].map((header) => (
                      <th key={header} className="border border-gray-300 p-2 text-center">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {studentData.results.map((subject, index) => (
                    <tr key={index} className="hover:bg-blue-50 transition-colors">
                      <td className="border border-gray-300 p-2 text-center">{index + 1}</td>
                      <td className="border border-gray-300 p-2">{subject.subjectCode}</td>
                      <td className="border border-gray-300 p-2">{subject.subject}</td>
                      <td className="border border-gray-300 p-2 text-center">{subject.maxMarks}</td>
                      <td className="border border-gray-300 p-2 text-center">{subject.unitTest.theory}</td>
                      <td className="border border-gray-300 p-2 text-center">{subject.halfYearly.theory}</td>
                      <td className="border border-gray-300 p-2 text-center">{subject.finalExam.theory}</td>
                      <td className="border border-gray-300 p-2 text-center">{calculateTotalMarks(subject)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="flex justify-between px-4 py-3 text-sm border-t border-gray-300">
              <div>
                {[
                  { label: "Grand Total", value: `${grandTotal} / ${maxTotal}` },
                  { label: "Percentage", value: `${percentage}%` },
                  { label: "Result", value: result },
                  { label: "Exam Date", value: studentData.examMonthYear },
                ].map((item, idx) => (
                  <p key={idx}><span className="font-semibold">{item.label}:</span> {item.value}</p>
                ))}
              </div>
              <div className="text-right">
                <p><span className="font-semibold">Grade:</span> {grade}</p>
              </div>
            </div>

            {/* Signatures */}
            <div className="flex justify-between px-4 py-3 text-xs border-t border-gray-300">
              <div>
                <p><span className="font-semibold">Date of Result:</span> {studentData.dateOfResult}</p>
              </div>
              <div className="text-right flex gap-8">
                {[
                  { name: "Mr. Robert Smith", role: "(Principal)" },
                  { name: "Ms. Jane Doe", role: "(Class Teacher)" },
                ].map((sign, idx) => (
                  <div key={idx}>
                    <p className="font-semibold italic text-blue-600">{sign.name}</p>
                    <p>{sign.role}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Grading System */}
            <div className="mt-6 border-t-4 border-b-4 border-blue-600 p-4">
              <h3 className="text-center font-bold text-lg mb-3">GRADING SYSTEM</h3>
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-blue-100 text-gray-800">
                    <th className="border border-gray-300 p-2 text-center">Percentage</th>
                    <th className="border border-gray-300 p-2 text-center">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {gradingSystem.map((item, idx) => (
                    <tr key={idx} className="hover:bg-blue-50">
                      <td className="border border-gray-300 p-2 text-center">{item.range}</td>
                      <td className="border border-gray-300 p-2 text-center">{item.grade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Download Button */}
            <div className="mt-6 text-center">
              <button
                onClick={downloadReportCard}
                className="bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition-colors"
              >
                Download Report Card
              </button>
            </div>
          </div>
      
      
    
  );
};

export default StudentReportCard;