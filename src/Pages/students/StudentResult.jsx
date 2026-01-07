import React, { useState, useEffect } from 'react';
import StudentSidebar from './StudentSidebar';
import Header from '../../components/comman_components/Header';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { getExamTermDropdown, getExamDropdown, getStudentExamResult } from '../../helper/requests-method/apiMethods';
import { toast } from 'react-toastify';

const StudentResult = () => {
  const [terms, setTerms] = useState([]);
  const [exams, setExams] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [examData, setExamData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch terms on component mount
  useEffect(() => {
    fetchTerms();
  }, []);

  // Fetch exams when term is selected
  useEffect(() => {
    if (selectedTerm) {
      fetchExams(selectedTerm);
    } else {
      setExams([]);
      setSelectedExam('');
      setExamData(null);
    }
  }, [selectedTerm]);

  // Fetch exam result when exam is selected
  useEffect(() => {
    if (selectedExam) {
      fetchExamResult(selectedExam);
    } else {
      setExamData(null);
    }
  }, [selectedExam]);

  const fetchTerms = async () => {
    try {
      const response = await getExamTermDropdown();
      if (response.success) {
        setTerms(response.data);
      }
    } catch (error) {
      console.error('Error fetching terms:', error);
      toast.error('Failed to fetch exam terms');
    }
  };

  const fetchExams = async (termId) => {
    try {
      const response = await getExamDropdown(termId);
      if (response.success) {
        setExams(response.data);
      }
    } catch (error) {
      console.error('Error fetching exams:', error);
      toast.error('Failed to fetch exams');
    }
  };

  const fetchExamResult = async (examId) => {
    setLoading(true);
    try {
      const response = await getStudentExamResult(examId);
      if (response.success) {
        setExamData(response.data);
      }
    } catch (error) {
      console.error('Error fetching exam result:', error);
      toast.error('Failed to fetch exam result');
      setExamData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleTermChange = (e) => {
    setSelectedTerm(e.target.value);
    setSelectedExam('');
  };

  const handleExamChange = (e) => {
    setSelectedExam(e.target.value);
  };

  const downloadReportCard = () => {
    if (!examData) {
      toast.error('No exam data available to download');
      return;
    }

    const doc = new jsPDF('p', 'mm', 'a4');
    const margin = 10;
    let y = margin;

    // Header
    doc.setFontSize(16).setTextColor(0, 0, 255).text("School Name", margin, y);
    doc.setFontSize(14).text(`${examData.exam.exam_name} Results`, margin, (y += 7));
    doc.setFontSize(10).setTextColor(100).text(`Academic Year: ${examData.exam.term.academic_year}`, margin, (y += 5));

    // Student Info
    doc.setFontSize(12).setTextColor(0).text("Student Information", margin, (y += 10));
    doc.setFontSize(10).text(`Class: ${examData.student.class}`, margin, (y += 5));
    doc.text(`Section: ${examData.student.section}`, margin, (y += 5));
    doc.text(`Roll No: ${examData.student.roll_number}`, margin, (y += 5));

    // Marks Table
    doc.setFontSize(12).text("Marks Details", margin, (y += 10));
    doc.autoTable({
      startY: (y += 5),
      head: [["S.No", "Subject Code", "Subject Name", "Marks Obtained", "Total Marks", "Percentage", "Grade", "Status"]],
      body: examData.subjects.map((subject, index) => [
        index + 1,
        subject.subject_code,
        subject.subject_name,
        subject.marks_obtained,
        subject.total_marks,
        `${subject.percentage.toFixed(2)}%`,
        subject.grade,
        subject.status,
      ]),
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [173, 216, 230] },
    });

    // Summary
    y = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(10);
    doc.text(`Total Marks: ${examData.summary.total_marks_obtained} / ${examData.summary.total_maximum_marks}`, margin, y);
    doc.text(`Percentage: ${examData.summary.overall_percentage.toFixed(2)}%`, margin, (y += 5));
    doc.text(`Result: ${examData.summary.overall_result}`, margin, (y += 5));
    doc.text(`Subjects Passed: ${examData.summary.subjects_passed}`, margin, (y += 5));
    doc.text(`Subjects Failed: ${examData.summary.subjects_failed}`, margin, (y += 5));

    doc.save(`${examData.exam.exam_name}_ReportCard.pdf`);
  };

  const gradingSystem = [
    { range: "90% and above", grade: "A+" },
    { range: "80% - 89%", grade: "A" },
    { range: "70% - 79%", grade: "B" },
    { range: "60% - 69%", grade: "C" },
    { range: "50% - 59%", grade: "D" },
    { range: "Below 50%", grade: "F" },
  ];

  return (
    <div className="bg-gray-100 flex AddStudent">
      <StudentSidebar />

      <div
        className=" overflow-auto relative z-1 flex-col"
        style={{
          height: "95vh",
          width: "100vw",
          gap: "10px",
          display: "flex",
          transition: "margin-left 0.3s ease",
        }}
      >
        <Header />

        <main className="w-full px-4 md:px-6">
          <div className="p-4">
            {/* Dropdowns for Term and Exam Selection */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-4">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Select Exam</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Term Dropdown */}
                <div>
                  <label htmlFor="term" className="block text-sm font-medium text-gray-700 mb-2">
                    Select Term
                  </label>
                  <select
                    id="term"
                    value={selectedTerm}
                    onChange={handleTermChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Select Term --</option>
                    {terms.map((term) => (
                      <option key={term.id} value={term.id}>
                        {term.term_name} ({term.academic_year})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Exam Dropdown */}
                <div>
                  <label htmlFor="exam" className="block text-sm font-medium text-gray-700 mb-2">
                    Select Exam
                  </label>
                  <select
                    id="exam"
                    value={selectedExam}
                    onChange={handleExamChange}
                    disabled={!selectedTerm}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">-- Select Exam --</option>
                    {exams.map((exam) => (
                      <option key={exam.id} value={exam.id}>
                        {exam.exam_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Loading exam results...</p>
              </div>
            )}

            {/* Exam Result Card */}
            {!loading && examData && (
              <div className="w-full mx-auto bg-white shadow-lg rounded-lg p-6">
                {/* Header */}
                <div className="border-b border-gray-300 pb-4">
                  <div className="text-center">
                    <h1 className="text-blue-600 font-bold text-2xl">{examData.exam.exam_name}</h1>
                    <h2 className="text-blue-600 font-semibold text-lg">Examination Results</h2>
                    <p className="text-sm text-gray-700">Term: {examData.exam.term.term_name}</p>
                    <p className="text-sm text-gray-700">Academic Year: {examData.exam.term.academic_year}</p>
                    {examData.exam.exam_description && (
                      <p className="text-xs text-gray-600 italic mt-2">{examData.exam.exam_description}</p>
                    )}
                  </div>
                </div>

                {/* Student Info */}
                <div className="py-4 border-b border-gray-300">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-semibold text-gray-700">Class:</span>
                      <p className="text-gray-600">{examData.student.class}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Section:</span>
                      <p className="text-gray-600">{examData.student.section}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Roll Number:</span>
                      <p className="text-gray-600">{examData.student.roll_number}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Exam Period:</span>
                      <p className="text-gray-600">{examData.exam.start_date} to {examData.exam.end_date}</p>
                    </div>
                  </div>
                </div>

                {/* Summary Cards */}
                <div className="py-4 border-b border-gray-300">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Overall Summary</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <p className="text-sm text-gray-600">Total Subjects</p>
                      <p className="text-2xl font-bold text-blue-600">{examData.summary.total_subjects}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <p className="text-sm text-gray-600">Passed</p>
                      <p className="text-2xl font-bold text-green-600">{examData.summary.subjects_passed}</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg text-center">
                      <p className="text-sm text-gray-600">Failed</p>
                      <p className="text-2xl font-bold text-red-600">{examData.summary.subjects_failed}</p>
                    </div>
                    <div className={`${examData.summary.overall_result === 'Pass' ? 'bg-green-50' : 'bg-red-50'} p-4 rounded-lg text-center`}>
                      <p className="text-sm text-gray-600">Overall Result</p>
                      <p className={`text-2xl font-bold ${examData.summary.overall_result === 'Pass' ? 'text-green-600' : 'text-red-600'}`}>
                        {examData.summary.overall_result}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Results Table */}
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Subject-wise Marks</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="bg-blue-100 text-gray-800">
                          <th className="border border-gray-300 p-2 text-center">S.No</th>
                          <th className="border border-gray-300 p-2 text-left">Subject Code</th>
                          <th className="border border-gray-300 p-2 text-left">Subject Name</th>
                          <th className="border border-gray-300 p-2 text-center">Marks Obtained</th>
                          <th className="border border-gray-300 p-2 text-center">Total Marks</th>
                          <th className="border border-gray-300 p-2 text-center">Passing Marks</th>
                          <th className="border border-gray-300 p-2 text-center">Percentage</th>
                          <th className="border border-gray-300 p-2 text-center">Grade</th>
                          <th className="border border-gray-300 p-2 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {examData.subjects.map((subject, index) => (
                          <tr key={subject.subject_id} className="hover:bg-blue-50 transition-colors">
                            <td className="border border-gray-300 p-2 text-center">{index + 1}</td>
                            <td className="border border-gray-300 p-2">{subject.subject_code}</td>
                            <td className="border border-gray-300 p-2">{subject.subject_name}</td>
                            <td className="border border-gray-300 p-2 text-center font-semibold">{subject.marks_obtained}</td>
                            <td className="border border-gray-300 p-2 text-center">{subject.total_marks}</td>
                            <td className="border border-gray-300 p-2 text-center">{subject.passing_marks}</td>
                            <td className="border border-gray-300 p-2 text-center">{subject.percentage.toFixed(2)}%</td>
                            <td className="border border-gray-300 p-2 text-center font-semibold">{subject.grade}</td>
                            <td className={`border border-gray-300 p-2 text-center font-semibold ${subject.status === 'Pass' ? 'text-green-600' : 'text-red-600'}`}>
                              {subject.status}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Final Summary */}
                <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-semibold text-gray-700">Total Marks Obtained:</span>
                      <p className="text-lg font-bold text-blue-600">{examData.summary.total_marks_obtained} / {examData.summary.total_maximum_marks}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Overall Percentage:</span>
                      <p className="text-lg font-bold text-blue-600">{examData.summary.overall_percentage.toFixed(2)}%</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Final Result:</span>
                      <p className={`text-lg font-bold ${examData.summary.overall_result === 'Pass' ? 'text-green-600' : 'text-red-600'}`}>
                        {examData.summary.overall_result}
                      </p>
                    </div>
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
                    className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                  >
                    Download Report Card
                  </button>
                </div>
              </div>
            )}

            {/* No Data Message */}
            {!loading && !examData && selectedExam && (
              <div className="text-center py-8">
                <p className="text-gray-600">No exam results found for the selected exam.</p>
              </div>
            )}

            {/* Initial Message */}
            {!loading && !selectedExam && (
              <div className="text-center py-8 bg-white rounded-lg shadow-md">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-lg text-gray-600">Please select a term and exam to view your results</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentResult;