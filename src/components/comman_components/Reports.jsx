import React from "react";
import ReportHeading from "./ReportHeading";
// import ReportHeading from "../Admission/ReportHeading";
const Reports =()=>{
return(
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-5">

    <ReportHeading mainheading="student Crediential" subhading="class wise"/>
    
    <ReportHeading mainheading="guardian report" subhading="guardian report"/>
    <ReportHeading mainheading="student history" subhading="student history" />
    <ReportHeading mainheading="ptm reports" subhading="student ptm"/>
    <ReportHeading mainheading="student report" subhading="class section wise"/>
    <ReportHeading mainheading="guardian report" subhading="guardian report"/>
    <ReportHeading mainheading="student history" subhading="student history" />
    <ReportHeading mainheading="ptm reports" subhading="student ptm"/>
    <ReportHeading mainheading="student report" subhading="class section wise"/>
    <ReportHeading mainheading="guardian report" subhading="guardian report"/>
    <ReportHeading mainheading="student history" subhading="student history" />
    <ReportHeading mainheading="ptm reports" subhading="student ptm"/>

  </div>
);
}

const Attendance =()=>{
    return(
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-5">
        <ReportHeading mainheading="Attendance Report" subhading="class section wise"/>
        <ReportHeading mainheading="Class Wise Report" subhading="guardian report"/>
        <ReportHeading mainheading="Attendance By Date" subhading="student history" />
        <ReportHeading mainheading="Absent Student Report" subhading="student ptm"/>
        <ReportHeading mainheading="Unmarked Attendance" subhading="student history" />
        <ReportHeading mainheading="Custom Attendance Report" subhading="student ptm"/>
    
      </div>
    );
    }

    const Fee =()=>{
      return(
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-5">
          <ReportHeading mainheading="Attendance Report" subhading="class section wise"/>
          <ReportHeading mainheading="guardian report" subhading="guardian report"/>
          <ReportHeading mainheading="student history" subhading="student history" />
          <ReportHeading mainheading="ptm reports" subhading="student ptm"/>
          <ReportHeading mainheading="student history" subhading="student history" />
          <ReportHeading mainheading="ptm reports" subhading="student ptm"/>
      
        </div>
      );
      }    


export {Reports,Attendance,Fee};