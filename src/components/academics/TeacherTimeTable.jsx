import React, {useState} from 'react'

const TeacherTimeTable = ({ timetableData }) => {
    
        // Sample teacher list (replace with your actual data)
        const teachers = ['Mr. Smith', 'Ms. Doe', 'Dr. Brown', 'Mrs. Green', 'Coach Lee', 'Ms. Jane'];
      
        // Days and time slots (consistent with previous timetable)
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const timeSlots = [
          '09:00 - 09:45', '09:45 - 10:30', '10:30 - 11:15', '11:15 - 12:00',
          '12:45 - 13:30', '13:30 - 14:15', '14:15 - 15:00', '15:00 - 15:45',
        ];
      
        // State for selected teacher and filtered timetable
        const [selectedTeacher, setSelectedTeacher] = useState('');
        const [teacherSchedule, setTeacherSchedule] = useState(null);
      
        // Handle teacher selection
        const handleTeacherChange = (e) => {
          const teacher = e.target.value;
          setSelectedTeacher(teacher);
      
          if (!teacher || !timetableData) {
            setTeacherSchedule(null);
            return;
          }
      
          // Filter timetable data to find teacher's schedule
          const schedule = days.reduce((acc, day) => {
            acc[day] = Array(8).fill({ class: '', section: '', subject: '' });
            return acc;
          }, {});
      
          timetableData.forEach(({ class: className, section, timetable }) => {
            days.forEach((day) => {
              timetable[day].forEach((slot, index) => {
                if (slot.teacher === teacher) {
                  schedule[day][index] = {
                    class: className,
                    section,
                    subject: slot.subject,
                  };
                }
              });
            });
          });
      
          setTeacherSchedule(schedule);
        };
      
        // Print function for teacher's timetable
        const handlePrint = () => {
          const printContent = document.querySelector('.teacher-timetable-container').outerHTML;
          const originalBody = document.body.innerHTML;
      
          document.body.innerHTML = `
            <html>
              <head>
                <title>Timetable for ${selectedTeacher}</title>
                <style>
                  body { font-family: 'Arial', sans-serif; padding: 20px; }
                  .teacher-timetable-container { width: 100%; margin: 0 auto; }
                  h3 { text-align: center; color: #1e40af; font-size: 1.5rem; margin-bottom: 20px; }
                  table { width: 100%; border-collapse: collapse; }
                  th, td { border: 1px solid #d1d5db; padding: 10px; text-align: center; }
                  th { background: #dbeafe; color: #1e40af; font-weight: bold; }
                  td { background: #ffffff; }
                  .lunch { background: #fef3c7; color: #92400e; font-weight: bold; }
                  .day { background: #f3f4f6; font-weight: bold; }
                  .time { font-size: 0.8rem; color: #4b5563; }
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
<div className="w-full mx-auto p-8">
      <h2 className="text-3xl font-bold text-violet-700 mb-6 text-center">Teacher Timetable</h2>

      {/* Teacher Selection */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Teacher</label>
        <select
          value={selectedTeacher}
          onChange={handleTeacherChange}
          className="w-full max-w-md mx-auto p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-600 transition"
        >
          <option value="">-- Select Teacher --</option>
          {teachers.map((teacher) => (
            <option key={teacher} value={teacher}>
              {teacher}
            </option>
          ))}
        </select>
      </div>

      {/* Teacher's Timetable */}
      {selectedTeacher && teacherSchedule && (
        <div className="teacher-timetable-container">
          <h3 className="text-xl font-semibold text-violet-700 mb-4 text-center">
            Timetable for {selectedTeacher}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-violet-100 text-violet-800">
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
                  <tr key={day} className="hover:bg-violet-50 transition-colors">
                    <td className="border border-gray-300 p-3 font-semibold text-center bg-gray-100 text-gray-800">{day}</td>
                    {teacherSchedule[day].map((slot, index) => (
                      index === 4 ? (
                        <td key={index} className="border border-gray-300 p-3 text-center text-sm font-semibold text-amber-800 bg-amber-100 lunch">
                          Lunch (12:00 - 12:45)
                        </td>
                      ) : (
                        <td key={index} className="border border-gray-300 p-3 slot">
                          {slot.subject ? (
                            <div>
                              <span className="block text-sm text-gray-800">{slot.subject}</span>
                              <span className="block text-xs text-gray-600">
                                {slot.class} - Section {slot.section}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </td>
                      )
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Print Button */}
          <div className="mt-8 text-center">
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

export default TeacherTimeTable