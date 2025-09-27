import React, { useState } from 'react';
import OnlineLearningHeader from './OnlineLearningHeader';
import OnlineLearningSidebar from './OnlineLearningSidebar';
import { MdUploadFile, MdCalendarToday, MdComment, MdRefresh, MdDescription, MdNotifications, MdClose } from 'react-icons/md';

const OnlineLearningAssignment = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [assignmentData, setAssignmentData] = useState([
    {
      id: 1,
      title: "Hindi Grammar Worksheet",
      subject: "Hindi",
      subjectCode: "HIN101",
      teacher: "Ms. Anjali Verma",
      status: "Pending",
      dueDate: "2025-03-26",
      instructions: "Complete exercises 1-5 from Chapter 5 textbook",
      submittedFile: null,
      grade: null,
      feedback: null,
      canResubmit: false,
      color: "purple",
    },
    {
      id: 2,
      title: "Shakespeare Essay",
      subject: "English",
      subjectCode: "ENG202",
      teacher: "Mr. David Brown",
      status: "Submitted",
      dueDate: "2025-03-25",
      instructions: "Write a 500-word essay on Sonnet 18",
      submittedFile: "essay.pdf",
      grade: null,
      feedback: null,
      canResubmit: false,
      color: "blue",
    },
    {
      id: 3,
      title: "Calculus Problem Set",
      subject: "Maths",
      subjectCode: "MAT303",
      teacher: "Mrs. Neha Gupta",
      status: "Graded",
      dueDate: "2025-03-20",
      instructions: "Solve problems 1-10 from Calculus workbook",
      submittedFile: "calculus.pdf",
      grade: "A-",
      feedback: "Good work, but check your differentiation in problem 7",
      canResubmit: true,
      color: "green",
    },
  ]);
  const dueSoon = assignmentData.filter(a => {
    const due = new Date(a.dueDate);
    const now = new Date();
    const diffDays = (due - now) / (1000 * 60 * 60 * 24);
    return a.status === "Pending" && diffDays <= 3 && diffDays >= 0;
  });

  const handleFileUpload = (assignmentId, event) => {
    const file = event.target.files[0];
    if (file) {
      setAssignmentData(prevData => 
        prevData.map(assignment => 
          assignment.id === assignmentId 
            ? { ...assignment, submittedFile: file.name, status: "Submitted" } 
            : assignment
        )
      );
      setSelectedAssignment(prev => prev && prev.id === assignmentId 
        ? { ...prev, submittedFile: file.name, status: "Submitted" } 
        : prev
      );
      console.log(`File ${file.name} submitted for assignment ${assignmentId}`);
    }
  };

  const renderAssignmentCard = (assignment) => (
    <div 
      className={`bg-gradient-to-br from-${assignment.color}-50 to-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border-l-8 border-${assignment.color}-500`}
      onClick={() => setSelectedAssignment(assignment)}>
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-gray-800 truncate max-w-[250px]">{assignment.title}</h3>
          <p className="text-sm text-gray-600 flex items-center">
            <span className={`bg-${assignment.color}-100 text-${assignment.color}-800 px-2 py-1 rounded-full text-xs font-medium mr-2`}>
              {assignment.subjectCode}
            </span>
            {assignment.subject}
          </p>
          <p className="text-sm text-gray-500">Teacher: {assignment.teacher}</p>
        </div>
        <div className="text-right">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white bg-${assignment.color}-500`}>
            {assignment.status}
          </span>
          <p className={`text-sm mt-2 ${new Date(assignment.dueDate) < new Date() ? 'text-red-500 font-medium' : 'text-gray-600'}`}>
            Due: {assignment.dueDate}
          </p>
        </div>
      </div>
    </div>
  );
  const renderAssignmentDetailsPopup = (assignment) => (
    <div className="fixed inset-0 bg-transparent backdrop-blur-md  bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center">
            <span className={`w-3 h-3 rounded-full bg-${assignment.color}-500 mr-3`}></span>
            {assignment?.title}
          </h3>
          <button onClick={() => setSelectedAssignment(null)} className="text-gray-600 hover:text-gray-800 transition-colors">
            <MdClose size={28} />
          </button>
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <p className="text-gray-700"><strong>Subject:</strong> <span className="text-gray-600">{assignment?.subject}</span></p>
            <p className="text-gray-700"><strong>Code:</strong> <span className="text-gray-600">{assignment?.subjectCode}</span></p>
            <p className="text-gray-700"><strong>Teacher:</strong> <span className="text-gray-600">{assignment?.teacher}</span></p>
            <p className="text-gray-700"><strong>Status:</strong> <span className={`text-${assignment.color}-600 font-medium`}>{assignment?.status}</span></p>
            <p className="text-gray-700"><strong>Due Date:</strong> <span className={new Date(assignment.dueDate) < new Date() ? 'text-red-600' : 'text-gray-600'}>{assignment?.dueDate}</span></p>
          </div>
          <div>
            <h4 className="font-semibold text-lg flex items-center text-gray-800">
              <MdDescription className="mr-2 text-gray-600" size={20} /> Instructions
            </h4>
            <p className="text-gray-600 mt-2 bg-gray-50 p-4 rounded-lg border border-gray-200">{assignment?.instructions ?? "No instructions provided"}</p>
          </div>
          {assignment.status === "Pending" && (
            <div>
              <h4 className="font-semibold text-lg flex items-center text-gray-800">
                <MdUploadFile className="mr-2 text-blue-600" size={20} /> Submit Assignment
              </h4>
              <input 
                type="file" onChange={(e) => handleFileUpload(assignment.id, e)}
                className="mt-2 block w-full text-sm text-gray-600 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition-colors"
              />
            </div>
          )}
          {(assignment.status === "Submitted" || assignment.status === "Graded") && (
            <div>
              <h4 className="font-semibold text-lg text-gray-800">Submitted File</h4>
              <p className="text-gray-600 mt-2 bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center">
                <MdUploadFile className="mr-2 text-gray-500" size={20} />
                {assignment?.submittedFile ?? "No file submitted"}
              </p>
            </div>
          )}
          {assignment.status === "Graded" && (
            <>
              <div>
                <h4 className="font-semibold text-lg flex items-center text-gray-800">
                  <MdComment className="mr-2 text-green-600" size={20} /> Grade
                </h4>
                <p className="text-gray-600 mt-2 bg-gray-50 p-4 rounded-lg border border-gray-200 font-medium">
                  <span className="text-green-700">{assignment?.grade ?? "Not graded"}</span>
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-lg flex items-center text-gray-800">
                  <MdComment className="mr-2 text-gray-600" size={20} /> Teacher Feedback
                </h4>
                <p className="text-gray-600 mt-2 bg-gray-50 p-4 rounded-lg border border-gray-200">{assignment?.feedback ?? "No feedback provided"}</p>
              </div>
              {assignment.canResubmit && (
                <div>
                  <h4 className="font-semibold text-lg flex items-center text-gray-800">
                    <MdRefresh className="mr-2 text-blue-600" size={20} /> Re-submit Assignment
                  </h4>
                  <input 
                    type="file" onChange={(e) => handleFileUpload(assignment.id, e)}
                    className="mt-2 block w-full text-sm text-gray-600 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition-colors"/>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex">
      <div className={`fixed top-0 left-0 w-64 bg-[#EDF2F7] z-50 h-screen transform transition-transform duration-300 ease-in-out 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:static md:translate-x-0 md:flex md:flex-col md:w-64 md:min-h-0`}>
        <OnlineLearningSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      </div>

      <div className="flex-1 flex flex-col h-screen">
        <OnlineLearningHeader setIsSidebarOpen={setIsSidebarOpen} />
        <main className="flex-1 p-8 bg-gradient-to-br from-gray-50 to-gray-100 overflow-y-auto">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-10 tracking-tight">Assignments</h1>
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6 flex items-center">
              <MdDescription className="mr-2 text-gray-600" size={24} /> All Assignments
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assignmentData.map(assignment => renderAssignmentCard(assignment))}
            </div>
          </section>
          {dueSoon.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-700 mb-6 flex items-center">
                <MdNotifications className="mr-2 text-yellow-600" size={24} /> Due Soon
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dueSoon.map(assignment => renderAssignmentCard(assignment))}
              </div>
            </section>
          )}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6 flex items-center">
              <MdCalendarToday className="mr-2 text-gray-600" size={24} /> Deadlines
            </h2>
            <div className="bg-white rounded-2xl shadow-md p-6">
              {assignmentData.map(assignment => (
                <div key={assignment.id} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full bg-${assignment.color}-500 mr-3`}></div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{assignment.title}</p>
                      <p className="text-xs text-gray-500">{assignment.subject} ({assignment.subjectCode}) - {assignment.teacher}</p>
                    </div>
                  </div>
                  <p className={`text-sm font-medium ${new Date(assignment.dueDate) < new Date() ? 'text-red-500' : 'text-gray-600'}`}>
                    {assignment.dueDate}
                  </p>
                </div>
              ))}
            </div>
          </section>
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6 flex items-center">
              <MdNotifications className="mr-2 text-gray-600" size={24} /> Notifications
            </h2>
            <div className="bg-white rounded-2xl shadow-md p-6">
              {dueSoon.map(assignment => (
                <div key={assignment.id} className="flex items-center py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
                  <MdNotifications className="text-yellow-500 mr-3" size={20} />
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">"{assignment.title}"</span> ({assignment.subjectCode}) by {assignment.teacher} is due on <span className="text-gray-600">{assignment.dueDate}</span>
                  </p>
                </div>
              ))}
              {dueSoon.length === 0 && (
                <p className="text-sm text-gray-500 py-4">No upcoming deadlines</p>
              )}
            </div>
          </section>
        </main>
        {selectedAssignment && renderAssignmentDetailsPopup(selectedAssignment)}
      </div>
    </div>
  );
};

export default OnlineLearningAssignment;