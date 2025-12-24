// import React from "react";
// import { FaUser, FaHome, FaClipboardList, FaChartBar, FaBook, FaDollarSign, FaCheckCircle, FaCalendarAlt, FaBus } from 'react-icons/fa';
// const navItems = [
//   { label: 'Dashboard', icon: <FaHome /> },
//   { label: 'Profile', icon: <FaUser /> },
//   { label: 'Assignments', icon: <FaClipboardList /> },
//   { label: 'Results', icon: <FaChartBar /> },
//   { label: 'Timetable', icon: <FaBook /> },
//   { label: 'Progress Report', icon: <FaChartBar /> },
//   { label: 'Fees', icon: <FaDollarSign /> },
//   { label: 'Attendance', icon: <FaCheckCircle /> },
//   { label: 'Events', icon: <FaCalendarAlt /> },
//   { label: 'Transportation', icon: <FaBus /> }
// ];

// const Navbar = () => {
//   return (
//     <nav className="mt-2">
//       <ul>
//         {navItems.map((item, index) => (
//           <li key={index}>
//             <a
//               href={`#${item.label.toLowerCase().replace(/\s+/g, '-')}`}
//               className="flex items-center gap-3 px-6 py-4 text-gray-700 transition-all duration-200 hover:bg-indigo-50 hover:border-l-4 hover:border-indigo-700"
//             >
//               {item.icon}
//               <span className="font-medium">{item.label}</span>
//             </a>
//           </li>
//         ))}
//       </ul>
//     </nav>
//   );
// };

// export default Navbar;