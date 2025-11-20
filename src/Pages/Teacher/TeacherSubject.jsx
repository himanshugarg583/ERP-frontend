import React, { useState, useEffect } from 'react';
import { FaFileUpload, FaQuestionCircle, FaComments, FaBook, FaEdit, FaSave, FaPlus, FaCheck } from 'react-icons/fa';
import TeacherSidebar from './TeacherSidebar';
import Header from '../../components/comman_components/Header';

const ClassCard = ({ cls, onClick }) => (
  <div
    className={`${cls.color} p-6 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300`}
    onClick={onClick}>
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">{cls.name}</h2>
        <p className="text-sm text-gray-600">Section: {cls.section}</p>
        <p className="text-sm text-gray-600">Strength: {cls.strength} students</p>
      </div>
      <FaBook className="text-3xl text-gray-700 opacity-75" />
    </div>
    <div className="mt-4">
      <p className="text-sm font-medium text-gray-700">Subjects: {cls.subjects.length}</p>
      <div className="flex flex-wrap gap-2 mt-2">
        {cls.subjects.map((subject, idx) => (
          <span key={idx} className="text-xs bg-white bg-opacity-70 px-2 py-1 rounded-full text-gray-700">
            {subject}
          </span>
        ))}
      </div>
    </div>
  </div>
);

const SyllabusRow = ({ item, lessonPlans, editingChapter, setEditingChapter, handleLessonPlanChange, markComplete, changeDate }) => (
  <tr className="border-b hover:bg-gray-50 transition-colors">
    <td className="p-4 text-gray-800">{item.chapter}</td>
    <td className="p-4">{item.completed ? <span className="text-green-500">✅ Completed</span> : <span className="text-red-500">❌ Pending</span>}</td>
    <td className="p-4">
      <input
        type="date"
        value={item.date}
        onChange={(e) => changeDate(item.chapter, e.target.value)}
        className="border rounded-md p-1 text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        disabled={item.completed}/>
    </td>
    <td className="p-4">
      {lessonPlans[item.chapter] ? (
        <div className="flex items-center gap-2">
          <button onClick={() => setEditingChapter(editingChapter === item.chapter ? null : item.chapter)} className="text-indigo-600 hover:text-indigo-800">
            <FaEdit />
          </button>
          <span className="text-sm text-gray-600">{item.planned ? '📝 Planned' : ''}</span>
        </div>
      ) : (
        <button onClick={() => setEditingChapter(item.chapter)} className="flex items-center text-indigo-600 hover:text-indigo-800">
          <FaFileUpload className="mr-1" /> Add Plan
        </button>
      )}
      {editingChapter === item.chapter && (
        <div className="mt-2">
          <textarea
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows="4"
            value={lessonPlans[item.chapter] || ''}
            onChange={(e) => handleLessonPlanChange(item.chapter, e.target.value)}
            placeholder="Write lesson plan here..."/>
          <button onClick={() => setEditingChapter(null)} className="mt-2 flex items-center text-green-600 hover:text-green-800">
            <FaSave className="mr-1" /> Save & Close
          </button>
        </div>
      )}
    </td>
    <td className="p-4">
      {!item.completed && (
        <button onClick={() => markComplete(item.chapter)} className="flex items-center text-green-600 hover:text-green-800">
          <FaCheck className="mr-1" /> Mark Complete
        </button>
      )}
    </td>
  </tr>
);

