import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Clock3, Edit2, RefreshCw, Save, Settings2 } from "lucide-react";
import { toast } from "react-toastify";
import Sidebar from "../Sidebar";
import Header from "../../../components/comman_components/Header";
import Footer from "../../../components/comman_components/Footer";
import PageHeader from "../../../components/comman_components/PageHeader";
import Modal from "../../../components/comman_components/Modal";
import {
  WEEK_DAYS,
  getSchoolTimeClassDropdown,
  getSchoolTimesTableData,
  scheduleSchoolTimesBulk,
  updateSchoolTimeScheduleByClassId,
} from "../../../helper/requests-method/timetableApi";

const INITIAL_FORM = {
  class_section_ids: [],
  start_time: "08:00",
  end_time: "14:00",
  total_number_of_periods: 8,
  is_break: true,
  break_duration_minutes: 20,
  break_after_period: 4,
  working_days: [...WEEK_DAYS],
  force_regenerate: true,
};

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toTimeInput = (value = "") => {
  if (!value) return "";
  const parts = String(value).split(":");
  if (parts.length < 2) return "";
  return `${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}`;
};

const parseWorkingDays = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((entry) => String(entry || "").trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];

    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed
          .map((entry) => String(entry || "").trim())
          .filter(Boolean);
      }
    } catch {
      // Fallback for non-JSON day strings.
    }

    return trimmed
      .replace(/^\[/, "")
      .replace(/\]$/, "")
      .split(",")
      .map((entry) => entry.replace(/^\s*"|"\s*$/g, "").trim())
      .filter(Boolean);
  }

  return [];
};

const normalizeRows = (response) => {
  const source = response?.data?.rows || response?.rows || response?.data || [];
  if (!Array.isArray(source)) return [];

  return source.map((row) => ({
    class_section_id: toNumber(row.class_section_id),
    class_name: row.class_name || "",
    section_name: row.section_name || "",
    school_start_time: row.school_start_time || row.start_time || "",
    school_end_time: row.school_end_time || row.end_time || "",
    total_number_of_periods: toNumber(row.total_number_of_periods),
    is_break: Boolean(row.is_break),
    break_duration_minutes: toNumber(row.break_duration_minutes),
    break_after_period: toNumber(row.break_after_period),
    period_duration_minutes: toNumber(row.period_duration_minutes),
    working_days: parseWorkingDays(row.working_days),
    total_slots: toNumber(row.total_slots),
  }));
};

const normalizeClassOptions = (response) => {
  const source = response?.data?.options || response?.options || response?.data || [];
  if (!Array.isArray(source)) return [];

  return source
    .map((item) => {
      const id = toNumber(item.id || item.class_section_id);
      return {
        id,
        class_name: item.class_name || "",
        section_name: item.section_name || "",
        display_name:
          item.display_name ||
          [item.class_name, item.section_name].filter(Boolean).join(" - ") ||
          `Class ${id}`,
      };
    })
    .filter((item) => item.id);
};

const validateScheduleForm = (form, { requireClassIds = true } = {}) => {
  if (requireClassIds && (!Array.isArray(form.class_section_ids) || form.class_section_ids.length === 0)) {
    return "Please select at least one class section";
  }

  if (!form.start_time || !form.end_time) {
    return "Start time and end time are required";
  }

  if (form.start_time >= form.end_time) {
    return "End time must be greater than start time";
  }

  if (toNumber(form.total_number_of_periods) <= 0) {
    return "Total periods must be greater than zero";
  }

  if (form.is_break) {
    if (toNumber(form.break_duration_minutes) <= 0) {
      return "Break duration must be greater than zero when break is enabled";
    }

    if (toNumber(form.break_after_period) <= 0) {
      return "Break after period must be greater than zero when break is enabled";
    }
  }

  if (!Array.isArray(form.working_days) || form.working_days.length === 0) {
    return "Please select at least one working day";
  }

  return null;
};

