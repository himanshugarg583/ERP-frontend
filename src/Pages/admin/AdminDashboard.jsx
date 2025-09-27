import React from "react";
import { Navigate, Route, Routes } from 'react-router-dom';
import Sidebar from "./Sidebar";
// import Header from "../../components/common_components/Header";
import OverviewPage from "./OverviewPage";
import EnquiryPage from "./front_office/EnquiryPage";
import AddStudent from "./Student_info/AddStudent";
import StudentReports from "./Student_info/StudentReports";
import ChequePage from "./fees_collection/ChequePage";
import DemandNotice from "./fees_collection/DemandNotice";
import FeeDiscountPage from "./fees_collection/FeeDiscountPage";
import FeeReports from "./fees_collection/FeeReports";
import PaymentRecipt from "./fees_collection/PaymentRecipt";

// import AddIncome from "../../components/Income/AddIncome";
import AddIncomePage from "./Income/AddIncomePage";
import IncomeHead from "./Income/IncomeHead";
import ExpenseHead from "./Expense/ExpenseHead";

// import AddStudent from "./StudentInfo/AddStudent";
// import StudentReports from "./StudentInfo/StudentsReports";
// import Leave from "./Attendance/LeavePage";
// import AttendanceReport from "./Attendance/AttendanceReport";
// import PaymentRecipt from "./fees_collection/PaymentRecipt";
// import DemandNotice from "./fees_collection/DemandNotice";
// import FeeDiscountPage from "./fees_collection/FeeDiscountPage";
// import FeeReports from "./fees_collection/FeeReports";
// import ChequePage from "./fees_collection/ChequePage";
// import StudentIdPage from "./certificatespages/StudentIdPage";
// import TcPage from "./certificatespages/TcPage";
// import AddClass from "./Academics/AddClass";
// import AddTeacherPage from "./teacher info/AddTeacher";
// import AddSubject from "./Academics/AddSubjectPage";
// import AssignSubjectPage from "./Academics/AssignSubjectPage";
// import ViewAssignSubPage from "./Academics/ViewAssignSubPage";
// import ClassTimeTablePage from "./Academics/ClassTimeTablePage";
// import TeacherTimeTablePage from "./Academics/TeacherTimeTablePage";
// import AssignClass from "./Academics/AssignClass";
// import AddHomeworkPage from "./homework/AddHomeWorkPage";
// import AddWork from "./homework/AddWork";
// import EvaluationReportPage from "./homework/EvaluationReportPage";
// import UploadContentPage from "./download center/UploadContentPage";
// import StudyMaterial from "./download center/StudyMaterial";
// import AnnouncementPage from "./Announcement/AnnouncementPage";
// import TermListPage from "./examination/TermListPage";
// import ExamListPage from "./examination/ExamListPage";
// import AdmitCardPage from "./examination/AdmitCardPage";
// import ExamReportPage from "./examination/ExamReportPage";
// import ExamSchedulePage from "./examination/ExamSchedulePage";
// import MarksRegisterPage from "./examination/MarksRegisterPage";
// import ReportCardPage from "./examination/ReportCardPage";
// import ApplyLeavePage from "./Human resource/ApplyLeavePage";
// import ApprovedLeavePage from "./Human resource/ApprovedLeavePage";
// import PayrollPage from "./Human resource/PayrollPage";
// import HrReportPage from "./Human resource/HrReportPage";




const AdminDashboard = () => {
return(
<div className="flex h-screen  text-gray-100 overflow-hidden">
     {/* BACKGROUND SETTINGS */}
     {/* <div className='fixed inset-0 z-0'>
        <div className='absolute inset-0 bg-gradient-to-br  opacity-80' />
        <div className='absolute inset-0 backdrop-blur-3xl' />
      </div> */}
      
    <Sidebar/>  
  

    <div className='flex flex-col ' style={{border:'5px solid white',width:'100%'}}>
    {/* <Header title="School ERP" /> */}
    
    <Routes>
    {/* <Route path="/" element={<OverviewPage />}/> */}
    <Route path="/" element={<OverviewPage />}/>
     <Route path="/desktop" element={<OverviewPage />}/>
    <Route path='/Admissionenquiry' element={<EnquiryPage />} />
    <Route path='/AddStudents' element={<AddStudent />} />
    <Route path='/StudentReports' element={<StudentReports />} />
    
    {/* fee Collection Routes */}
    <Route path='/PaymentReceipt' element={<PaymentRecipt />} />
    <Route path='/DemandNotice' element={<DemandNotice />} />
    <Route path='/FeeDiscountPage' element={<FeeDiscountPage />} />
    <Route path='/FeeReports' element={<FeeReports />} />
    <Route path='/ChequePage' element={<ChequePage />} />

     {/* income and expense routes       */}
     <Route path='/AddIncome' element={<AddIncomePage />} />
     <Route path='/IncomeHead' element={<IncomeHead />} />
     <Route path='/ExpenseHead' element={<ExpenseHead />} />


    {/*    
        <Route path='/addmission' element={<AddStudent />} />
        
       <Route path='/leave' element={<Leave/>} />
        <Route path='/AttendanceReport' element={<AttendanceReport />} />        
         
        <Route path='/StudentIdPage' element={<StudentIdPage />} />
        <Route path='/TcPage' element={<TcPage />} />
        <Route path='/AddClass' element={<AddClass />} />
        <Route path='/AddTeacherPage' element={<AddTeacherPage />} />
        <Route path='/AddSubject' element={<AddSubject />} />
        <Route path='/AssignSubject' element={<AssignSubjectPage/>} />
        <Route path='/ViewAssignSubPage' element={<ViewAssignSubPage/>} />
        <Route path='/ClassTimeTablePage' element={<ClassTimeTablePage/>} />
        <Route path='/TeacherTimeTablePage' element={<TeacherTimeTablePage/>} />
        <Route path='/AssignClass' element={<AssignClass/>} />
        <Route path='/AddHomework' element={<AddHomeworkPage/>} />
        <Route path='/AddWork' element={<AddWork/>} />
        <Route path='/EvaluationReport' element={<EvaluationReportPage/>} />
        <Route path='/UploadContent' element={<UploadContentPage/>} />
        <Route path='/StudyMaterial' element={<StudyMaterial/>} />
        <Route path='/Announcement' element={<AnnouncementPage/>} />
        <Route path='/TermList' element={<TermListPage/>} />
        <Route path='/ExamList' element={<ExamListPage/>} />
        <Route path='/AdmitCard' element={<AdmitCardPage/>} />
        <Route path='/ExamReport' element={<ExamReportPage/>} />
        <Route path='/ExamSchedule' element={<ExamSchedulePage/>} />
        <Route path='/MarksRegister' element={<MarksRegisterPage/>} />
        <Route path='/ReportCard' element={<ReportCardPage/>} />

        <Route path='/ApplyLeave' element={<ApplyLeavePage/>} />
        <Route path='/ApprovedLeave' element={<ApprovedLeavePage/>} />
        <Route path='/Payroll' element={<PayrollPage/>} />
        <Route path='/HrReport' element={<HrReportPage/>} />
         */}
        
        





        
        
        


    </Routes>

    </div>
    
    </div>    
)

}
export default AdminDashboard