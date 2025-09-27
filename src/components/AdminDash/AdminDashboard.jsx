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
   
     
    <Box >
        <Box
          gridColumn="span 3"
        
        
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox />
            
        </Box>
       {/* new box */}
       <div className="flex flex-col min-h-screen bg-gray-100 p-6 gap-6">
      {/* 1st Container */}
      <div className="flex flex-col md:flex-row w-full gap-6 ">
        <div className="flex-1 bg-white rounded-xl shadow-lg  hover:shadow-xl transition-shadow duration-300">
          <IncomeExpenseLineChart />
        </div>
        <div className="flex-1 bg-white rounded-xl shadow-lg  flex hover:shadow-xl transition-shadow duration-300">
          <AnnouncementList/>
        </div>
      </div>

      {/* 2nd Container */}
      <div className="flex flex-col md:flex-row-reverse w-full gap-6">
        <div className="flex-1 bg-white rounded-xl shadow-lg  hover:shadow-xl transition-shadow duration-300">
          <LineChart />
        </div>
        <div className="flex-1 bg-white rounded-xl shadow-lg  flex  justify-center hover:shadow-xl transition-shadow duration-300">
          <span className="text-gray-700 font-semibold text-lg flex  justify-center">
            <FeesPiechart/>
          
          </span>
        </div>
      </div>

      {/* 3rd Container */}
      <div className="flex flex-col md:flex-row w-full gap-6">
        <div className="flex-1 bg-white rounded-xl shadow-lg  hover:shadow-xl transition-shadow duration-300">
          <ClassAttendanceBarChart />
        </div>
        <div className="flex-1 bg-white rounded-xl shadow-lg  flex justify-center hover:shadow-xl transition-shadow duration-300">
          <EarningsPieChart/>
        </div>
      </div>
    </div>
       
   

        
       

      
    
</Box>
      
   
  );
};

export default AdminDashboard;
