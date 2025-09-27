import React from "react";
import Sidebar from '../Sidebar';
import Header from '../../../components/comman_components/Header';
import ClassTimetable from "../../../components/academics/ClassTimeTable";
// import TeacherTimetable from "../../../components/academics/ClassTimeTable";

const ClassTimeTablePage=()=>{
    // const sampleData = {
    //     Monday: [
    //       { subject: 'Math', teacher: 'Mr. Smith' },
    //       { subject: 'English', teacher: 'Ms. Doe' },
    //       { subject: '', teacher: '' },
    //       { subject: 'Science', teacher: 'Dr. Brown' },
    //       { subject: '', teacher: '' },
    //       { subject: 'History', teacher: 'Mrs. Green' },
    //       { subject: '', teacher: '' },
    //       { subject: 'PE', teacher: 'Coach Lee' },
    //     ],
    //     Tuesday: Array(8).fill({ subject: '', teacher: '' }),
    //     Wednesday: Array(8).fill({ subject: '', teacher: '' }),
    //     Thursday: Array(8).fill({ subject: '', teacher: '' }),
    //     Friday: Array(8).fill({ subject: '', teacher: '' }),
    //     Saturday: Array(8).fill({ subject: '', teacher: '' }),
    //   };
    
    //   const handleTimetableSave = (updatedTimetable) => {
    //     console.log('Saved Timetable:', updatedTimetable);
    //     // Here you can send the data to a backend API or update state
    //   };

      const handleTimetableSave = (timetableData) => {
        console.log('Saved Timetable:', timetableData);
        // Here you can send the data to a backend API or update state
      };
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
                         
                              
                  <ClassTimetable onSave={handleTimetableSave}/>
                  {/* <ClassTimetable className="Class 10A" timetableData={sampleData} onSave={handleTimetableSave} />            */}
                          </div>   
             
                          </div> 
    );
}
export default ClassTimeTablePage



