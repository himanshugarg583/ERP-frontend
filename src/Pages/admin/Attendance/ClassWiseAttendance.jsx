import React from "react";
import Sidebar from "../Sidebar";
import Header from "../../../components/comman_components/Header";
import {
  FaCheckCircle,
  FaChalkboardTeacher,
  FaUsers,
  FaChevronLeft,
  FaCalendarAlt,
  FaRegClock,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { useState, useEffect } from "react";

const ClassWiseAttendance = () => {
  const [activeMenu, setActiveMenu] = useState("Attendance");
  const [activeClass, setActiveClass] = useState(null);
  const [attendanceData, setAttendanceData] = useState({});

  const teacherClasses = [
    {
      id: 1,
      name: "Class 10A",
      subject: "Mathematics",
      students: generateStudents(8, "10A"),
    },
    {
      id: 2,
      name: "Class 9B",
      subject: "Mathematics",
      students: generateStudents(6, "9B"),
    },
    {
      id: 3,
      name: "Class 11C",
      subject: "Physics",
      students: generateStudents(9, "11C"),
    },
    {
      id: 4,
      name: "Class 11D",
      subject: "Chemistry",
      students: generateStudents(9, "11D"),
    },
  ];

  function generateStudents(count, className) {
    return Array.from({ length: count }, (_, index) => ({
      id: index + 1,
      name: `Student ${index + 1}`,
      rollNo: `${className}${String(index + 1).padStart(2, "0")}`,
      present: false,
    }));
  }

  useEffect(() => {
    const initialAttendanceData = {};
    teacherClasses.forEach((classItem) => {
      initialAttendanceData[classItem.id] = classItem.students.map(
        (student) => ({
          ...student,
          present: false,
        })
      );
    });
    setAttendanceData(initialAttendanceData);
  }, []);

  const handleMenuClick = (menuName) => {
    setActiveMenu(menuName);
    setActiveClass(null);
  };

  const handleClassClick = (classId) => {
    setActiveClass(classId);
  };

  const handleNotificationClick = () => {
    setNotificationCount(0);
  };

  const handleMailClick = () => {
    setMailCount(0);
  };

  const handleAttendanceChange = (classId, studentId, isPresent) => {
    setAttendanceData((prevData) => {
      const updatedData = { ...prevData };
      if (updatedData[classId]) {
        updatedData[classId] = updatedData[classId].map((student) =>
          student.id === studentId
            ? { ...student, present: isPresent }
            : student
        );
      }
      return updatedData;
    });
  };

  const handleAllPresent = (classId) => {
    setAttendanceData((prevData) => {
      const updatedData = { ...prevData };
      if (updatedData[classId]) {
        updatedData[classId] = updatedData[classId].map((student) => ({
          ...student,
          present: true,
        }));
      }
      return updatedData;
    });
  };

  const calculateAttendanceStats = (classId) => {
    if (!attendanceData[classId])
      return { total: 0, present: 0, absent: 0, percentage: 0 };

    const total = attendanceData[classId].length;
    const present = attendanceData[classId].filter(
      (student) => student.present
    ).length;
    const absent = total - present;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

    return { total, present, absent, percentage };
  };

  return (
    <div className="bg-slate-200 flex AddStudent">
      <Sidebar />

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

        <main className="w-full py-6 px-4 md:px-6">
          <div className="flex-1 overflow-auto p-6 bg-white rounded-xl shadow-sm border border-slate-200">
            {activeMenu === "Attendance" && (
              <div className="h-full">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Attendance Management
                </h2>

                {activeClass ? (
                  <div className="bg-white rounded-lg shadow-md p-6 animate-fadeIn">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <button
                          onClick={() => setActiveClass(null)}
                          className="mr-4 text-violet-600 hover:text-violet-800 transition-colors bg-violet-50 p-2 rounded-full"
                        >
                          <FaChevronLeft />
                        </button>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800">
                            {
                              teacherClasses.find((c) => c.id === activeClass)
                                ?.name
                            }
                          </h3>
                          <p className="text-sm text-gray-500">
                            Subject:{" "}
                            {
                              teacherClasses.find((c) => c.id === activeClass)
                                ?.subject
                            }
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <div className="flex items-center mr-4 text-sm">
                          <FaCalendarAlt className="mr-1 text-gray-600" />
                          <span>{new Date().toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <FaRegClock className="mr-1 text-gray-600" />
                          <span>
                            {new Date().toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      {(() => {
                        const stats = calculateAttendanceStats(activeClass);
                        return (
                          <>
                            <div className="bg-violet-50 p-4 rounded-lg border border-violet-100 shadow-sm">
                              <p className="text-sm text-gray-600 mb-1">
                                Total Students
                              </p>
                              <p className="text-2xl font-bold text-violet-600">
                                {stats.total}
                              </p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg border border-green-100 shadow-sm">
                              <p className="text-sm text-gray-600 mb-1">
                                Present
                              </p>
                              <p className="text-2xl font-bold text-green-600">
                                {stats.present}
                              </p>
                            </div>
                            <div className="bg-red-50 p-4 rounded-lg border border-red-100 shadow-sm">
                              <p className="text-sm text-gray-600 mb-1">
                                Absent
                              </p>
                              <p className="text-2xl font-bold text-red-600">
                                {stats.absent}
                              </p>
                            </div>
                            <div className="bg-violet-50 p-4 rounded-lg border border-violet-100 shadow-sm">
                              <p className="text-sm text-gray-600 mb-1">
                                Attendance Rate
                              </p>
                              <p className="text-2xl font-bold text-violet-700">
                                {stats.percentage}%
                              </p>
                            </div>
                          </>
                        );
                      })()}
                    </div>

                    <div className="flex justify-between mb-6">
                      <button
                        onClick={() => handleAllPresent(activeClass)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors shadow-sm flex items-center"
                      >
                        <FaCheck className="mr-2" />
                        Mark All Present
                      </button>
                      <button className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-md transition-colors shadow-sm">
                        Save Attendance
                      </button>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <div className="grid grid-cols-12 bg-gray-50 p-3 border-b border-gray-200 font-medium text-gray-700">
                        <div className="col-span-1">No.</div>
                        <div className="col-span-3">Roll No</div>
                        <div className="col-span-6">Student Name</div>
                        <div className="col-span-2 text-center">Status</div>
                      </div>
                      <div className="max-h-[300px] overflow-y-auto">
                        {attendanceData[activeClass]?.map((student, index) => (
                          <div
                            key={student.id}
                            className={`grid grid-cols-12 p-3 ${
                              index % 2 === 0 ? "bg-white" : "bg-gray-50"
                            } hover:bg-violet-50 transition-colors border-b border-gray-100`}
                          >
                            <div className="col-span-1">{index + 1}</div>
                            <div className="col-span-3">{student.rollNo}</div>
                            <div className="col-span-6 font-medium">
                              {student.name}
                            </div>
                            <div className="col-span-2 flex justify-center">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() =>
                                    handleAttendanceChange(
                                      activeClass,
                                      student.id,
                                      true
                                    )
                                  }
                                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                                    student.present
                                      ? "bg-green-500 text-white ring-2 ring-green-300"
                                      : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                                  }`}
                                >
                                  <FaCheck />
                                </button>
                                <button
                                  onClick={() =>
                                    handleAttendanceChange(
                                      activeClass,
                                      student.id,
                                      false
                                    )
                                  }
                                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                                    !student.present
                                      ? "bg-red-500 text-white ring-2 ring-red-300"
                                      : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                                  }`}
                                >
                                  <FaTimes />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teacherClasses.map((classItem) => (
                      <div
                        key={classItem.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200 hover:border-violet-300 cursor-pointer transform hover:-translate-y-1 transition-transform"
                        onClick={() => handleClassClick(classItem.id)}
                      >
                        <div className="bg-gradient-to-r from-violet-600 to-violet-500 p-4">
                          <h3 className="text-white text-lg font-semibold">
                            {classItem.name}
                          </h3>
                          <p className="text-violet-100 text-sm mt-1">
                            Subject: {classItem.subject}
                          </p>
                        </div>
                        <div className="p-5">
                          <div className="flex items-center mb-4">
                            <FaChalkboardTeacher className="text-violet-600 mr-2" />
                            <span className="text-gray-700">
                              Take Attendance
                            </span>
                          </div>
                          <div className="flex items-center mb-4">
                            <FaUsers className="text-violet-600 mr-2" />
                            <span className="text-gray-700">
                              {classItem.students.length} students
                            </span>
                          </div>
                          <div className="bg-violet-50 p-3 rounded-lg mt-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs text-gray-500">
                                  Last Attendance
                                </p>
                                <p className="text-sm font-medium">
                                  90% Present
                                </p>
                              </div>
                              <div className="text-green-500 bg-green-100 p-2 rounded-full">
                                <FaCheckCircle />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gray-50 px-5 py-3 flex justify-end">
                          <button className="text-violet-600 hover:text-violet-800 text-sm font-medium flex items-center">
                            Take Attendance
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 ml-1"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeMenu !== "Attendance" && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-6xl text-gray-300 mb-4">
                    <FaChalkboardTeacher className="inline-block" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-600 mb-2">
                    {activeMenu} Module
                  </h3>
                  <p className="text-gray-500">
                    Click on Attendance in the sidebar to mark student
                    attendance
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClassWiseAttendance;
