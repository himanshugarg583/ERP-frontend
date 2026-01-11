import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import Header from "../../../components/comman_components/Header";
import { 
  getAllClassesDropdown,
  getAllStudentsByClass,
  getStudentExamHistory
} from '../../../helper/requests-method/apiMethods';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ReportCardPage = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [examHistory, setExamHistory] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [showMarksheet, setShowMarksheet] = useState(false);

  // Fetch classes on component mount
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const response = await getAllClassesDropdown();
        if (response?.data) {
          setClasses(response.data);
        }
      } catch (error) {
        console.error('Error fetching classes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  // Fetch students when class is selected
  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedClass) {
        setStudents([]);
        return;
      }

      try {
        setLoading(true);
        const response = await getAllStudentsByClass(selectedClass);
        if (response?.data) {
          setStudents(response.data);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [selectedClass]);

  // Fetch student exam history
  const handleGenerateMarksheet = async (student) => {
    setSelectedStudent(student);
    setLoadingHistory(true);
    
    try {
      const response = await getStudentExamHistory(student.id);
      if (response?.data) {
        setExamHistory(response.data);
        setShowMarksheet(true);
      }
    } catch (error) {
      console.error('Error fetching exam history:', error);
      alert('Failed to fetch student exam history');
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleCloseMarksheet = () => {
    setShowMarksheet(false);
    setSelectedStudent(null);
    setExamHistory(null);
  };

  // Generate PDF Marksheet
  const generatePDF = () => {
    if (!examHistory) return;

    const doc = new jsPDF();
    const studentInfo = examHistory.student_info;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Function to draw border
    const drawBorder = () => {
      doc.setDrawColor(124, 58, 237); // Violet color
      doc.setLineWidth(1);
      doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
      doc.setLineWidth(0.5);
      doc.rect(12, 12, pageWidth - 24, pageHeight - 24);
    };

    drawBorder();

    // School Header
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(124, 58, 237);
    doc.text('SCHOOL NAME', pageWidth / 2, 25, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text('Address Line 1, City, State - PIN Code', pageWidth / 2, 32, { align: 'center' });
    doc.text('Phone: +91-XXXXXXXXXX | Email: school@example.com', pageWidth / 2, 37, { align: 'center' });
    
    // Horizontal line
    doc.setDrawColor(124, 58, 237);
    doc.setLineWidth(0.5);
    doc.line(15, 42, pageWidth - 15, 42);

    // Marksheet Title
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(124, 58, 237);
    doc.text('ACADEMIC MARKSHEET', pageWidth / 2, 50, { align: 'center' });
    
    // Student Details Box
    doc.setFillColor(240, 240, 250);
    doc.roundedRect(15, 55, pageWidth - 30, 28, 2, 2, 'F');
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Student Name:', 20, 62);
    doc.text('Roll Number:', 20, 69);
    doc.text('Class:', 20, 76);
    
    doc.setFont(undefined, 'normal');
    doc.text(studentInfo.student_name, 50, 62);
    doc.text(studentInfo.roll_number, 50, 69);
    doc.text(studentInfo.class, 50, 76);
    
    doc.setFont(undefined, 'bold');
    doc.text('Email:', pageWidth / 2 + 10, 62);
    doc.text('Academic Year:', pageWidth / 2 + 10, 69);
    
    doc.setFont(undefined, 'normal');
    doc.text(studentInfo.email, pageWidth / 2 + 30, 62);
    doc.text(examHistory.exam_history?.[0]?.academic_year || 'N/A', pageWidth / 2 + 30, 69);

    let yPosition = 90;

    examHistory.exam_history?.forEach((term, termIndex) => {
      term.exams?.forEach((exam) => {
        // Check if we need a new page
        if (yPosition > pageHeight - 70) {
          doc.addPage();
          drawBorder();
          yPosition = 20;
        }

        // Term/Exam Header
        doc.setFillColor(124, 58, 237);
        doc.rect(15, yPosition - 5, pageWidth - 30, 10, 'F');
        
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(255, 255, 255);
        doc.text(`${term.term_name} - ${exam.exam_name}`, 20, yPosition + 1);
        
        yPosition += 12;

        // Exam Summary Box
        doc.setFillColor(245, 245, 255);
        doc.roundedRect(15, yPosition, pageWidth - 30, 12, 1, 1, 'F');
        
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        doc.setFont(undefined, 'bold');
        doc.text('Total Marks: ', 20, yPosition + 5);
        doc.setFont(undefined, 'normal');
        doc.text(exam.total_marks.toString(), 45, yPosition + 5);
        
        doc.setFont(undefined, 'bold');
        doc.text('Obtained: ', 70, yPosition + 5);
        doc.setFont(undefined, 'normal');
        doc.text((exam.total_marks_obtained || 0).toString(), 90, yPosition + 5);
        
        doc.setFont(undefined, 'bold');
        doc.text('Passing Marks: ', 115, yPosition + 5);
        doc.setFont(undefined, 'normal');
        doc.text(exam.passing_marks.toString(), 145, yPosition + 5);
        
        doc.setFont(undefined, 'bold');
        doc.text('Result: ', 170, yPosition + 5);
        
        if (exam.is_passed !== null) {
          doc.setTextColor(exam.is_passed ? 0 : 255, exam.is_passed ? 128 : 0, 0);
          doc.setFont(undefined, 'bold');
          doc.text(exam.is_passed ? 'PASSED' : 'FAILED', 185, yPosition + 5);
          doc.setTextColor(0, 0, 0);
        } else {
          doc.text('Pending', 185, yPosition + 5);
        }
        
        doc.setFont(undefined, 'normal');
        doc.setFontSize(8);
        doc.text(`Exam Period: ${exam.start_date} to ${exam.end_date}`, 20, yPosition + 9);

        yPosition += 16;

        // Subjects Table
        if (exam.subjects?.length > 0) {
          const tableData = exam.subjects.map((subject, idx) => [
            (idx + 1).toString(),
            subject.subject_name,
            subject.subject_code,
            subject.exam_date || '-',
            subject.max_marks.toString(),
            subject.marks_obtained !== null ? subject.marks_obtained.toString() : '-'
          ]);

          doc.autoTable({
            startY: yPosition,
            head: [['S.No', 'Subject Name', 'Code', 'Exam Date', 'Max Marks', 'Marks Obtained']],
            body: tableData,
            theme: 'grid',
            headStyles: { 
              fillColor: [124, 58, 237],
              textColor: [255, 255, 255],
              fontStyle: 'bold',
              halign: 'center',
              fontSize: 9
            },
            bodyStyles: {
              fontSize: 8,
              cellPadding: 3
            },
            columnStyles: {
              0: { halign: 'center', cellWidth: 15 },
              1: { cellWidth: 60 },
              2: { halign: 'center', cellWidth: 25 },
              3: { halign: 'center', cellWidth: 30 },
              4: { halign: 'center', cellWidth: 25 },
              5: { halign: 'center', cellWidth: 30, fontStyle: 'bold' }
            },
            margin: { left: 15, right: 15 },
            alternateRowStyles: {
              fillColor: [250, 250, 255]
            },
            didDrawPage: function(data) {
              // Draw border on each page
              if (data.pageNumber > 1) {
                drawBorder();
              }
            }
          });

          yPosition = doc.lastAutoTable.finalY + 8;
        }
      });
    });

    // Footer on last page
    const finalY = yPosition + 20;
    if (finalY > pageHeight - 50) {
      doc.addPage();
      drawBorder();
      yPosition = 20;
    }

    // Grading Scale
    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    doc.text('Grading Scale:', 15, yPosition + 10);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(8);
    doc.text('A+: 90-100 | A: 80-89 | B+: 70-79 | B: 60-69 | C: 50-59 | D: 40-49 | F: Below 40', 15, yPosition + 15);

    // Signature Section
    yPosition += 30;
    
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    
    // Class Teacher
    doc.line(20, yPosition, 70, yPosition);
    doc.text('Class Teacher', 35, yPosition + 5);
    
    // Principal
    doc.line(pageWidth - 70, yPosition, pageWidth - 20, yPosition);
    doc.text('Principal', pageWidth - 55, yPosition + 5);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN')}`, pageWidth / 2, pageHeight - 15, { align: 'center' });
    doc.text('This is a computer-generated document. No signature is required.', pageWidth / 2, pageHeight - 10, { align: 'center' });

    doc.save(`${studentInfo.student_name}_Marksheet.pdf`);
  };

  return (
    <div className='bg-slate-200 flex AddStudent'>
      <Sidebar />
      
      <div className='overflow-auto relative z-1 flex-col' style={{
        height: '95vh',
        width: '100vw',
        gap: '10px',
        display: 'flex',
        transition: 'margin-left 0.3s ease'
      }}>
        <Header />
        
        <main className="p-6">
          <div className="bg-white shadow-xl rounded-xl p-6">
            <h2 className="text-3xl font-bold text-violet-700 mb-6 text-center">
              Student Report Card
            </h2>

            {/* Class Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Class Section
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full md:w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-violet-600 focus:border-violet-600"
                disabled={loading}
              >
                <option value="">-- Select Class Section --</option>
                {classes.map((classItem) => (
                  <option key={classItem.id} value={classItem.id}>
                    {classItem.class_name} - {classItem.section_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-violet-700"></div>
                <p className="mt-2 text-gray-600">Loading students...</p>
              </div>
            )}

            {/* Students Table */}
            {!loading && students.length > 0 && (
              <div className="overflow-x-auto">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Total Students: {students.length}
                </h3>
                <table className="w-full border-collapse text-sm">
                  <thead className="bg-violet-600 text-white">
                    <tr>
                      <th className="py-3 px-4 text-left">S.No</th>
                      <th className="py-3 px-4 text-left">Roll No</th>
                      <th className="py-3 px-4 text-left">Student Name</th>
                      <th className="py-3 px-4 text-left">Email</th>
                      <th className="py-3 px-4 text-left">Phone</th>
                      <th className="py-3 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, index) => (
                      <tr 
                        key={student.id} 
                        className="border-b hover:bg-violet-50 transition-colors"
                      >
                        <td className="py-3 px-4">{index + 1}</td>
                        <td className="py-3 px-4">{student.roll_number || 'N/A'}</td>
                        <td className="py-3 px-4 font-medium">{student.name}</td>
                        <td className="py-3 px-4">{student.email || 'N/A'}</td>
                        <td className="py-3 px-4">{student.phone_no || 'N/A'}</td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleGenerateMarksheet(student)}
                            disabled={loadingHistory}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm disabled:bg-gray-400"
                          >
                            {loadingHistory && selectedStudent?.id === student.id ? 'Loading...' : 'Generate Marksheet'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {!loading && !selectedClass && (
              <div className="text-center py-8">
                <p className="text-gray-600">Please select a class section to view students.</p>
              </div>
            )}

            {!loading && selectedClass && students.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-600">No students found in this class.</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Marksheet Modal */}
      {showMarksheet && examHistory && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[85vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-violet-700 text-white p-4 rounded-t-xl flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">Student Marksheet</h2>
                <p className="text-violet-200 text-sm mt-1">
                  {examHistory.student_info?.student_name} ({examHistory.student_info?.roll_number})
                </p>
              </div>
              <button
                onClick={handleCloseMarksheet}
                className="text-white hover:bg-violet-800 rounded-full p-2 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Marksheet Content */}
            <div className="p-6">
              {/* Student Info */}
              <div className="bg-gradient-to-r from-violet-100 to-blue-100 p-4 rounded-lg mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <p className="text-xs text-gray-600">Student Name</p>
                    <p className="font-semibold text-base">{examHistory.student_info?.student_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Email</p>
                    <p className="font-semibold text-sm">{examHistory.student_info?.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Class</p>
                    <p className="font-semibold text-sm">{examHistory.student_info?.class}</p>
                  </div>
                </div>
              </div>

              {/* Exam History */}
              {examHistory.exam_history?.map((term) => (
                <div key={term.term_id} className="mb-6">
                  <div className="bg-violet-600 text-white p-3 rounded-t-lg">
                    <h3 className="text-lg font-bold">{term.term_name}</h3>
                    <p className="text-violet-200 text-sm">{term.academic_year}</p>
                  </div>

                  {term.exams?.map((exam) => (
                    <div key={exam.exam_id} className="border border-gray-300 mb-3">
                      <div className="bg-gray-100 p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-base font-bold">{exam.exam_name}</h4>
                            <p className="text-xs text-gray-600">{exam.description}</p>
                          </div>
                          {exam.is_passed !== null && (
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              exam.is_passed ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                            }`}>
                              {exam.is_passed ? 'PASSED' : 'FAILED'}
                            </span>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-3 gap-3 mt-3">
                          <div>
                            <p className="text-xs text-gray-600">Total Marks</p>
                            <p className="font-bold text-base text-blue-700">{exam.total_marks}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Obtained</p>
                            <p className="font-bold text-base text-green-700">{exam.total_marks_obtained || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Passing Marks</p>
                            <p className="font-bold text-base text-orange-700">{exam.passing_marks}</p>
                          </div>
                        </div>
                      </div>

                      {/* Subjects Table */}
                      {exam.subjects?.length > 0 && (
                        <table className="w-full text-xs">
                          <thead className="bg-gray-200">
                            <tr>
                              <th className="py-2 px-2 text-left">Subject</th>
                              <th className="py-2 px-2 text-center">Max Marks</th>
                              <th className="py-2 px-2 text-center">Marks Obtained</th>
                            </tr>
                          </thead>
                          <tbody>
                            {exam.subjects.map((subject) => (
                              <tr key={subject.subject_id} className="border-b">
                                <td className="py-2 px-2 font-medium">{subject.subject_name}</td>
                                <td className="py-2 px-2 text-center">{subject.max_marks}</td>
                                <td className="py-2 px-2 text-center font-bold text-blue-700">
                                  {subject.marks_obtained !== null ? subject.marks_obtained : '-'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-100 p-3 rounded-b-xl flex justify-end gap-2">
              <button
                onClick={generatePDF}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Download PDF
              </button>
              <button
                onClick={() => window.print()}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                Print
              </button>
              <button
                onClick={handleCloseMarksheet}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportCardPage;

