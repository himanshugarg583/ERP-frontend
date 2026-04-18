import React, { useEffect, useMemo, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import StudentSidebar from './StudentSidebar';
import Header from '../../components/comman_components/Header';
import { getWeeklyTimetable } from '../../helper/requests-method/apiMethods';

const DEFAULT_LUNCH_SLOT = {
  id: 'lunch-12:00:00-12:45:00',
  label: '12:00 PM - 12:45 PM',
  startTime: '12:00:00',
  endTime: '12:45:00',
  isBreak: true,
};

const StudentTimetable = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalWeekClasses, setTotalWeekClasses] = useState(0);
  const [timetable, setTimetable] = useState([]);

  useEffect(() => {
    const fetchWeeklyTimetable = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await getWeeklyTimetable();
        const apiData = response?.data?.data || response?.data || {};

        if (Array.isArray(apiData.timetable)) {
          setTimetable(apiData.timetable);
          setTotalWeekClasses(apiData.total_week_classes || 0);
        } else {
          setTimetable([]);
          setTotalWeekClasses(0);
          setError('No weekly timetable available');
        }
      } catch (err) {
        console.error('Error fetching weekly timetable:', err);
        setTimetable([]);
        setTotalWeekClasses(0);
        setError(err?.message || 'Failed to load weekly timetable');
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyTimetable();
  }, []);

  const todayName = useMemo(
    () => new Date().toLocaleDateString('en-US', { weekday: 'long' }),
    []
  );

  const parseStartMinutes = (timeValue = '') => {
    const normalized = String(timeValue || '').trim();
    if (!normalized) return Number.MAX_SAFE_INTEGER;

    const match = normalized.match(/(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)?/i);
    if (!match) return Number.MAX_SAFE_INTEGER;

    let hours = Number(match[1]);
    const minutes = Number(match[2]);
    const meridiem = match[3] ? match[3].toUpperCase() : null;

    if (meridiem === 'PM' && hours < 12) hours += 12;
    if (meridiem === 'AM' && hours === 12) hours = 0;

    return hours * 60 + minutes;
  };

  const normalizeTime = (value = '') => {
    const normalized = String(value || '').trim();
    if (!normalized) return '';

    const directMatch = normalized.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
    if (directMatch) {
      const hh = String(Number(directMatch[1])).padStart(2, '0');
      const mm = directMatch[2];
      const ss = directMatch[3] || '00';
      return `${hh}:${mm}:${ss}`;
    }

    const meridiemMatch = normalized.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)$/i);
    if (meridiemMatch) {
      let hours = Number(meridiemMatch[1]);
      const minutes = meridiemMatch[2];
      const seconds = meridiemMatch[3] || '00';
      const meridiem = meridiemMatch[4].toUpperCase();

      if (meridiem === 'PM' && hours < 12) hours += 12;
      if (meridiem === 'AM' && hours === 12) hours = 0;

      return `${String(hours).padStart(2, '0')}:${minutes}:${seconds}`;
    }

    return '';
  };

  const formatTime = (timeValue = '') => {
    const normalized = normalizeTime(timeValue);
    if (!normalized) return '--';

    const [hoursText, minutesText] = normalized.split(':');
    const hourNumber = Number(hoursText);
    const suffix = hourNumber >= 12 ? 'PM' : 'AM';
    const normalizedHour = ((hourNumber + 11) % 12) + 1;
    return `${normalizedHour}:${minutesText} ${suffix}`;
  };

  const formatTimeRange = (start, end) => {
    const formattedStart = formatTime(start);
    const formattedEnd = formatTime(end);

    if (formattedStart !== '--' && formattedEnd !== '--') return `${formattedStart} - ${formattedEnd}`;
    if (formattedStart !== '--') return formattedStart;
    if (formattedEnd !== '--') return formattedEnd;
    return '--';
  };

  const extractTimeRange = (value = '') => {
    const normalized = String(value || '').trim();
    if (!normalized) return { start: '', end: '' };

    const match = normalized.match(/(\d{1,2}:\d{2}(?::\d{2})?\s*(?:AM|PM)?).{0,5}(\d{1,2}:\d{2}(?::\d{2})?\s*(?:AM|PM)?)/i);
    if (!match) return { start: '', end: '' };

    return {
      start: normalizeTime(match[1]),
      end: normalizeTime(match[2]),
    };
  };

  const normalizedDays = useMemo(() => {
    return timetable.map((dayItem, dayIndex) => {
      const day = dayItem?.day || `Day ${dayIndex + 1}`;
      const sourceClasses = Array.isArray(dayItem?.classes) ? dayItem.classes : [];

      const classes = sourceClasses.map((item, classIndex) => {
        const rangeFromTimeLabel = extractTimeRange(item?.time || '');
        const startTime = normalizeTime(item?.start_time || rangeFromTimeLabel.start);
        const endTime = normalizeTime(item?.end_time || rangeFromTimeLabel.end);
        const displayRange = formatTimeRange(startTime, endTime);
        const subject = item?.subject || item?.subject_name || '-';
        const isBreak = Boolean(item?.is_break) || /lunch|break/i.test(`${subject} ${item?.time || ''} ${item?.period_name || ''}`);
        const slotId = (startTime || endTime)
          ? `${startTime || 'NA'}-${endTime || 'NA'}`
          : `period-${classIndex + 1}-${item?.time || item?.period_name || subject}`;
        const fallbackLabel = item?.time || item?.period_name || `Period ${classIndex + 1}`;

        return {
          id: `${day}-${classIndex}`,
          subject,
          teacher: item?.teacher || item?.teacher_name || '-',
          room: item?.room || item?.room_name || '-',
          time: displayRange !== '--' ? displayRange : fallbackLabel,
          startTime,
          endTime,
          isBreak,
          slotId,
        };
      });

      return {
        day,
        isToday: day === todayName,
        totalClasses: dayItem?.total_classes || classes.length,
        classes,
      };
    });
  }, [timetable, todayName]);

  const timeSlots = useMemo(() => {
    const slotMap = new Map();

    normalizedDays.forEach((dayItem) => {
      dayItem.classes.forEach((item) => {
        if (!slotMap.has(item.slotId)) {
          const slotStart = item.startTime || item.time;
          const slotEnd = item.endTime || '';
          slotMap.set(item.slotId, {
            id: item.slotId,
            label: item.time,
            startTime: item.startTime,
            endTime: item.endTime,
            isBreak: item.isBreak,
            sortValue: parseStartMinutes(slotStart),
            endSortValue: parseStartMinutes(slotEnd),
          });
        }
      });
    });

    let slots = [...slotMap.values()].sort((a, b) => {
      if (a.sortValue !== b.sortValue) return a.sortValue - b.sortValue;
      if (a.endSortValue !== b.endSortValue) return a.endSortValue - b.endSortValue;
      return a.label.localeCompare(b.label);
    });

    const hasBreakSlot = slots.some((slot) => slot.isBreak || /lunch|break/i.test(slot.label));
    if (!hasBreakSlot) {
      slots.push({
        ...DEFAULT_LUNCH_SLOT,
        sortValue: parseStartMinutes(DEFAULT_LUNCH_SLOT.startTime),
        endSortValue: parseStartMinutes(DEFAULT_LUNCH_SLOT.endTime),
      });
      slots = slots.sort((a, b) => {
        if (a.sortValue !== b.sortValue) return a.sortValue - b.sortValue;
        if (a.endSortValue !== b.endSortValue) return a.endSortValue - b.endSortValue;
        return a.label.localeCompare(b.label);
      });
    }

    return slots;
  }, [normalizedDays]);

  const matrixRows = useMemo(() => {
    return normalizedDays.map((dayItem) => {
      const classBySlotId = new Map();
      dayItem.classes.forEach((item) => {
        if (!classBySlotId.has(item.slotId)) {
          classBySlotId.set(item.slotId, item);
        }
      });

      return {
        ...dayItem,
        classBySlotId,
      };
    });
  }, [normalizedDays]);

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

        <main className="p-4 md:p-6 lg:p-8">
          <div className="bg-white rounded-xl shadow-sm p-5 md:p-6 mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Class Timetable</h2>
            <p className="text-sm text-slate-500 mt-1">Total classes this week: {totalWeekClasses}</p>
          </div>

          {loading ? (
            <Box display="flex" justifyContent="center" py={6}>
              <CircularProgress size={50} sx={{ color: '#6366f1' }} />
            </Box>
          ) : error ? (
            <Box display="flex" justifyContent="center" py={6}>
              <Typography variant="body1" color="error">{error}</Typography>
            </Box>
          ) : (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-auto" style={{ maxHeight: '560px' }}>
                {timeSlots.length > 0 ? (
                  <table className="w-full text-sm" style={{ minWidth: '900px' }}>
                    <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th
                          className="sticky left-0 z-20 bg-slate-50 px-4 py-3 text-left font-semibold text-slate-700 border-r border-slate-200"
                          style={{ minWidth: '150px' }}
                        >
                          Day
                        </th>
                        {timeSlots.map((slot) => (
                          <th
                            key={slot.id}
                            className="px-4 py-3 text-left font-semibold text-slate-700 border-r border-slate-200"
                            style={{ minWidth: '180px' }}
                          >
                            <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">
                              {slot.isBreak ? 'Lunch Break' : 'Class Time'}
                            </div>
                            <div>{slot.label}</div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {matrixRows.map((dayRow, rowIndex) => (
                        <tr
                          key={dayRow.day}
                          className={dayRow.isToday ? 'bg-indigo-50/60' : rowIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}
                        >
                          <th
                            scope="row"
                            className="sticky left-0 z-10 px-4 py-4 text-left border-r border-slate-200 bg-inherit"
                          >
                            <div className="font-semibold text-slate-800 uppercase tracking-wide text-xs md:text-sm">{dayRow.day}</div>
                            <div className="text-xs text-slate-500 mt-1">{dayRow.totalClasses} classes</div>
                          </th>

                          {timeSlots.map((slot) => {
                            const slotClass = dayRow.classBySlotId.get(slot.id);

                            return (
                              <td key={`${dayRow.day}-${slot.id}`} className="px-4 py-3 align-top border-r border-slate-100">
                                {slotClass && !slotClass.isBreak ? (
                                  <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2">
                                    <p className="font-semibold text-emerald-700 leading-5">{slotClass.subject}</p>
                                    <p className="text-xs text-slate-700 mt-1">{slotClass.teacher}</p>
                                    <p className="text-xs text-slate-500">{slotClass.room}</p>
                                  </div>
                                ) : slot.isBreak || slotClass?.isBreak ? (
                                  <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-center">
                                    <p className="font-semibold text-amber-700 leading-5">Lunch Break</p>
                                    <p className="text-xs text-amber-600 mt-1">{slot.label}</p>
                                  </div>
                                ) : (
                                  <span className="text-slate-400 text-xs">-</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <Box display="flex" justifyContent="center" py={4}>
                    <Typography variant="body2" color="#666">No timetable entries available</Typography>
                  </Box>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default StudentTimetable;