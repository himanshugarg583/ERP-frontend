import {
  authorizedDelete,
  authorizedGet,
  authorizedPost,
  authorizedPut,
} from "./apiMethods";

const WEEK_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const toArray = (value) => (Array.isArray(value) ? value : []);
const toNumber = (value, fallback = null) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const asTime = (value = "") => {
  if (!value) return "";
  if (typeof value !== "string") return String(value);
  const parts = value.split(":");
  if (parts.length < 2) return value;
  const hh = parts[0].padStart(2, "0");
  const mm = parts[1].padStart(2, "0");
  const ss = (parts[2] || "00").padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
};

const sortByTimeAndOrder = (a, b) => {
  const aOrder = toNumber(a.slot_number ?? a.period_order ?? a.order ?? a.sequence, 9999);
  const bOrder = toNumber(b.slot_number ?? b.period_order ?? b.order ?? b.sequence, 9999);
  if (aOrder !== bOrder) return aOrder - bOrder;

  const aStart = asTime(a.start_time || a.slot_start_time || "23:59:59");
  const bStart = asTime(b.start_time || b.slot_start_time || "23:59:59");
  return aStart.localeCompare(bStart);
};

const normalizeSlot = (raw = {}, index = 0) => ({
  id: raw.id || raw.slot_id || raw.time_slot_id || `slot-${index + 1}`,
  slot_number: toNumber(raw.slot_number ?? raw.period_order ?? raw.order, index + 1) || index + 1,
  period_name: raw.period_name || raw.slot_label || raw.label || `Period ${index + 1}`,
  start_time: asTime(raw.start_time || raw.slot_start_time),
  end_time: asTime(raw.end_time || raw.slot_end_time),
  is_break: Boolean(raw.is_break),
});

const normalizePeriod = (raw = {}, index = 0) => {
  const subject = raw.subject || raw.subject_info || raw.Subject || {};
  const teacher = raw.teacher || raw.teacher_info || raw.Teacher || {};
  const classInfo = raw.class_info || raw.classSection || raw.class_section || raw.ClassSection || {};

  const classDisplay =
    classInfo.display ||
    classInfo.display_name ||
    [classInfo.class_name, classInfo.section_name].filter(Boolean).join(" - ");

  const subjectName =
    subject.subject_name || subject.name || raw.subject_name || raw.subjectName || (raw.is_break ? "Break" : "");

  const teacherName = teacher.name || raw.teacher_name || raw.teacherName || "";

  return {
    id: raw.id ?? raw.timetable_entry_id ?? raw.entry_id ?? raw.timetable_id ?? null,
    day: raw.day || "",
    slot_id: raw.slot_id || raw.time_slot_id || raw.slot?.id || null,
    slot_number: toNumber(raw.slot_number ?? raw.slot?.slot_number, index + 1) || index + 1,
    period_name:
      raw.period_name ||
      raw.slot_label ||
      raw.slot_name ||
      raw.slot?.slot_label ||
      raw.label ||
      `Period ${index + 1}`,
    start_time: asTime(raw.start_time || raw.slot_start_time || raw.slot?.start_time),
    end_time: asTime(raw.end_time || raw.slot_end_time || raw.slot?.end_time),
    is_break: Boolean(raw.is_break),
    subject_id: raw.subject_id || subject.id || null,
    teacher_id: raw.teacher_id || teacher.id || null,
    notes: raw.notes ?? null,
    subject_name: subjectName || "N/A",
    teacher_name: teacherName || "N/A",
    class_name: classInfo.class_name || raw.class_name || "",
    section_name: classInfo.section_name || raw.section_name || "",
    class_display: classDisplay || "",
    subject: {
      id: raw.subject_id || subject.id || null,
      subject_name: subjectName || "N/A",
      subject_code: subject.subject_code || raw.subject_code || "",
    },
    teacher: {
      id: raw.teacher_id || teacher.id || null,
      name: teacherName || "N/A",
    },
    class_info: {
      id: classInfo.id || classInfo.class_id || raw.class_id || raw.class_section_id || null,
      class_name: classInfo.class_name || raw.class_name || "",
      section_name: classInfo.section_name || raw.section_name || "",
      display: classDisplay || "",
      display_name: classDisplay || "",
    },
  };
};

const normalizeWeekTimetable = (rawTimetable) => {
  const base = WEEK_DAYS.reduce((acc, day) => {
    acc[day] = [];
    return acc;
  }, {});

  if (!rawTimetable) return base;

  // Shape 1: { Monday: [...], Tuesday: [...] }
  if (!Array.isArray(rawTimetable) && typeof rawTimetable === "object") {
    WEEK_DAYS.forEach((day) => {
      const entries = toArray(rawTimetable[day])
        .map((entry, index) => normalizePeriod({ ...entry, day }, index))
        .sort(sortByTimeAndOrder);
      base[day] = entries;
    });
    return base;
  }

  // Shape 2: [{ day, ... }, ...]
  if (Array.isArray(rawTimetable)) {
    rawTimetable.forEach((entry, index) => {
      const day = String(entry?.day || "").trim();
      if (!WEEK_DAYS.includes(day)) return;
      base[day].push(normalizePeriod(entry, index));
    });

    WEEK_DAYS.forEach((day) => {
      base[day] = base[day].sort(sortByTimeAndOrder);
    });
  }

  return base;
};

