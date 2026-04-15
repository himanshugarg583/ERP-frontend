import React, { useCallback, useEffect, useState } from "react";
import { GraduationCap, RefreshCw, Settings2 } from "lucide-react";
import { toast } from "react-toastify";
import Sidebar from "../Sidebar";
import Header from "../../../components/comman_components/Header";
import {
  fetchAllClassesForAttendance,
} from "../../../helper/requests-method/apiMethods";
import {
  WEEK_DAYS,
  getAdminClassTimetable,
  getClassSlots,
  updateClassSlot,
} from "../../../helper/requests-method/timetableApi";

const toTimeInput = (value = "") => {
  if (!value) return "";
  const parts = String(value).split(":");
  if (parts.length < 2) return "";
  return `${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}`;
};

const fromTimeInput = (value = "") => {
  if (!value) return "";
  return `${value}:00`;
};

const asNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
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

  return Array.from(slotsMap.values()).sort(
    (a, b) => asNumber(a.slot_number, 999) - asNumber(b.slot_number, 999)
  );
};

const ClassPeriodPage = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [slots, setSlots] = useState([]);

  const [loadingClassList, setLoadingClassList] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [updatingSlotId, setUpdatingSlotId] = useState(null);

  const [error, setError] = useState("");

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

  const loadClassPeriodData = useCallback(async (classId) => {
    if (!classId) return;

    setLoadingSlots(true);
    setError("");

    try {
      const [slotsResponse, timetableResponse] = await Promise.all([
        getClassSlots(classId).catch(() => ({ success: false, data: { slots: [] } })),
        getAdminClassTimetable(classId).catch(() => ({ success: false, data: {} })),
      ]);

      const normalizedTimetable = WEEK_DAYS.reduce((acc, day) => {
        acc[day] = Array.isArray(timetableResponse?.data?.timetable?.[day])
          ? timetableResponse.data.timetable[day]
          : [];
        return acc;
      }, {});

      const fallbackSlots =
        timetableResponse?.data?.slots?.length
          ? timetableResponse.data.slots
          : buildSlotsFromTimetable(normalizedTimetable);

      const incomingSlots =
        slotsResponse?.data?.slots?.length
          ? slotsResponse.data.slots
          : fallbackSlots;

      setSlots(incomingSlots);
    } catch (loadError) {
      console.error("Failed to load class periods", loadError);
      const message = loadError?.response?.data?.message || "Failed to load class periods";
      setError(message);
      toast.error(message);
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  useEffect(() => {
    loadClasses();
  }, [loadClasses]);

  useEffect(() => {
    if (!selectedClass?.id) return;
    loadClassPeriodData(selectedClass.id);
  }, [selectedClass, loadClassPeriodData]);

  const handleSlotFieldChange = (slotId, field, value) => {
    setSlots((prev) =>
      prev.map((slot) =>
        String(slot.id) === String(slotId)
          ? {
              ...slot,
              [field]: field === "is_break" ? Boolean(value) : value,
            }
          : slot
      )
    );
  };

  const handleUpdateSlot = async (slot) => {
    if (!selectedClass?.id || !slot?.id) return;

    if (!slot.period_name || !slot.start_time || !slot.end_time) {
      toast.error("Slot name, start time, and end time are required");
      return;
    }

    if (toTimeInput(slot.start_time) >= toTimeInput(slot.end_time)) {
      toast.error("Slot end time must be greater than start time");
      return;
    }

    try {
      setUpdatingSlotId(slot.id);
      await updateClassSlot(selectedClass.id, slot.id, {
        period_name: slot.period_name,
        start_time: fromTimeInput(toTimeInput(slot.start_time)),
        end_time: fromTimeInput(toTimeInput(slot.end_time)),
        slot_number: asNumber(slot.slot_number),
        is_break: Boolean(slot.is_break),
      });
      toast.success("Class period updated");
      await loadClassPeriodData(selectedClass.id);
    } catch (slotError) {
      toast.error(slotError?.response?.data?.message || "Failed to update class period");
    } finally {
      setUpdatingSlotId(null);
    }
  };

  const handleRefresh = () => {
    if (selectedClass?.id) {
      loadClassPeriodData(selectedClass.id);
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
        <main className="w-full py-4 md:py-6 px-4 md:px-6">
          <div className="space-y-4 md:space-y-6">
            {!selectedClass ? (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Settings2 className="w-5 h-5 text-violet-600" />
                  <h2 className="text-lg md:text-xl font-semibold text-slate-800">Select Class For Period Setup</h2>
                </div>
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
                        <p className="text-sm text-slate-600">Class Period Management</p>
                      </div>
                    </div>
                    <button
                      onClick={handleRefresh}
                      disabled={loadingSlots}
                      className="px-4 py-2 text-sm bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <RefreshCw className={`w-4 h-4 ${loadingSlots ? "animate-spin" : ""}`} />
                      Refresh
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Class Periods</h3>
                  {loadingSlots ? (
                    <div className="text-center py-8 text-slate-500">Loading class periods...</div>
                  ) : slots.length === 0 ? (
                    <p className="text-sm text-slate-500">No periods available for this class.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-sm">
                        <thead>
                          <tr className="bg-slate-100 text-slate-700">
                            <th className="border border-slate-200 px-3 py-2 text-left">#</th>
                            <th className="border border-slate-200 px-3 py-2 text-left">Name</th>
                            <th className="border border-slate-200 px-3 py-2 text-left">Start</th>
                            <th className="border border-slate-200 px-3 py-2 text-left">End</th>
                            <th className="border border-slate-200 px-3 py-2 text-center">Break</th>
                            <th className="border border-slate-200 px-3 py-2 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {slots.map((slot) => (
                            <tr key={slot.id}>
                              <td className="border border-slate-200 px-3 py-2">{slot.slot_number}</td>
                              <td className="border border-slate-200 px-3 py-2">
                                <input
                                  type="text"
                                  value={slot.period_name || ""}
                                  onChange={(e) => handleSlotFieldChange(slot.id, "period_name", e.target.value)}
                                  className="w-full px-2 py-1 border border-slate-300 rounded"
                                />
                              </td>
                              <td className="border border-slate-200 px-3 py-2">
                                <input
                                  type="time"
                                  value={toTimeInput(slot.start_time)}
                                  onChange={(e) => handleSlotFieldChange(slot.id, "start_time", e.target.value)}
                                  className="w-full px-2 py-1 border border-slate-300 rounded"
                                />
                              </td>
                              <td className="border border-slate-200 px-3 py-2">
                                <input
                                  type="time"
                                  value={toTimeInput(slot.end_time)}
                                  onChange={(e) => handleSlotFieldChange(slot.id, "end_time", e.target.value)}
                                  className="w-full px-2 py-1 border border-slate-300 rounded"
                                />
                              </td>
                              <td className="border border-slate-200 px-3 py-2 text-center">
                                <input
                                  type="checkbox"
                                  checked={Boolean(slot.is_break)}
                                  onChange={(e) => handleSlotFieldChange(slot.id, "is_break", e.target.checked)}
                                />
                              </td>
                              <td className="border border-slate-200 px-3 py-2 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateSlot(slot)}
                                  disabled={updatingSlotId === slot.id}
                                  className="px-3 py-1.5 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {updatingSlotId === slot.id ? "Saving..." : "Update"}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClassPeriodPage;
