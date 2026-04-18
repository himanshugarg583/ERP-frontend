import React, { useEffect, useRef, useState } from "react";
import {
  LayoutDashboard,
  DollarSign,
  Users,
  Wallet,
  ClipboardCheck,
  BookOpen,
  GraduationCap,
  MessageSquare,
  Download,
  UserCog,
  Bus,
  Hotel,
  Boxes,
  Library,
  FileQuestion,
  Award,
  Settings2,
  User,
  ChevronRight,
  ChevronsRight,
  LogOut,
  X
} from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Admin.css";

const SIDEBAR_ITEMS = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    subItems: [{ name: "Dashboard", href: "/admin/dashboard" }],
  },
  {
    name: "Front Office",
    icon: Users,
    subItems: [
      { name: "Admission Enquiry", href: "/admin/admission-enquiry" },
    ],
  },
  {
    name: "Student Info",
    icon: GraduationCap,
    subItems: [
      { name: "Student Admission", href: "/admin/add-students" },
      { name: "Students Details", href: "/admin/students-details" },
      { name: "Student Reports", href: "/admin/student-reports" },
    ],
  },
  {
    name: "Income",
    icon: DollarSign,
    subItems: [
      { name: "Add Income", href: "/admin/add-income" },
    ],
  },
  {
    name: "Expense",
    icon: Wallet,
    subItems: [
      { name: "Add Expense", href: "/admin/add-expense" },
    ],
  },
  {
    name: "Fee Collection",
    icon: DollarSign,
    subItems: [
      { name: "Fee Head Management", href: "/admin/fee-head-management" },
      { name: "Fee Structure Management", href: "/admin/fee-structure-management" },
      { name: "Fee Assignment", href: "/admin/fee-assignment" },
      { name: "Student Fee Reports", href: "/admin/student-fee-reports" },
      { name: "Payment Received", href: "/admin/payment-received" },
      { name: "Fee Reports", href: "/admin/fee-reports" },
    ],
  },
  {
    name: "Attendance",
    icon: ClipboardCheck,
    subItems: [
      { name: "Student Attendance", href: "/admin/class-attendance" },
      { name: "Student Leave", href: "/admin/leave" },
      { name: "Attendance Report", href: "/admin/attendance-report" },
    ],
  },
  {
    name: "Academics",
    icon: BookOpen,
    subItems: [
      { name: "Add Class", href: "/admin/add-class" },
      { name: "Add Subject", href: "/admin/add-subject" },
      { name: "Add Class Teacher", href: "/admin/assign-class" },
      { name: "Class Time Table", href: "/admin/class-time-table-page" },
      { name: "Teacher Time Table", href: "/admin/teacher-time-table-page" },
    ],
  },
  {
    name: "Examination",
    icon: Award,
    subItems: [
      { name: "Exam Term", href: "/admin/term-list-page" },
      { name: "Exam List", href: "/admin/exam-list-page" },
      { name: "Mark Register", href: "/admin/marks-register-page" },
      { name: "Mark Attendance", href: "/admin/mark-attendance-page" },
      { name: "Publish Result", href: "/admin/publish-result-page" },
      { name: "Admit Card", href: "/admin/admit-card-page" },
      { name: "Exam Timetable", href: "/admin/exam-time-table-page" },
      { name: "View Exam Timetable", href: "/admin/view-exam-time-table-page" },
      { name: "Report Card", href: "/admin/report-card-generator" },
      { name: "Examination Report", href: "/admin/examination-report" },
    ],
  },
  {
    name: "Transport",
    icon: Bus,
    subItems: [
      { name: "Transport Module", href: "/admin/transport" },
    ],
  },
  {
    name: "Hostel",
    icon: Hotel,
    subItems: [
      { name: "Hostel Module", href: "/admin/hostel" },
    ],
  },
  {
    name: "Inventory",
    icon: Boxes,
    subItems: [
      { name: "Inventory Module", href: "/admin/inventory" },
    ],
  },
  {
    name: "Library",
    icon: Library,
    subItems: [
      { name: "Library Module", href: "/admin/library" },
    ],
  },
  {
    name: "Communication",
    icon: MessageSquare,
    subItems: [
      { name: "Notices", href: "/admin/notes" },
    ],
  },
  {
    name: "Download Center",
    icon: Download,
    subItems: [
      { name: "Upload Content", href: "/admin/upload-content" },
      { name: "Assignment", href: "/admin/assignment" },
    ],
  },
  {
    name: "Human Resource",
    icon: UserCog,
    subItems: [
      { name: "Teacher Management", href: "/admin/teacher-management" },
      { name: "HR Reports", href: "/admin/hr-reports" },
    ],
  },
  {
    name: "Certificates",
    icon: Award,
    subItems: [
      { name: "Student Id Card", href: "/admin/student-id-page" },
      { name: "Staff Id Card", href: "/admin/staff-id-card" },
    ],
  },
  {
    name: "Setting",
    icon: Settings2,
    subItems: [
      { name: "School Times", href: "/admin/settings/school-times" },
      { name: "Class Period", href: "/admin/settings/class-period" },
      { name: "Template", href: "/admin/settings/template" },
      { name: "Reports", href: "/admin/settings/reports" },
    ],
  },
  {
    name: "Profile",
    icon: User,
    subItems: [
      { name: "My Profile", href: "/admin/profile" },
    ],
  },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebar:isOpen');
    return saved ? JSON.parse(saved) : true;
  });
  const [openDropdown, setOpenDropdown] = useState(() => {
    const saved = localStorage.getItem('sidebar:openDropdown');
    if (saved) return saved || null;
    const parent = SIDEBAR_ITEMS.find(
      (item) =>
        item.subItems &&
        item.subItems.length > 1 &&
        item.subItems.some((s) => s.href === window.location.pathname)
    );
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

  useEffect(() => {
    const parent = SIDEBAR_ITEMS.find(
      (item) =>
        item.subItems &&
        item.subItems.length > 1 &&
        item.subItems.some((s) => s.href === location.pathname)
    );
    const next = parent ? parent.name : null;
    setOpenDropdown(next);
    localStorage.setItem('sidebar:openDropdown', next || '');
  }, [location.pathname]);

  const restoreScroll = () => {
    const savedScroll = Number(localStorage.getItem('sidebar:scrollTop') || 0);
    if (navRef.current) {
      navRef.current.scrollTop = savedScroll;
    }
  };

  useEffect(() => {
    requestAnimationFrame(restoreScroll);
  }, []);

  useEffect(() => {
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

  const handleMenuItemClick = (item) => {
    const subItems = Array.isArray(item?.subItems) ? item.subItems : [];

    if (subItems.length === 1 && subItems[0]?.href) {
      persistScroll();
      navigate(subItems[0].href);
      return;
    }

    if (subItems.length > 1) {
      if (!isSidebarOpen && isMobile) {
        setIsSidebarOpen(true);
      }
      const next = openDropdown === item.name ? null : item.name;
      setOpenDropdown(next);
      localStorage.setItem('sidebar:openDropdown', next || '');
    }
  };

  const toggleSidebar = () => {
    const next = !isSidebarOpen;
    setIsSidebarOpen(next);
    localStorage.setItem('sidebar:isOpen', JSON.stringify(next));
  };

  return (
    <div className="relative shrink-0">
      {/* Mobile overlay */}
      {isMobile && isSidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-10 bg-black/50 backdrop-blur-sm"
        />
      )}

      <motion.aside
        className={`relative transition-all duration-300 ease-in-out ${isMobile ? "fixed left-0 top-0 h-full z-20" : "h-screen"
          }`}
        animate={{ width: isSidebarOpen ? 288 : 80 }}
        transition={{ type: 'tween', duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="h-full bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 text-white px-4 py-4 flex flex-col border-r border-slate-700/50 overflow-visible shadow-2xl">
          {/* Header: Logo */}
          <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                  >
                    <h2 className="text-lg font-bold bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                      EduManage
                    </h2>
                    <p className="text-xs text-slate-400">Admin Panel</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {isMobile && isSidebarOpen && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsSidebarOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            )}
          </div>

          {/* Sidebar Navigation */}
          <nav
            className="mt-4 grow overflow-y-auto space-y-1.5 custom-scrollbar"
            ref={navRef}
            onScroll={persistScroll}
          >
            {SIDEBAR_ITEMS.map((item) => {
              const Icon = item.icon;
              const subItems = Array.isArray(item.subItems) ? item.subItems : [];
              const hasMultipleSubItems = subItems.length > 1;
              const isActive = subItems.some((sub) => sub.href === location.pathname);
              const isOpen = openDropdown === item.name;

              return (
                <div key={item.name}>
                  <motion.div
                    whileHover={{ x: isSidebarOpen ? 4 : 0 }}
                    className="cursor-pointer"
                    onClick={() => handleMenuItemClick(item)}
                  >
                    <div
                      className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${isActive
                          ? 'bg-linear-to-r from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/30'
                          : 'hover:bg-slate-700/50'
                        }`}
                      onMouseEnter={(e) => showCollapsedTooltip(e, item.name)}
                      onMouseLeave={hideCollapsedTooltip}
                    >
                      <div className={`flex items-center justify-center w-9 h-9 rounded-lg transition-all ${isActive ? 'bg-white/20' : 'bg-slate-700/50 group-hover:bg-slate-700'
                        }`}>
                        <Icon className="w-5 h-5" />
                      </div>

                      <AnimatePresence>
                        {isSidebarOpen && (
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="flex-1 flex items-center justify-between"
                          >
                            <span className="font-medium text-sm">{item.name}</span>
                            {hasMultipleSubItems && (
                              <motion.div
                                animate={{ rotate: isOpen ? 90 : 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                              </motion.div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>

                  {/* Dropdown Items */}
                  <AnimatePresence initial={false}>
                    {hasMultipleSubItems && isOpen && isSidebarOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-6 mt-1 space-y-1 border-l-2 border-slate-700/50 pl-4"
                      >
                        {subItems.map((subItem) => {
                          const isSubActive = location.pathname === subItem.href;

                          return (
                            <Link key={subItem.href} to={subItem.href} onClick={persistScroll}>
                              <motion.div
                                whileHover={{ x: 4 }}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${isSubActive
                                    ? 'bg-indigo-600/20 text-indigo-300 font-medium'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-700/30'
                                  }`}
                              >
                                <ChevronsRight className="w-3.5 h-3.5 shrink-0" />
                                <span className="truncate">{subItem.name}</span>
                              </motion.div>
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="mt-auto pt-4 border-t border-slate-700/50">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                logout();
                navigate('/login', { replace: true });
              }}
              className={`group flex items-center gap-3 w-full px-3 py-2.5 rounded-xl bg-red-600/10 hover:bg-red-600/20 border border-red-600/20 hover:border-red-600/40 transition-all cursor-pointer ${!isSidebarOpen ? 'justify-center' : ''
                }`}
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-red-600/20 group-hover:bg-red-600/30 transition-all">
                <LogOut className="w-5 h-5 text-red-400" />
              </div>
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="font-medium text-sm text-red-400"
                  >
                    Logout
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Toggle Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleSidebar}
          className="absolute -right-4 top-20 z-20 w-8 h-8 rounded-full bg-linear-to-r from-indigo-600 to-purple-600 shadow-lg flex items-center justify-center text-white cursor-pointer"
        >
          <motion.div
            animate={{ rotate: isSidebarOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="w-4 h-4" />
          </motion.div>
        </motion.button>

        {/* Tooltip for collapsed mode */}
        {tooltip.visible && !isSidebarOpen && (
          <div
            className="fixed z-50 bg-slate-800 text-white text-sm rounded-lg px-3 py-2 shadow-xl border border-slate-700"
            style={{ top: tooltip.top, left: tooltip.left, transform: 'translateY(-50%)' }}
          >
            {tooltip.text}
          </div>
        )}
      </motion.aside>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(51, 65, 85, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.7);
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
