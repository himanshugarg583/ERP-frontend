import React from "react";

// Authentication  pages 
import AdminLogin from './Pages/Authentication/AdminLogin';
import ParentLogin from './Pages/Authentication/ParentLogin';
import StudentLogin from './Pages/Authentication/StudentLogin';
import TeacherLogin from './Pages/Authentication/TeacherLogin';
import UnifiedLogin from './Pages/Authentication/UnifiedLogin';
import UnifiedSignup from './Pages/Authentication/UnifiedSignup';

// home page 
import Home from './Pages/Home';
// import ChooseOptions from './Pages/ChooseUser'

// **Teacher Pages**
import TeacherPortal from "./Pages/Teacher/TeacherPortal";
import TeacherSubject from "./Pages/Teacher/TeacherSubject";
import TeacherAttendance from "./Pages/Teacher/TeacherAttendance";
import TeacherResult from "./Pages/Teacher/TeacherResult";
import TeacherTimetable from "./Pages/Teacher/TeacherTimetable";
import TeacherTransportation from "./Pages/Teacher/TeacherTransportation";
import TeacherAssignment from "./Pages/Teacher/TeacherAssignment";
import TeacherNotice from "./Pages/Teacher/TeacherNotice";
import TeacherProfile from "./Pages/Teacher/TeacherProfile";

// *Super Admin Pages*
import SuperAdminDash from "./Pages/Superadmin/SuperAdminDash";
import SuperAdminSchool from "./Pages/Superadmin/SuperAdminSchool";
import SuperAdminSchoolList from "./Pages/Superadmin/SuperAdminSchoolList";
import SuperAdminReports from "./Pages/Superadmin/SuperAdminReports";
import SuperAdminAnalytics from "./Pages/Superadmin/SuperAdminAnalytics";
import SuperAdminProfile from "./Pages/Superadmin/SuperAdminProfile";
import SuperAdminDetails from "./Pages/Superadmin/SuperAdminDetails";
import SuperAdminFinancial from "./Pages/Superadmin/SuperAdminFinancial";

// *Parent Pages*
import ParentDashboard from "./Pages/parents/Parent_Dashboard";
import ParentAttendance from "./Pages/parents/Parent_Attendance";
import ParentFees from "./Pages/parents/Parent_Fee";
import ParentTimeTable from "./Pages/parents/Parent_Timetable";
import ParentProgress from "./Pages/parents/Parent_Progress";
import ParentResult from "./Pages/parents/Parent_Result";
import ParentTransport from "./Pages/parents/Parent_Transport";
import ParentProfile from "./Pages/parents/Parent_Profile";
import ParentCommunication from "./Pages/parents/Parent_Communication.jsx";
import ParentSettings from "./Pages/parents/Parent_Setting.jsx";

// **Student Pages**
import Student from './Pages/students/Student';
import StudentAttendance from './Pages/students/StudentAttendance';
import StudentSubject from './Pages/students/StudentSubject';
import StudentAssignment from './Pages/students/StudentAssignment';
import StudentResult from './Pages/students/StudentResult';
import StudentProgress from './Pages/students/StudentProgress';
import StudentTransport from "./Pages/students/StudentTransport";
import StudentFees from "./Pages/students/StudentFees";
import StudentLeave from "./Pages/students/StudentLeave";
import StudentNotice from "./Pages/students/StudentNotice";
import StudentProfile from "./Pages/students/StudentProfile";

// **Library Pages**
import LibraryDashboard from './Pages/Library/LibraryDashboard';
import LibraryAddNew from './Pages/Library/LibraryAddNew';
import LibraryViewAll from './Pages/Library/LibraryViewAll';
import Elibrary from './Pages/Library/Elibrary';
import LibraryIssued from './Pages/Library/LibraryIssued';
// import { path } from "framer-motion/client";
import LibraryReports from "./Pages/Library/LibraryReports";
import LibraryStationary from "./Pages/Library/LibraryStationary";

// **Accountant Pages**
import AccountantDashboard from "./Pages/Accountant/Accountant_Dashboard";
import AccountantFeeManagement from "./Pages/Accountant/Accountant_FeeManagement";
import AccountantStudentAccounts from "./Pages/Accountant/Accountant_StudentAccount";
import AccountantExpenseManagement from "./Pages/Accountant/Accountant_ExpenseManagement";
import AccountantSalary from "./Pages/Accountant/Accountant_Salary";
import AccountantPayments from "./Pages/Accountant/Accountant_Payments";
import AccountantReport from "./Pages/Accountant/Accountant_ReportAnalytics";
import AccountantProfile from "./Pages/Accountant/Accountant_Profile.jsx";
import AccountantSetting from "./Pages/Accountant/Accountant_Setting.jsx";


