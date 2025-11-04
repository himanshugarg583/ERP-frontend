import React, { useEffect, useRef, useState } from "react";
import {
  BarChart2,
  Coins,
  TicketPlus,
  Users,
  WalletCards,
  Ticket,
  ChevronRight,
  Circle,
  ChevronsRight,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import "./Admin.css";
const SIDEBAR_ITEMS = [
  {
    name: "Dashboard",
    icon: BarChart2,
    subItems: [{ name: "dashboard", href: "/AdminDashboardPage" }],
  },

  {
    name: "Front Office",
    icon: Coins,
    subItems: [
      {
        name: "Admission Enquiry",
        href: "/AdmissionEnquiry",
        icon: ChevronsRight,
      },
    ],
  },

  {
    name: "Student info",
    icon: Users,
    subItems: [
      { name: "Student Admission", href: "/AddStudents" },
      { name: "Student_Crediential", href: "/Student_Crediential" },
      { name: "Student Reports", href: "/StudentReports" },
    ],
  },
  {
    name: "Income",
    icon: Coins,
    subItems: [
      { name: "Add Income", href: "/AddIncome", icon: ChevronsRight },
      { name: "Income Head", href: "/IncomeHead", icon: ChevronsRight },
    ],
  },
  {
    name: "Expense",
    icon: WalletCards,
    subItems: [
      { name: "Add Expense", href: "/AddExpense", icon: Circle },
      { name: "Expense Head", href: "/ExpenseHead", icon: Circle },
    ],
  },
  {
    name: "Fee Collection",
    icon: Users,
    subItems: [
      { name: "Payment Receipt", href: "/PaymentReceipt" },
      { name: "Demand Notice", href: "/DemandNotice" },
      { name: "Fee Discount", href: "/FeeDiscountPage" },
      { name: "Cheque", href: "/ChequePage" },
      { name: "Fee Reports", href: "/FeeReports" },
    ],
  },
  {
    name: "Attendance",
    icon: TicketPlus,
    subItems: [
      { name: "Student Attendance", href: "/ClassAttendance" },
      { name: "Student Leave", href: "/leave", icon: Circle },
      { name: "Attendance Report", href: "/AttendanceReport", icon: Circle },
    ],
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
    ],
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
      { name: "Examnation Report", href: "/ExamReportPage" },
    ],
  },
  {
    name: "Communication",
    icon: Users,
    subItems: [{ name: "Events", href: "/EventPage" }],
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
    ],
  },

  {
    name: "Download Center",
    icon: WalletCards,
    subItems: [
      { name: "Upload Content", href: "/UploadContent" },
      { name: "Study Material", href: "/StudyMaterial" },
    ],
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
    ],
  },

  {
    name: "Certificates",
    icon: TicketPlus,
    subItems: [
      { name: "Student TC", href: "/TcPage" },
      { name: "Staff Certificate", href: "/StaffCertificate" },
      { name: "Student Id Card", href: "/StudentIdPage" },
      { name: "Staff Id Card", href: "/StaffIdCard" },
    ],
  },
];