const normalizeClassInfo = (raw = {}, classIdFallback = null) => ({
  id: raw.id || raw.class_id || classIdFallback,
  class_id: raw.class_id || raw.id || classIdFallback,
  class_name: raw.class_name || raw.name || "",
  section_name: raw.section_name || raw.section || "",
  display_name:
    raw.display_name || raw.display || [raw.class_name || raw.name, raw.section_name || raw.section].filter(Boolean).join(" - "),
});

const normalizeTeacherInfo = (raw = {}) => ({
  id: raw.id || raw.teacher_id || null,
  teacher_id: raw.teacher_id || raw.id || null,
  name: raw.name || "",
  email: raw.email || "",
  qualification: raw.qualification || "",
  role: raw.role || "teacher",
});

const normalizeTimetablePayload = (payload = {}, options = {}) => {
  const classInfo = normalizeClassInfo(payload.class_info || payload.class || {}, options.classId);
  const teacherInfo = normalizeTeacherInfo(payload.teacher_info || payload.teacher || {});
  const timetable = normalizeWeekTimetable(payload.timetable || payload.entries || payload.rows || payload);

  const slotsFromPayload = toArray(payload.slots || payload.time_slots || payload.class_slots)
    .map(normalizeSlot);

  const slotsFromTimetable = WEEK_DAYS.flatMap((day) =>
    toArray(timetable[day]).map((entry, index) =>
      normalizeSlot(
        {
          id: entry.slot_id,
          slot_id: entry.slot_id,
          slot_number: entry.slot_number,
          period_name: entry.period_name,
          start_time: entry.start_time,
          end_time: entry.end_time,
          is_break: entry.is_break,
        },
        index
      )
    )
  );

  const slotMap = new Map();
  [...slotsFromPayload, ...slotsFromTimetable].forEach((slot) => {
    if (!slot?.id) return;
    if (!slotMap.has(String(slot.id))) {
      slotMap.set(String(slot.id), slot);
    }
  });

  const slots = Array.from(slotMap.values()).sort(sortByTimeAndOrder);

  const configuration = payload.configuration || payload.class_configuration || payload.config || {};

  return {
    class_info: classInfo,
    teacher_info: teacherInfo,
    timetable,
    slots,
    config: configuration,
    configuration,
  };
};

const normalizeClassSectionOption = (raw = {}) => ({
  id: toNumber(raw.id ?? raw.class_section_id ?? raw.class_id),
  class_name: raw.class_name || raw.name || "",
  section_name: raw.section_name || raw.section || "",
  display_name:
    raw.display_name ||
    raw.display ||
    [raw.class_name || raw.name, raw.section_name || raw.section].filter(Boolean).join(" - "),
});

const parseWorkingDays = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((day) => String(day || "").trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];

    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed
          .map((day) => String(day || "").trim())
          .filter(Boolean);
      }
    } catch {
      // Fallback for non-JSON CSV-like strings.
    }

    return trimmed
      .replace(/^\[/, "")
      .replace(/\]$/, "")
      .split(",")
      .map((day) => day.replace(/^\s*"|"\s*$/g, "").trim())
      .filter(Boolean);
  }

  return [];
};

const normalizeScheduleTableRow = (raw = {}, index = 0) => {
  const classSectionId = toNumber(raw.class_section_id ?? raw.class_id ?? raw.id, index + 1);

  return {
    class_section_id: classSectionId,
    class_name: raw.class_name || "",
    section_name: raw.section_name || "",
    school_start_time: asTime(raw.school_start_time || raw.start_time),
    school_end_time: asTime(raw.school_end_time || raw.end_time),
    total_number_of_periods: toNumber(raw.total_number_of_periods, 0),
    is_break: Boolean(raw.is_break),
    break_duration_minutes: toNumber(raw.break_duration_minutes, 0),
    break_after_period: toNumber(raw.break_after_period, 0),
    period_duration_minutes: toNumber(raw.period_duration_minutes, 0),
    working_days: parseWorkingDays(raw.working_days),
    total_slots: toNumber(raw.total_slots, 0),
  };
};

const success = (response, extra = {}) => ({
  success: response?.success ?? true,
  message: response?.message || "Success",
  ...response,
  ...extra,
});

const safePrimaryWithFallback = async (primaryCall, fallbackCall) => {
  try {
    return await primaryCall();
  } catch (error) {
    if (typeof fallbackCall !== "function") throw error;
    return fallbackCall();
  }
};

// Admin endpoints
export const upsertClassTimingConfiguration = async (classId, payload) => {
  return authorizedPut(`/admin/timetable/classes/${classId}/configuration`, payload);
};

