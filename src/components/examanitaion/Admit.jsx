import React from 'react';
import { 
  User, 
  Calendar, 
  MapPin, 
  Clock, 
  BookOpen,
  School,
  QrCode,
  AlertCircle,
  CalendarDays
} from 'lucide-react';

const AdmitCard = ({ 
  studentInfo = {}, 
  examInfo = {}, 
  examSchedule = [], 
  instructions = [],
  // Legacy props for backward compatibility
  studentName,
  rollNumber,
  className,
  examDate,
  examTime,
  examVenue
}) => {
  // Use new data structure if available, fallback to legacy props
  const student = studentInfo.name ? studentInfo : { name: studentName };
  const exam = examInfo.exam_name ? examInfo : {};
  const schedule = examSchedule && examSchedule.length > 0 ? examSchedule : [];
  const instructionsList = instructions && instructions.length > 0 ? instructions : [
    'Please arrive at least 30 minutes before the examination time',
    'Bring your school ID card along with this admit card',
    'No electronic devices are allowed in the examination hall',
    'Read all instructions on the question paper carefully',
    'Any malpractice will result in automatic disqualification'
  ];

  return (
    <div className="w-full bg-white shadow-lg rounded-lg overflow-hidden print:shadow-none print:rounded-none">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          <School className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" />
          <div className="min-w-0">
            <h1 className="text-lg sm:text-2xl font-bold truncate">GurukulSarthi School Management</h1>
            <p className="text-xs sm:text-sm opacity-90">Examination Admit Card {exam.academic_year || '2025'}</p>
          </div>
        </div>
        <QrCode className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0" />
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6">
        {/* Student Details */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <User className="w-5 h-5 sm:w-5 sm:h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-600">Student Name</p>
                <p className="font-semibold text-sm sm:text-base truncate">{student.name || studentName}</p>
              </div>
            </div>
            <div className="flex items-start gap-2 sm:gap-3">
              <BookOpen className="w-5 h-5 sm:w-5 sm:h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-600">Roll Number</p>
                <p className="font-semibold text-sm sm:text-base">{student.roll_number || rollNumber}</p>
              </div>
            </div>
            <div className="flex items-start gap-2 sm:gap-3">
              <School className="w-5 h-5 sm:w-5 sm:h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-600">Class</p>
                <p className="font-semibold text-sm sm:text-base truncate">{student.class || className}</p>
              </div>
            </div>
            {student.email && (
              <div className="flex items-start gap-2 sm:gap-3">
                <AlertCircle className="w-5 h-5 sm:w-5 sm:h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600">Email</p>
                  <p className="font-semibold text-sm sm:text-base truncate">{student.email}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Exam Details */}
        <div className="mt-4 sm:mt-6 bg-blue-50 rounded-lg p-3 sm:p-4 space-y-3 border border-blue-200">
          <h2 className="font-semibold text-base sm:text-lg text-gray-800 mb-3">Examination Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {exam.exam_name && (
              <div className="flex items-start gap-2 sm:gap-3">
                <BookOpen className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600">Exam Name</p>
                  <p className="font-semibold text-sm sm:text-base">{exam.exam_name}</p>
                </div>
              </div>
            )}
            {exam.term_name && (
              <div className="flex items-start gap-2 sm:gap-3">
                <Calendar className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600">Term</p>
                  <p className="font-semibold text-sm sm:text-base">{exam.term_name}</p>
                </div>
              </div>
            )}
            {exam.exam_start_date && (
              <div className="flex items-start gap-2 sm:gap-3">
                <Calendar className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600">Start Date</p>
                  <p className="font-semibold text-sm sm:text-base">{exam.exam_start_date}</p>
                </div>
              </div>
            )}
            {exam.exam_end_date && (
              <div className="flex items-start gap-2 sm:gap-3">
                <Calendar className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600">End Date</p>
                  <p className="font-semibold text-sm sm:text-base">{exam.exam_end_date}</p>
                </div>
              </div>
            )}
            {exam.total_marks && (
              <div className="flex items-start gap-2 sm:gap-3">
                <BookOpen className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600">Total Marks</p>
                  <p className="font-semibold text-sm sm:text-base">{exam.total_marks}</p>
                </div>
              </div>
            )}
            {exam.passing_marks && (
              <div className="flex items-start gap-2 sm:gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600">Passing Marks</p>
                  <p className="font-semibold text-sm sm:text-base">{exam.passing_marks}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Examination Schedule */}
        {schedule && schedule.length > 0 && (
          <div className="mt-4 sm:mt-6 bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <CalendarDays className="w-5 h-5 text-blue-600" />
              <h2 className="font-semibold text-base sm:text-lg text-gray-800">Subject Examination Schedule</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead className="bg-blue-100">
                  <tr>
                    <th className="px-2 sm:px-4 py-2 text-left font-semibold text-gray-700">Subject</th>
                    <th className="px-2 sm:px-4 py-2 text-left font-semibold text-gray-700">Code</th>
                    <th className="px-2 sm:px-4 py-2 text-left font-semibold text-gray-700">Date</th>
                    <th className="px-2 sm:px-4 py-2 text-left font-semibold text-gray-700">Max Marks</th>
                    <th className="hidden sm:table-cell px-2 sm:px-4 py-2 text-left font-semibold text-gray-700">Room</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-200">
                  {schedule.map((item, index) => (
                    <tr key={index} className="hover:bg-blue-100">
                      <td className="px-2 sm:px-4 py-2 font-medium">{item.subject_name}</td>
                      <td className="px-2 sm:px-4 py-2">{item.subject_code}</td>
                      <td className="px-2 sm:px-4 py-2">{item.exam_date}</td>
                      <td className="px-2 sm:px-4 py-2">{item.max_marks}</td>
                      <td className="hidden sm:table-cell px-2 sm:px-4 py-2">{item.room_no || 'TBA'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Important Instructions */}
        <div className="mt-4 sm:mt-6">
          <div className="flex items-center gap-2 text-amber-600 mb-2 sm:mb-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <h3 className="font-semibold text-sm sm:text-base">Important Instructions</h3>
          </div>
          <ul className="text-xs sm:text-sm text-gray-600 list-disc list-inside space-y-1 ml-2">
            {instructionsList.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ul>
        </div>

        {exam.description && (
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs sm:text-sm text-gray-700">
              <strong>Exam Description:</strong> {exam.description}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t px-4 sm:px-6 py-3 sm:py-4 mt-4 sm:mt-6 bg-gray-50">
        <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm text-gray-600">
          <div className="text-center">
            <p className="font-semibold mb-8 sm:mb-12 block">Principal's Signature</p>
            <div className="border-t border-gray-400 pt-1"></div>
          </div>
          <div className="text-center">
            <p className="font-semibold mb-8 sm:mb-12 block">Student's Signature</p>
            <div className="border-t border-gray-400 pt-1"></div>
          </div>
        </div>
        <p className="text-center text-xs text-gray-500 mt-4">Generated on {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default AdmitCard;