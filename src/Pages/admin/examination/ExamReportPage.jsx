import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../Sidebar";
import Header from "../../../components/comman_components/Header";
import ReportHeading from "../../../components/comman_components/ReportHeading";
import CommonTable from "../../../components/tables/CommonTable";
import ClassWiseReport from "../../../components/examanitaion/ClassWiseReport";
import SubjectWiseReport from "../../../components/examanitaion/SubjectWiseReport";
import StudentWiseList from "../../../components/examanitaion/StudentWiseList";
import { toast } from "react-toastify";
import {
  getExamTermDropdown,
  getExamDropdown,
  getExamScheduleByExam,
  getPublishedFailedStudentsByEvent,
} from "../../../helper/requests-method/apiMethods";

const REPORT_PAGE_TABS = {
  REPORT_MENU: "report-menu",
  FAIL_STUDENTS: "fail-students",
};

const normalizeArray = (value) => (Array.isArray(value) ? value : []);

const getTermLabel = (term) => term?.term_name || term?.name || term?.title || "Term";

const getExamLabel = (exam) => exam?.exam_name || exam?.name || exam?.title || "Exam";

const formatNumber = (value) => {
  if (value === null || value === undefined || value === "") return "N/A";
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue.toFixed(2) : String(value);
};

const formatDateTime = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const ExamReportPage = () => {
  const [activeTab, setActiveTab] = useState(REPORT_PAGE_TABS.REPORT_MENU);
  const [selectedReport, setSelectedReport] = useState(null);

  const [examTerms, setExamTerms] = useState([]);
  const [selectedTermId, setSelectedTermId] = useState("");
  const [examOptions, setExamOptions] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState("");
  const [eventIds, setEventIds] = useState([]);
  const [failedStudents, setFailedStudents] = useState([]);

  const [loadingTerms, setLoadingTerms] = useState(false);
  const [loadingExamOptions, setLoadingExamOptions] = useState(false);
  const [loadingFailedStudents, setLoadingFailedStudents] = useState(false);

  const selectedEventId = useMemo(() => {
    const numeric = Number(eventIds?.[0]);
    return Number.isFinite(numeric) && numeric > 0 ? numeric : null;
  }, [eventIds]);

  const failedStudentsColumns = useMemo(
    () => [
      { key: "roll_number", header: "Roll No" },
      { key: "student_name", header: "Student Name" },
      {
        key: "total_marks",
        header: "Total / Max",
        render: (_value, item) => `${formatNumber(item?.total_marks)} / ${formatNumber(item?.max_marks)}`,
      },
      {
        key: "percentage",
        header: "Percentage",
        render: (value) => `${formatNumber(value)}%`,
      },
      { key: "grade", header: "Grade" },
      { key: "rank", header: "Rank" },
      {
        key: "published_at",
        header: "Published At",
        render: (value) => formatDateTime(value),
      },
    ],
    []
  );

  useEffect(() => {
    const loadTerms = async () => {
      try {
        setLoadingTerms(true);
        const response = await getExamTermDropdown();
        setExamTerms(normalizeArray(response?.data));
      } catch (error) {
        console.error(error);
        toast.error("Failed to load exam terms");
      } finally {
        setLoadingTerms(false);
      }
    };

    loadTerms();
  }, []);

  const handleReportClick = (reportType) => {
    setSelectedReport(reportType);
  };

  const handleBackToMenu = () => {
    setSelectedReport(null);
  };

  const handleTermChange = async (termId) => {
    const normalizedTermId = String(termId || "");
    setSelectedTermId(normalizedTermId);
    setSelectedExamId("");
    setExamOptions([]);
    setEventIds([]);
    setFailedStudents([]);

    if (!normalizedTermId) return;

    try {
      setLoadingExamOptions(true);
      const examsResp = await getExamDropdown(normalizedTermId);
      setExamOptions(normalizeArray(examsResp?.data));
    } catch (error) {
      console.error(error);
      toast.error("Failed to load exams for selected term");
    } finally {
      setLoadingExamOptions(false);
    }
  };

  const handleExamChange = async (examId) => {
    const normalizedExamId = String(examId || "");
    setSelectedExamId(normalizedExamId);
    setFailedStudents([]);
    setEventIds([]);

    if (!normalizedExamId) return;

    try {
      setLoadingExamOptions(true);
      const scheduleResp = await getExamScheduleByExam(normalizedExamId);
      const eventIdSet = new Set(
        normalizeArray(scheduleResp?.data)
          .map((item) => Number(item?.exam_event_id ?? item?.id ?? item?.exam_schedule_id ?? item?.uuid))
          .filter((item) => Number.isFinite(item) && item > 0)
      );
      setEventIds(Array.from(eventIdSet));
    } catch (error) {
      console.error(error);
      toast.error("Failed to load exam schedule");
    } finally {
      setLoadingExamOptions(false);
    }
  };

  const handleLoadFailedStudents = async () => {
    if (!selectedTermId) {
      toast.warning("Please select exam term first");
      return;
    }

    if (!selectedExamId) {
      toast.warning("Please select exam name first");
      return;
    }

    if (!selectedEventId) {
      toast.warning("No valid exam event found for selected exam");
      return;
    }

    try {
      setLoadingFailedStudents(true);
      const response = await getPublishedFailedStudentsByEvent({
        examEventId: selectedEventId,
      });

      const payload = response?.data?.data || response?.data || {};
      const failedRows = normalizeArray(payload?.failed_students).map((studentItem) => ({
        id: studentItem?.result_id || studentItem?.student_id,
        result_id: studentItem?.result_id,
        student_id: studentItem?.student_id,
        student_name: studentItem?.student_name || "N/A",
        roll_number: studentItem?.roll_number || "N/A",
        total_marks: studentItem?.total_marks,
        max_marks: studentItem?.max_marks,
        percentage: studentItem?.percentage,
        grade: studentItem?.grade || "N/A",
        rank: studentItem?.rank ?? "N/A",
        published_at: studentItem?.published_at,
      }));

      setFailedStudents(failedRows);
      if (!failedRows.length) {
        toast.info("No failed students found for selected exam");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load failed students report");
    } finally {
      setLoadingFailedStudents(false);
    }
  };

  return (
    <div className="bg-slate-200 flex AddStudent">
      <Sidebar />

      <div
        className=" overflow-auto relative z-1 flex-col"
        style={{
          height: "95vh",
          width: "100vw",
          gap: "10px",
          display: "flex",
          transition: "margin-left 0.3s ease",
        }}
      >
        <Header />

        <main className="w-full p-4">
          <div className="px-5 mb-4">
            <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 inline-flex gap-2">
              <button
                onClick={() => setActiveTab(REPORT_PAGE_TABS.REPORT_MENU)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === REPORT_PAGE_TABS.REPORT_MENU
                    ? "bg-violet-600 text-white"
                    : "bg-violet-50 text-violet-700 hover:bg-violet-100"
                }`}
              >
                Reports Menu
              </button>
              <button
                onClick={() => {
                  setActiveTab(REPORT_PAGE_TABS.FAIL_STUDENTS);
                  setSelectedReport(null);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === REPORT_PAGE_TABS.FAIL_STUDENTS
                    ? "bg-violet-600 text-white"
                    : "bg-violet-50 text-violet-700 hover:bg-violet-100"
                }`}
              >
                Fail Students
              </button>
            </div>
          </div>

          {activeTab === REPORT_PAGE_TABS.REPORT_MENU ? (
            !selectedReport ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-5">
                <div onClick={() => handleReportClick("classwise")} className="cursor-pointer">
                  <ReportHeading mainheading="Class Wise Report" subhading="class section wise" />
                </div>
                <div onClick={() => handleReportClick("subjectwise")} className="cursor-pointer">
                  <ReportHeading mainheading="Subject Wise Report" subhading="class section wise" />
                </div>
                <div onClick={() => handleReportClick("studentwise")} className="cursor-pointer">
                  <ReportHeading
                    mainheading="Student Wise List"
                    subhading="View all students by class"
                  />
                </div>
              </div>
            ) : (
              <div className="px-5">
                <button
                  onClick={handleBackToMenu}
                  className="mb-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  ← Back to Reports Menu
                </button>

                {selectedReport === "classwise" && <ClassWiseReport />}
                {selectedReport === "subjectwise" && <SubjectWiseReport />}
                {selectedReport === "studentwise" && <StudentWiseList />}
              </div>
            )
          ) : (
            <div className="px-5 space-y-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h2 className="text-lg font-semibold text-slate-800 mb-4">Failed Students Report</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Exam Term</label>
                    <select
                      value={selectedTermId}
                      onChange={(e) => handleTermChange(e.target.value)}
                      disabled={loadingTerms}
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all outline-none"
                    >
                      <option value="">Select exam term</option>
                      {examTerms.map((term) => {
                        const termKey = term?.id || term?.term_id || term?.uuid;
                        return (
                          <option key={termKey} value={termKey}>
                            {getTermLabel(term)}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Exam Name</label>
                    <select
                      value={selectedExamId}
                      onChange={(e) => handleExamChange(e.target.value)}
                      disabled={!selectedTermId || loadingExamOptions}
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all outline-none"
                    >
                      <option value="">{selectedTermId ? "Select exam name" : "Select term first"}</option>
                      {examOptions.map((exam) => {
                        const examKey = exam?.id || exam?.exam_id || exam?.uuid;
                        return (
                          <option key={examKey} value={examKey}>
                            {getExamLabel(exam)}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={handleLoadFailedStudents}
                      disabled={!selectedExamId || loadingFailedStudents || loadingExamOptions}
                      className="w-full px-4 py-2.5 rounded-lg bg-violet-600 text-white font-semibold hover:bg-violet-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      {loadingFailedStudents ? "Loading..." : "Show Failed Students"}
                    </button>
                  </div>
                </div>

                <div className="mt-4 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg p-3">
                  {selectedEventId
                    ? `Using exam event id: ${selectedEventId}`
                    : "Select exam term and exam name to fetch failed students"}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 className="text-base font-semibold text-slate-800 mb-3">Failed Students List</h3>

                {loadingFailedStudents ? (
                  <div className="py-8 flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
                  </div>
                ) : failedStudents.length > 0 ? (
                  <CommonTable
                    title="Failed Students"
                    columns={failedStudentsColumns}
                    data={failedStudents}
                    searchPlaceholder="Search failed students..."
                    exportFileName="failed_students"
                    itemsPerPage={10}
                    enableSearch={true}
                    enablePagination={true}
                    enableExport={true}
                    enableAdd={false}
                    enableEdit={false}
                    enableDelete={false}
                    enableView={false}
                    loading={loadingFailedStudents}
                  />
                ) : (
                  <p className="text-sm text-gray-500 py-6 text-center">
                    No data loaded. Select exam term and exam name, then click Show Failed Students.
                  </p>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ExamReportPage;
