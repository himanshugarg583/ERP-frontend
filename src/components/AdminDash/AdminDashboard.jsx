import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import StatBox from "./StatBox";
// import { tokens } from "../../theme";
// import { mockTransactions } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import { mockTransactions } from "./mockData";
import LineChart from "./LineChart";
import EarningsPieChart from "./EarningsPieChart";
import IncomeExpenseLineChart from "./IncomeExpenseChart";
import FeesPiechart from "./FeesPiechart";
import ClassAttendanceBarChart from "./ClassAttendanceBarChart";
import AnnouncementList from "./AnnouncementList";
import TeacherAttendance from "./TeacherAttendance";
import { WidthFull } from "@mui/icons-material";
const AdminDashboard = () => {


  return (
   
     
    <Box>
      <div className="bg-slate-200 min-h-screen">
        <div className="max-w-full mx-auto px-4 md:px-6 py-4">
          <StatBox />

          <div className="grid grid-cols-12 gap-6">
            {/* Row 1: 50/50 */}
            <div className="col-span-12 lg:col-span-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-0 h-full min-h-[420px]">
                <IncomeExpenseLineChart />
              </div>
            </div>
            <div className="col-span-12 lg:col-span-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-0 h-full min-h-[420px] flex">
                <AnnouncementList />
              </div>
            </div>

            {/* Row 2: 50/50 */}
            <div className="col-span-12 lg:col-span-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-0 h-full min-h-[360px]">
                <LineChart />
              </div>
            </div>
            <div className="col-span-12 lg:col-span-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 h-full min-h-[360px] flex justify-center">
                <FeesPiechart />
              </div>
            </div>

            {/* Row 3: 50/50 */}
            <div className="col-span-12 lg:col-span-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-0 h-full min-h-[360px]">
                <ClassAttendanceBarChart />
              </div>
            </div>
            <div className="col-span-12 lg:col-span-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 h-full min-h-[360px] flex justify-center">
                <EarningsPieChart />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Box>
       
   

        
       

      
   
  );
};

export default AdminDashboard;
