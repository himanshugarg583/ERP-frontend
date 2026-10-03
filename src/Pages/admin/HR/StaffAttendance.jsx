import React, { useMemo, useState } from "react";
import { Edit3 } from "lucide-react";
import Sidebar from "../Sidebar";
import Header from "../../../components/comman_components/Header";
import CommonTable from "../../../components/tables/CommonTable";

const buildToday = () => {
  const now = new Date();
  return now.toISOString().slice(0, 10);
};

const seedToday = (today) => [
  {
    id: 1,
    staff_user_id: "STF-1001",
    name: "Amit Sharma",
    role: "Teacher",
    biometric_id: "BIO-2001",
    time_slot: "09:00-17:00",
    attendance: "Present",
    check_in: "09:05",
    check_out: "17:02",
    date: today,
  },
  {
    id: 2,
    staff_user_id: "STF-1002",
    name: "Neha Patel",
    role: "Accountant",
    biometric_id: "BIO-2002",
    time_slot: "09:30-17:30",
    attendance: "Late",
    check_in: "09:46",
    check_out: "17:32",
    date: today,
  },
  {
    id: 3,
    staff_user_id: "STF-1003",
    name: "Rahul Verma",
    role: "Staff",
    biometric_id: "BIO-2003",
    time_slot: "08:30-16:30",
    attendance: "Present",
    check_in: "08:28",
    check_out: "16:31",
    date: today,
  },
  {
    id: 4,
    staff_user_id: "STF-1004",
    name: "Sneha Iyer",
    role: "Librarian",
    biometric_id: "BIO-2004",
    time_slot: "10:00-18:00",
    attendance: "Absent",
    check_in: "",
    check_out: "",
    date: today,
  },
  {
    id: 5,
    staff_user_id: "STF-1005",
    name: "Vikas Singh",
    role: "Teacher",
    biometric_id: "BIO-2005",
    time_slot: "09:00-17:00",
    attendance: "Half Day",
    check_in: "09:02",
    check_out: "13:10",
    date: today,
  },
];

const attendanceBadge = (value) => {
  const normalized = (value || "").toLowerCase();
  const base = "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold";
  if (normalized === "present") {
    return `${base} bg-emerald-100 text-emerald-700`;
  }
  if (normalized === "late") {
    return `${base} bg-amber-100 text-amber-700`;
  }
  if (normalized === "half day") {
    return `${base} bg-blue-100 text-blue-700`;
  }
  if (normalized === "absent") {
    return `${base} bg-rose-100 text-rose-700`;
  }
  return `${base} bg-slate-100 text-slate-700`;
};

const StaffAttendance = () => {
  const today = useMemo(() => buildToday(), []);
  const [filters, setFilters] = useState({ role: "all", attendance: "all", date: today });
  const [records, setRecords] = useState(() => seedToday(today));
  const [editRecord, setEditRecord] = useState(null);
  const [editForm, setEditForm] = useState({ check_in: "", check_out: "" });

  const columns = useMemo(
    () => [
      {
        key: "sr_no",
        header: "Sr. No",
        render: (value, item, index) => index + 1,
      },
      { key: "staff_user_id", header: "Staff user ID" },
      { key: "name", header: "Name" },
      { key: "role", header: "Role" },
      { key: "biometric_id", header: "Biometric Id" },
      { key: "time_slot", header: "Time Slot" },
      {
        key: "attendance",
        header: "Attendance",
        render: (value) => <span className={attendanceBadge(value)}>{value}</span>,
      },
      { key: "check_in", header: "Check In", render: (value) => value || "--" },
      { key: "check_out", header: "Check Out", render: (value) => value || "--" },
      {
        key: "action",
        header: "Action",
        render: (value, item) => (
          <button
            onClick={() => openEdit(item)}
            className="inline-flex items-center gap-1 text-violet-600 hover:text-violet-700"
          >
            <Edit3 size={16} />
            Edit
          </button>
        ),
      },
    ],
    []
  );

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const roleMatch = filters.role === "all" || record.role.toLowerCase() === filters.role;
      const attendanceMatch = filters.attendance === "all" || record.attendance.toLowerCase() === filters.attendance;
      const dateMatch = !filters.date || record.date === filters.date;
      return roleMatch && attendanceMatch && dateMatch;
    });
  }, [records, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFilters({ role: "all", attendance: "all", date: today });
  };

  const handleMarkHoliday = () => {
    // TODO: Connect to backend to mark holiday for selected date.
  };

  const openEdit = (record) => {
    setEditRecord(record);
    setEditForm({ check_in: record.check_in || "", check_out: record.check_out || "" });
  };

  const closeEdit = () => {
    setEditRecord(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!editRecord) return;
    setRecords((prev) =>
      prev.map((record) =>
        record.id === editRecord.id
          ? { ...record, check_in: editForm.check_in, check_out: editForm.check_out }
          : record
      )
    );
    closeEdit();
  };

  return (
    <div className="bg-slate-200 flex">
      <Sidebar />
      <div
        className="overflow-y-auto relative z-1 flex-col"
        style={{ height: "100vh", width: "100vw", gap: "10px", display: "flex", transition: "margin-left 0.3s ease" }}
      >
        <Header />
        <main className="w-full py-4 md:py-6 px-4 md:px-6">
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl md:text-2xl font-semibold text-slate-800">Staff Attendance</h1>
                  <p className="text-sm text-slate-600">Today attendance report for all staff</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
                  <select
                    name="role"
                    value={filters.role}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                  >
                    <option value="all">All Roles</option>
                    <option value="teacher">Teacher</option>
                    <option value="staff">Staff</option>
                    <option value="accountant">Accountant</option>
                    <option value="librarian">Librarian</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Attendance</label>
                  <select
                    name="attendance"
                    value={filters.attendance}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                  >
                    <option value="all">All</option>
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="late">Late</option>
                    <option value="half day">Half Day</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={filters.date}
                    onChange={handleFilterChange}
                    max={today}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                >
                  Reset Filters
                </button>
              </div>
            </div>

            <CommonTable
              title="Attendance Report"
              columns={columns}
              data={filteredRecords}
              searchPlaceholder="Search staff..."
              enableSearch={true}
              enablePagination={true}
              enableExport={true}
              enableAdd={false}
              enableEdit={false}
              enableDelete={false}
              enableView={false}
              itemsPerPage={10}
              headerActions={
                <button
                  onClick={handleMarkHoliday}
                  className="inline-flex items-center justify-center px-3 py-2 rounded-lg border border-amber-300 bg-amber-50 text-amber-800 text-sm font-medium hover:bg-amber-100 transition-colors"
                >
                  Mark as Holiday
                </button>
              }
            />
          </div>
        </main>
      </div>

      {editRecord && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ backgroundColor: "rgba(15, 23, 42, 0.45)" }}
          onClick={(e) => e.target === e.currentTarget && closeEdit()}
        >
          <div className="bg-white w-full max-w-md rounded-xl shadow-xl border border-slate-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">Edit Check In/Out</h2>
                <p className="text-xs text-slate-500">{editRecord.name} ({editRecord.staff_user_id})</p>
              </div>
              <button
                className="text-slate-400 hover:text-slate-600 text-lg"
                onClick={closeEdit}
                aria-label="Close"
              >
                x
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Check In</label>
                <input
                  type="time"
                  name="check_in"
                  value={editForm.check_in}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Check Out</label>
                <input
                  type="time"
                  name="check_out"
                  value={editForm.check_out}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={closeEdit}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffAttendance;
