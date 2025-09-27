import { Box, Typography, useTheme } from "@mui/material";
import { FaUsers,FaCheckCircle,FaChartLine,FaClipboardList } from "react-icons/fa";
// import { tokens } from "../theme";
// import ProgressCircle from "./ProgressCircle";

const StatBox = ({ title, subtitle, icon, progress, increase }) => {
  // const theme = useTheme();
  // const colors = tokens(theme.palette.mode);

  return (
   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 md:gap-6 mb-6 md:mb-8">
               {[
                 { title: 'Total Students', value: '1156', change: '+2.5%', icon: <FaUsers />, color: 'bg-blue-100', textColor: 'text-blue-500' },
                 { title: 'Total Teacher', value: '94 ', change: '-1.2%', icon: <FaCheckCircle />, color: 'bg-green-100', textColor: 'text-green-500' },
                 { title: 'Male Student', value: '810', change: '+0.5', icon: <FaChartLine />, color: 'bg-purple-100', textColor: 'text-purple-500' },
                 { title: 'Female Student', value: '220', change: '5 urgent', icon: <FaClipboardList />, color: 'bg-amber-100', textColor: 'text-amber-500' },
               ].map((card, index) => (
                 <div key={index} className={`bg-white p-3 sm:p-4 md:p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow ${card?.color ?? 'bg-gray-100'}`}>
                   <div className="flex justify-between items-start">
                     <div>
                       <p className="text-gray-500 text-xs sm:text-sm">{card?.title ?? ''}</p>
                       <h3 className="text-lg sm:text-xl md:text-2xl font-bold mt-1">{card?.value ?? ''}</h3>
                       <p className={`${card?.textColor ?? 'text-gray-500'} text-xs sm:text-sm mt-1 md:mt-2 flex items-center`}>
                         <span className="material-symbols-outlined text-xs sm:text-sm mr-1">
                           {card?.change?.startsWith('+') ? 'trending_up' : 'trending_down'}
                         </span>
                         {card?.change ?? ''}
                       </p>
                     </div>
                     <div className={`h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-full ${card?.color ?? 'bg-gray-100'} flex items-center justify-center`}>{card?.icon}</div>
                   </div>
                 </div>
               ))}
             </div>
  );
};

export default StatBox;
