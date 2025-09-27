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

// interface ExamSubject {
//   date: string;
//   time: string;
//   subject: string;
//   duration: string;
// }

// interface AdmitCardProps {
//   studentName: string;
//   rollNumber: string;
//   className: string;
//   examDate: string;
//   examTime: string;
//   examVenue: string;
//   studentPhoto?: string;
//   examSchedule?: ExamSubject[];
// }

const AdmitCard=({studentName,rollNumber,className,examDate,examTime,examVenue,examSchedule = []}) => {
  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Header */}
      <div className=" text-black px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <School className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold">GurukulSarthi School Managment software</h1>
            <p className="text-sm opacity-90">Examination Admit Card 2025</p>
          </div>
        </div>
        <QrCode className="w-10 h-10" />
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="flex gap-6">
          {/* Student Photo */}
          <div className="flex-shrink-0">
            {/* <img
              src={studentPhoto}
              alt={studentName}
              className="w-32 h-32 rounded-lg object-cover border-4 border-gray-200"
            /> */}
          </div>

          {/* Student Details */}
          <div className="flex-grow space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Student Name</p>
                  <p className="font-semibold">"{studentName}"</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Roll Number</p>
                  <p className="font-semibold">"{rollNumber}"</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <School className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Class</p>
                  <p className="font-semibold">"{className}"</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Exam Details */}
        <div className="mt-6 bg-gray-50 rounded-lg p-4 space-y-3">
          <h2 className="font-semibold text-lg text-gray-800 mb-3">Examination Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-semibold">"{examDate}"</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Time</p>
                <p className="font-semibold">"{examTime}"</p>
              </div>
            </div>
            <div className="flex items-center gap-2 col-span-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Venue</p>
                <p className="font-semibold">"{examVenue}"</p>
              </div>
            </div>
          </div>
        </div>

        {/* Examination Time Table */}
        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-lg text-gray-800">Examination Time Table</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Date</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Time</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Subject</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Duration</th>
                </tr>
              </thead>
              {/* <tbody className="divide-y divide-gray-200">
                {examSchedule.map((exam, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{exam.date}</td>
                    <td className="px-4 py-3">{exam.time}</td>
                    <td className="px-4 py-3 font-medium">{exam.subject}</td>
                    <td className="px-4 py-3">{exam.duration}</td>
                  </tr>
                ))}
              </tbody> */}
            </table>
          </div>
        </div>

        {/* Important Instructions */}
        <div className="mt-6">
          <div className="flex items-center gap-2 text-amber-600 mb-2">
            <AlertCircle className="w-5 h-5" />
            <h3 className="font-semibold">Important Instructions</h3>
          </div>
          <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
            <li>Please arrive at least 30 minutes before the examination time</li>
            <li>Bring your school ID card along with this admit card</li>
            <li>No electronic devices are allowed in the examination hall</li>
            <li>Read all instructions on the question paper carefully</li>
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t px-6 py-4 mt-6">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">Principal's Signature</p>
          <p className="text-sm text-gray-600">Student's Signature</p>
        </div>
      </div>
    </div>
  );
};

export default AdmitCard;