const Sidebar = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebar:isOpen');
    return saved ? JSON.parse(saved) : true;
  });
  const [openDropdown, setOpenDropdown] = useState(() => {
    const saved = localStorage.getItem('sidebar:openDropdown');
    if (saved) return saved || null;
    const parent = SIDEBAR_ITEMS.find((item) => item.subItems && item.subItems.some((s) => s.href === window.location.pathname));
    return parent ? parent.name : null;
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [tooltip, setTooltip] = useState({ visible: false, text: '', top: 0, left: 0 });
  const navRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    } else {
      const saved = localStorage.getItem('sidebar:isOpen');
      setIsSidebarOpen(saved ? JSON.parse(saved) : true);
    }
  }, [isMobile]);

  // Keep parent dropdown open based on current route (without flicker)
  useEffect(() => {
    const parent = SIDEBAR_ITEMS.find((item) => item.subItems && item.subItems.some((s) => s.href === location.pathname));
    const next = parent ? parent.name : null;
    setOpenDropdown(next);
    localStorage.setItem('sidebar:openDropdown', next || '');
  }, [location.pathname]);

  // Restore sidebar scroll position on mount and after route change
  const restoreScroll = () => {
    const savedScroll = Number(localStorage.getItem('sidebar:scrollTop') || 0);
    if (navRef.current) {
      navRef.current.scrollTop = savedScroll;
    }
  };
  useEffect(() => {
    // initial
    requestAnimationFrame(restoreScroll);
  }, []);
  useEffect(() => {
    // after navigation content paints
    requestAnimationFrame(restoreScroll);
  }, [location.pathname]);

  const persistScroll = () => {
    if (navRef.current) {
      localStorage.setItem('sidebar:scrollTop', String(navRef.current.scrollTop));
    }
  };

  const showCollapsedTooltip = (e, text) => {
    if (isSidebarOpen) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({ visible: true, text, top: rect.top + rect.height / 2, left: rect.right + 12 });
  };
  const hideCollapsedTooltip = () => setTooltip((t) => ({ ...t, visible: false }));

  return (
    <div className="relative flex-shrink-0">
      {/* Mobile overlay */}
      {isMobile && isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm"
        />
      )}

      <motion.aside
        className={`relative z-40 transition-all duration-300 ease-in-out ${
          isMobile ? "fixed left-0 top-0 h-full" : "h-screen"
        } ${isSidebarOpen ? "w-72" : "w-20"}`}
        animate={{ width: isSidebarOpen ? 288 : 80 }}
        transition={{ type: 'tween', duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="h-full bg-slate-800 text-white px-4 py-3 flex flex-col border-r border-slate-700 overflow-visible shadow-2xl">
          {/* Header: Logo */}
          <div className="flex items-center justify-between gap-2 pb-2">
            <img
              src="/logo.jpg"
              alt="Logo"
              className="w-10 h-10 rounded-full shadow border border-white/20 ml-1"
            />
            {/* Collapse/expand button inside sidebar header */}
            {/* moved toggle to absolute half-outside button below */}
            <div className="w-9 h-9" />
          </div>

          {/* Sidebar Navigation without Scrollbar */}
          <nav
            className="mt-3 flex-grow overflow-y-auto border-t border-white/10 space-y-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            ref={navRef}
            onScroll={persistScroll}
          >
            {SIDEBAR_ITEMS.map((item) => (
              <div key={item.name}>
                <motion.div
                  className={`flex items-center justify-between text-sm cursor-pointer`}
                  onClick={() =>
                    item.subItems &&
                    (() => {
                      const next = openDropdown === item.name ? null : item.name;
                      setOpenDropdown(next);
                      localStorage.setItem('sidebar:openDropdown', next || '');
                    })()
                  }
                >
                  <div className={`flex items-center w-full ${isSidebarOpen ? '' : 'justify-center'}`}>
                    {/* Whole link card */}
                    <div className={`group relative flex items-center w-full bg-white text-slate-800 rounded-xl px-3 py-2 shadow-sm border hover:shadow hover:border-violet-500 transition ${
                      item.subItems && item.subItems.some((sub) => sub.href === location.pathname)
                        ? 'border-violet-600'
                        : 'border-slate-200'
                    } ${isSidebarOpen ? '' : 'px-0 py-0 justify-center'}`}>
                      <span onMouseEnter={(e)=>showCollapsedTooltip(e, item.name)} onMouseLeave={hideCollapsedTooltip} className={`flex items-center justify-center rounded-full w-9 h-9 min-w-[36px] flex-shrink-0 ${isSidebarOpen ? 'mr-3' : 'mr-0'} transition-all ring-0 group-hover:ring-4 group-hover:ring-violet-300 group-hover:ring-offset-2 group-hover:ring-offset-white ${
                        item.subItems && item.subItems.some((sub) => sub.href === location.pathname)
                          ? 'bg-violet-600 text-white'
                          : 'bg-slate-100 text-violet-600 group-hover:bg-violet-600 group-hover:text-white'
                      }`}>
                        <item.icon size={18} />
                      </span>
                      <AnimatePresence>
                        {isSidebarOpen && (
                          <motion.span
                            className="flex-1 font-semibold text-slate-800 group-hover:text-violet-700"
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -8 }}
                            transition={{ duration: 0.2 }}
                          >
                            {item.name}
                          </motion.span>
                        )}
                      </AnimatePresence>
                      {/* Removed inline tooltip to avoid clipping; using fixed tooltip */}
                      {item.subItems && isSidebarOpen && (
                        <motion.div
                          animate={{ rotate: openDropdown === item.name ? 90 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronRight size={16} className="text-slate-400 group-hover:text-violet-500" />
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Dropdown Items */}
                <AnimatePresence initial={false}>
                  {item.subItems && openDropdown === item.name && (
                    <motion.div
                      initial={false}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    className={`pl-6 overflow-visible space-y-2 pt-2 ${
                      isSidebarOpen ? "" : "hidden"
                    }`}
                    >
                      {item.subItems.map((subItem) => (
                      <Link key={subItem.href} to={subItem.href} className="block" onClick={persistScroll}>
                        <motion.div
                            className={`flex items-center text-sm rounded-lg cursor-pointer subitems py-0.5`}
                          >
                            <div className={`group flex items-center w-full bg-white rounded-xl px-3 py-2 shadow-sm border hover:shadow hover:border-violet-500 transition ${
                              location.pathname === subItem.href ? 'border-violet-600' : 'border-slate-200'
                            }`}>
                              <span className={`flex items-center justify-center rounded-full w-7 h-7 min-w-[28px] mr-3 transition-all ring-0 group-hover:ring-4 group-hover:ring-violet-300 group-hover:ring-offset-2 group-hover:ring-offset-white ${
                                location.pathname === subItem.href ? 'bg-violet-600 text-white' : 'bg-slate-100 text-violet-600 group-hover:bg-violet-600 group-hover:text-white'
                              }`}>
                                <ChevronsRight size={14} />
                              </span>
                              {isSidebarOpen && (
                                <span className={`font-medium ${location.pathname === subItem.href ? 'text-violet-700' : 'text-slate-700 group-hover:text-violet-700'}`}>{subItem.name}</span>
                              )}
                            </div>
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
              className={`group flex items-center gap-2 py-2 px-4 rounded-xl bg-white text-slate-800 font-semibold shadow hover:shadow-md border border-slate-200 hover:border-violet-500 transition-colors w-full ${isSidebarOpen ? '' : 'justify-center px-2'}`}
              style={{ minWidth: isSidebarOpen ? '100%' : '48px' }}
            >
              <span className="flex items-center justify-center rounded-full min-w-[32px] min-h-[32px] bg-slate-100 text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-all ring-0 group-hover:ring-4 group-hover:ring-violet-300 group-hover:ring-offset-2 group-hover:ring-offset-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
                </svg>
              </span>
              {isSidebarOpen && <span className="whitespace-nowrap group-hover:text-violet-700">Logout</span>}
            </button>
          </div>
        </div>
      {/* Absolute half-outside toggle (stays visible always) */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => { const next = !isSidebarOpen; setIsSidebarOpen(next); localStorage.setItem('sidebar:isOpen', JSON.stringify(next)); }}
        aria-label="Toggle sidebar"
        className={`absolute top-12 -right-3 z-50 w-10 h-10 rounded-full border border-white/20 shadow-xl bg-violet-600 text-white flex items-center justify-center cursor-pointer ${
          isMobile ? 'md:flex' : 'flex'
        }`}
      >
        {isSidebarOpen ? (
          <ChevronRight size={18} className="rotate-180" />
        ) : (
          <ChevronRight size={18} />
        )}
      </motion.button>
      {/* Fixed tooltip for collapsed mode */}
      {tooltip.visible && !isSidebarOpen && (
        <div
          className="pointer-events-none fixed z-[9999] bg-white text-slate-800 text-sm rounded-lg px-3 py-1 shadow-xl border border-slate-200"
          style={{ top: tooltip.top, left: tooltip.left, transform: 'translateY(-50%)' }}
        >
          {tooltip.text}
        </div>
      )}
      </motion.aside>
    </div>
  );
};

export default Sidebar;
