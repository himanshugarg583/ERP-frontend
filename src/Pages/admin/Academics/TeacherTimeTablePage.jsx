import React, { useCallback, useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import Header from "../../../components/comman_components/Header";
import TeacherTimeTable from "../../../components/academics/TeacherTimeTable";
import { toast } from "react-toastify";
import {
  fetchTeacherDropdown,
  getTeacherTimeTable,
} from "../../../helper/requests-method/apiMethods";

const WEEK_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const TeacherTimeTablePage = () => {
  const [teacherOptions, setTeacherOptions] = useState([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [teacherInfo, setTeacherInfo] = useState(null);
  const [timetable, setTimetable] = useState(() => ({}));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const normalizeTimetable = useCallback((rawTimetable = {}) => {
    return WEEK_DAYS.reduce((acc, day) => {
      const entries = Array.isArray(rawTimetable[day]) ? rawTimetable[day] : [];
      acc[day] = entries.map((entry, index) => {
        const isBreak = Boolean(entry?.is_break);
        const classInfo = entry?.class_info || {};
        const subjectInfo = entry?.subject_info || {};
        const classLabel =
          classInfo.display ||
          [classInfo.class_name, classInfo.section_name].filter(Boolean).join(" ");
        return {
          id: entry?.id ?? `${day}-${index}`,
          period_name: entry?.period_name || `Period ${index + 1}`,
          start_time: entry?.start_time || "",
          end_time: entry?.end_time || "",
          is_break: isBreak,
          class_name: classInfo.class_name || "",
          section_name: classInfo.section_name || "",
          class_display: classLabel.trim(),
          subject_name: subjectInfo.subject_name || (isBreak ? "Break" : "N/A"),
          subject_code: subjectInfo.subject_code || "",
        };
      });
      return acc;
    }, {});
  }, []);

  const fetchTimetable = useCallback(
    async (teacherId, { silentError = false } = {}) => {
      if (!teacherId) return;
      setLoading(true);
      setError("");
      try {
        const numericId = Number(teacherId);
        const response = await getTeacherTimeTable(
          Number.isNaN(numericId) ? teacherId : numericId
        );
        if (!response?.success && !silentError) {
          toast.error(response?.message || "Failed to load teacher timetable");
        }
        const payload = response?.data || {};
        setTeacherInfo(payload.teacher_info || null);
        setTimetable(normalizeTimetable(payload.timetable || {}));
      } catch (err) {
        console.error("Error fetching teacher timetable:", err);
        const message =
          err?.response?.data?.message || "Failed to load teacher timetable";
        setError(message);
        setTeacherInfo(null);
        setTimetable(normalizeTimetable({}));
        if (!silentError) {
          toast.error(message);
        }
      } finally {
        setLoading(false);
      }
    },
    [normalizeTimetable]
  );

  useEffect(() => {
    const loadTeachers = async () => {
      try {
        const response = await fetchTeacherDropdown();
        if (!response?.success || !Array.isArray(response?.data)) {
          throw new Error(response?.message || "Failed to load teachers");
        }
        const records = response.data;
        const formatted = records
          .filter((teacher) => teacher?.teacherDetails?.id)
          .map((teacher) => ({
            value: teacher.teacherDetails.id.toString(),
            label: teacher.name || teacher.teacherDetails.name || `Teacher ${teacher.teacherDetails.id}`,
          }));
        setTeacherOptions(formatted);
        if (formatted.length) {
          const firstTeacher = formatted[0].value;
          setSelectedTeacherId(firstTeacher);
          await fetchTimetable(firstTeacher, { silentError: true });
        }
      } catch (err) {
        console.error("Error fetching teacher options:", err);
        toast.error(err?.response?.data?.message || "Failed to load teachers");
        setTeacherOptions([]);
      }
    };

    loadTeachers();
  }, [fetchTimetable]);

  const handleTeacherChange = async (value) => {
    setSelectedTeacherId(value);
    if (value) {
      await fetchTimetable(value);
    } else {
      setTeacherInfo(null);
      setTimetable(normalizeTimetable({}));
    }
  };

  const handleRefresh = () => {
    if (selectedTeacherId) {
      fetchTimetable(selectedTeacherId, { silentError: true });
    }
  };

  return (
    <div className="bg-slate-200 flex AddStudent">
      <Sidebar />

      <div
        className="overflow-auto relative z-1 flex-col"
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
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <TeacherTimeTable
              teacherOptions={teacherOptions}
              selectedTeacherId={selectedTeacherId}
              onTeacherChange={handleTeacherChange}
              timetable={timetable}
              teacherInfo={teacherInfo}
              loading={loading}
              error={error}
              onRefresh={handleRefresh}
            />
          </div>
        </main>
      </div>
    </div>
  );
};
export default TeacherTimeTablePage;