const SchoolTimesPage = () => {
  const [classOptions, setClassOptions] = useState([]);
  const [tableRows, setTableRows] = useState([]);
  const [scheduleForm, setScheduleForm] = useState(INITIAL_FORM);

  const [loadingClassOptions, setLoadingClassOptions] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [updating, setUpdating] = useState(false);

  const selectedClassCount = scheduleForm.class_section_ids.length;

  const classMap = useMemo(() => {
    return classOptions.reduce((acc, item) => {
      acc[item.id] = item.display_name;
      return acc;
    }, {});
  }, [classOptions]);

  const fetchClassOptions = useCallback(async () => {
    try {
      setLoadingClassOptions(true);
      const response = await getSchoolTimeClassDropdown();
      setClassOptions(normalizeClassOptions(response));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch classes");
      setClassOptions([]);
    } finally {
      setLoadingClassOptions(false);
    }
  }, []);

  const fetchTableRows = useCallback(async () => {
    try {
      setLoadingTable(true);
      const response = await getSchoolTimesTableData();
      setTableRows(normalizeRows(response));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch school times table data");
      setTableRows([]);
    } finally {
      setLoadingTable(false);
    }
  }, []);

  useEffect(() => {
    fetchClassOptions();
    fetchTableRows();
  }, [fetchClassOptions, fetchTableRows]);

  const toggleClassSelection = (classSectionId) => {
    setScheduleForm((prev) => {
      const exists = prev.class_section_ids.includes(classSectionId);
      return {
        ...prev,
        class_section_ids: exists
          ? prev.class_section_ids.filter((id) => id !== classSectionId)
          : [...prev.class_section_ids, classSectionId],
      };
    });
  };

  const toggleWorkingDay = (day, mode = "create") => {
    const targetStateSetter = mode === "edit" ? setEditForm : setScheduleForm;

    targetStateSetter((prev) => {
      if (!prev) return prev;
      const exists = prev.working_days.includes(day);
      return {
        ...prev,
        working_days: exists
          ? prev.working_days.filter((entry) => entry !== day)
          : [...prev.working_days, day],
      };
    });
  };

  const handleCreateFieldChange = (field, value, type = "text") => {
    setScheduleForm((prev) => ({
      ...prev,
      [field]: type === "checkbox" ? Boolean(value) : value,
    }));
  };

  const handleEditFieldChange = (field, value, type = "text") => {
    setEditForm((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [field]: type === "checkbox" ? Boolean(value) : value,
      };
    });
  };

  const handleScheduleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateScheduleForm(scheduleForm, { requireClassIds: true });
    if (validationError) {
      toast.error(validationError);
      return;
    }

    const payload = {
      class_section_ids: scheduleForm.class_section_ids,
      start_time: scheduleForm.start_time,
      end_time: scheduleForm.end_time,
      total_number_of_periods: toNumber(scheduleForm.total_number_of_periods),
      is_break: Boolean(scheduleForm.is_break),
      break_duration_minutes: toNumber(scheduleForm.break_duration_minutes),
      break_after_period: toNumber(scheduleForm.break_after_period),
      working_days: scheduleForm.working_days,
      force_regenerate: Boolean(scheduleForm.force_regenerate),
    };

    try {
      setSubmitting(true);
      const response = await scheduleSchoolTimesBulk(payload);
      toast.success(response?.message || "School times scheduled successfully");
      await fetchTableRows();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to schedule school times");
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (row) => {
    setEditForm({
      class_section_id: row.class_section_id,
      start_time: toTimeInput(row.school_start_time),
      end_time: toTimeInput(row.school_end_time),
      total_number_of_periods: row.total_number_of_periods,
      is_break: Boolean(row.is_break),
      break_duration_minutes: row.break_duration_minutes,
      break_after_period: row.break_after_period,
      working_days: Array.isArray(row.working_days) && row.working_days.length ? row.working_days : [...WEEK_DAYS],
      force_regenerate: true,
    });
    setIsEditOpen(true);
  };

  const handleUpdateSchedule = async (event) => {
    event.preventDefault();

    if (!editForm) return;

    const validationError = validateScheduleForm(editForm, { requireClassIds: false });
    if (validationError) {
      toast.error(validationError);
      return;
    }

    const payload = {
      start_time: editForm.start_time,
      end_time: editForm.end_time,
      total_number_of_periods: toNumber(editForm.total_number_of_periods),
      is_break: Boolean(editForm.is_break),
      break_duration_minutes: toNumber(editForm.break_duration_minutes),
      break_after_period: toNumber(editForm.break_after_period),
      working_days: editForm.working_days,
      force_regenerate: Boolean(editForm.force_regenerate),
    };

    try {
      setUpdating(true);
      const response = await updateSchoolTimeScheduleByClassId(editForm.class_section_id, payload);
      toast.success(response?.message || "School time updated successfully");
      setIsEditOpen(false);
      setEditForm(null);
      await fetchTableRows();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update school time");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="bg-gray-100 flex">
      <Sidebar />

      <div
        className="overflow-auto relative z-1 flex flex-col"
        style={{
          height: "100vh",
          width: "100vw",
          transition: "margin-left 0.3s ease",
        }}
      >
        <Header />

        <main className="flex-1 overflow-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <PageHeader pageheading="Setting" Subheading="School Times" />

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <Settings2 className="w-5 h-5 text-violet-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Schedule School Times For Multiple Classes</h3>
                </div>
                <button
                  onClick={fetchTableRows}
                  disabled={loadingTable}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingTable ? "animate-spin" : ""}`} />
                  Refresh Table
                </button>
              </div>

              <form onSubmit={handleScheduleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Classes <span className="text-red-500">*</span>
                  </label>
                  {loadingClassOptions ? (
                    <div className="text-sm text-gray-500 py-2">Loading classes...</div>
                  ) : classOptions.length === 0 ? (
                    <div className="text-sm text-gray-500 py-2">No class sections found</div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {classOptions.map((item) => {
                        const isSelected = scheduleForm.class_section_ids.includes(item.id);
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => toggleClassSelection(item.id)}
                            className={`px-3 py-2 rounded-lg border text-sm text-left cursor-pointer transition-colors ${
                              isSelected
                                ? "bg-violet-50 border-violet-400 text-violet-800"
                                : "bg-white border-gray-300 hover:border-violet-300"
                            }`}
                          >
                            <div className="font-medium">{item.display_name}</div>
                            <div className="text-xs text-gray-500">Class ID: {item.id}</div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                  <p className="mt-2 text-xs text-gray-500">Selected classes: {selectedClassCount}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">School Start Time</label>
                    <input
                      type="time"
                      value={scheduleForm.start_time}
                      onChange={(e) => handleCreateFieldChange("start_time", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">School End Time</label>
                    <input
                      type="time"
                      value={scheduleForm.end_time}
                      onChange={(e) => handleCreateFieldChange("end_time", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Number Of Periods</label>
                    <input
                      type="number"
                      min="1"
                      value={scheduleForm.total_number_of_periods}
                      onChange={(e) => handleCreateFieldChange("total_number_of_periods", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Break Duration (Minutes)</label>
                    <input
                      type="number"
                      min="0"
                      value={scheduleForm.break_duration_minutes}
                      onChange={(e) => handleCreateFieldChange("break_duration_minutes", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Break After Period</label>
                    <input
                      type="number"
                      min="0"
                      value={scheduleForm.break_after_period}
                      onChange={(e) => handleCreateFieldChange("break_after_period", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                  <div className="space-y-2 pt-1">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <input
                        type="checkbox"
                        checked={scheduleForm.is_break}
                        onChange={(e) => handleCreateFieldChange("is_break", e.target.checked, "checkbox")}
                        className="w-4 h-4"
                      />
                      Enable Break
                    </label>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <input
                        type="checkbox"
                        checked={scheduleForm.force_regenerate}
                        onChange={(e) => handleCreateFieldChange("force_regenerate", e.target.checked, "checkbox")}
                        className="w-4 h-4"
                      />
                      Force Regenerate Slots
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Working Days</label>
                  <div className="flex flex-wrap gap-2">
                    {WEEK_DAYS.map((day) => {
                      const selected = scheduleForm.working_days.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleWorkingDay(day, "create")}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                            selected
                              ? "bg-violet-100 text-violet-700 border-violet-300"
                              : "bg-white text-gray-600 border-gray-300 hover:border-violet-300"
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  {submitting ? "Scheduling..." : "Schedule School Times"}
                </button>
              </form>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
                <Clock3 className="w-5 h-5 text-violet-600" />
                <h3 className="text-lg font-semibold text-gray-900">School Times Details</h3>
              </div>

              <div className="overflow-x-auto">
                {loadingTable ? (
                  <div className="py-10 text-center text-gray-500">Loading table data...</div>
                ) : tableRows.length === 0 ? (
                  <div className="py-10 text-center text-gray-500">No school time records found</div>
                ) : (
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left border-b">Class ID</th>
                        <th className="px-4 py-3 text-left border-b">Class</th>
                        <th className="px-4 py-3 text-left border-b">Section</th>
                        <th className="px-4 py-3 text-left border-b">Start</th>
                        <th className="px-4 py-3 text-left border-b">End</th>
                        <th className="px-4 py-3 text-left border-b">Periods</th>
                        <th className="px-4 py-3 text-left border-b">Break</th>
                        <th className="px-4 py-3 text-left border-b">Break Duration</th>
                        <th className="px-4 py-3 text-left border-b">Break After</th>
                        <th className="px-4 py-3 text-left border-b">Period Duration</th>
                        <th className="px-4 py-3 text-left border-b">Working Days</th>
                        <th className="px-4 py-3 text-left border-b">Total Slots</th>
                        <th className="px-4 py-3 text-center border-b">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableRows.map((row) => (
                        <tr key={row.class_section_id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 border-b">{row.class_section_id}</td>
                          <td className="px-4 py-3 border-b">{row.class_name || "-"}</td>
                          <td className="px-4 py-3 border-b">{row.section_name || "-"}</td>
                          <td className="px-4 py-3 border-b">{toTimeInput(row.school_start_time) || "-"}</td>
                          <td className="px-4 py-3 border-b">{toTimeInput(row.school_end_time) || "-"}</td>
                          <td className="px-4 py-3 border-b">{row.total_number_of_periods}</td>
                          <td className="px-4 py-3 border-b">{row.is_break ? "Yes" : "No"}</td>
                          <td className="px-4 py-3 border-b">{row.break_duration_minutes}</td>
                          <td className="px-4 py-3 border-b">{row.break_after_period}</td>
                          <td className="px-4 py-3 border-b">{row.period_duration_minutes}</td>
                          <td className="px-4 py-3 border-b">{row.working_days.join(", ") || "-"}</td>
                          <td className="px-4 py-3 border-b">{row.total_slots}</td>
                          <td className="px-4 py-3 border-b text-center">
                            <button
                              type="button"
                              onClick={() => openEditModal(row)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-indigo-600 text-white rounded-md hover:bg-indigo-700 cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>

      <Modal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setEditForm(null);
        }}
        title="Update School Time"
        subtitle={editForm ? classMap[editForm.class_section_id] || `Class ID ${editForm.class_section_id}` : ""}
        size="lg"
      >
        {editForm && (
          <form onSubmit={handleUpdateSchedule} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">School Start Time</label>
                <input
                  type="time"
                  value={editForm.start_time}
                  onChange={(e) => handleEditFieldChange("start_time", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">School End Time</label>
                <input
                  type="time"
                  value={editForm.end_time}
                  onChange={(e) => handleEditFieldChange("end_time", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Number Of Periods</label>
                <input
                  type="number"
                  min="1"
                  value={editForm.total_number_of_periods}
                  onChange={(e) => handleEditFieldChange("total_number_of_periods", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Break Duration (Minutes)</label>
                <input
                  type="number"
                  min="0"
                  value={editForm.break_duration_minutes}
                  onChange={(e) => handleEditFieldChange("break_duration_minutes", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Break After Period</label>
                <input
                  type="number"
                  min="0"
                  value={editForm.break_after_period}
                  onChange={(e) => handleEditFieldChange("break_after_period", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div className="space-y-2 pt-1">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={editForm.is_break}
                    onChange={(e) => handleEditFieldChange("is_break", e.target.checked, "checkbox")}
                    className="w-4 h-4"
                  />
                  Enable Break
                </label>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={editForm.force_regenerate}
                    onChange={(e) => handleEditFieldChange("force_regenerate", e.target.checked, "checkbox")}
                    className="w-4 h-4"
                  />
                  Force Regenerate Slots
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Working Days</label>
              <div className="flex flex-wrap gap-2">
                {WEEK_DAYS.map((day) => {
                  const selected = editForm.working_days.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleWorkingDay(day, "edit")}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                        selected
                          ? "bg-violet-100 text-violet-700 border-violet-300"
                          : "bg-white text-gray-600 border-gray-300 hover:border-violet-300"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsEditOpen(false);
                  setEditForm(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updating}
                className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {updating ? "Updating..." : "Update Schedule"}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default SchoolTimesPage;
