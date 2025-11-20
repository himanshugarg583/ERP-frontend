import React, { useState, useEffect } from 'react';
import TeacherSidebar from './TeacherSidebar';
import Header from '../../components/comman_components/Header';
import { FaCheckCircle, FaChalkboardTeacher, FaUsers, FaChevronLeft, FaCalendarAlt, FaRegClock, FaCheck, FaTimes } from 'react-icons/fa';

const ClassCard = ({ cls, onClick }) => {
  const stats = cls?.students?.reduce((acc, s) => ({
    total: acc.total + 1,
    present: acc.present + (s?.status === true ? 1 : 0),
  }), { total: 0, present: 0 }) ?? { total: 0, present: 0 };

  return (
    <div
      className="bg-white rounded-lg shadow-md hover:shadow-xl cursor-pointer transform hover:-translate-y-1 transition-all border border-gray-100" onClick={onClick}>
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 rounded-t-lg">
        <h3 className="text-white text-lg font-semibold">{cls?.name ?? ''}</h3>
        <p className="text-blue-200 text-sm">Subject: {cls?.subject ?? ''}</p>
      </div>
      <div className="p-5 space-y-3">
        <div className="flex items-center text-gray-600">
          <FaUsers className="text-blue-500 mr-2" />
          <span>{cls?.students?.length ?? 0} Students</span>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500">Today's Attendance</p>
            <p className="text-sm font-medium text-gray-700">{stats?.present ?? 0}/{stats?.total ?? 0} Present</p>
          </div>
          <FaCheckCircle className="text-green-500" />
        </div>
      </div>
    </div>
  );
};

