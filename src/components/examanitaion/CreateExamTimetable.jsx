import React, { useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import {
  createExamPaperV2Thunk,
  createExamTimetableEntryV2Thunk,
  listExamEventsV2Thunk,
} from '../../store/slices/examSlice';
import {
  fetchTeacherDropdown,
  getAllClassesDropdown,
  getSubjectsByClass,
} from '../../helper/requests-method/apiMethods';

const defaultEntry = {
  subject_id: '',
  max_marks: '100',
  passing_marks: '33',
  exam_date: '',
  start_time: '09:00:00',
  end_time: '12:00:00',
  slot_number: '1',
  room_label: '',
  invigilator_teacher_id: '',
};

const parseTimeToMinutes = (timeString) => {
  if (!timeString) return 0;
  const [hours = '0', minutes = '0'] = timeString.split(':');
  return Number(hours) * 60 + Number(minutes);
};

const toApiTime = (value) => {
  if (!value) return null;
  return value.length === 5 ? `${value}:00` : value;
};

const CreateExamTimetable = () => {
  const dispatch = useDispatch();
  const [examEvents, setExamEvents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm({
    defaultValues: {
      entries: [defaultEntry],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'entries',
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoadingEvents(true);
      setLoadingClasses(true);
      try {
        const [eventsResponse, classesResponse, teachersResponse] = await Promise.all([
          dispatch(listExamEventsV2Thunk({})).unwrap(),
          getAllClassesDropdown(),
          fetchTeacherDropdown(),
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

        const teacherPayload = Array.isArray(teachersResponse?.data)
          ? teachersResponse.data
          : [];
        setTeachers(teacherPayload);
      } catch (error) {
        console.error('Failed to load initial timetable data:', error);
        toast.error('Failed to load exam events/classes/teachers');
      } finally {
        setLoadingEvents(false);
        setLoadingClasses(false);
      }
    };

    fetchInitialData();
  }, [dispatch]);

  useEffect(() => {
    const fetchSubjects = async () => {
      if (!selectedClassId) {
        setSubjects([]);
        return;
      }

      setLoadingSubjects(true);
      try {
        const response = await getSubjectsByClass(selectedClassId);
        const payload = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.data?.subjects)
            ? response.data.subjects
            : [];
        setSubjects(payload);
      } catch (error) {
        console.error('Failed to load subjects:', error);
        toast.error('Failed to load subjects for selected class');
        setSubjects([]);
      } finally {
        setLoadingSubjects(false);
      }
    };

    fetchSubjects();
  }, [selectedClassId]);

  const subjectOptions = useMemo(
    () =>
      subjects.map((subject) => ({
        id: subject.subject_id || subject.id,
        name: subject.subject_name || subject.name,
        code: subject.subject_code || '',
      })),
    [subjects]
  );

  const teacherOptions = useMemo(
    () =>
      teachers.map((teacher) => ({
        id: teacher.id,
        name: teacher.name || teacher.teacher_name || `Teacher #${teacher.id}`,
      })),
    [teachers]
  );

  const onSubmit = async ({ entries }) => {
    if (!selectedEventId || !selectedClassId) {
      toast.error('Please select exam event and class');
      return;
    }

    setSubmitting(true);
    try {
      for (let index = 0; index < entries.length; index += 1) {
        const entry = entries[index];
        const startTime = toApiTime(entry.start_time);
        const endTime = toApiTime(entry.end_time);
        const durationMinutes = Math.max(
          1,
          parseTimeToMinutes(endTime) - parseTimeToMinutes(startTime)
        );

        const paperPayload = {
          exam_event_id: selectedEventId,
          subject_id: Number(entry.subject_id),
          class_id: Number(selectedClassId),
          max_marks: Number(entry.max_marks),
          passing_marks: Number(entry.passing_marks),
          marks_config: {
            theory: Number(entry.max_marks),
            practical: 0,
          },
          is_active: true,
        };

        if (entry.invigilator_teacher_id) {
          paperPayload.assigned_teacher_id = Number(entry.invigilator_teacher_id);
        }

        const paperResponse = await dispatch(createExamPaperV2Thunk(paperPayload)).unwrap();
        const paperId =
          paperResponse?.data?.id ||
          paperResponse?.data?.uuid ||
          paperResponse?.id ||
          paperResponse?.uuid;

        if (!paperId) {
          throw new Error('Exam paper creation failed: missing paper identifier');
        }

        const timetablePayload = {
          exam_event_id: selectedEventId,
          exam_paper_id: paperId,
          class_id: Number(selectedClassId),
          subject_id: Number(entry.subject_id),
          exam_date: entry.exam_date,
          start_time: startTime,
          end_time: endTime,
          duration_minutes: durationMinutes,
          slot_number: Number(entry.slot_number || index + 1),
          is_rescheduled: false,
          original_date: null,
        };

        if (entry.room_label?.trim()) {
          timetablePayload.room_label = entry.room_label.trim();
        }

        if (entry.invigilator_teacher_id) {
          timetablePayload.invigilator_teacher_id = Number(entry.invigilator_teacher_id);
        }

        await dispatch(createExamTimetableEntryV2Thunk(timetablePayload)).unwrap();
      }

      toast.success('Exam timetable entries created successfully');
      reset({ entries: [defaultEntry] });
    } catch (error) {
      console.error('Failed to create timetable entries:', error);
      toast.error(error?.message || 'Failed to create timetable entries');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full">
        <h2 className="text-2xl font-bold text-violet-700 mb-6">Create Exam Timetable (V2)</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Exam Event <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedEventId}
              onChange={(event) => setSelectedEventId(event.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600"
              disabled={loadingEvents}
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
            <label className="block text-sm font-medium text-gray-700">
              Class <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedClassId}
              onChange={(event) => setSelectedClassId(event.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600"
              disabled={loadingClasses}
            >
              <option value="">Select class</option>
              {classes.map((classItem) => (
                <option key={classItem.id} value={classItem.id}>
                  {classItem.class_name} - {classItem.section_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Timetable Entries</h3>

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 border border-gray-200 rounded-md relative"
              >
                <div className="md:col-span-3">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Subject *</label>
                  <select
                    {...register(`entries.${index}.subject_id`, { required: 'Subject is required' })}
                    disabled={!selectedClassId || loadingSubjects}
                    className={`w-full p-2 border rounded-md ${errors.entries?.[index]?.subject_id ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Select subject</option>
                    {subjectOptions.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name} {subject.code ? `(${subject.code})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Exam Date *</label>
                  <input
                    type="date"
                    {...register(`entries.${index}.exam_date`, { required: 'Exam date is required' })}
                    className={`w-full p-2 border rounded-md ${errors.entries?.[index]?.exam_date ? 'border-red-500' : 'border-gray-300'}`}
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Start *</label>
                  <input
                    type="time"
                    step="1"
                    {...register(`entries.${index}.start_time`, { required: 'Start time is required' })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1">End *</label>
                  <input
                    type="time"
                    step="1"
                    {...register(`entries.${index}.end_time`, { required: 'End time is required' })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Max *</label>
                  <input
                    type="number"
                    min="1"
                    {...register(`entries.${index}.max_marks`, { required: 'Max marks required' })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Pass *</label>
                  <input
                    type="number"
                    min="1"
                    {...register(`entries.${index}.passing_marks`, { required: 'Passing marks required' })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Slot *</label>
                  <input
                    type="number"
                    min="1"
                    {...register(`entries.${index}.slot_number`, { required: 'Slot number required' })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Room</label>
                  <input
                    type="text"
                    {...register(`entries.${index}.room_label`)}
                    placeholder="e.g. A-201"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Invigilator</label>
                  <select
                    {...register(`entries.${index}.invigilator_teacher_id`)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select teacher</option>
                    {teacherOptions.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </option>
                    ))}
                  </select>
                </div>

                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    title="Remove entry"
                  >
                    x
                  </button>
                )}
              </div>
            ))}

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => append({ ...defaultEntry, slot_number: String(fields.length + 1) })}
                disabled={!selectedClassId}
                className={`px-4 py-2 rounded-md font-medium ${
                  !selectedClassId
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-violet-100 text-violet-700 hover:bg-violet-200'
                }`}
              >
                + Add Entry
              </button>

              <button
                type="button"
                className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
                onClick={() => reset({ entries: [defaultEntry] })}
                disabled={submitting}
              >
                Reset
              </button>

              <button
                type="submit"
                disabled={submitting || !selectedEventId || !selectedClassId}
                className={`px-6 py-2 rounded-md text-white font-medium ${
                  submitting || !selectedEventId || !selectedClassId
                    ? 'bg-violet-300 cursor-not-allowed'
                    : 'bg-violet-600 hover:bg-violet-700'
                }`}
              >
                {submitting ? 'Saving...' : 'Create Timetable'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateExamTimetable;