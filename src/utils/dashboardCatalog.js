export const DASHBOARD_CATALOG = [
  {
    key: "librarian",
    label: "Librarian",
    status: "existing",
    path: "/LibraryDashboard",
    allowedRoles: ["library"],
    description: "Manage books, issue/return flow, and library reporting.",
    modules: [
      { name: "Catalog", submodules: ["Add Book", "View All Books"], links: ["/libraryaddbook", "/libraryviewall"] },
      { name: "Circulation", submodules: ["Issue & Return", "E-Library"], links: ["/libraryissueandreturn", "/elibrary"] },
      { name: "Operations", submodules: ["Stationery", "Reports"], links: ["/librarystationary", "/libraryreports"] }
    ]
  },
  {
    key: "onlinelearning",
    label: "Online Learning",
    status: "existing",
    path: "/onlineLearningDash",
    allowedRoles: ["onlinelearning"],
    description: "Run classes, live sessions, assignments, and profile management.",
    modules: [
      { name: "Learning Delivery", submodules: ["Classes", "Live Sessions"], links: ["/onlineLearningClass", "/onlineLearningLive"] },
      { name: "Assessments", submodules: ["Assignments"], links: ["/onlineLearningAssignment"] },
      { name: "User", submodules: ["Profile"], links: ["/onlineLearningProfile"] }
    ]
  },
  {
    key: "parents",
    label: "Parents",
    status: "existing",
    path: "/ParentDashboard",
    allowedRoles: ["parent"],
    description: "Track attendance, fees, progress, communication, and transport.",
    modules: [
      { name: "Student Overview", submodules: ["Attendance", "Progress", "Results"], links: ["/ParentAttendance", "/ParentProgress", "/ParentResults"] },
      { name: "Finance", submodules: ["Fees"], links: ["/ParentFees"] },
      { name: "Services", submodules: ["Transport", "Communication", "Settings"], links: ["/ParentTransport", "/ParentCommunication", "/ParentSetting"] }
    ]
  },
  {
    key: "staff",
    label: "Staff",
    status: "existing",
    path: "/StaffDashboard",
    allowedRoles: ["staff"],
    description: "Handle inventory, IT support, attendance, events, and transport.",
    modules: [
      { name: "Inventory", submodules: ["Stationery", "Uniform", "IT Assets", "Sports", "Lab", "Lost & Found"], links: ["/StationeryAssets", "/UniformDressCode", "/ITInventory", "/SportsEquipment", "/LabScienceEquipment", "/LostAndFound"] },
      { name: "IT & Admin", submodules: ["IT Support", "Network", "Attendance", "Maintenance", "Events"], links: ["/ITSupport", "/NetworkManagement", "/StaffAttendence", "/schoolMaintenance", "/events"] },
      { name: "Operations", submodules: ["Staff Support", "Transport"], links: ["/StaffSupport", "/StaffTransport"] }
    ]
  },
  {
    key: "superadmin",
    label: "Super Admin",
    status: "existing",
    path: "/superAdminDash",
    allowedRoles: ["superadmin"],
    description: "Manage schools, analytics, reports, and financial controls.",
    modules: [
      { name: "Governance", submodules: ["School", "School List", "Details"], links: ["/superAdminSchool", "/superAdminSchoolList", "/superAdminDetails"] },
      { name: "Insights", submodules: ["Reports", "Analytics", "Financial"], links: ["/superAdminReports", "/superAdminAnalytics", "/superAdminFinancial"] },
      { name: "Account", submodules: ["Profile"], links: ["/superAdminProfile"] }
    ]
  },
  {
    key: "hr-dashboard",
    label: "HR Dashboard",
    status: "new",
    path: "/hr/dashboard",
    allowedRoles: ["admin"],
    description: "People operations for teacher lifecycle and HR administration.",
    modules: [
      { name: "Staff Lifecycle", submodules: ["Teacher Management", "Teacher Credentials"], links: ["/admin/teacher-management", "/admin/hr/teacher-credentials"] },
      { name: "Compensation", submodules: ["Teacher Salary"], links: ["/admin/hr/teacher-salary"] },
      { name: "Insights", submodules: ["HR Reports"], links: ["/admin/hr-reports"] }
    ]
  },
  {
    key: "admission-officer",
    label: "Admission Officer",
    status: "new",
    path: "/admission-officer/dashboard",
    allowedRoles: ["admin"],
    description: "Manage enquiries, onboarding, and class/student intake pipeline.",
    modules: [
      { name: "Admissions Funnel", submodules: ["Admission Enquiry", "Add Students"], links: ["/admin/admission-enquiry", "/admin/add-students"] },
      { name: "Records", submodules: ["Student Credentials", "Students Details"], links: ["/admin/student-credential", "/admin/students-details"] },
      { name: "Reporting", submodules: ["Student Reports"], links: ["/admin/student-reports"] }
    ]
  },
  {
    key: "transport-manager",
    label: "Transport Manager",
    status: "new",
    path: "/transport-manager/dashboard",
    allowedRoles: ["staff"],
    description: "Coordinate route execution and transport requests across roles.",
    modules: [
      { name: "Operations", submodules: ["Staff Transport", "Teacher Transportation", "Parent Transport", "Student Transport"], links: ["/StaffTransport", "/teacher/transportation", "/ParentTransport", "/student/transport"] },
      { name: "Coordination", submodules: ["Staff Support"], links: ["/StaffSupport"] },
      { name: "Incidents", submodules: ["Lost & Found"], links: ["/LostAndFound"] }
    ]
  },
  {
    key: "hostel-warden",
    label: "Hostel Warden",
    status: "new",
    path: "/hostel-warden/dashboard",
    allowedRoles: ["staff"],
    description: "Manage hostel occupancy, discipline, and welfare workflow.",
    modules: [
      { name: "Resident Management", submodules: ["Check-In/Out", "Room Allocation"], links: [] },
      { name: "Welfare & Discipline", submodules: ["Incident Log", "Attendance Roll"], links: [] },
      { name: "Operations", submodules: ["Visitor Tracking", "Mess Coordination"], links: [] }
    ]
  }
];

export const getDashboardByKey = (key) => {
  return DASHBOARD_CATALOG.find((item) => item.key === key);
};