const AttendanceView = ({ classId, classes, attendance, setAttendance, history, setHistory, setActiveClass }) => {
  const cls = classes?.find(c => c?.id === classId) ?? {};
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0] ?? '');

  const stats = attendance?.[classId]?.reduce((acc, s) => ({
    total: acc.total + 1,
    present: acc.present + (s?.status === true ? 1 : 0),
    absent: acc.absent + (s?.status === false ? 1 : 0),
  }), { total: 0, present: 0, absent: 0 }) ?? { total: 0, present: 0, absent: 0 };
  stats.unmarked = stats.total - (stats.present ?? 0) - (stats.absent ?? 0);

  const handleAttendanceChange = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [classId]: prev?.[classId]?.map(s => s?.id === studentId ? { ...s, status } : s) ?? [],
    }));
  };

  const saveAttendance = () => {
    const today = selectedDate;
    setHistory(prev => ({
      ...prev,
      [classId]: [...(prev?.[classId] ?? []), { date: today, data: [...(attendance?.[classId] ?? [])] }],
    }));
    setAttendance(prev => ({
      ...prev,
      [classId]: prev?.[classId]?.map(s => ({ ...s, status: null })) ?? [],
    }));
  };

  const getStudentAttendanceCount = (studentId) => {
    return history?.[classId]?.reduce((count, record) => 
      count + (record?.data?.find(s => s?.id === studentId)?.status === true ? 1 : 0), 0) ?? 0;
  };

  const viewPastAttendance = () => {
    const record = history?.[classId]?.find(h => h?.date === selectedDate);
    if (record) {
      setAttendance(prev => ({
        ...prev,
        [classId]: [...(record?.data ?? [])],
      }));
    } else {
      setAttendance(prev => ({
        ...prev,
        [classId]: cls?.students?.map(s => ({ ...s, status: null })) ?? [],
      }));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button
            onClick={() => setActiveClass(null)}
            className="mr-4 text-blue-600 bg-blue-100 p-2 rounded-full hover:bg-blue-200">
            <FaChevronLeft />
          </button>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{cls?.name ?? ''}</h3>
            <p className="text-sm text-gray-500">Subject: {cls?.subject ?? ''}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <input
            type="date"
            value={selectedDate ?? ''} onChange={(e) => setSelectedDate(e.target.value)} className="border rounded-md p-1"/>
          <button onClick={viewPastAttendance} className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600">
            View Past Attendance
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {['Total Students', 'Present', 'Absent', 'Unmarked'].map((label, i) => (
          <div key={i} className={`p-4 rounded-lg shadow-sm bg-${['blue', 'green', 'red', 'gray'][i]}-50`}>
            <p className="text-sm text-gray-600">{label}</p>
            <p className="text-2xl font-bold text-${['blue', 'green', 'red', 'gray'][i]}-600">{stats?.[label.toLowerCase().split(' ')[0]] ?? 0}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-between mb-6">
        <button
          onClick={() => setAttendance(prev => ({ ...prev, [classId]: prev?.[classId]?.map(s => ({ ...s, status: true })) ?? [] }))}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center">
          <FaCheck className="mr-2" /> Mark All Present
        </button>
        <button onClick={saveAttendance} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
          Save Attendance
        </button>
      </div>

      <div className="border rounded-lg overflow-hidden mb-6">
        <div className="grid grid-cols-12 bg-gray-50 p-3 font-medium text-gray-700">
          <div className="col-span-1">No.</div>
          <div className="col-span-2">Roll No</div>
          <div className="col-span-4">Name</div>
          <div className="col-span-2 text-center">Status</div>
          <div className="col-span-3 text-center">Days Present</div>
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {attendance?.[classId]?.map((s, i) => (
            <div key={s?.id ?? i} className={`grid grid-cols-12 p-3 ${i % 2 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50`}>
              <div className="col-span-1">{i + 1}</div>
              <div className="col-span-2">{s?.rollNo ?? ''}</div>
              <div className="col-span-4 font-medium">{s?.name ?? ''}</div>
              <div className="col-span-2 flex justify-center space-x-2">
                <button
                  onClick={() => handleAttendanceChange(s?.id, true)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center ${s?.status === true ? 'bg-green-500 text-white ring-2 ring-green-300' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  <FaCheck size={16} />
                </button>
                <button
                  onClick={() => handleAttendanceChange(s?.id, false)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center ${s?.status === false ? 'bg-red-500 text-white ring-2 ring-red-300' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  <FaTimes size={16} />
                </button>
              </div>
              <div className="col-span-3 text-center">{getStudentAttendanceCount(s?.id)}</div>
            </div>
          )) ?? []}
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-50 p-3 font-medium text-gray-700">Attendance History</div>
        <div className="max-h-[200px] overflow-y-auto">
          {history?.[classId]?.length ? (
            history[classId].map((r, i) => (
              <div key={i} className={`p-3 ${i % 2 ? 'bg-gray-50' : 'bg-white'}`}>
                <p>Date: {r?.date ?? ''}</p>
                <p>Present: {r?.data?.filter(s => s?.status === true)?.length ?? 0}/{r?.data?.length ?? 0}</p>
              </div>
            ))
          ) : (
            <p className="p-3 text-gray-500">No history available</p>
          )}
        </div>
      </div>
    </div>
  );
};

const TeacherAttendance = () => {
  const [activeMenu, setActiveMenu] = useState('Attendance');
  const [activeClass, setActiveClass] = useState(null);
  const [counts, setCounts] = useState({ notifications: 3, mail: 5 });
  const [attendance, setAttendance] = useState({});
  const [history, setHistory] = useState({});

  const classes = [
    { id: 1, name: "Class 10A", subject: "Mathematics", students: generateStudents(8, "10A") },
    { id: 2, name: "Class 9B", subject: "Mathematics", students: generateStudents(6, "9B") },
    { id: 3, name: "Class 11C", subject: "Physics", students: generateStudents(9, "11C") },
    { id: 4, name: "Class 11D", subject: "Chemistry", students: generateStudents(9, "11D") },
  ];

  function generateStudents(count, className) {
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: `Student ${i + 1}`,
      rollNo: `${className}${String(i + 1).padStart(2, '0')}`,
      status: null,
    })) ?? [];
  }

  useEffect(() => {
    setAttendance(classes?.reduce((acc, cls) => ({
      ...acc,
      [cls?.id]: cls?.students?.map(s => ({ ...s })) ?? [],
    }), {}) ?? {});
    setHistory(classes?.reduce((acc, cls) => ({ ...acc, [cls?.id]: [] }), {}) ?? {});
  }, []);

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

        <main className="w-full px-4 md:px-6">
          <div className="flex-1 p-6 bg-white overflow-auto">
          {activeMenu === 'Attendance' ? (
            activeClass ? (
              <AttendanceView
                classId={activeClass}
                classes={classes}
                attendance={attendance}
                setAttendance={setAttendance}
                history={history}
                setHistory={setHistory}
                setActiveClass={setActiveClass}/>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes?.map(cls => (
                  <ClassCard key={cls?.id} cls={cls} onClick={() => setActiveClass(cls?.id)} />
                )) ?? []}
              </div>
            )
          ) : (
            <div className="flex items-center justify-center h-full text-center">
              <div>
                <FaChalkboardTeacher className="text-6xl text-gray-300 mb-4" />
                <h3 className="text-2xl font-semibold text-gray-600 mb-2">{activeMenu ?? ''} Module</h3>
                <p className="text-gray-500">Click Attendance in sidebar to proceed</p>
              </div>
            </div>
          )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherAttendance;