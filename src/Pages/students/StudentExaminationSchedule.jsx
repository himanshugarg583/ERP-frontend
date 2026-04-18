import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Eye } from 'lucide-react';
import { toast } from 'react-toastify';
import Header from '../../components/comman_components/Header';
import Modal from '../../components/comman_components/Modal';
import StudentSidebar from './StudentSidebar';
import {
  getStudentExamScheduleTimetableV2Thunk,
  getStudentExamSchedulesV2Thunk,
} from '../../store/slices/examSlice';

const normalizeList = (response) => {
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.schedules)) return response.schedules;
  if (Array.isArray(response)) return response;
  return [];
};

const formatDate = (value) => {
  if (!value) return 'N/A';
  return value;
};

const formatTime = (value) => {
  if (!value) return 'N/A';
  const [hourRaw, minuteRaw] = String(value).split(':');
  const hour = Number(hourRaw);
  const minute = Number(minuteRaw);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return value;

  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${String(minute).padStart(2, '0')} ${period}`;
};

const StudentExaminationSchedule = () => {
  const dispatch = useDispatch();
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [timetableRows, setTimetableRows] = useState([]);
  const [loadingSchedules, setLoadingSchedules] = useState(false);
  const [loadingTimetable, setLoadingTimetable] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadSchedules = async () => {
    setLoadingSchedules(true);
    try {
      const response = await dispatch(getStudentExamSchedulesV2Thunk()).unwrap();
      setSchedules(normalizeList(response));
    } catch (error) {
      const message = error?.message || error?.error || error?.response?.data?.message || 'Failed to load examination schedules';
      toast.error(message);
      setSchedules([]);
    } finally {
      setLoadingSchedules(false);
    }
  };

  useEffect(() => {
    loadSchedules();
  }, []);

  const handleViewTimetable = async (schedule) => {
    const examEventId = schedule?.exam_event_id;
    if (!examEventId) {
      toast.error('Exam event id not available');
      return;
    }

    setSelectedSchedule(schedule);
    setIsModalOpen(true);
    setLoadingTimetable(true);
    setTimetableRows([]);

    try {
      const response = await dispatch(getStudentExamScheduleTimetableV2Thunk({ examEventId })).unwrap();
      setTimetableRows(normalizeList(response));
    } catch (error) {
      const message = error?.message || error?.error || error?.response?.data?.message || 'Failed to load timetable';
      toast.error(message);
      setTimetableRows([]);
    } finally {
      setLoadingTimetable(false);
    }
  };

  const modalSubtitle = useMemo(() => {
    if (!selectedSchedule) return 'Exam timetable details';
    const term = selectedSchedule.exam_type_name || 'N/A';
    const event = selectedSchedule.exam_event_name || 'N/A';
    return `Term: ${term} | Exam: ${event}`;
  }, [selectedSchedule]);

  return (
    <div className="bg-gray-100 flex AddStudent">
      <StudentSidebar />

      <div
        className="overflow-auto relative z-1 flex-col"
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
            <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 flex items-center justify-between border-b border-slate-200 bg-slate-50">
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-slate-800">Examination Schedule</h1>
                  <p className="text-sm text-slate-600 mt-1">View exam list and open timetable details for each exam event.</p>
                </div>
                <button
                  onClick={loadSchedules}
                  disabled={loadingSchedules}
                  className="px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {loadingSchedules ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 uppercase text-xs tracking-wide">
                      <th className="px-4 py-3 border-b border-slate-200">Term Name</th>
                      <th className="px-4 py-3 border-b border-slate-200">Exam Name</th>
                      <th className="px-4 py-3 border-b border-slate-200">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingSchedules && (
                      <tr>
                        <td colSpan={3} className="px-4 py-10 text-center text-slate-500">
                          Loading examination schedules...
                        </td>
                      </tr>
                    )}

                    {!loadingSchedules && schedules.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-4 py-10 text-center text-slate-500">
                          No examination schedules found.
                        </td>
                      </tr>
                    )}

                    {!loadingSchedules &&
                      schedules.map((row) => (
                        <tr key={`${row.exam_schedule_id}-${row.exam_event_id}`} className="hover:bg-slate-50">
                          <td className="px-4 py-3 border-b border-slate-200 font-medium text-slate-800">{row.exam_type_name || 'N/A'}</td>
                          <td className="px-4 py-3 border-b border-slate-200 text-slate-700">{row.exam_event_name || 'N/A'}</td>
                          <td className="px-4 py-3 border-b border-slate-200">
                            <button
                              onClick={() => handleViewTimetable(row)}
                              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                            >
                              <Eye size={15} />
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </main>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedSchedule?.exam_event_name ? `Exam : ${selectedSchedule.exam_event_name}` : 'Exam Timetable'}
        subtitle={modalSubtitle}
        size="xl"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border border-slate-200 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-rose-50 text-slate-700 uppercase tracking-wide text-xs">
                <th className="px-4 py-3 border-b border-slate-200">Subject</th>
                <th className="px-4 py-3 border-b border-slate-200">Date</th>
                <th className="px-4 py-3 border-b border-slate-200">Start Time</th>
                <th className="px-4 py-3 border-b border-slate-200">End Time</th>
                <th className="px-4 py-3 border-b border-slate-200">Room</th>
                <th className="px-4 py-3 border-b border-slate-200">Full Marks</th>
                <th className="px-4 py-3 border-b border-slate-200">Passing Marks</th>
              </tr>
            </thead>
            <tbody>
              {loadingTimetable && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                    Loading timetable...
                  </td>
                </tr>
              )}

              {!loadingTimetable && timetableRows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                    No timetable rows found for this exam.
                  </td>
                </tr>
              )}

              {!loadingTimetable &&
                timetableRows.map((row) => (
                  <tr key={`${row.exam_paper_id}-${row.slot_number}`} className="hover:bg-slate-50">
                    <td className="px-4 py-3 border-b border-slate-200 text-slate-800 font-medium">{row.subject_name || 'N/A'}</td>
                    <td className="px-4 py-3 border-b border-slate-200">{formatDate(row.exam_date)}</td>
                    <td className="px-4 py-3 border-b border-slate-200">{formatTime(row.start_time)}</td>
                    <td className="px-4 py-3 border-b border-slate-200">{formatTime(row.end_time)}</td>
                    <td className="px-4 py-3 border-b border-slate-200">{row.room_label || 'N/A'}</td>
                    <td className="px-4 py-3 border-b border-slate-200">{row.max_marks || 'N/A'}</td>
                    <td className="px-4 py-3 border-b border-slate-200">{row.passing_marks || 'N/A'}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Modal>
    </div>
  );
};

export default StudentExaminationSchedule;
