import React, { useEffect, useState } from "react";
import { BarChart2, Coins, Menu, TicketPlus, Users, WalletCards, Ticket, ChevronRight, Circle,ChevronsRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { href, Link } from "react-router-dom";
import './Admin.css'
const SIDEBAR_ITEMS = [
  { name: "Dashboard", icon: BarChart2, 
    subItems:[{name:"dashboard",href:"/AdminDashboardPage"}]
     },
  
  { 
    name: "Front Office", 
    icon: Coins, 
    subItems: [{ name: "Admission Enquiry", href: "/AdmissionEnquiry", icon: ChevronsRight }] 
  },

  { 
    name: "Student info",
     icon: Users,
    subItems: [{ name: "Student Admission", href: "/AddStudents" },{ name: "Student_Crediential", href: "/Student_Crediential" },  { name: "Student Reports", href: "/StudentReports" },
]   },
  { 
    name: "Income", 
    icon: Coins, 
    subItems: [
      { name: "Add Income", href: "/AddIncome", icon: ChevronsRight  }, 
      { name: "Income Head", href: "/IncomeHead", icon: ChevronsRight  }
    ] 
  },
  { 
    name: "Expense", 
    icon: WalletCards, 
    subItems: [
      { name: "Add Expense", href: "/AddExpense", icon: Circle }, 
      { name: "Expense Head", href: "/ExpenseHead", icon: Circle }
    ] 
  },
  { 
    name: "Fee Collection", 
    icon: Users, 
    subItems: [
        { name: "Payment Receipt", href: "/PaymentReceipt" },
        { name: "Demand Notice", href: "/DemandNotice" },
        { name: "Fee Discount", href: "/FeeDiscountPage" },
        { name: "Cheque", href: "/ChequePage" },
        { name: "Fee Reports", href: "/FeeReports" }
    ] 
  },
  { 
    name: "Attendance", 
    icon: TicketPlus, 
    subItems: [
      { name: "Student Attendance", href: "/ClassAttendance" },
      { name: "Student Leave", href: "/leave", icon: Circle }, 
      { name: "Attendance Report", href: "/AttendanceReport", icon: Circle }

    ] 
  },
  { 
    name: "Academics", 
    icon: Ticket, 
    subItems: [
        { name: "Add Class", href: "/AddClass" },
        { name: "Add Subject", href: "/AddSubject" },
        { name: "Add Class Teacher", href: "/AssignClass" },
        { name: "Class Time Table", href: "/ClassTimeTablePage" },
        { name: "Teacher Time Table", href: "/TeacherTimeTablePage" },
        
    ] 
  },
  { 
    name: "Examination", 
    icon: WalletCards, 
    subItems: [
        { name: "Exam List", href: "/TermListPage" },
        { name: "Exam timetable", href: "/ExamTimeTable" },
        { name: "Admit Card", href: "/AdmitCardPage" },
        { name: "Marks Register", href: "/MarksRegisterPage" },
        { name: "Report Card", href: "/ReportCardPage" },
        // { name: "ExamAttendance", href: "/ExamAttendancePage" },
        { name: "Examnation Report", href: "/ExamReportPage" }
          
                 
    ] 
  },
  { 
    name: "Communication", 
    icon: Users, 
    subItems: [
        { name: "Events", href: "/EventPage" }
    ] 
  },
  
  { 
    name: "Teacher Info", 
    icon: TicketPlus, 
    subItems: [
        { name: "Add Teacher", href: "/AddTeacher" },
        // { name: "Class Time Table", href: "/TcPage" },
        // { name: "Teacher Time Table", href: "/IncomeHead" },
        // { name: "Subject", href: "/StudentIdPage" },
        // { name: "Assign Subject", href: "/IncomeHead" },
        // { name: "Assign Class Teacher", href: "/AssignClass"}
    ] 
  },
 
  { 
    name: "Download Center", 
    icon: WalletCards, 
    subItems: [
        { name: "Upload Content", href: "/UploadContent" },
        { name: "Study Material", href: "/StudyMaterial" }
    ] 
  },
  { 
    name: "Human Resource", 
    icon: Users, 
    subItems: [
        { name: "Teacher Management", href: "/TeacherManagement" },
        { name: "Teacher Credentials", href: "/TeacherCredentials" },
        { name: "HR Reports", href: "/HRReports" },
        { name: "Add Accontant", href: "/AddAccontantPage" },
        { name: "Add Staff", href: "/AddStaff" },
        { name: "Add Librarian", href: "/AddLibrarian" },
        // { name: "Payroll", href: "/Payroll" },
    ] 
  },

  { 
    name: "Certificates", 
    icon: TicketPlus, 
    subItems: [
        { name: "Student TC", href: "/TcPage" },
        { name: "Staff Certificate", href: "/IncomeHead" },
        { name: "Student Id Card", href: "/StudentIdPage" },
        { name: "Staff Id Card", href: "/IncomeHead" }
    ] 
  },

];

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setIsSidebarOpen(!isMobile); // Close sidebar on mobile
  }, [isMobile]);

  return (
    <motion.div
      className={`relative transition-all duration-300 ease-in-out flex-shrink-0 ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
      animate={{ width: isSidebarOpen ? 220 : 80 }}
    >
      <div className="h-screen bg-gray-800 text-white p-4 flex flex-col border-r border-gray-700 overflow-hidden">
        {/* Sidebar Toggle Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
        >
          <Menu size={26} />
        </motion.button>

        {/* Sidebar Navigation with Scrollbar */}
        <nav className="mt-4 flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          {SIDEBAR_ITEMS.map((item) => (
            <div key={item.name}>
              <motion.div
                className="flex items-center justify-between p-3 text-sm rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                onClick={() => item.subItems && setOpenDropdown(openDropdown === item.name ? null : item.name)}
              >
             
                <div className="flex items-center">
                  <item.icon size={20} className="text-white min-w-[20px]" />
                  <AnimatePresence>
                    {isSidebarOpen && (
                      <motion.span
                        className="ml-4 whitespace-nowrap"
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                {item.subItems && (
                  <motion.div
                    animate={{ rotate: openDropdown === item.name ? 90 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronRight size={16} />
                  </motion.div>
                )}
              </motion.div>

              {/* Dropdown Items */}
              <AnimatePresence>
                {item.subItems && openDropdown === item.name && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="pl-8 overflow-hidden"
                  >
                    {item.subItems.map((subItem) => (
                      <Link key={subItem.href} to={subItem.href}>
                        <motion.div
                          className="flex items-center p-2 text-sm rounded-lg hover:bg-gray-600 transition-colors cursor-pointer  subitems"  
                        >
                          {/* <subItem.icon size={16} className="text-gray-400 min-w-[16px]" /> */}
                          <ChevronsRight size={16} className="text-gray-400 min-w-[16px]" />
                          <AnimatePresence>
                            {isSidebarOpen && (
                              <motion.span
                                className="ml-4 whitespace-nowrap"
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: "auto" }}
                                exit={{ opacity: 0, width: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                {subItem.name}
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>
      </div>
    </motion.div>
  );
};

export default Sidebar;
