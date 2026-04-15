import React, { useCallback, useEffect, useMemo, useState } from "react";
import Sidebar from "../Sidebar";
import Header from "../../../components/comman_components/Header";
import { toast } from "react-toastify";
import {
  GraduationCap,
  RefreshCw,
  Download,
  CheckCircle,
  AlertCircle,
  Trash2,
} from "lucide-react";
import {
  fetchAllClassesForAttendance,
  fetchTeacherDropdown,
  getAllTeachers,
  getAllSubjectsClass,
} from "../../../helper/requests-method/apiMethods";
import {
  WEEK_DAYS,
  upsertDayTimetableEntries,
  deleteTimetableEntry,
  checkTimetableConflict,
  getAdminClassTimetable,
} from "../../../helper/requests-method/timetableApi";

const asNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toPositiveInt = (value) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

const formatTime = (timeValue) => {
  if (!timeValue) return "--";
  const [hours, minutes] = String(timeValue).split(":");
  if (hours === undefined || minutes === undefined) return timeValue;
  const hourNumber = Number(hours);
  const suffix = hourNumber >= 12 ? "PM" : "AM";
  const normalizedHour = ((hourNumber + 11) % 12) + 1;
  return `${normalizedHour}:${minutes} ${suffix}`;
};

const formatTimeRange = (start, end) => {
  if (!start && !end) return "--";
  return `${formatTime(start)} - ${formatTime(end)}`;
};

