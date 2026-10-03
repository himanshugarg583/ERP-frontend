import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import Header from "../../../components/comman_components/Header";
import ReportHeading from "../../../components/comman_components/ReportHeading";

const HRReports = () => {
  const navigate = useNavigate();

  const reportCards = [
    {
      id: "staff-attendance",
      title: "STAFF ATTENDANCE REPORT",
      subtitle: "Staff Attendance Report",
      route: "/admin/hr/staff-attendance",
    },
    {
      id: "staff-custom-attendance",
      title: "STAFF CUSTOM ATTENDANCE REPORT",
      subtitle: "Staff Custom Attendance Report",
    },
    {
      id: "staff-leave",
      title: "STAFF LEAVE REPORT",
      subtitle: "Staff Leave Report",
    },
    {
      id: "payroll-report",
      title: "PAYROLL REPORT",
      subtitle: "Payroll Report",
      route: "/admin/hr/teacher-salary",
    },
    {
      id: "teacher-credentials",
      title: "TEACHER CREDENTIALS",
      subtitle: "View teacher login credentials",
      route: "/admin/hr/teacher-credentials",
    },
  ];

  const handleReportClick = (reportType) => {
    if (reportType) navigate(reportType);
  };

  return (
    <div className='bg-slate-200 flex AddStudent'>
      <Sidebar />
      <div className='overflow-auto relative z-1 flex-col' style={{
        height: '95vh',
        width: '100vw',
        gap: '10px',
        display: 'flex',
        transition: 'margin-left 0.3s ease'
      }}>
        <Header />
        <main className="w-full py-4 md:py-6 px-4 md:px-6 hr-report-page">
          <div className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 hr-report-grid">
              {reportCards.map((card) => (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => handleReportClick(card.route)}
                  className="text-left hr-report-card"
                >
                  <ReportHeading mainheading={card.title} subhading={card.subtitle} />
                </button>
              ))}
            </div>
          </div>
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');

            .hr-report-page {
              font-family: 'Sora', 'Segoe UI', sans-serif;
              background: radial-gradient(circle at 10% 10%, #fff7ed 0%, #f8fafc 35%),
                linear-gradient(120deg, #f8fafc 0%, #eef2ff 100%);
              border-radius: 24px;
              padding: 24px;
            }

            .hr-report-grid {
              gap: 24px;
            }

            .hr-report-card {
              animation: hrCardIn 420ms ease both;
            }

            .hr-report-card:nth-child(1) { animation-delay: 40ms; }
            .hr-report-card:nth-child(2) { animation-delay: 80ms; }
            .hr-report-card:nth-child(3) { animation-delay: 120ms; }
            .hr-report-card:nth-child(4) { animation-delay: 160ms; }
            .hr-report-card:nth-child(5) { animation-delay: 200ms; }
            .hr-report-card:nth-child(6) { animation-delay: 240ms; }

            .hr-report-card > div {
              border-radius: 18px;
              border: 1px solid #f3d6b3;
              background: linear-gradient(135deg, #fff7ed 0%, #ffffff 55%);
              box-shadow: 0 10px 24px rgba(148, 163, 184, 0.2);
              padding: 18px 20px;
              transition: transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease;
              position: relative;
              overflow: hidden;
              min-height: 120px;
            }

            .hr-report-card > div::after {
              content: '';
              position: absolute;
              inset: 0;
              background: radial-gradient(circle at 80% 0%, rgba(251, 146, 60, 0.16), transparent 55%);
              pointer-events: none;
            }

            .hr-report-card:hover > div {
              transform: translateY(-4px);
              box-shadow: 0 16px 30px rgba(148, 163, 184, 0.28);
              border-color: #f59e0b;
            }

            .hr-report-card > div img {
              border-radius: 9999px;
              background: #fde68a;
              padding: 6px;
              box-shadow: 0 6px 12px rgba(251, 191, 36, 0.25);
            }

            .hr-report-card > div h3 {
              color: #b45309 !important;
              letter-spacing: 0.08em;
              text-transform: uppercase;
              font-size: 0.9rem !important;
              min-height: 22px;
            }

            .hr-report-card > div p {
              color: #475569 !important;
              font-size: 0.95rem !important;
              min-height: 44px;
            }

            @keyframes hrCardIn {
              from { opacity: 0; transform: translateY(12px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </main>
      </div>
    </div>
  );
};

export default HRReports;
