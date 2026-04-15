import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import Header from "../../../components/comman_components/Header";
import { 
  getExamTermDropdown,
  getExamDropdown,
  getExamScheduleByExam,
  getClassSectionDropdown,
  getStudentsByClassSection,
  getReportCardData
} from '../../../helper/requests-method/apiMethods';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';

const ReportCardGeneratorPage = () => {
  const [examTerms, setExamTerms] = useState([]);
  const [selectedTerms, setSelectedTerms] = useState([]);
  
  const [exams, setExams] = useState([]);
  const [selectedExams, setSelectedExams] = useState([]);
  
  const [events, setEvents] = useState([]);
  const [selectedEvents, setSelectedEvents] = useState([]);
  
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  // Initial loads
  useEffect(() => {
    fetchTerms();
    fetchClasses();
  }, []);

  const fetchTerms = async () => {
    try {
      const resp = await getExamTermDropdown();
      if (resp?.data) setExamTerms(resp.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch exam terms");
    }
  };

  const fetchClasses = async () => {
    try {
      const resp = await getClassSectionDropdown();
      if (resp?.data) setClasses(resp.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch classes");
    }
  };

  // Fetch exams when terms change
  useEffect(() => {
    if (selectedTerms.length > 0) {
      fetchAllExams();
    } else {
      setExams([]);
      setSelectedExams([]);
    }
  }, [selectedTerms]);

  const fetchAllExams = async () => {
    try {
      let allExams = [];
      for (const termId of selectedTerms) {
        const resp = await getExamDropdown(termId);
        if (resp?.data) {
          allExams = [...allExams, ...resp.data.map(e => ({ ...e, termId }))];
        }
      }
      setExams(allExams);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch events (schedules) when exams change
  useEffect(() => {
    if (selectedExams.length > 0) {
      fetchAllEvents();
    } else {
      setEvents([]);
      setSelectedEvents([]);
    }
  }, [selectedExams]);

  const fetchAllEvents = async () => {
    try {
      let allEvents = [];
      for (const examId of selectedExams) {
        const resp = await getExamScheduleByExam(examId);
        if (resp?.data) {
          allEvents = [...allEvents, ...resp.data.map(ev => ({ ...ev, examId }))];
        }
      }
      setEvents(allEvents);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch students when class changes
  useEffect(() => {
    if (selectedClass) {
      fetchStudentsList();
    } else {
      setStudents([]);
      setSelectedStudents([]);
    }
  }, [selectedClass]);

  const fetchStudentsList = async () => {
    try {
      setLoading(true);
      // Assuming selectedClass is classSectionId or we need to split if it's classId_sectionId
      // Based on typical patterns in this ERP, it might be classSectionId
      const resp = await getStudentsByClassSection(null, selectedClass); 
      if (resp?.data) setStudents(resp.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (id, list, setList) => {
    if (list.includes(id)) {
      setList(list.filter(i => i !== id));
    } else {
      setList([...list, id]);
    }
  };

  const handleDropdownSelection = (id, list, setList) => {
    const numericId = parseInt(id);
    if (!numericId) return;
    if (!list.includes(numericId)) {
      setList([...list, numericId]);
    }
  };

  const removeItem = (id, list, setList) => {
    setList(list.filter(i => i !== id));
  };

  const handleSelectAllStudents = (e) => {
    if (e.target.checked) {
      setSelectedStudents(students.map(s => s.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const generateReportCards = async () => {
    if (selectedStudents.length === 0 || selectedEvents.length === 0) {
      toast.warning("Please select at least one student and one event (exam subject)");
      return;
    }

    try {
      setGenerating(true);
      const payload = {
        event_ids: selectedEvents,
        student_ids: selectedStudents,
        class_section_id: selectedClass
      };
      
      const resp = await getReportCardData(payload);
      if (resp?.data) {
        // Here you would trigger PDF generation for each student in resp.data
        // For demonstration, we'll log it and show a success message
        console.log("Report card data received:", resp.data);
        toast.success("Report Card Data Generated Successfully!");
        
        // Example PDF generation call (stubbed)
        // resp.data.forEach(studentData => createPDF(studentData));
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate report cards");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Report Card Generator" />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Action Bar from Image */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex flex-wrap items-end gap-4">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Exam Type</label>
                  <select
                    onChange={(e) => handleDropdownSelection(e.target.value, selectedTerms, setSelectedTerms)}
                    className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all outline-none"
                    value=""
                  >
                    <option value="" disabled>Select exam type</option>
                    {examTerms.map(term => (
                      <option key={term.id} value={term.id} disabled={selectedTerms.includes(term.id)}>
                        {term.term_name}
                      </option>
                    ))}
                  </select>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {selectedTerms.map(termId => {
                      const term = examTerms.find(t => t.id === termId);
                      return (
                        <span key={termId} className="inline-flex items-center gap-1 px-2 py-1 bg-violet-50 text-violet-700 text-xs font-medium rounded-md border border-violet-100">
                          {term?.term_name}
                          <button onClick={() => removeItem(termId, selectedTerms, setSelectedTerms)} className="hover:text-violet-900">
                            <X size={12} />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Exam Event</label>
                  <select
                    onChange={(e) => handleDropdownSelection(e.target.value, selectedEvents, setSelectedEvents)}
                    className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all outline-none"
                    disabled={selectedExams.length === 0}
                    value=""
                  >
                    <option value="" disabled>{selectedExams.length === 0 ? "Select exam first" : "Select exam event"}</option>
                    {events.map(event => (
                      <option key={event.id} value={event.id} disabled={selectedEvents.includes(event.id)}>
                        {event.subject_name} ({event.exam_name})
                      </option>
                    ))}
                  </select>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {selectedEvents.map(eventId => {
                      const event = events.find(e => e.id === eventId);
                      return (
                        <span key={eventId} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-md border border-blue-100">
                          {event?.subject_name}
                          <button onClick={() => removeItem(eventId, selectedEvents, setSelectedEvents)} className="hover:text-blue-900">
                            <X size={12} />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Class Id</label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all outline-none"
                  >
                    <option value="">Select class id</option>
                    {classes.map(cls => (
                      <option key={cls.id} value={cls.id}>{cls.class_name} - {cls.section_name}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={fetchStudentsList}
                  disabled={!selectedClass || loading}
                  className="px-8 py-2.5 bg-violet-500 hover:bg-violet-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all disabled:bg-gray-300 disabled:cursor-not-allowed min-w-[160px]"
                >
                  {loading ? 'Processing...' : 'Show Students'}
                </button>
              </div>
            </div>

            {/* Step 1.5: Select Exams (Since events depend on exams) */}
            {selectedTerms.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-sm font-semibold text-gray-700 mb-3">Select Specific Exams</h2>
                <div className="flex flex-wrap gap-2">
                  {exams.map(exam => (
                    <button
                      key={exam.id}
                      onClick={() => toggleSelection(exam.id, selectedExams, setSelectedExams)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        selectedExams.includes(exam.id)
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {exam.exam_name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Class & Students */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="bg-violet-100 text-violet-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                Select Students
              </h2>

              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
                </div>
              ) : students.length > 0 ? (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-600 font-medium">
                      <tr>
                        <th className="p-3">
                          <input
                            type="checkbox"
                            checked={selectedStudents.length === students.length}
                            onChange={handleSelectAllStudents}
                            className="w-4 h-4 text-violet-600 rounded border-gray-300 focus:ring-violet-500"
                          />
                        </th>
                        <th className="p-3">Roll No</th>
                        <th className="p-3">Student Name</th>
                        <th className="p-3">Admission No</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {students.map(student => (
                        <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                          <td className="p-3">
                            <input
                              type="checkbox"
                              checked={selectedStudents.includes(student.id)}
                              onChange={() => toggleSelection(student.id, selectedStudents, setSelectedStudents)}
                              className="w-4 h-4 text-violet-600 rounded border-gray-300 focus:ring-violet-500"
                            />
                          </td>
                          <td className="p-3">{student.roll_number}</td>
                          <td className="p-3 font-medium text-gray-800">{student.student_name}</td>
                          <td className="p-3 text-gray-500">{student.admission_number || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : selectedClass ? (
                <p className="text-center py-8 text-gray-500">No students found in this class</p>
              ) : null}
            </div>

            {/* Action Bar */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                disabled={generating || selectedStudents.length === 0}
                onClick={generateReportCards}
                className="px-6 py-2.5 bg-violet-600 text-white rounded-lg font-semibold hover:bg-violet-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all shadow-lg shadow-violet-200"
              >
                {generating ? 'Processing...' : `Generate ${selectedStudents.length} Report Cards`}
              </button>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default ReportCardGeneratorPage;