export const getClassTimingConfiguration = async (classId) => {
  const response = await authorizedGet(`/admin/timetable/classes/${classId}/configuration`);
  const configuration = response?.data?.configuration || response?.data || {};
  return success(response, {
    data: {
      configuration,
    },
    configuration,
  });
};

export const generateClassSlots = async (classId, payload = {}) => {
  const response = await authorizedPost(`/admin/timetable/classes/${classId}/slots/generate`, payload);
  const slots = toArray(response?.data?.slots || response?.data).map(normalizeSlot).sort(sortByTimeAndOrder);
  return success(response, { data: { slots }, slots });
};

export const getClassSlots = async (classId) => {
  const response = await authorizedGet(`/admin/timetable/classes/${classId}/slots`);
  const slots = toArray(response?.data?.slots || response?.data).map(normalizeSlot).sort(sortByTimeAndOrder);
  return success(response, { data: { slots }, slots });
};

export const updateClassSlot = async (classId, slotId, payload) => {
  return authorizedPut(`/admin/timetable/classes/${classId}/slots/${slotId}`, payload);
};

export const createTimetableEntry = async (payload) => {
  return authorizedPost(`/admin/timetable/entries`, payload);
};

export const upsertDayTimetableEntries = async (payload) => {
  return authorizedPost(`/admin/timetable/entries/day-upsert`, payload);
};

export const updateTimetableEntry = async (id, payload) => {
  return authorizedPut(`/admin/timetable/entries/${id}`, payload);
};

export const deleteTimetableEntry = async (id) => {
  return authorizedDelete(`/admin/timetable/entries/${id}`);
};

export const checkTimetableConflict = async (payload) => {
  return authorizedPost(`/admin/timetable/conflicts/check`, payload);
};

export const getAdminClassTimetable = async (classId) => {
  const response = await authorizedGet(`/admin/timetable/classes/timetable/${classId}`);
  const normalized = normalizeTimetablePayload(response?.data || {}, { classId });
  return success(response, { data: normalized });
};

export const getAdminTeacherTimetable = async (teacherId) => {
  const response = await authorizedGet(`/admin/timetable/teachers/timetable/${teacherId}`);
  const normalized = normalizeTimetablePayload(response?.data || {});
  return success(response, { data: normalized });
};

export const getSchoolTimeClassDropdown = async () => {
  const response = await authorizedGet(`/admin/dropdown/getClassDropdown`);
  const options = toArray(response?.data || response)
    .map(normalizeClassSectionOption)
    .filter((option) => option.id);

  return success(response, {
    data: {
      options,
    },
    options,
  });
};

export const scheduleSchoolTimesBulk = async (payload) => {
  return authorizedPost(`/admin/timetable/classes/schedule/bulk`, payload);
};

export const getSchoolTimesTableData = async () => {
  const response = await authorizedGet(`/admin/timetable/classes/schedule/table-data`);
  const rowsSource = response?.data?.rows || response?.rows || response?.data || response;
  const rows = toArray(rowsSource).map(normalizeScheduleTableRow);
  const totalRows = toNumber(response?.data?.total_rows, rows.length);

  return success(response, {
    data: {
      total_rows: totalRows,
      rows,
    },
    total_rows: totalRows,
    rows,
  });
};

export const updateSchoolTimeScheduleByClassId = async (classSectionId, payload) => {
  return authorizedPut(`/admin/timetable/classes/schedule/${classSectionId}`, payload);
};

// Teacher endpoints
export const getTeacherMyTimetable = async () => {
  const response = await safePrimaryWithFallback(
    () => authorizedGet(`/teacherTimetable/me`),
    () => authorizedGet(`/teacherTimetable/getTeacherTimetable`)
  );
  const normalized = normalizeTimetablePayload(response?.data || {});
  return success(response, { data: normalized });
};

export const getTeacherClassTimetable = async (classSectionId) => {
  const response = await safePrimaryWithFallback(
    () => authorizedGet(`/teacherTimetable/classes/${classSectionId}`),
    () => authorizedGet(`/teacherTimetable/getClassTimetable/${classSectionId}`)
  );
  const normalized = normalizeTimetablePayload(response?.data || {}, { classId: classSectionId });
  return success(response, { data: normalized });
};

// Student endpoints
export const getStudentMyTimetable = async () => {
  const response = await safePrimaryWithFallback(
    () => authorizedGet(`/studentattendance/me/timetable`),
    () => authorizedGet(`/studentattendance/getTimetable`)
  );
  const normalized = normalizeTimetablePayload(response?.data || {});
  return success(response, { data: normalized });
};

// Backward-compatible aliases for frontend pages
export const getTimeTableByClassSection = getAdminClassTimetable;
export const getTeacherTimeTable = getAdminTeacherTimetable;
export const getTeacherTimetable = getTeacherMyTimetable;
export const getClassTimetable = getTeacherClassTimetable;
export const getStudentTimetable = getStudentMyTimetable;

export { WEEK_DAYS };
