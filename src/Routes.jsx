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
import AddTeacherPage from "./Pages/admin/teacher info/AddTeacher";
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
import ExamReportPage from "./Pages/admin/examination/ExamReportPage.jsx";
import EventPage from "./Pages/admin/Announcement/EventPage.jsx";
import AddAccontantPage from "./Pages/admin/HR/AddAccontantPage.jsx";
import AddStaff from "./Pages/admin/HR/AddStaff.jsx";
import AddLibrarian from "./Pages/admin/HR/AddLibrarian.jsx";
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
    { path: "/TeacherPortal", element: <TeacherPortal /> },
    { path: "/teacherSubjects", element: <TeacherSubject /> },
    { path: "/teacherAttendance", element: <TeacherAttendance /> },
    { path: "/teacherResult", element: <TeacherResult /> },
    { path: "/teacherTimetable", element: <TeacherTimetable /> },
    { path: "/teacherTransportation", element: <TeacherTransportation /> },
    { path: "/teacherAssignment", element: <TeacherAssignment /> },
    { path: "/teacherNotice", element: <TeacherNotice /> },

    {path:"/teacherProfile",element:<TeacherProfile/>},

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
    { path: "/StudentDashboard", element: <Student /> },
    { path: "/studentattendance", element: <StudentAttendance /> },
    { path: "/studentsubjects", element: <StudentSubject /> },
    { path: "/studentassignments", element: <StudentAssignment /> },
    { path: "/studentresults", element: <StudentResult /> },
    { path: "/studentprogress", element: <StudentProgress /> },
    { path: "/studenttransport", element: <StudentTransport /> },
    { path: "/studentprofile", element: <StudentProfile /> },
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
    { path: "/AdminDashboardPage", element: <AdminDashboardPage /> },
    { path: "/Admissionenquiry", element: <EnquiryPage /> },
    { path: "/AddStudents", element: <AddStudent /> },
    { path: "/PaymentReceipt", element: <PaymentRecipt /> },
    { path: "/DemandNotice", element: <DemandNotice /> },
    { path: "/StudentReports", element: <StudentReports /> },
    { path: "/FeeDiscountPage", element: <FeeDiscountPage /> },
    { path: "/FeeReports", element: <FeeReports /> },
    { path: "/ChequePage", element: <ChequePage /> },
    { path: "/AddIncome", element: <AddIncomePage /> },
    { path: "/IncomeHead", element: <IncomeHead /> },
    { path: "/Admissionenquiry", element: <EnquiryPage/> },
    { path: "/AddStudents", element: <AddStudent/> },
    { path: "/Student_Crediential", element: <Student_Crediential/> },
    { path: "/PaymentReceipt", element: <PaymentRecipt/> },
    { path: "/DemandNotice", element: <DemandNotice/> },
    { path: "/StudentReports", element: <StudentReports/> },
    { path: "/FeeDiscountPage", element: <FeeDiscountPage/> },
    { path: "/FeeReports", element: <FeeReports/> },
    { path: "/ChequePage", element: <ChequePage/> },
    { path: "/AddIncome", element: <AddIncomePage/> },
    { path: "/AddTeacher", element: <AddTeacherPage/> },
    { path: "/AddExpense", element: <AddExpensePage/> },
    { path: "/ExpenseHead", element: <ExpenseHead/> },
    { path: "/ClassAttendance", element: <ClassWiseAttendance/> },
    { path: "/leave", element: <Leave/> },
    { path: "/AttendanceReport", element: <AttendanceReport/> },
    { path: "/AddClass", element: <AddClass/> },
    { path: "/AddSubject", element: <AddSubjectPage/> },
    { path: "/AssignClass", element: <AssignClass/> },
    { path: "/TeacherTimeTablePage", element: <TeacherTimeTablePage/> },
    { path: "/AssignSubject", element: <AssignSubjectPage/> },
    { path: "/ViewAssignSubPage", element: <ViewAssignSubPage/> },
    { path: "/ClassTimeTablePage", element: <ClassTimeTablePage/> },
    // exam routes
    { path: "/AdmitCardPage", element: <AdmitCardPage/> },
    { path: "/ExamAttendancePage", element: <ExamAttendancePage/> },
    { path: "/ExamTimeTable", element: <ExamTimeTablePage/> },
    { path: "/MarksRegisterPage", element: <MarksRegisterPage/> },
    { path: "/ReportCardPage", element: <ReportCardPage/> },
    { path: "/TermListPage", element: <TermListPage/> },
    { path: "/ExamReportPage", element: <ExamReportPage/> },
    { path: "/EventPage", element: <EventPage/> },
    { path: "/TeacherManagement", element: <TeacherManagement/> },
    { path: "/TeacherCredentials", element: <TeacherCredentials/> },
    { path: "/HRReports", element: <HRReports/> },
    { path: "/AddAccontantPage", element: <AddAccontantPage/> },
    { path: "/AddStaff", element: <AddStaff/> },
    { path: "/AddLibrarian", element: <AddLibrarian/> },
    { path: "/UploadContent", element: <UploadContent /> },
    { path: "/StudyMaterial", element: <StudyMaterial /> },
    // Certificates
    { path: "/TcPage", element: <TcPage /> },
    { path: "/StudentIdPage", element: <StudentIdPage /> },
    { path: "/StaffCertificate", element: <StaffCertificate /> },
    { path: "/StaffIdCard", element: <StaffIdCard /> },

      

    


    
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