// **Admin Routes**
import AdminDashboardPage from "./Pages/admin/AdminDashboardPage.jsx";
import AdminProfile from "./Pages/admin/AdminProfile.jsx";
import EnquiryPage from "./Pages/admin/front_office/EnquiryPage";
import AddStudent from "./Pages/admin/Student_info/AddStudent";
import StudentReports from "./Pages/admin/Student_info/StudentReports";
import ChequePage from "./Pages/admin/fees_collection/ChequePage";
import DemandNotice from "./Pages/admin/fees_collection/DemandNotice";
import FeeDiscountPage from "./Pages/admin/fees_collection/FeeDiscountPage";
import FeeReports from "./Pages/admin/fees_collection/FeeReports";
import PaymentRecipt from "./Pages/admin/fees_collection/PaymentRecipt";
import AddIncomePage from "./Pages/admin/Income/AddIncomePage";
import IncomeHead from "./Pages/admin/Income/IncomeHead";
import Student_Crediential from "./Pages/admin/Student_info/Student_Crediential";
import AddExpensePage from "./Pages/admin/Expense/AddExpensePage";
import ExpenseHead from "./Pages/admin/Expense/ExpenseHead";
import ClassWiseAttendance from "./Pages/admin/Attendance/ClassWiseAttendance";
import Leave from "./Pages/admin/Attendance/LeavePage";
import AttendanceReport from "./Pages/admin/Attendance/AttendanceReport";
import AddClass from "./Pages/admin/Academics/AddClass.jsx";
import AddSubjectPage from "./Pages/admin/Academics/AddSubjectPage.jsx";
import AssignClass from "./Pages/admin/Academics/AssignClass.jsx";
import AssignSubjectPage from "./Pages/admin/Academics/AssignSubjectPage.jsx";
import ClassTimeTablePage from "./Pages/admin/Academics/ClassTimeTablePage.jsx";
import TeacherTimeTablePage from "./Pages/admin/Academics/TeacherTimeTablePage.jsx";
import ViewAssignSubPage from "./Pages/admin/Academics/ViewAssignSubPage.jsx"; 
import AdmitCardPage from "./Pages/admin/examination/AdmitCardPage.jsx";
import ExamAttendancePage from "./Pages/admin/examination/ExamAttendancePage.jsx";
import ExamTimeTablePage from "./Pages/admin/examination/ExamTimeTablePage.jsx";
import MarksRegisterPage from "./Pages/admin/examination/MarksRegisterPage.jsx";
import ReportCardPage from "./Pages/admin/examination/ReportCardPage.jsx";
import TermListPage from "./Pages/admin/examination/TermListPage.jsx";
import ExamListPage from "./Pages/admin/examination/ExamListPage.jsx";
import ExamReportPage from "./Pages/admin/examination/ExamReportPage.jsx";
import EventPage from "./Pages/admin/Announcement/EventPage.jsx";
import TeacherManagement from "./Pages/admin/HR/TeacherManagement.jsx";
import TeacherCredentials from "./Pages/admin/HR/TeacherCredentials.jsx";
import HRReports from "./Pages/admin/HR/HRReports.jsx";
import UploadContent from "./Pages/admin/DownloadCenter/UploadContent.jsx";
import StudyMaterial from "./Pages/admin/DownloadCenter/StudyMaterial.jsx";
// Certificates
import TcPage from "./Pages/admin/Certificates/TcPage.jsx";
import StudentIdPage from "./Pages/admin/Certificates/StudentIdPage.jsx";
import StaffCertificate from "./Pages/admin/Certificates/StaffCertificate.jsx";
import StaffIdCard from "./Pages/admin/Certificates/StaffIdCard.jsx";
import AdminNotes from "./Pages/admin/AdminNotes";

// online learning
import OnlineLearningDash from "./Pages/OnlineLearning/OnlineLearningDash";

import OnlineLearningClass from "./Pages/OnlineLearning/OnlineLearningClass";
import OnlineLearningLive from "./Pages/OnlineLearning/OnlineLearningLive";
import OnlineLearningAssignment from "./Pages/OnlineLearning/OnlineLearningAssignment";
import OnlineLearningProfile from "./Pages/OnlineLearning/OnlineLearningProfile";
// staff pages

import StaffDashboard from "./Pages/Staff/StaffDashboard";
import ITInventory from "./Pages/Staff/Inventory/ITInventory";
import NetworkManagement from './Pages/Staff/IT&TechnicalStaff/NetworkManagement';
import ITSupport from "./Pages/Staff/IT&TechnicalStaff/ITSupport";
import LostAndFound from "./Pages/Staff/Inventory/LostAndFound";
import StationeryAssets from "./Pages/Staff/Inventory/StationeryAssets";
import UniformDressCode from "./Pages/Staff/Inventory/UniformDressCode";
import SportsEquipment from "./Pages/Staff/Inventory/SportsEquipment";
import LabScienceEquipment from "./Pages/Staff/Inventory/LabInventory";
import StaffSupport from "./Pages/Staff/StaffSupport";
import StaffAttendance from "./Pages/Staff/StaffAttendence";
import StaffMaintenence from "./Pages/Staff/AdministrativeTask/StaffMaintenence";
import StaffEvents from "./Pages/Staff/AdministrativeTask/StaffEvents";
import StaffTransport from "./Pages/Staff/StaffTransport";
import AccountantLogin from "./Pages/Authentication/AccountantLogin.jsx";

