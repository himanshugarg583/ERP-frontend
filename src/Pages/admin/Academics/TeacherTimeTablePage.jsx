import React from "react";
import Sidebar from '../Sidebar';
import Header from '../../../components/comman_components/Header';
// import TeacherTimetable from "../../../components/academics/ClassTimeTable";
import TeacherTimeTable from "../../../components/academics/TeacherTimeTable";
const TeacherTimeTablePage=()=>{

    const sampleTimetableData = [
        {
          class: 'Class 1',
          section: 'A',
          timetable: {
            Monday: [
              { subject: 'Math', teacher: 'Mr. Smith' },
              { subject: 'English', teacher: 'Ms. Doe' },
              { subject: 'Science', teacher: 'Dr. Brown' },
              { subject: 'History', teacher: 'Mrs. Green' },
              { subject: '', teacher: '' }, // Lunch slot
              { subject: 'Geography', teacher: 'Ms. Jane' },
              { subject: 'PE', teacher: 'Coach Lee' },
              { subject: 'Art', teacher: 'Ms. Doe' },
            ],
            Tuesday: Array(8).fill({ subject: '', teacher: '' }),
            Wednesday: Array(8).fill({ subject: '', teacher: '' }),
            Thursday: Array(8).fill({ subject: '', teacher: '' }),
            Friday: Array(8).fill({ subject: '', teacher: '' }),
            Saturday: Array(8).fill({ subject: '', teacher: '' }),
          },
        },
        {
          class: 'Class 10',
          section: 'B',
          timetable: {
            Monday: [
              { subject: 'Science', teacher: 'Dr. Brown' },
              { subject: 'PE', teacher: 'Coach Lee' },
              { subject: '', teacher: '' },
              { subject: 'Math', teacher: 'Mr. Smith' },
              { subject: '', teacher: '' }, // Lunch slot
              { subject: 'English', teacher: 'Ms. Doe' },
              { subject: 'History', teacher: 'Mrs. Green' },
              { subject: '', teacher: '' },
            ],
            Tuesday: Array(8).fill({ subject: '', teacher: '' }),
            Wednesday: Array(8).fill({ subject: '', teacher: '' }),
            Thursday: Array(8).fill({ subject: '', teacher: '' }),
            Friday: Array(8).fill({ subject: '', teacher: '' }),
            Saturday: Array(8).fill({ subject: '', teacher: '' }),
          },
        },
      ];
    return(
       <div className='bg-gray-100 flex AddStudent'>
                          <Sidebar/>
                     
                <div className=' overflow-auto relative z-1 flex-col' style={{
                    height: '95vh',
                    width: '100vw',
                    gap:'10px',
                    display: 'flex',
                    transition: 'margin-left 0.3s ease'
                  }}>
                          <Header/>
                         
                              
                  {/* <TeacherTimetable/> */}

                  <TeacherTimeTable timetableData={sampleTimetableData} />
                   
                          </div>   
             
                          </div> 
    );
}
export default TeacherTimeTablePage;