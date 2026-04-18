import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import StudentSidebar from './StudentSidebar';
import Header from '../../components/comman_components/Header';
import { getStudentEventWiseSubjectMarksV2Thunk } from '../../store/slices/examSlice';

const StudentResult = () => {
  const dispatch = useDispatch();
  const [eventWiseResults, setEventWiseResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const unwrapList = (response) => {
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.results)) return response.results;
    if (Array.isArray(response)) return response;
    return [];
  };

  const toNumber = (value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const formatMarks = (value) => {
    const parsed = toNumber(value);
    if (parsed === null) return 'N/A';
    return parsed % 1 === 0 ? String(parsed) : parsed.toFixed(2);
  };

  const formatPercent = (value) => {
    const parsed = toNumber(value);
    if (parsed === null) return 'N/A';
    return `${parsed.toFixed(2)}%`;
  };

  const getSubjectResult = (subject) => {
    if (subject?.is_exempt) return { label: 'Exempt', className: 'bg-slate-500 text-white' };
    if (subject?.is_absent) return { label: 'Absent', className: 'bg-amber-500 text-white' };
    if (subject?.is_pass === true) return { label: 'Pass', className: 'bg-emerald-500 text-white' };
    if (subject?.is_pass === false) return { label: 'Fail', className: 'bg-rose-500 text-white' };
    return { label: 'N/A', className: 'bg-slate-400 text-white' };
  };

  const getOverallResult = (eventItem) => {
    if (eventItem?.result_is_pass === true) return { label: 'Pass', className: 'bg-emerald-500 text-white' };
    if (eventItem?.result_is_pass === false) return { label: 'Fail', className: 'bg-rose-500 text-white' };
    return { label: 'N/A', className: 'bg-slate-400 text-white' };
  };

  const loadEventWiseResults = async () => {
    setLoading(true);
    try {
      const response = await dispatch(getStudentEventWiseSubjectMarksV2Thunk()).unwrap();
      setEventWiseResults(unwrapList(response));
    } catch (error) {
      const message = error?.message || error?.error || error?.response?.data?.message || 'Request failed';
      toast.error(message);
      setEventWiseResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEventWiseResults();
  }, []);

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
            <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Report Card</h2>
                  <p className="text-sm text-slate-600 mt-1">Event wise subject marks and summary for each exam event.</p>
                </div>
                <button
                  onClick={loadEventWiseResults}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {loading ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>
            </div>

            {loading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Loading...</p>
              </div>
            )}

            {!loading && eventWiseResults.length === 0 && (
              <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-10 text-center text-slate-500">
                No report card data found.
              </div>
            )}

            {!loading &&
              eventWiseResults.map((eventItem, eventIndex) => {
                const subjects = Array.isArray(eventItem?.subjects) ? eventItem.subjects : [];
                const overallResult = getOverallResult(eventItem);

                return (
                  <section
                    key={`${eventItem?.exam_event_id || 'event'}-${eventIndex}`}
                    className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden"
                  >
                    <div className="px-5 py-4 bg-slate-100 border-b border-slate-200">
                      <h3 className="text-2xl font-bold text-slate-800">
                        {eventItem?.exam_event_name || `Event ${eventItem?.exam_event_id || eventIndex + 1}`}
                      </h3>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm border-collapse">
                        <thead>
                          <tr className="bg-rose-50 text-slate-700 uppercase tracking-wide text-xs">
                            <th className="px-4 py-3 border-b border-slate-200 text-left">Subject</th>
                            <th className="px-4 py-3 border-b border-slate-200 text-left">Full Marks</th>
                            <th className="px-4 py-3 border-b border-slate-200 text-left">Passing Marks</th>
                            <th className="px-4 py-3 border-b border-slate-200 text-left">Obtain Marks</th>
                            <th className="px-4 py-3 border-b border-slate-200 text-left">Result</th>
                          </tr>
                        </thead>
                        <tbody>
                          {subjects.length === 0 && (
                            <tr>
                              <td colSpan={5} className="px-4 py-8 text-center text-slate-500 border-b border-slate-200">
                                No subject marks available for this event.
                              </td>
                            </tr>
                          )}

                          {subjects.map((subject, subjectIndex) => {
                            const result = getSubjectResult(subject);
                            return (
                              <tr
                                key={`${subject?.marks_entry_id || subject?.subject_id || subjectIndex}`}
                                className={subjectIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50'}
                              >
                                <td className="px-4 py-4 border-b border-slate-200 text-slate-900 font-medium">
                                  {subject?.subject_name || 'N/A'}
                                </td>
                                <td className="px-4 py-4 border-b border-slate-200 text-slate-700">{formatMarks(subject?.max_marks)}</td>
                                <td className="px-4 py-4 border-b border-slate-200 text-slate-700">
                                  {formatMarks(subject?.passing_marks ?? subject?.pass_marks)}
                                </td>
                                <td className="px-4 py-4 border-b border-slate-200 text-slate-700">
                                  {formatMarks(subject?.marks_obtained ?? subject?.total_marks)}
                                </td>
                                <td className="px-4 py-4 border-b border-slate-200">
                                  <span className={`inline-flex px-3 py-1 rounded-sm text-xl font-semibold ${result.className}`}>
                                    {result.label}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    <div className="px-5 py-4 bg-slate-100 border-t border-slate-200 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 text-slate-900">
                      <div className="text-4xl sm:text-3xl font-semibold flex items-center gap-2">
                        <span>Result:</span>
                        <span className={`inline-flex px-3 py-1 rounded-sm text-2xl font-semibold ${overallResult.className}`}>
                          {overallResult.label}
                        </span>
                      </div>
                      <div className="text-3xl sm:text-2xl font-semibold">
                        Grand Total: {formatMarks(eventItem?.result_total_marks)}/{formatMarks(eventItem?.result_max_marks)}
                      </div>
                      <div className="text-3xl sm:text-2xl font-semibold">
                        Percentage: {formatPercent(eventItem?.result_percentage)}
                      </div>
                    </div>
                  </section>
                );
              })}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentResult;
