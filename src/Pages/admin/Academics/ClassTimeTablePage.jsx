import React, { useCallback, useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import Header from "../../../components/comman_components/Header";
import { toast } from "react-toastify";
import { GraduationCap, Clock, RefreshCw } from "lucide-react";
import {
  fetchAllClassesForAttendance,
  getTimeTableByClassSection,
} from "../../../helper/requests-method/apiMethods";

const WEEK_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

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

const ClassTimeTablePage = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [classInfo, setClassInfo] = useState(null);
  const [timetable, setTimetable] = useState(() => ({}));
  const [loading, setLoading] = useState(false);
  const [loadingTimetable, setLoadingTimetable] = useState(false);
  const [error, setError] = useState("");

  const normalizeTimetable = useCallback((rawTimetable = {}) => {
    return WEEK_DAYS.reduce((acc, day) => {
      const entries = Array.isArray(rawTimetable[day]) ? rawTimetable[day] : [];
      acc[day] = entries.map((entry, index) => {
        const isBreak = Boolean(entry?.is_break);
        return {
          id: entry?.id ?? `${day}-${index}`,
          period_name: entry?.period_name || `Period ${index + 1}`,
          start_time: entry?.start_time || "",
          end_time: entry?.end_time || "",
          is_break: isBreak,
          subject_name: entry?.subject?.name || (isBreak ? "Break" : "N/A"),
          teacher_name: entry?.teacher?.name || (isBreak ? "" : "N/A"),
          subject_id: entry?.subject?.id ?? null,
          teacher_id: entry?.teacher?.id ?? null,
        };
      });
      return acc;
    }, {});
  }, []);

  const buildPeriodSlots = (timetable) => {
    const dayEntries = WEEK_DAYS.map((day) => timetable[day] || []);
    const maxPeriods = Math.max(0, ...dayEntries.map((entries) => entries.length));

    if (maxPeriods === 0) {
      return [
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

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await fetchAllClassesForAttendance();
      if (response.success && response.data && response.data.classes) {
        const mappedClasses = response.data.classes.map((classItem) => ({
          id: classItem.id,
          class_name: classItem.class_name,
          section_name: classItem.section_name || '',
          display_name: `${classItem.class_name}${classItem.section_name ? ` - ${classItem.section_name}` : ''}`,
        }));
        setClasses(mappedClasses);
      } else {
        toast.error('Failed to fetch classes');
        setClasses([]);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error fetching classes');
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchTimetableForClass(selectedClass.id);
    } else {
      setClassInfo(null);
      setTimetable(normalizeTimetable({}));
    }
  }, [selectedClass, normalizeTimetable]);

  const fetchTimetableForClass = async (classSectionId) => {
    if (!classSectionId) return;
    setLoadingTimetable(true);
    setError("");
    try {
      const numericId = Number(classSectionId);
      const response = await getTimeTableByClassSection(
        Number.isNaN(numericId) ? classSectionId : numericId
      );
      if (!response?.success) {
        toast.error(response?.message || "Failed to load class timetable");
      }
      const payload = response?.data || {};
      setClassInfo(payload.class_info || null);
      setTimetable(normalizeTimetable(payload.timetable || {}));
    } catch (err) {
      console.error("Error fetching class timetable:", err);
      const message =
        err?.response?.data?.message || "Failed to load class timetable";
      setError(message);
      setClassInfo(null);
      setTimetable(normalizeTimetable({}));
      toast.error(message);
    } finally {
      setLoadingTimetable(false);
    }
  };

  const handleRefresh = () => {
    if (selectedClass) {
      fetchTimetableForClass(selectedClass.id);
    }
  };

  const periodSlots = buildPeriodSlots(timetable);

  return (
    <div className="bg-slate-200 flex AddStudent">
      <Sidebar />
      <div className='overflow-auto relative z-1 flex-col' style={{ height: '95vh', width: '100vw', gap: '10px', display: 'flex', transition: 'margin-left 0.3s ease' }}>
        <Header />
        <main className="w-full py-4 md:py-6 px-4 md:px-6">
          <div className="space-y-4 md:space-y-6">
            {/* Class Selection */}
            {!selectedClass ? (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-semibold text-slate-800 mb-4">Select a Class</h2>
                {loading ? (
                  <div className="text-center py-8 text-slate-500">Loading classes...</div>
                ) : classes.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">No classes found</div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                    {classes.map((cls) => (
                      <button
                        key={cls.id}
                        onClick={() => setSelectedClass(cls)}
                        className="p-4 bg-slate-50 hover:bg-violet-50 border-2 border-slate-200 hover:border-violet-400 rounded-lg transition-all cursor-pointer text-center group"
                      >
                        <GraduationCap className="w-8 h-8 mx-auto mb-2 text-slate-600 group-hover:text-violet-600" />
                        <div className="text-sm font-medium text-slate-800 group-hover:text-violet-700">
                          {cls.display_name}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Back Button and Class Info */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedClass(null)}
                        className="px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                      >
                        ← Back to Classes
                      </button>
                      <div>
                        <h2 className="text-lg md:text-xl font-semibold text-slate-800">{selectedClass.display_name}</h2>
                        <p className="text-sm text-slate-600">Class Timetable</p>
                      </div>
                    </div>
                    <button
                      onClick={handleRefresh}
                      disabled={loadingTimetable}
                      className="px-4 py-2 text-sm bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <RefreshCw className={`w-4 h-4 ${loadingTimetable ? 'animate-spin' : ''}`} />
                      Refresh
                    </button>
                  </div>
                </div>

                {/* Timetable Display */}
                {loadingTimetable ? (
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                    <div className="text-center py-8 text-slate-500">Loading timetable...</div>
                  </div>
                ) : error ? (
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
                    <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {error}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
                    {classInfo && (
                      <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 border border-slate-200 rounded-lg p-4">
                        <div>
                          <p className="text-xs uppercase text-slate-500 tracking-wide mb-1">Class</p>
                          <p className="text-base font-semibold text-slate-900">
                            {classInfo.class_name || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs uppercase text-slate-500 tracking-wide mb-1">Section</p>
                          <p className="text-base font-semibold text-slate-900">
                            {classInfo.section_name || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs uppercase text-slate-500 tracking-wide mb-1">Class ID</p>
                          <p className="text-base font-semibold text-slate-900">
                            {classInfo.class_id ?? 'N/A'}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-sm">
                        <thead>
                          <tr className="bg-violet-100">
                            <th className="border border-slate-300 p-3 text-center font-semibold text-slate-800 sticky left-0 bg-violet-100 z-10">
                              Day
                            </th>
                            {periodSlots.map((slot, index) => (
                              <th key={index} className="border border-slate-300 p-2 md:p-3 text-center font-semibold text-slate-800 min-w-[120px]">
                                <div className="flex flex-col items-center gap-1">
                                  <span className="text-xs md:text-sm">{slot.label || `Period ${index + 1}`}</span>
                                  <span className="text-[10px] md:text-xs text-slate-600 font-normal">
                                    {formatTimeRange(slot.start_time, slot.end_time)}
                                  </span>
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {WEEK_DAYS.map((day) => {
                            const dayEntries = timetable[day] || [];
                            return (
                              <tr key={day} className="hover:bg-slate-50 transition-colors">
                                <td className="border border-slate-300 p-2 md:p-3 font-semibold text-center bg-slate-100 text-slate-800 sticky left-0 z-10">
                                  {day}
                                </td>
                                {periodSlots.map((_, index) => {
                                  const entry = dayEntries[index];
                                  if (entry?.is_break) {
                                    return (
                                      <td
                                        key={`${day}-break-${index}`}
                                        className="border border-slate-300 p-2 md:p-3 text-center text-xs md:text-sm font-semibold text-amber-800 bg-amber-100"
                                      >
                                        Break
                                      </td>
                                    );
                                  }
                                  return (
                                    <td key={`${day}-${index}`} className="border border-slate-300 p-2 md:p-3">
                                      {entry ? (
                                        <div className="text-center">
                                          <span className="block text-xs md:text-sm text-slate-800 font-medium mb-1">
                                            {entry.subject_name || 'N/A'}
                                          </span>
                                          <span className="block text-[10px] md:text-xs text-slate-600">
                                            {entry.teacher_name || 'N/A'}
                                          </span>
                                        </div>
                                      ) : (
                                        <span className="text-xs md:text-sm text-slate-400 text-center block">--</span>
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
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClassTimeTablePage;
