import React, { useEffect, useMemo, useState } from 'react';
import { FaClipboardList } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import {
  listExamEventsV2Thunk,
  listExamPapersV2Thunk,
  listExamTimetableEntriesV2Thunk,
} from '../../store/slices/examSlice';
import { getAllClassesDropdown } from '../../helper/requests-method/apiMethods';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const ViewExamTimetable = () => {
  const dispatch = useDispatch();
  const [examEvents, setExamEvents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedExamEventId, setSelectedExamEventId] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [entries, setEntries] = useState([]);
  const [papersById, setPapersById] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [eventsResponse, classesResponse] = await Promise.all([
          dispatch(listExamEventsV2Thunk({})).unwrap(),
          getAllClassesDropdown(),
        ]);

        const eventPayload = Array.isArray(eventsResponse?.data)
          ? eventsResponse.data
          : Array.isArray(eventsResponse)
            ? eventsResponse
            : [];
        setExamEvents(eventPayload);

        const classPayload = Array.isArray(classesResponse?.data)
          ? classesResponse.data
          : [];
        setClasses(classPayload);
      } catch (loadError) {
        console.error('Error loading initial timetable data:', loadError);
        toast.error('Failed to load exam events/classes');
      }
    };

    fetchInitialData();
  }, [dispatch]);

  const selectedClass = useMemo(
    () => classes.find((classItem) => String(classItem.id) === String(selectedClassId)),
    [classes, selectedClassId]
  );

  const selectedEvent = useMemo(
    () =>
      examEvents.find(
        (eventItem) => String(eventItem.id || eventItem.uuid) === String(selectedExamEventId)
      ),
    [examEvents, selectedExamEventId]
  );

  const handleFetchTimetable = async () => {
    if (!selectedExamEventId || !selectedClassId) {
      setError('Please select both exam event and class');
      return;
    }

    setLoading(true);
    setError('');
    setEntries([]);

    try {
      const [timetableResponse, papersResponse] = await Promise.all([
        dispatch(listExamTimetableEntriesV2Thunk({ exam_event_id: selectedExamEventId })).unwrap(),
        dispatch(listExamPapersV2Thunk({ exam_event_id: selectedExamEventId })).unwrap(),
      ]);

      const timetablePayload = Array.isArray(timetableResponse?.data)
        ? timetableResponse.data
        : Array.isArray(timetableResponse)
          ? timetableResponse
          : [];

      const paperPayload = Array.isArray(papersResponse?.data)
        ? papersResponse.data
        : Array.isArray(papersResponse)
          ? papersResponse
          : [];

      const paperMap = paperPayload.reduce((acc, paperItem) => {
        const key = paperItem.id || paperItem.uuid;
        if (key) {
          acc[key] = paperItem;
        }
        return acc;
      }, {});

      setPapersById(paperMap);

      const filteredEntries = timetablePayload
        .filter((entry) => String(entry.class_id) === String(selectedClassId))
        .sort((a, b) => {
          if (a.exam_date !== b.exam_date) {
            return new Date(a.exam_date) - new Date(b.exam_date);
          }
          return Number(a.slot_number || 0) - Number(b.slot_number || 0);
        });

      if (!filteredEntries.length) {
        setError('No timetable entries found for this exam event and class');
      }

      setEntries(filteredEntries);
    } catch (fetchError) {
      console.error('Error fetching timetable:', fetchError);
      setError('Failed to fetch timetable entries. Please try again.');
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full">
        <h2 className="text-2xl font-bold text-violet-700 mb-6">View Exam Timetable (V2)</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Exam Event *</label>
            <select
              value={selectedExamEventId}
              onChange={(event) => {
                setSelectedExamEventId(event.target.value);
                setEntries([]);
                setError('');
              }}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600"
            >
              <option value="">Select exam event</option>
              {examEvents.map((eventItem) => (
                <option key={eventItem.id || eventItem.uuid} value={eventItem.id || eventItem.uuid}>
                  {(eventItem.name || eventItem.exam_name) +
                    (eventItem.academic_year ? ` (${eventItem.academic_year})` : '')}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Class *</label>
            <select
              value={selectedClassId}
              onChange={(event) => {
                setSelectedClassId(event.target.value);
                setEntries([]);
                setError('');
              }}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600"
            >
              <option value="">Select class</option>
              {classes.map((classItem) => (
                <option key={classItem.id} value={classItem.id}>
                  {classItem.class_name} - {classItem.section_name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">&nbsp;</label>
            <button
              onClick={handleFetchTimetable}
              disabled={!selectedExamEventId || !selectedClassId || loading}
              className={`w-full px-4 py-2.5 rounded-md font-medium ${
                !selectedExamEventId || !selectedClassId || loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-violet-600 text-white hover:bg-violet-700'
              }`}
            >
              {loading ? 'Loading...' : 'View Timetable'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
            {error}
          </div>
        )}

        {!!entries.length && (
          <div className="space-y-6">
            <div className="bg-linear-to-r from-violet-50 to-indigo-50 p-5 rounded-lg border border-violet-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">Exam Event</h3>
                  <p className="text-lg font-bold text-violet-700">{selectedEvent?.name || selectedEvent?.exam_name}</p>
                  <p className="text-sm text-gray-600">{selectedEvent?.academic_year || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">Class</h3>
                  <p className="text-lg font-bold text-violet-700">
                    {selectedClass?.class_name} - {selectedClass?.section_name}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">Total Entries</h3>
                  <p className="text-lg font-bold text-violet-700">{entries.length}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaClipboardList className="mr-2 text-violet-600" />
                Exam Schedule
              </h3>

              <div className="border border-gray-200 rounded-lg overflow-x-auto bg-white">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-100 text-slate-700">
                    <tr>
                      <th className="text-left p-3 font-semibold">Exam Date</th>
                      <th className="text-left p-3 font-semibold">Slot</th>
                      <th className="text-left p-3 font-semibold">Subject</th>
                      <th className="text-left p-3 font-semibold">Time</th>
                      <th className="text-left p-3 font-semibold">Room</th>
                      <th className="text-left p-3 font-semibold">Invigilator</th>
                      <th className="text-left p-3 font-semibold">Max / Pass</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((entry) => {
                      const linkedPaper = papersById[entry.exam_paper_id] || {};
                      const subjectName =
                        entry.subject?.subject_name ||
                        entry.subject?.name ||
                        linkedPaper.subject?.subject_name ||
                        linkedPaper.subject?.name ||
                        `Subject #${entry.subject_id}`;

                      const invigilatorLabel =
                        entry.invigilator_teacher?.name ||
                        linkedPaper.assigned_teacher?.name ||
                        entry.invigilator_name ||
                        entry.invigilator_teacher_id ||
                        'N/A';

                      return (
                        <tr key={entry.id || entry.uuid} className="border-t border-slate-200 align-top">
                          <td className="p-3 whitespace-nowrap">{formatDate(entry.exam_date)}</td>
                          <td className="p-3 whitespace-nowrap">{entry.slot_number ? `Slot ${entry.slot_number}` : 'N/A'}</td>
                          <td className="p-3 font-medium text-slate-800">{subjectName}</td>
                          <td className="p-3 whitespace-nowrap">{entry.start_time || 'N/A'} - {entry.end_time || 'N/A'}</td>
                          <td className="p-3 whitespace-nowrap">{entry.room_label || 'N/A'}</td>
                          <td className="p-3 whitespace-nowrap">{invigilatorLabel}</td>
                          <td className="p-3 whitespace-nowrap">{linkedPaper.max_marks ?? 'N/A'} / {linkedPaper.passing_marks ?? 'N/A'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {!entries.length && !error && !loading && (
          <div className="text-center py-12 text-gray-500">
            Select exam event and class to view timetable entries.
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewExamTimetable;