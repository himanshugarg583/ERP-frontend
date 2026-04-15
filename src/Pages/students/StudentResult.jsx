import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import StudentSidebar from './StudentSidebar';
import Header from '../../components/comman_components/Header';
import {
  downloadStudentDocumentV2Thunk,
  getStudentDocumentsV2Thunk,
  getStudentResultsV2Thunk,
  getStudentTimetableV2Thunk,
} from '../../store/slices/examSlice';

const StudentResult = () => {
  const dispatch = useDispatch();
  const [examEventId, setExamEventId] = useState('');
  const [results, setResults] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  const unwrapList = (response) => {
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.results)) return response.results;
    if (Array.isArray(response?.timetable)) return response.timetable;
    if (Array.isArray(response?.documents)) return response.documents;
    if (Array.isArray(response)) return response;
    return [];
  };

  const runAsync = async (fn) => {
    setLoading(true);
    try {
      await fn();
    } catch (error) {
      const message = error?.message || error?.error || error?.response?.data?.message || 'Request failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const loadResults = async () => {
    if (!examEventId) {
      toast.error('Please enter exam event id');
      return;
    }

    await runAsync(async () => {
      const response = await dispatch(getStudentResultsV2Thunk({ exam_event_id: examEventId })).unwrap();
      setResults(unwrapList(response));
      toast.success('Results loaded');
    });
  };

  const loadTimetable = async () => {
    if (!examEventId) {
      toast.error('Please enter exam event id');
      return;
    }

    await runAsync(async () => {
      const response = await dispatch(getStudentTimetableV2Thunk({ exam_event_id: examEventId })).unwrap();
      setTimetable(unwrapList(response));
      toast.success('Timetable loaded');
    });
  };

  const loadDocuments = async () => {
    await runAsync(async () => {
      const response = await dispatch(getStudentDocumentsV2Thunk({ document_type: 'report_card' })).unwrap();
      setDocuments(unwrapList(response));
      toast.success('Documents loaded');
    });
  };

  const handleDownload = async (documentUuid) => {
    if (!documentUuid) {
      toast.error('Document id not available');
      return;
    }

    await runAsync(async () => {
      await dispatch(downloadStudentDocumentV2Thunk({ documentUuid })).unwrap();
      toast.success('Download started');
    });
  };

  return (
    <div className="bg-gray-100 flex AddStudent">
      <StudentSidebar />

      <div
        className=" overflow-auto relative z-1 flex-col"
        style={{
          height: '95vh',
          width: '100vw',
          gap: '10px',
          display: 'flex',
          transition: 'margin-left 0.3s ease',
        }}
      >
        <Header />

        <main className="w-full px-4 md:px-6">
          <div className="p-4 space-y-4">
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Student Exam Center (V2)</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="md:col-span-2">
                  <label htmlFor="examEvent" className="block text-sm font-medium text-gray-700 mb-2">
                    Exam Event UUID
                  </label>
                  <input
                    id="examEvent"
                    value={examEventId}
                    onChange={(e) => setExamEventId(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter exam event id"
                  />
                </div>
                <button
                  onClick={loadTimetable}
                  disabled={loading}
                  className="bg-slate-800 text-white rounded-md px-3 py-2 disabled:opacity-60"
                >
                  Load Timetable
                </button>
                <button
                  onClick={loadResults}
                  disabled={loading}
                  className="bg-blue-600 text-white rounded-md px-3 py-2 disabled:opacity-60"
                >
                  Load Results
                </button>
              </div>
              <button
                onClick={loadDocuments}
                disabled={loading}
                className="mt-3 bg-emerald-600 text-white rounded-md px-3 py-2 disabled:opacity-60"
              >
                Load Documents
              </button>
            </div>

            {loading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Loading...</p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white shadow-md rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">My Timetable</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="p-2 text-left">Date</th>
                        <th className="p-2 text-left">Subject</th>
                        <th className="p-2 text-left">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {timetable.map((row, idx) => (
                        <tr key={row.id || idx} className="border-t border-slate-200">
                          <td className="p-2">{row.exam_date || row.date || 'N/A'}</td>
                          <td className="p-2">{row.subject_name || row.subject?.name || 'N/A'}</td>
                          <td className="p-2">{row.start_time || 'N/A'} - {row.end_time || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {timetable.length === 0 && <p className="text-sm text-slate-500 mt-2">No timetable data loaded.</p>}
                </div>
              </div>

              <div className="bg-white shadow-md rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">My Results</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="p-2 text-left">Subject</th>
                        <th className="p-2 text-left">Marks</th>
                        <th className="p-2 text-left">Grade</th>
                        <th className="p-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((row, idx) => (
                        <tr key={row.id || idx} className="border-t border-slate-200">
                          <td className="p-2">{row.subject_name || row.subject?.name || 'N/A'}</td>
                          <td className="p-2">{row.total_marks ?? row.marks_obtained ?? 'N/A'}</td>
                          <td className="p-2">{row.grade || 'N/A'}</td>
                          <td className="p-2">{row.status || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {results.length === 0 && <p className="text-sm text-slate-500 mt-2">No result data loaded.</p>}
                </div>
              </div>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">My Documents</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="p-2 text-left">Type</th>
                      <th className="p-2 text-left">Status</th>
                      <th className="p-2 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((doc, idx) => (
                      <tr key={doc.id || doc.uuid || idx} className="border-t border-slate-200">
                        <td className="p-2">{doc.document_type || 'report_card'}</td>
                        <td className="p-2">{doc.status || 'N/A'}</td>
                        <td className="p-2">
                          <button
                            onClick={() => handleDownload(doc.id || doc.uuid)}
                            className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
                          >
                            Download
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {documents.length === 0 && <p className="text-sm text-slate-500 mt-2">No documents loaded.</p>}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentResult;