const routes = {
  home: [
    { path: "/", element: <Home /> },
  ],
  login: [
    { path: "/login", element: <UnifiedLogin /> },
    { path: "/parentLogin", element: <ParentLogin /> },
    { path: "/signup", element: <UnifiedSignup /> },
  ],
  teacher: [
    { path: "/teacher/dashboard", element: <TeacherPortal /> },
    { path: "/teacher/subjects", element: <TeacherSubject /> },
    { path: "/teacher/attendance", element: <TeacherAttendance /> },
    { path: "/teacher/results", element: <TeacherResult /> },
    { path: "/teacher/timetable", element: <TeacherTimetable /> },
    { path: "/teacher/transportation", element: <TeacherTransportation /> },
    { path: "/teacher/assignment", element: <TeacherAssignment /> },
    { path: "/teacher/notice", element: <TeacherNotice /> },
    { path: "/teacher/profile", element: <TeacherProfile /> },
  ],
  superAdmin: [
    { path: "/superAdminDash", element: <SuperAdminDash /> },
    { path: "/superAdminSchool", element: <SuperAdminSchool /> },
    { path: "/superAdminSchoolList", element: <SuperAdminSchoolList /> },
    { path: "/superAdminReports", element: <SuperAdminReports /> },
    { path: "/superAdminAnalytics", element: <SuperAdminAnalytics /> },
    { path: "/superAdminProfile", element: <SuperAdminProfile /> },
    { path: "/superAdminDetails", element: <SuperAdminDetails /> },
    { path: "/superAdminFinancial", element: <SuperAdminFinancial /> },
  ],
  parent: [
    { path: "/ParentDashboard", element: <ParentDashboard /> },
    { path: "/ParentAttendance", element: <ParentAttendance /> },
    { path: "/ParentFees", element: <ParentFees /> },
    { path: "/ParentTimetable", element: <ParentTimeTable /> },
    { path: "/ParentProgress", element: <ParentProgress /> },
    { path: "/ParentResults", element: <ParentResult /> },
    { path: "/ParentTransport", element: <ParentTransport /> },
    { path: "/ParentProfile", element: <ParentProfile /> },
    { path: "/ParentCommunication", element: <ParentCommunication /> },
    { path: "/ParentSetting", element: <ParentSettings /> },
  ],
  accountant: [
    { path: "/AccountantDashboard", element: <AccountantDashboard /> },
    { path: "/AccountantFeeManagement", element: <AccountantFeeManagement /> },
    { path: "/AccountantStudentAccounts", element: <AccountantStudentAccounts /> },
    { path: "/AccountantExpenseManagement", element: <AccountantExpenseManagement /> },
    { path: "/AccountantSalary", element: <AccountantSalary /> },
    { path: "/AccountantPayments", element: <AccountantPayments /> },
    { path: "/AccountantReports", element: <AccountantReport /> },
    { path: "/AccountantProfile", element: <AccountantProfile /> },
    { path: "/AccountantSetting", element: <AccountantSetting /> },
  ],
  student: [
    { path: "/student/dashboard", element: <Student /> },
    { path: "/student/attendance", element: <StudentAttendance /> },
    { path: "/student/subjects", element: <StudentSubject /> },
    { path: "/student/assignments", element: <StudentAssignment /> },
    { path: "/student/results", element: <StudentResult /> },
    { path: "/student/progress", element: <StudentProgress /> },
    { path: "/student/transport", element: <StudentTransport /> },
    { path: "/student/fees", element: <StudentFees /> },
    { path: "/student/leave", element: <StudentLeave /> },
    { path: "/student/notice", element: <StudentNotice /> },
    { path: "/student/profile", element: <StudentProfile /> },
  ],
  library: [
    { path: "/LibraryDashboard", element: <LibraryDashboard /> },
    { path: "/libraryaddbook", element: <LibraryAddNew /> },
    { path: "/libraryviewall", element: <LibraryViewAll /> },
    { path: "/elibrary", element: <Elibrary /> },
    { path: "/libraryissueandreturn", element: <LibraryIssued /> },
    { path: "/librarystationary", element: <LibraryStationary /> },
    { path: "/libraryreports", element: <LibraryReports /> },
  ],
  admin: [
    { path: "/admin/dashboard", element: <AdminDashboardPage /> },
    { path: "/admin/profile", element: <AdminProfile /> },
    { path: "/admin/admission-enquiry", element: <EnquiryPage /> },
    { path: "/admin/add-students", element: <AddStudent /> },
    { path: "/admin/student-credential", element: <Student_Crediential /> },
    { path: "/admin/payment-receipt", element: <PaymentRecipt /> },
    { path: "/admin/demand-notice", element: <DemandNotice /> },
    { path: "/admin/student-reports", element: <StudentReports /> },
    { path: "/admin/fee-discount-page", element: <FeeDiscountPage /> },
    { path: "/admin/fee-reports", element: <FeeReports /> },
    { path: "/admin/cheque-page", element: <ChequePage /> },
    { path: "/admin/add-income", element: <AddIncomePage /> },
    // { path: "/admin/incomehead", element: <IncomeHead /> },
    { path: "/admin/add-expense", element: <AddExpensePage/> },
    // { path: "/admin/expense-head", element: <ExpenseHead/> },
    { path: "/admin/class-attendance", element: <ClassWiseAttendance/> },
    { path: "/admin/leave", element: <Leave/> },
    { path: "/admin/attendance-report", element: <AttendanceReport/> },
    { path: "/admin/add-class", element: <AddClass/> },
    { path: "/admin/add-subject", element: <AddSubjectPage/> },
    { path: "/admin/assign-class", element: <AssignClass/> },
    { path: "/admin/teacher-time-table-page", element: <TeacherTimeTablePage/> },
    { path: "/admin/assign-subject", element: <AssignSubjectPage/> },
    { path: "/admin/view-assign-sub-page", element: <ViewAssignSubPage/> },
    { path: "/admin/class-time-table-page", element: <ClassTimeTablePage/> },
    // exam routes
    { path: "/admin/admit-card-page", element: <AdmitCardPage/> },
    { path: "/admin/exam-attendance-page", element: <ExamAttendancePage/> },
    { path: "/admin/exam-time-table-page", element: <ExamTimeTablePage/> },
    { path: "/admin/marks-register-page", element: <MarksRegisterPage/> },
    { path: "/admin/report-card-page", element: <ReportCardPage/> },
    { path: "/admin/term-list-page", element: <TermListPage/> },
    { path: "/admin/exam-list-page", element: <ExamListPage/> },
    { path: "/admin/exam-report-page", element: <ExamReportPage/> },
    { path: "/admin/event-page", element: <EventPage/> },
    { path: "/admin/notes", element: <AdminNotes/> },
    { path: "/admin/teacher-management", element: <TeacherManagement/> },
    { path: "/admin/teacher-credentials", element: <TeacherCredentials/> },
    { path: "/admin/hr-reports", element: <HRReports/> },
    { path: "/admin/upload-content", element: <UploadContent /> },
    { path: "/admin/study-material", element: <StudyMaterial /> },
    // Certificates
    { path: "/admin/tc-page", element: <TcPage /> },
    { path: "/admin/student-id-page", element: <StudentIdPage /> },
    { path: "/admin/staff-certificate", element: <StaffCertificate /> },
    { path: "/admin/staff-id-card", element: <StaffIdCard /> },

      

    


    
  ],




  Staff: [
    { path: "/StaffDashboard", element: <StaffDashboard /> },
    { path: "/StationeryAssets", element: <StationeryAssets/> },
    { path: "/UniformDressCode", element: <UniformDressCode/> },
    { path: "/ITInventory", element: <ITInventory/> },
    { path: "/SportsEquipment", element: <SportsEquipment/> },
    { path: "/LabScienceEquipment", element: <LabScienceEquipment/> },
    { path: "/LostAndFound", element: <LostAndFound/> },
    { path: "/ITSupport", element: <ITSupport/> },
    { path: "/NetworkManagement", element: <NetworkManagement/> },

    { path: "/StaffSupport", element: <StaffSupport /> },
    { path: "/StaffAttendence", element: <StaffAttendance /> },
    { path: "/schoolMaintenance", element: <StaffMaintenence /> },
    { path: "/events", element: <StaffEvents /> },
    { path: "/StaffTransport", element: <StaffTransport /> },

  ],

  onlineLearning:[
    {path:"/onlineLearningDash",element:<OnlineLearningDash/>},
    {path:"/onlineLearningClass",element:<OnlineLearningClass/>},
    {path:"/onlineLearningLive",element:<OnlineLearningLive/>},
    {path:"/onlineLearningAssignment",element:<OnlineLearningAssignment/>},
    {path:"/onlineLearningProfile",element:<OnlineLearningProfile/>},
  ],
  // ChooseOptions: [
    // { path: "/chooseOptions", element: <ChooseOptions /> },
    
  // ]
};


export default routes;