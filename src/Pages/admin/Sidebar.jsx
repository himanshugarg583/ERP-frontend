import React, { useEffect, useState } from "react";
import { BarChart2, Coins, Menu, TicketPlus, Users, WalletCards, Ticket, ChevronRight, Circle,ChevronsRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { href, Link, useLocation } from "react-router-dom";
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
  const location = useLocation();
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
  <div className="h-screen bg-gradient-to-br from-green-800 via-green-700 to-green-900 text-white p-4 flex flex-col border-r border-green-900 overflow-hidden shadow-xl">
        {/* Sidebar Toggle Button */}
        {/* Logo above menu button */}
        <div className="flex items-center justify-between gap-1 pb-2">
          <img src="/logo.jpg" alt="Logo" className="w-10 h-10 rounded-full shadow border border-white ml-1" />
          {/* Responsive toggle button */}
          {isMobile ? (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="w-8 h-8 rounded-full bg-white shadow border border-green-700 flex items-center justify-center mr-1"
            >
              <Menu size={16} className="text-green-700" />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="w-8 h-8 rounded-full bg-white shadow border border-green-700 flex items-center justify-center mr-1"
            >
              {isSidebarOpen ? <ChevronRight size={18} className="text-green-700" /> : <ChevronRight size={18} className="text-green-700 rotate-180" />}
            </motion.button>
          )}
        </div>

  {/* Sidebar Navigation without Scrollbar */}
  <nav className="mt-2 flex-grow overflow-y-auto border-t border-white/20" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {SIDEBAR_ITEMS.map((item) => (
            <div key={item.name}>
              <motion.div
                className={`flex items-center justify-between p-2 text-sm rounded-lg transition-colors cursor-pointer ${isSidebarOpen ? 'hover:bg-green-800' : 'hover:bg-green-900'} ${item.subItems && item.subItems.some(sub => sub.href === location.pathname) ? 'bg-green-900 shadow-lg' : ''}`}
                onClick={() => item.subItems && setOpenDropdown(openDropdown === item.name ? null : item.name)}
              >
                <div className="flex items-center">
                  <item.icon size={24} className="text-white min-w-[24px]" />
                  <AnimatePresence>
                    {isSidebarOpen && (
                      <motion.span
                        className="ml-4 whitespace-nowrap font-semibold text-base text-white"
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
                {item.subItems && isSidebarOpen && (
                  <motion.div
                    animate={{ rotate: openDropdown === item.name ? 90 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronRight size={16} className="text-cyan-400" />
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
                    className={`pl-8 overflow-hidden ${isSidebarOpen ? '' : 'hidden'}`}
                  >
                    {item.subItems.map((subItem) => (
                      <Link key={subItem.href} to={subItem.href}>
                        <motion.div
                          className={`flex items-center p-2 text-sm rounded-lg transition-colors cursor-pointer subitems ${location.pathname === subItem.href ? 'bg-green-900 shadow-lg' : 'hover:bg-green-900'}`}
                        >
                          {/* <subItem.icon size={16} className="text-gray-400 min-w-[16px]" /> */}
                          <ChevronsRight size={16} className="text-white min-w-[16px]" />
                          <AnimatePresence>
                            {isSidebarOpen && (
                              <motion.span
                                className="ml-4 whitespace-nowrap text-white font-semibold"
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
        <style>{`
          nav::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {/* Logout Button at Bottom */}
        <div className={`mt-auto pt-4 flex ${isSidebarOpen ? '' : 'justify-center'}`}>
          <button
            onClick={() => { window.location.href = '/login'; }}
            className={`flex items-center gap-2 py-2 px-4 rounded-lg bg-green-900 text-white font-semibold shadow hover:bg-green-800 transition-colors w-full ${isSidebarOpen ? '' : 'justify-center px-2'}`}
            style={{ minWidth: isSidebarOpen ? '100%' : '48px' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 min-w-[24px] text-white" style={{marginRight: isSidebarOpen ? '8px' : '0'}}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
            </svg>
            {isSidebarOpen && <span className="whitespace-nowrap text-white font-semibold">Logout</span>}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
