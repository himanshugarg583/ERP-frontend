import React, { useState, useEffect } from 'react';
import { Search, X, Loader, AlertCircle, Eye, Download } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint } from '@fortawesome/free-solid-svg-icons';
import ReactModal from "react-modal";
import Admit from './Admit';
import { 
  getAllClassesDropdown,
  getAllStudentsByClass,
  getAllExamTermsForAdmitCard,
  getExamByTerm,
  getStudentAdmitCard
} from '../../helper/requests-method/apiMethods';

const CreateAdmitCard = () => {
  // State Management
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [examTerms, setExamTerms] = useState([]);
  const [exams, setExams] = useState([]);
  
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedExamTerm, setSelectedExamTerm] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  
  const [searchResults, setSearchResults] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  
  const [admitCardData, setAdmitCardData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Fetch Classes on Mount
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await getAllClassesDropdown();
        if (response.success && response.data) {
          setClasses(response.data);
        } else {
          setError('Failed to load classes');
        }
      } catch (err) {
        setError('Error loading classes. Please try again.');
        console.error('Error fetching classes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  // Fetch Exam Terms on Mount
  useEffect(() => {
    const fetchExamTerms = async () => {
      try {
        const response = await getAllExamTermsForAdmitCard();
        if (response.success && response.data) {
          setExamTerms(response.data);
        }
      } catch (err) {
        console.error('Error fetching exam terms:', err);
      }
    };

    fetchExamTerms();
  }, []);

  // Fetch Students when Class is Selected
  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedClass) {
        setStudents([]);
        return;
      }

      try {
        const response = await getAllStudentsByClass(selectedClass);
        if (response.success && response.data) {
          setStudents(response.data);
        } else {
          setStudents([]);
        }
      } catch (err) {
        console.error('Error fetching students:', err);
        setStudents([]);
      }
    };

    fetchStudents();
  }, [selectedClass]);

  // Fetch Exams when Exam Term is Selected
  useEffect(() => {
    const fetchExams = async () => {
      if (!selectedExamTerm) {
        setExams([]);
        return;
      }

      try {
        const response = await getExamByTerm(selectedExamTerm);
        if (response.success && response.data) {
          setExams(response.data);
        } else {
          setExams([]);
        }
      } catch (err) {
        console.error('Error fetching exams:', err);
        setExams([]);
      }
    };

    fetchExams();
  }, [selectedExamTerm]);

  // Handle Search Button
  const handleSearch = async () => {
    if (!selectedClass || !selectedStudent || !selectedExamTerm || !selectedExam) {
      setError('Please select all filters');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Call the admit card API to get dynamic data
      const response = await getStudentAdmitCard(selectedStudent, selectedExamTerm);
      
      if (response.success && response.data) {
        // Prepare search results with the admit card data
        const studentData = students.find(s => s.id === parseInt(selectedStudent));
        const admitCardData = response.data;
        
        // Create result object combining student info and admit card data
        const resultData = {
          id: studentData.id,
          name: studentData.name,
          roll_number: studentData.roll_number,
          gender: studentData.gender,
          phone_no: studentData.phone_no,
          studentInfo: admitCardData.student_info,
          examInfo: admitCardData.exam_info,
          examSchedule: admitCardData.exam_schedule,
          instructions: admitCardData.instructions
        };
        
        setSearchResults([resultData]);
        setSelectedStudents({});
        setSelectAll(false);
        setHasSearched(true);
      } else {
        setError('Failed to fetch admit card data');
        setSearchResults([]);
      }
    } catch (err) {
      setError('Error searching. Please try again.');
      console.error('Error searching:', err);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle Select/Deselect Student
  const handleSelectStudent = (studentId) => {
    setSelectedStudents(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  // Handle Select All
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedStudents({});
      setSelectAll(false);
    } else {
      const allSelected = {};
      searchResults.forEach(student => {
        allSelected[student.id] = true;
      });
      setSelectedStudents(allSelected);
      setSelectAll(true);
    }
  };

  // Fetch and Display Admit Card
  const handleViewAdmitCard = async (studentId) => {
    try {
      setLoading(true);
      setError('');
      
      // Get the student data from searchResults which already has the admit card data
      const studentData = searchResults.find(s => s.id === studentId);
      
      if (studentData && studentData.studentInfo) {
        setAdmitCardData({
          student_info: studentData.studentInfo,
          exam_info: studentData.examInfo,
          exam_schedule: studentData.examSchedule,
          instructions: studentData.instructions
        });
        setIsModalOpen(true);
      } else {
        setError('Admit card data not found');
      }
    } catch (err) {
      setError('Error fetching admit card. Please try again.');
      console.error('Error fetching admit card:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle Generate (Print multiple)
  const handleGenerate = () => {
    const selectedCount = Object.values(selectedStudents).filter(Boolean).length;
    if (selectedCount === 0) {
      setError('Please select at least one student');
      return;
    }

    // For multiple students, we'll print each one
    // In a real scenario, you might want to generate a bulk PDF or print each separately
    window.print();
  };

  // Handle Print
  const handlePrint = () => {
    window.print();
  };

  const selectedCount = Object.values(selectedStudents).filter(Boolean).length;
  const isAllSelected = selectedCount === searchResults.length && searchResults.length > 0;

  return (
    <div className='w-full p-2 sm:p-4'>
      <div className='bg-white shadow-lg rounded-xl p-4 sm:p-6 mb-6'>
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Generate Admit Card</h1>
          <p className="text-gray-600 text-sm sm:text-base">Select filters and search for students</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-3 sm:p-4 bg-red-100 border border-red-400 text-red-700 rounded flex items-start gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span className="text-sm sm:text-base">{error}</span>
          </div>
        )}

        {/* Selection Form */}
        <div className="bg-gradient-to-r from-violet-50 to-blue-50 rounded-lg p-4 sm:p-6 border border-violet-100 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Search className="w-5 h-5 text-violet-600" />
            Filter Options
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Class Selection */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Class <span className="text-red-500">*</span>
              </label>
              <select 
                value={selectedClass}
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                  setSelectedStudent('');
                  setSearchResults([]);
                  setHasSearched(false);
                  setError('');
                }}
                className="w-full border-2 border-gray-300 rounded-lg p-2.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent text-sm"
              >
                <option value="">-- Select Class --</option>
                {classes.map((classItem) => (
                  <option key={classItem.id} value={classItem.id}>
                    {classItem.class_name} - {classItem.section_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Student Selection */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Student <span className="text-red-500">*</span>
              </label>
              <select 
                value={selectedStudent}
                onChange={(e) => {
                  setSelectedStudent(e.target.value);
                  setSearchResults([]);
                  setHasSearched(false);
                  setError('');
                }}
                disabled={!selectedClass || loading}
                className="w-full border-2 border-gray-300 rounded-lg p-2.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
              >
                <option value="">-- Select Student --</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name} ({student.roll_number || 'N/A'})
                  </option>
                ))}
              </select>
            </div>

            {/* Exam Term Selection */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Exam Term <span className="text-red-500">*</span>
              </label>
              <select 
                value={selectedExamTerm}
                onChange={(e) => {
                  setSelectedExamTerm(e.target.value);
                  setSelectedExam('');
                  setSearchResults([]);
                  setHasSearched(false);
                  setError('');
                }}
                className="w-full border-2 border-gray-300 rounded-lg p-2.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent text-sm"
              >
                <option value="">-- Select Exam Term --</option>
                {examTerms.map((term) => (
                  <option key={term.id} value={term.id}>
                    {term.term_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Exam Selection */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Exam <span className="text-red-500">*</span>
              </label>
              <select 
                value={selectedExam}
                onChange={(e) => {
                  setSelectedExam(e.target.value);
                  setSearchResults([]);
                  setHasSearched(false);
                  setError('');
                }}
                disabled={!selectedExamTerm || loading}
                className="w-full border-2 border-gray-300 rounded-lg p-2.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
              >
                <option value="">-- Select Exam --</option>
                {exams.map((exam) => (
                  <option key={exam.id} value={exam.id}>
                    {exam.exam_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <button 
                onClick={handleSearch}
                disabled={!selectedClass || !selectedStudent || !selectedExamTerm || !selectedExam || loading}
                className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg transition font-bold text-base h-full whitespace-nowrap"
              >
                <Search size={20} />
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-8 sm:py-12">
            <div className="text-center">
              <Loader className="animate-spin text-violet-600 w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2" />
              <p className="text-gray-600 text-sm sm:text-base">Loading...</p>
            </div>
          </div>
        )}

        {/* Search Results Table */}
        {!loading && hasSearched && (
          <div>
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">
                Student Results ({selectedCount} selected of {searchResults.length})
              </h3>
              <button
                onClick={handleSelectAll}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                  isAllSelected
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
              >
                {isAllSelected ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            {searchResults.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm sm:text-base">No results found</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className='w-full divide-y divide-gray-200'>
                  <thead className="bg-gray-100">
                    <tr>
                      <th className='px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700'>
                        <input 
                          type="checkbox" 
                          checked={isAllSelected}
                          onChange={handleSelectAll}
                          className="w-4 h-4 cursor-pointer"
                        />
                      </th>
                      <th className='px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700'>Student Name</th>
                      <th className='hidden sm:table-cell px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700'>Roll No</th>
                      <th className='hidden md:table-cell px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700'>Exam</th>
                      <th className='hidden lg:table-cell px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700'>Total Marks</th>
                      <th className='hidden lg:table-cell px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700'>Passing Marks</th>
                      <th className='px-4 sm:px-6 py-3 text-center text-xs sm:text-sm font-semibold text-gray-700'>View</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200 bg-white'>
                    {searchResults.map((student) => (
                      <tr
                        key={student.id}
                        className="hover:bg-gray-50"
                      >
                        <td className='px-4 py-3'>
                          <input 
                            type="checkbox" 
                            checked={selectedStudents[student.id] || false}
                            onChange={() => handleSelectStudent(student.id)}
                            className="w-4 h-4 cursor-pointer"
                          />
                        </td>
                        <td className='px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-900'>
                          {student.name || 'N/A'}
                        </td>
                        <td className='hidden sm:table-cell px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700'>
                          {student.roll_number || 'N/A'}
                        </td>
                        <td className='hidden md:table-cell px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700'>
                          {student.examInfo?.exam_name || 'N/A'}
                        </td>
                        <td className='hidden lg:table-cell px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700'>
                          {student.examInfo?.total_marks || 'N/A'}
                        </td>
                        <td className='hidden lg:table-cell px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700'>
                          {student.examInfo?.passing_marks || 'N/A'}
                        </td>
                        <td className='px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium'>
                          <button 
                            onClick={() => handleViewAdmitCard(student.id)}
                            className='text-green-500 hover:text-green-700 p-2 rounded hover:bg-green-50 transition inline-flex items-center gap-1'
                            title="View Admit Card"
                          >
                            <Eye size={16} />
                            <span className="hidden sm:inline text-xs">View</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Generate Button */}
            {searchResults.length > 0 && (
              <div className="mt-6 flex justify-center">
                <button 
                  onClick={handleGenerate}
                  disabled={selectedCount === 0}
                  className={`flex items-center gap-2 px-8 py-3 rounded-lg font-semibold text-white transition ${
                    selectedCount === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  <Download size={20} />
                  Generate Admit Card ({selectedCount} selected)
                </button>
              </div>
            )}
          </div>
        )}

        {!hasSearched && !loading && (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 text-sm sm:text-base">Select filters and click Search to view students</p>
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
            width: "90vw",
            maxWidth: "1100px",
            maxHeight: "90vh",
            margin: "auto",
            padding: "20px",
            border: "1px solid #ccc",
            zIndex: 1001,
            borderRadius: "8px",
            overflow: "auto"
          },
        }}
      >
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-white py-2 border-b pb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Admit Card</h2>
          <button 
            onClick={() => setIsModalOpen(false)} 
            className='text-gray-600 hover:text-black p-2 rounded hover:bg-gray-100 transition'
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-4 flex gap-2 flex-wrap">
          <button 
            onClick={handlePrint}
            className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition text-sm sm:text-base font-semibold'
          >
            <FontAwesomeIcon icon={faPrint} size="lg" />
            Print Admit Card
          </button>
        </div>

        {admitCardData && (
          <div className="print:p-0">
            <Admit 
              studentInfo={admitCardData.student_info}
              examInfo={admitCardData.exam_info}
              examSchedule={admitCardData.exam_schedule}
              instructions={admitCardData.instructions}
            />
          </div>
        )}
      </ReactModal>
    </div>
  );
};

export default CreateAdmitCard;
