import React, { useMemo, useState, useEffect } from 'react';
import TeacherSidebar from './TeacherSidebar'; 
import Header from '../../components/comman_components/Header';   
import { FaClock, FaChalkboardTeacher, FaUsers } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getTeacherMyTimetable, getTeacherClassTimetable } from '../../helper/requests-method/timetableApi';
import { getTeacherClasses } from '../../helper/requests-method/apiMethods';

const TeacherTimetable = () => {
  const [loadingTeacherTimetable, setLoadingTeacherTimetable] = useState(false);
  const [loadingClassTimetable, setLoadingClassTimetable] = useState(false);
  const [loadingTeacherClasses, setLoadingTeacherClasses] = useState(false);
  const [teacherTimetable, setTeacherTimetable] = useState(null);
  const [teacherClasses, setTeacherClasses] = useState([]);
  const [classTimetable, setClassTimetable] = useState(null);
  const [selectedClassSectionId, setSelectedClassSectionId] = useState(null);
  const [activeTab, setActiveTab] = useState('teacher'); // 'teacher' | 'class'
  
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const loading = loadingTeacherTimetable || loadingClassTimetable || loadingTeacherClasses;

  useEffect(() => {
    fetchTeacherTimetable();
    fetchTeacherClasses();
  }, []);

  useEffect(() => {
    if (activeTab !== 'class') return;

    if (!selectedClassSectionId) {
      if (teacherClasses.length > 0) {
        setSelectedClassSectionId(teacherClasses[0].class_section_id);
      }
      return;
    }

    fetchClassTimetable(selectedClassSectionId);
  }, [activeTab, selectedClassSectionId, teacherClasses]);

  const fetchTeacherTimetable = async () => {
    try {
      setLoadingTeacherTimetable(true);
      const response = await getTeacherMyTimetable();
      if (response.success && response.data) {
        setTeacherTimetable(response.data);
      } else {
        toast.error(response.message || 'Failed to fetch teacher timetable');
      }
    } catch (error) {
      console.error('Failed to fetch teacher timetable:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch teacher timetable');
    } finally {
      setLoadingTeacherTimetable(false);
    }
  };

  const fetchTeacherClasses = async () => {
    try {
      setLoadingTeacherClasses(true);
      const response = await getTeacherClasses();
      const classes = Array.isArray(response?.data?.classes) ? response.data.classes : [];
      setTeacherClasses(classes);
      if (!selectedClassSectionId && classes.length > 0) {
        setSelectedClassSectionId(classes[0].class_section_id);
      }
    } catch (error) {
      console.error('Failed to fetch teacher classes:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch teacher classes');
    } finally {
      setLoadingTeacherClasses(false);
    }
  };

  const fetchClassTimetable = async (classSectionId) => {
    try {
      setLoadingClassTimetable(true);
      const response = await getTeacherClassTimetable(classSectionId);
      if (response.success && response.data) {
        setClassTimetable(response.data);
      } else {
        toast.error(response.message || 'Failed to fetch class timetable');
      }
    } catch (error) {
      console.error('Failed to fetch class timetable:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch class timetable');
    } finally {
      setLoadingClassTimetable(false);
    }
  };

  const handleClassClick = (classSectionId) => {
    setSelectedClassSectionId(classSectionId);
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    if (tab === 'teacher') {
      setClassTimetable(null);
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    if (typeof timeString !== 'string') return '';
    const normalized = timeString.trim();

    if (/AM|PM/i.test(normalized)) {
      return normalized;
    }

    if (normalized.includes(':')) {
      const [hh, mm] = normalized.split(':');
      if (hh && mm) return `${hh}:${mm}`;
    }

    return normalized;
  };

  const getCurrentTimetable = () => {
    return activeTab === 'teacher' ? teacherTimetable?.timetable : classTimetable?.timetable;
  };

  const orderedSlots = useMemo(() => {
    const timetable = getCurrentTimetable();
    if (!timetable) return [];

    const slotMap = new Map();

    days.forEach((day) => {
      const dayEntries = Array.isArray(timetable[day]) ? timetable[day] : [];

      dayEntries.forEach((entry, index) => {
        const slotId = entry.slot_id || entry.slot?.id || null;
        const slotNumber = Number(entry.slot_number || entry.slot?.slot_number || index + 1);
        const slotLabel = entry.period_name || entry.slot?.slot_label || `Period ${slotNumber}`;
        const startTime = entry.start_time || entry.slot?.start_time || '';
        const endTime = entry.end_time || entry.slot?.end_time || '';

        const key = slotId ? `slot-id-${slotId}` : `slot-no-${slotNumber}`;

        if (!slotMap.has(key)) {
          slotMap.set(key, {
            key,
            slot_number: slotNumber,
            slot_label: slotLabel,
            start_time: startTime,
            end_time: endTime,
          });
        }
      });
    });

    return Array.from(slotMap.values()).sort((a, b) => {
      if (a.slot_number !== b.slot_number) return a.slot_number - b.slot_number;
      return String(a.start_time || '').localeCompare(String(b.start_time || ''));
    });
  }, [activeTab, teacherTimetable, classTimetable]);

  const getPeriodForSlot = (day, slotMeta) => {
    const timetable = getCurrentTimetable();
    const dayEntries = Array.isArray(timetable?.[day]) ? timetable[day] : [];

    const bySlotNumber = dayEntries.find(
      (entry) => Number(entry.slot_number || entry.slot?.slot_number) === Number(slotMeta.slot_number)
    );
    if (bySlotNumber) return bySlotNumber;

    return null;
  };

  const renderMatrixTimetable = (viewType) => {
    const timetable = getCurrentTimetable();
    if (!timetable || !orderedSlots.length) {
      return <div className="py-10 text-center text-gray-500">No timetable data available</div>;
    }

    const getMatrixCell = (period) => {
      if (!period) {
        return <span className="text-gray-400 text-sm">-</span>;
      }

      const isBreak = period.is_break || period.slot?.is_break;
      const startTime = period.start_time || period.slot?.start_time || '';
      const endTime = period.end_time || period.slot?.end_time || '';
      const slotLabel =
        period.period_name ||
        period.slot?.slot_label ||
        `Period ${period.slot_number || period.slot?.slot_number || ''}`;
      const subjectName =
        period.subject?.subject_name ||
        period.subject_info?.subject_name ||
        period.subject_name ||
        'No subject';
      const teacherName = period.teacher?.name || period.teacher_name || 'No teacher';
      const classDisplay =
        period.class_info?.display ||
        period.class_info?.display_name ||
        period.class_display ||
        [period.class_name, period.section_name].filter(Boolean).join(' ');
      const secondaryText = viewType === 'class' ? teacherName : (classDisplay || 'Class not assigned');

      if (isBreak) {
        return (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 text-center">
            <p className="text-xs font-semibold text-yellow-700">{slotLabel || 'Break'}</p>
            <p className="text-[11px] text-yellow-600 mt-1">
              {formatTime(startTime)} - {formatTime(endTime)}
            </p>
          </div>
        );
      }

      return (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
          <p className="text-sm font-semibold text-emerald-900 leading-tight">{subjectName}</p>
          <p className="text-xs text-emerald-800 mt-1">{secondaryText}</p>
          <p className="text-[11px] text-emerald-700 mt-1">{slotLabel}</p>
        </div>
      );
    };

    return (
      <div className="overflow-x-auto">
        <table className="min-w-275 w-full table-fixed border-separate border-spacing-0">
          <thead>
            <tr className="bg-gray-100">
              <th className="sticky left-0 z-20 bg-gray-100 py-3 px-4 text-left text-xs font-semibold text-gray-700 border-b border-gray-200 min-w-40">
                Day
              </th>
              {orderedSlots.map((slot) => (
                <th
                  key={`slot-header-${slot.key}`}
                  className="py-3 px-3 text-left text-[11px] font-semibold text-gray-700 border-b border-gray-200 min-w-47.5"
                >
                  <p className="uppercase tracking-wide text-gray-500">{slot.slot_label}</p>
                  <p className="text-gray-700 mt-1">
                    {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                  </p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map((day, index) => {
              const dayEntries = Array.isArray(timetable[day]) ? timetable[day] : [];
              const classesCount = dayEntries.filter((entry) => !(entry.is_break || entry.slot?.is_break)).length;

              return (
                <tr key={`row-${day}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50/70'}>
                  <td className="sticky left-0 z-10 bg-inherit py-4 px-4 align-top border-b border-gray-200">
                    <p className="text-sm font-bold text-gray-800 uppercase tracking-wide">{day}</p>
                    <p className="text-xs text-gray-500 mt-1">{classesCount} classes</p>
                  </td>
                  {orderedSlots.map((slot) => {
                    const period = getPeriodForSlot(day, slot);
                    return (
                      <td
                        key={`cell-${day}-${slot.key}`}
                        className="py-2 px-2 align-top border-b border-gray-200"
                      >
                        {getMatrixCell(period)}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const getTotalClasses = () => {
    const timetable = getCurrentTimetable();
    if (!timetable) return 0;
    return Object.values(timetable).reduce((sum, day) => sum + (day?.filter(p => !p.is_break)?.length || 0), 0);
  };

  const selectedClassInfo = teacherClasses.find(
    (classItem) => Number(classItem.class_section_id) === Number(selectedClassSectionId)
  );

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

        <main className="w-full px-4 md:px-6 py-6">
          <ToastContainer position="top-right" autoClose={3000} />
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center mb-4 sm:mb-0">
                <FaChalkboardTeacher className="text-4xl text-indigo-600 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    Teacher Timetable
                  </h1>
                  {activeTab === 'teacher' && teacherTimetable?.teacher_info && (
                    <p className="text-sm text-gray-600 mt-1">
                      {teacherTimetable.teacher_info.name} - {teacherTimetable.teacher_info.qualification}
                    </p>
                  )}
                  {activeTab === 'class' && selectedClassInfo && (
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedClassInfo.display_name} | Students: {selectedClassInfo.total_students || 0}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-4 p-2 bg-white rounded-lg shadow-sm border border-gray-200 inline-flex gap-2">
              <button
                onClick={() => handleTabSwitch('teacher')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'teacher' ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                }`}
              >
                My Timetable
              </button>
              <button
                onClick={() => handleTabSwitch('class')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'class' ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                }`}
              >
                Class Timetables
              </button>
            </div>

            {activeTab === 'class' && (
              <div className="mb-4 p-4 bg-white rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                  <FaUsers className="mr-2 text-indigo-600" />
                  My Classes
                </h2>

                {loadingTeacherClasses ? (
                  <p className="text-sm text-gray-500">Loading classes...</p>
                ) : teacherClasses.length === 0 ? (
                  <p className="text-sm text-gray-500">No classes assigned to this teacher.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {teacherClasses.map((cls) => {
                      const isSelected = Number(selectedClassSectionId) === Number(cls.class_section_id);
                      return (
                        <button
                          key={cls.class_section_id}
                          onClick={() => handleClassClick(cls.class_section_id)}
                          className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                            isSelected
                              ? 'bg-indigo-600 text-white'
                              : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                          }`}
                        >
                          {cls.display_name || `${cls.class_name} ${cls.section_name}`}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
              {loading ? (
                <div className="py-20 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading timetable...</p>
                </div>
              ) : (
                renderMatrixTimetable(activeTab)
              )}
            </div>

            <div className="mt-6 text-gray-600 text-sm flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2">
              <p>
                Total Classes: {getTotalClasses()}
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherTimetable;
