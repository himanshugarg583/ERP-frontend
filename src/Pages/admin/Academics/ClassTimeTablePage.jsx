import React, { useCallback, useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import Header from "../../../components/comman_components/Header";
import ClassTimetable from "../../../components/academics/ClassTimeTable";
import { toast } from "react-toastify";
import {
  fetchClassDropdown,
  getTimeTableByClassSection,
} from "../../../helper/requests-method/apiMethods";

const WEEK_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const ClassTimeTablePage = () => {
  const [classOptions, setClassOptions] = useState([]);
  const [selectedClassSectionId, setSelectedClassSectionId] = useState("");
  const [classInfo, setClassInfo] = useState(null);
  const [timetable, setTimetable] = useState(() => ({}));
  const [loading, setLoading] = useState(false);
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

  const fetchTimetable = useCallback(
    async (classSectionId, { silentError = false } = {}) => {
      if (!classSectionId) return;
      setLoading(true);
      setError("");
      try {
        const numericId = Number(classSectionId);
        const response = await getTimeTableByClassSection(
          Number.isNaN(numericId) ? classSectionId : numericId
        );
        if (!response?.success && !silentError) {
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
    const loadClasses = async () => {
      try {
        const response = await fetchClassDropdown();
        if (!response?.success || !Array.isArray(response?.data)) {
          throw new Error(response?.message || "Failed to load classes");
        }
        const records = response.data;
        const formatted = records
          .filter((cls) => cls?.id)
          .map((cls) => ({
            value: cls.id.toString(),
            label:
              [cls.class_name, cls.section_name].filter(Boolean).join(" - ") ||
              `Class ${cls.id}`,
          }));
        setClassOptions(formatted);
        if (formatted.length) {
          const firstClass = formatted[0].value;
          setSelectedClassSectionId(firstClass);
          await fetchTimetable(firstClass, { silentError: true });
        }
      } catch (err) {
        console.error("Error fetching class options:", err);
        toast.error(err?.response?.data?.message || "Failed to load classes");
        setClassOptions([]);
      }
    };

    loadClasses();
  }, [fetchTimetable]);

  const handleClassChange = async (value) => {
    setSelectedClassSectionId(value);
    if (value) {
      await fetchTimetable(value);
    } else {
      setClassInfo(null);
      setTimetable(normalizeTimetable({}));
    }
  };

    const handleRefresh = () => {
      if (selectedClassSectionId) {
        fetchTimetable(selectedClassSectionId, { silentError: true });
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
            <ClassTimetable
              classOptions={classOptions}
              selectedClassSectionId={selectedClassSectionId}
              onClassChange={handleClassChange}
              timetable={timetable}
              classInfo={classInfo}
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
export default ClassTimeTablePage;
