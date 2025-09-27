import React from 'react'
import { useState } from 'react';

const ClassTimeTable = ({ classes, onSave }) => {
  // Sample class, subject, and teacher data (replace with your actual data)
  const classOptions = classes || [
    { class: 'Class 1', sections: ['A', 'B', 'C'] },
    { class: 'Class 2', sections: ['A', 'B'] },
    { class: 'Class 10', sections: ['A', 'B'] },
  ];

  const subjects = ['Math', 'English', 'Science', 'History', 'Geography', 'PE', 'Art'];
  const teachers = ['Mr. Smith', 'Ms. Doe', 'Dr. Brown', 'Mrs. Green', 'Coach Lee', 'Ms. Jane'];

  // Timetable configuration
  const periods = 8;
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlots = [
    '09:00 - 09:45', '09:45 - 10:30', '10:30 - 11:15', '11:15 - 12:00',
    '12:45 - 13:30', '13:30 - 14:15', '14:15 - 15:00', '15:00 - 15:45',
  ]; // Lunch will be after Period 4 (12:00 - 12:45)

  // State management
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [timetable, setTimetable] = useState(null);

  // Initialize timetable
  const initializeTimetable = () => {
    const defaultTimetable = days.reduce((acc, day) => ({
      ...acc,
      [day]: Array(periods).fill({ subject: '', teacher: '' })
    }), {});
    setTimetable(defaultTimetable);
  };

  // Handle class and section selection
  const handleClassChange = (e) => {
    const className = e.target.value;
    setSelectedClass(className);
    setSelectedSection('');
    setTimetable(null);
  };

  const handleSectionChange = (e) => {
    const section = e.target.value;
    setSelectedSection(section);
    initializeTimetable();
  };

  // Handle dropdown change for subject or teacher
  const handleChange = (day, periodIndex, field, value) => {
    if (!timetable) return;
    const updatedTimetable = {
      ...timetable,
      [day]: timetable[day].map((entry, idx) =>
        idx === periodIndex ? { ...entry, [field]: value } : entry
      ),
    };
    setTimetable(updatedTimetable);
  };

  // Save the timetable
  const handleSave = () => {
    if (!selectedClass || !selectedSection || !timetable) {
      alert('Please select a class and section, and fill the timetable.');
      return;
    }
    const timetableData = {
      class: selectedClass,
      section: selectedSection,
      timetable,
    };
    if (onSave) {
      onSave(timetableData);
    }
    alert(`Timetable for ${selectedClass} - Section ${selectedSection} saved successfully!`);
  };

  const handlePrint = () => {
    const printContent = document.querySelector('.timetable-container').outerHTML;
    const originalBody = document.body.innerHTML;

    document.body.innerHTML = `
      <html>
        <head>
          <title>Timetable for ${selectedClass} - Section ${selectedSection}</title>
          <style>
            body { font-family: 'Arial', sans-serif; padding: 20px; }
            .timetable-container { width: 100%; margin: 0 auto; }
            h3 { text-align: center; color: #1e40af; font-size: 1.5rem; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #d1d5db; padding: 10px; text-align: center; }
            th { background: #dbeafe; color: #1e40af; font-weight: bold; }
            td { background: #ffffff; }
            .lunch { background: #fef3c7; color: #92400e; font-weight: bold; }
            .day { background: #f3f4f6; font-weight: bold; }
            .time { font-size: 0.8rem; color: #4b5563; }
            select { display: none; } /* Hide dropdowns in print */
            .slot { font-size: 0.9rem; }
            .slot span { display: block; }
          </style>
        </head>
        <body>${printContent}</body>
      </html>
    `;

    window.print();
    document.body.innerHTML = originalBody;
  };

  return (

<div className="w-full max-w-6xl mx-auto bg-white shadow-xl rounded-xl p-8 mt-6">
      <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">Create Timetable</h2>

      {/* Class and Section Selection */}
      <div className="flex gap-6 mb-8">
        <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Class</label>
          <select
            value={selectedClass}
            onChange={handleClassChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="">-- Select Class --</option>
            {classOptions.map((cls) => (
              <option key={cls.class} value={cls.class}>
                {cls.class}
              </option>
            ))}
          </select>
        </div>
        <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Section</label>
          <select
            value={selectedSection}
            onChange={handleSectionChange}
            disabled={!selectedClass}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="">-- Select Section --</option>
            {selectedClass &&
              classOptions
                .find((cls) => cls.class === selectedClass)
                ?.sections.map((section) => (
                  <option key={section} value={section}>
                    Section {section}
                  </option>
                ))}
          </select>
        </div>
      </div>

      {/* Timetable Table */}
      {selectedClass && selectedSection && timetable && (
        <div className="timetable-container">
          <h3 className="text-xl font-semibold text-blue-700 mb-4 text-center">
            Timetable for {selectedClass} - Section {selectedSection}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-blue-100 text-blue-800">
                  <th className="border border-gray-300 p-3 text-center font-semibold">Day</th>
                  {timeSlots.map((time, index) => (
                    <th key={index} className="border border-gray-300 p-3 text-center font-semibold">
                      Period {index + 1}
                      <br />
                      <span className="text-xs text-gray-600">{time}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {days.map((day) => (
                  <tr key={day} className="hover:bg-blue-50 transition-colors">
                    <td className="border border-gray-300 p-3 font-semibold text-center bg-gray-100 text-gray-800">{day}</td>
                    {timetable[day].map((slot, index) => (
                      index === 4 ? (
                        <td key={index} className="border border-gray-300 p-3 text-center text-sm font-semibold text-amber-800 bg-amber-100 lunch">
                          Lunch (12:00 - 12:45)
                        </td>
                      ) : (
                        <td key={index} className="border border-gray-300 p-3 slot">
                          <select
                            value={slot.subject}
                            onChange={(e) => handleChange(day, index, 'subject', e.target.value)}
                            className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                          >
                            <option value="">-- Select Subject --</option>
                            {subjects.map((subject) => (
                              <option key={subject} value={subject}>
                                {subject}
                              </option>
                            ))}
                          </select>
                          <select
                            value={slot.teacher}
                            onChange={(e) => handleChange(day, index, 'teacher', e.target.value)}
                            className="w-full p-2 mt-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                          >
                            <option value="">-- Select Teacher --</option>
                            {teachers.map((teacher) => (
                              <option key={teacher} value={teacher}>
                                {teacher}
                              </option>
                            ))}
                          </select>
                          <div className="slot-content mt-1">
                            <span className="block text-sm text-gray-800">{slot.subject || '-'}</span>
                            <span className="block text-xs text-gray-600">{slot.teacher || '-'}</span>
                          </div>
                        </td>
                      )
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition shadow-md"
            >
              Save Timetable
            </button>
            <button
              onClick={handlePrint}
              className="bg-green-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-green-700 transition shadow-md"
            >
              Print Timetable
            </button>
          </div>
        </div>
      )}
    </div>


 
  )
}

export default ClassTimeTable