const escapeCsvValue = (value) => {
  const normalized = value === null || value === undefined ? "" : String(value);
  if (/[",\n]/.test(normalized)) {
    return `"${normalized.replace(/"/g, '""')}"`;
  }
  return normalized;
};

const downloadCsvFile = (filename, headers, rows) => {
  const csvLines = [
    headers.map(escapeCsvValue).join(","),
    ...rows.map((row) => row.map(escapeCsvValue).join(",")),
  ];

  const blob = new Blob([csvLines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

const normalizeClassRows = (response) => {
  const source = response?.data?.classes || response?.classes || response?.data || [];
  if (!Array.isArray(source)) return [];
  return source.map((item) => ({
    id: item.id,
    class_name: item.class_name || "",
    section_name: item.section_name || "",
    display_name:
      item.display_name ||
      [item.class_name, item.section_name].filter(Boolean).join(" - ") ||
      `Class ${item.id}`,
  }));
};

const normalizeTeacherRows = (response) => {
  const source = response?.data || response || [];
  if (!Array.isArray(source)) return [];

  const normalizeAssignedSubjects = (assignedSubjects) => {
    if (!Array.isArray(assignedSubjects)) return [];
    return assignedSubjects
      .map((subject) => ({
        subject_id: subject?.subject_id,
        class_section_id: subject?.class_section_id,
        class_name: subject?.class_name || "",
        section_name: subject?.section_name || "",
      }))
      .filter((subject) => subject.subject_id);
  };

  return source
    .map((teacher) => {
      const teacherId =
        teacher?.teacherDetails?.id ||
        teacher?.teacher_id ||
        teacher?.id ||
        teacher?.user_id;

      return {
        id: teacherId,
        user_id: teacher?.user_id || teacher?.id || null,
        name: teacher?.name || teacher?.teacherDetails?.name || `Teacher ${teacherId}`,
        assigned_subjects: normalizeAssignedSubjects(teacher?.assigned_subjects),
      };
    })
    .filter((teacher) => teacher.id);
};

const normalizeSubjectRows = (response) => {
  const source =
    (Array.isArray(response?.subjects) && response.subjects) ||
    (Array.isArray(response?.data?.subjects) && response.data.subjects) ||
    (Array.isArray(response?.data) && response.data) ||
    [];

  return source
    .map((subject) => {
      const id = subject.id || subject.subject_id;
      return {
        id,
        name: subject.subject_name || subject.name || `Subject ${id}`,
        code: subject.subject_code || subject.code || "",
      };
    })
    .filter((subject) => subject.id);
};

const buildSlotsFromTimetable = (timetable = {}) => {
  const slotsMap = new Map();

  WEEK_DAYS.forEach((day) => {
    const entries = Array.isArray(timetable[day]) ? timetable[day] : [];
    entries.forEach((entry, index) => {
      const slotId = entry.slot_id || `slot-${index + 1}`;
      if (!slotsMap.has(slotId)) {
        slotsMap.set(slotId, {
          id: slotId,
          slot_number: entry.slot_number || index + 1,
          period_name: entry.period_name || `Period ${index + 1}`,
          start_time: entry.start_time || "",
          end_time: entry.end_time || "",
          is_break: Boolean(entry.is_break),
        });
      }
    });
  });

  return Array.from(slotsMap.values()).sort((a, b) => asNumber(a.slot_number, 999) - asNumber(b.slot_number, 999));
};

const findEntryBySlot = (dayEntries, slot, index) => {
  if (!Array.isArray(dayEntries)) return null;

  const bySlotId = dayEntries.find((entry) => String(entry.slot_id || "") === String(slot.id || ""));
  if (bySlotId) return bySlotId;

  return dayEntries[index] || null;
};

const buildDayDraft = (day, slots, timetable) => {
  const dayEntries = Array.isArray(timetable[day]) ? timetable[day] : [];
  const draft = {};

  slots.forEach((slot, index) => {
    const matched = findEntryBySlot(dayEntries, slot, index);
    draft[String(slot.id)] = {
      entry_id: matched?.id || null,
      slot_id: slot.id,
      subject_id: matched?.subject_id || matched?.subject?.id || "",
      teacher_id: matched?.teacher_id || matched?.teacher?.id || "",
      notes: matched?.notes ?? null,
      is_break: Boolean(slot.is_break || matched?.is_break),
    };
  });

  return draft;
};

const ClassTimeTablePage = () => {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);

  const [slots, setSlots] = useState([]);
  const [timetable, setTimetable] = useState(() =>
    WEEK_DAYS.reduce((acc, day) => {
      acc[day] = [];
      return acc;
    }, {})
  );

  const [activeDay, setActiveDay] = useState(WEEK_DAYS[0]);
  const [dayDraft, setDayDraft] = useState({});

  const [loadingClassList, setLoadingClassList] = useState(false);
  const [loadingPageData, setLoadingPageData] = useState(false);
  const [savingDayEntries, setSavingDayEntries] = useState(false);

  const [error, setError] = useState("");

  const loadStaticData = useCallback(async () => {
    try {
      const [teachersResponse, subjectsResponse] = await Promise.all([
        fetchTeacherDropdown()
          .catch(() => getAllTeachers())
          .catch(() => ({ data: [] })),
        getAllSubjectsClass().catch(() => ({ data: [] })),
      ]);

      setTeachers(normalizeTeacherRows(teachersResponse));
      setSubjects(normalizeSubjectRows(subjectsResponse));
    } catch {
      setTeachers([]);
      setSubjects([]);
    }
  }, []);

  const loadClasses = useCallback(async () => {
    try {
      setLoadingClassList(true);
      const response = await fetchAllClassesForAttendance();
      setClasses(normalizeClassRows(response));
    } catch (loadError) {
      setClasses([]);
      toast.error(loadError?.response?.data?.message || "Failed to fetch classes");
    } finally {
      setLoadingClassList(false);
    }
  }, []);

  const loadClassTimetableData = useCallback(async (classId) => {
    if (!classId) return;

    setLoadingPageData(true);
    setError("");

    try {
      const timetableResponse = await getAdminClassTimetable(classId);

      const normalizedPayload = timetableResponse?.data || {};

      const normalizedTimetable = WEEK_DAYS.reduce((acc, day) => {
        acc[day] = Array.isArray(normalizedPayload?.timetable?.[day])
          ? normalizedPayload.timetable[day]
          : [];
        return acc;
      }, {});

      const incomingSlots =
        normalizedPayload?.slots?.length
          ? normalizedPayload.slots
          : buildSlotsFromTimetable(normalizedTimetable);

      setTimetable(normalizedTimetable);
      setSlots(incomingSlots);

      setActiveDay((prev) => (WEEK_DAYS.includes(prev) ? prev : WEEK_DAYS[0]));
      setDayDraft(buildDayDraft(activeDay, incomingSlots, normalizedTimetable));
    } catch (loadError) {
      console.error("Failed to load timetable data", loadError);
      const message = loadError?.response?.data?.message || "Failed to load class timetable";
      setError(message);
      toast.error(message);
    } finally {
      setLoadingPageData(false);
    }
  }, [activeDay]);

  useEffect(() => {
    loadClasses();
    loadStaticData();
  }, [loadClasses, loadStaticData]);

  useEffect(() => {
    if (!selectedClass?.id) return;
    loadClassTimetableData(selectedClass.id);
  }, [selectedClass, loadClassTimetableData]);

  useEffect(() => {
    if (!slots.length) {
      setDayDraft({});
      return;
    }
    setDayDraft(buildDayDraft(activeDay, slots, timetable));
  }, [activeDay, slots, timetable]);

  const selectedClassId = selectedClass?.id;

  const subjectTeacherMap = useMemo(() => {
    const map = {};
    const classIdAsString = String(selectedClassId || "");

    teachers.forEach((teacher) => {
      const teacherId = String(teacher.id || "");
      if (!teacherId) return;

      const assignedSubjects = Array.isArray(teacher.assigned_subjects)
        ? teacher.assigned_subjects
        : [];

      assignedSubjects.forEach((assignedSubject) => {
        const subjectId = String(assignedSubject?.subject_id || "");
        const assignedClassId = String(assignedSubject?.class_section_id || "");
        if (!subjectId) return;

        if (classIdAsString && assignedClassId && assignedClassId !== classIdAsString) {
          return;
        }

        if (!map[subjectId]) {
          map[subjectId] = teacherId;
        }
      });
    });

    return map;
  }, [teachers, selectedClassId]);

  const previewSlots = useMemo(() => {
    if (slots.length) return slots;
    return buildSlotsFromTimetable(timetable);
  }, [slots, timetable]);

  const handleDayDraftChange = (slotId, field, value) => {
    setDayDraft((prev) => ({
      ...prev,
      [String(slotId)]: {
        ...prev[String(slotId)],
        [field]: value,
      },
    }));
  };

  const handleSubjectSelection = (slotId, subjectId) => {
    const normalizedSubjectId = String(subjectId || "");
    const suggestedTeacherId = normalizedSubjectId ? subjectTeacherMap[normalizedSubjectId] || "" : "";

    setDayDraft((prev) => ({
      ...prev,
      [String(slotId)]: {
        ...prev[String(slotId)],
        subject_id: normalizedSubjectId,
        teacher_id: suggestedTeacherId,
      },
    }));
  };

  const handleDeleteEntry = async (slotId) => {
    const draft = dayDraft[String(slotId)];
    if (!draft?.entry_id) {
      handleDayDraftChange(slotId, "subject_id", "");
      handleDayDraftChange(slotId, "teacher_id", "");
      return;
    }

    try {
      await deleteTimetableEntry(draft.entry_id);
      toast.success("Entry deleted");
      await loadClassTimetableData(selectedClassId);
    } catch (deleteError) {
      toast.error(deleteError?.response?.data?.message || "Failed to delete timetable entry");
    }
  };

  const validateDayDraft = () => {
    for (const slot of slots) {
      if (slot.is_break) continue;
      const current = dayDraft[String(slot.id)] || {};
      const hasSubject = Boolean(current.subject_id);
      const hasTeacher = Boolean(current.teacher_id);

      if (hasSubject !== hasTeacher) {
        return "Each assigned slot must include both subject and teacher";
      }

      if (hasSubject && hasTeacher) {
        const timeSlotId = toPositiveInt(slot.id);
        const subjectId = toPositiveInt(current.subject_id);
        const teacherId = toPositiveInt(current.teacher_id);

        if (!timeSlotId || !subjectId || !teacherId) {
          return "time_slot_id, subject_id, and teacher_id must be positive integers";
        }
      }
    }

    return null;
  };

  const checkConflictsBeforeSave = async () => {
    const classSectionId = toPositiveInt(selectedClassId);
    if (!classSectionId) {
      return "class_section_id must be a positive integer";
    }

    if (!WEEK_DAYS.includes(activeDay)) {
      return "day_of_week is invalid";
    }

    for (const slot of slots) {
      if (slot.is_break) continue;
      const current = dayDraft[String(slot.id)] || {};
      if (!current.subject_id || !current.teacher_id) continue;

      const timeSlotId = toPositiveInt(slot.id);
      const teacherId = toPositiveInt(current.teacher_id);

      if (!timeSlotId || !teacherId) {
        return "time_slot_id and teacher_id must be positive integers";
      }

      try {
        const payload = {
          class_section_id: classSectionId,
          day_of_week: activeDay,
          time_slot_id: timeSlotId,
          teacher_id: teacherId,
        };

        const entryId = toPositiveInt(current.entry_id);
        if (entryId) {
          payload.entry_id = entryId;
        }

        const response = await checkTimetableConflict({
          ...payload,
        });

        const data = response?.data || {};
        const hasConflict =
          Boolean(data.has_conflict) ||
          Boolean(data.conflict) ||
          Boolean(data.is_conflict) ||
          (Array.isArray(data.conflicts) && data.conflicts.length > 0);

        if (hasConflict) {
          return data.message || response?.message || "Teacher conflict detected";
        }
      } catch {
        // Conflict API can be non-blocking if backend does not support all keys.
      }
    }

    return null;
  };

  const handleSaveDayAssignments = async () => {
    if (!selectedClassId) return;

    const classSectionId = toPositiveInt(selectedClassId);
    if (!classSectionId) {
      toast.error("class_section_id must be a positive integer");
      return;
    }

    if (!WEEK_DAYS.includes(activeDay)) {
      toast.error("day_of_week is invalid");
      return;
    }

    const draftError = validateDayDraft();
    if (draftError) {
      toast.error(draftError);
      return;
    }

    const conflictMessage = await checkConflictsBeforeSave();
    if (conflictMessage) {
      toast.error(conflictMessage);
      return;
    }

    const entries = slots
      .filter((slot) => !slot.is_break)
      .map((slot) => {
        const current = dayDraft[String(slot.id)] || {};
        if (!current.subject_id || !current.teacher_id) return null;

        const timeSlotId = toPositiveInt(slot.id);
        const subjectId = toPositiveInt(current.subject_id);
        const teacherId = toPositiveInt(current.teacher_id);

        if (!timeSlotId || !subjectId || !teacherId) return null;

        const payloadEntry = {
          time_slot_id: timeSlotId,
          subject_id: subjectId,
          teacher_id: teacherId,
          notes: current.notes ?? null,
        };

        return payloadEntry;
      })
      .filter(Boolean);

    try {
      setSavingDayEntries(true);
      await upsertDayTimetableEntries({
        class_section_id: classSectionId,
        day_of_week: activeDay,
        entries,
      });
      toast.success(`Timetable saved for ${activeDay}`);
      await loadClassTimetableData(selectedClassId);
    } catch (saveError) {
      toast.error(saveError?.response?.data?.message || "Failed to save day timetable");
    } finally {
      setSavingDayEntries(false);
    }
  };

  const handleRefresh = () => {
    if (selectedClassId) {
      loadClassTimetableData(selectedClassId);
    }
  };

  const handleDownloadClassTimetable = () => {
    if (!selectedClass || previewSlots.length === 0) {
      toast.error("No timetable data available to download");
      return;
    }

    const headers = ["Day", "Slot", "Time", "Subject", "Teacher", "Status"];
    const rows = [];

    WEEK_DAYS.forEach((day) => {
      const dayEntries = timetable[day] || [];

      previewSlots.forEach((slot, index) => {
        const entry = findEntryBySlot(dayEntries, slot, index);
        const isBreak = Boolean(slot.is_break || entry?.is_break);
        const status = isBreak ? "Break" : entry ? "Assigned" : "Free";
        rows.push([
          day,
          slot.period_name || `Period ${index + 1}`,
          formatTimeRange(slot.start_time, slot.end_time),
          isBreak ? "Break" : entry?.subject_name || "",
          isBreak ? "" : entry?.teacher_name || "",
          status,
        ]);
      });
    });

    const classLabel = selectedClass.display_name || `class_${selectedClass.id}`;
    const safeClassLabel = String(classLabel)
      .trim()
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_-]/g, "");
    downloadCsvFile(`${safeClassLabel || "class"}_timetable.csv`, headers, rows);
    toast.success("Class timetable downloaded");
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
        <main className="w-full py-4 md:py-6 px-4 md:px-6">
          <div className="space-y-4 md:space-y-6">
            {!selectedClass ? (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-semibold text-slate-800 mb-4">Select a Class</h2>
                {loadingClassList ? (
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
              <>
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
                        <p className="text-sm text-slate-600">Dynamic Timetable Management</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={handleDownloadClassTimetable}
                        disabled={loadingPageData || previewSlots.length === 0}
                        className="px-4 py-2 text-sm bg-slate-700 hover:bg-slate-800 text-white rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                      <button
                        onClick={handleRefresh}
                        disabled={loadingPageData}
                        className="px-4 py-2 text-sm bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <RefreshCw className={`w-4 h-4 ${loadingPageData ? "animate-spin" : ""}`} />
                        Refresh
                      </button>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}

                {loadingPageData ? (
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                    <div className="text-center py-8 text-slate-500">Loading timetable data...</div>
                  </div>
                ) : (
                  <>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                        <h3 className="text-lg font-semibold text-slate-800">Day-wise Timetable Assignment</h3>
                        <button
                          type="button"
                          onClick={handleSaveDayAssignments}
                          disabled={savingDayEntries || slots.length === 0}
                          className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          {savingDayEntries ? "Saving..." : `Save ${activeDay}`}
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {WEEK_DAYS.map((day) => (
                          <button
                            key={day}
                            type="button"
                            onClick={() => setActiveDay(day)}
                            className={`px-3 py-1.5 rounded-lg text-sm border transition-colors cursor-pointer ${
                              activeDay === day
                                ? "bg-violet-100 border-violet-300 text-violet-700"
                                : "bg-white border-slate-300 text-slate-600 hover:border-violet-300"
                            }`}
                          >
                            {day}
                          </button>
                        ))}
                      </div>

                      {slots.length === 0 ? (
                        <p className="text-sm text-slate-500">No class periods found. Configure periods from Setting &gt; Class Period.</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse text-sm">
                            <thead>
                              <tr className="bg-slate-100 text-slate-700">
                                <th className="border border-slate-200 px-3 py-2 text-left">Slot</th>
                                <th className="border border-slate-200 px-3 py-2 text-left">Time</th>
                                <th className="border border-slate-200 px-3 py-2 text-left">Subject</th>
                                <th className="border border-slate-200 px-3 py-2 text-left">Teacher</th>
                                <th className="border border-slate-200 px-3 py-2 text-center">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {slots.map((slot) => {
                                const current = dayDraft[String(slot.id)] || {};

                                if (slot.is_break) {
                                  return (
                                    <tr key={slot.id} className="bg-amber-50">
                                      <td className="border border-slate-200 px-3 py-2">{slot.period_name}</td>
                                      <td className="border border-slate-200 px-3 py-2">{formatTimeRange(slot.start_time, slot.end_time)}</td>
                                      <td className="border border-slate-200 px-3 py-2 text-amber-700 font-medium" colSpan={3}>Break Slot</td>
                                    </tr>
                                  );
                                }

                                return (
                                  <tr key={slot.id}>
                                    <td className="border border-slate-200 px-3 py-2">{slot.period_name}</td>
                                    <td className="border border-slate-200 px-3 py-2">{formatTimeRange(slot.start_time, slot.end_time)}</td>
                                    <td className="border border-slate-200 px-3 py-2">
                                      <select
                                        value={current.subject_id || ""}
                                        onChange={(e) => handleSubjectSelection(slot.id, e.target.value)}
                                        className="w-full px-2 py-1 border border-slate-300 rounded"
                                      >
                                        <option value="">Select Subject</option>
                                        {subjects.map((subject) => (
                                          <option key={subject.id} value={subject.id}>
                                            {subject.name}{subject.code ? ` (${subject.code})` : ""}
                                          </option>
                                        ))}
                                      </select>
                                    </td>
                                    <td className="border border-slate-200 px-3 py-2">
                                      <select
                                        value={current.teacher_id || ""}
                                        onChange={(e) => handleDayDraftChange(slot.id, "teacher_id", e.target.value)}
                                        className="w-full px-2 py-1 border border-slate-300 rounded"
                                      >
                                        <option value="">Select Teacher</option>
                                        {teachers.map((teacher) => (
                                          <option key={teacher.id} value={teacher.id}>
                                            {teacher.name}
                                          </option>
                                        ))}
                                      </select>
                                    </td>
                                    <td className="border border-slate-200 px-3 py-2 text-center">
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteEntry(slot.id)}
                                        className="inline-flex items-center justify-center p-1.5 rounded-md text-red-600 hover:bg-red-50"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
                      <h3 className="text-lg font-semibold text-slate-800 mb-4">Weekly Timetable Preview</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-sm">
                          <thead>
                            <tr className="bg-violet-100 text-violet-800">
                              <th className="border border-slate-300 p-2 text-center sticky left-0 bg-violet-100 z-10">Day</th>
                              {previewSlots.map((slot, index) => (
                                <th key={`${slot.id}-${index}`} className="border border-slate-300 p-2 text-center min-w-40">
                                  <div className="font-semibold text-xs">{slot.period_name || `Period ${index + 1}`}</div>
                                  <div className="text-[11px] text-slate-600">{formatTimeRange(slot.start_time, slot.end_time)}</div>
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {WEEK_DAYS.map((day) => {
                              const dayEntries = timetable[day] || [];
                              return (
                                <tr key={day}>
                                  <td className="border border-slate-300 p-2 font-semibold text-center bg-slate-100 sticky left-0 z-10">{day}</td>
                                  {previewSlots.map((slot, index) => {
                                    const entry = findEntryBySlot(dayEntries, slot, index);
                                    if (slot.is_break || entry?.is_break) {
                                      return (
                                        <td key={`${day}-break-${slot.id}`} className="border border-slate-300 p-2 text-center text-amber-800 bg-amber-100 font-semibold">
                                          Break
                                        </td>
                                      );
                                    }

                                    return (
                                      <td key={`${day}-${slot.id}`} className="border border-slate-300 p-2 text-center">
                                        {entry ? (
                                          <>
                                            <div className="text-slate-900 font-medium text-xs">{entry.subject_name || "N/A"}</div>
                                            <div className="text-slate-600 text-[11px]">{entry.teacher_name || "N/A"}</div>
                                          </>
                                        ) : (
                                          <span className="text-slate-400 text-xs">--</span>
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
                  </>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClassTimeTablePage;
