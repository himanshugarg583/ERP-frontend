import React from "react";
import image from '../../assets/r-img1.png'
// import image from '../../assests/r-img1.png';

const ReportHeading=({mainheading,subhading})=>{
    return(

        <div class="flex items-center bg-white p-4 rounded-lg shadow cursor-pointer">
    <img alt="Icon of a student" class="w-12 h-12 mr-4" src={image}/>
    <div>
   <h3 class="text-violet-600 font-bold">
      {mainheading}
     </h3>
     <p class="text-gray-500">
      {subhading}
     </p>
    </div>
   </div>
    );
}

export default ReportHeading;