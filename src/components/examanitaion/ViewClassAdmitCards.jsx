import React, { useState, useEffect, useRef } from 'react';
import { Users, BookOpen, Calendar, Award, Download, Printer, AlertCircle, Loader } from 'lucide-react';
import ReactModal from 'react-modal';
import Admit from './Admit';
import {
  getExamTermDropdown,
  getExamDropdown,
  fetchClassDropdown,
  getClassAdmitCards
} from '../../helper/requests-method/apiMethods';

const ViewClassAdmitCards = () => {
  // State for dropdowns
  const [terms, setTerms] = useState([]);
  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  
  const [selectedTerm, setSelectedTerm] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  
  // State for admit card data
  const [admitCardData, setAdmitCardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudentData, setSelectedStudentData] = useState(null);

  // Fetch Terms on mount
  useEffect(() => {
    fetchTerms();
    fetchClasses();
  }, []);

  // Fetch exams when term changes
  useEffect(() => {
    if (selectedTerm) {
      fetchExams(selectedTerm);
    } else {
      setExams([]);
      setSelectedExam('');
    }
  }, [selectedTerm]);

  const fetchTerms = async () => {
    try {
      const response = await getExamTermDropdown();
      if (response.success && response.data) {
        setTerms(response.data);
      }
    } catch (err) {
      console.error('Error fetching terms:', err);
    }
  };

  const fetchExams = async (termId) => {
    try {
      const response = await getExamDropdown(termId);
      if (response.success && response.data) {
        setExams(response.data);
      }
    } catch (err) {
      console.error('Error fetching exams:', err);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await fetchClassDropdown();
      if (response.success && response.data) {
        setClasses(response.data);
      }
    } catch (err) {
      console.error('Error fetching classes:', err);
    }
  };

  const handleFetchAdmitCards = async () => {
    if (!selectedExam || !selectedClass) {
      setError('Please select both Exam and Class');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // API call with classId (from term), examId, and classSectionId
      const response = await getClassAdmitCards(selectedTerm, selectedExam, selectedClass);
      
      if (response.success && response.data) {
        setAdmitCardData(response.data);
      } else {
        setError('Failed to fetch admit cards');
      }
    } catch (err) {
      setError('Error fetching admit cards. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintAll = () => {
    window.print();
  };

  const handleDownloadAll = () => {
    // Implementation for downloading all admit cards as PDF
    alert('Download functionality will be implemented');
  };

  const handlePrintStudent = (student) => {
    // Prepare admit card data for individual student
    const studentAdmitData = {
      student_info: {
        name: student.name,
        roll_number: student.roll_number,
        email: student.email,
        gender: student.gender,
        image: student.image,
        class: admitCardData.exam_info.class
      },
      exam_info: admitCardData.exam_info,
      exam_schedule: admitCardData.exam_schedule,
      instructions: [
        'Reach the examination center 30 minutes before the exam starts',
        'Bring your admit card and ID card',
        'Mobile phones and electronic devices are strictly prohibited',
        'Follow all examination rules and regulations',
        'Use of unfair means will result in cancellation of exam'
      ]
    };
    
    setSelectedStudentData(studentAdmitData);
    setIsModalOpen(true);
    
    // Wait for modal to render then print
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handleDownloadStudent = async (student) => {
    // Prepare admit card data for individual student
    const studentAdmitData = {
      student_info: {
        name: student.name,
        roll_number: student.roll_number,
        email: student.email,
        gender: student.gender,
        image: student.image,
        class: admitCardData.exam_info.class
      },
      exam_info: admitCardData.exam_info,
      exam_schedule: admitCardData.exam_schedule,
      instructions: [
        'Reach the examination center 30 minutes before the exam starts',
        'Bring your admit card and ID card',
        'Mobile phones and electronic devices are strictly prohibited',
        'Follow all examination rules and regulations',
        'Use of unfair means will result in cancellation of exam'
      ]
    };

    // Create a temporary container
    const printContainer = document.createElement('div');
    printContainer.style.position = 'absolute';
    printContainer.style.left = '-9999px';
    printContainer.style.top = '0';
    document.body.appendChild(printContainer);

    // Dynamically import react-dom for rendering
    const ReactDOM = await import('react-dom/client');
    const root = ReactDOM.createRoot(printContainer);
    
    // Render the Admit component
    root.render(
      React.createElement(Admit, {
        studentInfo: studentAdmitData.student_info,
        examInfo: studentAdmitData.exam_info,
        examSchedule: studentAdmitData.exam_schedule,
        instructions: studentAdmitData.instructions
      })
    );

    // Wait for render
    setTimeout(() => {
      // Create print window
      const printWindow = window.open('', '_blank');
      printWindow.document.write('<html><head><title>Admit Card - ' + student.name + '</title>');
      
      // Copy all stylesheets
      const styles = document.querySelectorAll('link[rel="stylesheet"], style');
      styles.forEach(style => {
        printWindow.document.write(style.outerHTML);
      });
      
      printWindow.document.write('</head><body>');
      printWindow.document.write(printContainer.innerHTML);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      
      // Wait for content to load then print
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
        
        // Cleanup
        root.unmount();
        document.body.removeChild(printContainer);
      }, 500);
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Class Admit Cards
              </h1>
              <p className="text-gray-600">View and manage admit cards for entire class</p>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Select Filters
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Term Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exam Term
              </label>
              <select
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Select Term</option>
                {terms.map((term) => (
                  <option key={term.id} value={term.id}>
                    {term.term_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Exam Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exam
              </label>
              <select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                disabled={!selectedTerm}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Select Exam</option>
                {exams.map((exam) => (
                  <option key={exam.id} value={exam.id}>
                    {exam.exam_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Class Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Class
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Select Class</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.class_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Fetch Button */}
          <div className="mt-4 flex gap-3">
            <button
              onClick={handleFetchAdmitCards}
              disabled={loading || !selectedExam || !selectedClass}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <BookOpen className="w-4 h-4" />
                  View Admit Cards
                </>
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Admit Cards Display */}
        {admitCardData && (
          <div className="space-y-6">
            {/* Students List */}
            {admitCardData.students && admitCardData.students.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    Students ({admitCardData.students.length})
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {admitCardData.students.map((student) => (
                    <div
                      key={student.student_id}
                      className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 bg-gradient-to-br from-white to-blue-50"
                    >
                      <div className="flex items-start gap-4">
                        {/* Student Image */}
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {student.image ? (
                            <img 
                              src={`${import.meta.env.VITE_API_BASE_URL}/uploads/${student.image}`} 
                              alt={student.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Users className="w-8 h-8 text-blue-600" />
                          )}
                        </div>
                        
                        {/* Student Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 truncate">{student.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Roll: {student.roll_number || 'N/A'}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 truncate">
                            {student.email}
                          </p>
                          {student.gender && (
                            <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full capitalize">
                              {student.gender}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="mt-4 flex gap-2">
                        <button 
                          onClick={() => handlePrintStudent(student)}
                          className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-1"
                        >
                          <Printer className="w-3 h-3" />
                          Print
                        </button>
                        <button 
                          onClick={() => handleDownloadStudent(student)}
                          className="flex-1 px-3 py-2 bg-white border border-blue-600 text-blue-600 text-xs font-medium rounded-lg hover:bg-blue-50 transition-all flex items-center justify-center gap-1"
                        >
                          <Download className="w-3 h-3" />
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!admitCardData && !loading && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Admit Cards Selected</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Select exam term, exam, and class from the filters above to view admit cards for the entire class
            </p>
          </div>
        )}
      </div>

      {/* Modal for Admit Card */}
      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Admit Card"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          },
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            maxWidth: "900px",
            width: "90%",
            maxHeight: "90vh",
            padding: "0",
            border: "none",
            borderRadius: "12px",
            overflow: "auto",
          },
        }}
      >
        {selectedStudentData && (
          <div className="p-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition z-10"
            >
              Close
            </button>
            <Admit
              studentInfo={selectedStudentData.student_info}
              examInfo={selectedStudentData.exam_info}
              examSchedule={selectedStudentData.exam_schedule}
              instructions={selectedStudentData.instructions}
            />
          </div>
        )}
      </ReactModal>
    </div>
  );
};

export default ViewClassAdmitCards;
