import React from 'react';

const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const formatTime = (timeValue) => {
  if (!timeValue) return '--';
  const [hours, minutes] = timeValue.split(':');
  if (hours === undefined || minutes === undefined) return timeValue;
  const hourNumber = Number(hours);
  const suffix = hourNumber >= 12 ? 'PM' : 'AM';
  const normalizedHour = ((hourNumber + 11) % 12) + 1;
  return `${normalizedHour}:${minutes} ${suffix}`;
};

const formatTimeRange = (start, end) => {
  if (!start && !end) return '--';
  return `${formatTime(start)} - ${formatTime(end)}`;
};

const DEFAULT_TIME_SLOTS = [
  { label: 'Period 1', start_time: '09:00:00', end_time: '09:45:00' },
  { label: 'Period 2', start_time: '09:45:00', end_time: '10:30:00' },
  { label: 'Period 3', start_time: '10:30:00', end_time: '11:15:00' },
  { label: 'Period 4', start_time: '11:15:00', end_time: '12:00:00' },
  { label: 'Lunch', start_time: '12:00:00', end_time: '12:45:00' },
  { label: 'Period 5', start_time: '12:45:00', end_time: '13:30:00' },
  { label: 'Period 6', start_time: '13:30:00', end_time: '14:15:00' },
  { label: 'Period 7', start_time: '14:15:00', end_time: '15:00:00' },
  { label: 'Period 8', start_time: '15:00:00', end_time: '15:45:00' }
];

const buildPeriodSlots = (timetable) => {
  const dayEntries = WEEK_DAYS.map((day) => timetable[day] || []);
  const maxPeriods = Math.max(0, ...dayEntries.map((entries) => entries.length));

  if (maxPeriods === 0) {
    return DEFAULT_TIME_SLOTS;
  }

  return Array.from({ length: maxPeriods }).map((_, index) => {
    const sourceEntries = dayEntries.find((entries) => entries[index]);
    const slotEntry = sourceEntries ? sourceEntries[index] : undefined;
    return {
      label: slotEntry?.period_name || `Period ${index + 1}`,
      start_time: slotEntry?.start_time || '',
      end_time: slotEntry?.end_time || ''
    };
  });
};

const TeacherTimeTable = ({
  teacherOptions = [],
  selectedTeacherId = '',
  onTeacherChange,
  timetable = {},
  teacherInfo = null,
  loading = false,
  error = '',
  onRefresh
}) => {
  const hasSelection = Boolean(selectedTeacherId);
  const periodSlots = buildPeriodSlots(timetable);

  return (
    <div className="w-full mx-auto p-6">
      <h2 className="text-2xl font-semibold text-violet-700 mb-4">Teacher Timetable</h2>

      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="w-full md:flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Teacher</label>
            <select
              value={selectedTeacherId}
              onChange={(e) => onTeacherChange?.(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-600 transition"
            >
              <option value="">-- Select Teacher --</option>
              {teacherOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => onRefresh?.()}
            disabled={!selectedTeacherId || loading}
            className={`px-6 py-3 rounded-lg font-semibold transition 
              ${!selectedTeacherId || loading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-violet-600 text-white hover:bg-violet-700 shadow'
              }`}
          >
            Refresh
          </button>
        </div>

        {teacherInfo && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-violet-50 border border-violet-100 rounded-lg p-4">
            <div>
              <p className="text-xs uppercase text-gray-500 tracking-wide">Name</p>
              <p className="text-base font-semibold text-gray-900">
                {teacherInfo.name || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-500 tracking-wide">Email</p>
              <p className="text-sm font-medium text-gray-900 break-all">
                {teacherInfo.email || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-500 tracking-wide">Qualification</p>
              <p className="text-base font-semibold text-gray-900">
                {teacherInfo.qualification || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-500 tracking-wide">Role</p>
              <p className="text-base font-semibold text-gray-900">
                {teacherInfo.role || 'N/A'}
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-600">Loading timetable...</div>
      ) : hasSelection ? (
        <div className="timetable-container">
          <h3 className="text-xl font-semibold text-violet-700 mb-4 text-center">
            Timetable for {teacherInfo?.name || 'Teacher'}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-violet-100 text-violet-800">
                  <th className="border border-gray-300 p-3 text-center font-semibold">Day</th>
                  {periodSlots.map((slot, index) => (
                    <th key={index} className="border border-gray-300 p-3 text-center font-semibold">
                      {slot.label || `Period ${index + 1}`}
                      <br />
                      <span className="text-xs text-gray-600">
                        {formatTimeRange(slot.start_time, slot.end_time)}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {WEEK_DAYS.map((day) => {
                  const dayEntries = timetable[day] || [];
                  return (
                    <tr key={day} className="hover:bg-violet-50 transition-colors">
                      <td className="border border-gray-300 p-3 font-semibold text-center bg-gray-100 text-gray-800">
                        {day}
                      </td>
                      {periodSlots.map((_, index) => {
                        const entry = dayEntries[index];
                        if (entry?.is_break) {
                          return (
                            <td
                              key={`${day}-break-${index}`}
                              className="border border-gray-300 p-3 text-center text-sm font-semibold text-amber-800 bg-amber-100"
                            >
                              Break
                            </td>
                          );
                        }
                        return (
                          <td key={`${day}-${index}`} className="border border-gray-300 p-3">
                            {entry ? (
                              <div className="slot">
                                <span className="block text-sm text-gray-800">
                                  {entry.subject_name || 'N/A'}
                                </span>
                                <span className="block text-xs text-gray-600">
                                  {entry.class_display ||
                                    [entry.class_name, entry.section_name].filter(Boolean).join(' ') ||
                                    'N/A'}
                                </span>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-400">--</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">
          Select a teacher to view the timetable.
        </div>
      )}
    </div>
  );
};

export default TeacherTimeTable;
