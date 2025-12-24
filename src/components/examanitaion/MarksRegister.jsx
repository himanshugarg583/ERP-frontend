import React, { useState } from 'react';


const MarkRegister = () => {


  const [students] = useState([
    { rollNo: '101', name: 'Aadhya Kapoor', phone: '(123) 456-7890', gender: 'Female' },
    { rollNo: '102', name: 'Anaya Singh', phone: '(987) 654-3210', gender: 'Female' },
    { rollNo: '103', name: 'Diya Sharma', phone: '(555) 123-4567', gender: 'Female' },
    { rollNo: '104', name: 'Devansh Yadav', phone: '(111) 222-3333', gender: 'Male' },
    { rollNo: '105', name: 'Reyansh Verma', phone: '(333) 444-5555', gender: 'Male' },
  ]);

  const [selectedStudent, setSelectedStudent] = useState(null);

  const [marks, setMarks] = useState({
    english: { unitTest: 0, halfYearly: 0, finalExam: 0 },
    computer: { unitTest: 0, halfYearly: 0, finalExam: 0 },
    maths: { unitTest: 0, halfYearly: 0, finalExam: 0 },
    sst: { unitTest: 0, halfYearly: 0, finalExam: 0 },
    science: { unitTest: 0, halfYearly: 0, finalExam: 0 },
    hindi: { unitTest: 0, halfYearly: 0, finalExam: 0 },
  });

  const subjects = [
    { name: 'English', maxMarks: { unitTest: 20, halfYearly: 30, finalExam: 50 } },
    { name: 'Computer', maxMarks: { unitTest: 20, halfYearly: 30, finalExam: 50 } },
    { name: 'Maths', maxMarks: { unitTest: 20, halfYearly: 30, finalExam: 50 } },
    { name: 'SST', maxMarks: { unitTest: 20, halfYearly: 30, finalExam: 50 } },
    { name: 'Science', maxMarks: { unitTest: 20, halfYearly: 30, finalExam: 50 } },
    { name: 'Hindi', maxMarks: { unitTest: 20, halfYearly: 30, finalExam: 50 } },
  ];

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setMarks({
      english: { unitTest: 0, halfYearly: 0, finalExam: 0 },
      computer: { unitTest: 0, halfYearly: 0, finalExam: 0 },
      maths: { unitTest: 0, halfYearly: 0, finalExam: 0 },
      sst: { unitTest: 0, halfYearly: 0, finalExam: 0 },
      science: { unitTest: 0, halfYearly: 0, finalExam: 0 },
      hindi: { unitTest: 0, halfYearly: 0, finalExam: 0 },
    });
  };

  const calculateResults = () => {
    const totalMarks = subjects.reduce((sum, subject) => {
      const subjectMarks = marks[subject.name.toLowerCase()] ?? {};
      return sum + (subjectMarks.unitTest ?? 0) + (subjectMarks.halfYearly ?? 0) + (subjectMarks.finalExam ?? 0);
    }, 0);
    const maxTotal = 600;
    const percentage = ((totalMarks / maxTotal) * 100).toFixed(2);
    const cgpa = (percentage / 9.5).toFixed(2);
    return { totalMarks, percentage, cgpa };
  };

  return (

    <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="container mx-auto max-w-full">
            <div className="bg-white shadow-xl rounded-xl p-4 md:p-6">
              <h2 className="text-2xl md:text-3xl font-bold text-violet-700 mb-6 text-center">
                Student Results Management
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm md:text-base">
                  <thead className="bg-violet-600 text-white">
                    <tr>
                      <th className="py-2 px-2 md:py-3 md:px-4 text-left">Roll No</th>
                      <th className="py-2 px-2 md:py-3 md:px-4 text-left">Name</th>
                      <th className="py-2 px-2 md:py-3 md:px-4 text-left hidden md:table-cell">
                        Parent's Phone
                      </th>
                      <th className="py-2 px-2 md:py-3 md:px-4 text-left hidden md:table-cell">
                        Gender
                      </th>
                      <th className="py-2 px-2 md:py-3 md:px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr
                        key={student.rollNo}
                        className="border-b hover:bg-violet-50 transition-colors">
                        <td className="py-2 px-2 md:py-3 md:px-4">{student.rollNo}</td>
                        <td className="py-2 px-2 md:py-3 md:px-4">{student.name}</td>
                        <td className="py-2 px-2 md:py-3 md:px-4 hidden md:table-cell">
                          {student.phone}
                        </td>
                        <td className="py-2 px-2 md:py-3 md:px-4 hidden md:table-cell">
                          {student.gender}
                        </td>
                        <td className="py-2 px-2 md:py-3 md:px-4 text-center">
                          <button
                            onClick={() => handleSelectStudent(student)}
                            className="bg-violet-600 text-white px-3 py-1 md:px-4 md:py-2 rounded-lg hover:bg-violet-700 transition-colors text-sm md:text-base">
                            Enter Result
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {selectedStudent && (
                <div className="mt-8 bg-violet-50 p-4 md:p-6 rounded-lg">
                  <h3 className="text-lg md:text-xl font-semibold text-violet-700 mb-6">
                    Enter Marks for {selectedStudent.name} (Roll No: {selectedStudent.rollNo})
                  </h3>

                  <div className="space-y-6">
                    {subjects.map((subject) => (
                      <div key={subject.name} className="bg-white p-4 rounded-md shadow-sm">
                        <h4 className="font-medium text-gray-800 mb-3">{subject.name}</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Unit Test ({subject.maxMarks.unitTest})
                            </label>
                            <input
                              type="number"
                              max={subject.maxMarks.unitTest}
                              min="0"
                              value={marks[subject.name.toLowerCase()]?.unitTest ?? 0}
                              onChange={(e) =>
                                setMarks((prevMarks) => ({
                                  ...prevMarks, [subject.name.toLowerCase()]: {
                                    ...prevMarks[subject.name.toLowerCase()],
                                    unitTest: parseInt(e.target.value) || 0,
                                  },
                                }))
                              }
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-violet-600 focus:border-violet-600"/>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Half Yearly ({subject.maxMarks.halfYearly})
                            </label>
                            <input
                              type="number"
                              max={subject.maxMarks.halfYearly}
                              min="0"
                              value={marks[subject.name.toLowerCase()]?.halfYearly ?? 0}
                              onChange={(e) =>
                                setMarks((prevMarks) => ({
                                  ...prevMarks,
                                  [subject.name.toLowerCase()]: {
                                    ...prevMarks[subject.name.toLowerCase()],
                                    halfYearly: parseInt(e.target.value) || 0,
                                  },
                                }))
                              }
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-violet-600 focus:border-violet-600"/>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Final Exam ({subject.maxMarks.finalExam})
                            </label>
                            <input
                              type="number"
                              max={subject.maxMarks.finalExam}
                              min="0"
                              value={marks[subject.name.toLowerCase()]?.finalExam ?? 0}
                              onChange={(e) =>
                                setMarks((prevMarks) => ({
                                  ...prevMarks,
                                  [subject.name.toLowerCase()]: {
                                    ...prevMarks[subject.name.toLowerCase()],
                                    finalExam: parseInt(e.target.value) || 0,
                                  },
                                }))
                              }
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-violet-600 focus:border-violet-600"/>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="bg-white p-4 rounded-md shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-gray-700">Total Marks:</span>
                        <span className="text-violet-700 font-bold text-lg">
                          {calculateResults().totalMarks}/600
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-gray-700">Percentage:</span>
                        <span className="text-violet-700 font-bold text-lg">
                          {calculateResults().percentage}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-700">CGPA:</span>
                        <span className="text-violet-700 font-bold text-lg">
                          {calculateResults().cgpa}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
    
  );
};

export default MarkRegister;