const TeacherSubject = () => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [lessonPlans, setLessonPlans] = useState({});
  const [editingChapter, setEditingChapter] = useState(null);
  const [syllabusData, setSyllabusData] = useState({
    Science: [
      { chapter: 'The Living World', completed: true, date: '2025-04-10', topics: 5, planned: false },
      { chapter: 'Motion', completed: false, date: '2025-04-20', topics: 4, planned: false },
      { chapter: 'Energy', completed: false, date: '2025-05-01', topics: 6, planned: false },
    ],
    Math: [
      { chapter: 'Algebra', completed: true, date: '2025-04-15', topics: 6, planned: false },
      { chapter: 'Geometry', completed: false, date: '2025-04-25', topics: 5, planned: false },
    ],
    English: [
      { chapter: 'Grammar Basics', completed: true, date: '2025-04-12', topics: 4, planned: false },
      { chapter: 'Literature', completed: false, date: '2025-04-22', topics: 5, planned: false },
    ],
  });

  const classes = [
    { id: 1, name: 'Class 6', section: 'A', strength: 35, subjects: ['Science', 'Math', 'English'], color: 'bg-blue-100' },
    { id: 2, name: 'Class 7', section: 'B', strength: 40, subjects: ['Science', 'Math', 'English'], color: 'bg-green-100' },
    { id: 3, name: 'Class 8', section: 'C', strength: 38, subjects: ['Science', 'Math', 'English'], color: 'bg-pink-100' },
  ];

  const doubts = [
    { topic: 'Motion', question: 'What is inertia?', student: 'Amit' },
    { topic: 'Algebra', question: 'How to solve quadratics?', student: 'Priya' },
  ];

  const discussions = [
    { topic: 'Energy', message: 'Let’s discuss renewable sources!', user: 'Teacher' },
  ];

  const calculateProgress = (subject) => {
    const total = syllabusData[subject]?.length ?? 0; 
    const completed = syllabusData[subject]?.filter((ch) => ch.completed).length ?? 0; 
    return Math.round((completed / total) * 100);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (editingChapter && lessonPlans[editingChapter]) {
        console.log(`Auto-saving lesson plan for ${editingChapter}: ${lessonPlans[editingChapter]}`);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [lessonPlans, editingChapter]);

  const handleLessonPlanChange = (chapter, value) => {
    setLessonPlans((prev) => ({ ...prev, [chapter]: value }));
    if (value) {
      setSyllabusData((prev) => ({
        ...prev,
        [selectedSubject]: prev[selectedSubject]?.map((item) =>
          item.chapter === chapter ? { ...item, planned: true } : item
        ) ?? [], 
      }));
    }
  };

  const markComplete = (chapter) => {
    setSyllabusData((prev) => ({
      ...prev,
      [selectedSubject]: prev[selectedSubject]?.map((item) =>
        item.chapter === chapter ? { ...item, completed: true } : item
      ) ?? [], 
    }));
  };

  const changeDate = (chapter, newDate) => {
    setSyllabusData((prev) => ({
      ...prev,
      [selectedSubject]: prev[selectedSubject]?.map((item) =>
        item.chapter === chapter ? { ...item, date: newDate } : item
      ) ?? [], 
    }));
  };

  const addNewTopic = (chapter, date) => {
    setSyllabusData((prev) => ({
      ...prev,
      [selectedSubject]: [
        ...(prev[selectedSubject] ?? []), 
        { chapter, completed: false, date, topics: 0, planned: false },
      ],
    }));
  };

  return (
    <div className="bg-gray-100 flex AddStudent">
      <TeacherSidebar />

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

        <main className="w-full px-4 md:px-6" style={{ fontFamily: 'Arial, sans-serif' }}>
          {!selectedClass ? (
            <>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Syllabus Management</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {classes.map((cls) => (
                  <ClassCard key={cls.id} cls={cls} onClick={() => setSelectedClass(cls)} />
                ))}
              </div>
            </>
          ) : (
            <>
              <button
                className="mb-4 text-blue-600 hover:underline flex items-center gap-1"
                onClick={() => {
                  setSelectedClass(null);
                  setSelectedSubject(null);
                }}>
                Back to Classes
              </button>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex flex-wrap border-b border-gray-200 mb-6">
                  {selectedClass.subjects.map((subject) => (
                    <button
                      key={subject}
                      onClick={() => setSelectedSubject(subject)}
                      className={`p-3 font-medium text-lg ${
                        selectedSubject === subject ? 'border-b-4 border-indigo-600 text-indigo-600' : 'text-gray-600'
                      } hover:text-indigo-600 transition-colors duration-200`}>
                      {subject}
                    </button>
                  ))}
                </div>

                {selectedSubject && (
                  <>
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">Progress: {selectedSubject}</h3>
                      <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-600 h-3 rounded-full"
                          style={{ width: `${calculateProgress(selectedSubject)}%`, transition: 'width 0.3s' }}/>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{calculateProgress(selectedSubject)}% Completed</p>
                    </div>

                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                      <table className="w-full text-left">
                        <thead className="bg-indigo-50 text-indigo-700">
                          <tr>
                            <th className="p-4 font-semibold">Chapter Name</th>
                            <th className="p-4 font-semibold">Status</th>
                            <th className="p-4 font-semibold">Expected Date</th>
                            <th className="p-4 font-semibold">Lesson Plan</th>
                            <th className="p-4 font-semibold">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {syllabusData[selectedSubject]?.map((item, idx) => (
                            <SyllabusRow
                              key={idx}
                              item={item}
                              lessonPlans={lessonPlans}
                              editingChapter={editingChapter}
                              setEditingChapter={setEditingChapter}
                              handleLessonPlanChange={handleLessonPlanChange}
                              markComplete={markComplete}
                              changeDate={changeDate}/>
                          )) ?? null} 
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4">Add Next Topic</h4>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <input
                          type="text"
                          placeholder="New Chapter Name"
                          id="newChapter"
                          className="border rounded-md p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                        <input
                          type="date"
                          id="newDate"
                          className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                        <button
                          onClick={() => {
                            const chapter = document.getElementById('newChapter').value;
                            const date = document.getElementById('newDate').value;
                            if (chapter && date) {
                              addNewTopic(chapter, date);
                              document.getElementById('newChapter').value = '';
                              document.getElementById('newDate').value = '';
                            }
                          }}
                          className="bg-indigo-600 text-white rounded-md p-2 flex items-center justify-center hover:bg-indigo-700 transition">
                          <FaPlus className="mr-2" /> Add Topic
                        </button>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">Next Pending Topics 📌</h4>
                        <ul className="list-none p-0">
                          {syllabusData[selectedSubject]?.filter((ch) => !ch.completed).map((ch, idx) => (
                            <li key={idx} className="text-gray-600 mb-2">{ch.chapter}</li>
                          )) ?? null}
                        </ul>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">Deadline Alerts ⏳</h4>
                        <ul className="list-none p-0">
                          {syllabusData[selectedSubject]?.filter((ch) => !ch.completed).map((ch, idx) => (
                            <li key={idx} className="text-red-500 mb-2">{ch.chapter} - {ch.date}</li>
                          )) ?? null}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4">Student Interaction</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                          <h5 className="flex items-center font-medium text-gray-600 mb-2">
                            <FaQuestionCircle className="mr-2" /> Doubt Box
                          </h5>
                          {doubts.map((doubt, idx) => (
                            <div key={idx} className="mb-2">
                              <p className="text-sm text-gray-600">{doubt.topic}: {doubt.question}</p>
                              <p className="text-xs text-gray-400">— {doubt.student}</p>
                            </div>
                          ))}
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                          <h5 className="flex items-center font-medium text-gray-600 mb-2">
                            <FaComments className="mr-2" /> Discussion Board
                          </h5>
                          {discussions.map((disc, idx) => (
                            <div key={idx} className="mb-2">
                              <p className="text-sm text-gray-600">{disc.topic}: {disc.message}</p>
                              <p className="text-xs text-gray-400">— {disc.user}</p>
                            </div>
                          ))}
                          <button className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm">Post New</button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default TeacherSubject;