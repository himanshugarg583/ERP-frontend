import { Box, Typography, useTheme } from "@mui/material";
import { FaUsers,FaCheckCircle,FaChartLine,FaClipboardList } from "react-icons/fa";
// import { tokens } from "../theme";
// import ProgressCircle from "./ProgressCircle";

const StatBox = ({ title, subtitle, icon, progress, increase }) => {
  // const theme = useTheme();
  // const colors = tokens(theme.palette.mode);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
      {[
        { title: 'Total Students', value: '1156', change: '+2.5%', icon: <FaUsers />, chip: 'bg-violet-100 text-violet-600' },
        { title: 'Total Teacher', value: '94', change: '-1.2%', icon: <FaCheckCircle />, chip: 'bg-emerald-100 text-emerald-600' },
        { title: 'Male Student', value: '810', change: '+0.5', icon: <FaChartLine />, chip: 'bg-sky-100 text-sky-600' },
        { title: 'Female Student', value: '220', change: '5 urgent', icon: <FaClipboardList />, chip: 'bg-amber-100 text-amber-600' },
      ].map((card) => (
        <div key={card.title} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between hover:shadow-md transition-all">
          <div>
            <p className="text-slate-500 text-sm font-medium">{card.title}</p>
            <h3 className="text-2xl font-bold mt-1 text-slate-900">{card.value}</h3>
            <p className="text-xs mt-2 flex items-center text-slate-500">
              <span className="material-symbols-outlined text-xs mr-1">{card.change?.startsWith('+') ? 'trending_up' : 'trending_down'}</span>
              {card.change}
            </p>
          </div>
          <div className={`h-12 w-12 rounded-full ${card.chip} flex items-center justify-center`}>{card.icon}</div>
        </div>
      ))}
    </div>
  );
};

export default StatBox;
